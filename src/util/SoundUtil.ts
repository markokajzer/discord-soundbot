import config from '../../config/config.json';

import fs from 'fs';

export default class SoundUtil {
  public static getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  public static getSoundsWithExtension(): Array<{ name: string, extension: string }> {
    const files = fs.readdirSync('sounds/');
    const sounds = files.filter(sound => config.acceptedExtensions.some(ext => sound.endsWith(ext)));
    return sounds.map(sound => {
      return { name: sound.split('.')[0], extension: sound.split('.')[1] };
    });
  }

  public static getPathForSound(sound: string) {
    return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
  }

  public static getExtensionForSound(name: string) {
    return this.getSoundsWithExtension().find(sound => sound.name === name)!.extension;
  }
}
