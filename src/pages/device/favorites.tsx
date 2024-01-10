import { Container, SimpleGrid } from '@mantine/core'
import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import ListCard from '@/components/device/DeviceListCard'
import Loader from '@/components/layout/Loader'
import type { devicePropertiesType } from '@/models/deviceTypes'
import { trpc } from '@/server/client'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'

export default function Favorites() {
  const user = useUser()
  const { t } = useTranslation('translations')
  const { data } = trpc.device.getUserDevices.useQuery({
    email: user?.email,
  })
  const [devices, setDevices] = useState<devicePropertiesType[] | undefined>(undefined)

  useEffect(() => {
    if (data && devices === undefined) {
      setDevices(data)
    }
  }, [devices, data])

  return (
    <>
      <Head>
        <title>{t('favorites')}</title>
      </Head>
      {devices ? (
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
        <Loader />
      )}
    </>
  )
}
