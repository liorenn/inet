import { Accordion, Button, Container, Divider, Group, ScrollArea } from '@mantine/core'
import { SegmentedControl, Stack, Title, useMantineColorScheme } from '@mantine/core'
import { deviceTypesProperties, propertiesLabels } from '@/models/deviceProperties'
import { useEffect, useState } from 'react'

import Head from 'next/head'
import MatchedDevices from '@/components/device/MatchedDevices'
import { PropertiesSchemaType } from '@/models/deviceProperties'
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

/* eslint-disable @typescript-eslint/no-floating-promises */

// Function to get the preferences options of a device type
const getPreferences = (deviceType: string) => {
  // Find the device type properties in the deviceTypesProperties array and return it
  return deviceTypesProperties.find((device) => device.deviceType === deviceType)?.properties ?? []
}

// Function to generate the url string from the device type and preferences
function generateUrlString(deviceType: string, preferences: PreferenceType[]) {
  return `?deviceType=${deviceType}&preferences=${getFormattedPreferences(preferences)}` // Generate the url string with url parameters
}

// Function to format the preferences to a string
function getFormattedPreferences(preferences: PreferenceType[]) {
  return `${preferences
    // For each preference in the preferences array
    .map((preference) => {
      return `${preference.name}-${preference.value}` // Return a formatted string seperated by a dash
    })
    .join(',')}` // Join the preferences seperated by a comma
}

export default function Find() {
  const router = useRouter() // Get the router
  const { width } = useViewportSize() // Get the width of the viewport
  const { t, lang } = useTranslation('main') // Get the translation function
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const MatchedDevicesMutation = trpc.device.getMatchedDevices.useMutation() // Mutation to get the matched devices
  const deviceType = z.string().parse(router.query.deviceType ?? 'iphone') // Get the device type from the url
  const preferences = z // Get the user preferences from the url
    .string() // Parse the preferences to a string
    .parse(
      router.query.preferences ??
        getFormattedPreferences(getPreferences(deviceType).map((name) => ({ name, value: '' })))
      // Set the preferences to be empty if they are not in the url
    )
    .split(',') // Split the preferences seperated by a comma into an array
    .map((value) => {
      // Map the preferences to an object with name and value of the preference
      return { name: value.split('-')[0], value: value.split('-')[1] }
    })

  const [accordionState, setAccordionState] = useState<string[]>(
    preferences.map((pref) => pref.name)
  ) // Set the accordion state to manage his opened and closed states

  // When component mounts
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

  // Function to handle the submit of the preferences form
  function handleSubmit() {
    const userPreferences = preferences
      // Filter the preferences that are not not interested and empty
      .filter((preference) => preference.value !== 'notInterested' && preference.value !== '')
      // For each preference
      .map((preference) => {
        return {
          name: preference.name as PropertiesSchemaType, // Cast the name to a PropertiesSchemaType
          value:
            (propertiesLabels
              .find((property) => property.property === preference.name) // Find the property label in the propertiesLabels array
              ?.labels?.indexOf(preference.value) ?? 0) + 1, // Get the value of the label
        }
      })
    // If user chose no preferences after the filtering
    if (userPreferences.length > 0)
      MatchedDevicesMutation.mutate({ deviceType, userPreferences: userPreferences }) // Send the user preferences to the server
  }

  // Function to get the segmented data
  function getSegmentedData(preference: PropertiesSchemaType) {
    const data = propertiesLabels
      .find((property) => property.property === preference) // Find the property in the propertiesLabels array
      ?.labels?.map((value) => {
        return {
          value: value,
          label: lang === 'he' ? `${t(preference)} ${t(value)}` : `${t(value)} ${t(preference)}`, // Translate the preference label
        }
      })
    return data ? [{ value: 'notInterested', label: t('notInterested') }, ...data] : [] // Add the not interested option and return segmented data
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
                MatchedDevicesMutation.reset() // Reset the matched devices query
                // Push a new url string
                router.push(
                  // Generate a url string with empty preferences
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
                setAccordionState(getPreferences(value)) // Update the accordion state
                // Push a new url string
                router.push(
                  // Generate a url string with preferences based on the new device type
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

// Type for the preference input
type preferenceInputType = {
  value: InputType
  index: number
  deviceType: string
  preferences: PreferenceType[]
}

function PreferenceInput({ value, index, deviceType, preferences }: preferenceInputType) {
  const router = useRouter() // Get the router
  const { t } = useTranslation('main') // Get the translation function

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
              onChange={(newValue) => {
                preferences[index].value = newValue // Update the preference value
                router.push(generateUrlString(deviceType, preferences)) // Push a new url string with updated preferences
              }}
            />
          </ScrollArea>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  )
}
