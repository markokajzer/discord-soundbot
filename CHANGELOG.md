## Untagged (1.2.0)

+ Use depencency injection

## 1.1.0 (2018-08-17)

+ Added `!download` command
+ Added `!tags` command
+ Added `volume` configuration option
+ Added welcome message when bot first joins a server
+ Ignore `!<sound>` commands if sound does not exist
+ Remove all previous `!<sound>` messages when using `!stop`
+ `!sounds` does not try to send an empty message when no sounds exist
+ `!sounds` sends message in code blocks
+ `!sounds` and `!tags` are chunked if message is too large
+ Updated dependencies

## 1.0.2 (2018-04-14)

+ Fixed bot not leaving channel on `!leave`

## 1.0.1 (2018-03-20)

+ Fixed a bug that caused tags not to be saved properly

## 1.0.0 (2018-03-19)

+ Added `!avatar` command to set avatar via message attachment
  + If no attachment was sent, the avatar will send a link to the current avatar
  + Use `!avatar remove` to remove the avatar
+ Added `!tag` command to add tags to sounds
  + Use `!tag <sound>` to list the tags of a sound
  + Use `!tag <sound> <tag1> ... <tagN>` to add tags to a sound
  + Use `!tag <sound> clear` to remove all tags of a sound
+ Added `!search` command
  + Tags are included in the `!search` command
+ Sanitize sound on `!add`, `!remove`
+ Restricted access to `!rename`, `!remove`, `!ignore`, `!unignore`
+ Moved to TypeScript
+ Complete rewrite
+ Removed `config` dependency

## 0.13.0 (2018-03-07)

+ Added `game` option
+ Added `!leave` alias for `!stop` command

## 0.12.0 (2017-12-20)

+ Added `lastadded` command

## 0.11.0 (2017-12-20)

+ Added `stayInChannel` configuration option

## 0.10.0 (2017-09-11)

+ Added prefix configuration

## 0.9.0 (2017-09-10)

+ Added ignoring of users via ID

## 0.8.0 (2017-09-07)

+ Added possibility to add / remove avatar for the bot.

## 0.7.0 (2017-02-27)

+ Added possibility to delete `!<sound>` messages after playthrough.

## 0.6.0 (2017-02-27)

+ Made accepted file formats configurable. ([`#3`](https://github.com/markokajzer/discord-soundbot/issues/3))
+ Made accepted file size configurable.

## 0.5.0 (2016-12-29)

+ Added `!rename` command

## 0.4.0 (2016-12-23)

+ Added `!add` command which saves an attached .mp3 file and adds it to sounds

## 0.3.0 (2016-11-07)

+ Added a databse to count the number of times each sound has been played
  + Added `!mostplayed` command

## 0.2.0 (2016-11-07)

+ Updated to discord.js v10
  + This fixed compatibility issues with the offical Discord API
+ Queueing sounds now also stores the channel in which a sound should be played

## 0.1.0 (2016-08-06)

+ Initial Release
