export default class LocaleService {
  private i18nProvider: any;

  constructor(i18nProvider: any) {
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

  public translate(id: string, replacements?: object) {
    return this.i18nProvider.translate(id, replacements);
  }

  public t(id: string, replacements?: object) {
    return this.translate(id, replacements);
  }
}
