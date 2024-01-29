import { Accordion, Button, Container, Divider, Group, ScrollArea } from '@mantine/core'
import { SegmentedControl, Stack, Title, useMantineColorScheme } from '@mantine/core'
import { deviceTypesProperties, propertiesLabels } from '@/models/deviceProperties'
import { useEffect, useState } from 'react'

import Head from 'next/head'
import MatchedDevices from '@/components/device/MatchedDevices'
import { PropertiesSchemaType } from '@/models/deviceProperties'
import { Translate } from 'next-translate'
import { deviceType as deviceTypeEnum } from '@/models/enums'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

type InputType = { value: string; label: string }[]

type PreferenceType = {
  name: string
  value: string
}

const getPreferences = (deviceType: string) => {
  return deviceTypesProperties.find((device) => device.deviceType === deviceType)?.properties ?? []
}

function generateUrlString(deviceType: string, preferences: PreferenceType[]) {
  return `?deviceType=${deviceType}&preferences=${preferences
    .map((preference) => {
      return `${preference.name}-${preference.value}`
    })
    .join(',')}`
}

function getPreferencesFormatter(preferences: PreferenceType[]) {
  return `${preferences
    .map((preference) => {
      return `${preference.name}-${preference.value}`
    })
    .join(',')}`
}

/* eslint-disable @typescript-eslint/no-floating-promises */
export default function Find() {
  const router = useRouter() // Get the router
  const { width } = useViewportSize() // Get the width of the viewport
  const { t, lang } = useTranslation('main') // Get the translation function
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const MatchedDevicesMutation = trpc.device.getMatchedDevices.useMutation() // Mutation to get the matched devices
  const deviceType = z.string().parse(router.query.deviceType ?? 'iphone') // Get the device type from the url
  const preferences = z // Get the user preferences from the url
    .string()
    .parse(
      router.query.preferences ??
        getPreferencesFormatter(getPreferences(deviceType).map((name) => ({ name, value: '' })))
      // Set the preferences to be empty if they are not in the url
    )
    .split(',') // Split the preferences seperated by a comma into an array
    .map((value) => {
      // Map the preferences to an object with name and value
      return { name: value.split('-')[0], value: value.split('-')[1] }
    })

  const [accordionState, setAccordionState] = useState<string[]>(
    preferences.map((pref) => pref.name)
  ) // Set the accordion state to manage its state

  useEffect(() => {
    // If the preferences are not in the url
    if (!router.query.preferences) {
      // Push the preferences to the url
      router.push(
        // Generate the url string
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
          name: pref.name as PropertiesSchemaType,
          value:
            (propertiesLabels
              .find((property) => property.property === pref.name)
              ?.labels?.indexOf(pref.value) ?? 0) + 1,
        }
      })
    userPreferences.length > 0 &&
      MatchedDevicesMutation.mutate({ deviceType, userPreferences: userPreferences })
  }

  function getSegmentedData(t: Translate, lang: string, preference: PropertiesSchemaType) {
    const data = propertiesLabels
      .find((property) => property.property === preference)
      ?.labels?.map((value) => {
        return {
          value: value,
          label: lang === 'he' ? `${t(preference)} ${t(value)}` : `${t(value)} ${t(preference)}`,
        }
      })
    return data ? [{ value: 'notInterested', label: t('notInterested') }, ...data] : []
  }

  return (
    <>
      <Head>
        <title>{t('find')}</title>
      </Head>
      <Container size={1200}>
        <Title>{t('compareTitle')}</Title>
        <Divider mb='md' />
        <Stack spacing={0}>
          <Group position='apart'>
            <Title size={width < 1000 ? 20 : 22}>{t('selectDeviceType')}</Title>
            <Button
              mb={8}
              w={'auto'}
              disabled={MatchedDevicesMutation.isLoading}
              color='gray'
              variant='default'
              onClick={() => {
                MatchedDevicesMutation.reset()
                router.push(
                  generateUrlString(
                    deviceType,
                    getPreferences(deviceType).map((name) => ({ name, value: '' }))
                  )
                )
              }}>
              {t('resetPreferences')}
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
                value={getSegmentedData(t, lang, pref)}
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
          disabled={MatchedDevicesMutation.isLoading}
          color='green'
          variant='light'
          onClick={() => handleSubmit()}>
          {MatchedDevicesMutation.isLoading ? t('loading') : t('findYourDevice')}
        </Button>
        <MatchedDevices
          data={MatchedDevicesMutation.data}
          isLoading={MatchedDevicesMutation.isLoading}
          title={t('bestMatchedDevices')}
        />
      </Container>
    </>
  )
}

type preferenceInputType = {
  value: InputType
  index: number
  deviceType: string
  preferences: PreferenceType[]
}

function PreferenceInput({ value, index, deviceType, preferences }: preferenceInputType) {
  const router = useRouter()
  const { t } = useTranslation('main')

  return (
    <>
      <Accordion.Item value={preferences[index].name}>
        <Accordion.Control>{t(preferences[index].name)}</Accordion.Control>
        <Accordion.Panel>
          <ScrollArea type='always'>
            <SegmentedControl
              fullWidth
              data={value}
              defaultValue=''
              mb='sm'
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
