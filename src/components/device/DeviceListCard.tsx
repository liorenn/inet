import { Card, Button, Grid, Text, Space } from '@mantine/core'
import { trpc } from '../../misc/trpc'
import { useUser } from '@supabase/auth-helpers-react'
import { CreateNotification } from '../../misc/functions'
import useTranslation from 'next-translate/useTranslation'
import { devicePropertiesType } from '../../models/deviceTypes'
import DevicePhotos from './DevicePhotos'
import Link from 'next/link'

type AppProps = {
  device: devicePropertiesType
  deviceType: string
  setDevicesArr: (value: devicePropertiesType[] | undefined) => void
  devicesArr: devicePropertiesType[]
}

export default function DeviceListCard({
  device,
  deviceType,
  setDevicesArr,
  devicesArr,
}: AppProps) {
  const user = useUser()
  const userDevicesMutation = trpc.auth.handleDeviceToUser.useMutation()
  const { t } = useTranslation('devices')

  function RemoveFromList() {
    CreateNotification(t('removeDeviceSuccessMessage'), 'green')
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
            CreateNotification(t('removeDeviceErrorMessage'), 'red')
          },
        }
      )
    }
  }

  return (
    <Card shadow='lg' p='lg' radius='md'>
      <Card.Section>
        <Space h='lg' />
        <DevicePhotos device={device} miniphotos={false} />
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
            href={`device/${deviceType}/${device.model}`}
            style={{ textDecoration: 'none' }}>
            <Button
              variant='light'
              color='gray'
              radius='md'
              size='md'
              fullWidth>
              {t('moreDetails')}
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
            {t('remove')}
          </Button>
        </Grid.Col>
      </Grid>
    </Card>
  )
}
