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
        name: 'chat',
        description: 'Send a message to chat',
        parameters: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          required: ['message']
        }
      }
  },

]

module.exports = { registry }