import { Center, Container, SimpleGrid } from '@mantine/core'
import React, { useEffect, useState } from 'react'

import type { DevicePropertiesType } from '@/models/enums'
import Head from 'next/head'
import ListCard from '@/components/device/DeviceListCard'
import Loader from '@/components/layout/Loader'
import { trpc } from '@/utils/client'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'

export default function Favorites() {
  const user = useUser() // Get the user object from Supabase
  const { t } = useTranslation('main') // Get the translation function
  const userDevicesQuery = trpc.device.getUserDevices.useQuery({
    email: user?.email,
  }) // Get the user object from Supabase
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
            <SimpleGrid
              cols={3}
              breakpoints={[
                { maxWidth: 'sm', cols: 1 },
                { maxWidth: 'md', cols: 2 },
                { minWidth: 'lg', cols: 3 },
              ]}>
              {devices &&
                devices.map((value, index) => (
                  <ListCard
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
