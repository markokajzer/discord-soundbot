import getSecondsFromTime from '../getSecondsFromTime';

describe('getSecondsFromTime', () => {
  it('throws an error if the string does not represent a timestamp', () => {
    expect(() => getSecondsFromTime('gibberish')).toThrow();
  });

  it('returns null if string is empty', () => {
    expect(getSecondsFromTime(null)).toBeNull();
  });

  it('returns the seconds of a timestring with seconds', () => {
    expect(getSecondsFromTime('42')).toEqual(42);
  });

  it('returns the seconds of a timestring with minutes', () => {
    expect(getSecondsFromTime('12:42')).toEqual(12 * 60 + 42);
  });

  it('returns the seconds of a timestring with hours', () => {
    expect(getSecondsFromTime('8:12:42')).toEqual(8 * 60 * 60 + 12 * 60 + 42);
  });

  it('returns the seconds of a timestring with millis', () => {
    expect(getSecondsFromTime('8:12:42.123')).toEqual(8 * 60 * 60 + 12 * 60 + 42 + 0.123);
  });
});
