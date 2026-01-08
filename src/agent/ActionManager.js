const FollowAction = require('./actions/FollowAction')
const {
  GetItemAction,
  NearbyItemsAction,
  AllItemsAction,
  DropItemAction,
  SortInventoryAction,
  CraftItemAction
} = require('./actions/InventoryActions')

class ActionManager {
  constructor(bot, agent) {
    this.bot = bot
    this.agent = agent
    this.actions = this.initActions()
  }

  initActions() {
    return {
      follow: new FollowAction(this.bot, this.agent),
      get_item: new GetItemAction(this.bot, this.agent),
      nearby_items: new NearbyItemsAction(this.bot, this.agent),
      all_items: new AllItemsAction(this.bot, this.agent),
      drop_item: new DropItemAction(this.bot, this.agent),
      sort_inventory: new SortInventoryAction(this.bot, this.agent),
      craft_item: new CraftItemAction(this.bot, this.agent)
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
