import config from '../../config/config.json';

import fs from 'fs';
import https from 'https';
import { MessageAttachment } from 'discord.js';

import BaseCommand from './BaseCommand';

import Util from '../Util';

export class AddSoundCommand extends BaseCommand {
  public run() {
    this.message.attachments.forEach(attachment => {
      this.addSound(attachment).then(result => {
        this.message.channel.send(result);
      });
    });
  }

  private addSound(attachment: MessageAttachment) {
    return new Promise(resolve => {
      if (attachment.filesize > config.maximumFileSize) {
        resolve(`${attachment.filename.split('.')[0]} is too big!`);
      }

      const fileName = attachment.filename.toLowerCase();
      if (!config.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
        const extensions = config.acceptedExtensions.join(', ');
        resolve(`Sound has to be in accepted format, one of [${extensions}]!`);
      }

      const soundName = fileName.split('.')[0];
      if (soundName.match(/[^a-z0-9]/)) {
        resolve('Filename has to be in accepted format!');
      }

      if (Util.getSounds().includes(soundName)) {
        resolve(`${soundName} already exists!`);
      }

      https.get(attachment.url, response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(`./sounds/${fileName}`);
          response.pipe(file);
          resolve(`${soundName} added!`);
        }
      }).on('error', () => resolve('Something went wrong!'));
    });
  }
}
