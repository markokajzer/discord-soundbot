import path from 'path';

export const APPLICATION_ROOT = path.dirname(path.join(path.join(__dirname, '..', '..')));
export const TRANSLATIONS_DIR = path.join(APPLICATION_ROOT, 'locale');
export const STORAGE_DIR = path.join(APPLICATION_ROOT, 'storage');
export const SOUNDS_DIR = path.join(STORAGE_DIR, 'sounds');

export function storagePath(fileName: string): string {
  return path.join(STORAGE_DIR, fileName);
}

export function translationsPath(translationName: string): string {
  return path.join(TRANSLATIONS_DIR, translationName);
}

export function soundsPath(soundName: string): string {
  return path.join(SOUNDS_DIR, soundName);
}
