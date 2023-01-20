import { trpc } from '../../../utils/trpc'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { Device, DeviceTypeValue } from '@prisma/client'
import ModelLayout from '../../../components/specificDevice/ModelLayout'
import { Button, Center, Container, Loader } from '@mantine/core'
import ModelHeader from '../../../components/specificDevice/ModelHeader'
import Link from 'next/link'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import ModelComments from '../../../components/specificDevice/ModelComments'
import { useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'

enum queriesNames {
  getiPhone = 'getiPhone',
  getiMac = 'getiMac',
  getAirpods = 'getAirpods',
}
type devicePropetiesType = {
  deviceType: DeviceTypeValue
  queryFunction: queriesNames
}
const devicePropeties: devicePropetiesType[] = [
  {
    deviceType: DeviceTypeValue.iphone,
    queryFunction: queriesNames.getiPhone,
  },
  {
    deviceType: DeviceTypeValue.imac,
    queryFunction: queriesNames.getiMac,
  },
  {
    deviceType: DeviceTypeValue.airpods,
    queryFunction: queriesNames.getAirpods,
  },
]

type devicesArrType = {
  model: string
}[]

const isExistInArr = (devicesArr: devicesArrType, deviceModel: string) => {
  for (let i = 0; i < devicesArr.length; i++) {
    if (devicesArr[i].model === deviceModel) return true
  }
  return false
}

interface PropsType {
  deviceModel: string
}
// /device/iphone/iphone13 page
const DynamicPage: NextPage<PropsType> = ({ deviceModel }: PropsType) => {
  const router = useRouter()
  const user = useUser()
  const { data } = trpc.auth.getUserDetails.useQuery({ id: user?.id })
  const { height } = useViewportSize()
  const { data: devicesArr } = trpc.AllDevices.getAllDevicesModels.useQuery()
  const deviceType = router.asPath.split('/')[2] as DeviceTypeValue
  const [ratingValue, setRatingValue] = useState(0)
  const [commentsAmout, setCommentsAmout] = useState(0)

  if (devicesArr && !isExistInArr(devicesArr, deviceModel)) {
    return (
      <Container size='lg'>
        The Device You Are Looking For Doesnt Exist
        <br />
        <Link href={'/'}>
          <Button color='gray' size='lg' radius='md' mt='lg' variant='light'>
            Go To Home Page
          </Button>
        </Link>
      </Container>
    )
  }

  const index = devicePropeties.findIndex(
    (object) => object.deviceType === deviceType
  )
  const queryFunction = devicePropeties[index].queryFunction
  const deviceQuery = trpc.UniqueDevice[queryFunction].useQuery({
    model: deviceModel,
  })
  const device = deviceQuery.data as Device

  if (device === undefined) {
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

  return (
    <>
      <Head>
        <title>{device.name}</title>
      </Head>
      <Container size='lg'>
        <ModelHeader device={device} />
        <ModelLayout
          device={device}
          ratingValue={ratingValue}
          commentsAmout={commentsAmout}
        />
        {user && data?.username && (
          <ModelComments
            device={device}
            username={data.username}
            setRatingValue={setRatingValue}
            setCommentsAmout={setCommentsAmout}
          />
        )}
      </Container>
    </>
  )
}

DynamicPage.getInitialProps = async ({ query }: NextPageContext) => {
  const deviceModel = query.model as string
  return { deviceModel: deviceModel }
}

export default DynamicPage
// const { targetRef: RefRelease, scrollIntoView: ScrollRelease } =
//   useScrollIntoView<HTMLDivElement>()
// const { targetRef: RefDisplay, scrollIntoView: ScrollDisplay } =
//   useScrollIntoView<HTMLDivElement>()
// const { targetRef: RefBattery, scrollIntoView: ScrollBattery } =
//   useScrollIntoView<HTMLDivElement>()
// const { targetRef: RefChipset, scrollIntoView: ScrollChipset } =
//   useScrollIntoView<HTMLDivElement>()
// const { targetRef: RefCameras, scrollIntoView: ScrollCameras } =
//   useScrollIntoView<HTMLDivElement>()
// const { targetRef: RefPrice, scrollIntoView: ScrollPrice } =
//   useScrollIntoView<HTMLDivElement>()

// const Scrolls = [
//   ScrollRelease,
//   ScrollDisplay,
//   ScrollBattery,
//   ScrollChipset,
//   ScrollCameras,
//   ScrollPrice,
// ]

// const Refs = [
//   RefRelease,
//   RefDisplay,
//   RefBattery,
//   RefChipset,
//   RefCameras,
//   RefPrice,
// ]
