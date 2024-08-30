import { Setting, SettingUpdate, useSiteSettings } from '@/hooks/useSiteSettings'
import { SimpleGrid, TextInput } from '@mantine/core' // Importing components from Mantine core
import { useEffect, useState } from 'react' // Importing necessary hooks and types from React

import { useRouter } from 'next/router' // Importing useRouter hook from next/router
import useTranslation from 'next-translate/useTranslation' // Importing useTranslation hook from next-translate

// Regular expressions for different types of settings values
const stringRegex = /^[A-Za-z0-9 _,/@.:?]{2,}$/
const booleanRegex = /^(true|false)?$/
const numberRegex = /^-?\d+$/

// Function to validate a string based on its type
function validateConfig(
  defaultValue: Setting[keyof Setting],
  value: Setting[keyof Setting]
): string | null {
  switch (typeof defaultValue) {
    case 'number': // If the validation type is number
      return numberRegex.test(String(value)) ? null : 'Must be a number' // If value didnt pass the regex return a number warning
    case 'boolean': // If the validation type is boolean
      return booleanRegex.test(String(value)) ? null : 'Must be a boolean' // If value didnt pass the regex return a boolean warning
    case 'string': // If the validation type is string
      return stringRegex.test(String(value)) ? null : 'Must be a string' // If value didnt pass the regex return a string warning
    default: // If the validation type is invalid
      return null // Return null
  }
}

// Defining the props for the SiteSettingsEditor component
type Props = {
  accessKey: number
}

// Defining the SiteSettingsEditor component
export default function SiteSettingsEditor({ accessKey }: Props) {
  const router = useRouter() // Get the router
  const { settings } = useSiteSettings()

  // When access key changes
  useEffect(() => {
    // If the access key is smaller than the manager access key
    if (accessKey && accessKey < settings.managerAccessKey) {
      router.push('/') // Redirect to the home page
    }
  }, [accessKey, router])

  // Displaying Settings
  return (
    <>
      <SimpleGrid
        breakpoints={[
          { minWidth: 300, cols: 1 },
          { minWidth: 500, cols: 2 },
          { minWidth: 800, cols: 3 },
        ]}>
        {Object.entries(settings).map(([key, value], index) => {
          return (
            <SettingInput
              key={index}
              setting={{
                name: key as keyof Setting,
                value: value,
              }}
            />
          )
        })}
      </SimpleGrid>
    </>
  )
}

// Component for rendering a single setting input with validation and change handling
function SettingInput({ setting }: { setting: SettingUpdate }) {
  const { t } = useTranslation('main') // Getting the translation function from next translate
  const { setSetting } = useSiteSettings()
  const [value, setValue] = useState(String(setting.value))

  // Rendering a TextInput component for the configuration with validation and change handling
  return (
    <TextInput
      placeholder={t('enterConfigValue')}
      label={t(setting.name)}
      value={value}
      error={validateConfig(setting.value, value)}
      onChange={(event) => {
        setValue(event.currentTarget.value)
        if (validateConfig(setting.value, value) === null) {
          setSetting(setting.name, event.currentTarget.value)
        }
      }}
    />
  )
}
