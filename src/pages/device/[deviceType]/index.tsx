import { trpc } from '../../../misc/trpc'
import DeviceCard from '../../../components/device/DeviceCard'
import { Container, SimpleGrid } from '@mantine/core'
import DeviceHeader from '../../../components/device/DeviceTypeHeader'
import Head from 'next/head'
import { CreateNotification } from '../../../misc/functions'
import { useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import type {
  DeviceType,
  devicePropertiesType,
} from '../../../models/deviceTypes'
import { usePostHog } from 'posthog-js/react'
import Loader from '../../../components/layout/Loader'

// /device/iphone page
export default function DeviceTypePage() {
  const router = useRouter()
  const posthog = usePostHog()
  const deviceType = router.asPath.split('/')[
    router.asPath.split('/').length - 1
  ] as DeviceType
  const user = useUser()
  const { t } = useTranslation('devices')
  const [areInList, setAreInList] = useState<{ isInList: boolean }[]>([])
  const userDevicesMutation = trpc.auth.handleDeviceToUser.useMutation()
  const { data } = trpc.device.getUserDevices.useQuery({
    deviceType: deviceType,
    userId: user?.id,
  })
  const [captured, setCaptured] = useState(false)

  useEffect(() => {
    if (data) {
      const newArr: { isInList: boolean }[] = []
      data.map((value) => {
        newArr.push({ isInList: value.isInList })
      })
      setAreInList(newArr)
    }
    if (!captured && data) {
      posthog.capture('Device Type Page', {
        deviceType,
      })
      setCaptured(true)
    }
  }, [data])

  function handleIsInlist(
    device: devicePropertiesType,
    isInList: boolean,
    index: number
  ) {
    if (user) {
      const message = !isInList
        ? t('removeDeviceErrorMessage')
        : t('removeDeviceSuccessMessage')
      CreateNotification(message, 'green')
      userDevicesMutation.mutate(
        {
          deviceModel: device.model,
          userId: user.id,
          isInList: isInList,
        },
        {
          onError: () => {
            const message = isInList
              ? t('removeDeviceErrorMessage')
              : t('addDeviceErrorMessage')
            CreateNotification(message, 'red')
          },
        }
      )
      const newArr = areInList
      newArr[index].isInList = !isInList
      setAreInList(newArr)
    } else CreateNotification(t('signInToAdd'), 'green')
  }

  if (!data) return <Loader />

  if (data && areInList.length > 0 && areInList[0]?.isInList !== undefined) {
    return (
      <>
        <Head>
          <title>{deviceType}</title>
        </Head>
        <Container size='lg'>
          <DeviceHeader deviceType={deviceType} />
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'sm', cols: 1 },
              { maxWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}>
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
  }
}
