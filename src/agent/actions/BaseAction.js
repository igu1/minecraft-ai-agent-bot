class BaseAction {
  constructor(bot, agent = null) {
    if (this.constructor === BaseAction) {
      throw new Error("BaseAction is abstract and cannot be instantiated")
    }
    this.bot = bot
    this.agent = agent
    this.completed = false
  }

  setAgent(agent) {
    this.agent = agent
  }

  async execute(...args) {
    throw new Error("execute method must be implemented")
  }

  stop() {
    throw new Error("stop method must be implemented")
  }

  getStatus() {
    throw new Error("getStatus method must be implemented")
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

module.exports = BaseAction
