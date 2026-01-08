const OllamaProvider = require('./providers/OllamaProvider')
const GeminiProvider = require('./providers/GeminiProvider')
const LiteLLMProvider = require('./providers/LiteLLMProvider')
const aiConfig = require('../config/ai.config')

class AIManager {
  constructor() {
    this.provider = this.initProvider()
  }

  initProvider() {
    const { provider } = aiConfig

    if (provider === 'ollama') {
      return new OllamaProvider(aiConfig.ollama)
    } else if (provider === 'gemini') {
      return new GeminiProvider(aiConfig.gemini)
    } else if (provider === 'litellm') {
      return new LiteLLMProvider(aiConfig.litellm)
    }

    throw new Error(`Unknown AI provider: ${provider}`)
  }

  async chat(prompt, tools) {
    try {
      return await this.provider.chat(prompt, tools)
    } catch (error) {
      console.error('AI Error:', error.message)
      return 'Sorry, I had trouble processing that request.'
    }
  }
}

module.exports = AIManager
