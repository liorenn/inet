import { Anchor, Button, Card, Grid, Space, Text } from '@mantine/core'

import DevicePhotos from '@/components/device/DevicePhotos'
import { DevicePropertiesType } from '@/models/enums'
import { Dispatch } from 'react'
import FavoritesButtons from '@/components/misc/FavoritesButtons'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  device: DevicePropertiesType
  deviceType: string
  setDevices: Dispatch<React.SetStateAction<DevicePropertiesType[] | undefined>>
}

export default function DeviceListCard({ device, deviceType, setDevices }: Props) {
  const { t } = useTranslation('main') // Get the translation function
  const router = useRouter() // Get the router

  return (
    <Card shadow='lg' p='lg' radius='md'>
      <Card.Section>
        <Space h='lg' />
        <DevicePhotos device={device} miniphotos={false} />
      </Card.Section>

      <Text weight={500} style={{ marginBottom: 10, fontSize: 30 }} align='center'>
        {device.name}
      </Text>

      <Grid sx={{ marginTop: 2 }}>
        <Grid.Col span={6}>
          <Anchor
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => router.push(`/device/${deviceType}/${device.model}`)}
            style={{ textDecoration: 'none' }}>
            <Button variant='light' color='gray' radius='md' size='md' fullWidth>
              {t('moreDetails')}
            </Button>
          </Anchor>
        </Grid.Col>
        <Grid.Col span={6}>
          <FavoritesButtons model={device.model} setDevices={setDevices} favoritesPage />
        </Grid.Col>
      </Grid>
    </Card>
  )
}
