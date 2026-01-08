const Action = require('../Action')

class CraftItem extends Action {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.recipes = new Map([
      ['planks', { recipe: [{ type: 'wood', count: 1 }], result: 'planks', count: 4 }],
      ['sticks', { recipe: [{ type: 'planks', count: 2 }], result: 'sticks', count: 4 }],
      ['torch', { recipe: [{ type: 'coal', count: 1 }, { type: 'stick', count: 1 }], result: 'torch', count: 4 }],
      ['crafting_table', { recipe: [{ type: 'planks', count: 4 }], result: 'crafting_table', count: 1 }]
    ])
  }

  async execute(args) {
    const { item_name, count = 1 } = args
    return await this.craftItem(item_name, count)
  }

  async craftItem(itemName, count = 1) {
    try {
      const recipe = this.recipes.get(itemName)
      if (!recipe) {
        this.bot.chat(`❌ I don't know how to craft ${itemName}. I don't have the recipe for it!`)
        return { success: false, error: `No recipe found for ${itemName}` }
      }

      const canCraft = await this.checkIngredients(recipe.recipe, count)
      if (!canCraft) {
        const neededIngredients = recipe.recipe.map(ing => `${ing.count}x ${ing.type}`).join(', ')
        this.bot.chat(`❌ I need ${neededIngredients} to craft ${count}x ${itemName}, but I don't have enough materials!`)
        return { success: false, error: `Insufficient ingredients to craft ${count}x ${itemName}` }
      }

      await this.performCrafting(recipe, count)
      
      this.bot.chat(`✅ Successfully crafted ${count}x ${itemName}!`)
      console.log(`Crafted ${count}x ${itemName}`)
      return { success: true, item: itemName, crafted: count }
    } catch (error) {
      console.error('Craft item failed:', error.message)
      this.bot.chat(`🚧 I'm having trouble crafting ${itemName}. Maybe I need a crafting table nearby?`)
      return { success: false, error: error.message }
    }
  }

  async checkIngredients(ingredients, multiplier) {
    for (const ingredient of ingredients) {
      const required = ingredient.count * multiplier
      const available = this.getItemCount(ingredient.type)
      
      if (available < required) {
        return false
      }
    }
    return true
  }

  getItemCount(itemName) {
    const items = this.bot.inventory.items().filter(item => item.name === itemName)
    return items.reduce((total, item) => total + item.count, 0)
  }

  async performCrafting(recipe, count) {
    for (let i = 0; i < count; i++) {
      await this.bot.craft(recipe.result, 1, null, recipe.recipe)
    }
  }

  stop() {
    console.log('Craft item action stopped')
  }

  getStatus() {
    return {
      isCrafting: false,
      lastCrafted: this.lastCrafted || null
    }
  }
}

module.exports = CraftItem
