import { Text, Group, Rating, Button } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconArrowDown } from '@tabler/icons'
import useTranslation from 'next-translate/useTranslation'
import { useComments } from '../../hooks/useComments'

export default function CommentsSummary() {
  const { t } = useTranslation('translations')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_scroll, scrollTo] = useWindowScroll()
  const { commentsAmount, ratingValue } = useComments()
  return (
    <Group position='right'>
      <Text weight={600}>{`${
        ratingValue === 0 ? 0 : ratingValue.toFixed(1)
      } ${t('deviceRating')}`}</Text>
      <Rating value={ratingValue} fractions={2} readOnly />
      <Button
        variant='light'
        color='gray'
        rightIcon={<IconArrowDown size={16} />}
        onClick={() => scrollTo({ y: 2700 })}>
        {`${commentsAmount.toString()} ${t('comments')}`}
      </Button>
    </Group>
  )
}
