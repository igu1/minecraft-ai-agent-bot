class CombatSystem {
  constructor(bot) {
    this.bot = bot
    this.target = null
    this.combatMode = false
    this.retreatThreshold = 5
  }

  findNearbyEnemies(range = 16) {
    const enemies = []
    
    for (const entity of Object.values(this.bot.entities)) {
      if (entity === this.bot.entity) continue
      
      const distance = this.bot.entity.position.distanceTo(entity.position)
      if (distance <= range && this.isHostile(entity)) {
        enemies.push({ entity, distance })
      }
    }
    
    return enemies.sort((a, b) => a.distance - b.distance)
  }

  isHostile(entity) {
    const hostileMobs = [
      'zombie', 'skeleton', 'spider', 'creeper', 'enderman',
      'witch', 'pillager', 'vindicator', 'ravager'
    ]
    
    return hostileMobs.some(mob => 
      entity.name && entity.name.toLowerCase().includes(mob)
    )
  }

  async attackTarget(target) {
    if (!target) return false

    try {
      const distance = this.bot.entity.position.distanceTo(target.position)
      
      if (distance > 4) {
        await this.bot.pathfinder.setGoal(
          new this.bot.pathfinder.goals.GoalNear(target.position.x, target.position.y, target.position.z, 2)
        )
      } else {
        await this.bot.attack(target)
      }
      
      return true
    } catch (error) {
      console.error('Attack failed:', error.message)
      return false
    }
  }

  async defend() {
    const enemies = this.findNearbyEnemies()
    
    if (enemies.length === 0) {
      this.combatMode = false
      this.target = null
      return false
    }

    this.combatMode = true
    this.target = enemies[0].entity
    
    const health = this.bot.health
    const maxHealth = this.bot.maxHealth
    
    if (health / maxHealth < 0.3) {
      await this.retreat()
    } else {
      await this.attackTarget(this.target)
    }
    
    return true
  }

  async retreat() {
    if (!this.target) return

    try {
      const retreatDirection = this.bot.entity.position.minus(this.target.position).normalize()
      const retreatPosition = this.bot.entity.position.plus(retreatDirection.scaled(10))
      
      await this.bot.pathfinder.setGoal(
        new this.bot.pathfinder.goals.GoalNear(retreatPosition.x, retreatPosition.y, retreatPosition.z, 2)
      )
    } catch (error) {
      console.error('Retreat failed:', error.message)
    }
  }

  equipBestWeapon() {
    const weapons = this.bot.inventory.items().filter(item => 
      item.name.includes('sword') || 
      item.name.includes('axe') ||
      item.name.includes('bow')
    )
    
    if (weapons.length > 0) {
      const bestWeapon = weapons.reduce((best, current) => {
        return (current.enchants?.length || 0) > (best.enchants?.length || 0) ? current : best
      })
      
      this.bot.equip(bestWeapon, 'hand')
    }
  }
}

module.exports = CombatSystem
