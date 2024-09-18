import { Card, Grid, Stack, Text, Title } from '@mantine/core'
import { IconBattery3, IconBrandApple, IconCoin } from '@tabler/icons-react'
import { IconCalendarTime, IconCpu, IconTypography } from '@tabler/icons-react'

import type { Device } from '@prisma/client'
import { FormatDate } from '@/lib/utils'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = { device: Device }

export default function DeviceWidgets({ device }: Props) {
  const { t } = useTranslation('main') // Get the translation function

  const cards = [
    {
      title: t('name'),
      spec: device.name,
      icon: <IconTypography size={45} />
    },
    {
      title: t('release'),
      spec: FormatDate(device.releaseDate),
      icon: <IconCalendarTime size={45} />
    },
    {
      title: t('operatingSystem'),
      spec: `${device.releaseOS ?? t('none')}`,
      icon: <IconBrandApple size={45} />
    },
    {
      title: t('battery'),
      spec: `${device.batterySize?.toString()} mAh`,
      icon: <IconBattery3 size={45} />
    },
    { title: t('chipset'), spec: device.chipset, icon: <IconCpu size={45} /> },
    {
      title: t('price'),
      spec: `${device.releasePrice.toString()} $`,
      icon: <IconCoin size={45} />
    }
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
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}
