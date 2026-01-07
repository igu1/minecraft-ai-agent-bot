class BehaviorEngine {
  constructor(agent) {
    this.agent = agent
    this.behaviors = []
    this.priorities = {
      'survival': 10,
      'combat': 8,
      'resource': 5,
      'explore': 3,
      'social': 1
    }
  }

  addBehavior(behavior) {
    this.behaviors.push(behavior)
  }

  async decideAction() {
    const validBehaviors = this.behaviors.filter(b => b.canExecute())
    if (validBehaviors.length === 0) return null

    validBehaviors.sort((a, b) => {
      const priorityA = this.priorities[a.type] || 0
      const priorityB = this.priorities[b.type] || 0
      return priorityB - priorityA
    })

    return validBehaviors[0]
  }

  async executeBestBehavior() {
    const behavior = await this.decideAction()
    if (behavior) {
      await behavior.execute()
    }
  }
}

module.exports = BehaviorEngine
