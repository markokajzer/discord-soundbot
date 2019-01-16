interface I18nProvider {
  getLocale: () => string;
  getLocales: () => Array<string>;
  setLocale: (locale: string) => void;
  translate: (id: string, replacements?: Replacements) => string;
  t: (id: string, replacements?: Replacements) => string;
}

interface Replacements {
  [key: string]: string | number | Array<string>;
}

export default class LocaleService {
  private i18nProvider: I18nProvider;

  constructor(i18nProvider: I18nProvider) {
    this.i18nProvider = i18nProvider;
  }

  public getCurrentLocale(): string {
    return this.i18nProvider.getLocale();
  }

  public getLocales(): Array<string> {
    return this.i18nProvider.getLocales();
  }

  public setLocale(locale: string) {
    if (this.getLocales().includes(locale)) this.i18nProvider.setLocale(locale);
  }

  public translate(id: string, replacements?: Replacements) {
    return this.i18nProvider.translate(id, replacements);
  }

  public t(id: string, replacements?: Replacements) {
    return this.translate(id, replacements);
  }
}
