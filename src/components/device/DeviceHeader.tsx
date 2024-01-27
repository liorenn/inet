import { Breadcrumbs, Group, Text, Title } from '@mantine/core'

import type { Device } from '@prisma/client'
import Link from 'next/link'
import { translateDeviceName } from '@/utils/utils'
import { useMantineColorScheme } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = { device: Device }

export default function DeviceHeader({ device }: Props) {
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const { t, lang } = useTranslation('translations') // Get the translation function and the current language

  // Define the links for the breadcrumbs
  const links = [
    { name: t('allDevices'), href: '/device' },
    { name: t(device.type), href: `/device/${device.type}` },
    { name: translateDeviceName(t, device.name), href: '#' },
  ]

  return (
    <Group
      position='apart'
      sx={{
        marginBottom: 15,
        borderBottom: colorScheme === 'dark' ? '1px solid #333333' : '1px solid #dee2e6',
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
      <Title order={2}>
        {lang === 'he'
          ? `${t('information')} ${translateDeviceName(t, device.name)}`
          : `${translateDeviceName(t, device.name)} ${t('information')}`}
      </Title>
    </Group>
  )
}
