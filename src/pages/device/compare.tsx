import { Container, Divider, Group, SegmentedControl } from '@mantine/core'
import React, { useRef } from 'react'
import { Select, SimpleGrid, Title } from '@mantine/core'
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import DevicePhotos from '@/components/device/DevicePhotos'
import DevicesSpecs from '@/components/device/DevicesSpecs'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import { Translate } from 'next-translate'
import { api } from '@/lib/trpc'
import { useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

// Function to get the buttons for the segmented control
function getButtons(t: Translate, width: number) {
  const Buttons = [
    { label: `${t('two')} ${t('devices')}`, value: 2 },
    { label: `${t('three')} ${t('devices')}`, value: 3 },
    { label: `${t('four')} ${t('devices')}`, value: 4 }
  ]
  // Return the amount of buttons based on the width of the viewport
  return width > 1100 ? Buttons : width > 800 ? Buttons.slice(0, 2) : Buttons.slice(0, 1)
}

export default function Compare() {
  const { t } = useTranslation('main') // Get the translation function
  const { width } = useViewportSize() // Get the width of the viewport
  const prevWidthRef = useRef(width) // Store previous width
  const [comparison, setComparison] = useQueryStates({
    compareAmount: parseAsInteger.withDefault(3),
    deviceList: parseAsArrayOf(parseAsString, ';').withDefault([
      'iphone14',
      'iphone15',
      'iphone15pro'
    ])
  })

  const allDevicesQuery = api.device.getModelsAndNames.useQuery() // Get all devices from the database
  const selectedDevicesQuery = api.device.getDevicesFromModelsArr.useQuery({
    modelsArr: comparison.deviceList ?? []
  }) // Get the selected devices from the database

  // When width changes
  useEffect(() => {
    if (allDevicesQuery.data && width !== prevWidthRef.current) {
      const buttons = getButtons(t, width)
      const newCompareAmount =
        buttons.find((button) => Number(button.value) === comparison.compareAmount)?.value ??
        buttons[buttons.length - 1].value
      setComparison((prevComparison) => ({
        ...prevComparison,
        compareAmount: newCompareAmount,
        deviceList: allDevicesQuery.data.slice(0, newCompareAmount).map((device) => device.model)
      }))
      prevWidthRef.current = width // Update previous width
    }
  }, [width])

  // If all devices query data is loading
  if (allDevicesQuery.data === undefined) {
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
          value={String(comparison.compareAmount)}
          onChange={(value) =>
            setComparison({
              compareAmount: Number(value),
              deviceList: allDevicesQuery.data.slice(0, Number(value)).map((value) => value.model)
            })
          }
          data={getButtons(t, width).map((mark) => ({
            value: String(mark.value),
            label: mark.label
          }))}
          size='lg'
          fullWidth
        />
        <Group grow position='apart' mb='xs' mt='sm'>
          {comparison.deviceList.slice(0, comparison.compareAmount).map((_, index) => (
            <Select
              searchable
              label={t('selectDevice')}
              placeholder='Pick one'
              value={comparison.deviceList[index]}
              key={index}
              onChange={(newDevice) =>
                setComparison({
                  deviceList: comparison.deviceList.map((device, i) =>
                    i === index && newDevice ? newDevice : device
                  )
                })
              }
              data={allDevicesQuery.data.map((value) => ({
                value: value.model,
                label: value.name,
                group: value.type
              }))}
            />
          ))}
        </Group>
        {selectedDevicesQuery.data && selectedDevicesQuery.data.length > 0 ? ( // If the selected devices query data exists
          <>
            <SimpleGrid
              mb='md'
              cols={selectedDevicesQuery.data.slice(0, comparison.compareAmount).length}>
              {comparison.deviceList.slice(0, comparison.compareAmount).map((model, index) => {
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
                        imageAmount: device.imageAmount
                      }}
                    />
                  )
                )
              })}
            </SimpleGrid>
            <DevicesSpecs devices={selectedDevicesQuery.data.slice(0, comparison.compareAmount)} />
          </>
        ) : (
          comparison.deviceList && <Loader />
        )}
      </Container>
    </>
  )
}
