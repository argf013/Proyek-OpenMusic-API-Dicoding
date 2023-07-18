import ExportValidator from '../../validator/exports/index.js'
import ProducerService from '../../services/ProducerService.js'
import PlaylistService from '../../services/PlaylistService.js'
import autoBind from 'auto-bind'

class ExportsHandler {
  constructor () {
    this._service = new ProducerService()
    this._validator = new ExportValidator()
    this._playlistsService = new PlaylistService()

    autoBind(this)
  }

  async postExportPlaylistsHandler (request, h) {
    const { id } = request.params
    const { id: ownerId } = request.auth.credentials
    const { targetEmail } = this._validator.validate(request.payload)

    await this._playlistsService.checkPlaylistOwner(id, ownerId)

    const message = {
      id,
      targetEmail
    }
    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    })
    response.code(201)
    return response
  }
}

export default ExportsHandler
