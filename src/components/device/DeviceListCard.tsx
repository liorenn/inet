import { Button, Card, Grid, Space, Text } from '@mantine/core'

import DevicePhotos from './DevicePhotos'
import { Dispatch } from 'react'
import FavoritesButtons from '@/components/misc/FavoritesButtons'
import Link from 'next/link'
import { devicePropertiesType } from '@/models/deviceTypes'
import { translateDeviceName } from '@/utils/utils'
import useTranslation from 'next-translate/useTranslation'

type props = {
  device: devicePropertiesType
  deviceType: string
  setDevices: Dispatch<React.SetStateAction<devicePropertiesType[] | undefined>>
}

export default function DeviceListCard({ device, deviceType, setDevices }: props) {
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
          <Link href={`device/${deviceType}/${device.model}`} style={{ textDecoration: 'none' }}>
            <Button variant='light' color='gray' radius='md' size='md' fullWidth>
              {t('moreDetails')}
            </Button>
          </Link>
        </Grid.Col>
        <Grid.Col span={6}>
          <FavoritesButtons model={device.model} setDevices={setDevices} favoritesPage />
        </Grid.Col>
      </Grid>
    </Card>
  )
}
