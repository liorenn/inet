import { Text, Container, Title, useMantineColorScheme } from '@mantine/core'
import { SimpleGrid, Breadcrumbs, Group } from '@mantine/core'
import DeviceTypeCard from '../../components/device/DeviceTypeCard'
import useTranslation from 'next-translate/useTranslation'
import { deviceType } from '../../models/deviceTypes'
import Link from 'next/link'
import Head from 'next/head'

export default function Device() {
  const { colorScheme } = useMantineColorScheme()
  const devicesTypes = Object.getOwnPropertyNames(deviceType)
  const dark = colorScheme === 'dark'
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>{t('allDevices')}</title>
      </Head>
      <Container size='lg'>
        <Group
          position='apart'
          sx={{
            marginTop: 50,
            marginBottom: 15,
            borderBottom: dark ? '1px solid #333333' : '1px solid #dee2e6',
          }}>
          <Breadcrumbs separator='>'>
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
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
          ]}>
          {devicesTypes.map((devicesType) => (
            <DeviceTypeCard devicesType={devicesType} key={devicesType} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}
