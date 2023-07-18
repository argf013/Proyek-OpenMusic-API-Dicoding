import { connect } from 'amqplib'
import config from '../utils/config.js'

class ProducerService {
  async sendMessage (queue, message) {
    const connection = await connect(config.rabbitMq.server)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })

    channel.sendToQueue(queue, Buffer.from(message))

    setTimeout(() => {
      connection.close()
    }, 1000)
  }
}

export default ProducerService
