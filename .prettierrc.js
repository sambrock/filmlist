/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
module.exports = {
  bracketSpacing: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'es5',
  semi: true,
  printWidth: 110,
  arrowParens: 'always',
  endOfLine: 'auto',
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '^react.*$',
    '^next.*$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/infra.*$',
    '^@/actions.*$',
    '^@/server.*$',
    '^@/drizzle.*$',
    '^@/app.*$',
    '^@/lib.*$',
    '^@/middleware.*$',
    '^@/store.*$',
    '^@/providers.*$',
    '^@/hooks.*$',
    '^@/styles.*$',
    '^@/components.*$',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  tailwindFunctions: ['tw', 'cva', 'cn'],
};
