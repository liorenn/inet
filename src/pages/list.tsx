import { trpc } from '../utils/trpc'
import DeviceCard from '../components/allDevices/DeviceCard'
import { Center, Container, Loader, SimpleGrid } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import React from 'react'

interface PropsType {
  devicePath: string
}
// /device/iphone page
export default function List(): JSX.Element {
  const { height, width } = useViewportSize()
  const user = useUser()
  const userDevicesQuery = trpc.auth.getUserDevices.useQuery({
    userId: user?.id,
  })
  console.log(userDevicesQuery.data)
  return (
    <>
      <Head>
        <title>List</title>
      </Head>
      {userDevicesQuery.data ? (
        <Container size='lg'>
          <SimpleGrid cols={3}>
            {userDevicesQuery?.data?.map((value, index) => (
              <DeviceCard
                device={{
                  model: value.model,
                  imageAmount: value.imageAmount,
                  name: value.name,
                }}
                key={index}
                deviceType={value.deviceTypeValue}
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
