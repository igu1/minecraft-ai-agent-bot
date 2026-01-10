const { GoalNear } = require('mineflayer-pathfinder').goals
const BaseAction = require('./BaseAction')

class CollectWoodAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.radius = 20
    this.count = 5
    this.collecting = false
    this.woodBlocks = []
  }

  async execute(args) {
    try {
      this.radius = args.radius || 20
      this.count = args.count || 5
      this.collecting = true
      this.woodBlocks = []

      // Find wood blocks (logs) - use common wood block names
      const woodTypes = ['oak_log', 'birch_log', 'spruce_log', 'jungle_log', 'acacia_log', 'dark_oak_log', 'oak', 'birch', 'spruce', 'jungle', 'acacia', 'dark_oak']
      let foundBlocks = []

      for (const woodType of woodTypes) {
        try {
          const blockId = this.bot.registry.blocksByName[woodType]?.id
          if (blockId) {
            const blocks = this.bot.findBlocks({
              matching: blockId,
              maxDistance: this.radius,
              count: this.count
            })
            foundBlocks = foundBlocks.concat(blocks)
          }
        } catch (error) {
          continue // Skip invalid wood types
        }
      }

      if (foundBlocks.length === 0) {
        return { success: false, error: 'No wood blocks found nearby' }
      }

      // Collect wood from found blocks
      let collected = 0
      for (const block of foundBlocks.slice(0, this.count)) {
        if (collected >= this.count) break

        try {
          // Stop any existing pathfinder movement and wait a bit
          if (this.bot.pathfinder.isMoving()) {
            this.bot.pathfinder.stop()
            await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms for pathfinder to stop
          }

          // Move to the block
          const goal = new GoalNear(block.x, block.y, block.z, 1)
          await this.bot.pathfinder.goto(goal, { timeout: 5000 })

          // Dig the block
          const targetBlock = this.bot.blockAt(block)
          if (targetBlock && targetBlock.type !== 0) {
            try {
              await this.bot.dig(targetBlock)
              collected++
              this.woodBlocks.push({ x: block.x, y: block.y, z: block.z })
            } catch (digError) {
              console.error('Dig failed:', digError.message)
              continue
            }
          }

        } catch (error) {
          console.error('Failed to collect wood block:', error.message)
          // Continue to next block if this one fails
          continue
        }
      }

      this.collecting = false
      this.completed = true

      return {
        success: true,
        message: `Collected ${collected} wood blocks`,
        collected: collected,
        blocks: this.woodBlocks
      }

    } catch (error) {
      console.error('CollectWood action error:', error)
      this.collecting = false
      this.completed = true
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.collecting = false
    this.completed = true
    if (this.bot.pathfinder) {
      this.bot.pathfinder.stop()
    }
  }

  getStatus() {
    return {
      action: 'collect_wood',
      radius: this.radius,
      count: this.count,
      collecting: this.collecting,
      woodBlocks: this.woodBlocks,
      completed: this.completed
    }
  }
}

module.exports = CollectWoodAction
