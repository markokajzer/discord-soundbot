Contributing
============

The project is built with TypeScript and makes use of both [Prettier](https://prettier.io/) as well as extensive linting via [ESLint](https://eslint.org/).

The project uses [semantic commit messages](https://seesparkbox.com/foundry/semantic_commit_messages), of the form `topic: summary of changes`. Examples using the available topics:

+ `feat:` new feature for the user, not a new feature for build script
+ `fix:` bug fix for the user, not a fix to a build script
+ `refactor:` refactoring production code
+ `chore:` updating build scripts etc; no production code change
+ `style:` formatting, code style etc; no production code change
+ `test:` adding missing tests, refactoring tests; no production code change
+ `docs:` changes to the documentation

The project has a slim CI pipeline via [GitHub Actions](https://github.com/features/actions) that checks for formatting and linting errors, as well as ensuring that the tests pass.

### Project Structure

The project is built with TypeScript, Node.js, and [discord.js](https://discord.js.org/). Data, such as configuration and sounds, is persisted in simple JSON file via [lowdb](https://github.com/typicode/lowdb).

The main class is `SoundBot` which is a [Client](https://discord.js.org/#/docs/main/stable/class/Client). It sets up event handlers, e.g. for incoming message and voice state updates.

It passes incoming messages to the `MessageHandler` which checks if it needs to react to a given message, e.g. message not from bot or ignored user. If a message should be acted on, it is passed to the `CommandCollection`. It holds a map of all the commands and their triggers, which are registered during start up. If a actionable message does not specify a command, the message will be handled by the `SoundCommand`.

Commands are simple classes that have a `run` method, which gets the message object and additional parameters for the command. Commands can play sounds, edit configuration, or provide information.

Triggered sounds are saved in a `SoundQueue`, which takes care of playing each sound in order.
