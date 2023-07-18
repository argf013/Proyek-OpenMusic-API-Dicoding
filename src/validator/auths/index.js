import { LoginSchema, RefreshTokenSchema } from './schema.js'
import InvariantError from '../../exceptions/InvariantError.js'

class AuthValidator {
  validateLogin = (data) => {
    const result = LoginSchema.validate(data)

    if (result.error) {
      throw new InvariantError(result.error.message)
    }

    return result.value
  }

  validateRefreshToken = (data) => {
    const result = RefreshTokenSchema.validate(data)

    if (result.error) {
      throw new InvariantError(result.error.message)
    }

    return result.value
  }
};

export default AuthValidator
