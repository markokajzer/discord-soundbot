Discord Soundbot
================

[<img title="Join us on Discord" src="https://discordapp.com/api/guilds/236732117524938754/widget.png?style=shield">](https://discord.gg/JBw2BNx)

A Soundboard Bot for Discord to play your favorite sounds or music. You can add and play sounds, ignore users, set an avatar and more!

This is a *self-hosted* bot which means that you have to install and start the bot yourself. This is due to the bot being heavily involved with voice functionality. But don't sweat it! You can find a thorough installation and configuration guide in this README!

If you still need any help *after reading this guide and the wiki*, or you want to stay tuned, feel free to [join my Discord server](https://discord.gg/JBw2BNx).

Have fun!



## Installation

### General

To use this bot, you first have to create your own [Discord Application](https://discordapp.com/developers/applications). If you don't know how to do it, [this wiki page](../../wiki/Setting-up-a-Discord-Application) will guide you through every step of the way.


### Configuration

Check `config/config.example.json` for an example configuration and create a new file `config.json` inside the `config` folder with your desired configuration. For a detailed description on all of the options, see [here](../../wiki/Configuration). Make sure to restart the bot whenever you change the configuration.

To learn how to edit the config while the bot is running, see [below](#changing-the-config).


### Building

The bot can be installed manually, via Docker, or as an npm package. When not using Docker the bot needs at least **Node.js v8.0.0** or newer and **FFmpeg** for its voice functionality.

#### Building manually

+ Clone the repository.
+ Install `yarn` with `npm install -g yarn`.
+ Install the bot's dependencies with `yarn install`.
+ Run the bot with `yarn start`.

Need more details? You can find more detailed installation guides for [Unix](../../wiki/Unix) (including your Raspberry Pi), [macOS](../../wiki/macOS), and [Windows](../../wiki/Windows).

#### Building/Running via Docker

+ Make sure to have Docker installed.
+ Clone the repo and run `docker-compose build` inside the folder.
+ If you do not already have one, create an empty `db.json` file.
+ Afterwards start the bot via `docker-compose up`.
+ To run the container in the background use `docker-compose up -d`.

#### Using npm

Install the bot as a dependency using npm.

```
  $ npm install discord-soundbot
```

Start the bot.

```js
const SoundBot = require('discord-soundbot');

const myBot = new SoundBot({
  clientId: 'YOUR_CLIENT_ID',
  token: 'YOUR_BOT_USER_TOKEN'
});
myBot.start();
```

For more configuration options see [here](../../wiki/Configuration). You can also add additional commands using this method, see [here](../../wiki/Commands).


### Adding the bot to your server

In both cases the bot will print a message to your console which should look a little bit like this

```
Use the following URL to let the bot join your server!
https://discordapp.com/oauth2/authorize?client_id={YOUR_CLIENT_ID}&scope=bot
```

Follow the link and allow the bot to join your Discord server.

Try out the sample sounds `!airhorn` and `!johncena`, or see below to learn how to add your own sounds.


## Commands

Type `!help` or `!commands` to print a list of available commands. To see the welcome message (again), use `!welcome`.

You can add, rename, download, tag, play, and remove sounds, ignore users, set the avatar, and more.

*Note*: The commands `!rename`, `!remove`, `!tag <sound> clear`, `!ignore`, `!unignore`, `!avatar` and `!config` are restricted and can only be accessed by **administrators**.


### Adding sounds

You can add sounds to the bot by typing `!add` and attaching a file. Accepted file formats and a limit to the size are configurable. The name of the sound can only contain alphanumeric characters.

You can instead also add a sound from YouTube with `!add <name> <link>`. A range in decimals can be specified with `!add <name> <link> <start> <duration>` where the duration is optional. Both the start time and the duration have to be specified as timestamp strings with the format [[hh:]mm:]ss[.xxx].

### Playing sounds

Type `!sounds` to get a list of all sounds that are available to your bot. Play any sound by prefixing it with your prefix, e.g. `!rickroll`. Play a random sound with `!random`. You can specify a tag with `!random` to play a random sound with a specific tag.

All sounds will be added to a queue and played in succession. To halt the playback and empty the queue type `!stop`.

You can use `!combo <sound1> ... <soundN>` to add multiple sounds to the queue.

You can loop sounds by using `!loop <sound>`. To loop only a couple of times, use `!loop <sound> <times>`

You can skip the current sound with the `!skip` command. To interrupt the currently playing sound with a new one use `!next <sound>`.

### Setting entrance sounds

Every user can set his own entrance sound, a sound that will play whenever the user joins a voice channel by using `!entrance <sound>`. To remove your entrance sound use `!entrance` without specifying a sound.

The same is possible for exit sounds with `!exit <sound>` which will play the specified sound when leaving a voice channel.

### Tagging and searching sounds

When your library of sounds gets too big and you forget what kinds of sounds you have, you can add tags to sounds.

You can add tags to sounds with `!tag <sound> <tag>`. You can specify one or more sounds. You can get the tags of a sound with `!tag <sound>`. You can also remove all tags from a sound with `!tag <sound> clear`.

To search for specific sounds use `!search <tag>`. It will look for the name of the sound as well as tags that you might have added to the sound.

To see all sounds with their respective tags use `!tags`.

### Renaming sounds

Sounds can be renamed by using `!rename <old> <new>`. The bot will respond with a status update.

### Removing sounds

You can delete sounds by typing `!remove <sound>`. The bot will respond with the status of the deletion in the channel of the message.

### Downloading sounds

You can send existing sounds to chat with `!download <sound>` in case you do not have the files anymore.

### Ignoring users

Users can be ignore from using **any** command by the `!ignore <user>` command while specifying their respective ID. The user will be mentioned by the bot in the channel of the message. Use `!unignore <user>` to allow the user to interact with the bot again.

### Setting an avatar

Use `!avatar` and attach an image to set the bot's avatar. You can remove the avatar to go back to the default by using the optional `remove` parameter as in `!avatar remove`.

### Changing the config

The config can be changed by editing the `config.json` file, after which the bot needs to be restarted.

To change the config on the go, use `!config <option> <value>`. This will change the configuration immediately and update the configuration file.



## Contributing

This bot is a dear passion project of mine. If you encounter any bugs, or have any suggestions for new features or improvements, feel free to open an issue or talk to me on Discord. I'll be glad to look into it!

In particular, thanks to these splendid lads for providing localization:

+ Dutch, [@nstapelbroek](https://github.com/nstapelbroek)
+ French, [@sipahius](https://github.com/hugoSip)
+ Hungarian, [@alma](https://github.com/stroopwafel1337)
+ Italian, [@Reckless](https://github.com/MarcoReckless)
+ Spanish, [@ibito](https://github.com/ibito)
+ Japanese, [@Sigmy](https://github.com/sigmy)
