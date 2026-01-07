class Logger {
  constructor(config) {
    this.config = config
    this.logLevel = config.logging.level
    this.logs = []
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data
    }
    
    this.logs.push(logEntry)
    
    if (this.shouldLog(level)) {
      const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`
      console.log(formattedMessage)
      
      if (data) {
        console.log('Data:', JSON.stringify(data, null, 2))
      }
    }
    
    if (this.config.logging.saveToFile) {
      this.saveToFile(logEntry)
    }
  }

  shouldLog(level) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 }
    const currentLevel = levels[this.logLevel] || 2
    const messageLevel = levels[level] || 2
    return messageLevel <= currentLevel
  }

  saveToFile(logEntry) {
    const fs = require('fs')
    const path = require('path')
    
    try {
      const logDir = path.dirname(this.config.logging.logPath)
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }
      
      const logLine = JSON.stringify(logEntry) + '\n'
      fs.appendFileSync(this.config.logging.logPath, logLine)
    } catch (error) {
      console.error('Failed to write to log file:', error.message)
    }
  }

  error(message, data = null) {
    this.log('error', message, data)
  }

  warn(message, data = null) {
    this.log('warn', message, data)
  }

  info(message, data = null) {
    this.log('info', message, data)
  }

  debug(message, data = null) {
    this.log('debug', message, data)
  }

  getRecentLogs(count = 50) {
    return this.logs.slice(-count)
  }

  clearLogs() {
    this.logs = []
  }
}

module.exports = Logger
