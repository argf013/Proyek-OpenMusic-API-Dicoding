import { server as _server } from '@hapi/hapi'
import jwt from '@hapi/jwt'
import Inert from '@hapi/inert'
import ClientError from './exceptions/ClientError.js'
import albums from './api/albums/index.js'
import songs from './api/songs/index.js'
import users from './api/users/index.js'
import authentications from './api/authentications/index.js'
import collaborations from './api/collaborations/index.js'
import playlists from './api/playlists/index.js'
import exports from './api/exports/index.js'
import uploads from './api/uploads/index.js'
import config from './utils/config.js'

const init = async () => {
  const server = _server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([jwt, Inert])

  server.auth.strategy('jwt_auth', 'jwt', {
    keys: config.jwt.accessKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.maxAge
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        Credentials: {
          id: artifacts.decoded.payload.id
        }
      }
    }
  })

  await server.register([
    albums,
    songs,
    users,
    authentications,
    playlists,
    collaborations,
    exports,
    uploads
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      let errRes = {}
      let errCode = 500

      if (response instanceof ClientError) {
        errCode = response.statusCode ?? 400
        errRes = {
          status: 'fail',
          message: response.message
        }
      } else if (!response.isServer) {
        errCode = response.output.statusCode ?? 400
        errRes = {
          status: 'fail',
          message: response.message
        }
      } else {
        errRes = {
          status: 'error',
          message: 'Server Cannot Process Your Request'
        }
        if (config.app.env === 'development') {
          console.log(response.stack)
          errRes.data = response.message
        }
      }

      return h.response(errRes).code(errCode)
    }

    return h.continue
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

init()
