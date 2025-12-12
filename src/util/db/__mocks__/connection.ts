const db = {
  data: {
    entrances: {} as Record<string, string>,
    exits: {} as Record<string, string>,
    ignoreList: [] as string[],
    sounds: [] as Array<{ name: string; count: number; tags: string[] }>,
  },
  write: jest.fn(),
};

export default db;
