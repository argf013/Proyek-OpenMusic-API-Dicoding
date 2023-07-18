import { token } from '@hapi/jwt'
import InvariantError from '../exceptions/InvariantError.js'
import config from '../utils/config.js'

class TokenService {
  async generateAccessToken (payload) {
    return token.generate(payload, config.jwt.accessKey)
  }

  async generateRefreshToken (payload) {
    return token.generate(payload, config.jwt.refreshKey)
  }

  async checkRefreshToken (refreshToken) {
    try {
      const artifacts = token.decode(refreshToken)

      token.verifySignature(artifacts, config.jwt.refreshKey)

      return artifacts.decoded.payload
    } catch (error) {
      throw new InvariantError('Refresh token is invalid')
    }
  }
}
export default TokenService
