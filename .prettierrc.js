module.exports = {
  plugins: [require('@ianvs/prettier-plugin-sort-imports')],
  bracketSpacing: true,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  importOrder: ['<THIRD_PARTY_MODULES>', '^~(.*)/(.*)$', '^[./]'],
  parser: 'typescript',
};
