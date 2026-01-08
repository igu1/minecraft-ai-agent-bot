const Action = require('../Action')

class DropItem extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
  }

  async execute(args) {
    const { item_name, count = 1, slot } = args
    return await this.dropItem(item_name, count, slot)
  }

  async dropItem(itemName, count = 1, slot = null) {
    try {
      let itemToDrop
      
      if (slot !== null) {
        itemToDrop = this.bot.inventory.slots[slot]
        if (!itemToDrop || itemToDrop.name !== itemName) {
          this.bot.chat(`❌ I don't have ${itemName} in slot ${slot}.`)
          return { success: false, error: `Item ${itemName} not found in slot ${slot}` }
        }
      } else {
        itemToDrop = this.bot.inventory.findInventoryItem(itemName)
        if (!itemToDrop) {
          this.bot.chat(`❌ I don't have any ${itemName} to drop.`)
          return { success: false, error: `Item ${itemName} not found in inventory` }
        }
      }

      const actualCount = Math.min(count, itemToDrop.count)
      await this.bot.toss(itemName, null, actualCount)
      
      this.bot.chat(`✅ Dropped ${actualCount}x ${itemName}!`)
      console.log(`Dropped ${actualCount}x ${itemName}`)
      return { success: true, item: itemName, dropped: actualCount }
    } catch (error) {
      console.error('Drop item failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble dropping ${itemName}. Let me try again!`)
      return { success: false, error: error.message }
    }
  }

  stop() {
    console.log('Drop item action stopped')
  }

  getStatus() {
    return {
      isDropping: false,
      lastDropped: this.lastDropped || null
    }
  }
}

module.exports = DropItem
