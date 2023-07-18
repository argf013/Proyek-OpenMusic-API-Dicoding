import Handler from './handler.js'

const handler = new Handler()

const routes = () => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  }
]

export default routes
