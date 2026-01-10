const { GoalNear } = require('mineflayer-pathfinder').goals
const BaseAction = require('./BaseAction')

class MoveToUserAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.targetUser = null
    this.distance = 2
    this.moving = false
  }

  async execute(args) {
    try {
      this.targetUser = args.user_id
      this.distance = args.distance || 2
      this.moving = true

      const target = this.bot.players[this.targetUser]
      if (!target) {
        return { success: false, error: `User ${this.targetUser} not found` }
      }

      if (this.bot.pathfinder.isMoving()) {
        this.bot.pathfinder.stop()
        await new Promise(resolve => setTimeout(resolve, 500)) 
      }

      const goal = new GoalNear(target.entity.position.x, target.entity.position.y, target.entity.position.z, this.distance)
      await this.bot.pathfinder.goto(goal, { timeout: 10000 })
      
      this.moving = false
      this.completed = true
      
      return { 
        success: true, 
        message: `Moved to ${this.targetUser}`,
        distance: this.distance
      }
      
    } catch (error) {
      console.error('MoveToUser action error:', error)
      this.moving = false
      this.completed = true
      
      // Handle specific pathfinder errors gracefully
      if (error.message.includes('PathStopped') || error.message.includes('goal was not reached')) {
        return { 
          success: false, 
          error: `Could not reach ${this.targetUser}. Path was blocked or interrupted.`
        }
      }
      
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.moving = false
    this.completed = true
    if (this.bot.pathfinder) {
      this.bot.pathfinder.stop()
    }
  }

  getStatus() {
    return {
      action: 'move_to_user',
      targetUser: this.targetUser,
      distance: this.distance,
      moving: this.moving,
      completed: this.completed
    }
  }
}

class LookAtUserAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.targetUser = null
    this.looking = false
  }

  async execute(args) {
    try {
      this.targetUser = args.user_id
      this.looking = true

      const target = this.bot.players[this.targetUser]
      if (!target) {
        return { success: false, error: `User ${this.targetUser} not found` }
      }

      // Look at the player
      this.bot.lookAt(target.entity.position.offset(0, target.entity.height, 0))
      
      this.looking = false
      this.completed = true
      
      return { 
        success: true, 
        message: `Looking at ${this.targetUser}`
      }
      
    } catch (error) {
      console.error('LookAtUser action error:', error)
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.looking = false
    this.completed = true
  }

  getStatus() {
    return {
      action: 'look_at_user',
      targetUser: this.targetUser,
      looking: this.looking,
      completed: this.completed
    }
  }
}

class FindNearbyBlocksAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.blockType = ''
    this.radius = 10
    this.blocks = []
  }

  async execute(args) {
    try {
      this.blockType = args.block_type
      this.radius = args.radius || 10
      this.blocks = []

      // Find blocks of specified type
      const blocks = this.bot.findBlocks({
        matching: this.bot.registry.blocksByName[this.blockType]?.id,
        maxDistance: this.radius,
        count: 50
      })

      this.blocks = blocks.map(block => ({
        x: block.x,
        y: block.y,
        z: block.z,
        distance: Math.floor(this.bot.entity.position.distanceTo(block))
      }))

      this.completed = true
      
      return { 
        success: true, 
        message: `Found ${this.blocks.length} ${this.blockType} blocks`,
        blocks: this.blocks,
        count: this.blocks.length
      }
      
    } catch (error) {
      console.error('FindNearbyBlocks action error:', error)
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.completed = true
  }

  getStatus() {
    return {
      action: 'find_nearby_blocks',
      blockType: this.blockType,
      radius: this.radius,
      blocks: this.blocks,
      completed: this.completed
    }
  }
}

class MoveToCoordinatesAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.targetPos = null
    this.moving = false
  }

  async execute(args) {
    try {
      this.targetPos = { x: args.x, y: args.y, z: args.z }
      this.moving = true

      // Stop any existing pathfinder movement and wait a bit
      if (this.bot.pathfinder.isMoving()) {
        this.bot.pathfinder.stop()
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms for pathfinder to stop
      }

      // Move to coordinates using GoalNear
      const goal = new GoalNear(args.x, args.y, args.z, 1)
      await this.bot.pathfinder.goto(goal, { timeout: 10000 })
      
      this.moving = false
      this.completed = true
      
      return { 
        success: true, 
        message: `Moved to coordinates (${args.x}, ${args.y}, ${args.z})`,
        position: this.targetPos
      }
      
    } catch (error) {
      console.error('MoveToCoordinates action error:', error)
      this.moving = false
      this.completed = true
      
      if (error.message.includes('PathStopped') || error.message.includes('goal was not reached')) {
        return { 
          success: false, 
          error: `Could not reach coordinates (${args.x}, ${args.y}, ${args.z}). Path was blocked or interrupted.`
        }
      }
      
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.moving = false
    this.completed = true
    if (this.bot.pathfinder) {
      this.bot.pathfinder.stop()
    }
  }

  getStatus() {
    return {
      action: 'move_to_coordinates',
      targetPos: this.targetPos,
      moving: this.moving,
      completed: this.completed
    }
  }
}

class AttackEntityAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.entityType = ''
    this.range = 5
    this.attacking = false
  }

  async execute(args) {
    try {
      this.entityType = args.entity_type
      this.range = args.range || 5
      this.attacking = true

      const entities = Object.values(this.bot.entities).filter(entity => 
        entity.name && entity.name.toLowerCase().includes(this.entityType.toLowerCase()) &&
        this.bot.entity.position.distanceTo(entity.position) <= this.range
      )

      if (entities.length === 0) {
        return { success: false, error: `No ${this.entityType} found within ${this.range} blocks` }
      }

      const target = entities[0]
      await this.bot.attack(target)
      
      this.attacking = false
      this.completed = true
      
      return { 
        success: true, 
        message: `Attacked ${target.name}`,
        entity: target.name,
        damage: 'unknown'
      }
      
    } catch (error) {
      console.error('AttackEntity action error:', error)
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.attacking = false
    this.completed = true
  }

  getStatus() {
    return {
      action: 'attack_entity',
      entityType: this.entityType,
      range: this.range,
      attacking: this.attacking,
      completed: this.completed
    }
  }
}

class DigBlockAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.targetPos = null
    this.digging = false
  }

  async execute(args) {
    try {
      this.targetPos = { x: args.x, y: args.y, z: args.z }
      this.digging = true

      const block = this.bot.blockAt(this.targetPos)
      if (!block || block.type === 0) {
        return { success: false, error: 'No block at specified coordinates' }
      }

      // Dig the block
      await this.bot.dig(block)
      
      this.digging = false
      this.completed = true
      
      return { 
        success: true, 
        message: `Dug ${block.name} at (${args.x}, ${args.y}, ${args.z})`,
        block: block.name,
        position: this.targetPos
      }
      
    } catch (error) {
      console.error('DigBlock action error:', error)
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.digging = false
    this.completed = true
    if (this.bot.isDigging) {
      this.bot.stopDigging()
    }
  }

  getStatus() {
    return {
      action: 'dig_block',
      targetPos: this.targetPos,
      digging: this.digging,
      completed: this.completed
    }
  }
}

class PlaceBlockAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.blockType = ''
    this.targetPos = null
    this.placing = false
  }

  async execute(args) {
    try {
      this.blockType = args.block_type
      this.targetPos = { x: args.x, y: args.y, z: args.z }
      this.placing = true

      // Find the block in inventory
      const item = this.bot.inventory.findInventoryItem(this.bot.registry.blocksByName[this.blockType]?.id)
      if (!item) {
        return { success: false, error: `No ${this.blockType} found in inventory` }
      }

      // Place the block
      const referenceBlock = this.bot.blockAt(this.targetPos)
      await this.bot.placeBlock(referenceBlock, this.targetPos)
      
      this.placing = false
      this.completed = true
      
      return { 
        success: true, 
        message: `Placed ${this.blockType} at (${args.x}, ${args.y}, ${args.z})`,
        block: this.blockType,
        position: this.targetPos
      }
      
    } catch (error) {
      console.error('PlaceBlock action error:', error)
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.placing = false
    this.completed = true
  }

  getStatus() {
    return {
      action: 'place_block',
      blockType: this.blockType,
      targetPos: this.targetPos,
      placing: this.placing,
      completed: this.completed
    }
  }
}

module.exports = {
  MoveToUserAction,
  LookAtUserAction,
  FindNearbyBlocksAction,
  MoveToCoordinatesAction,
  AttackEntityAction,
  DigBlockAction,
  PlaceBlockAction
}
