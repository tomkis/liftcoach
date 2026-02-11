module.exports = {
  arrowParens: 'avoid',
  importOrder: ['<THIRD_PARTY_MODULES>', '', '<BUILTIN_MODULES>', '', '', '^@/mobile/(.*)$', '', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.3.3',
  plugins: [require.resolve('@ianvs/prettier-plugin-sort-imports'), require.resolve('prettier-plugin-packagejson')],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
}
