import Joi from 'joi'

const schema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required()
})

export default schema
