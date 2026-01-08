const AgentCore = require('../../agent/AgentCore')
const ActionManager = require('../../agent/ActionManager')
const { registry } = require('../../agent/tools/registry')
const { generatePrompt } = require('../../utils/prompt')

class BotController {
  constructor(bot) {
    this.bot = bot
    this.agent = new AgentCore(bot)
    this.actionManager = new ActionManager(bot, this.agent)
    
    this.isRunning = false
    this.tickInterval = null
    this.timer = 0
  }

  async start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('Bot controller started')
    this.setupEventHandlers()
    this.startMainLoop()
  }

  stop() {
    if (!this.isRunning) return
    
    this.isRunning = false
    if (this.tickInterval) {
      clearInterval(this.tickInterval)
      this.tickInterval = null
    }
    
    console.log('Bot controller stopped')
  }

  setupEventHandlers() {
    this.bot.on('chat', (username, message) => {
      if (username === this.bot.username) return
      if (message.startsWith('/')) return;
      this.handleChatMessage(username, message)
    })

    this.bot.on('death', () => {
      console.log('Bot died! Respawning...')
      this.handleDeath()
    })

    this.bot.on('health', () => {
      if (this.bot.health < 10) {
        this.handleLowHealth()
      }
    })

    this.bot.on('error', (err) => {
      console.error('Bot error:', err)
    })
  }

  startMainLoop() {
    this.tickInterval = setInterval(async () => {
      if (!this.isRunning) return
      
      try {
        await this.tick()
      } catch (error) {
        console.error('Error in main loop:', error)
      }
    }, 1000)
  }

  async tick() {
    let task;
    if (this.agent.tasks.length > 0 && !this.agent.currentTask) {
      task = this.agent.tasks.shift()
      console.log(`📋 Processing next task: ${task.name}, remaining: ${this.agent.tasks.length}`)
      this.handleToolCall(task)
      this.timer = 0
    }

    const currentTaskCall = this.agent.currentTaskCall
    if (currentTaskCall && currentTaskCall.args && currentTaskCall.args.duration) {
      this.timer++
      if (this.timer >= currentTaskCall.args.duration) {
        console.log(`⏱️ Task duration completed for: ${currentTaskCall.name} (${this.timer}s)`)
        this.agent.stopCurrentTask()
        this.timer = 0
      }
    } else if (!this.agent.currentTask && this.agent.tasks.length === 0) {
      this.timer = 0
    }
  }

  async handleChatMessage(username, message) {
    const prompt = generatePrompt(username, message, registry)
    
    try {
      const calls = await this.agent.actionAi(prompt)
      if (Array.isArray(calls) && calls && calls.length > 0) {
        calls.forEach(call => this.agent.addTask(call))
      }
    } catch (error) {
      console.error('AI processing failed:', error.message)
      this.bot.chat('Sorry, I had trouble understanding that.')
    }
  }

  async handleToolCall(func) {
    if (!func || !func.name) {
      console.error('Invalid tool call: func is null or missing name')
      return
    }

    const action = this.actionManager.getAction(func.name)
    console.log(`Executing tool call: ${func.name}`)
    if (action) {
      try {
        this.agent.setTask(func, action)
        const result = await action.execute(func.args)
        console.log(result)
        if (result && result.catch) {
          result.catch(error => {
            console.error('Tool execution error:', error.message)
            this.bot.chat(`💔 Something went wrong! ${this.getFriendlyErrorMessage(error.message)}`)
            this.agent.stopCurrentTask()
          })
        } else if (result) {
          if (result.success) {
            this.bot.chat(`✅ ${result.message || 'Done!'}`)
          }
          if (!func.args || !func.args.duration) {
            this.agent.stopCurrentTask()
          }
        } else {
          if (!func.args || !func.args.duration) {
            this.agent.stopCurrentTask()
          }
        }
      } catch (error) {
        console.error('Tool call error:', error.message)
        this.bot.chat(`💔 Oops! ${this.getFriendlyErrorMessage(error.message)}`)
        this.agent.stopCurrentTask()
      }
    } else {
      console.error(`Tool ${func.name} not found`)
      this.bot.chat(`🤔 I don't know how to do that. Try asking me something else!`)
    }
  }

  getFriendlyErrorMessage(error) {
    const errorMap = {
      'Player not found': "I can't find that player. Are they nearby?",
      'No path found': "I can't reach that location. There might be something in the way.",
      'Item not found': "I don't have that item.",
      'Inventory full': "My inventory is full. I can't pick up more items.",
      'Invalid coordinates': "Those coordinates don't seem right.",
      'Permission denied': "I don't have permission to do that.",
      'Timeout': "That took too long. Let me try something else."
    }
    
    return errorMap[error] || "Something went wrong. Let me try again!"
  }

  handleDeath() {
    this.agent.stopCurrentTask()
    this.agent.clearMemory()
    this.bot.chat("💀 Oops! I died. Let me get back to work...")
  }

  handleLowHealth() {
    this.bot.chat("❤️ I'm feeling weak! I should be careful...")
  }

  getStatus() {
    return {
      state: this.agent.state,
      health: this.bot.health,
      hunger: this.bot.food,
      position: this.bot.entity.position,
      currentTask: this.agent.currentTask?.constructor.name || 'none'
    }
  }
}

module.exports = BotController
