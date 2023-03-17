import Link from 'next/link'
import { DeviceTypeValue } from '@prisma/client'
import { SimpleGrid, Image, Button, Container, Text, Card } from '@mantine/core'
import { Group, Breadcrumbs, Title, useMantineColorScheme } from '@mantine/core'
import Head from 'next/head'
// /device page
export default function Device() {
  const { colorScheme } = useMantineColorScheme()
  const devicesTypes = Object.getOwnPropertyNames(DeviceTypeValue)
  const dark = colorScheme === 'dark'

  return (
    <>
      <Head>
        <title>All Devices</title>
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
                Home
              </Text>
            </Link>
          </Breadcrumbs>
          <Title order={2}>All Devices</Title>
        </Group>
        <SimpleGrid cols={3}>
          {devicesTypes.map((devicesType) => (
            <Card key={devicesType}>
              <Card.Section>
                <Image
                  src={'/images/devices/' + devicesType + '.png'}
                  height={220}
                  fit={'contain'}
                  alt='device photo'
                />
              </Card.Section>
              <Link
                href={'/device/' + devicesType}
                style={{ textDecoration: 'none' }}>
                <Button
                  variant='light'
                  color='gray'
                  fullWidth
                  mt='md'
                  radius='md'>
                  {devicesType}
                </Button>
              </Link>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}
