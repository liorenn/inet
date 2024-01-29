import { Breadcrumbs, Group, SimpleGrid } from '@mantine/core'
import { Container, Text, Title, useMantineColorScheme } from '@mantine/core'

import DeviceTypeCard from '@/components/device/DeviceTypeCard'
import Head from 'next/head'
import Link from 'next/link'
import { deviceType } from '@/models/enums'
import useTranslation from 'next-translate/useTranslation'

export default function DeviceType() {
  const { colorScheme } = useMantineColorScheme() // Get color scheme
  const devicesTypes = Object.getOwnPropertyNames(deviceType) // Get device types
  const { t } = useTranslation('main') // Get the translation function

  return (
    <>
      <Head>
        <title>{t('allDevices')}</title>
      </Head>
      <Container size='lg'>
        <Group
          position='apart'
          sx={{
            marginBottom: 15,
            borderBottom: colorScheme === 'dark' ? '1px solid #333333' : '1px solid #dee2e6',
          }}>
          <Breadcrumbs>
            <Link href={'/'} style={{ textDecoration: 'none' }}>
              <Text size='xl' color='dimmed'>
                {t('home')}
              </Text>
            </Link>
          </Breadcrumbs>
          <Title order={2}>{t('allDevices')}</Title>
        </Group>
        <SimpleGrid
          cols={3}
          breakpoints={[
            // Set breakpoints for the SimpleGrid
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
          ]}>
          {devicesTypes.map((devicesType) => (
            // Display device type card for each device type
            <DeviceTypeCard devicesType={devicesType} key={devicesType} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}
