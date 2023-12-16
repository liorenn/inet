import { IconCalendarTime, IconCpu, IconTypography } from '@tabler/icons'
import { IconCoin, IconBrandApple, IconBattery3 } from '@tabler/icons'
import { Grid, Card, Text, Group, Title } from '@mantine/core'
import type { Device } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'

export default function DeviceWidgets({ device }: { device: Device }) {
  const { t } = useTranslation('devices')

  function FormatDate() {
    const date = new Date(device.releaseDate)
    const day = date.getUTCDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return day.toString() + '/' + month.toString() + '/' + year.toString()
  }

  const cards = [
    {
      title: t('name'),
      spec: device.name,
      icon: <IconTypography size={45} />,
    },
    {
      title: t('release'),
      spec: FormatDate(),
      icon: <IconCalendarTime size={45} />,
    },
    {
      title: t('operatingSystem'),
      spec: `ios ${device.releaseOS}`,
      icon: <IconBrandApple size={45} />,
    },
    {
      title: t('battery'),
      spec: device.batterySize?.toString() + ' mAh',
      icon: <IconBattery3 size={45} />,
    },
    { title: t('chipset'), spec: device.chipset, icon: <IconCpu size={45} /> },
    {
      title: t('price'),
      spec: device.releasePrice.toString() + '$',
      icon: <IconCoin size={45} />,
    },
  ]
  return (
    <Grid>
      {cards.map((info, index) => (
        <Grid.Col xs={6} md={6} lg={4} key={index}>
          <Card shadow='sm' radius='lg' p='lg'>
            <Group position='apart'>
              <Title order={3}>{info.title}</Title>
              {info.icon}
            </Group>
            <Text size='xl' weight={500}>
              {info.spec}
            </Text>
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
