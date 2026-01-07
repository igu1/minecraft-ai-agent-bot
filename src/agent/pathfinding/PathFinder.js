const BaseAction = require("../BaseAction")
const FollowAction = require("./action/follow")

class PathFinder extends BaseAction {
  constructor(bot) {
    super(bot);
    this.bot = bot;
    this.fw = new FollowAction(this.bot)
  }

  getTools() {
    const registry = {
      follow: this.fw,
    }
    return registry
  }

}

module.exports = PathFinder
