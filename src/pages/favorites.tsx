import { trpc } from '../utils/trpc'
import { Center, Container, Loader, SimpleGrid } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import React, { useEffect, useState } from 'react'
import type { devicesPropertiesArrType } from '../trpc/routers/auth'
import ListCard from '../components/allDevices/ListCard'
import useTranslation from 'next-translate/useTranslation'

export default function Favorites(): JSX.Element {
  const { height } = useViewportSize()
  const user = useUser()
  const userDevicesQuery = trpc.auth.getUserDevices.useQuery({
    userId: user?.id,
  })
  const [devicesArr, setDevicesArr] = useState<
    devicesPropertiesArrType | undefined
  >(undefined)
  const { t } = useTranslation('common')

  useEffect(() => {
    if (userDevicesQuery.data && devicesArr === undefined) {
      setDevicesArr(userDevicesQuery.data)
    }
  }, [devicesArr, userDevicesQuery.data])

  return (
    <>
      <Head>
        <title>{t('favorites')}</title>
      </Head>
      {userDevicesQuery.data ? (
        <Container size='lg'>
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'sm', cols: 1 },
              { maxWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}>
            {devicesArr &&
              devicesArr.map((value, index) => (
                <ListCard
                  device={{
                    model: value.model,
                    imageAmount: value.imageAmount,
                    name: value.name,
                  }}
                  key={index}
                  deviceType={value.deviceTypeValue}
                  setDevicesArr={setDevicesArr}
                  devicesArr={devicesArr}
                />
              ))}
          </SimpleGrid>
        </Container>
      ) : (
        <Center>
          <Loader color='gray' size={120} variant='dots' mt={height / 3} />
        </Center>
      )}
    </>
  )
}
