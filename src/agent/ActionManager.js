const FollowAction = require('./actions/FollowAction')
const ChatAction = require('./actions/ChatAction')
const {
  GetItemAction,
  NearbyItemsAction,
  AllItemsAction,
  DropItemAction,
  SortInventoryAction,
  CraftItemAction
} = require('./actions/InventoryActions')
const {
  MoveToUserAction,
  LookAtUserAction,
  FindNearbyBlocksAction,
  MoveToCoordinatesAction,
  AttackEntityAction,
  DigBlockAction,
  PlaceBlockAction
} = require('./actions/InteractionActions')

class ActionManager {
  constructor(bot, agent) {
    this.bot = bot
    this.agent = agent
    this.actions = this.initActions()
  }

  initActions() {
    return {
      follow: new FollowAction(this.bot, this.agent),
      chat: new ChatAction(this.bot, this.agent),
      move_to_user: new MoveToUserAction(this.bot, this.agent),
      look_at_user: new LookAtUserAction(this.bot, this.agent),
      find_nearby_blocks: new FindNearbyBlocksAction(this.bot, this.agent),
      move_to_coordinates: new MoveToCoordinatesAction(this.bot, this.agent),
      attack_entity: new AttackEntityAction(this.bot, this.agent),
      dig_block: new DigBlockAction(this.bot, this.agent),
      place_block: new PlaceBlockAction(this.bot, this.agent),
      nearby_items: new NearbyItemsAction(this.bot, this.agent),
      all_items: new AllItemsAction(this.bot, this.agent),
      drop_item: new DropItemAction(this.bot, this.agent),
      sort_inventory: new SortInventoryAction(this.bot, this.agent)
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
