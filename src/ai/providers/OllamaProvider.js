const BaseProvider = require('./BaseProvider')

class OllamaProvider extends BaseProvider {
  constructor(config) {
    super()
    this.config = config
    this.ollama = null
  }

  async chat(prompt, tools) {
    if (!this.ollama) {
      const { default: ollama } = require('ollama')
      this.ollama = ollama
    }

    const response = await this.ollama.chat({
      model: this.config.model,
      tools,
      options: this.config.options,
      messages: [{ role: 'user', content: prompt }]
    })

    if (response.message.tool_calls?.length) {
      return response.message.tool_calls.map(call => ({
        name: call.function.name,
        args: call.function.arguments
      }))
    }

    return response.message.content
  }
}

module.exports = OllamaProvider
