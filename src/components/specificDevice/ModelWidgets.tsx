import { IconCalendarTime, IconCpu, IconTypography } from '@tabler/icons'
import { IconCoin, IconBrandApple, IconBattery3 } from '@tabler/icons'
import { Grid, Card, Button, Text, Group, Title } from '@mantine/core'
import { Device } from '@prisma/client'

type Props = {
  device: Device
  // scrolls: any
}

function ModelWidgets({ device }: Props) {
  function FormatDate() {
    const date = new Date(device.releaseDate)
    const day = date.getUTCDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return day + '/' + month + '/' + year
  }

  const cards = [
    {
      title: 'Name',
      spec: device.name,
      icon: <IconTypography size={45} />,
    },
    {
      title: 'Release',
      spec: FormatDate(),
      icon: <IconCalendarTime size={45} />,
    },
    {
      title: 'OS',
      spec: 'ios ' + device.operatingSystem,
      icon: <IconBrandApple size={45} />,
    },
    {
      title: 'Battery',
      spec: device.batterySize + ' mAh',
      icon: <IconBattery3 size={45} />,
    },
    { title: 'Chipset', spec: device.chipset, icon: <IconCpu size={45} /> },
    {
      title: 'Price',
      spec: device.releasePrice + '$',
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
            <Button
              variant='light'
              radius='md'
              color='gray'
              fullWidth
              style={{ marginTop: 10 }}
              // onClick={() => scrolls[index]({ alignment: 'center' })}
            >
              Show {info.title}
            </Button>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}

export default ModelWidgets
