import fs from "node:fs";

import { config } from "./Container";

const getSoundsFromSoundFolder = () => {
  const files = fs.readdirSync("sounds/");

  return files.filter((sound) =>
    config.acceptedExtensions.some((extension) => sound.endsWith(extension))
  );
};

const getSoundWithExtension = (sound: string) => {
  const [name, extension] = sound.split(".");

  return { extension, name };
};

export const getSoundsWithExtension = () => getSoundsFromSoundFolder().map(getSoundWithExtension);
export const getSounds = () => getSoundsWithExtension().map((sound) => sound.name);
export const getExtensionForSound = (name: string) => {
  const sound = getSoundsWithExtension().find((sound) => sound.name === name);
  if (!sound) throw new Error(`Sound \`${name} does not exist.\``);

  return sound.extension;
};
export const getPathForSound = (sound: string) => `sounds/${sound}.${getExtensionForSound(sound)}`;
export const existsSound = (name: string) => getSounds().includes(name);
