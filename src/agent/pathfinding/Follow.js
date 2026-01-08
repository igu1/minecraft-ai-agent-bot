const { GoalNear } = require('mineflayer-pathfinder').goals
const Action = require('../Action')

class FollowAction extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.target = null
    this.interval = null
  }

  async execute(args) {
    return await this.follow(args.user_id)
  }

  async follow(userId) {
    this.stop()
    
    const target = this.bot.players[userId]?.entity
    if (!target) {
      this.bot.chat(`❌ I can't find ${userId}. Are you nearby?`)
      return { success: false, error: `Player ${userId} not found` }
    }
    
    this.target = target
    this.setState('following')
    this.completed = false
    
    console.log(`Following ${target.username}`)
    this.bot.chat(`✅ Now following ${target.username}!`)
    
    this.interval = setInterval(() => {
      if (!this.target || this.bot.entity.position.distanceTo(this.target.position) > 3) {
        this.move()
      }
    }, 1000)
    
    return { success: true, target: target.username }
  }

  async move() {
    if (!this.target || this.bot.pathfinder.isMoving()) return
    
    try {
      const goal = new GoalNear(this.target.position.x, this.target.position.y, this.target.position.z, 3)
      await this.bot.pathfinder.goto(goal)
    } catch (error) {
      console.error('Follow failed:', error.message)
      this.bot.chat(`🚧 Oops! I'm having trouble reaching ${this.target.username}. There might be something in the way.`)
    }
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
    this.target = null
    this.completed = true
    this.setState('idle')
    if (this.bot.pathfinder.isMoving()) this.bot.pathfinder.stop()
  }

  getStatus() {
    return {
      isFollowing: !!this.target,
      target: this.target?.username || null,
      distance: this.target ? this.bot.entity.position.distanceTo(this.target.position) : null,
      state: this.getState(),
      completed: this.completed
    }
  }
}

module.exports = FollowAction