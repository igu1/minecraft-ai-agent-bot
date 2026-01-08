class BaseProvider {
  async chat(prompt, tools) {
    throw new Error('chat method must be implemented')
  }
}

module.exports = BaseProvider
