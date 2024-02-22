import { Container, Divider, Group, SegmentedControl } from '@mantine/core'
import { Select, SimpleGrid, Title } from '@mantine/core'
import { useEffect, useState } from 'react'

import DevicePhotos from '@/components/device/DevicePhotos'
import DevicesSpecs from '@/components/device/DevicesSpecs'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import React from 'react'
import { Translate } from 'next-translate'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

/* eslint-disable @typescript-eslint/no-floating-promises */

// Function to get the buttons for the segmented control
function getButtons(t: Translate, width: number) {
  const Buttons = [
    { label: `${t('two')} ${t('devices')}`, value: '2' },
    { label: `${t('three')} ${t('devices')}`, value: '3' },
    { label: `${t('four')} ${t('devices')}`, value: '4' },
  ]
  // If the screen is wide only show four buttons
  if (width > 1100) {
    return Buttons // Return the buttons
  }
  // If the screen is medium only show three buttons
  if (width > 800) {
    return Buttons.slice(0, 2) // Slice the buttons array to only show three buttons
  }
  // If the screen is small only show two buttons
  return Buttons.slice(0, 1) // Slice the buttons array to only show two buttons
}

export default function Compare() {
  const user = useUser()
  const { t } = useTranslation('main') // Get the translation function
  const { width } = useViewportSize() // Get the width of the viewport
  const router = useRouter() // Get the router
  const deviceList = z
    .string() // Parse to string
    .parse(router.query.deviceList ?? '') // Parse the device list from the url
    .split(',') // Split the device list into an array
  const [compareAmount, setCompareAmount] = useState(
    getButtons(t, width).find((mark) => Number(mark.value) === deviceList.length)?.value
  ) // Get the amount of devices to compare
  const allDevicesQuery = trpc.device.getModelsAndNames.useQuery() // Get all devices from the database
  const selectedDevicesQuery = trpc.device.getDevicesFromModelsArr.useQuery({
    modelsArr: deviceList,
  }) // Get the selected devices from the database

  // When user state or url changes
  useEffect(() => {
    // If the user is not signed in
    if (!user) {
      router.push('/') // Push the user to the home page
    }
  }, [user, router])

  // When compare amount changes
  useEffect(() => {
    // If all devices query data exists
    if (allDevicesQuery.data) {
      // Get the new compare amount
      const arrayLength = Number(
        getButtons(t, width).find((mark) => mark.value === compareAmount)?.value
      )
      // Push the new compare amount to device list in the url
      router.push(
        generateUrlSring(allDevicesQuery.data.slice(0, arrayLength).map((device) => device.model))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareAmount])

  // When width changes
  useEffect(() => {
    // Set the new compare amount based on the width
    setCompareAmount(
      getButtons(t, width).find((mark) => Number(mark.value) === deviceList.length)?.value
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])

  // When device list changes
  useEffect(() => {
    // If the device list is not in the url
    if (!router.query.deviceList) {
      router.push(generateUrlSring(['iphone14', 'iphone15pro'])) // Push the default device list to the url
    }
  }, [router])

  // Function to generate the url string
  function generateUrlSring(deviceList: string[]) {
    return `?deviceList=${deviceList.join(',')}` // Return the url string
  }

  // Function to update the device list
  function updateDeviceList(model: string | null, index: number) {
    if (model === null) return // If the model is null exit the function
    const newDeviceList = deviceList // Create a new device list
    newDeviceList[index] = model // Update the model in the new device list
    router.push(generateUrlSring(newDeviceList)) // Push the new device list to the url
  }

  // If all devices query data is loading
  if (allDevicesQuery.data === undefined || !user) {
    return (
      <>
        <Head>
          <title>{t('compare')}</title>
        </Head>
        <Loader />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{t('compare')}</title>
      </Head>
      <Container size='lg'>
        <Title>{t('compareTitle')}</Title>
        <Divider mb='md' />
        <Title size={22}>{t('selectDevicesAmount')}</Title>
        <SegmentedControl
          value={compareAmount}
          onChange={setCompareAmount}
          data={getButtons(t, width)}
          size='lg'
          fullWidth
        />
        <Group grow position='apart' mb='xs' mt='sm'>
          {deviceList.map((_, index) => (
            <Select
              searchable
              label={t('selectDevice')}
              placeholder='Pick one'
              value={deviceList[index]}
              key={index}
              onChange={(e) => updateDeviceList(e, index)}
              data={allDevicesQuery.data.map((value) => ({
                value: value.model,
                label: value.name,
                group: value.type,
              }))}
            />
          ))}
        </Group>
        {selectedDevicesQuery.data && selectedDevicesQuery.data.length > 0 ? ( // If the selected devices query data exists
          <>
            <SimpleGrid mb='md' cols={selectedDevicesQuery.data.length}>
              {deviceList.map((model, index) => {
                const device = selectedDevicesQuery.data.find((device) => device.model === model)
                return (
                  device && (
                    <DevicePhotos
                      key={index}
                      withName={true}
                      miniphotos={false}
                      device={{
                        name: device.name,
                        model: device.model,
                        type: device.type,
                        imageAmount: device.imageAmount,
                      }}
                    />
                  )
                )
              })}
            </SimpleGrid>
            <DevicesSpecs devices={selectedDevicesQuery.data} />
          </>
        ) : (
          // If the selected devices query data loads
          deviceList && <Loader />
        )}
      </Container>
    </>
  )
}
