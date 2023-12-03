import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'
import ModelLayout from '../../../components/specificDevice/ModelLayout'
import { Button, Center, Container, Loader } from '@mantine/core'
import ModelHeader from '../../../components/specificDevice/ModelHeader'
import Link from 'next/link'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import ModelComments from '../../../components/specificDevice/ModelComments'
import { useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import type { DeviceType } from '../../../utils/deviceTypes'

// /device/iphone/iphone13 page
function ModelPage() {
  const router = useRouter()
  const user = useUser()
  const deviceType = router.asPath.split('/')[2] as DeviceType
  const deviceModel = router.asPath.split('/')[3]
  const { height } = useViewportSize()
  const [ratingValue, setRatingValue] = useState(0)
  const [commentsAmout, setCommentsAmout] = useState(0)
  const { data: deviceDetails } = trpc.device.getDevice.useQuery({
    model: deviceModel,
  })
  const { data: userDetails } = trpc.auth.getUserDetails.useQuery({
    id: user?.id,
  })
  const { t } = useTranslation('common')

  if (deviceDetails === undefined) {
    return (
      <>
        <Head>
          <title>{deviceType}</title>
        </Head>
        <Center>
          <Loader color='gray' size={120} variant='dots' mt={height / 3} />
        </Center>
      </>
    )
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
        <ModelHeader device={deviceDetails} />
        <ModelLayout
          device={deviceDetails}
          ratingValue={ratingValue}
          commentsAmout={commentsAmout}
        />
        {user && userDetails?.username && (
          <ModelComments
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
