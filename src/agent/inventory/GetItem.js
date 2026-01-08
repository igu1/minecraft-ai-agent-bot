const Action = require('../Action')

class GetItem extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
  }

  async execute(args) {
    const { item_name, count = 1 } = args
    return await this.getItem(item_name, count)
  }

  async getItem(itemName, count = 1) {
    try {
      const item = this.bot.inventory.findInventoryItem(itemName)
      if (item) {
        console.log(`Found ${itemName} in inventory: ${item.count} items`)
        this.bot.chat(`✅ Found ${item.count}x ${itemName} in my inventory!`)
        return { success: true, item: itemName, count: item.count, location: 'inventory' }
      }

      const nearbyItem = this.findNearbyItem(itemName, 32)
      if (nearbyItem) {
        await this.bot.pathfinder.goto(nearbyItem.position)
        await this.bot.collectBlock.collect(nearbyItem)
        console.log(`Collected ${itemName} from environment`)
        this.bot.chat(`✅ Picked up ${itemName} from nearby!`)
        return { success: true, item: itemName, count: 1, location: 'environment' }
      }

      this.bot.chat(`🔍 I can't find any ${itemName} nearby. Maybe look somewhere else?`)
      return { success: false, error: `Item ${itemName} not found` }
    } catch (error) {
      console.error('Get item failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble picking up ${itemName}. Something might be blocking me.`)
      return { success: false, error: error.message }
    }
  }

  findNearbyItem(itemName, radius = 32) {
    const nearbyObjects = this.bot.nearestEntities((entity) => {
      const distance = this.bot.entity.position.distanceTo(entity.position)
      const isInRange = distance <= radius
      const isTarget = entity.name === itemName || 
                      entity.displayName === itemName ||
                      entity.type === itemName
      return isInRange && isTarget
    })

    return nearbyObjects.length > 0 ? nearbyObjects[0] : null
  }

  stop() {
    if (this.bot.pathfinder.isMoving()) {
      this.bot.pathfinder.stop()
    }
    console.log('Get item action stopped')
  }

  getStatus() {
    return {
      isCollecting: this.bot.pathfinder.isMoving(),
      targetItem: this.currentItem || null
    }
  }
}

module.exports = GetItem
