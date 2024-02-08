import { Button, Container } from '@mantine/core'
import { useEffect, useState } from 'react'

import Comments from '@/components/misc/Comments'
import DeviceHeader from '@/components/device/DeviceHeader'
import DeviceLayout from '@/components/device/DeviceLayout'
import Head from 'next/head'
import Link from 'next/link'
import Loader from '@/components/layout/Loader'
import { trpc } from '@/utils/client'
import { useComments } from '@/hooks/useComments'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'

export default function Device() {
  const user = useUser() // Get the user object from Supabase
  const router = useRouter() // Get the router object
  const posthog = usePostHog() // Get the posthog client
  const { setUsername } = useComments() // Get the set username function for comments component
  const { t } = useTranslation('main') // Get the translation function
  const [captured, setCaptured] = useState(false) // Was page captured in posthog
  const deviceModel = router.asPath.split('/')[3] // Get the device model from the url
  const deviceDetailsQuery = trpc.device.getDevice.useQuery({
    model: deviceModel,
  }) // Get the device details from the database
  const userDetailsQuery = trpc.auth.getUserDetails.useQuery({
    email: user?.email,
  }) // Get the user details from the database

  // When user data changes
  useEffect(() => {
    // If user data finished loading
    if (userDetailsQuery.data) {
      setUsername(userDetailsQuery.data.username) // Set the username to the user username
    }
  }, [setUsername, userDetailsQuery.data])

  // When device data changes
  useEffect(() => {
    // If posthog was not captured
    if (!captured && deviceDetailsQuery.data) {
      // Capture the device page in posthog
      posthog.capture('Device Page', {
        deviceName: deviceDetailsQuery.data.name,
      })
      setCaptured(true) // Set captured state to true
    }
  }, [captured, deviceDetailsQuery.data, posthog])

  // If device data is not loaded
  if (deviceDetailsQuery.data === undefined) {
    return <Loader />
  }

  // If requested device does not exist
  if (deviceDetailsQuery.data === null) {
    return (
      <Container size='lg'>
        {t('deviceDoesntExist')}
        <br />
        <Link href={'/'}>
          <Button color='gray' size='lg' radius='md' mt='lg' variant='light'>
            {t('goToHomePage')}
          </Button>
        </Link>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>{deviceDetailsQuery.data.name}</title>
      </Head>
      <Container size='lg'>
        <DeviceHeader device={deviceDetailsQuery.data} />
        <DeviceLayout device={deviceDetailsQuery.data} />
        {user && userDetailsQuery.data?.username && <Comments device={deviceDetailsQuery.data} />}
      </Container>
    </>
  )
}
