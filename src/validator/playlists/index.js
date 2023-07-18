import { playlistSchema, playlistSongSchema } from './schema.js'
import InvariantError from '../../exceptions/InvariantError.js'

class PlaylistValidator {
  validatePlaylist = (data) => {
    const validationResult = playlistSchema.validate(data)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }

    return validationResult.value
  }

  validatePlaylistSong = (data) => {
    const validationResult = playlistSongSchema.validate(data)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }

    return validationResult.value
  }
};

export default PlaylistValidator
