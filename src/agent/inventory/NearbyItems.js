const Action = require('../Action')
const { GoalNear } = require('mineflayer-pathfinder').goals

class NearbyItems extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.interval = null
    this.lastScanRadius = null
    this.isScanning = false
    this.isCollecting = false
  }

  async execute(args) {
    const { radius = 16 } = args
    this.lastScanRadius = radius
    this.startAutoScan(radius)
    return await this.getNearbyItems(radius)
  }

  startAutoScan(radius) {
    if (this.interval) clearInterval(this.interval)
    
    this.isScanning = true
    this.setState('scanning')
    
    this.interval = setInterval(async () => {
      await this.autoScan(radius)
    }, 1000)
  }

  async autoScan(radius) {
    try {
      // Skip if already collecting items
      if (this.isCollecting) return
      
      const nearbyObjects = Object.values(this.bot.entities).filter(entity => {
        return entity.position && this.bot.entity.position.distanceTo(entity.position) <= radius
      })

      // Filter for item entities (not players, mobs, etc.)
      const itemEntities = nearbyObjects.filter(entity => 
        entity.name === 'item' || (entity.object && entity.object.type === 'item')
      )

      if (itemEntities.length > 0) {
        this.bot.chat(`🔍 Found ${itemEntities.length} items nearby!`)
        this.isCollecting = true
        await this.collectItems(itemEntities.map(entity => ({
          name: entity.name || entity.displayName || 'Unknown',
          type: entity.type || 'entity',
          position: entity.position,
          distance: this.bot.entity.position.distanceTo(entity.position),
          id: entity.id
        })))
        this.isCollecting = false
      }
    } catch (error) {
      console.error('Auto scan failed:', error.message)
      this.isCollecting = false
    }
  }

  async getNearbyItems(radius = 16) {
    try {
      const nearbyObjects = Object.values(this.bot.entities).filter(entity => {
        return entity.position && this.bot.entity.position.distanceTo(entity.position) <= radius
      })

      // Filter for item entities (not players, mobs, etc.)
      const itemEntities = nearbyObjects.filter(entity => 
        entity.name === 'item' || (entity.object && entity.object.type === 'item')
      )

      const items = itemEntities.map(entity => ({
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

        await this.collectItems(items)
      }

      console.log(`Found ${items.length} nearby items within ${radius} blocks`)
      return { success: true, items, radius, total: items.length }
    } catch (error) {
      console.error('Get nearby items failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble seeing what's nearby. Let me try again in a moment!`)
      return { success: false, error: error.message }
    }
  }

  async collectItems(items) {
    this.bot.chat(`🤏 Picking up ${items.length} items...`)
    
    for (const item of items) {
      try {
        if (item.distance > 2) {
          this.bot.chat(`🚶 Moving to ${item.name}...`)
          this.bot.pathfinder.setGoal(new GoalNear(item.position.x, item.position.y, item.position.z, 1))
          
          let attempts = 0
          while (this.bot.pathfinder.isMoving() && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 500))
            attempts++
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const nearbyAfter = Object.values(this.bot.entities).filter(entity => 
          entity.id === item.id && 
          entity.position && 
          this.bot.entity.position.distanceTo(entity.position) <= 2
        )
        
        this.bot.chat(nearbyAfter.length === 0 ? `✅ Picked up ${item.name}!` : `❌ Couldn't pick up ${item.name}`)
      } catch (error) {
        console.error(`Failed to collect ${item.name}:`, error.message)
        this.bot.chat(`🚧 Had trouble picking up ${item.name}`)
      }
    }
    
    if (this.bot.pathfinder.isMoving()) this.bot.pathfinder.stop()
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
    this.isScanning = false
    this.isCollecting = false
    this.setState('idle')
    if (this.bot.pathfinder.isMoving()) this.bot.pathfinder.stop()
    console.log('Nearby items scan stopped')
  }

  getStatus() {
    return {
      isScanning: this.isScanning,
      lastScanRadius: this.lastScanRadius || null,
      state: this.getState()
    }
  }
}

module.exports = NearbyItems
