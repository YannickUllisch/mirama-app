import pino from 'pino'

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'warn',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  formatters: {
    level: (label) => {
      return { severity: label.toUpperCase() }
    },
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  base: {
    app: 'mirama_app',
  },
})
export default logger
