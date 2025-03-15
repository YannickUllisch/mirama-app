import { getMQChannel } from '@services/mq'

/**
 * Sends a message to the specified RabbitMQ queue.
 */
export const sendToQueue = async (queue: string, message: object) => {
  try {
    const channel = await getMQChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
