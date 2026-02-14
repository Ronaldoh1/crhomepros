'use client'

import { createContext, useContext } from 'react'
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
