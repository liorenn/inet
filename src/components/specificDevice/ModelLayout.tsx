import ModelDescription from './ModelDescription'
import ModelButtons from './ModelButtons'
import ModelWidgets from './ModelWidgets'
import { Stack, Grid, Center } from '@mantine/core'
import DevicePhotos from '../allDevices/DevicePhotos'
import type { Device } from '@prisma/client'
import ModelSpecs from './ModelSpecs'

type Props = {
  device: Device
  commentsAmout: number
  ratingValue: number
}

export default function ModelLayout({
  device,
  commentsAmout,
  ratingValue,
}: Props) {
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
                    imageAmount: device.imageAmount,
                  }}
                  miniphotos={true}
                />
                <ModelButtons />
              </Stack>
            </Center>
          </Grid.Col>
          <Grid.Col xs={12} md={6} lg={8}>
            <Stack align='stretch' justify='space-between'>
              <ModelWidgets device={device} />
              <ModelDescription
                device={device}
                commentsAmout={commentsAmout}
                ratingValue={ratingValue}
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Center>
      <ModelSpecs device={device} />
    </>
  )
}
