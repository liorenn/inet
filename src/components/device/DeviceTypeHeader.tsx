import { useMantineColorScheme } from '@mantine/core'
import { Group, Breadcrumbs, Text, Title } from '@mantine/core'
import type { DeviceType } from '../../models/deviceTypes'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

type props = {
  deviceType: DeviceType
}

export default function DeviceTypeHeader({ deviceType }: props) {
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const { t } = useTranslation('translations')
  const links = [
    { name: t('allDevices'), href: '/device' },
    { name: t(deviceType), href: `/device/${deviceType}` },
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
      <Title order={2}>{`${t('all')} ${t(`${deviceType}Plural`)}`}</Title>
    </Group>
  )
}
