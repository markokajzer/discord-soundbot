import fs from 'fs';
import https from 'https';

export default class SoundDownloader {
  public downloadSound(soundName: string, fileName: string, url: string) {
    return new Promise((resolve, reject) => {
      https.get(url, response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(`./sounds/${fileName}`);
          response.pipe(file);
          resolve(`${soundName} added!`);
        }
      }).on('error', error => {
        console.error(error);
        reject('Something went wrong!');
      });
    });
  }
}
