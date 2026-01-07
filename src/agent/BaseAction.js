
class BaseAction {
  constructor(bot) {
    if (this.constructor === BaseAction) {
      throw new Error("BaseAction is an abstract class and cannot be instantiated directly")
    }
    this.bot = bot
  }

  getTools() {
    throw new Error("getStatus method must be implemented by subclass")
  }
}

module.exports = BaseAction
