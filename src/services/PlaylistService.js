import { nanoid } from 'nanoid'
import pkg from 'pg'
import NotFoundError from '../exceptions/NotFoundError.js'
import InvariantError from '../exceptions/InvariantError.js'
import { AuthorizationError } from '../exceptions/AuthError.js'
import SongService from './SongService.js'
import CollaborationService from './CollaborationService.js'
import ActivityService from './ActivityService.js'

const { Pool } = pkg

class PlaylistService {
  constructor () {
    this._pool = new Pool()
    this._songService = new SongService()
    this._activityService = new ActivityService()
    this._collabService = new CollaborationService()
  }

  async getActivities (playlistId) {
    const playlist = await this.getPlaylists(playlistId)
    const queryString = `SELECT u.username, s.title, psa.action, psa.created_at as time
      FROM playlist_song_activities psa
      JOIN users u ON u.id = psa.user_id
      JOIN songs s on s.id = psa.song_id
      WHERE psa.playlist_id = '${playlistId}'
      ORDER BY time asc`

    const { rows } = await this._pool.query(queryString)

    return { playlistId: playlist[0].id, activities: rows }
  }

  async checkPlaylistAccess (ownerId, playlistId) {
    try {
      await this.checkPlaylistOwner(playlistId, ownerId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      try {
        await this._collabService.checkCollaboration(playlistId, ownerId)
      } catch {
        throw error
      }
    }
  }

  async checkPlaylistOwner (id, ownerId) {
    const queryString = `SELECT id, owner_id FROM playlists WHERE id = '${id}'`

    const { rows, rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new NotFoundError('Playlist not found')
    }

    const playlist = rows[0]

    if (playlist.owner_id !== ownerId) {
      throw new AuthorizationError('You are not authorized to access this resource')
    }
  }

  async deletePlaylistSong (userId, songId, playlistId) {
    const queryString = `DELETE FROM playlist_songs WHERE song_id = '${songId}' AND playlist_id = '${playlistId}' RETURNING song_id`

    const { rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new NotFoundError('Song not found in playlist')
    }

    await this._activityService.deleteActivity(playlistId, userId, songId)
  }

  async getPlaylistSong (playlistId) {
    const queryPlaylist = `SELECT p.id, p.name, u.username
      FROM playlists p
      LEFT JOIN users u on p.owner_id = u.id
      WHERE p.id = '${playlistId}'`

    const querySong = `SELECT s.id, s.title, s.performer
      FROM playlist_songs ps
      JOIN songs s on ps.song_id = s.id
      WHERE playlist_id = '${playlistId}'`

    const resultPlaylist = await this._pool.query(queryPlaylist)
    const resultSongs = await this._pool.query(querySong)
    resultPlaylist.rows[0].songs = resultSongs.rows

    return { playlist: resultPlaylist.rows[0] }
  }

  async addPlaylistSong (userId, songId, playlistId) {
    const song = await this._songService.checkSong(songId)

    if (!song) {
      throw new NotFoundError('Song not found in database')
    }

    const id = `playlist-song-${nanoid(16)}`
    const date = new Date().toISOString()

    const queryString = `INSERT INTO playlist_songs VALUES('${id}', '${songId}', '${playlistId}', '${date}', '${date}') RETURNING id`

    const { rows } = await this._pool.query(queryString)

    if (!rows[0].id) {
      throw new InvariantError('Song cannot be added to playlist')
    }

    await this._activityService.addActivity(playlistId, userId, songId)
  }

  async addPlaylist (ownerId, data) {
    const playlistId = `playlist-${nanoid(16)}`
    const { name } = data
    const date = new Date().toISOString()

    const queryString = `INSERT INTO playlists VALUES('${playlistId}', '${ownerId}', '${name}', '${date}', '${date}') RETURNING id`

    const { rows } = await this._pool.query(queryString)

    if (!rows[0].id) {
      throw new InvariantError('Playlist cannot be added')
    }

    return rows[0].id
  }

  async getPlaylists (id) {
    const queryString = `SELECT p.id, p.name, u.username
      FROM playlists p
      LEFT JOIN collaborations c on c.playlist_id = p.id
      JOIN users u on u.id = p.owner_id
      WHERE p.owner_id = '${id}' OR p.id = '${id}' OR c.user_id = '${id}'`

    const { rows } = await this._pool.query(queryString)

    return rows
  }

  async deletePlaylistById (id) {
    const queryString = `DELETE FROM playlists WHERE id = '${id}' RETURNING id`

    const { rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new NotFoundError('Playlist not found. Cannot be deleted')
    }
  }
}

export default PlaylistService
