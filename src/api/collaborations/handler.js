import CollaborationValidator from '../../validator/collaborations/index.js'
import CollaborationService from '../../services/CollaborationService.js'
import PlaylistService from '../../services/PlaylistService.js'
import autoBind from 'auto-bind'

class CollaborationHandler {
  constructor () {
    this._collaborationService = new CollaborationService()
    this._playlistService = new PlaylistService()
    this._validator = new CollaborationValidator()

    autoBind(this)
  }

  async postCollaborationHandler (request, h) {
    const data = this._validator.validate(request.payload)

    const { id: ownerId } = request.auth.credentials

    await this._playlistService.checkPlaylistOwner(data.playlistId, ownerId)

    const collaborationId = await this._collaborationService.addCollaboration(data)

    const response = h.response({
      status: 'success',
      message: 'Collaboration successfully added',
      data: {
        collaborationId
      }
    })
    response.code(201)
    return response
  }

  async deleteCollaborationHandler (request, h) {
    const data = this._validator.validate(request.payload)
    const { id: ownerId } = request.auth.credentials

    await this._playlistService.checkPlaylistOwner(data.playlistId, ownerId)
    await this._collaborationService.deleteCollaboration(data)

    const response = h.response({
      status: 'success',
      message: 'Collaboration successfully deleted'
    })
    response.code(200)
    return response
  }
}

export default CollaborationHandler
