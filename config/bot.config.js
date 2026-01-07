module.exports = {
  bot: {
    host: process.env.MINECRAFT_HOST || '127.0.0.1',
    port: parseInt(process.env.MINECRAFT_PORT) || 25565,
    username: process.env.BOT_USERNAME || 'AIBot',
    password: process.env.BOT_PASSWORD || null,
    auth: process.env.BOT_AUTH || 'offline',
    version: process.env.MINECRAFT_VERSION || false
  },

  agent: {
    tickRate: parseInt(process.env.BOT_TICK_RATE) || 1000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 5000,
    
    combat: {
      enabled: process.env.COMBAT_ENABLED !== 'false',
      retreatThreshold: parseFloat(process.env.RETREAT_THRESHOLD) || 0.3,
      attackRange: parseFloat(process.env.ATTACK_RANGE) || 4,
      detectionRange: parseFloat(process.env.DETECTION_RANGE) || 16
    },
    
    pathfinding: {
      timeout: parseInt(process.env.PATHFINDING_TIMEOUT) || 10000,
      allowPartial: process.env.ALLOW_PARTIAL_PATH !== 'false',
      maxDistance: parseFloat(process.env.MAX_PATH_DISTANCE) || 100
    },
    
    inventory: {
      autoOrganize: process.env.AUTO_ORGANIZE !== 'false',
      autoEquip: process.env.AUTO_EQUIP !== 'false',
      keepSlots: parseInt(process.env.KEEP_SLOTS) || 9
    }
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    saveToFile: process.env.LOG_TO_FILE === 'true',
    logPath: process.env.LOG_PATH || './logs/bot.log',
    maxFileSize: parseInt(process.env.MAX_LOG_SIZE) || 10485760,
    maxFiles: parseInt(process.env.MAX_LOG_FILES) || 5
  },

  features: {
    chatCommands: process.env.CHAT_COMMANDS !== 'false',
    autoEat: process.env.AUTO_EAT !== 'false',
    autoHeal: process.env.AUTO_HEAL !== 'false',
    collectDrops: process.env.COLLECT_DROPS !== 'false',
    avoidDanger: process.env.AVOID_DANGER !== 'false'
  },

  behavior: {
    priorities: {
      survival: parseInt(process.env.PRIORITY_SURVIVAL) || 10,
      combat: parseInt(process.env.PRIORITY_COMBAT) || 8,
      resource: parseInt(process.env.PRIORITY_RESOURCE) || 5,
      explore: parseInt(process.env.PRIORITY_EXPLORE) || 3,
      social: parseInt(process.env.PRIORITY_SOCIAL) || 1
    }
  }
}
