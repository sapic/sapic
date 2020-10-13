module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['standard', 'plugin:vue/recommended', 'plugin:vue/base'],
  globals: {
    __static: true,
  },
  plugins: ['vue'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'no-array-constructor': 0,

    'comma-dangle': ['error', 'always-multiline'],
    quotes: ['error', 'single'],
    'space-before-function-paren': ['error', 'always'],
    'vue/require-v-for-key': 'off',
  },
}