import { createSignal } from 'solid-js'
import localeRu from '@/assets/locales/ru'
import localeEn from '@/assets/locales/en'
import localeZhCN from '@/assets/locales/zh-CN'
import localeZhHK from '@/assets/locales/zh-HK'
import localeZhTW from '@/assets/locales/zh-TW'
import localeTr from '@/assets/locales/tr'

// Replaces vue-i18n-lite: t('index.download') with the same keys and fallback.

export const LOCALES = ['en', 'ru', 'zh-CN', 'zh-HK', 'zh-TW', 'tr'] as const
export type Locale = (typeof LOCALES)[number]

type Messages = { [key: string]: string | Messages }

const messages: Record<Locale, Messages> = {
  en: localeEn,
  ru: localeRu,
  'zh-CN': localeZhCN,
  'zh-HK': localeZhHK,
  'zh-TW': localeZhTW,
  tr: localeTr,
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

function browserLocale(): Locale {
  const userLocale = navigator.language
  if (isLocale(userLocale)) return userLocale
  const userLanguage = userLocale.split('-')[0]
  if (isLocale(userLanguage)) return userLanguage
  return 'en'
}

const [locale, setLocaleSignal] = createSignal<Locale>(browserLocale())
export { locale }

export function setLocale(value: string) {
  if (isLocale(value) && value !== locale()) setLocaleSignal(value)
}

function lookup(dict: Messages, key: string): string | undefined {
  let v: string | Messages | undefined = dict
  for (const k of key.split('.')) {
    if (v === undefined || typeof v === 'string') return undefined
    v = v[k]
  }
  return typeof v === 'string' ? v : undefined
}

/** Translate a dotted key in the current locale, falling back to English, then to the key */
export function t(key: string): string {
  return lookup(messages[locale()], key) ?? lookup(messages.en, key) ?? key
}
