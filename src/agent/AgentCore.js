const AIManager = require('../ai/AIManager')
const { registry } = require('./tools/registry')

class AgentCore {
  constructor(bot) {
    this.bot = bot
    this.currentTask = null
    this.state = 'idle'
    this.memory = new Map()
    this.tasks = []
    this.ai = new AIManager()
  }

  async think() {
    if (this.currentTask && !this.currentTask.completed) {
      await this.currentTask.execute()
    } else {
      this.idleBehavior()
    }
  }

  idleBehavior() {
    this.state = 'idle'
    this.currentTask = null
  }

  addTask(task) {
    this.tasks.push(task)
  }

  setTask(toolCall, actionObject) {
    this.stopCurrentTask()
    this.currentTask = actionObject
    this.currentTaskCall = toolCall
    this.state = 'working'
  }

  stopCurrentTask() {
    if (this.currentTask && this.currentTask.stop) {
      this.currentTask.stop()
    }
    this.currentTask = null
    this.currentTaskCall = null
    this.state = 'idle'
  }

  getCurrentTask() {
    return this.currentTask
  }

  getState() {
    return this.state
  }

  remember(key, value) {
    this.memory.set(key, value)
  }

  recall(key) {
    return this.memory.get(key)
  }

  forget(key) {
    this.memory.delete(key)
  }

  clearMemory() {
    this.memory.clear()
  }

  async actionAi(prompt) {
    return await this.ai.chat(prompt, registry)
  }

  getStatus() {
    return {
      state: this.state,
      currentTask: this.currentTask,
      memory: this.memory,
      tasks: this.tasks
    }
  }
}

module.exports = AgentCore
