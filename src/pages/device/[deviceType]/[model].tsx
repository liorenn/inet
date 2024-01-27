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
  const router = useRouter()
  const posthog = usePostHog()
  const { setUsername } = useComments()
  const { t } = useTranslation('translations')
  const [captured, setCaptured] = useState(false)
  const deviceModel = router.asPath.split('/')[3]
  const deviceDetailsQuery = trpc.device.getDevice.useQuery({
    model: deviceModel,
  })
  const userDetailsQuery = trpc.auth.getUserDetails.useQuery({
    email: user?.email,
  })

  useEffect(() => {
    if (userDetailsQuery.data) {
      setUsername(userDetailsQuery.data.username)
    }
  }, [setUsername, userDetailsQuery.data])

  useEffect(() => {
    if (!captured && deviceDetailsQuery.data) {
      posthog.capture('Device Page', {
        deviceName: deviceDetailsQuery.data.name,
      })
      setCaptured(true)
    }
  }, [captured, deviceDetailsQuery.data, posthog])

  if (deviceDetailsQuery.data === undefined) {
    return <Loader />
  }

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
