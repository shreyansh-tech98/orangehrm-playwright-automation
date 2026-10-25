module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:playwright/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'playwright/no-conditional-in-test': 'warn',
    'playwright/no-wait-for-timeout': 'warn',
    'playwright/expect-expect': 'error',
    'playwright/no-focused-test': 'error',
    'playwright/no-skipped-test': 'warn',
    'playwright/valid-expect': 'error',
  },
  ignorePatterns: ['node_modules/', 'reports/', 'test-results/', 'playwright-report/'],
};
