const BaseAction = require('./BaseAction')

class ChatAction extends BaseAction {
  constructor(bot, agent = null) {
    super(bot, agent)
    this.message = ''
    this.target = null
    this.sent = false
  }

  async execute(args) {
    try {
      this.message = args.message || ''
      this.target = args.target || null
      this.sent = false

      if (!this.message.trim()) {
        return { success: false, error: 'Message cannot be empty' }
      }

      if (this.target && this.target !== 'all') {
        this.bot.chat(`[${this.target}] ${this.message}`)
      } else {
        this.bot.chat(this.message)
      }

      this.sent = true
      this.completed = true
      
      return { 
        success: true, 
        message: this.message,
        target: this.target || 'everyone'
      }
      
    } catch (error) {
      console.error('Chat action error:', error)
      return { success: false, error: error.message }
    }
  }

  stop() {
    this.completed = true
    this.sent = false
  }

  getStatus() {
    return {
      action: 'chat',
      message: this.message,
      target: this.target,
      sent: this.sent,
      completed: this.completed
    }
  }
}

module.exports = ChatAction
