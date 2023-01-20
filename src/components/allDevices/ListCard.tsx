import ModelPhotos from './DevicePhotos'
import { Card, Button, Grid, Text, Space } from '@mantine/core'
import { DeviceTypeValue } from '@prisma/client'
import Link from 'next/link'
import { trpc } from '../../utils/trpc'
import { User, useUser } from '@supabase/auth-helpers-react'
import { CreateNotification } from '../../utils/functions'
import { devicesPropertiesArrType } from '../../trpc/routers/auth'

type AppProps = {
  device: {
    model: string
    name: string
    imageAmount: number
  }
  deviceType: DeviceTypeValue
  setDevicesArr: Function
  devicesArr: devicesPropertiesArrType
}

export default function ListCard({
  device,
  deviceType,
  setDevicesArr,
  devicesArr,
}: AppProps) {
  const user = useUser()
  const userDevicesMutation = trpc.auth.handleDeviceToUser.useMutation()

  function RemoveFromList() {
    CreateNotification('device has been successfully removed from', 'green')
    if (setDevicesArr && devicesArr) {
      const newArr = devicesArr.filter((value) => value.model !== device.model)
      setDevicesArr([...newArr])
    }
    if (user) {
      userDevicesMutation.mutate(
        {
          deviceModel: device.model,
          userId: user.id,
          isInList: true,
        },
        {
          onError: () => {
            CreateNotification(
              'there has been an error removing device to list',
              'red'
            )
          },
        }
      )
    }
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
            href={'device/' + deviceType + '/' + device.model}
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
          <Button
            variant='light'
            color={'red'}
            radius='md'
            size='md'
            onClick={RemoveFromList}
            fullWidth>
            {'Remove From List'}
          </Button>
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
