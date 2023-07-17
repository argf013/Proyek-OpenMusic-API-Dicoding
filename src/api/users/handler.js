/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const Response = require('../../utils/Response');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    return Response.post(h, 'success', 'User berhasil ditambahkan', {
      userId: await this._service.addUser(request.payload),
    });
  }

  async getUserByIdHandler(request) {
    return Response.get('success', {
      user: await this._service.getUserById(request.params.id),
    });
  }
}

module.exports = UsersHandler;
