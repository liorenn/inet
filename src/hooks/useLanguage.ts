import { create } from 'zustand'

type languagesType = {
  value: string
  name: string
}

export const languages: languagesType[] = [
  { value: 'en', name: 'English' },
  { value: 'de', name: 'Deutsch' },
  { value: 'he', name: 'עברית' },
]

type LanguageState = {
  language: languagesType
  setLanguage: (language: languagesType) => void
}

export const useLanguage = create<LanguageState>()((set) => ({
  language: languages[0],
  setLanguage: (newLanguage) => {
    set(() => ({ language: newLanguage }))
    localStorage.setItem('language', newLanguage.value)
  },
}))
