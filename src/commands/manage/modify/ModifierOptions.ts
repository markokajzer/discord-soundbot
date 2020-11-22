interface CommandParams {
  usage: string;
  parameters: {
    max: number;
    min: number;
  };
}

const MODIFIER_OPTIONS: Dictionary<CommandParams> = {
  clip: {
    parameters: { max: 2, min: 1 },
    usage: 'Usage: !modify <sound> clip 14 18?'
  },
  volume: {
    parameters: { max: 1, min: 1 },
    usage: 'Usage: !modify <sound> volume 1'
  }
};

export default MODIFIER_OPTIONS;
