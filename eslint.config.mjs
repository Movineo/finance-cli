import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default await tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  files: ['**/*.ts'],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
});
