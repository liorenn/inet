import { trpc } from '../../../misc/trpc'
import { useRouter } from 'next/router'
import DeviceLayout from '../../../components/device/DeviceLayout'
import { Button, Container } from '@mantine/core'
import DeviceHeader from '../../../components/device/DeviceHeader'
import Link from 'next/link'
import Head from 'next/head'
import Comments from '../../../components/misc/Comments'
import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { usePostHog } from 'posthog-js/react'
import Loader from '../../../components/layout/Loader'
import { useComments } from '../../../hooks/useComments'

// /device/iphone/iphone13 page
function ModelPage() {
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
  }, [userDetails])

  useEffect(() => {
    if (!captured && deviceDetails) {
      posthog.capture('Device Page', {
        deviceName: deviceDetails.name,
      })
      setCaptured(true)
    }
  }, [deviceDetails])

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
export default ModelPage
