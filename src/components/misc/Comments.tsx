import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Comment from './Comment'
import { Textarea, Button, Box, Rating, Avatar } from '@mantine/core'
import { Text, Divider, Group, Accordion } from '@mantine/core'
import type { Comment as commentType, Device } from '@prisma/client'
import { trpc } from '../../misc/trpc'
import {
  calculateAverageRating,
  CreateNotification,
  encodeEmail,
} from '../../misc/functions'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'
import { useComments } from '../../hooks/useComments'

type Props = {
  device: Device
}

export default function Comments({ device }: Props) {
  const user = useUser()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const { t } = useTranslation('translations')
  const [comments, setComments] = useState<commentType[]>([])
  const { mutate } = trpc.auth.addComment.useMutation()
  const { username, setRatingValue, setCommentsAmout } = useComments()
  const { data } = trpc.auth.getAllComments.useQuery({
    model: device.model,
  })

  useEffect(() => {
    if (data) {
      setComments(data)
      setCommentsAmout(data.length)
      setRatingValue(calculateAverageRating(data))
    }
  }, [data])

  function AddComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newComment = {
      createdAt: new Date(),
      deviceTypeValue: device.type,
      likes: 0,
      message: text,
      model: device.model,
      username: username,
      updatedAt: new Date(),
      rating: rating,
    }
    mutate(newComment, {
      onSuccess(data) {
        CreateNotification(t('commentAddedSuccessfully'), 'green')
        setText('')
        setRating(0)
        setComments((prev) => pushComment(prev, data))
        setCommentsAmout(comments.length + 1)
        setRatingValue(calculateAverageRating([...comments, data]))
      },
    })
  }

  function pushComment(comments: commentType[], newComment: commentType) {
    const newComments = [...comments, newComment]
    return newComments
  }

  return (
    <Box sx={{ marginBottom: 80 }}>
      <div>
        <Text sx={{ fontSize: 28 }} weight={700}>
          {t('commentSection')}
        </Text>
        <Text sx={{ fontSize: 18 }} weight={500}>
          {t('viewCommentsSentence')}
        </Text>
      </div>
      <Divider sx={{ marginBottom: 20 }} />
      <Accordion
        defaultValue='comments'
        radius='xl'
        styles={{
          label: { fontSize: 24, fontWeight: 500 },
        }}>
        <Accordion.Item value='comments'>
          <Accordion.Control>{t('writeAComment')}</Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={(e) => AddComment(e)}>
              <Group position='apart'>
                <Group sx={{ padding: 10 }}>
                  {user?.email && (
                    <Avatar
                      src={`../../../users/${encodeEmail(user.email)}.png`}
                      radius='md'
                    />
                  )}
                  <div>
                    <Text size='lg' weight={500}>
                      {username}
                    </Text>
                    <Text size='xs' weight={400}>
                      {new Date().toDateString()}
                    </Text>
                  </div>
                </Group>
                <Group>
                  <Rating value={rating} onChange={setRating} />
                  <Button type='submit' variant='subtle'>
                    {t('addComment')}
                  </Button>
                  <Button type='reset' variant='subtle' color='gray'>
                    {t('cancel')}
                  </Button>
                </Group>
              </Group>
              <Textarea
                minRows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Box sx={{ marginBottom: 120 }}>
        {comments.map((comment, index) => (
          <Comment
            comment={comment}
            comments={comments}
            setComments={setComments}
            key={index}
          />
        ))}
      </Box>
    </Box>
  )
}
