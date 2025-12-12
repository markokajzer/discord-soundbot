import fs from "node:fs";
import path from "node:path";

import type Command from "../commands/Command";
import type { SoundCommand } from "../commands/sound/SoundCommand";

export default class CommandCollection {
  private readonly triggers: Map<string, Command> = new Map();
  private readonly commands: Command[] = [];
  private readonly soundCommand: Command;

  constructor(commands: Command[] = []) {
    // For testing
    if (commands.length) {
      this.registerCommands(commands);
    } else {
      this.loadCommands();
    }
    this.soundCommand = this.commands.find((cmd) => !cmd.triggers.length) as SoundCommand;
  }

  public registerCommands(commands: Command[]) {
    this.commands.push(...commands);
    commands.forEach((command) => this.registerTriggers(command));
  }

  public get(command: string) {
    return this.triggers.get(command) || this.soundCommand;
  }

  private loadCommands() {
    const pattern = path.join(__dirname, "../commands/*/*Command.js");
    const exclude = (f: string) =>
      f.includes("base") || f.includes("__mocks__") || f.includes("__test__");

    const commands: Command[] = fs.globSync(pattern, { exclude }).map((file) => {
      const mod = require(file);
      const CommandClass = Object.values(mod)[0];
      // @ts-expect-error -- dynamic instantiation
      return new CommandClass();
    });

    this.registerCommands(commands);
  }

  private registerTriggers(command: Command) {
    command.triggers.forEach((trigger) => this.triggers.set(trigger, command));
  }
}
