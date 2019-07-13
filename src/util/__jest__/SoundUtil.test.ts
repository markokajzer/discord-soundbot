import fs from 'fs';
import {
  existsSound,
  getSoundsWithExtension,
  getSounds,
  getExtensionForSound,
  getPathForSound
} from '../SoundUtil';

const MOCK_SOUND_FILES = [
  'bitconnect.mp3',
  'testing.mp3',
  'wonderful.mp3',

  'testing.wav'
];

describe('SoundUtil', () => {
  beforeAll(() => {
    (jest.spyOn(fs, 'readdirSync') as jest.SpyInstance).mockImplementation(() => MOCK_SOUND_FILES);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getSoundsWithExtension', () => {
    it('returns sounds with extension', () => {
      expect(getSoundsWithExtension()).toEqual([
        { name: 'bitconnect', extension: 'mp3' },
        { name: 'testing', extension: 'mp3' },
        { name: 'wonderful', extension: 'mp3' }
      ]);
    });
  });

  describe('getSounds', () => {
    it('returns sound names only', () => {
      expect(getSounds()).toEqual([
        'bitconnect',
        'testing',
        'wonderful'
      ]);
    });
  });

  describe('getExtensionForSound', () => {
    it('returns the extension of a sound', () => {
      expect(getExtensionForSound('bitconnect')).toEqual('mp3');
    });
  });

  describe('getPathForSound', () => {
    expect(getPathForSound('bitconnect')).toEqual('sounds/bitconnect.mp3');
  });

  describe('existsSound', () => {
    describe('when sound exists', () => {
      expect(existsSound('bitconnect')).toBe(true);
    });

    describe('when sound does not exists', () => {
      expect(existsSound('nON_EXISTING_SOUND')).toBe(false);
    });
  });
});
