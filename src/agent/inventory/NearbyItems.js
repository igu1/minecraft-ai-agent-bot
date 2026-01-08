const Action = require('../Action')

class NearbyItems extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
  }

  async execute(args) {
    const { radius = 16 } = args
    return await this.getNearbyItems(radius)
  }

  async getNearbyItems(radius = 16) {
    try {
      const nearbyObjects = this.bot.nearestEntities((entity) => {
        return entity.position && this.bot.entity.position.distanceTo(entity.position) <= radius
      })

      const items = nearbyObjects.map(entity => ({
        name: entity.name || entity.displayName || 'Unknown',
        type: entity.type || 'entity',
        position: entity.position,
        distance: this.bot.entity.position.distanceTo(entity.position),
        id: entity.id
      }))

      if (items.length === 0) {
        this.bot.chat(`🔍 I don't see any items within ${radius} blocks of me.`)
      } else {
        this.bot.chat(`✅ Found ${items.length} items nearby within ${radius} blocks!`)
        items.slice(0, 3).forEach(item => {
          this.bot.chat(`  • ${item.name} (${Math.round(item.distance)} blocks away)`)
        })
        if (items.length > 3) {
          this.bot.chat(`  ... and ${items.length - 3} more items!`)
        }
      }

      console.log(`Found ${items.length} nearby items within ${radius} blocks`)
      return { success: true, items, radius, total: items.length }
    } catch (error) {
      console.error('Get nearby items failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble seeing what's nearby. Let me try again in a moment!`)
      return { success: false, error: error.message }
    }
  }

  stop() {
    console.log('Nearby items scan stopped')
  }

  getStatus() {
    return {
      isScanning: false,
      lastScanRadius: this.lastRadius || null
    }
  }
}

module.exports = NearbyItems
