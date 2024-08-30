import { createJSONStorage, persist } from 'zustand/middleware'

import { create } from 'zustand'

type SiteSettingsNames = {
  adminAccessKey: number
  managerAccessKey: number
  sendSoapRequest: boolean
  rtlInHebrew: boolean
  validateInputOnChange: boolean
  defaultLanguage: string
  defaultColorScheme: string
  websiteEmail: string
  defaultDashboard: string
  databaseEditorPort: number
  recommendedDevicesLimit: number
  matchedDevicesLimit: number
  adminTableRows: number
}

export type Setting = {
  [K in keyof SiteSettingsNames]: SiteSettingsNames[K]
}

export type SettingUpdate = {
  name: keyof Setting
  value: Setting[keyof Setting]
}

interface SiteSettings {
  settings: Setting
  setSetting: <K extends keyof Setting>(key: K, value: Setting[K]) => void
  updateSettings: (updates: SettingUpdate[]) => void
}

const defaultSettings: Setting = {
  adminAccessKey: 5,
  managerAccessKey: 9,
  sendSoapRequest: true,
  rtlInHebrew: true,
  validateInputOnChange: true,
  defaultLanguage: 'en',
  defaultColorScheme: 'dark',
  websiteEmail: 'onboarding@resend.dev',
  defaultDashboard: 'deviceManagement',
  databaseEditorPort: 5555,
  recommendedDevicesLimit: 6,
  matchedDevicesLimit: 9,
  adminTableRows: 6,
}

export const useSiteSettings = create<SiteSettings>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value,
          },
        })),
      updateSettings: (updates) =>
        set((state) => ({
          settings: updates.reduce(
            (newSettings, { name, value }) => {
              // Type assertion here to ensure type safety
              ;(newSettings[name] as any) = value
              return newSettings
            },
            { ...state.settings }
          ),
        })),
    }),
    {
      name: 'site-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
