import pkg from 'pg'
import InvariantError from '../exceptions/InvariantError.js'

const { Pool } = pkg

class AuthenticationService {
  constructor () {
    this._pool = new Pool()
  }

  async addRefreshToken (token) {
    const queryString = `INSERT INTO authentications VALUES('${token}')`

    await this._pool.query(queryString)
  }

  async checkRefreshToken (token) {
    const queryString = `SELECT token FROM authentications WHERE token = '${token}'`

    const { rows, rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new InvariantError('Refresh Token is not valid')
    }

    return rows
  }

  async deleteRefreshToken (token) {
    const queryString = `DELETE FROM authentications WHERE token = '${token}'`

    await this._pool.query(queryString)
  }
}

export default AuthenticationService
