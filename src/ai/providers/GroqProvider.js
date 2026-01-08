const BaseProvider = require('./BaseProvider')

class GroqProvider extends BaseProvider {
  constructor(config) {
    super()
    this.config = config
    this.groq = null
  }

  async chat(prompt, tools) {
    if (!this.groq) {
      const Groq = await import('groq-sdk')
      this.groq = new Groq.default({ apiKey: this.config.apiKey })
    }

    const functionDeclarations = tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters
      }
    }))

    const messages = [
      { role: 'system', content: 'You are a Minecraft bot assistant. Use function calls based on the user message.' },
      { role: 'user', content: prompt }
    ]

    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages,
        tools: functionDeclarations,
        tool_choice: 'auto',
        temperature: this.config.temperature || 0
      })

      const toolCalls = response.choices[0].message.tool_calls
      if (toolCalls && toolCalls.length > 0) {
        return toolCalls.map(call => ({
          name: call.function.name,
          args: JSON.parse(call.function.arguments)
        }))
      }

      return response.choices[0].message.content
    } catch (error) {
      console.error('Groq Error:', error.message)
      throw error
    }
  }
}

module.exports = GroqProvider
