import Joi from 'joi'

const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})

export { LoginSchema, RefreshTokenSchema }
