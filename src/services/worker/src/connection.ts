import amqplib, { type Channel, type ChannelModel } from 'amqplib'

type HandlerCB = (msg: string) => any

class RabbitMQConnection {
  connection: ChannelModel | null = null
  channel: Channel | null = null
  private connected = false

  async connect() {
    if (this.connected && this.channel) return
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_UR ?? '')
      this.channel = await this.connection.createChannel()
      this.connected = true
    } catch (error) {
      console.error(error)
      console.error('Not connected to MQ Server')
    }
  }

  async consume(handleIncomingNotification: HandlerCB) {
    const NOTIF_QUEUE = process.env.NOTIFICATION_QUEUE ?? 'undef'
    if (this.channel) {
      await this.channel.assertQueue(NOTIF_QUEUE, {
        durable: true,
      })

      this.channel.consume(
        NOTIF_QUEUE,
        (msg) => {
          if (!msg) {
            return console.error('Invalid incoming message')
          }
          handleIncomingNotification(msg?.content?.toString())
          this.channel?.ack(msg)
        },
        {
          noAck: false,
        },
      )
    }
  }
}

const mqConnection = new RabbitMQConnection()

export default mqConnection
