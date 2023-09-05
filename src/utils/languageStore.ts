import { useLocalStorage } from '@mantine/hooks'
import { create } from 'zustand'

export type languagesType = 'en' | 'de' | 'he'

interface BearState {
  language: languagesType
  setLanguage: (language: languagesType) => void
}

export const useLanguageStore = create<BearState>()((set) => ({
  language: 'en',
  setLanguage: (newLanguage) => {
    set(() => ({ language: newLanguage }))
    localStorage.setItem('language', newLanguage)
  },
}))
