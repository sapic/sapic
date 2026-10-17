// ESLint 9 flat config: the same rule sets the project used in .eslintrc.js
// (standard, eslint:recommended, typescript-eslint recommended, vue3 recommended, prettier).
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

// eslint-config-standard has no flat config yet; FlatCompat loads the legacy one as written, and
// fixupConfigRules adapts its plugins (import, n, promise) to the ESLint 10 rule-context API
const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

export default [
  {
    ignores: ['test/unit/coverage/**', 'test/unit/*.js', 'test/e2e/*.js', 'build/**', 'dist/**', 'ffmpeg.st/*'],
  },
  js.configs.recommended,
  ...fixupConfigRules(compat.extends('standard')),
  ...pluginVue.configs['flat/recommended'],
  // The full typescript-eslint recommended config, including its eslint-recommended overrides
  // (core rules such as no-undef / no-unused-vars that TypeScript already checks)
  ...tseslint.configs['flat/recommended'].map((c) => ({ ...c, files: ['**/*.{ts,vue}'] })),
  {
    files: ['**/*.{ts,vue,js}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser, sourceType: 'module', ecmaVersion: 'latest' },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-var-requires': 0,
      'node/no-path-concat': 0,
      '@typescript-eslint/no-unused-vars': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
]
