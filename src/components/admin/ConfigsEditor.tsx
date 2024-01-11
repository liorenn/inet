import { Button, SimpleGrid, TextInput } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { CreateNotification } from '@/utils/utils'
import Loader from '@/components/layout/Loader'
import { managerAccessKey } from 'config'
import { trpc } from '@/server/client'
import { useRouter } from 'next/router'

const breakpoints = [
  { minWidth: 300, cols: 1 },
  { minWidth: 500, cols: 2 },
  { minWidth: 800, cols: 3 },
]

type props = {
  accessKey: number
}

type configType = {
  name: string
  value: string
}

function isStringBoolean(value: string) {
  return value === 'true' || value === 'false'
}

function isStringNumber(value: string) {
  return !Number.isNaN(Number(value))
}

type validationType = 'number' | 'boolean' | 'string'
const stringRegex = /^[A-Za-z0-9 _,/@.:?]{3,}$/
const booleanRegex = /^(true|false)?$/
const numberRegex = /^-?\d+$/

function validateString(value: string, validation: validationType) {
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

function getValidation(value: string): validationType {
  return isStringNumber(value) ? 'number' : isStringBoolean(value) ? 'boolean' : 'string'
}

function getConfigsArray(configs: string) {
  return configs
    .replace(/\r?\n|\'|\s+/g, '')
    .split('exportconst')
    .map((value) => {
      return { name: value.split('=')[0], value: value.split('=')[1] }
    })
    .filter((value) => value.value !== undefined)
}

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

export default function ConfigsEditor({ accessKey }: props) {
  const router = useRouter()
  useEffect(() => {
    if (accessKey && accessKey < managerAccessKey) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/')
    }
  }, [accessKey, router])
  const { data } = trpc.auth.getConfigs.useQuery()
  const { mutate } = trpc.auth.saveConfigs.useMutation()
  const { mutate: sendEmails } = trpc.auth.sendPriceDropsEmails.useMutation()
  const [configs, setConfigs] = useState<configType[]>([])

  useEffect(() => {
    if (data) {
      setConfigs(getConfigsArray(data))
    }
  }, [data, router])

  function validateValues(values: configType[]) {
    if (!data) return false
    return values
      .map((value, index) => {
        return validateString(value.value, getValidation(getConfigsArray(data)[index].value))
      })
      .every((value) => value === null)
  }

  function saveConfigs() {
    if (validateValues(configs)) {
      mutate({ configs: stringifyConfigsArray(configs) })
      //router.reload()
    }
  }

  if (!data) return <Loader />

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
          Send Emails
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
          Send Test Emails
        </Button>
        <Button
          variant='light'
          color='green'
          fullWidth
          onClick={() => {
            saveConfigs()
          }}>
          Update Configurations
        </Button>
      </SimpleGrid>
    </>
  )
}

type configInputProps = {
  config: configType
  originalValue: string
  setConfigs: Dispatch<SetStateAction<configType[]>>
}

function ConfigInput({ config, originalValue, setConfigs }: configInputProps) {
  const validation = getValidation(originalValue)

  return (
    <TextInput
      placeholder='Enter Config Value...'
      label={config.name}
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
