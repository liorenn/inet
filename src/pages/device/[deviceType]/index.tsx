import type { NextPage, NextPageContext } from 'next'
import { DeviceTypeValue, User } from '@prisma/client'
import { trpc } from '../../../utils/trpc'
import DeviceCard from '../../../components/allDevices/DeviceCard'
import { Center, Container, Loader, SimpleGrid } from '@mantine/core'
import DeviceHeader from '../../../components/allDevices/DeviceHeader'
import { useViewportSize } from '@mantine/hooks'
import Head from 'next/head'
import { CreateNotification } from '../../../utils/functions'
import { useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'

interface PropsType {
  devicePath: string
}

export interface allProperties {
  model: string
  name: string
  imageAmount: number
}
// /device/iphone page
const DynamicPage: NextPage<PropsType> = ({ devicePath }: PropsType) => {
  const deviceType = devicePath as DeviceTypeValue
  const { height } = useViewportSize()
  const user = useUser()
  const [areInList, setAreInList] = useState<{ isInList: boolean }[]>([])
  const userDevicesMutation = trpc.auth.handleDeviceToUser.useMutation()
  const { data } = trpc.AllDevices.getAllDevicesPropertiesExtra.useQuery({
    deviceType: deviceType,
    userId: user?.id,
  })

  useEffect(() => {
    if (data) {
      const newArr: { isInList: boolean }[] = []
      data.map((value) => {
        newArr.push({ isInList: value.isInList })
      })
      setAreInList(newArr)
    }
  }, [data])

  function handleIsInlist(
    device: allProperties,
    isInList: boolean,
    index: number
  ) {
    if (user) {
      const message =
        'device has been successfully ' +
        (isInList ? 'removed from' : 'added to') +
        ' list'
      CreateNotification(message, 'green')
      userDevicesMutation.mutate(
        {
          deviceModel: device.model,
          userId: user.id,
          isInList: isInList,
        },
        {
          onError: () => {
            const message =
              'there has been an error ' +
              (isInList ? 'removing' : 'adding') +
              ' device to list'
            CreateNotification(message, 'red')
          },
        }
      )
      const newArr = areInList
      newArr[index].isInList = !isInList
      setAreInList(newArr)
    } else CreateNotification('Sign in To Add to List', 'green')
  }

  if (data && areInList.length > 0 && areInList[0]?.isInList !== undefined) {
    return (
      <>
        <Head>
          <title>{deviceType}</title>
        </Head>
        <Container size='lg'>
          <DeviceHeader deviceType={deviceType} />
          <SimpleGrid cols={3}>
            {data.map((value, index) => (
              <DeviceCard
                handleIsInlist={handleIsInlist}
                isInList={areInList[index].isInList}
                index={index}
                device={value}
                key={index}
                deviceType={deviceType}
              />
            ))}
          </SimpleGrid>
        </Container>
      </>
    )
  } else {
    return (
      <Center>
        <Loader color='gray' size={120} variant='dots' mt={height / 3} />
      </Center>
    )
  }
}

const devicesTypes = Object.getOwnPropertyNames(DeviceTypeValue)

DynamicPage.getInitialProps = ({ query }: NextPageContext) => {
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
