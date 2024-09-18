import { Button, Container } from '@mantine/core'
import { useEffect, useState } from 'react'

import Comments from '@/components/misc/Comments'
import DeviceLayout from '@/components/device/DeviceLayout'
import Head from 'next/head'
import Link from 'next/link'
import Loader from '@/components/layout/Loader'
import { api } from '@/lib/trpc'
import { useComments } from '@/hooks/useComments'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export default function Device() {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const router = useRouter() // Get the router object
  const posthog = usePostHog() // Get the posthog client
  const { setUsername } = useComments() // Get the set username function for comments component
  const { t } = useTranslation('main') // Get the translation function
  const [captured, setCaptured] = useState(false) // Was page captured in posthog
  const deviceModel = router.asPath.split('/')[3] // Get the device model from the url
  const deviceQuery = api.device.getDevice.useQuery({
    model: deviceModel
  }) // Get the device details from the database

  // When user data changes
  useEffect(() => {
    // If user data finished loading
    if (user) {
      setUsername(user.username) // Set the username to the user username
    }
  }, [user])

  // When device data changes
  useEffect(() => {
    // If posthog was not captured
    if (!captured && deviceQuery.data) {
      // Capture the device page in posthog
      posthog.capture('Device Page', {
        deviceName: deviceQuery.data.name
      })
      setCaptured(true) // Set captured state to true
    }
  }, [captured, deviceQuery.data, posthog])

  // If device data is not loaded
  if (deviceQuery.data === undefined) {
    return <Loader />
  }

  // If requested device does not exist
  if (deviceQuery.data === null) {
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
        <title>{deviceQuery.data.name}</title>
      </Head>
      <Container size='lg'>
        <DeviceLayout device={deviceQuery.data} />
        <Comments device={deviceQuery.data} />
      </Container>
    </>
  )
}
