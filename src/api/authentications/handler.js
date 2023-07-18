import AuthValidator from '../../validator/auths/index.js'
import AuthService from '../../services/AuthService.js'
import UserService from '../../services/UserService.js'
import TokenService from '../../services/TokenService.js'
import autoBind from 'auto-bind'

class AuthenticationsHandler {
  constructor () {
    this._authenticationService = new AuthService()
    this._userService = new UserService()
    this._tokenService = new TokenService()
    this._validator = new AuthValidator()

    autoBind(this)
  }

  async postAuthenticationHandler (request, h) {
    const userValidated = await this._validator.validateLogin(request.payload)
    const id = await this._userService.checkUserCredential(userValidated)

    const accessToken = await this._tokenService.generateAccessToken({ id })
    const refreshToken = await this._tokenService.generateRefreshToken({ id })

    await this._authenticationService.addRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Authentication successfully added',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler (request, h) {
    const refreshTokenValidated = this._validator.validateRefreshToken(request.payload)

    await this._authenticationService.checkRefreshToken(refreshTokenValidated.refreshToken)

    const { id } = await this._tokenService.checkRefreshToken(refreshTokenValidated.refreshToken)

    const accessToken = await this._tokenService.generateRefreshToken({ id })

    const response = h.response({
      status: 'success',
      message: 'Access Token successfully updated',
      data: {
        accessToken
      }
    })
    return response
  }

  async deleteAuthenticationHandler (request, h) {
    const refreshTokenValidated = this._validator.validateRefreshToken(request.payload)

    await this._authenticationService.checkRefreshToken(refreshTokenValidated.refreshToken)
    await this._authenticationService.deleteRefreshToken(refreshTokenValidated.refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Refresh token successfully deleted'
    })
    return response
  }
}

export default AuthenticationsHandler
