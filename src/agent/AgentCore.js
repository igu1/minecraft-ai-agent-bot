const { registry } = require('./Tools')

class AgentCore {
  constructor(bot) {
    this.bot = bot
    this.currentTask = null
    this.state = 'idle'
    this.memory = new Map()
    this.tasks = []
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

  // ? Task management
  addTask(task) {
    this.tasks.push(task)
  }

  setTask(toolCall, actionObject) {
    this.stopCurrentTask()
    this.currentTask = actionObject
    this.currentTaskCall = toolCall
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

  // ? Memory management
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

  // ? AI management
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
        return [
          {name: 'follow', args: {user_id: 'Eza', distance: 2, duration: 30}},
        ]
      
      }
      
      return response.message.content
    } catch (error) {
      console.error('AI Error:', error.message)
      return 'Sorry, I had trouble processing that request.'
    }
  }

  getStatus(){
    return {
      state: this.state,
      currentTask: this.currentTask,
      memory: this.memory,
      tasks: this.tasks
    }
  }
}

module.exports = AgentCore
