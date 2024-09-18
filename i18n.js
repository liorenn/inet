/**
 * @type {import('next-translate').I18nConfig}
 */
module.exports = {
  locales: ['en', 'he', 'ru', 'de', 'fr', 'es', 'it'],
  defaultLocale: 'en',
  pages: {
    '*': ['main']
  },
  loadLocaleFrom: (lang) => import(`./locales/${lang}.ts`).then((m) => m.default)
}
