import Joi from 'joi'

const playlistSchema = Joi.object({
  name: Joi.string().required()
})

const playlistSongSchema = Joi.object({
  songId: Joi.string().required()
})

export { playlistSchema, playlistSongSchema }
