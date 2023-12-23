import Head from 'next/head'
import { useEffect, useState } from 'react'
import React from 'react'
import { trpc } from '../misc/trpc'
import DevicePhotos from '../components/device/DevicePhotos'
import useTranslation from 'next-translate/useTranslation'
import { type deviceSpecsType } from '../models/SpecsFormatter'
import DevicesSpecs from '../components/device/DevicesSpecs'
import { Container, Group, Select, SimpleGrid } from '@mantine/core'
import Loader from '../components/layout/Loader'

export default function Compare() {
  const { t } = useTranslation('translations')
  const { data: allDevices } = trpc.device.getModelsAndNames.useQuery()
  const { mutate: deviceMutation } = trpc.device.getDeviceMutation.useMutation()
  const [value1, setValue1] = useState<string | null>(null)
  const [value2, setValue2] = useState<string | null>(null)
  const [device1, setDevice1] = useState<deviceSpecsType | undefined>(undefined)
  const [device2, setDevice2] = useState<deviceSpecsType | undefined>(undefined)

  useEffect(() => {
    if (value1 && value2) {
      deviceMutation(
        { model: value1 },
        {
          onSuccess(data) {
            if (data != undefined) {
              setDevice1(data)
              deviceMutation(
                { model: value2 },
                {
                  onSuccess(data) {
                    if (data != undefined) {
                      setDevice2(data)
                    }
                  },
                }
              )
            }
          },
        }
      )
    }
  }, [value1, value2, deviceMutation])

  if (allDevices === undefined) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>{t('compare')}</title>
      </Head>
      <Container size='lg'>
        <Group grow position='apart' mb='xs' mt='sm'>
          <Select
            label={t('selectDevice')}
            placeholder='Pick one'
            value={value1}
            onChange={setValue1}
            data={allDevices.map((value) => ({
              value: value.model,
              label: value.name,
            }))}
          />
          <Select
            label={t('selectDevice')}
            placeholder='Pick one'
            value={value2}
            onChange={setValue2}
            data={allDevices.map((value) => ({
              value: value.model,
              label: value.name,
            }))}
          />
        </Group>
        {device1 !== undefined && device2 !== undefined ? (
          <>
            <SimpleGrid
              mb='md'
              cols={2}
              breakpoints={[
                { maxWidth: 'sm', cols: 1 },
                { minWidth: 'lg', cols: 2 },
              ]}>
              <DevicePhotos
                withName={true}
                device={{
                  name: device1.name,
                  model: device1.model,
                  type: device1.type,
                  imageAmount: device1.imageAmount,
                }}
                miniphotos={true}
              />
              <DevicePhotos
                withName={true}
                device={{
                  name: device2.name,
                  model: device2.model,
                  type: device1.type,
                  imageAmount: device2.imageAmount,
                }}
                miniphotos={true}
              />
            </SimpleGrid>
            <DevicesSpecs device1={device1} device2={device2} />
          </>
        ) : (
          (value1 !== null || value2 !== null) && <Loader />
        )}
      </Container>
    </>
  )
}
