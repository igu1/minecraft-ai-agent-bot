class EventHandler {
  constructor(bot, controller) {
    this.bot = bot
    this.controller = controller
    this.eventListeners = new Map()
    this.setupDefaultHandlers()
  }

  setupDefaultHandlers() {
    this.on('chat', (username, message) => {
      this.handleChat(username, message)
    })

    this.on('spawn', () => {
      this.handleSpawn()
    })

    this.on('death', () => {
      this.handleDeath()
    })

    this.on('respawn', () => {
      this.handleRespawn()
    })

    this.on('health', () => {
      this.handleHealthChange()
    })

    this.on('experience', () => {
      this.handleExperienceChange()
    })

    this.on('weather', (weather) => {
      this.handleWeatherChange(weather)
    })

    this.on('time', (time) => {
      this.handleTimeChange(time)
    })

    this.on('entitySpawn', (entity) => {
      this.handleEntitySpawn(entity)
    })

    this.on('entityGone', (entity) => {
      this.handleEntityDespawn(entity)
    })

    this.on('playerJoined', (player) => {
      this.handlePlayerJoin(player)
    })

    this.on('playerLeft', (player) => {
      this.handlePlayerLeave(player)
    })
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event).push(callback)
    this.bot.on(event, callback)
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index !== -1) {
        listeners.splice(index, 1)
        this.bot.removeListener(event, callback)
      }
    }
  }

  handleChat(username, message) {
    if (username === this.bot.username) return
    
    console.log(`[CHAT] ${username}: ${message}`)
    
    if (message.startsWith('!')) {
      this.handleCommand(username, message.substring(1))
    }
  }

  handleCommand(username, command) {
    const [cmd, ...args] = command.split(' ')
    
    switch (cmd.toLowerCase()) {
      case 'status':
        const status = this.controller.getStatus()
        this.bot.chat(`Status: ${status.state} | Health: ${status.health}/20 | Combat: ${status.combatMode}`)
        break
        
      case 'follow':
        const player = this.bot.players[username]
        if (player && player.entity) {
          this.controller.agent.setTask({
            type: 'follow',
            target: player.entity,
            execute: async () => {
              await this.controller.pathfinder.goTo(player.entity.position)
            }
          })
          this.bot.chat(`Following ${username}`)
        }
        break
        
      case 'stop':
        this.controller.agent.currentTask = null
        this.controller.agent.state = 'idle'
        this.bot.chat('Stopped all tasks')
        break
        
      case 'come':
        this.controller.agent.setTask({
          type: 'come',
          target: username,
          execute: async () => {
            const player = this.bot.players[username]
            if (player && player.entity) {
              await this.controller.pathfinder.goTo(player.entity.position)
            }
          }
        })
        break
        
      default:
        this.bot.chat(`Unknown command: ${cmd}`)
    }
  }

  handleSpawn() {
    console.log('Bot spawned in world')
    this.bot.chat('Hello! I am online and ready to help!')
  }

  handleDeath() {
    console.log('Bot died')
    this.controller.handleDeath()
  }

  handleRespawn() {
    console.log('Bot respawned')
    this.bot.chat('I have respawned!')
  }

  handleHealthChange() {
    const health = this.bot.health
    const food = this.bot.food
    
    if (health < 6) {
      console.log('Bot health is critically low!')
    }
    
    if (food < 10) {
      console.log('Bot is getting hungry')
    }
  }

  handleExperienceChange() {
    const experience = this.bot.experience
    console.log(`Experience updated: Level ${experience.level}, ${experience.points} points`)
  }

  handleWeatherChange(weather) {
    console.log(`Weather changed: ${weather}`)
  }

  handleTimeChange(time) {
    const hours = Math.floor(time.timeOfDay / 1000) + 6
    const normalizedHours = hours % 24
    
    if (normalizedHours >= 18 || normalizedHours <= 6) {
      console.log('It is nighttime')
    }
  }

  handleEntitySpawn(entity) {
    if (entity.name && this.controller.combat.isHostile(entity)) {
      console.log(`Hostile entity detected: ${entity.name}`)
    }
  }

  handleEntityDespawn(entity) {
    if (entity === this.controller.combat.target) {
      this.controller.combat.target = null
      this.controller.combat.combatMode = false
    }
  }

  handlePlayerJoin(player) {
    console.log(`Player joined: ${player.username}`)
    this.bot.chat(`Welcome ${player.username}!`)
  }

  handlePlayerLeave(player) {
    console.log(`Player left: ${player.username}`)
  }
}

module.exports = EventHandler
