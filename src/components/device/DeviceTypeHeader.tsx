import { Breadcrumbs, Group, Text, Title } from '@mantine/core'

import type { DeviceType } from '@/models/enums'
import Link from 'next/link'
import { useMantineColorScheme } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  deviceType: DeviceType
}

export default function DeviceTypeHeader({ deviceType }: Props) {
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const { t } = useTranslation('main') // Get the translation function

  // Define the links for the breadcrumbs
  const links = [
    { name: t('allDevices'), href: '/device' },
    { name: t(deviceType), href: `/device/${deviceType}` },
  ]

  return (
    <Group
      position='apart'
      sx={{
        marginBottom: 15,
        borderBottom: colorScheme === 'dark' ? '1px solid #333333' : '1px solid #e6e6e6',
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
      <Title order={2}>{`${t('all')} ${t(`${deviceType}Plural`)}`}</Title>
    </Group>
  )
}
