import SongService from '../../services/SongService.js'
import SongValidator from '../../validator/songs/index.js'
import autoBind from 'auto-bind'

class SongHandler {
  constructor () {
    this._service = new SongService()
    this._validator = new SongValidator()

    autoBind(this)
  }

  async postSongHandler (request, h) {
    const data = this._validator.validate(request.payload)

    const songId = await this._service.addSong(data)

    const response = h.response({
      status: 'success',
      data: {
        songId
      }
    })
    response.code(201)
    return response
  }

  async getSongsHandler (request, h) {
    const queryParams = request.query

    const songs = await this._service.getSongs(queryParams)

    const response = h.response({
      status: 'success',
      data: {
        songs
      }
    })
    return response
  }

  async getSongByIdHandler (request, h) {
    const { id } = request.params

    const song = await this._service.getSongById(id)

    const response = h.response({
      status: 'success',
      data: {
        song
      }
    })
    return response
  }

  async editSongHandler (request, h) {
    const songValidated = this._validator.validate(request.payload)
    const { id } = request.params

    await this._service.editSongById(id, songValidated)

    const response = h.response({
      status: 'success',
      message: 'Song updated'
    })
    return response
  }

  async deleteSongHandler (request, h) {
    const { id } = request.params

    await this._service.deleteSongById(id)

    const response = h.response({
      status: 'success',
      message: 'Song deleted'
    })
    return response
  }
};

export default SongHandler
