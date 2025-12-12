import type ConfigInterface from "./ConfigInterface";

const DEFAULT_CONFIG: ConfigInterface = {
  clientId: "",
  token: "",

  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  acceptedExtensions: [".mp3", ".wav"],
  cleanup: "none",
  elevatedRoles: [],
  game: "SoundBoard",
  language: "en",
  maximumFileSize: 1000000, // 1 MB
  prefix: "!",
  stayInChannel: false,
  timeout: 10, // Minutes
};

export default DEFAULT_CONFIG;
