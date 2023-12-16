import { Title, Spoiler, Text, Group, Rating, Button } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import type { Device } from '@prisma/client'
import { IconArrowDown } from '@tabler/icons'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  device: Device
  commentsAmout: number
  ratingValue: number
}

export default function DeviceDescription({
  device,
  commentsAmout,
  ratingValue,
}: Props) {
  const [_scroll, scrollTo] = useWindowScroll()
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const { t } = useTranslation('devices')

  return (
    <>
      <Group>
        <Button
          variant='light'
          color='gray'
          leftIcon={<IconArrowDown size={16} />}
          onClick={() => scrollTo({ y: 2700 })}>
          {t('goToComments')}
        </Button>
        <Text size='xl' weight={600}>
          {`${commentsAmout.toString()} ${t('comments')}`}
        </Text>
        <Rating value={ratingValue} fractions={2} readOnly />
      </Group>

      <Title
        order={2}
        sx={{
          borderBottom: dark ? '1px solid #666666' : '1px solid #dee2e6',
        }}>
        {t('description')}
      </Title>
      <Spoiler maxHeight={100} showLabel='Show more' hideLabel='Hide'>
        <Text size='xl' weight={500}>
          {device.description}
        </Text>
      </Spoiler>
    </>
  )
}
