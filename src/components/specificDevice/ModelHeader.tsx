import { useRouter } from 'next/router'
import { useMantineColorScheme } from '@mantine/core'
import { Group, Breadcrumbs, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { Device } from '@prisma/client'

function ModelHeader({ device }: { device: Device }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const router = useRouter()
  const deviceType = router.asPath.split('/')[2]

  const links = [
    { name: 'All Devices', href: '/device' },
    { name: deviceType, href: '/device/' + deviceType },
    { name: device.name, href: '#' },
  ]

  return (
    <Group
      position='apart'
      sx={{
        marginTop: 50,
        marginBottom: 15,
        borderBottom: dark ? '1px solid #333333' : '1px solid #dee2e6',
      }}>
      <Breadcrumbs separator='>'>
        {links.map((item, index) => (
          <Link href={item.href} key={index} style={{ textDecoration: 'none' }}>
            <Text size='xl' color='dimmed'>
              {item.name}
            </Text>
          </Link>
        ))}
      </Breadcrumbs>
      <Title order={2}>{device.name} Specs</Title>
    </Group>
  )
}

export default ModelHeader
