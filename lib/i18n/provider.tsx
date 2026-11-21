'use client'

import { createContext, useContext, useEffect } from 'react'
import type { Locale } from './config'
import type { Dictionary } from './en'
import { getDictionarySync } from './dictionaries'

interface LocaleContextType {
  locale: Locale
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  t: getDictionarySync('en'),
})

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const t = getDictionarySync(locale)
  // The root <html lang> is static "en"; reflect the active locale so screen
  // readers and crawlers see the right language on Spanish pages.
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = locale
  }, [locale])
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useTranslation() {
  const { t } = useContext(LocaleContext)
  return t
}
