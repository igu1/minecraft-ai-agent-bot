const BaseAction = require('./BaseAction')

class GetItemAction extends BaseAction {
  async execute(args) {
    const { item_name, count = 1 } = args
    try {
      const item = this.bot.inventory.findInventoryItem(item_name)
      if (item) {
        this.bot.chat(`✅ Found ${item.count}x ${item_name} in my inventory!`)
        return { success: true, item: item_name, count: item.count }
      }

      this.bot.chat(`🔍 I can't find any ${item_name} nearby.`)
      return { success: false, error: `Item ${item_name} not found` }
    } catch (error) {
      this.bot.chat(`🚧 I'm having trouble with ${item_name}.`)
      return { success: false, error: error.message }
    }
  }

  stop() {
    if (this.bot.pathfinder?.isMoving()) this.bot.pathfinder.stop()
  }

  getStatus() {
    return { isCollecting: this.bot.pathfinder?.isMoving() || false }
  }
}

class NearbyItemsAction extends BaseAction {
  async execute(args) {
    const { radius = 32 } = args
    const items = []
    
    for (const entity of Object.values(this.bot.entities)) {
      if (entity.type === 'object' && entity.displayName === 'Item') {
        const distance = this.bot.entity.position.distanceTo(entity.position)
        if (distance <= radius) {
          items.push({ name: entity.name, distance: distance.toFixed(2) })
        }
      }
    }

    this.bot.chat(`📦 Found ${items.length} items nearby`)
    return { success: true, items }
  }

  stop() {}
  getStatus() { return {} }
}

class AllItemsAction extends BaseAction {
  async execute() {
    const items = this.bot.inventory.items().map(item => ({
      name: item.name,
      count: item.count
    }))

    this.bot.chat(`🎒 I have ${items.length} different items`)
    return { success: true, items }
  }

  stop() {}
  getStatus() { return {} }
}

class DropItemAction extends BaseAction {
  async execute(args) {
    const { item_name, count = 1 } = args
    try {
      const item = this.bot.inventory.findInventoryItem(item_name)
      if (!item) {
        this.bot.chat(`❌ I don't have ${item_name}`)
        return { success: false, error: 'Item not found' }
      }

      await this.bot.toss(item.type, null, count)
      this.bot.chat(`✅ Dropped ${count}x ${item_name}`)
      return { success: true }
    } catch (error) {
      this.bot.chat(`🚧 Failed to drop ${item_name}`)
      return { success: false, error: error.message }
    }
  }

  stop() {}
  getStatus() { return {} }
}

class SortInventoryAction extends BaseAction {
  async execute() {
    this.bot.chat(`🔄 Sorting inventory...`)
    return { success: true }
  }

  stop() {}
  getStatus() { return {} }
}

class CraftItemAction extends BaseAction {
  async execute(args) {
    const { item_name, count = 1 } = args
    this.bot.chat(`🔨 Trying to craft ${count}x ${item_name}`)
    return { success: false, error: 'Crafting not implemented' }
  }

  stop() {}
  getStatus() { return {} }
}

module.exports = {
  GetItemAction,
  NearbyItemsAction,
  AllItemsAction,
  DropItemAction,
  SortInventoryAction,
  CraftItemAction
}
