class InventoryManager {
  constructor(bot) {
    this.bot = bot
    this.desiredItems = new Map()
    this.sortingRules = new Map()
  }

  addItemGoal(itemName, quantity, priority = 1) {
    this.desiredItems.set(itemName, { quantity, priority })
  }

  getCurrentItemCount(itemName) {
    const items = this.bot.inventory.items().filter(item => 
      item.name === itemName
    )
    
    return items.reduce((total, item) => total + item.count, 0)
  }

  findNearestItem(itemName, range = 32) {
    let nearestItem = null
    let nearestDistance = Infinity
    
    for (const entity of Object.values(this.bot.entities)) {
      if (entity.name === itemName) {
        const distance = this.bot.entity.position.distanceTo(entity.position)
        if (distance < range && distance < nearestDistance) {
          nearestDistance = distance
          nearestItem = entity
        }
      }
    }
    
    return nearestItem
  }

  async collectItem(item) {
    if (!item) return false

    try {
      await this.bot.pathfinder.setGoal(
        new this.bot.pathfinder.goals.GoalNear(item.position.x, item.position.y, item.position.z, 1)
      )
      
      await this.sleep(500)
      
      const collected = this.getCurrentItemCount(item.name) > 0
      return collected
    } catch (error) {
      console.error(`Failed to collect ${item.name}:`, error.message)
      return false
    }
  }

  async organizeInventory() {
    const items = this.bot.inventory.items()
    const slots = {}
    
    items.forEach(item => {
      const category = this.getItemCategory(item.name)
      if (!slots[category]) {
        slots[category] = []
      }
      slots[category].push(item)
    })

    for (const [category, categoryItems] of Object.entries(slots)) {
      categoryItems.sort((a, b) => {
        const priorityA = this.getItemPriority(a.name)
        const priorityB = this.getItemPriority(b.name)
        return priorityB - priorityA
      })
    }
  }

  getItemCategory(itemName) {
    const categories = {
      'tools': ['pickaxe', 'axe', 'shovel', 'sword', 'hoe'],
      'weapons': ['sword', 'bow', 'crossbow', 'trident'],
      'armor': ['helmet', 'chestplate', 'leggings', 'boots'],
      'food': ['bread', 'apple', 'carrot', 'potato', 'meat', 'fish'],
      'blocks': ['dirt', 'stone', 'wood', 'plank', 'cobblestone'],
      'resources': ['coal', 'iron', 'gold', 'diamond', 'emerald']
    }
    
    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => itemName.includes(item))) {
        return category
      }
    }
    
    return 'misc'
  }

  getItemPriority(itemName) {
    const priorities = {
      'diamond_pickaxe': 10,
      'diamond_sword': 9,
      'iron_pickaxe': 8,
      'iron_sword': 7,
      'bow': 6,
      'bread': 5,
      'cooked_beef': 5,
      'apple': 3
    }
    
    return priorities[itemName] || 1
  }

  async equipBestTool(blockType) {
    const tools = this.bot.inventory.items().filter(item => {
      if (blockType.includes('wood') && item.name.includes('axe')) return true
      if (blockType.includes('stone') && item.name.includes('pickaxe')) return true
      if (blockType.includes('dirt') && item.name.includes('shovel')) return true
      return false
    })
    
    if (tools.length > 0) {
      const bestTool = tools.reduce((best, current) => {
        const materialPriority = { 'diamond': 3, 'iron': 2, 'stone': 1, 'wood': 0 }
        const currentMaterial = Object.keys(materialPriority).find(m => current.name.includes(m))
        const bestMaterial = Object.keys(materialPriority).find(m => best.name.includes(m))
        
        return materialPriority[currentMaterial] > materialPriority[bestMaterial] ? current : best
      })
      
      await this.bot.equip(bestTool, 'hand')
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = InventoryManager
