import { nanoid } from 'nanoid'
import { compare, hash } from 'bcrypt'
import pkg from 'pg'
import NotFoundError from '../exceptions/NotFoundError.js'
import InvariantError from '../exceptions/InvariantError.js'
import { AuthenticationError } from '../exceptions/AuthError.js'

const { Pool } = pkg

class UserService {
  constructor () {
    this._pool = new Pool()
  }

  async checkUserCredential (credential) {
    const { username, password } = credential

    const queryString = `SELECT id, username, fullname, password FROM users WHERE username = '${username}'`

    const { rows, rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new AuthenticationError('Username or password is wrong')
    }

    const { id, password: hashedPassword } = rows[0]

    const match = await compare(password, hashedPassword)

    if (!match) {
      throw new AuthenticationError('Username or password is wrong')
    }

    return id
  }

  async checkUsername (username) {
    const queryString = `SELECT username from users WHERE username = '${username}'`

    const { rowCount } = await this._pool.query(queryString)

    if (rowCount) {
      throw new InvariantError('The username is already taken')
    }
  }

  async addUser (data) {
    const { username, password, fullname } = data

    await this.checkUsername(username)

    const id = `user-${nanoid(16)}`
    const hashedPassword = await hash(password, 10)
    const date = new Date().toISOString()

    const queryString = `INSERT INTO users VALUES('${id}', '${username}', '${fullname}', '${hashedPassword}', '${date}', '${date}') RETURNING id`

    const { rows } = await this._pool.query(queryString)

    if (!rows[0].id) {
      throw new InvariantError('Cannot add a user')
    }

    return rows[0].id
  }

  async checkUser (userId) {
    const queryString = `SELECT id FROM users WHERE id = '${userId}'`

    const { rowCount } = await this._pool.query(queryString)

    if (!rowCount) {
      throw new NotFoundError('User not found')
    }
  }
}

export default UserService
