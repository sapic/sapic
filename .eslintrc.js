module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // '@typescript-eslint/no-var-requires': 0,
    // 'node/no-path-concat': 0,
    // '@typescript-eslint/no-unused-vars': 'off',
    // 'no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': [
    //   'error',
    //   {
    //     functions: false,
    //   },
    // ],
  },
  env: {
    // "vue/setup-compiler-macros": true,
  },
}
