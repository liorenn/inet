import {
  Center,
  Container,
  Group,
  Loader,
  Select,
  SimpleGrid,
} from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import React from 'react'
import { trpc } from '../utils/trpc'
import DevicePhotos from '../components/allDevices/DevicePhotos'
import useTranslation from 'next-translate/useTranslation'
import { type deviceSpecsType } from '../utils/SpecsFormatter'
import ModelsSpecs from '../components/specificDevice/ModelsSpecs'

export default function Compare() {
  const { height } = useViewportSize()
  const { data: allDevices } = trpc.device.getAllDevices.useQuery()
  const [value1, setValue1] = useState<string | null>(null)
  const [value2, setValue2] = useState<string | null>(null)
  const [device1, setDevice1] = useState<deviceSpecsType | undefined>(undefined)
  const [device2, setDevice2] = useState<deviceSpecsType | undefined>(undefined)
  const { mutate: deviceMutation } = trpc.device.getDeviceMutation.useMutation()
  const { t } = useTranslation('common')

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
    return (
      <Center>
        <Loader color='gray' size={120} variant='dots' mt={height / 3} />
      </Center>
    )
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
                  imageAmount: device1.imageAmount,
                }}
                miniphotos={true}
              />
              <DevicePhotos
                withName={true}
                device={{
                  name: device2.name,
                  model: device2.model,
                  imageAmount: device2.imageAmount,
                }}
                miniphotos={true}
              />
            </SimpleGrid>
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
