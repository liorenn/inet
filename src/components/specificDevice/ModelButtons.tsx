import { Button } from '@mantine/core'
import type { allProperties } from '../../pages/device/[deviceType]'
import { CreateNotification } from '../../utils/functions'
import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'
import type { Device } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  device: Device
}

function ModelButtons({ device }: Props) {
  const user = useUser()
  const [isInList, setIsInList] = useState<boolean | undefined>(undefined)
  const userDevicesMutation = trpc.auth.handleDeviceToUser.useMutation()
  const { data } = trpc.auth.isDeviceInUser.useQuery({
    deviceModel: device.model,
    userId: user?.id,
  })
  const { t } = useTranslation('devices')

  useEffect(() => {
    if (data) {
      setIsInList(data.isInList)
    }
  }, [data])

  function handleIsInlist(device: allProperties, isInList: boolean) {
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
      setIsInList(!isInList)
    } else CreateNotification(t('signInToAdd'), 'green')
  }

  return (
    <Button
      variant='light'
      color={isInList ? 'red' : 'green'}
      radius='md'
      size='md'
      disabled={isInList === undefined}
      onClick={() => handleIsInlist(device, isInList ?? false)}
      fullWidth>
      {isInList !== undefined
        ? isInList === true
          ? t('remove')
          : t('add')
        : t('loading')}
    </Button>
  )
}

export default ModelButtons
