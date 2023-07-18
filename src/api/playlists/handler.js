import PlaylistService from '../../services/PlaylistService.js'
import PlaylistValidator from '../../validator/playlists/index.js'
import autoBind from 'auto-bind'

class PlaylistHandler {
  constructor () {
    this._service = new PlaylistService()
    this._validator = new PlaylistValidator()

    autoBind(this)
  }

  async getPlaylistActivityHandler (request, h) {
    const { id: ownerId } = request.auth.credentials
    const playlistId = request.params

    await this._service.checkPlaylistAccess(ownerId, playlistId.id)

    const activities = await this._service.getActivities(playlistId.id)
    const response = h.response({
      status: 'success',
      data: activities
    })
    response.code(200)
    return response
  }

  async deletePlaylistSongHandler (request, h) {
    const songIdValidated = this._validator.validatePlaylistSong(request.payload)

    const { id: ownerId } = request.auth.credentials
    const playlistId = request.params

    await this._service.checkPlaylistAccess(ownerId, playlistId.id)

    await this._service.deletePlaylistSong(ownerId, songIdValidated.songId, playlistId.id)

    const response = h.response({
      status: 'success',
      message: 'Song successfully deleted from playlist'
    })
    response.code(200)
    return response
  }

  async getPlaylistSongHandler (request, h) {
    const { id: ownerId } = request.auth.credentials

    const playlistId = request.params

    await this._service.checkPlaylistAccess(ownerId, playlistId.id)

    const result = await this._service.getPlaylistSong(playlistId.id)

    const response = h.response({
      status: 'success',
      data: result
    })
    response.code(200)
    return response
  }

  async postPlaylistSongHandler (request, h) {
    const songIdValidated = this._validator.validatePlaylistSong(request.payload)

    const { id: ownerId } = request.auth.credentials

    const playlistId = request.params

    await this._service.checkPlaylistAccess(ownerId, playlistId.id)

    await this._service.addPlaylistSong(ownerId, songIdValidated.songId, playlistId.id)

    const response = h.response({
      status: 'success',
      message: 'Song successfully added to playlist'
    })
    response.code(201)
    return response
  }

  async postPlaylistHandler (request, h) {
    const data = this._validator.validatePlaylist(request.payload)

    const { id: ownerId } = request.auth.credentials

    const playlistId = await this._service.addPlaylist(ownerId, data)

    const response = h.response({
      status: 'success',
      message: 'Playlist successfully added',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getplaylistHandler (request, h) {
    const { id: ownerId } = request.auth.credentials

    const playlists = await this._service.getPlaylists(ownerId)

    const response = h.response({
      status: 'success',
      data: {
        playlists
      }
    })
    return response
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    const { id: ownerId } = request.auth.credentials

    await this._service.checkPlaylistOwner(id, ownerId)

    await this._service.deletePlaylistById(id)

    const response = h.response({
      status: 'success',
      message: 'Playlist successfully deleted'
    })
    response.code(200)
    return response
  }
}

export default PlaylistHandler
