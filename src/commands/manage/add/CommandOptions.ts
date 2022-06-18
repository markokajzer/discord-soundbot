export interface ConvertOptions {
  endTime: Nullable<number>;
  soundName: string;
  startTime: number;
  downloadId: string;
}

export default interface DownloadOptions {
  end: Nullable<string>;
  soundName: string;
  start: Nullable<string>;
  url: string;
}
