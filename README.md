Discord Soundbot
================

A Bot for Discord to play your favorite sounds or music.

## Usage

### Requirements

+ Due to compatibility with ES2015, **Node.js v6.0.0** or newer is required.
+ Refering to the [discord.js library](http://discordjs.readthedocs.io/en/latest/troubleshooting.html), three more requirements are needed to use voice functionality:
  + **FFmpeg**
  + **Python 2.7.x**
  + C++ compiler tool for your platform: **build-essential** (Linux), **Xcode Command Line Tools** (Mac OS)


### Installation guide

To use this bot you first have to create your own [Discord Application](https://discordapp.com/developers/applications/me). Click on `New Application`, enter a name for your app and press the `Create Application` button on the bottom right. Now press on the button `Create a Bot User` for your bot token.

Now create a default.json file inside of the config folder according to the example. Enter the `Client/Application ID` and the `Token` into the which you can find inside your Discord application under `APP DETAILS` and `APP BOT USER` respectively.

Install the bots dependencies with `npm install` as usual.  
Finally, run the bot with `node bot.js` or `npm start`.

The bot will print a message to your console, which should look a little bit like this

```
Use the following URL to let the bot join your server!
https://discordapp.com/oauth2/authorize?client_id={YOUR_CLIENT_ID}&scope=bot
```

Click on the link and allow your bot to join one of your Discord servers.

## Commands

Type `!commands` to print the following list of available commands.

```
!commands         Show this message
!sounds           Show available sounds
!<sound>          Play the specified sound
!random           Play random sounds
!stop             Stop playing
!remove <sound>   Remove specified sound
```

### Adding sounds

Currently you have to create your own sounds as .mp3 files and put the in the `sounds/` directory. Your bot will automatically use new sounds, no need to restart.

### Playing sounds

Type `!sounds` to get a list of all sounds that are available to your bot. Play any sound by prefixing it with `!`, e.g. `!mysound`. Play a random sound with `!random`.

All sounds will be added to a queue and played in succession. To halt the playback, type `!stop`.

### Removing sounds

You can delete sounds by typing `!remove <sound>`. The bot will respond with the status of the deletion in the channel of the message.

## Todo

+ Add possibility to add sounds
  + PM the bot a wav or mp3 file < 1MB and it will add it to the soundboard.
