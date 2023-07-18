import UserService from '../../services/UserService.js'
import UserValidator from '../../validator/users/index.js'
import autoBind from 'auto-bind'

class UserHandler {
  constructor () {
    this._service = new UserService()
    this._validator = new UserValidator()

    autoBind(this)
  }

  async postUserHandler (request, h) {
    const data = await this._validator.validate(request.payload)

    const userId = await this._service.addUser(data)

    const response = h.response({
      status: 'success',
      data: {
        userId
      }
    })
    response.code(201)
    return response
  }
}

export default UserHandler
