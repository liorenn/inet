import { Center, Divider, Grid, Stack, Text } from '@mantine/core'

import CommentsSummary from '@/components/misc/CommentsSummary'
import DeviceHeader from '@/components/device/DeviceHeader'
import DevicePhotos from '@/components/device/DevicePhotos'
import DeviceSpecs from '@/components/device/DeviceSpecs'
import type { DeviceSpecsType } from '@/models/SpecsFormatter'
import DeviceWidgets from '@/components/device/DeviceWidgets'
import FavoritesButtons from '@/components/misc/FavoritesButtons'
import MatchedDevices from '@/components/device/MatchedDevices'
import { trpc } from '@/utils/client'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  device: DeviceSpecsType // The device data
}

export default function DeviceLayout({ device }: Props) {
  const { t } = useTranslation('main') // Get the translation function
  const recommendedDevicesQuery = trpc.device.getRecommendedDevices.useQuery({
    model: device.model,
    deviceType: device.type,
  }) // The recommended devices query

  return (
    <>
      <DeviceHeader device={device} />
      <Center>
        <Grid sx={{ marginBottom: 6 }}>
          <Grid.Col xs={12} md={6} lg={6}>
            <Center>
              <DevicePhotos
                device={{
                  model: device.model,
                  name: device.name,
                  type: device.type,
                  imageAmount: device.imageAmount,
                }}
                miniphotos={true}
              />
            </Center>
          </Grid.Col>
          <Grid.Col xs={12} md={6} lg={6}>
            <Stack align='stretch' justify='space-between'>
              <DeviceWidgets device={device} />
              <FavoritesButtons modelPage model={device.model} />
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
      <MatchedDevices
        data={recommendedDevicesQuery.data}
        isLoading={recommendedDevicesQuery.isLoading}
        title={t('recommendedDevices')}
      />
    </>
  )
}
