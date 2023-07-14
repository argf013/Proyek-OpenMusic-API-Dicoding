/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const Response = require('../../utils/Response');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validatePayload(request.payload);

    return Response.post(h, 'success', 'Album berhasil ditambahkan', {
      albumId: await this._service.addAlbum(request.payload),
    });
  }

  async getAlbumHandler() {
    return Response.get('success', {
      albums: await this._service.getAlbums(),
    });
  }

  async getAlbumByIdHandler(request, h) {
    return Response.get('success', {
      album: await this._service.getAlbumById(request.params.id),
    });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validatePayload(request.payload);

    await this._service.editAlbumById(request.params.id, request.payload);

    return Response.putOrDelete('success', 'Album berhasil diperbarui');
  }

  async deleteAlbumByIdHandler(request, h) {
    await this._service.deleteAlbumById(request.params.id);

    return Response.putOrDelete('success', 'Album berhasil dihapus');
  }
}

module.exports = AlbumHandler;
