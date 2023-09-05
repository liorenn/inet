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
import { useRouter } from 'next/router'

export interface allProperties {
  model: string
  name: string
  imageAmount: number
}
// /device/iphone page
function deviceTypePage() {
  const router = useRouter()
  const deviceType = router.asPath.split('/')[
    router.asPath.split('/').length - 1
  ] as DeviceTypeValue
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
export default deviceTypePage
