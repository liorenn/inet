// Importing necessary modules and types

import { Button, SimpleGrid, TextInput } from '@mantine/core' // Importing components from Mantine core
import { Dispatch, SetStateAction, useEffect, useState } from 'react' // Importing necessary hooks and types from React

import { CreateNotification } from '@/utils/utils' // Importing CreateNotification function from utils/utils
import Loader from '@/components/layout/Loader' // Importing Loader component from components/layout
import { managerAccessKey } from 'config' // Importing managerAccessKey from config
import { trpc } from '@/utils/client' // Importing trpc instance from utils/client
import { useRouter } from 'next/router' // Importing useRouter hook from next/router
import useTranslation from 'next-translate/useTranslation' // Importing useTranslation hook from next-translate

// Defining breakpoints for the SimpleGrid component
const breakpoints = [
  { minWidth: 300, cols: 1 },
  { minWidth: 500, cols: 2 },
  { minWidth: 800, cols: 3 },
]

// Defining the props type for the ConfigsEditor component
type props = {
  accessKey: number
}

// Defining the configType for configuration values
type configType = {
  name: string
  value: string
}

// Function to check if a string represents a boolean value
function isStringBoolean(value: string): boolean {
  return value === 'true' || value === 'false'
}

// Function to check if a string represents a number
function isStringNumber(value: string): boolean {
  return !Number.isNaN(Number(value))
}

// Defining the validationType for configuration value validation
type validationType = 'number' | 'boolean' | 'string'

// Regular expressions for different types of configuration values
const stringRegex = /^[A-Za-z0-9 _,/@.:?]{3,}$/
const booleanRegex = /^(true|false)?$/
const numberRegex = /^-?\d+$/

// Function to validate a string based on its type
function validateString(value: string, validation: validationType): string | null {
  switch (validation) {
    case 'number':
      return numberRegex.test(value) ? null : 'Must be a number'
    case 'boolean':
      return booleanRegex.test(value) ? null : 'Must be a boolean'
    case 'string':
      return stringRegex.test(value) ? null : 'Must be a string'
    default:
      return null
  }
}

// Function to determine the type of a configuration value
function getValidation(value: string): validationType {
  return isStringNumber(value) ? 'number' : isStringBoolean(value) ? 'boolean' : 'string'
}

// Function to convert a string of configurations into an array of configType objects
function getConfigsArray(configs: string) {
  return configs
    .replace(/\r?\n|\'|\s+/g, '')
    .split('exportconst')
    .map((value) => {
      return { name: value.split('=')[0], value: value.split('=')[1] }
    })
    .filter((value) => value.value !== undefined)
}

// Function to convert an array of configType objects into a string of configurations
function stringifyConfigsArray(configsArray: configType[]): string {
  return configsArray
    .map((value) => {
      const parsedValue =
        isStringNumber(value.value) || isStringBoolean(value.value)
          ? value.value
          : `'${value.value}'`
      return `export const ${value.name} = ${parsedValue}\r\n`
    })
    .join('')
}

// Defining the ConfigsEditor component
export default function ConfigsEditor({ accessKey }: props) {
  const router = useRouter()

  // Redirecting if the access key is less than the manager access key
  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/')
    }
  }, [accessKey, router])

  // Getting the translation function from next-translate
  const { t } = useTranslation('translations')

  // Querying for configurations using trpc
  const { data } = trpc.auth.getConfigs.useQuery()

  // Mutation function for saving configurations using trpc
  const { mutate } = trpc.auth.saveConfigs.useMutation()

  // Mutation function for sending price drop emails using trpc
  const { mutate: sendEmails } = trpc.auth.sendPriceDropsEmails.useMutation()

  // State for holding the configurations as an array of configType objects
  const [configs, setConfigs] = useState<configType[]>([])

  // Populating the configs state when data is available
  useEffect(() => {
    if (data) {
      setConfigs(getConfigsArray(data))
    }
  }, [data, router])

  // Function to validate configuration values based on their types
  function validateValues(values: configType[]) {
    if (!data) return false
    return values
      .map((value, index) => {
        return validateString(value.value, getValidation(getConfigsArray(data)[index].value))
      })
      .every((value) => value === null)
  }

  // Function to save configurations if they are valid
  function saveConfigs() {
    if (validateValues(configs)) {
      mutate({ configs: stringifyConfigsArray(configs) })
    }
  }

  // Displaying a loader while configurations are being fetched
  if (!data) return <Loader />

  // Rendering the configuration inputs and action buttons
  return (
    <>
      <SimpleGrid breakpoints={breakpoints}>
        {configs.map((config, index) => (
          <ConfigInput
            key={index}
            config={config}
            originalValue={getConfigsArray(data)[index].value}
            setConfigs={setConfigs}
          />
        ))}
      </SimpleGrid>
      <SimpleGrid breakpoints={breakpoints} mt='md'>
        <Button
          variant='light'
          color='blue'
          fullWidth
          onClick={() => {
            sendEmails(
              {},
              {
                onSuccess: () => {
                  CreateNotification('success', 'green')
                },
              }
            )
          }}>
          {t('sendEmails')}
        </Button>
        <Button
          variant='light'
          color='orange'
          fullWidth
          onClick={() => {
            sendEmails(
              { sendTest: true },
              {
                onSuccess: () => {
                  CreateNotification('success', 'green')
                },
              }
            )
          }}>
          {t('sendTestEmails')}
        </Button>
        <Button
          variant='light'
          color='green'
          fullWidth
          onClick={() => {
            saveConfigs()
          }}>
          {t('updateConfigs')}
        </Button>
      </SimpleGrid>
    </>
  )
}

// Props type for the ConfigInput component
type configInputProps = {
  config: configType
  originalValue: string
  setConfigs: Dispatch<SetStateAction<configType[]>>
}

// Component for rendering a single configuration input with validation and change handling
function ConfigInput({ config, originalValue, setConfigs }: configInputProps) {
  const validation = getValidation(originalValue)

  // Getting the translation function from next-translate
  const { t } = useTranslation('translations')

  // Rendering a TextInput component for the configuration with validation and change handling
  return (
    <TextInput
      placeholder={t('enterConfigValue')}
      label={t(config.name)}
      value={config.value}
      error={validateString(config.value, validation)}
      onChange={(event) =>
        setConfigs((prev) =>
          prev.map((value) =>
            value.name === config.name ? { name: config.name, value: event.target.value } : value
          )
        )
      }
    />
  )
}
