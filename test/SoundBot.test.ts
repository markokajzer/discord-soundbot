import SoundBot from  '../src/SoundBot';

describe('SoundBot', () => {
  let bot: SoundBot;

  beforeEach(() => {
    bot = new SoundBot();
  });

  it('passes', () => {
    expect(1).toEqual(1);
  });
})
