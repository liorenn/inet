import { NextPage, NextPageContext } from 'next'
import { DeviceTypeValue } from '@prisma/client'
import { trpc } from '../../../utils/trpc'
import DeviceCard from '../../../components/allDevices/DeviceCard'
import { Center, Container, Loader, SimpleGrid } from '@mantine/core'
import DeviceHeader from '../../../components/allDevices/DeviceHeader'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'

interface PropsType {
  devicePath: string
}
// /device/iphone page
const DynamicPage: NextPage<PropsType> = ({ devicePath }: PropsType) => {
  const deviceType = devicePath as DeviceTypeValue
  const { height } = useViewportSize()
  const devicesQuery = trpc.AllDevices.getAllDevicesProperties.useQuery({
    deviceType: deviceType,
  })

  return (
    <>
      <Head>
        <title>{deviceType}</title>
      </Head>
      {devicesQuery.data ? (
        <Container size='lg'>
          <DeviceHeader deviceType={deviceType} />
          <SimpleGrid cols={3}>
            {devicesQuery.data.map((value, index) => (
              <DeviceCard device={value} key={index} deviceType={deviceType} />
            ))}
          </SimpleGrid>
        </Container>
      ) : (
        <Center>
          <Loader color='gray' size={120} variant='dots' mt={height / 3} />
        </Center>
      )}
    </>
  )
}

const devicesTypes = Object.getOwnPropertyNames(DeviceTypeValue)

DynamicPage.getInitialProps = async ({ query }: NextPageContext) => {
  const devicePath = query.deviceType as string
  const isExistInArr = () => {
    for (let i = 0; i < devicesTypes.length; i++) {
      if (devicesTypes[i] === devicePath) return true
    }
    return false
  }

  if (!isExistInArr()) {
    return { devicePath: 'invalid device type' }
  }
  return { devicePath: devicePath }
}

export default DynamicPage
/*
enum queriesNames {
  getAlliPhones = 'getAlliPhones',
  getAlliMacs = 'getAlliMacs',
}

type devicePropetiesType = {
  deviceType: DeviceTypeValue
  queryFunction: queriesNames
}
const devicePropeties: devicePropetiesType[] = [
  {
    deviceType: DeviceTypeValue.iphone,
    queryFunction: queriesNames.getAlliPhones,
  },
  {
    deviceType: DeviceTypeValue.imac,
    queryFunction: queriesNames.getAlliMacs,
  },
]

  const index = devicePropeties.findIndex(
    (object) => object.deviceType === deviceType
  )
  const queryFunction = devicePropeties[index].queryFunction

  const query = trpc.AllDevices[queryFunction].useQuery()
*/
