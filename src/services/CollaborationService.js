import { nanoid } from 'nanoid'
import pkg from 'pg'
import UserService from './UserService.js'
import InvariantError from '../exceptions/InvariantError.js'

const { Pool } = pkg

class CollaborationService {
  constructor () {
    this._pool = new Pool()
    this._userService = new UserService()
  }

  async checkCollaboration (playlistId, userId) {
    const queryString = `SELECT * FROM collaborations WHERE playlist_id = '${playlistId}' AND user_id = '${userId}'`

    const result = await this._pool.query(queryString)

    if (!result.rows.length) {
      throw new InvariantError('Collaboration cannot be verified')
    }
  }

  async addCollaboration ({ playlistId, userId }) {
    await this._userService.checkUser(userId)
    const id = `collab-${nanoid(16)}`
    const date = new Date().toISOString()

    const queryString = `INSERT INTO collaborations VALUES('${id}', '${userId}', '${playlistId}', '${date}', '${date}') RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rows.length) {
      throw new InvariantError('Collaboration cannot be added')
    }

    return result.rows[0].id
  }

  async deleteCollaboration ({ playlistId, userId }) {
    const queryString = `DELETE FROM collaborations WHERE playlist_id = '${playlistId}' AND user_id = '${userId}' RETURNING id`

    const result = await this._pool.query(queryString)

    if (!result.rows.length) {
      throw new InvariantError('Collaboration cannot be deleted')
    }
  }
}

export default CollaborationService
