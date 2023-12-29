/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { IconCalendarTime, IconCpu, IconTypography } from '@tabler/icons'
import { IconCoin, IconBrandApple, IconBattery3 } from '@tabler/icons'
import { Grid, Card, Text, Title, Stack } from '@mantine/core'
import type { Device } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import { FormatDate } from '../../misc/functions'

export default function DeviceWidgets({ device }: { device: Device }) {
  const { t } = useTranslation('translations')

  const cards = [
    {
      title: t('name'),
      spec: device.name,
      icon: <IconTypography size={45} />,
    },
    {
      title: t('release'),
      spec: FormatDate(device.releaseDate),
      icon: <IconCalendarTime size={45} />,
    },
    {
      title: t('operatingSystem'),
      spec: `ios ${device.releaseOS}`,
      icon: <IconBrandApple size={45} />,
    },
    {
      title: t('battery'),
      spec: `${device.batterySize?.toString()} mAh`,
      icon: <IconBattery3 size={45} />,
    },
    { title: t('chipset'), spec: device.chipset, icon: <IconCpu size={45} /> },
    {
      title: t('price'),
      spec: `${device.releasePrice.toString()} $`,
      icon: <IconCoin size={45} />,
    },
  ]
  return (
    <Grid>
      {cards.map((info, index) => (
        <Grid.Col xs={6} md={6} lg={4} key={index}>
          <Card shadow='sm' radius='lg' p='lg'>
            <Stack spacing={2} align='center'>
              <Title order={3}>{info.title}</Title>
              {info.icon}
              <Text size='xl' weight={500}>
                {info.spec}
              </Text>
            </Stack>
            {/* <Button
              variant='light'
              radius='md'
              color='gray'
              fullWidth
              style={{ marginTop: 10 }}>
              Go To {info.title}
            </Button> */}
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}
