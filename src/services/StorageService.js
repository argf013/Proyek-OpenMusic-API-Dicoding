import { existsSync, mkdirSync, createWriteStream } from 'fs'
import pkg from 'pg'
import InvariantError from '../exceptions/InvariantError.js'

const { Pool } = pkg

class StorageService {
  constructor (folder) {
    this._folder = folder
    this._pool = new Pool()

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true })
    }
  }

  writeFile (file, meta) {
    const filename = +new Date() + meta.filename
    const path = `${this._folder}/${filename}`

    const fileStream = createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error))

      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }

  async updateCoverUrl (albumId, url) {
    const queryString = `UPDATE albums SET cover_url = '${url}' WHERE id = '${albumId}' RETURNING id`

    const { rows, rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new InvariantError('Cannot update album cover url. Album Id not found')
    }

    return rows[0].id
  }
}

export default StorageService
