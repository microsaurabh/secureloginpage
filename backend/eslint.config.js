import globals from 'globals';

export default [
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.node },
    rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }
  }
];
