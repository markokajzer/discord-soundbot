{
  "name": "discord-soundbot",
  "version": "2.2.0-dev",
  "description": "A Soundboard for Discord",
  "main": "dist/src/index.js",
  "bin": {
    "soundbot": "dist/bin/soundbot.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/markokajzer/discord-soundbot"
  },
  "keywords": [
    "discord",
    "bot",
    "soundboard",
    "voice",
    "sounds",
    "mp3",
    "nodejs",
    "typescript"
  ],
  "author": "Marko Kajzer <markokajzer91@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "@discordjs/opus": "^0.1.0",
    "axios": "^0.27.2",
    "date-fns": "^2.28.0",
    "discord.js": "12.4.1",
    "erlpack": "^0.1.4",
    "fluent-ffmpeg": "2.1.2",
    "i18n": "0.13.2",
    "lodash": "4.17.21",
    "lowdb": "1.0.0",
    "opusscript": "^0.0.6",
    "replace-in-file": "6.1.0",
    "sodium": "^3.0.2",
    "uuid": "^8.3.2",
    "yt-dlp-wrap": "^2.3.11"
  },
  "devDependencies": {
    "@types/fluent-ffmpeg": "2.1.16",
    "@types/glob": "7.1.3",
    "@types/i18n": "0.8.8",
    "@types/jest": "26.0.15",
    "@types/lowdb": "1.0.8",
    "@types/node": "14.14.9",
    "@types/node-fetch": "^2.5.7",
    "@types/uuid": "^8.3.4",
    "@types/ws": "7.4.0",
    "@typescript-eslint/eslint-plugin": "4.8.1",
    "@typescript-eslint/parser": "4.8.1",
    "eslint": "7.13.0",
    "eslint-config-airbnb-base": "14.2.1",
    "eslint-config-prettier": "6.15.0",
    "eslint-plugin-import": "2.22.1",
    "eslint-plugin-jest": "24.1.3",
    "eslint-plugin-prettier": "3.1.4",
    "eslint-plugin-simple-import-sort": "^6.0.1",
    "eslint-plugin-sort-keys-fix": "^1.1.1",
    "jest": "26.6.3",
    "node-fetch": "^2.6.1",
    "prettier": "2.2.0",
    "ts-jest": "26.4.4",
    "ts-node": "9.0.0",
    "typescript": "4.1.2"
  },
  "engines": {
    "node": ">=12.0.0"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "clean": "rm -rf dist",
    "format:check": "prettier --config .prettierrc.yml --list-different '**/**.ts'",
    "format": "prettier --config .prettierrc.yml --write '**/**.ts'",
    "lint": "eslint --rulesdir ./vendor/rules/ -c .eslintrc.yml --ext ts .",
    "postbuild": "ts-node lib/postbuild.ts",
    "rebuild": "npm run clean && npm run build",
    "release": "npm run rebuild && npm run lint && npm run format",
    "serve": "node dist/bin/soundbot.js",
    "start": "npm run serve",
    "translations:download": "ts-node lib/downloadTranslations.ts"
  }
}
