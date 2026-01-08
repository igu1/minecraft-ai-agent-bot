const Action = require('../Action')

class SortInventory extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.sortingRules = new Map([
      ['tools', ['diamond_pickaxe', 'iron_pickaxe', 'stone_pickaxe', 'wooden_pickaxe']],
      ['weapons', ['diamond_sword', 'iron_sword', 'stone_sword', 'wooden_sword']],
      ['food', ['bread', 'apple', 'carrot', 'potato', 'beef', 'porkchop']],
      ['blocks', ['dirt', 'stone', 'wood', 'planks', 'cobblestone']],
      ['materials', ['stick', 'coal', 'iron_ingot', 'gold_ingot', 'diamond']]
    ])
  }

  async execute(args) {
    const { rule = 'default' } = args
    return await this.sortInventory(rule)
  }

  async sortInventory(rule = 'default') {
    try {
      const items = this.bot.inventory.items()
      
      if (items.length === 0) {
        this.bot.chat(`🎒 My inventory is empty, nothing to sort!`)
        return { success: true, rule, itemsSorted: 0 }
      }

      const sortedSlots = this.calculateSortedSlots(items, rule)
      
      for (const [fromSlot, toSlot] of sortedSlots) {
        if (fromSlot !== toSlot) {
          await this.bot.moveSlotItem(fromSlot, toSlot)
        }
      }

      this.bot.chat(`✅ Organized my inventory using ${rule} sorting!`)
      console.log(`Inventory sorted using rule: ${rule}`)
      return { success: true, rule, itemsSorted: sortedSlots.length }
    } catch (error) {
      console.error('Sort inventory failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble organizing my inventory. Let me try again!`)
      return { success: false, error: error.message }
    }
  }

  calculateSortedSlots(items, rule) {
    const sortedSlots = []
    const categories = this.sortingRules.get(rule) || this.getDefaultCategories()
    
    items.forEach((item, index) => {
      const categoryIndex = this.findCategory(item.name, categories)
      const targetSlot = categoryIndex * 9 + (index % 9)
      sortedSlots.push([item.slot, targetSlot])
    })

    return sortedSlots
  }

  findCategory(itemName, categories) {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].includes(itemName)) {
        return i
      }
    }
    return categories.length - 1
  }

  getDefaultCategories() {
    return [
      ['diamond_pickaxe', 'iron_pickaxe', 'stone_pickaxe'],
      ['diamond_sword', 'iron_sword', 'stone_sword'],
      ['bread', 'apple', 'carrot', 'potato'],
      ['dirt', 'stone', 'wood', 'cobblestone'],
      ['stick', 'coal', 'iron_ingot', 'gold_ingot']
    ]
  }

  stop() {
    console.log('Sort inventory stopped')
  }

  getStatus() {
    return {
      isSorting: false,
      lastRule: this.lastRule || null
    }
  }
}

module.exports = SortInventory
