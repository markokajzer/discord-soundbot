declare module '*.json' {
  const clientID: string;
  const token: string;
  const language: string;
  const prefix: string;
  const acceptedExtensions: Array<string>;
  const maximumFileSize: number;
  const volume: number;
  const deleteMessages: boolean;
  const stayInChannel: boolean;
  const deafen: boolean;
  const game: string;
}
