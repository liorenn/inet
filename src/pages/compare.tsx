/* eslint-disable @typescript-eslint/no-floating-promises */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import React from 'react'
import { trpc } from '../misc/trpc'
import useTranslation from 'next-translate/useTranslation'
import {
  Container,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
} from '@mantine/core'
import Loader from '../components/layout/Loader'
import { useRouter } from 'next/router'
import { z } from 'zod'
import DevicePhotos from '../components/device/DevicePhotos'
import DevicesSpecs from '../components/device/DevicesSpecs'

const Buttons = [
  { label: 'Two Devices', value: '2' },
  { label: 'Three Devices', value: '3' },
  { label: 'Four Devices', value: '4' },
]

export default function Compare() {
  const { t } = useTranslation('translations')
  const router = useRouter()
  const deviceList = z
    .string()
    .parse(router.query.deviceList ?? '')
    .split(',')
  const [value, setValue] = useState(
    Buttons.find((mark) => Number(mark.value) === deviceList.length)?.value
  )
  const { data: allDevices } = trpc.device.getModelsAndNames.useQuery()
  const { data } = trpc.device.getDevicesFromArr.useQuery(deviceList)

  useEffect(() => {
    if (!router.query.deviceList) {
      router.push(generateUrlSring(['iphone14', 'iphone15pro']))
    }
  }, [router])

  useEffect(() => {
    if (allDevices) {
      const arrayLength = Number(
        Buttons.find((mark) => mark.value === value)?.value
      )
      router.push(
        generateUrlSring(
          allDevices.slice(0, arrayLength).map((device) => device.model)
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDevices, value])

  function generateUrlSring(deviceList: string[]) {
    return `?deviceList=${deviceList.join(',')}`
  }

  function updateDeviceList(model: string | null, index: number) {
    if (model === null) return
    const newDeviceList = deviceList
    newDeviceList[index] = model
    router.push(`?deviceList=${newDeviceList.join(',')}`)
  }

  if (allDevices === undefined) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>{t('compare')}</title>
      </Head>
      <Container size='lg'>
        <SegmentedControl
          value={value}
          onChange={setValue}
          data={Buttons}
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
              data={allDevices.map((value) => ({
                value: value.model,
                label: value.name,
              }))}
            />
          ))}
        </Group>
        {data ? (
          <>
            <SimpleGrid mb='md' cols={data.length}>
              {deviceList.map((model, index) => {
                const device = data.find((x) => x.model === model)
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
            <DevicesSpecs devices={data} />
          </>
        ) : (
          deviceList && <Loader />
        )}
      </Container>
    </>
  )
}
