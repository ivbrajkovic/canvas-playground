import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    plugins: ['simple-import-sort', 'import'],
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          // The default grouping, but with type imports first as a separate
          // group, sorting that group like non-type imports are grouped.
          groups: [
            ['^node:.*\\u0000$', '^@?\\w.*\\u0000$', '^[^.].*\\u0000$', '^\\..*\\u0000$'],
            ['^\\u0000'],
            ['^node:'],
            ['^@?\\w'],
            ['^'],
            ['^\\.'],
          ],
        },
      ],

      'import/first': 'error',
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',

      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_',
        },
      ],
    },
  }),
];

export default eslintConfig;
