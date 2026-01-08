const BaseProvider = require('./BaseProvider')

class LiteLLMProvider extends BaseProvider {
  constructor(config) {
    super()
    this.config = config
    this.litellm = null
    
    // Set environment variable for API key
    if (config.apiKey) {
      if (config.model.startsWith('groq/')) {
        process.env.GROQ_API_KEY = config.apiKey
      } else if (config.model.startsWith('gpt-')) {
        process.env.OPENAI_API_KEY = config.apiKey
      }
    }
  }

  async chat(prompt, tools) {
    if (!this.litellm) {
      const { default: litellm } = await import('litellm')
      this.litellm = litellm
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
      const response = await this.litellm.completion({
        model: this.config.model,
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
      console.error('LiteLLM Error:', error.message)
      throw error
    }
  }
}

module.exports = LiteLLMProvider
