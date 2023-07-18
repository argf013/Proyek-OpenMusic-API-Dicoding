import Joi from 'joi'

const schema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required()
})

export default schema
