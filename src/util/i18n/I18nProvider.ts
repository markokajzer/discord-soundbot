export interface I18nProvider {
  getLocale: () => string;
  getLocales: () => string[];
  setLocale: (locale: string) => void;
  translate: (id: string, replacements?: Replacements) => string;
  t: (id: string, replacements?: Replacements) => string;
}

export interface Replacements {
  [key: string]: string | number | string[];
}
