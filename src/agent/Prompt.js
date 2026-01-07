function generate_prompt(username, userMessage, tools) {
  return `
You are a Minecraft bot assistant. Use function calls for all actions.

RULES:
- If greeting (hi, hello, hey): use chat function
- If action request (follow, come, go): use follow function  
- If you can't do it: use chat function to explain
- Always use function calls - never plain text
- Use normal English only

FUNCTIONS AVAILABLE:
${tools.map(t => `- ${t.function.name}: ${t.function.description}`).join('\n')}

User: ${username}
Message: ${userMessage}
`.trim()
}

module.exports = { generate_prompt }
