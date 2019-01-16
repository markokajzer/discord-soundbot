import fs from 'fs';

import Config from '@config/Config';

interface Sound {
  name: string;
  extension: string;
}

export default class SoundUtil {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  public getSoundsWithExtension(): Sound[] {
    const sounds = this.getSoundsFromSoundFolder();
    return sounds.map(this.getSoundWithExtension);
  }

  public getPathForSound(sound: string) {
    return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
  }

  public getExtensionForSound(name: string) {
    return this.getSoundsWithExtension().find(sound => sound.name === name)!.extension;
  }

  public soundExists(name: string) {
    return this.getSounds().includes(name);
  }

  private getSoundsFromSoundFolder() {
    const files = fs.readdirSync('sounds/');
    return files.filter(sound =>
      this.config.acceptedExtensions.some(extension => sound.endsWith(extension)));
  }

  private getSoundWithExtension(sound: string) {
    const [name, extension] = sound.split('.');
    return { name, extension };
  }
}
