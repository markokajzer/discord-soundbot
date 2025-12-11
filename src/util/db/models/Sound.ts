export default class Sound {
  public name: string;
  public count: number;
  public tags: string[];

  constructor(name: string) {
    this.name = name;
    this.count = 0;
    this.tags = [];
  }
}
