export default class Sound {
  public readonly name: string;
  public readonly count: number;
  public readonly tags: string[];

  constructor(name: string) {
    this.name = name;
    this.count = 0;
    this.tags = [];
  }
}
