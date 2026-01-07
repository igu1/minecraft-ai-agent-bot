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
      const { GoogleGenAI } = require('@google/genai')
      const tools = registry
      
      const ai = new GoogleGenAI({})
      
      // Convert tools to Gemini format
      const geminiTools = tools.map(tool => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters
      }))
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        tools: [{ functionDeclarations: geminiTools }]
      });
      
      if (response.candidates && response.candidates[0] && response.candidates[0].content) {
        const candidate = response.candidates[0]
        if (candidate.content.parts && candidate.content.parts[0]) {
          const part = candidate.content.parts[0]
          if (part.functionCall) {
            const tool_calls = [{
              name: part.functionCall.name,
              args: part.functionCall.args
            }]
            return tool_calls
          }
          if (part.text) {
            console.log('AI Response:', part.text)
            return []
          }
        }
      }
      
      return []
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
