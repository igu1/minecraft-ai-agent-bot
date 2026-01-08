
class Action {
  constructor(bot, agent = null) {
    if (this.constructor === Action) {
      throw new Error("Action is an abstract class and cannot be instantiated directly")
    }
    this.bot = bot
    this.agent = agent
    this.completed = false
  }

  setAgent(agent) {
    this.agent = agent
  }

  async execute(...args) {
    throw new Error("execute method must be implemented by subclass")
  }

  stop() {
    throw new Error("stop method must be implemented by subclass")
  }

  getStatus() {
    throw new Error("getStatus method must be implemented by subclass")
  }

  setState(state) {
    if (this.agent) {
      this.agent.state = state
    }
  }

  getState() {
    return this.agent ? this.agent.getState() : 'unknown'
  }

  remember(key, value) {
    if (this.agent) {
      this.agent.remember(key, value)
    }
  }

  recall(key) {
    return this.agent ? this.agent.recall(key) : null
  }
}

module.exports = Action
