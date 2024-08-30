import { Button, Group, Rating, Text } from '@mantine/core'

import { IconArrowDown } from '@tabler/icons'
import { useComments } from '@/hooks/useComments'
import useTranslation from 'next-translate/useTranslation'
import { useWindowScroll } from '@mantine/hooks'

export default function CommentsSummary() {
  const { t } = useTranslation('main') // Get the translation function
  const [_scroll, scrollTo] = useWindowScroll() // Get scroll function
  const { commentsAmount, ratingValue } = useComments() // Get the comments state

  return (
    <Group position='right'>
      <Text weight={600}>{`${ratingValue === 0 ? 0 : ratingValue.toFixed(1)} ${t(
        'deviceRating'
      )}`}</Text>
      <Rating value={ratingValue} fractions={2} readOnly />
      <Button
        variant='light'
        color='gray'
        rightIcon={<IconArrowDown size={16} />}
        onClick={() => scrollTo({ y: document.body.scrollHeight - 660 })}>
        {`${commentsAmount.toString()} ${t('comments')}`}
      </Button>
    </Group>
  )
}
