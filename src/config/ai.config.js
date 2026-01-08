module.exports = {
  provider: 'groq',
  
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
  },
  
  groq: {
    model: 'llama-3.1-8b-instant',
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0
  }
}
