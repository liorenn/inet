import CommentsSummary from '../misc/CommentsSummary'
import DeviceWidgets from './DeviceWidgets'
import { Stack, Grid, Center } from '@mantine/core'
import DevicePhotos from './DevicePhotos'
import DeviceSpecs from './DeviceSpecs'
import type { deviceSpecsType } from '../../models/SpecsFormatter'
import FavoritesButtons from '../misc/FavoritesButtons'

type Props = {
  device: deviceSpecsType
}

export default function DeviceLayout({ device }: Props) {
  return (
    <>
      <Center>
        <Grid sx={{ marginBottom: 40 }}>
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
      <DeviceSpecs device={device} />
    </>
  )
}
