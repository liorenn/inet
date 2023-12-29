import { Button, Text, Title, Input, Card, SimpleGrid } from '@mantine/core'
import { Stack, Container } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useSpotlight } from '@mantine/spotlight'
import { useState } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { IconDevices } from '@tabler/icons'

export default function Index() {
  const { t } = useTranslation('translations')
  const paragraphs = t('homeParagraph').split('\n')
  const spotlight = useSpotlight()
  const [value, setValue] = useState('')
  const { width } = useViewportSize()

  return (
    <>
      <Head>
        <title>{t('home')}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container size={1400} p={40} mt={width < 400 ? 0 : 80}>
        <Stack spacing={0} align='center'>
          <Title align='center' size={56}>
            Find the Perfect Device
          </Title>
          <Text align='center' size={30}>
            {paragraphs.map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
          </Text>
          <Input
            placeholder={t('searchForDevice')}
            onClick={() => spotlight.openSpotlight()}
            onChange={() => {
              spotlight.openSpotlight()
              setValue('')
            }}
            value={value}
            icon={<IconDevices />}
            w={width < 900 ? '100%' : '50%'}
            mt='lg'
            size='md'
          />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'sm', cols: 2 },
              { minWidth: 400, cols: 1 },
            ]}
            spacing={width < 1000 ? 20 : 60}
            mt={width < 1000 ? 20 : 60}>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Text size={28} weight={700}>
                Compare Phone Models
              </Text>
              <Text size='md' mt='xs' color='dimmed'>
                Compare different phone models to find the one that suits your
                needs best.
              </Text>
              <Button
                variant='light'
                color='gray'
                mt='md'
                fullWidth
                radius='md'>
                Compare Now
              </Button>
            </Card>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Text size={28} weight={700}>
                Find Your Device
              </Text>
              <Text size='md' mt='xs' color='dimmed'>
                Find Your Device that suits your needs best based on your
                Preferences.
              </Text>
              <Button
                variant='light'
                color='gray'
                mt='md'
                fullWidth
                radius='md'>
                Find Now
              </Button>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  )
}
