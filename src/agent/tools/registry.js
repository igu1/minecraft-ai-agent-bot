const registry = [
  {
    type: 'function',
    function: {
      name: 'follow',
      description: 'Follow a user by ID',
      parameters: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          distance: { type: 'number' },
          duration: { type: 'number' }
        },
        required: ['user_id', 'distance', 'duration']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'nearby_items',
      description: 'Get items near the bot',
      parameters: {
        type: 'object',
        properties: {
          radius: { type: 'number' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'all_items',
      description: 'Get all items in inventory'
    }
  },
  {
    type: 'function',
    function: {
      name: 'drop_item',
      description: 'Drop item from inventory',
      parameters: {
        type: 'object',
        properties: {
          item_name: { type: 'string' },
          count: { type: 'number' },
          slot: { type: 'number' }
        },
        required: ['item_name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'sort_inventory',
      description: 'Sort inventory items',
      parameters: {
        type: 'object',
        properties: {
          rule: { type: 'string' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'chat',
      description: 'Send a chat message to communicate with players',
      parameters: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          target: { type: 'string' }
        },
        required: ['message']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'move_to_user',
      description: 'Move to a specific user location',
      parameters: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          distance: { type: 'number' }
        },
        required: ['user_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'look_at_user',
      description: 'Look at a specific user',
      parameters: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'find_nearby_blocks',
      description: 'Find specific blocks near the bot',
      parameters: {
        type: 'object',
        properties: {
          block_type: { type: 'string' },
          radius: { type: 'number' }
        },
        required: ['block_type']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'move_to_coordinates',
      description: 'Move to specific coordinates',
      parameters: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        },
        required: ['x', 'y', 'z']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'attack_entity',
      description: 'Attack a nearby entity (mob, animal, etc)',
      parameters: {
        type: 'object',
        properties: {
          entity_type: { type: 'string' },
          range: { type: 'number' }
        },
        required: ['entity_type']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'dig_block',
      description: 'Dig/mine a specific block',
      parameters: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        },
        required: ['x', 'y', 'z']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'place_block',
      description: 'Place a block at specific coordinates',
      parameters: {
        type: 'object',
        properties: {
          block_type: { type: 'string' },
          x: { type: 'number' },
          y: { type: 'number' },
          z: { type: 'number' }
        },
        required: ['block_type', 'x', 'y', 'z']
      }
    }
  }
]

module.exports = { registry }
