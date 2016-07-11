DISCORD SOUND BOT
=================

A Bot for Discord to play your favorite sounds or music.

## Usage

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

### Adding sounds

Currently you have to create your own sounds as .mp3 files and put the in the `sounds/` directory. Your bot will automatically use new sounds, no need to restart.

### Playing sounds

Type `!sounds` to get a list of all sounds that are available to your bot.
Play any sound by prefixing it with `!`, e.g. `!playmysound`.

## Todo

+ Add possibility to add and remove sounds
