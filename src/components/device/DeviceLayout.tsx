import CommentsSummary from '../misc/CommentsSummary'
import DeviceWidgets from './DeviceWidgets'
import { Stack, Grid, Center, Text, Divider } from '@mantine/core'
import DevicePhotos from './DevicePhotos'
import DeviceSpecs from './DeviceSpecs'
import type { deviceSpecsType } from '../../models/SpecsFormatter'
import FavoritesButtons from '../misc/FavoritesButtons'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  device: deviceSpecsType
}

export default function DeviceLayout({ device }: Props) {
  const { t } = useTranslation('translations')
  return (
    <>
      <Center>
        <Grid sx={{ marginBottom: 6 }}>
          <Grid.Col xs={12} md={6} lg={4}>
            <Center>
              <Stack align='center' spacing='xs'>
                <DevicePhotos
                  device={{
                    model: device.model,
                    name: device.name,
                    type: device.type,
                    imageAmount: device.imageAmount,
                  }}
                  miniphotos={true}
                />
                <FavoritesButtons model={device.model} />
              </Stack>
            </Center>
          </Grid.Col>
          <Grid.Col xs={12} md={6} lg={8}>
            <Stack align='stretch' justify='space-between'>
              <DeviceWidgets device={device} />
              <CommentsSummary />
            </Stack>
          </Grid.Col>
        </Grid>
      </Center>
      <div>
        <Text sx={{ fontSize: 28 }} weight={700}>
          {t('deviceSpecifications')}
        </Text>
        <Text sx={{ fontSize: 18 }} weight={500}>
          {`${t('viewDeviceSpecifications')} ${device.name}`}
        </Text>
      </div>
      <Divider sx={{ marginBottom: 10 }} />
      <DeviceSpecs device={device} />
    </>
  )
}
