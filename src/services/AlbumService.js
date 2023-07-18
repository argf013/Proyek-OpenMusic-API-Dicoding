import { nanoid } from 'nanoid'
import pkg from 'pg'
import NotFoundError from '../exceptions/NotFoundError.js'
import InvariantError from '../exceptions/InvariantError.js'
import CacheService from './CacheService.js'

const { Pool } = pkg

class AlbumService {
  constructor () {
    this._pool = new Pool()
    this._cacheService = new CacheService()
  }

  async addAlbum (data) {
    const id = 'album-' + nanoid(16)
    const { name, year } = data
    const date = new Date().toISOString()

    const queryString = `INSERT INTO albums VALUES('${id}', '${name}', ${year}, '${date}', '${date}') RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rows[0].id) {
      throw new InvariantError('Cannot add an Album')
    }
    return result.rows[0].id
  }

  async getAlbumById (id) {
    const queryAlbum = `SELECT id, name, year, cover_url as "coverUrl" FROM albums WHERE id = '${id}'`

    const { rows, rowCount } = await this._pool.query(queryAlbum)

    if (!rowCount) {
      throw new NotFoundError('Album not found')
    }

    const querySong = `SELECT s.id, s.title, s.performer FROM albums JOIN songs s ON albums.id = s.album_id WHERE albums.id = '${id}'`

    const { rows: songs } = await this._pool.query(querySong)

    return {
      album: {
        ...rows[0],
        songs
      }
    }
  }

  async editAlbumById (id, data) {
    const { name, year } = data
    const updatedAt = new Date().toISOString()

    const queryString = `UPDATE albums SET name = '${name}', year = '${year}', updated_at = '${updatedAt}' WHERE id = '${id}' RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rowCount) {
      throw new NotFoundError('Failed. Album Id not found')
    }

    return true
  }

  async deleteAlbumById (id) {
    const queryString = `DELETE FROM albums WHERE id = '${id}' RETURNING id`
    const result = await this._pool.query(queryString)

    if (!result.rowCount) {
      throw new NotFoundError('Albun Id not found')
    }

    return true
  }

  async addAlbumLike (userId, albumId) {
    const id = `like-${nanoid(16)}`
    const queryString = `INSERT INTO user_album_likes VALUES('${id}', '${userId}', '${albumId}') RETURNING id`
    const result = await this._pool.query(queryString)

    if (!result.rows[0].id) {
      throw new InvariantError('Cannot add an Album Like')
    }

    await this._cacheService.delete(`likes:${albumId}`)
    return result.rows[0].id
  }

  async isUserAlreadyLikeAlbum (userId, albumId) {
    const queryString = `SELECT * FROM user_album_likes WHERE user_id = '${userId}' AND album_id = '${albumId}'`

    const { rowCount } = await this._pool.query(queryString)

    return rowCount > 0
  }

  async getAlbumLikesById (albumId) {
    const result = await this._cacheService.get(`likes:${albumId}`)

    if (result) return { likes: parseInt(JSON.parse(result)), isCached: true }

    const queryString = `SELECT COUNT(*) FROM user_album_likes WHERE album_id = '${albumId}'`
    const { rows, rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new NotFoundError('Album not found')
    }

    await this._cacheService.set(`likes:${albumId}`, JSON.stringify(rows[0].count))

    return {
      likes: parseInt(rows[0].count, 10),
      isCached: false
    }
  }

  async deleteAlbumLike (userId, albumId) {
    const queryString = `DELETE FROM user_album_likes WHERE user_id = '${userId}' AND album_id = '${albumId}' RETURNING id`
    const { rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new NotFoundError('Cannot delete album like. Id not found')
    }

    await this._cacheService.delete(`likes:${albumId}`)
  }
};

export default AlbumService
