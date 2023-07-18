class ClientError extends Error {
  constructor (message, statusCode = 400) {
    super('Failed. ' + message)
    this.statusCode = statusCode
    this.name = 'ClientError'
  }
}

export default ClientError
