module.exports = {
  provider: 'ollama',
  
  ollama: {
    model: 'functiongemma:latest',
    baseUrl: 'http://localhost:11434',
    options: {
      temperature: 0
    }
  },
  
  gemini: {
    model: 'gemini-3-pro-preview',
    apiKey: process.env.GEMINI_API_KEY
  },
  
  litellm: {
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0
  }
}
