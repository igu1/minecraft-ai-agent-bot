require('dotenv').config()
const mineflayer = require('mineflayer')
const config = require('./config/bot.config')
const BotController = require('./src/bot/controller/BotController')
const Logger = require('./src/utils/Logger')
const DataStorage = require('./src/utils/DataStorage')

const logger = new Logger(config)
const storage = new DataStorage()

const bot = mineflayer.createBot(config.bot)

bot.once('spawn', () => {
  logger.info('Bot connected to server')
  
  try {
    const { pathfinder, Movements } = require('mineflayer-pathfinder')
    bot.loadPlugin(pathfinder)
    
    const defaultMove = new Movements(bot)
    bot.pathfinder.setMovements(defaultMove)
    
    logger.info('Pathfinder plugin loaded successfully')
  } catch (error) {
    logger.warn('Failed to load pathfinder plugin:', error.message)
  }
  
  const controller = new BotController(bot)
  controller.start()
  
  logger.info('AI Agent initialized and ready')
  
  global.botController = controller
  global.logger = logger
  global.storage = storage
})

bot.on('kicked', (reason) => {
  logger.warn(`Bot was kicked: ${reason}`)
})

bot.on('error', (err) => {
  logger.error('Bot error occurred', { error: err.message })
  
  if (err.code === 'ECONNREFUSED') {
    logger.error('Could not connect to server. Make sure the server is running.')
  }
})

process.on('SIGINT', () => {
  logger.info('Shutting down bot...')
  if (global.botController) {
    global.botController.stop()
  }
  bot.end()
  process.exit(0)
})