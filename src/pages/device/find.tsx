import { Accordion, Button, Container, Group, ScrollArea } from '@mantine/core'
import { SegmentedControl, Title } from '@mantine/core'
import { deviceTypesProperties, propertiesLabels } from '@/models/deviceProperties'
import { useEffect, useState } from 'react'

import Head from 'next/head'
import MatchedDevices from '@/components/device/MatchedDevices'
import { PropertiesSchemaType } from '@/models/deviceProperties'
import { api } from '@/lib/trpc'
import { deviceTypeSchema } from '@/models/schemas'
import { useQueryState } from 'nuqs'
import { useSiteSettings } from '@/hooks/useSiteSettings'
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

const getFormattedPreferences = (preferences: PreferenceType[]) => {
  return preferences.map((preference) => `${preference.name}-${preference.value}`).join(',')
}

export default function Find() {
  const { width } = useViewportSize()
  const { t, lang } = useTranslation('main')
  const {
    settings: { matchedDevicesLimit }
  } = useSiteSettings()

  const MatchedDevicesMutation = api.device.getMatchedDevices.useMutation()

  const [deviceType, setDeviceType] = useQueryState('deviceType', {
    defaultValue: 'iphone',
    parse: (value) => z.string().parse(value)
  })

  const [preferences, setPreferences] = useQueryState('preferences', {
    defaultValue: getFormattedPreferences(
      getPreferences(deviceType).map((name) => ({ name, value: '' }))
    ),
    parse: (value) => z.string().parse(value)
  })

  const parsedPreferences = preferences.split(',').map((value) => {
    return { name: value.split('-')[0], value: value.split('-')[1] }
  })

  const [accordionState, setAccordionState] = useState(parsedPreferences.map((pref) => pref.name))

  useEffect(() => {
    if (!preferences) {
      setPreferences(
        getFormattedPreferences(getPreferences(deviceType).map((name) => ({ name, value: '' })))
      )
    }
  }, [])

  function handleSubmit() {
    const userPreferences = parsedPreferences
      .filter((preference) => preference.value !== 'notInterested' && preference.value !== '')
      .map((preference) => ({
        name: preference.name as PropertiesSchemaType,
        value:
          (propertiesLabels
            .find((property) => property.property === preference.name)
            ?.labels?.indexOf(preference.value) ?? 0) + 1
      }))

    if (userPreferences.length > 0) {
      MatchedDevicesMutation.mutate({
        deviceType,
        userPreferences,
        matchedDevicesLimit
      })
    }
  }

  function getSegmentedData(preference: PropertiesSchemaType) {
    const data = propertiesLabels
      .find((property) => property.property === preference)
      ?.labels?.map((value) => ({
        value,
        label: lang === 'he' ? `${t(preference)} ${t(value)}` : `${t(value)} ${t(preference)}`
      }))

    return data ? [{ value: 'notInterested', label: t('notInterested') }, ...data] : []
  }

  return (
    <>
      <Head>
        <title>{t('find')}</title>
      </Head>
      <Container size='xl'>
        <Title order={1} mb='xl'>
          {t('compareTitle')}
        </Title>
        <Group position='apart' mb='xl'>
          <Title order={2}>{t('selectDeviceType')}</Title>
          <Button
            mb={8}
            w={'auto'}
            disabled={MatchedDevicesMutation.isPending}
            color='gray'
            variant='default'
            onClick={() => {
              MatchedDevicesMutation.reset()
              setDeviceType('iphone')
              setPreferences(
                getFormattedPreferences(
                  getPreferences('iphone').map((name) => ({ name, value: '' }))
                )
              )
            }}>
            {t('resetPreferences')}
          </Button>
        </Group>
        <SegmentedControl
          fullWidth
          value={deviceType}
          onChange={(value) => {
            setDeviceType(value)
            setAccordionState(getPreferences(value))
            setPreferences(
              getFormattedPreferences(getPreferences(value).map((name) => ({ name, value: '' })))
            )
          }}
          data={Object.keys(deviceTypeSchema.Enum).map((deviceType) => ({
            label: t(deviceType),
            value: deviceType
          }))}
        />

        {parsedPreferences && (
          <Accordion multiple value={accordionState} onChange={setAccordionState} mt='xl'>
            {getPreferences(deviceType).map((pref, index: number) => (
              <Accordion.Item key={pref} value={pref}>
                <Accordion.Control>{t(pref)}</Accordion.Control>
                <Accordion.Panel>
                  <PreferenceInput
                    value={getSegmentedData(pref as PropertiesSchemaType)}
                    index={index}
                    preferences={parsedPreferences}
                    setPreferences={setPreferences}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
        <Button
          fullWidth
          mt='md'
          mb='xl'
          disabled={MatchedDevicesMutation.isPending}
          color='green'
          variant='light'
          onClick={handleSubmit}>
          {MatchedDevicesMutation.isPending ? t('loading') : t('findYourDevice')}
        </Button>
        {MatchedDevicesMutation.data && (
          <ScrollArea offsetScrollbars type='always' h={width > 768 ? 600 : 400}>
            <MatchedDevices
              data={MatchedDevicesMutation.data}
              isLoading={MatchedDevicesMutation.isPending}
              title={t('bestMatchedDevices')}
            />
          </ScrollArea>
        )}
      </Container>
    </>
  )
}

type PreferenceInputType = {
  value: InputType
  index: number
  preferences: PreferenceType[]
  setPreferences: (value: string) => void
}

function PreferenceInput({ value, index, preferences, setPreferences }: PreferenceInputType) {
  return (
    <ScrollArea offsetScrollbars type='always'>
      <SegmentedControl
        fullWidth
        data={value}
        defaultValue=''
        mb='sm'
        value={preferences[index].value}
        onChange={(newValue) => {
          const updatedPreferences = [...preferences]
          updatedPreferences[index].value = newValue
          setPreferences(getFormattedPreferences(updatedPreferences))
        }}
      />
    </ScrollArea>
  )
}
