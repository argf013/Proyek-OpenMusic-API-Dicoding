import AlbumService from '../../services/AlbumService.js'
import AlbumValidator from '../../validator/albums/index.js'
import autoBind from 'auto-bind'

class AlbumHandler {
  constructor () {
    this._service = new AlbumService()
    this._validator = new AlbumValidator()

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    const data = this._validator.validate(request.payload)
    const albumId = await this._service.addAlbum(data)

    const response = h.response({
      status: 'success',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)

    const response = h.response({
      status: 'success',
      data: album
    })
    return response
  }

  async editAlbumHandler (request, h) {
    const data = this._validator.validate(request.payload)
    const { id } = request.params

    await this._service.editAlbumById(id, data)

    const response = h.response({
      status: 'success',
      message: 'Album updated'
    })
    return response
  }

  async deleteAlbumHandler (request, h) {
    const { id } = request.params

    await this._service.deleteAlbumById(id)

    const response = h.response({
      status: 'success',
      message: 'Album deleted'
    })
    return response
  }

  async postAlbumLikeHandler (request, h) {
    const { id: albumId } = request.params
    const { id: userId } = request.auth.credentials

    await this._service.getAlbumById(albumId)

    const isLiked = await this._service.isUserAlreadyLikeAlbum(userId, albumId)

    let result = {}
    let statusCode = 201
    if (isLiked) {
      result = {
        status: 'fail',
        message: 'Album already liked'
      }

      statusCode = 400
    } else {
      await this._service.addAlbumLike(userId, albumId)
      result = {
        status: 'success',
        message: `Like added to album ${albumId}`
      }
    }

    const response = h.response(result)
    response.code(statusCode)
    return response
  }

  async getAlbumLikesByIdHandler (request, h) {
    const { id } = request.params

    const { likes, isCached } = await this._service.getAlbumLikesById(id)

    const response = h.response({
      status: 'success',
      data: {
        likes
      }
    })

    response.code(200)

    if (isCached) {
      response.header('X-Data-Source', 'cache')
    }

    return response
  }

  async deleteAlbumLikeHandler (request, h) {
    const { id } = request.params
    const { id: userId } = request.auth.credentials

    await this._service.getAlbumById(id)

    const isLiked = await this._service.isUserAlreadyLikeAlbum(userId, id)

    if (!isLiked) {
      const response = h.response({
        status: 'fail',
        message: 'Like not found'
      })
      response.code(404)
      return response
    }
    await this._service.deleteAlbumLike(userId, id)

    const response = h.response({
      status: 'success',
      message: 'Like deleted'
    })
    return response
  }
};

export default AlbumHandler
