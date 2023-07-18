import UploadValidator from '../../validator/uploads/index.js'
import StorageService from '../../services/StorageService.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import autoBind from 'auto-bind'
import config from '../../utils/config.js'

class UploadsHandler {
  constructor () {
    this.__dirname = dirname(fileURLToPath(import.meta.url)) + '/files/images'
    this._service = new StorageService(this.__dirname)
    this._validator = new UploadValidator()

    autoBind(this)
  }

  async postUploadImageHandler (request, h) {
    const data = request.payload
    const { id } = request.params

    this._validator.validate(data.cover.hapi.headers)

    const filename = await this._service.writeFile(data.cover, data.cover.hapi)
    const url = `http://${config.app.host}:${config.app.port}/albums/${id}/covers/${filename}`

    await this._service.updateCoverUrl(id, url)

    const response = h.response({
      status: 'success',
      message: 'Cover successfully uploaded',
      data: {
        coverUrl: url
      }
    })
    response.code(201)
    return response
  }
}

export default UploadsHandler
