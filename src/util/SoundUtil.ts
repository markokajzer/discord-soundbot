import fs from 'fs';

// TODO Should get config from container, could lead to strange bugs
import config from '../../../config/config.json';

export default class SoundUtil {
  public static getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  public static getSoundsWithExtension(): Array<{ name: string, extension: string }> {
    const sounds = this.getSoundsFromSoundFolder();
    return sounds.map(this.getSoundWithExtension);
  }

  public static getPathForSound(sound: string) {
    return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
  }

  public static getExtensionForSound(name: string) {
    return this.getSoundsWithExtension().find(sound => sound.name === name)!.extension;
  }

  public static soundExists(name: string) {
    return this.getSounds().includes(name);
  }

  private static getSoundsFromSoundFolder() {
    const files = fs.readdirSync('sounds/');
    return files.filter(sound =>
      config.acceptedExtensions.some(extension => sound.endsWith(extension)));
  }

  private static getSoundWithExtension(sound: string) {
    const [name, extension] = sound.split('.');
    return { name: name, extension: extension };
  }
}
