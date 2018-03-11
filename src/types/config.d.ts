declare module '*.json' {
  const clientID: string;
  const token: string;
  const prefix: string;
  const acceptedExtensions: Array<string>;
  const maximumFileSize: number;
  const deleteMessages: boolean;
  const stayInChannel: boolean;
  const game: string;
}
