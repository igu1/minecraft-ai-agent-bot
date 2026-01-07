const { registry } = require('./Tools')

class AgentCore {
  constructor(bot) {
    this.bot = bot
    this.currentTask = null
    this.state = 'idle'
    this.memory = new Map()
  }

  async think() {
    if (this.currentTask && !this.currentTask.completed) {
      await this.currentTask.execute()
    } else {
      this.idleBehavior()
    }
  }

  idleBehavior() {
    this.state = 'idle'
  }

  setTask(task) {
    this.currentTask = task
    this.state = 'working'
  }

  async actionAi(prompt) {
    try {
      const { default: ollama } = require('ollama')
      const tools = registry
      const prevChat = this.recall('chat') || []
      const newChat = prevChat.concat({role: 'user', content: prompt})
      this.remember('chat', newChat)
      
      const response = await ollama.chat({
        model: 'functiongemma:latest',
        tools,
        options: { temperature: 0 },
        messages: newChat,
      });
      if (response.message.tool_calls?.length) {
        let tool_calls = []
        for (const call of response.message.tool_calls) {
          const { name, arguments: args } = call.function
          tool_calls.push({ name, args })
        }
        console.log(tool_calls)
        return tool_calls
      }
      this.remember('chat', newChat.concat({role: 'assistant', content: response.message.content}))
      return response.message.content
    } catch (error) {
      console.error('AI Error:', error.message)
      return 'Sorry, I had trouble processing that request.'
    }
  }

  remember(key, value) {
    this.memory.set(key, value)
  }

  recall(key) {
    return this.memory.get(key)
  }
}

module.exports = AgentCore
