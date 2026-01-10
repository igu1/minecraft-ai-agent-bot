const { GoalNear } = require('mineflayer-pathfinder').goals
const BaseAction = require('./BaseAction')

class FollowAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.target = null
    this.interval = null
  }

  async execute(args) {
    return await this.follow(args.user_id, args.distance, args.duration)
  }

  async follow(userId, distance, duration) {
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
      if (!this.target || this.bot.entity.position.distanceTo(this.target.position) > distance) {
        this.move(distance)
      }
    }, 1000)
    
    return { success: true, target: target.username, message: `Ok, I am following ${target.username}!` }
  }

  async move(distance) {
    if (!this.target || this.bot.pathfinder.isMoving()) return
    
    try {
      const goal = new GoalNear(this.target.position.x, this.target.position.y, this.target.position.z, distance)
      this.bot.pathfinder.setGoal(goal)
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
