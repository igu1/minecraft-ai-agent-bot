const Action = require('../Action')

class AllItems extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
  }

  async execute(args) {
    return await this.getAllItems()
  }

  async getAllItems() {
    try {
      const inventory = this.bot.inventory.items()
      const items = inventory.map(item => ({
        name: item.name,
        count: item.count,
        metadata: item.metadata,
        slot: item.slot,
        type: item.type,
        displayName: item.displayName
      }))

      const totalItems = items.reduce((sum, item) => sum + item.count, 0)
      
      if (items.length === 0) {
        this.bot.chat(`🎒 My inventory is completely empty!`)
      } else {
        this.bot.chat(`🎒 I have ${items.length} different items (${totalItems} total):`)
        items.slice(0, 5).forEach(item => {
          this.bot.chat(`  • ${item.count}x ${item.name}`)
        })
        if (items.length > 5) {
          this.bot.chat(`  ... and ${items.length - 5} more different items!`)
        }
      }
      
      console.log(`Inventory contains ${items.length} different items (${totalItems} total)`)
      return { success: true, items, total: items.length, totalItems }
    } catch (error) {
      console.error('Get all items failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble checking my inventory. Let me try again!`)
      return { success: false, error: error.message }
    }
  }

  stop() {
    console.log('All items scan stopped')
  }

  getStatus() {
    return {
      itemCount: this.bot.inventory.items().length,
      lastScan: this.lastScan || null
    }
  }
}

module.exports = AllItems
