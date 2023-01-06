import { useRouter } from 'next/router'
import { useMantineColorScheme } from '@mantine/core'
import { Group, Breadcrumbs, Text, Anchor, Title } from '@mantine/core'
import Link from 'next/link'
import { DeviceTypeValue } from '@prisma/client'

export default function DeviceHeader({
  deviceType,
}: {
  deviceType: DeviceTypeValue
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const router = useRouter()
  const model_type = router.asPath.split('/')[1]

  const links = [
    { name: 'All Devices', href: '/device' },
    { name: deviceType, href: '/device/' + deviceType },
  ]

  return (
    <Group
      position='apart'
      sx={{
        marginTop: 50,
        marginBottom: 15,
        borderBottom: dark ? '1px solid #333333' : '1px solid #e6e6e6',
      }}>
      <Breadcrumbs separator='>'>
        {links.map((item, index) => (
          <Link href={item.href} style={{ textDecoration: 'none' }} key={index}>
            <Text size='xl' color='dimmed'>
              {item.name}
            </Text>
          </Link>
        ))}
      </Breadcrumbs>
      <Title order={2}>All {deviceType}</Title>
    </Group>
  )
}
