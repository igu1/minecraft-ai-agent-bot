# AI Agent Minecraft Bot

A sophisticated Minecraft bot with AI agent capabilities built using Mineflayer.

## Features

- **AI Agent Core**: Decision-making system with memory and task management
- **Behavior Engine**: Priority-based behavior selection
- **Pathfinding**: Intelligent navigation and pathfinding
- **Combat System**: Autonomous combat with retreat logic
- **Inventory Management**: Smart item collection and organization
- **Event Handling**: Comprehensive event processing
- **Task Management**: Queue-based task execution
- **Configuration**: Flexible configuration system
- **Logging**: Structured logging with multiple levels

## Project Structure

```
MineFlayer/
├── src/
│   ├── agent/
│   │   ├── AgentCore.js           # Main AI agent logic
│   │   ├── behavior/
│   │   │   └── BehaviorEngine.js  # Behavior decision system
│   │   ├── pathfinding/
│   │   │   └── PathFinder.js      # Navigation system
│   │   ├── combat/
│   │   │   └── CombatSystem.js    # Combat mechanics
│   │   └── inventory/
│   │       └── InventoryManager.js # Item management
│   ├── bot/
│   │   ├── controller/
│   │   │   └── BotController.js   # Main bot controller
│   │   ├── events/
│   │   │   └── EventHandler.js    # Event processing
│   │   └── tasks/
│   │       └── TaskManager.js     # Task management
│   └── utils/
│       ├── Logger.js              # Logging utility
│       ├── MathUtils.js           # Mathematical utilities
│       ├── TimeUtils.js           # Time-related utilities
│       └── DataStorage.js         # Data persistence
├── config/
│   └── bot.config.js              # Bot configuration
├── data/                          # Data storage directory
├── logs/                          # Log files directory
└── index.js                       # Main entry point
```

## Installation

```bash
npm install
```

## Configuration

Edit `config/bot.config.js` to customize bot behavior:

- Server connection settings
- AI agent parameters
- Combat preferences
- Pathfinding options
- Logging configuration

## Usage

### Basic Usage
```bash
npm run dev
```

### Environment Variables
You can override configuration using environment variables:

```bash
MINECRAFT_HOST=127.0.0.1
BOT_USERNAME=MyBot
COMBAT_ENABLED=true
LOG_LEVEL=debug
npm run dev
```

## Chat Commands

- `!status` - Get bot status
- `!follow` - Bot follows you
- `!come` - Bot comes to your location
- `!stop` - Stop all current tasks

## AI Agent Features

### Behavior System
The bot uses a priority-based behavior system:
- Survival (highest priority)
- Combat
- Resource gathering
- Exploration
- Social interactions

### Combat System
- Automatic hostile mob detection
- Smart combat with retreat logic
- Weapon selection and equipment
- Health-based decision making

### Pathfinding
- Intelligent navigation
- Obstacle avoidance
- Goal-based movement
- Timeout handling

### Inventory Management
- Automatic item organization
- Smart tool selection
- Resource collection
- Category-based sorting

## Development

The bot is designed to be modular and extensible. You can add new behaviors, tasks, and features by extending the existing classes.

## License

ISC
