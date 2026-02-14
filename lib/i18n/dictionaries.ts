import type { Locale } from './config'
import type { Dictionary } from './en'
import en from './en'
import es from './es'

const dicts: Record<Locale, Dictionary> = { en, es }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dicts[locale]
}

export function getDictionarySync(locale: Locale): Dictionary {
  return dicts[locale]
}
