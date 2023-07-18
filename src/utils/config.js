import * as dotenv from 'dotenv'

dotenv.config()

const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 6071
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER || 'amqp://localhost'
  },
  redis: {
    server: process.env.REDIS_SERVER || 'localhost'
  },
  jwt: {
    accessKey: process.env.ACCESS_TOKEN_KEY || 'secretaccess',
    maxAge: process.env.ACCESS_TOKEN_AGE || 3600,
    refreshKey: process.env.REFRESH_TOKEN_KEY || 'secretrefresh'
  }
}

export default config
