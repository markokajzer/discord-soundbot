declare module '*.json' {
  const compilerOptions: {
    paths: {
      [index: string]: Array<string>
    };
  };
}
