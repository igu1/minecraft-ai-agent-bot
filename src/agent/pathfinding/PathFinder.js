const BaseAction = require("../BaseAction")
const FollowAction = require("./Follow")

class PathFinder extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.bot = bot
    this.agent = agent
    this.fw = new FollowAction(this.bot, this.agent)
  }

  getTools() {
    const registry = {
      follow: this.fw
    }
    return registry
  }
}

module.exports = PathFinder
