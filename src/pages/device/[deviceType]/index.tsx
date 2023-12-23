import { trpc } from '../../../misc/trpc'
import DeviceCard from '../../../components/device/DeviceCard'
import { Container, SimpleGrid } from '@mantine/core'
import DeviceHeader from '../../../components/device/DeviceTypeHeader'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import type {
  DeviceType,
  devicePropertiesType,
} from '../../../models/deviceTypes'
import { usePostHog } from 'posthog-js/react'
import Loader from '../../../components/layout/Loader'

type devicesType = {
  isInList?: boolean
} & devicePropertiesType

// /device/iphone page
export default function DeviceTypePage() {
  const router = useRouter()
  const posthog = usePostHog()
  const deviceType = router.asPath.split('/')[
    router.asPath.split('/').length - 1
  ] as DeviceType
  const user = useUser()
  const [devices, setDevices] = useState<devicesType[] | undefined>(undefined)
  const { data: devicesQuery } = trpc.device.getDevices.useQuery({
    deviceType: deviceType,
  })
  const { data: userDevicesQuery } = trpc.device.getUserDevices.useQuery({
    email: user?.email,
  })
  const [captured, setCaptured] = useState(false)

  useEffect(() => {
    const userDevices = userDevicesQuery?.deviceList
    if (userDevices) {
      setDevices((prev) =>
        prev?.map((device) => {
          if (
            userDevices.find(
              (userDevice) => userDevice.device.model === device.model
            )
          ) {
            return { ...device, isInList: true }
          }
          return device
        })
      )
    }
  }, [])

  useEffect(() => {
    if (devicesQuery) {
      setDevices(devicesQuery)
    }
    if (!captured && devicesQuery) {
      posthog.capture('Device Type Page', {
        deviceType,
      })
      setCaptured(true)
    }
  }, [devicesQuery])

  if (!devices) return <Loader />

  if (devices && devices?.length > 0) {
    return (
      <>
        <Head>
          <title>{deviceType}</title>
        </Head>
        <Container size='lg'>
          <DeviceHeader deviceType={deviceType} />
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'sm', cols: 1 },
              { maxWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}>
            {devices.map((value, index) => (
              <DeviceCard device={value} key={index} deviceType={deviceType} />
            ))}
          </SimpleGrid>
        </Container>
      </>
    )
  }
}
