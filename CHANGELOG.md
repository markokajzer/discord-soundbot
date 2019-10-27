## 1.6.0 (2019-10-27)

**Features**

+ Allow adding additional commands when using the bot as a module
+ Added Dutch translation (Thank you [@nstapelbroek](https://github.com/nstapelbroek)!)
+ Added `!loop` command to easily queue a sound multiple times in a row
+ Added `!next` command which interrupts the current sound with a new one while keeping the queue
+ Added `!skip` command which allows skipping the current sound
+ Added `!exit` command which sets exit sounds akin to `!entrance`
+ Improved `!add` interface for adding from YouTube
+ Added `!set` alias for `!config` command
+ Added `!ping` command
+ Added a binary

**Bugfixes**

+ Fixed handling of long help messages (Thanks [gruntzy](https://github.com/gruntzy)!)
+ Fixed trying to delete messages that were already manually deleted
+ Fixed overwriting of db values

**Under the hood**

+ Replaced `tslint` with `eslint`
+ Added `prettier` and re-formatted all code
+ Do not rely on `config.example.json` file

## 1.5.1 (2019-02-01)

+ Fixed playing entrance sound when muting / deafening
+ Fixed parsing add range
+ Expanded HelpCommand

## 1.5.0 (2018-01-27)

**Features**

+ Added `!entrance` command
+ Added possibility to specify a range when adding sound from YouTube
+ Added possibility to specifiy a tag for `!random`
+ Added Spanish translation (thanks [@ibito](https://github.com/ibito))

**Bugfixes**

+ Improved Docker build (Thank you [@Shamus03](https://github.com/Shamus03)!)
+ Fixed a bug specific to Windows paths (Thank you [@ibito](https://github.com/ibito)!)
+ Removed uws in favor of bufferutil
+ Fixed trying to delete already deleted messages
+ Use libsodium for faster voice packet encryption and decryption
+ Updated dependencies

## 1.4.0 (2018-09-10)

+ Added `!config` command
  + Changes config during runtime
+ Added `!combo` command
+ Made SoundUtil an actual class
+ Released as an npm package

## 1.3.0 (2018-09-01)

+ `!add` directly from YouTube
+ Added `!welcome` command
+ Added `deafen` configuration option
+ Fixed Japanese language code
+ Fixed chunking of messages
+ Rewrote database logic

## 1.2.0 (2018-08-27)

+ Allow localization into other languages
  + Added French translation
  + Added German translation
  + Added Hungarian translation
  + Added Japanese translation
+ Use depencency injection via `awilix` package

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

+ Added a database to count the number of times each sound has been played
  + Added `!mostplayed` command

## 0.2.0 (2016-11-07)

+ Updated to discord.js v10
  + This fixed compatibility issues with the offical Discord API
+ Queueing sounds now also stores the channel in which a sound should be played

## 0.1.0 (2016-08-06)

+ Initial Release
