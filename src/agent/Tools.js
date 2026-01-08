const registry = [
  {
      type: 'function',
      function: {
        name: 'follow',
        description: 'Follow a user by ID',
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
      name: 'get_item',
      description: 'Get specific item from environment',
      parameters: {
        type: 'object',
        properties: {
          item_name: { type: 'string' },
          count: { type: 'number' }
        },
        required: ['item_name']
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
      name: 'craft_item',
      description: 'Craft item using available materials',
      parameters: {
        type: 'object',
        properties: {
          item_name: { type: 'string' },
          count: { type: 'number' }
        },
        required: ['item_name']
      }
    }
  }
]

module.exports = { registry }