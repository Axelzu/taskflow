const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/**', 'coverage/**', 'reports/**', 'data/**', 'deployments/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'scripts/**/*.js', '*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.jest } },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
  {
    files: ['cypress/**/*.js'],
    languageOptions: { globals: { ...globals.mocha, cy: 'readonly', Cypress: 'readonly' } },
  },
  { rules: { eqeqeq: 'error', 'no-unused-vars': 'error', 'prefer-const': 'error' } },
];
