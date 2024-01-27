import {
  Container,
  Divider,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'

import DevicePhotos from '@/components/device/DevicePhotos'
import DevicesSpecs from '@/components/device/DevicesSpecs'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import React from 'react'
import { Translate } from 'next-translate'
import { translateDeviceName } from '@/utils/utils'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'
import { z } from 'zod'

function getButtons(t: Translate, width: number) {
  const Buttons = [
    { label: `${t('two')} ${t('devices')}`, value: '2' },
    { label: `${t('three')} ${t('devices')}`, value: '3' },
    { label: `${t('four')} ${t('devices')}`, value: '4' },
  ]
  if (width > 1100) {
    return Buttons
  }
  if (width > 800) {
    return Buttons.slice(0, 2)
  }
  return Buttons.slice(0, 1)
}

/* eslint-disable @typescript-eslint/no-floating-promises */
export default function Compare() {
  const { t } = useTranslation('translations')
  const { width } = useViewportSize()
  const router = useRouter()
  const deviceList = z
    .string()
    .parse(router.query.deviceList ?? '')
    .split(',')
  const [compareAmount, setCompareAmount] = useState(
    getButtons(t, width).find((mark) => Number(mark.value) === deviceList.length)?.value
  )
  const allDevicesQuery = trpc.device.getModelsAndNames.useQuery()
  const selectedDevicesQuery = trpc.device.getDevicesFromModelsArr.useQuery({
    modelsArr: deviceList,
  })

  useEffect(() => {
    setCompareAmount(
      getButtons(t, width).find((mark) => Number(mark.value) === deviceList.length)?.value
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])

  useEffect(() => {
    if (!router.query.deviceList) {
      router.push(generateUrlSring(['iphone14', 'iphone15pro']))
    }
  }, [router])

  useEffect(() => {
    if (allDevicesQuery.data) {
      const arrayLength = Number(
        getButtons(t, width).find((mark) => mark.value === compareAmount)?.value
      )
      router.push(
        generateUrlSring(allDevicesQuery.data.slice(0, arrayLength).map((device) => device.model))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDevicesQuery.data, compareAmount])

  function generateUrlSring(deviceList: string[]) {
    return `?deviceList=${deviceList.join(',')}`
  }

  function updateDeviceList(model: string | null, index: number) {
    if (model === null) return
    const newDeviceList = deviceList
    newDeviceList[index] = model
    router.push(`?deviceList=${newDeviceList.join(',')}`)
  }

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
          value={compareAmount}
          onChange={setCompareAmount}
          data={getButtons(t, width)}
          size='lg'
          fullWidth
        />
        <Group grow position='apart' mb='xs' mt='sm'>
          {deviceList.map((_, index) => (
            <Select
              label={t('selectDevice')}
              placeholder='Pick one'
              value={deviceList[index]}
              key={index}
              onChange={(e) => updateDeviceList(e, index)}
              data={allDevicesQuery.data.map((value) => ({
                value: value.model,
                label: translateDeviceName(t, value.name),
              }))}
            />
          ))}
        </Group>
        {selectedDevicesQuery.data && selectedDevicesQuery.data.length > 0 ? (
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
          deviceList && <Loader />
        )}
      </Container>
    </>
  )
}
