import i18n, { Replacements } from './i18n';

const getCurrentLocale = () => i18n.getLocale();
const getLocales = (): string[] => i18n.getLocales();
const setLocale = (locale: string) => {
  if (getLocales().includes(locale)) i18n.setLocale(locale);
};

const translate = (id: string, replacements?: Replacements) =>
  i18n.translate(id, replacements);
const t = (id: string, replacements?: Replacements) => translate(id, replacements);

const localize = {
  getCurrentLocale,
  getLocales,
  setLocale,
  translate,
  t
};

export default localize;
