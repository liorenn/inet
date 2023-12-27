import Head from 'next/head'
import { useEffect, useState } from 'react'
import React from 'react'
import { trpc } from '../misc/trpc'
import useTranslation from 'next-translate/useTranslation'
import { Container, Group, Select, SimpleGrid, Slider } from '@mantine/core'
import Loader from '../components/layout/Loader'
import { useRouter } from 'next/router'
import { z } from 'zod'
import DevicePhotos from '../components/device/DevicePhotos'
import DevicesSpecs from '../components/device/DevicesSpecs'

export default function Compare() {
  const { t } = useTranslation('translations')
  const router = useRouter()
  const deviceList = z
    .string()
    .parse(router.query.deviceList ?? '')
    .split(',')
  const [value, setValue] = useState(200 / 3)
  const { data: allDevices } = trpc.device.getModelsAndNames.useQuery()
  const { data } = trpc.device.getDevicesFromArr.useQuery(deviceList)

  useEffect(() => {
    if (!router.query.deviceList) {
      router.push(generateUrlSring(['iphone14', 'iphone15pro']))
    }
  }, [])

  useEffect(() => {
    if (allDevices) {
      const arrayLength = MARKS.find((mark) => mark.value === value)?.label
      router.push(
        generateUrlSring(
          allDevices.slice(0, arrayLength).map((device) => device.model)
        )
      )
    }
  }, [value])

  function generateUrlSring(deviceList: string[]) {
    return `?deviceList=${deviceList.join(',')}`
  }

  function updateDeviceList(model: string | null, index: number) {
    if (model === null) return
    const newDeviceList = deviceList
    newDeviceList[index] = model
    router.push(`?deviceList=${newDeviceList.join(',')}`)
  }

  const MARKS = [
    { value: 0, label: 1 },
    { value: 100 / 3, label: 2 },
    { value: 200 / 3, label: 3 },
    { value: 100, label: 4 },
  ]

  if (allDevices === undefined) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>{t('compare')}</title>
      </Head>
      <Container size='lg'>
        <Slider
          value={value}
          onChange={setValue}
          disabled={data === undefined}
          label={(val) => MARKS.find((mark) => mark.value === val)?.label}
          size='lg'
          step={100 / 3}
          marks={MARKS}
          styles={{ markLabel: { display: 'none' } }}
          color='gray'
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
            <SimpleGrid
              mb='md'
              cols={MARKS.find((mark) => mark.value === value)?.label}>
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
