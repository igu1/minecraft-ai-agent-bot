const { GoalNear } = require('mineflayer-pathfinder').goals
const Action = require('../../Action')

class FollowAction extends Action {
  constructor(bot) {
    super(bot)
    this.target = null
    this.interval = null
  }

  async execute(args) {
    return await this.follow(args.user_id)
  }

  async follow(userId) {
    this.stop()
    
    const target = this.bot.players[userId]?.entity
    if (!target) throw new Error(`Player ${userId} not found`)
    
    this.target = target
    console.log(`Following ${target.username}`)
    
    this.interval = setInterval(() => {
      if (!this.target || this.bot.entity.position.distanceTo(this.target.position) > 3) {
        this.move()
      }
    }, 1000)
  }

  async move() {
    if (!this.target || this.bot.pathfinder.isMoving()) return
    
    try {
      const goal = new GoalNear(this.target.position.x, this.target.position.y, this.target.position.z, 3)
      await this.bot.pathfinder.goto(goal)
    } catch (error) {
      console.error('Follow failed:', error.message)
    }
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
    this.target = null
    if (this.bot.pathfinder.isMoving()) this.bot.pathfinder.stop()
  }

  getStatus() {
    return {
      isFollowing: !!this.target,
      target: this.target?.username || null,
      distance: this.target ? this.bot.entity.position.distanceTo(this.target.position) : null
    }
  }
}

module.exports = FollowAction