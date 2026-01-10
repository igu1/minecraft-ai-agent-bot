const FollowAction = require('./actions/FollowAction')
const CollectWoodAction = require('./actions/WoodAction')
const { DropItemAction } = require('./actions/InventoryActions')
const { MoveToUserAction, LookAtUserAction } = require('./actions/InteractionActions')

class ActionManager {
  constructor(bot, agent) {
    this.bot = bot
    this.agent = agent
    this.actions = this.initActions()
  }

  initActions() {
    return {
      follow: new FollowAction(this.bot, this.agent),
      collect_wood: new CollectWoodAction(this.bot, this.agent),
      drop_item: new DropItemAction(this.bot, this.agent),
      go_to_player: new MoveToUserAction(this.bot, this.agent),
      look_at_player: new LookAtUserAction(this.bot, this.agent)
    }
  }

  getAction(name) {
    return this.actions[name]
  }

  getAllActions() {
    return this.actions
  }
}

module.exports = ActionManager
