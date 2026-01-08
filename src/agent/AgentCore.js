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
    this.currentTask = null
  }

  setTask(task) {
    if (this.currentTask && this.currentTask.stop) {
      this.currentTask.stop()
    }
    this.currentTask = task
    this.state = 'working'
  }

  stopCurrentTask() {
    if (this.currentTask && this.currentTask.stop) {
      this.currentTask.stop()
    }
    this.currentTask = null
    this.state = 'idle'
  }

  getCurrentTask() {
    return this.currentTask
  }

  getState() {
    return this.state
  }

  remember(key, value) {
    this.memory.set(key, value)
  }

  recall(key) {
    return this.memory.get(key)
  }

  forget(key) {
    this.memory.delete(key)
  }

  clearMemory() {
    this.memory.clear()
  }

  async actionAi(prompt) {
    try {
      const { default: ollama } = require('ollama')
      const tools = registry
      
      const response = await ollama.chat({
        model: 'functiongemma:latest',
        tools,
        options: { temperature: 0 },
        messages: [{role: 'user', content: prompt}],
      });
      
      if (response.message.tool_calls?.length) {
        let tool_calls = []
        for (const call of response.message.tool_calls) {
          const { name, arguments: args } = call.function
          tool_calls.push({ name, args })
        }
        //! TODO: FINETUNE THE AI
        return [{name: 'follow', args: {user_id: 'Eza'}}, {name: 'idle', args: {}}]
      
      }
      
      return response.message.content
    } catch (error) {
      console.error('AI Error:', error.message)
      return 'Sorry, I had trouble processing that request.'
    }
  }
}

module.exports = AgentCore
