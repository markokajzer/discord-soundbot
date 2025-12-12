import { Collection, EmbedBuilder } from "discord.js";
import type Config from "~/config/Config";
import localize from "~/util/i18n/localize";
import Command from "../Command";

const FLAGS: Dictionary<string> = {
  de: ":flag_de:",
  en: ":flag_gb:",
  es: ":flag_es:",
  fr: ":flag_fr:",
  hu: ":flag_hu:",
  it: ":flag_it:",
  ja: ":flag_jp:",
  nl: ":flag_nl:",
};

export class LanguageCommand extends Command {
  public readonly triggers = ["lang"];

  public async run(message: Message, params: string[]) {
    const { config } = message.client;

    const [chosenLanguage] = params;
    const language =
      chosenLanguage &&
      this.getLanguageMap().findKey((value, key) => [key, value].includes(chosenLanguage));

    if (!language) {
      message.channel.send({ embeds: [this.help(config)] });
      return;
    }

    config.set("language", [language]);
    localize.setLocale(language);

    message.channel.send(
      localize.t("commands.lang.success", { flag: FLAGS[language], language: chosenLanguage })
    );
  }

  private help(config: Config) {
    return new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(localize.t("commands.lang.title"))
      .setDescription(
        [
          `:flag_de: \`de\` ${localize.t("language.de")} - Deutsch`,
          `:flag_gb: \`en\` ${localize.t("language.en")} - English`,
          `:flag_es: \`es\` ${localize.t("language.es")} - Español`,
          `:flag_fr: \`fr\` ${localize.t("language.fr")} - Français`,
          `:flag_hu: \`hu\` ${localize.t("language.hu")} - Magyar`,
          `:flag_it: \`it\` ${localize.t("language.it")} - Italiano`,
          `:flag_jp: \`ja\` ${localize.t("language.ja")} - 日本人`,
          `:flag_nl: \`nl\` ${localize.t("language.nl")} - Nederlands`,
          "",
          localize.t("commands.lang.usage", { command: `${config.prefix}lang` }),
        ].join("\n")
      );
  }

  private getLanguageMap() {
    return new Collection([
      ["de", localize.t("language.de")],
      ["en", localize.t("language.en")],
      ["es", localize.t("language.es")],
      ["fr", localize.t("language.fr")],
      ["hu", localize.t("language.hu")],
      ["it", localize.t("language.it")],
      ["ja", localize.t("language.ja")],
      ["nl", localize.t("language.nl")],
    ]);
  }
}
