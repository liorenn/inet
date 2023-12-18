import { Container, SimpleGrid } from '@mantine/core'
import { useUser } from '@supabase/auth-helpers-react'
import React, { useEffect, useState } from 'react'
import type { devicePropertiesType } from '../models/deviceTypes'
import ListCard from '../components/device/DeviceListCard'
import useTranslation from 'next-translate/useTranslation'
import Loader from '../components/layout/Loader'
import { trpc } from '../misc/trpc'
import Head from 'next/head'

export default function Favorites(): JSX.Element {
  const user = useUser()
  const userDevicesQuery = trpc.auth.getUserDevices.useQuery({
    userEmail: user?.email,
  })
  const [devicesArr, setDevicesArr] = useState<
    devicePropertiesType[] | undefined
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
                  device={value}
                  key={index}
                  deviceType={value.type}
                  setDevicesArr={setDevicesArr}
                  devicesArr={devicesArr}
                />
              ))}
          </SimpleGrid>
        </Container>
      ) : (
        <Loader />
      )}
    </>
  )
}
