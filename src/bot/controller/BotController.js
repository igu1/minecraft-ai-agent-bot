const AgentCore = require('../../agent/AgentCore')
const BehaviorEngine = require('../../agent/behavior/BehaviorEngine')
const PathFinder = require('../../agent/pathfinding/PathFinder')
const CombatSystem = require('../../agent/combat/CombatSystem')
const InventoryManager = require('../../agent/inventory/InventoryManager')
const { goals: { GoalNear } } = require('mineflayer-pathfinder')
const { logging } = require('../../../config/bot.config')
const { registry } = require('../../agent/Tools')
const { generate_prompt } = require('../../agent/Prompt')

class BotController {
  constructor(bot) {
    this.bot = bot
    this.agent = new AgentCore(bot)
    this.behaviorEngine = new BehaviorEngine(this.agent)
    this.pathfinder = new PathFinder(bot, this.agent)
    this.combat = new CombatSystem(bot)
    this.inventory = new InventoryManager(bot, this.agent)
    
    this.isRunning = false
    this.tickInterval = null
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
    if (this.combat.combatMode) {
      await this.combat.defend()
      return
    }

    if (this.agent.currentTask) {
      try {
        const completed = await this.agent.currentTask.execute()
        if (completed) {
          this.agent.currentTask = null
          this.agent.state = 'idle'
        }
      } catch (error) {
        console.error('Task execution failed:', error.message)
        this.agent.currentTask = null
        this.agent.state = 'idle'
      }
    } else {
      await this.behaviorEngine.executeBestBehavior()
    }
    
    await this.inventory.organizeInventory()
  }

  async handleChatMessage(username, message) {
    const tools = registry
    const prompt = generate_prompt(username, message, tools)
    
    try {
      const calls = await this.agent.actionAi(prompt)
      if (Array.isArray(calls) && calls && calls.length > 0) {
        calls.map(call => this.handleToolCall(call))
      }
    } catch (error) {
      console.error('AI processing failed:', error.message)
      this.bot.chat('Sorry, I had trouble understanding that.')
    }
  }

  handleToolCall(func) {
    if (func.name == 'idle') {
      this.agent.stopCurrentTask()
      this.bot.chat("😌 Just chilling here!")
      return
    }

    let tools = {}
    tools = {...tools, ...this.pathfinder.getTools()}
    tools = {...tools, ...this.inventory.getTools()}
    
    if (tools[func.name]) {
      try {
        const tool = tools[func.name]
        this.agent.setTask(tool)
        const result = tool.execute(func.args)
        
        if (result && result.catch) {
          result.catch(error => {
            console.error('Tool execution error:', error.message)
            this.bot.chat(`💔 Something went wrong! ${this.getFriendlyErrorMessage(error.message)}`)
            this.agent.stopCurrentTask()
          })
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

  getFriendlyErrorMessage(technicalError) {
    const errorMap = {
      'Player not found': "I can't find that player. Make sure they're nearby!",
      'Path was stopped': "I got stuck trying to move. There might be obstacles in the way.",
      'Item not found': "I can't find that item around here.",
      'Insufficient ingredients': "I don't have enough materials to craft that.",
      'No recipe found': "I don't know how to craft that item.",
      'Inventory full': "My inventory is too full to pick that up."
    }
    
    for (const [technical, friendly] of Object.entries(errorMap)) {
      if (technicalError.includes(technical)) {
        return friendly
      }
    }
    
    return "Something unexpected happened. Please try again!"
  }

  handleDeath() {
    this.agent.currentTask = null
    this.agent.state = 'dead'
    this.combat.combatMode = false
    this.combat.target = null
  }

  async handleLowHealth() {
    const food = this.bot.inventory.items().find(item => 
      item.name.includes('bread') || 
      item.name.includes('apple') ||
      item.name.includes('carrot')
    )
    
    if (food) {
      await this.bot.equip(food, 'hand')
      await this.bot.consume()
    }
  }

  getStatus() {
    return {
      state: this.agent.state,
      health: this.bot.health,
      hunger: this.bot.food,
      position: this.bot.entity.position,
      combatMode: this.combat.combatMode,
      currentTask: this.agent.currentTask?.type || 'none'
    }
  }
}

module.exports = BotController
