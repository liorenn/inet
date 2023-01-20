import { trpc } from '../utils/trpc'
import DeviceCard from '../components/allDevices/DeviceCard'
import { Center, Container, Loader, SimpleGrid } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import React, { useEffect, useState } from 'react'
import { devicesPropertiesArrType } from '../trpc/routers/auth'
import ListCard from '../components/allDevices/ListCard'

export default function List(): JSX.Element {
  const { height } = useViewportSize()
  const user = useUser()
  const userDevicesQuery = trpc.auth.getUserDevices.useQuery({
    userId: user?.id,
  })
  const [devicesArr, setDevicesArr] = useState<
    devicesPropertiesArrType | undefined
  >(undefined)

  useEffect(() => {
    if (userDevicesQuery.data && devicesArr === undefined) {
      setDevicesArr(userDevicesQuery.data)
    }
  }, [userDevicesQuery])

  return (
    <>
      <Head>
        <title>List</title>
      </Head>
      {userDevicesQuery.data ? (
        <Container size='lg'>
          <SimpleGrid cols={3}>
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
