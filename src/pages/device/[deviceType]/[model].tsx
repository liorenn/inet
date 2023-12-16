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

// /device/iphone/iphone13 page
function ModelPage() {
  const user = useUser()
  const router = useRouter()
  const posthog = usePostHog()
  const { t } = useTranslation('common')
  const [captured, setCaptured] = useState(false)
  const deviceModel = router.asPath.split('/')[3]
  const [ratingValue, setRatingValue] = useState(0)
  const [commentsAmout, setCommentsAmout] = useState(0)
  const { data: deviceDetails } = trpc.device.getDevice.useQuery({
    model: deviceModel,
  })
  const { data: userDetails } = trpc.auth.getUserDetails.useQuery({
    id: user?.id,
  })

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
        <DeviceLayout
          device={deviceDetails}
          ratingValue={ratingValue}
          commentsAmout={commentsAmout}
        />
        {user && userDetails?.username && (
          <Comments
            device={deviceDetails}
            username={userDetails.username}
            setRatingValue={setRatingValue}
            setCommentsAmout={setCommentsAmout}
          />
        )}
      </Container>
    </>
  )
}
export default ModelPage
