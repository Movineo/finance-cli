// eslint.config.mjs
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/commands/*.ts'],
    rules: {
      'no-console': 'off', // Allow console in CLI command files
    },
  },
  {
    files: ['src/db/**/*.ts'],
    rules: {
      'no-console': 'error', // Enforce no-console in non-command files
    },
  },
];

