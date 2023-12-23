import { Text, Group, Rating, Button } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconArrowDown } from '@tabler/icons'
import useTranslation from 'next-translate/useTranslation'
import { useComments } from '../../hooks/useComments'

export default function CommentsSummary() {
  const { t } = useTranslation('translations')
  const [_scroll, scrollTo] = useWindowScroll()
  const { commentsAmout, ratingValue } = useComments()

  return (
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
  )
}
