import { Accordion, Button, Container, Group, ScrollArea } from '@mantine/core'
import { SegmentedControl, Stack, Title, useMantineColorScheme } from '@mantine/core'
import { deviceTypeProperties, propertiesLabels } from '@/models/deviceProperties'
import { useEffect, useState } from 'react'

import Head from 'next/head'
import RecommendedDevices from '@/components/device/RecommendedDevices'
import { deviceType as deviceTypeEnum } from '@/models/enums'
import { preprtiesSchemaType } from '@/models/schemas'
import { trpc } from '@/server/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

type inputType = { value: string; label: string }[]
type preferenceType = {
  name: string
  value: string
}

const getPreferences = (deviceType: string) => {
  return deviceTypeProperties.find((device) => device.deviceType === deviceType)?.properties ?? []
}

function generateUrlString(deviceType: string, preferences: preferenceType[]) {
  return `?deviceType=${deviceType}&preferences=${preferences
    .map((preference) => {
      return `${preference.name}-${preference.value}`
    })
    .join(',')}`
}

function getPreferencesFormatter(preferences: preferenceType[]) {
  return `${preferences
    .map((preference) => {
      return `${preference.name}-${preference.value}`
    })
    .join(',')}`
}

/* eslint-disable @typescript-eslint/no-floating-promises */
export default function Find() {
  const router = useRouter()
  const { width } = useViewportSize()
  const { t } = useTranslation('translations')
  const { colorScheme } = useMantineColorScheme()
  const { mutate, data, isLoading, reset } = trpc.device.getMatchedDevices.useMutation()

  const deviceType = z.string().parse(router.query.deviceType ?? 'iphone')
  const preferences = z
    .string()
    .parse(
      router.query.preferences ??
        getPreferencesFormatter(getPreferences(deviceType).map((name) => ({ name, value: '' })))
    )
    .split(',')
    .map((value) => {
      return { name: value.split('-')[0], value: value.split('-')[1] }
    })

  const [accordionState, setAccordionState] = useState<string[]>(
    preferences.map((pref) => pref.name)
  )

  useEffect(() => {
    if (!router.query.preferences) {
      router.push(
        generateUrlString(
          deviceType,
          getPreferences(deviceType).map((name) => ({ name, value: '' }))
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit() {
    const userPreferences = preferences
      .filter((pref) => pref.value !== 'notInterested' && pref.value !== '')
      .map((pref) => {
        return {
          name: pref.name as preprtiesSchemaType,
          value:
            (propertiesLabels
              .find((property) => property.property === pref.name)
              ?.labels.indexOf(pref.value) ?? 0) + 1,
        }
      })
    userPreferences.length > 0 && mutate({ deviceType, userPreferences: userPreferences })
  }

  function getSegmentedData(preference: preprtiesSchemaType) {
    const data = propertiesLabels
      .find((property) => property.property === preference)
      ?.labels.map((value) => {
        return {
          value: value,
          label: `${value} ${t(preference)}`,
        }
      })
    return data ? [{ value: 'notInterested', label: 'not Interested' }, ...data] : []
  }

  return (
    <>
      <Head>
        <title>{t('find')}</title>
      </Head>
      <Container size={1000}>
        <Stack spacing={0}>
          <Group position='apart'>
            <Title size={width < 1000 ? 20 : 26}>Select Device Type</Title>
            <Button
              mb={8}
              w={'auto'}
              disabled={isLoading}
              color='gray'
              variant='default'
              onClick={() => {
                reset()
                router.push(
                  generateUrlString(
                    deviceType,
                    getPreferences(deviceType).map((name) => ({ name, value: '' }))
                  )
                )
              }}>
              Reset Preferences
            </Button>
          </Group>
          <ScrollArea type='always'>
            <SegmentedControl
              fullWidth
              mb={width < 1000 ? 'sm' : 0}
              value={deviceType}
              onChange={(value) => {
                setAccordionState(getPreferences(value))
                router.push(
                  generateUrlString(
                    value,
                    getPreferences(value).map((name) => ({ name, value: '' }))
                  )
                )
              }}
              data={Object.keys(deviceTypeEnum).map((deviceType) => {
                return { label: t(deviceType), value: deviceType }
              })}
            />
          </ScrollArea>
        </Stack>

        {preferences && (
          <Accordion
            mt='md'
            multiple
            variant='contained'
            value={accordionState}
            onChange={setAccordionState}
            styles={{
              control: {
                lineHeight: 1.3,
                backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : 'white',
              },
              content: { backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : 'white' },
            }}>
            {getPreferences(deviceType).map((pref, index: number) => (
              <PreferenceInput
                value={getSegmentedData(pref)}
                deviceType={deviceType}
                preferences={preferences}
                index={index}
                key={index}
              />
            ))}
          </Accordion>
        )}
        <Button
          fullWidth
          mt='xl'
          mb='md'
          disabled={isLoading}
          color='green'
          variant='light'
          onClick={() => handleSubmit()}>
          {isLoading ? t('loading') : 'Find Your Device'}
        </Button>
        <RecommendedDevices data={data} isLoading={isLoading} title='Best Matched Devices' />
      </Container>
    </>
  )
}

type preferenceInputType = {
  value: inputType
  index: number
  deviceType: string
  preferences: preferenceType[]
}

function PreferenceInput({ value, index, deviceType, preferences }: preferenceInputType) {
  const router = useRouter()
  const { width } = useViewportSize()
  const { t } = useTranslation('translations')
  return (
    <>
      <Accordion.Item value={preferences[index].name}>
        <Accordion.Control>{t(preferences[index].name)}</Accordion.Control>
        <Accordion.Panel>
          <ScrollArea type='always'>
            <SegmentedControl
              fullWidth
              mb={width < 1000 ? 'sm' : 0}
              data={value}
              defaultValue=''
              styles={
                preferences[index].value === ''
                  ? { indicator: { backgroundColor: 'transparent' } }
                  : undefined
              }
              value={preferences[index].value}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onChange={(newValue) => (
                (preferences[index].value = newValue),
                router.push(generateUrlString(deviceType, preferences))
              )}
            />
          </ScrollArea>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  )
}
