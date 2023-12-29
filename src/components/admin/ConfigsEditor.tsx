import { useRouter } from 'next/router'
import { trpc } from '../../misc/trpc'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { managerAccessKey } from '../../../config'
import Loader from '../layout/Loader'
import { SimpleGrid, TextInput, Button, Group } from '@mantine/core'
import { CreateNotification } from '../../misc/functions'

export default function ConfigsEditor({ accessKey }: { accessKey: number }) {
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
  const [configs, setConfigs] = useState<string[][]>([])

  useEffect(() => {
    if (data) {
      setConfigs(getConfigsArray(data))
    }
  }, [data, router])

  if (!data) return <Loader />

  function getConfigsArray(configs: string) {
    return configs
      .replace(/\r?\n|\'|\s+/g, '')
      .split('exportconst')
      .map((value) => value.split('='))
      .filter((value) => value.length > 1)
  }

  function isBooleanString(value: string): value is 'true' | 'false' {
    return value === 'true' || value === 'false'
  }

  function stringifyConfigsArray(configsArray: string[][]): string {
    return configsArray
      .map(([key, value]) => {
        const parsedValue =
          !Number.isNaN(Number(value)) || isBooleanString(value)
            ? value
            : `'${value}'`
        return `export const ${key} = ${parsedValue}\r\n`
      })
      .join('')
  }

  function saveConfigs() {
    console.log(stringifyConfigsArray(configs))
    mutate({ configs: stringifyConfigsArray(configs) })
    //router.reload()
  }

  const breakpoints = [
    { minWidth: 300, cols: 1 },
    { minWidth: 500, cols: 2 },
    { minWidth: 800, cols: 3 },
  ]

  return (
    <>
      <SimpleGrid breakpoints={breakpoints}>
        {configs.map((config, index) => (
          <ConfigInput key={index} config={config} setConfigs={setConfigs} />
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
  config: string[]
  setConfigs: Dispatch<SetStateAction<string[][]>>
}

function ConfigInput({ config, setConfigs }: configInputProps) {
  return (
    <TextInput
      placeholder='Enter Config Value...'
      label={config[0]}
      value={config[1]}
      onChange={(event) =>
        setConfigs((prev) =>
          prev.map((value) =>
            value[0] === config[0] ? [config[0], event.target.value] : value
          )
        )
      }
    />
  )
}
