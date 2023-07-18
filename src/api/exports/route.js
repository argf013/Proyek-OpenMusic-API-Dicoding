import Handler from './handler.js'

const handler = new Handler()

const routes = () => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: 'jwt_auth'
    }
  }
]

export default routes
