# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run build        # Compile TypeScript to dist/
npm run start        # Build and run the bot
npm run serve        # Run already-built bot (from dist/)
npm run typecheck    # Type check without emitting
npm run lint         # Lint with auto-fix
npm run lint:ci      # Lint without auto-fix (CI)
npm run format       # Format with Biome
npm run format:ci    # Check formatting (CI)
npm test             # Run Jest tests
npm test -- --watch  # Run tests in watch mode
npm test -- path/to/file.test.ts  # Run a single test file
```

## Architecture

This is a self-hosted Discord soundboard bot built with discord.js v14 and TypeScript.

### Core Components

- **SoundBot** (`src/bot/SoundBot.ts`): Extends discord.js `Client`. Handles Discord events (ready, messageCreate, voiceStateUpdate, guildCreate) and delegates message handling.

- **MessageHandler** (`src/bot/MessageHandler.ts`): Validates incoming messages (checks prefix, ignores bots/DMs/ignored users) and routes them to commands via CommandCollection.

- **CommandCollection** (`src/bot/CommandCollection.ts`): Maps command triggers to Command instances. Falls back to `SoundCommand` for unregistered triggers (playing sounds by name).

- **SoundQueue** (`src/queue/SoundQueue.ts`): Manages audio playback queue using @discordjs/voice. Handles joining channels, playing sounds, looping, and channel timeouts.

### Command System

Commands extend the abstract `Command` class (`src/commands/Command.ts`) which defines:
- `triggers[]`: Command names that invoke this command
- `elevated`: Boolean flag for admin-only commands
- `run(message, params)`: Async method containing command logic

Commands are organized by category:
- `config/`: Bot configuration (avatar, language, ignore/unignore users)
- `help/`: Info commands (help, welcome, ping, mostplayed, lastadded)
- `manage/`: Sound management (add, remove, rename, modify, tag, download)
- `sound/`: Playback commands (play, combo, loop, random, skip, stop, next)

### Data Storage

Uses lowdb with JSON storage:
- `db.json`: Sounds metadata (name, count, tags), ignored users, entrance/exit sounds
- `sounds/`: Directory containing audio files
- `config/config.json`: Runtime configuration

### Path Alias

The `~` alias maps to `src/` (configured in tsconfig.json and jest.config.js). Use `~/` for imports:
```typescript
import Config from "~/config/Config";
```

### Adding New Commands

1. Create a new class extending the abstract `Command` class
2. Define `triggers: string[]` for the command names
3. Set `elevated = true` if restricted to admin roles
4. Implement `run(message: Message, params?: string[])`
5. Place the file in the appropriate `src/commands/<category>/` directory with the naming convention `*Command.ts`

Commands are auto-discovered at runtime by `CommandCollection` via glob pattern matching on `src/commands/*/*Command.js`.

## Configuration

Bot config is loaded from (in order of precedence):
1. Environment variables (SCREAMING_SNAKE_CASE)
2. `config/config.json`
3. Default values in `src/config/DefaultConfig.ts`

Required: `CLIENT_ID` and `TOKEN` (or clientId/token in config.json)
