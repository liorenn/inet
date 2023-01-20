import ModelPhotos from './DevicePhotos'
import { Card, Button, Grid, Text, Space } from '@mantine/core'
import { DeviceTypeValue } from '@prisma/client'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'
import { User, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { CreateNotification } from '../../utils/functions'

type AppProps = {
  device: {
    model: string
    name: string
    imageAmount: number
  }
  deviceType: DeviceTypeValue
}

export default function DeviceCard({ device, deviceType }: AppProps) {
  const [isInList, setIsInList] = useState<boolean | undefined>(undefined)
  const user = useUser()
  const userDevicesMutation = trpc.auth.handleDeviceToUser.useMutation()
  const isDeviceInUser = trpc.auth.isDeviceInUser.useQuery({
    deviceModel: device.model,
    userId: user?.id,
  })

  useEffect(() => {
    if (isDeviceInUser.data && isInList === undefined) {
      setIsInList(isDeviceInUser.data.isInList)
    }
  }, [isDeviceInUser])

  function handleIsInlist(user: User) {
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
  }

  return (
    <Card shadow='lg' p='lg' radius='md'>
      <Card.Section>
        <Space h='lg' />
        <ModelPhotos device={device} miniphotos={false} />
      </Card.Section>

      <Text
        weight={500}
        style={{ marginBottom: 10, fontSize: 30 }}
        align='center'>
        {device.name}
      </Text>

      <Grid sx={{ marginTop: 2 }}>
        <Grid.Col span={6}>
          <Link
            href={deviceType + '/' + device.model}
            style={{ textDecoration: 'none' }}>
            <Button
              variant='light'
              color='gray'
              radius='md'
              size='md'
              fullWidth>
              More Details
            </Button>
          </Link>
        </Grid.Col>
        <Grid.Col span={6}>
          {user !== null ? (
            <Button
              variant='light'
              color={isInList ? 'red' : 'green'}
              radius='md'
              size='md'
              onClick={() => handleIsInlist(user)}
              fullWidth>
              {isInList ? 'Remove From List' : 'Add To List'}
            </Button>
          ) : (
            <Button
              variant='light'
              color={'gray'}
              radius='md'
              size='md'
              disabled
              fullWidth>
              log in to add
            </Button>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  )
}

{
  /* <Grid>
          <Grid.Col span={3}>
            <Grid>
              <Grid.Col span={6}>
                {' '}
                <ActionIcon color='blue' size='xl' variant='light'>
                  2018
                </ActionIcon>
              </Grid.Col>
              <Grid.Col span={6}>
                {' '}
                <ActionIcon color='blue' size='xl' variant='light'>
                  <Clock />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={3}>
            <Grid>
              <Grid.Col span={6}>
                {' '}
                <ActionIcon color='blue' size='xl' variant='light'>
                  6.1 in
                </ActionIcon>
              </Grid.Col>
              <Grid.Col span={6}>
                {' '}
                <ActionIcon color='blue' size='xl' variant='light'>
                  <DeviceMobile />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={3}>
            <Grid>
              <Grid.Col span={6}>
                <ActionIcon color='blue' size='xl' variant='light'>
                  3095
                </ActionIcon>
              </Grid.Col>
              <Grid.Col span={6}>
                {' '}
                <ActionIcon color='blue' size='xl' variant='light'>
                  <Battery3 />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={3}>
            <Grid>
              <Grid.Col span={6}>
                <ActionIcon color='blue' size='xl' variant='light'>
                  999$
                </ActionIcon>
              </Grid.Col>
              <Grid.Col span={6}>
                <ActionIcon color='blue' size='xl' variant='light'>
                  <Coin />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid> */
}
