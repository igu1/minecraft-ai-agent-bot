function generatePrompt(username, userMessage, tools) {
  return `You are a Minecraft bot assistant. Use function calls based on the user message

FUNCTIONS AVAILABLE:
${tools.map(t => `- ${t.function.name}: ${t.function.description}`).join('\n')}

User: ${username}
Message: ${userMessage}`.trim()
}

module.exports = { generatePrompt }
