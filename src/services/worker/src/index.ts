import mqConnection from './connection'

const handleIncomingNotification = (msg: string) => {
  try {
    const parsedMessage = JSON.parse(msg)

    console.debug('Received Notification', parsedMessage)

    // Implement your own notification flow
  } catch (err: any) {
    console.error(`Error While Parsing the message ${err}`)
  }
}

const listen = async () => {
  await mqConnection.connect()

  await mqConnection.consume(handleIncomingNotification)
}

listen()
