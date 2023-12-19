import DeviceDescription from './DeviceDescription'
import DeviceButtons from './DeviceButtons'
import DeviceWidgets from './DeviceWidgets'
import { Stack, Grid, Center } from '@mantine/core'
import DevicePhotos from './DevicePhotos'
import DeviceSpecs from './DeviceSpecs'
import type { deviceSpecsType } from '../../models/SpecsFormatter'

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
                <DeviceButtons device={device} />
              </Stack>
            </Center>
          </Grid.Col>
          <Grid.Col xs={12} md={6} lg={8}>
            <Stack align='stretch' justify='space-between'>
              <DeviceWidgets device={device} />
              <DeviceDescription device={device} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Center>
      <DeviceSpecs device={device} />
    </>
  )
}
