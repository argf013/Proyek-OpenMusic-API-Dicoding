/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const { baseErrorHandler } = require('../../utils');
const BaseResponse = require('../../dto/BaseResponse');

class AlbumsHandler {
  constructor(service, validator) {
    this._response = new BaseResponse();
    this._service = service;
    this._validator = validator;
    autoBind(this);
    this.baseErrorHandler = baseErrorHandler;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    return h.response(this._response.normalResponse({ albumId })).code(201);
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return this._response.normalResponse({ album });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return this._response.normalMessageResponse('Album berhasil diperbarui.');
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return this._response.normalMessageResponse('Album berhasil dihapus.');
  }

  onPreResponseHandler(request, h) {
    const { response } = request;

    if (response.isBoom) {
      return this.baseErrorHandler(response, h);
    }

    return h.continue;
  }
}

module.exports = AlbumsHandler;
