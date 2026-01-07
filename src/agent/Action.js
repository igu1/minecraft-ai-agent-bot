
class Action {
  constructor(bot) {
    if (this.constructor === Action) {
      throw new Error("Action is an abstract class and cannot be instantiated directly")
    }
    this.bot = bot
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
}

module.exports = Action
