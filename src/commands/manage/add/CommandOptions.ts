export interface ConvertOptions {
  soundName: string;
  startTime: Nullable<string>;
  endTime: Nullable<string>;
}

export default interface DownloadOptions extends ConvertOptions {
  url: string;
}
