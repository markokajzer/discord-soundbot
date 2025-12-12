import { HelpCommand } from "~/commands/help/HelpCommand";
import { SoundCommand } from "~/commands/sound/SoundCommand";

import CommandCollection from "../CommandCollection";

jest.mock("~/commands/help/HelpCommand");
jest.mock("~/commands/sound/SoundCommand");

const helpCommand = new HelpCommand();
const soundCommand = new SoundCommand();

describe("CommandCollection", () => {
  let commands!: CommandCollection;

  beforeEach(() => {
    commands = new CommandCollection([soundCommand]);
  });

  describe("registerCommands", () => {
    it("correctly registers commands", () => {
      commands.registerCommands([helpCommand]);

      // @ts-expect-error
      const { triggers } = commands;

      expect(Array.from(triggers.keys())).toEqual(["commands", "help"]);
      expect(triggers.get("commands")).toEqual(helpCommand);
      expect(triggers.get("help")).toEqual(helpCommand);
    });
  });

  describe("get", () => {
    it("returns SoundCommand if no trigger registered for message", () => {
      expect(commands.get("airhorn")).toEqual(soundCommand);
    });

    it("returns the command refering to a given trigger", () => {
      commands.registerCommands([helpCommand]);

      expect(commands.get("help")).toEqual(helpCommand);
    });
  });
});
