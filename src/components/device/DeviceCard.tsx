import { Button, Card, Grid, Space, Text } from '@mantine/core'
import type { DeviceType, devicePropertiesType } from '@/models/deviceTypes'

import DevicePhotos from '@/components/device/DevicePhotos'
import FavoritesButtons from '@/components/misc/FavoritesButtons'
import Link from 'next/link'
import { translateDeviceName } from '@/utils/utils'
import useTranslation from 'next-translate/useTranslation'

type props = {
  device: devicePropertiesType
  deviceType: DeviceType
}

export default function DeviceCard({ device, deviceType }: props) {
  const { t } = useTranslation('translations')

  return (
    <Card shadow='lg' p='lg' radius='md'>
      <Card.Section>
        <Space h='lg' />
        <DevicePhotos device={device} miniphotos={false} />
      </Card.Section>
      <Text weight={500} style={{ marginBottom: 10, fontSize: 30 }} align='center'>
        {translateDeviceName(t, device.name)}
      </Text>
      <Grid sx={{ marginTop: 2 }}>
        <Grid.Col span={6}>
          <Link href={`${deviceType}/${device.model}`} style={{ textDecoration: 'none' }}>
            <Button variant='light' color='gray' radius='md' size='md' fullWidth>
              {t('moreDetails')}
            </Button>
          </Link>
        </Grid.Col>
        <Grid.Col span={6}>
          <FavoritesButtons model={device.model} />
        </Grid.Col>
      </Grid>
    </Card>
  )
}
