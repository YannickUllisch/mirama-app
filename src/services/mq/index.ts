import { redisClient } from '@db'
import amqplib, { type Channel, type ChannelModel } from 'amqplib'

// Global vatiables to store connection and channel, avoids needless reconnect.
let connection: ChannelModel | null = null
let channel: Channel | null = null

/**
 * Initializes and returns a RabbitMQ channel.
 */
export const getMQChannel = async (): Promise<Channel> => {
  if (channel) return channel // Reuse existing channel

  try {
    if (!connection) {
      connection = await amqplib.connect(process.env.RABBITMQ_UR ?? '')
    }

    // Creating new TCP Channel
    channel = await connection.createChannel()

    // Graceful shutdown handling
    process.on('SIGINT', closeMQConnection)
    process.on('SIGTERM', closeMQConnection)

    return channel
  } catch (error) {
    console.error('MQ connection error:', error)
    throw error
  }
}

/**
 * Closes the RabbitMQ connection and channel gracefully.
 */
export const closeMQConnection = async () => {
  try {
    if (channel) {
      await channel.close()
    }
    if (connection) {
      await connection.close()
    }
  } catch (error) {
    console.error('❌ Error closing RabbitMQ:', error)
  } finally {
    channel = null
    connection = null
  }
}

/**
 * Creates a temporary RabbitMQ channel. Should be closed after use.
 */
export const createTemporaryChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_UR ?? '')
    const channel = await connection.createChannel()
    return { connection, channel }
  } catch (error) {
    console.error('MQ Connection Error:', error)
    throw error
  }
}
