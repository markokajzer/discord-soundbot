declare namespace i18n {
  interface ConfigurationOptions {
    /**
     * Whether to use translation from defaultLocale in case current locale does not provide one
     * @default false
     */
    retryInDefaultLocale?: boolean;
  }
}
