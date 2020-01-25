import fs from 'fs';

import container from './Container';

const getSoundsFromSoundFolder = () => {
  const { config } = container;
  const files = fs.readdirSync('sounds/');

  return files.filter(sound =>
    config.acceptedExtensions.some(extension => sound.endsWith(extension))
  );
};

const getSoundWithExtension = (sound: string) => {
  const [name, extension] = sound.split('.');

  return { name, extension };
};

export const getSoundsWithExtension = () => getSoundsFromSoundFolder().map(getSoundWithExtension);
export const getSounds = () => getSoundsWithExtension().map(sound => sound.name);
export const getExtensionForSound = (name: string) =>
  getSoundsWithExtension().find(sound => sound.name === name)!.extension;
export const getPathForSound = (sound: string) => `sounds/${sound}.${getExtensionForSound(sound)}`;
export const existsSound = (name: string) => getSounds().includes(name);
