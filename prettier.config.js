/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	arrowParens: 'avoid',
	bracketSameLine: false,
	bracketSpacing: true,
	singleQuote: true,
	trailingComma: 'all',
	importOrder: ['<THIRD_PARTY_MODULES>', '^~(.*)/(.*)$', '^[./]'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
};

export default config;

