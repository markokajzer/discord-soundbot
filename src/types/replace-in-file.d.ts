declare module 'replace-in-file' {
  interface ReplaceOptions {
    files: string[];
    from: RegExp[];
    to: (...args: string[]) => string;
  }

  function sync(options: ReplaceOptions): string[];
}
