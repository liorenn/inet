import { Center, Container, Divider, SimpleGrid, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'

import DeviceListCard from '@/components/device/DeviceListCard'
import { DevicePropertiesType } from '@/models/schemas'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import { api } from '@/lib/trpc'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export default function Favorites() {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const { t } = useTranslation('main') // Get the translation function
  const userDevicesQuery = api.device.getUserDevices.useQuery({
    email: user?.email
  }) // Get the user devices from the database
  const [devices, setDevices] = useState<DevicePropertiesType[] | undefined>(undefined) // State variable to store the user devices

  // When user data changes
  useEffect(() => {
    // If user data exists
    if (userDevicesQuery.data) {
      setDevices(userDevicesQuery.data) // Set the devices to the user devices
    }
  }, [userDevicesQuery.data])

  return (
    <>
      <Head>
        <title>{t('favorites')}</title>
      </Head>

      {devices ? (
        devices.length > 0 ? (
          <Container size='lg'>
            <Title>{t('favorites')}</Title>
            <Divider mb='md' />
            <SimpleGrid
              cols={3}
              breakpoints={[
                { maxWidth: 'sm', cols: 1 },
                { maxWidth: 'md', cols: 2 },
                { minWidth: 'lg', cols: 3 }
              ]}>
              {devices &&
                devices.map((value, index) => (
                  <DeviceListCard
                    device={value}
                    key={index}
                    deviceType={value.type}
                    setDevices={setDevices}
                  />
                ))}
            </SimpleGrid>
          </Container>
        ) : (
          <Center>You dont have any favorite devices</Center>
        )
      ) : (
        <Loader />
      )}
    </>
  )
}
