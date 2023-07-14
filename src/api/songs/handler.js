/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const { baseErrorHandler } = require('../../utils');
const BaseResponse = require('../../dto/BaseResponse');

class SongsHandler {
  constructor(service, validator) {
    this._response = new BaseResponse();
    this._service = service;
    this._validator = validator;
    autoBind(this);
    this.baseErrorHandler = baseErrorHandler;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });
    return h.response(this._response.normalResponse({ songId })).code(201);
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return this._response.normalResponse({ song });
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });
    return this._response.normalResponse({ songs });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return this._response.normalMessageResponse('Lagu berhasil diperbarui.');
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return this._response.normalMessageResponse('Lagu berhasil dihapus.');
  }

  onPreResponseHandler(request, h) {
    const { response } = request;

    if (response.isBoom) {
      return this.baseErrorHandler(response, h);
    }

    return h.continue;
  }
}

module.exports = SongsHandler;
