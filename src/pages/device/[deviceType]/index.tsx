import { Container, SimpleGrid } from '@mantine/core'
import type { DevicePropertiesType, DeviceType } from '@/models/enums'
import { useEffect, useState } from 'react'

import DeviceCard from '@/components/device/DeviceCard'
import DeviceHeader from '@/components/device/DeviceTypeHeader'
import Head from 'next/head'
import Loader from '@/components/layout/Loader'
import { trpc } from '@/utils/client'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'

type Device = {
  isInList?: boolean
} & DevicePropertiesType

export default function Devices() {
  const router = useRouter() // Get the router object
  const posthog = usePostHog() // Get the posthog client
  // Get the device type from the url and cast it to DeviceType enum
  const deviceType = router.asPath.split('/')[router.asPath.split('/').length - 1] as DeviceType
  const user = useUser() // Get the user object from Supabase
  const [devices, setDevices] = useState<Device[] | undefined>(undefined) //
  const devicesQuery = trpc.device.getDevices.useQuery({
    deviceType: deviceType,
  }) // Get the devices from the database
  const userDevicesQuery = trpc.device.getUserDevicesProperties.useQuery({
    email: user?.email,
  }) // Get the user devices from the database
  const [captured, setCaptured] = useState(false) // Was page captured in posthog

  // When user data changes
  useEffect(() => {
    const userDevices = userDevicesQuery.data?.deviceList // Get the user devices
    // If user devices exists
    if (userDevices) {
      // Set the is in list property in each device
      setDevices((prev) =>
        prev?.map((device) => {
          // If the device is in the user devices
          if (userDevices.find((userDevice) => userDevice.device.model === device.model)) {
            return { ...device, isInList: true } // Set the is in list property to true
          }
          return device // Return the unchanged device if it is not in the user devices
        })
      )
    }
  }, [userDevicesQuery.data?.deviceList])

  // When device data changes
  useEffect(() => {
    // If device data exists
    if (devicesQuery.data) {
      setDevices(devicesQuery.data) // Set the devices to the device data
    }
    // If posthog was not captured
    if (!captured && devicesQuery.data) {
      // Capture the device type page in posthog
      posthog.capture('Device Type Page', {
        deviceType,
      })
      setCaptured(true) // Set the captured state to true
    }
  }, [captured, deviceType, devicesQuery.data, posthog])

  // If devices are not loaded
  if (!devices) return <Loader />

  // If devices are loaded and there are devices
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
              <DeviceCard device={value} key={index} />
            ))}
          </SimpleGrid>
        </Container>
      </>
    )
  }
}
