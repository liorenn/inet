import { create } from 'zustand'

type LanguagesType = {
  value: string // The code of the language
  name: string // The name of the language
}

// The list of supported languages
export const languages: LanguagesType[] = [
  { value: 'en', name: 'English' },
  { value: 'de', name: 'Deutsch' },
  { value: 'he', name: 'עברית' },
]

type LanguageState = {
  language: LanguagesType // The current language
  setLanguage: (language: LanguagesType) => void // The function to set the language
}

// Create and export the custom hook for managing the selected Language state
export const useLanguage = create<LanguageState>()((set) => ({
  language: languages[0], // Set the default language
  setLanguage: (newLanguage) => {
    // Define the setter function
    set(() => ({ language: newLanguage })) // Set the language state
    localStorage.setItem('language', newLanguage.value) // Store the selected language in local storage
  },
}))
