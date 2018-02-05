Discord Soundbot
================

A Bot for Discord to play your favorite sounds or music.

## Installation

### General

To use this bot you first have to create your own [Discord Application](https://discordapp.com/developers/applications/me). Click on `New Application`, enter a name for your app and press the `Create Application` button on the bottom right. Now press on the button `Create a Bot User` for your bot token.

Now create a default.json file inside of the config folder according to the example. Enter the `Client/Application ID` and the `Token` into the config. You can find both inside your Discord application under `APP DETAILS` and `APP BOT USER` respectively.

### Building

The bot can be installed via Docker or manually.

#### Building via Docker

+ Simply clone the repo and run `docker build -t soundbot .` inside the folder.
+ Afterwards start the bot via `docker run soundbot`.
+ To run the container in the background use `docker run -d soundbot`.

#### Building manually

+ As per [discord.js](https://github.com/hydrabolt/discord.js#installation), **Node.js v6.0.0** or newer is required.
+ Due to using voice functionality **FFmpeg** is required.
+ Install the bot's dependencies with `npm install` as usual.
+ Finally, run the bot with `node bot.js` or `npm start`.

#### Adding the bot to your server

In both cases the bot will print a message to your console which should look a little bit like this

```
Use the following URL to let the bot join your server!
https://discordapp.com/oauth2/authorize?client_id={YOUR_CLIENT_ID}&scope=bot
```

Follow the link and allow your bot to join one of your Discord servers.

## Commands

Type `!commands` to print the following list of available commands.

```
!commands              Show this message
!sounds                Show available sounds
!mostplayed            Show 15 most used sounds
!lastadded             Show 5 last added sounds
!<sound>               Play the specified sound
!random                Play random sounds
!stop                  Stop playing and clear queue
!add                   Add the attached sound
!rename <old> <new>    Rename specified sound
!remove <sound>        Remove specified sound
!ignore <user>         Ignore specified user
!unignore <user>       Unignore specified user
```

### Adding sounds

You can add sounds to the bot by typing `!add` and attaching a file. Accepted file formats and a limit to the size are configurable.

### Playing sounds

Type `!sounds` to get a list of all sounds that are available to your bot. Play any sound by prefixing it with `!`, e.g. `!onlygame`. Play a random sound with `!random`.

All sounds will be added to a queue and played in succession. To halt the playback and empty the queue type `!stop`.

### Renaming sounds

Sounds can be renamed by using `!rename <old> <new>`. The bot will respond with a status update.

### Removing sounds

You can delete sounds by typing `!remove <sound>`. The bot will respond with the status of the deletion in the channel of the message.

### Ignoring users

Users can be ignore from using **any** command by the `!ignore <user>` command while specifying their respective ID. The user will be mentioned by the bot in the channel of the message.


## Configuration

The bots prefix can be configured via `prefix`.

You can configure the accepted file formats (via the `extensions` array) as well as the size of the accepted files (via the `size` given in bytes).

The bot can also automatically delete `!<sound>` messages for you to reduce channel spam. For this, set `deleteMessages` to `true`.

To add an avatar to your bot, add a file called `avatar.png` to the `config/` folder and restart the bot. To remove the avatar, delete `avatar.png` and restart the bot.

To let the bot stay in the channel after playing sounds to reduce noise, you can set the `stayInChannel` configuration option.

Check `config/default-example.json` for an example config and create a new file `default.json` with your desired configuration inside the `config` folder.
