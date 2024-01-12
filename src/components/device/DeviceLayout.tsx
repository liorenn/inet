import { Center, Divider, Grid, Stack, Text } from '@mantine/core'

import CommentsSummary from '@/components/misc/CommentsSummary'
import DevicePhotos from '@/components/device/DevicePhotos'
import DeviceSpecs from '@/components/device/DeviceSpecs'
import DeviceWidgets from '@/components/device/DeviceWidgets'
import FavoritesButtons from '@/components/misc/FavoritesButtons'
import RecommendedDevices from './RecommendedDevices'
import type { deviceSpecsType } from '@/models/SpecsFormatter'
import { translateDeviceName } from '@/utils/utils'
import useTranslation from 'next-translate/useTranslation'

type props = {
  device: deviceSpecsType
}

export default function DeviceLayout({ device }: props) {
  const { t } = useTranslation('translations')
  return (
    <>
      <Center>
        <Grid sx={{ marginBottom: 6 }}>
          <Grid.Col xs={12} md={6} lg={6}>
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
                <FavoritesButtons modelPage model={device.model} />
              </Stack>
            </Center>
          </Grid.Col>
          <Grid.Col xs={12} md={6} lg={6}>
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
          {`${t('viewDeviceSpecifications')} ${translateDeviceName(t, device.name)}`}
        </Text>
      </div>
      <Divider sx={{ marginBottom: 10 }} />
      <DeviceSpecs device={device} />
      <RecommendedDevices model={device.model} />
    </>
  )
}
