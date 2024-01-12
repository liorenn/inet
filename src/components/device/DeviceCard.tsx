import { Button, Card, Grid, Progress, Space, Text, Tooltip } from '@mantine/core'

import DevicePhotos from '@/components/device/DevicePhotos'
import FavoritesButtons from '@/components/misc/FavoritesButtons'
import Link from 'next/link'
import type { devicePropertiesType } from '@/models/enums'
import { translateDeviceName } from '@/utils/utils'
import useTranslation from 'next-translate/useTranslation'

type props = {
  device: devicePropertiesType
  matchPrecentage?: number
}

export default function DeviceCard({ device, matchPrecentage }: props) {
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
      {matchPrecentage ? (
        <Tooltip radius='md' color='dark' label={`${matchPrecentage}% Precentage Match`}>
          <Progress
            radius='md'
            color='green'
            size='xl'
            value={matchPrecentage}
            label={`${matchPrecentage}%`}
          />
        </Tooltip>
      ) : null}
      <Grid sx={{ marginTop: 2 }}>
        <Grid.Col span={6}>
          <Link
            href={{
              pathname: '/device/[deviceType]/[model]',
              query: { deviceType: device.type, model: device.model },
            }}
            style={{ textDecoration: 'none' }}>
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
