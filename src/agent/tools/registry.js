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
      name: 'collect_wood',
      description: 'Collect wood from nearby trees',
      parameters: {
        type: 'object',
        properties: {
          radius: { type: 'number' },
          count: { type: 'number' }
        },
        required: []
      }
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
      name: 'go_to_player',
      description: 'Go to a specific player location',
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
      name: 'look_at_player',
      description: 'Look at a specific player',
      parameters: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      }
    }
  }
]

module.exports = { registry }
