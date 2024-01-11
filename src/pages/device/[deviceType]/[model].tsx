import { Button, Container } from '@mantine/core'
import { useEffect, useState } from 'react'

import Comments from '@/components/misc/Comments'
import DeviceHeader from '@/components/device/DeviceHeader'
import DeviceLayout from '@/components/device/DeviceLayout'
import Head from 'next/head'
import Link from 'next/link'
import Loader from '@/components/layout/Loader'
import { trpc } from '@/server/client'
import { useComments } from '@/hooks/useComments'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'

// /device/iphone/iphone13 page
export default function Device() {
  const user = useUser()
  const router = useRouter()
  const posthog = usePostHog()
  const { setUsername } = useComments()
  const { t } = useTranslation('translations')
  const [captured, setCaptured] = useState(false)
  const deviceModel = router.asPath.split('/')[3]
  const { data: deviceDetails } = trpc.device.getDevice.useQuery({
    model: deviceModel,
  })
  const { data: userDetails } = trpc.auth.getUserDetails.useQuery({
    email: user?.email,
  })

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username)
    }
  }, [setUsername, userDetails])

  useEffect(() => {
    if (!captured && deviceDetails) {
      posthog.capture('Device Page', {
        deviceName: deviceDetails.name,
      })
      setCaptured(true)
    }
  }, [captured, deviceDetails, posthog])

  if (deviceDetails === undefined) {
    return <Loader />
  }

  if (deviceDetails === null) {
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
        <title>{deviceDetails.name}</title>
      </Head>
      <Container size='lg'>
        <DeviceHeader device={deviceDetails} />
        <DeviceLayout device={deviceDetails} />
        {user && userDetails?.username && <Comments device={deviceDetails} />}
      </Container>
    </>
  )
}
