import ClientError from './ClientError.js'

class AuthenticationError extends ClientError {
  constructor (message) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

class AuthorizationError extends ClientError {
  constructor (message) {
    super(message, 403)
    this.name = 'AuthorizationError'
  }
}

export { AuthenticationError, AuthorizationError }
