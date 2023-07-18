import { nanoid } from 'nanoid'
import pkg from 'pg'
import NotFoundError from '../exceptions/NotFoundError.js'
import InvariantError from '../exceptions/InvariantError.js'

const { Pool } = pkg

class SongService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong (data) {
    const id = 'song-' + nanoid(16)
    const { title, year, performer, genre, duration, albumId } = data
    const date = new Date().toISOString()

    const albumIdNull = albumId ? `'${albumId}'` : null
    const queryString = `INSERT INTO songs VALUES('${id}', '${title}', ${year}, '${performer}', '${genre}', ${duration}, ${albumIdNull}, '${date}', '${date}') RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rows[0].id) {
      throw new InvariantError('Cannot add a Song')
    }

    return result.rows[0].id
  }

  async getSongs (data = {}) {
    const { title, performer } = data

    let cond = ''
    if (title && performer) {
      cond = ` WHERE title ILIKE '%${title}%' AND performer ILIKE '%${performer}%'`
    } else {
      if (title) {
        cond = ` WHERE title ILIKE '%${title}%'`
      }
      if (performer) {
        cond = ` WHERE performer ILIKE '%${performer}%'`
      }
    }
    const result = await this._pool.query('SELECT id, title, performer FROM songs' + cond)

    return result.rows
  }

  async getSongById (id) {
    const queryString = `SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = '${id}'`

    const result = await this._pool.query(queryString)

    if (!result.rowCount) {
      throw new NotFoundError('Song not found')
    }

    return result.rows[0]
  }

  async editSongById (id, data) {
    const { title, year, performer, genre, duration, albumId } = data
    const updatedAt = new Date().toISOString()

    const albumIdNull = albumId ? `'${albumId}'` : null
    const queryString = `UPDATE songs SET title = '${title}', year = '${year}', performer = '${performer}', genre = '${genre}', duration = '${duration}', album_id = ${albumIdNull}, updated_at = '${updatedAt}' WHERE id = '${id}' RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rowCount) {
      throw new NotFoundError('Song Id not found')
    }

    return true
  }

  async deleteSongById (id) {
    const queryString = `DELETE FROM songs WHERE id = '${id}' RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rowCount) {
      throw new NotFoundError('Song Id not found')
    }

    return true
  }

  async checkSong (songId) {
    const queryString = `SELECT id FROM songs WHERE id = '${songId}'`

    const { rowCount } = await this._pool.query(queryString)

    return rowCount
  }
};

export default SongService
