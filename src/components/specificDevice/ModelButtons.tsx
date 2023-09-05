import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { allProperties } from '../../pages/device/[deviceType]'
import { CreateNotification } from '../../utils/functions'
import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'
import { Device } from '@prisma/client'
import { boolean } from 'zod'

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

  useEffect(() => {
    if (data) {
      setIsInList(data.isInList)
    }
  }, [data])

  function handleIsInlist(device: allProperties, isInList: boolean) {
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
      setIsInList(!isInList)
    } else CreateNotification('Sign in To Add to List', 'green')
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
          ? 'Remove From List'
          : 'Add To List'
        : 'Loading...'}
    </Button>
  )
}

export default ModelButtons
