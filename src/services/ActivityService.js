import { nanoid } from 'nanoid'
import pkg from 'pg'

const { Pool } = pkg

class ActivityService {
  constructor () {
    this._pool = new Pool()
  }

  async addActivity (playlistId, userId, songId) {
    const id = `activity-${nanoid(16)}`
    const time = new Date().toISOString()

    const queryString = `INSERT INTO playlist_song_activities VALUES('${id}', '${userId}', '${songId}', '${playlistId}', 'add', '${time}')`

    await this._pool.query(queryString)
  }

  async deleteActivity (playlistId, userId, songId) {
    const id = `activity-${nanoid(16)}`
    const time = new Date().toISOString()

    const queryString = `INSERT INTO playlist_song_activities VALUES('${id}', '${userId}', '${songId}', '${playlistId}', 'delete', '${time}')`

    await this._pool.query(queryString)
  }
}

export default ActivityService
