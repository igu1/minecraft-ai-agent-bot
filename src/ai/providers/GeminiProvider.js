const BaseProvider = require('./BaseProvider')
const { GoogleGenAI } = require('@google/genai')

class GeminiProvider extends BaseProvider {
  constructor(config) {
    super()
    this.config = config
    
    if (!config.apiKey) {
      throw new Error('Gemini API key is required. Set GEMINI_API_KEY in .env file')
    }
    
    this.client = new GoogleGenAI({ apiKey: config.apiKey })
  }

  async chat(prompt, tools) {
    const functionDeclarations = tools.map(tool => ({
      name: tool.function.name,
      description: tool.function.description,
      parametersJsonSchema: tool.function.parameters
    }))

    const response = await this.client.models.generateContent({
      model: this.config.model,
      contents: prompt,
      config: {
        tools: [{ functionDeclarations }]
      }
    })

    if (response.functionCalls?.length) {
      return response.functionCalls.map(call => ({
        name: call.name,
        args: call.args
      }))
    }

    return response.text || 'No response'
  }
}

module.exports = GeminiProvider
