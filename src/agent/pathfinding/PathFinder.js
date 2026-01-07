const { GoalNear } = require('mineflayer-pathfinder').goals

class PathFinder {
  constructor(bot) {
    this.bot = bot
  }

  async goTo(position) {
    try {
      const goal = new GoalNear(position.x, position.y, position.z, 1)
      await this.bot.pathfinder.goto(goal)
      return true
    } catch (error) {
      console.error('Pathfinding failed:', error.message)
      throw error
    }
  }
}

module.exports = PathFinder
