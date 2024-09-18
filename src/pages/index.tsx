import { Button, Card, Input, SimpleGrid, Text, Title } from '@mantine/core'

import { IconDevices } from '@tabler/icons-react'
import Page from '@/components/pages/Page'
import { Stack } from '@mantine/core'
import { useSpotlight } from '@mantine/spotlight'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

export default function Home() {
  const { t } = useTranslation('main') // Get the translation function
  const { width } = useViewportSize() // Get the width of the viewport
  const spotlight = useSpotlight() // Get the spotlight instance

  return (
    <Page container={1400} title={t('home')}>
      <Stack spacing={0} mt={width < 400 ? 0 : 80} align='center'>
        <Title align='center' size={56}>
          {t('inet')}
        </Title>
        <Text align='center' size={30}>
          {t('homeParagraph')
            .split('\n')
            .map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
        </Text>
        <Input
          readOnly
          placeholder={t('searchForDevice')}
          onClick={() => spotlight.openSpotlight()} // Open the spotlight on click
          onChange={() => {
            spotlight.openSpotlight() // Open the spotlight on input change
          }}
          icon={<IconDevices />}
          w={width < 900 ? '100%' : '50%'}
          mt='lg'
          size='md'
        />
        <SimpleGrid
          breakpoints={[
            // Set the breakpoints for the grid
            { minWidth: 'sm', cols: 2 },
            { minWidth: 400, cols: 1 }
          ]}
          spacing={width < 1000 ? 20 : 60}
          mt={width < 1000 ? 20 : 60}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Text size={28} weight={700}>
              {t('compareTitle')}
            </Text>
            <Text size='md' mt='xs' color='dimmed'>
              {t('compareDescription')}
            </Text>
            <Button variant='light' color='gray' mt='md' fullWidth radius='md'>
              {t('compare')}
            </Button>
          </Card>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Text size={28} weight={700}>
              {t('findTitle')}
            </Text>
            <Text size='md' mt='xs' color='dimmed'>
              {t('findDescription')}
            </Text>
            <Button variant='light' color='gray' mt='md' fullWidth radius='md'>
              {t('find')}
            </Button>
          </Card>
        </SimpleGrid>
      </Stack>
    </Page>
  )
}
