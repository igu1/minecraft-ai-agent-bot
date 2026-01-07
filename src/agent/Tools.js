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
        name: 'stop',
        description: 'Stop what is doing'
      }
  }
]

module.exports = { registry }