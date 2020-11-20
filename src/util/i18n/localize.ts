import i18n from './i18n';
import { Replacements } from './I18nProvider';

const getCurrentLocale = () => i18n.getLocale();
const getLocales = () => i18n.getLocales();
const setLocale = (locale: string) => {
  if (getLocales().includes(locale)) i18n.setLocale(locale);
};

const translate = (id: string, replacements?: Replacements) => i18n.translate(id, replacements);
const t = translate;

const localize = {
  getCurrentLocale,
  getLocales,
  setLocale,
  t,
  translate
};

export default localize;
