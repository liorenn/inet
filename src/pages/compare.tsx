import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  SegmentedControl,
  Select,
} from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import React from 'react'
import ModelsSpecs from '../components/specificDevice/ModelsSpecs'
import { airpodsType, imacType, iphoneType } from '../utils/deviceTypes'
import { trpc } from '../utils/trpc'
import DevicePhotos from '../components/allDevices/DevicePhotos'
import { DeviceTypeValue } from '@prisma/client'

export default function compare() {
  const { height } = useViewportSize()
  const devicesQuery = trpc.AllDevices.getAllDevices.useMutation()
  const [value1, setValue1] = useState<string | null>(null)
  const [value2, setValue2] = useState<string | null>(null)
  const [value, setValue] = useState<DeviceTypeValue>('iphone')
  const [devicesList, setDevicesList] = useState<
    { label: string; value: string }[]
  >([])
  const [device1, setDevice1] = useState<
    iphoneType | airpodsType | imacType | undefined
  >(undefined)
  const [device2, setDevice2] = useState<
    iphoneType | airpodsType | imacType | undefined
  >(undefined)
  const airpodsMutation = trpc.UniqueDevice.getAirpodsMutation.useMutation()
  const imacMutation = trpc.UniqueDevice.getiMacMutation.useMutation()
  const iphoneMutation = trpc.UniqueDevice.getiPhoneMutation.useMutation()

  const devicesQueries = [
    {
      deviceType: DeviceTypeValue.iphone,
      queryMutation: iphoneMutation,
    },
    {
      deviceType: DeviceTypeValue.airpods,
      queryMutation: airpodsMutation,
    },
    {
      deviceType: DeviceTypeValue.imac,
      queryMutation: imacMutation,
    },
  ]

  useEffect(() => {
    if (value) {
      devicesQuery.mutate(
        { deviceType: value },
        {
          onSuccess(data) {
            setDevicesList(
              data.map((value) => {
                return { label: value.name, value: value.model }
              })
            )
          },
        }
      )
    }
  }, [value])

  useEffect(() => {
    if (value1 && value2) {
      const index = devicesQueries.findIndex(
        (object) => object.deviceType === value
      )
      devicesQueries[index].queryMutation.mutate(
        { model: value1 },
        {
          onSuccess(data) {
            setDevice1(data)
            devicesQueries[index].queryMutation.mutate(
              { model: value2 },
              {
                onSuccess(data) {
                  setDevice2(data)
                },
              }
            )
          },
        }
      )
    }
  }, [value1, value2])

  if (devicesList === undefined || devicesList === null) {
    return (
      <Center>
        <Loader color='gray' size={120} variant='dots' mt={height / 3} />
      </Center>
    )
  }

  return (
    <>
      <Head>
        <title>compare</title>
      </Head>
      <Container size='lg'>
        <SegmentedControl
          size='xl'
          fullWidth
          transitionDuration={500}
          transitionTimingFunction='linear'
          value={value}
          onChange={(value: string) => {
            setValue(value as DeviceTypeValue)
            setValue1(null)
            setValue2(null)
            setDevice1(undefined)
            setDevice2(undefined)
          }}
          data={[
            { label: 'iPhone', value: 'iphone' },
            { label: 'iPad', value: 'ipad' },
            { label: 'Airpods', value: 'airpods' },
            { label: 'iMac', value: 'imac' },
            { label: 'Mac', value: 'mac' },
          ]}
        />
        <Group grow position='apart' mb='xs' mt='sm'>
          <Select
            label={'Select ' + value + ' For Comparison'}
            placeholder='Pick one'
            value={value1}
            onChange={setValue1}
            data={devicesList}
          />
          <Select
            label={'Select ' + value + ' For Comparison'}
            placeholder='Pick one'
            value={value2}
            onChange={setValue2}
            data={devicesList}
          />
        </Group>
        {device1 !== undefined && device2 !== undefined ? (
          <>
            <Group grow position='apart' mb='xs'>
              <DevicePhotos
                device={{
                  name: device1.name,
                  model: device1.model,
                  imageAmount: device1.imageAmount,
                }}
                miniphotos={true}
              />
              <DevicePhotos
                device={{
                  name: device2.name,
                  model: device2.model,
                  imageAmount: device2.imageAmount,
                }}
                miniphotos={true}
              />
            </Group>
            <ModelsSpecs device1={device1} device2={device2} />
          </>
        ) : (
          (value1 !== null || value2 !== null) && (
            <Center>
              <Loader color='gray' size={120} variant='dots' mt={height / 3} />
            </Center>
          )
        )}
      </Container>
    </>
  )
}
