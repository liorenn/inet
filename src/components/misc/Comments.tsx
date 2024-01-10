import { Accordion, Divider, Group, Text } from '@mantine/core'
import { Avatar, Box, Button, Rating, Textarea } from '@mantine/core'
import { CreateNotification, calculateAverageRating } from '@/utils/utils'
import type { Device, Comment as commentType } from '@prisma/client'
import { useEffect, useState } from 'react'

import Comment from '@/components/misc/Comment'
import type { FormEvent } from 'react'
import { trpc } from '@/server/client'
import { useComments } from '@/hooks/useComments'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import useTranslation from 'next-translate/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'

type props = {
  device: Device
}

export default function Comments({ device }: props) {
  const user = useUser()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const { t } = useTranslation('translations')
  const [comments, setComments] = useState<commentType[]>([])
  const { mutate } = trpc.auth.addComment.useMutation()
  const { username, setRatingValue, setCommentsAmount } = useComments()
  const { data } = trpc.auth.getAllComments.useQuery({
    model: device.model,
  })
  const { imageExists, imagePath } = useProfilePicture()

  useEffect(() => {
    if (data) {
      setComments(data)
      setCommentsAmount(data.length)
      setRatingValue(calculateAverageRating(data))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setCommentsAmount(comments.length + 1)
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
                  {user?.email && <Avatar src={imageExists ? imagePath : ''} radius='md' />}
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
              <Textarea minRows={4} value={text} onChange={(e) => setText(e.target.value)} />
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Box sx={{ marginBottom: 120 }}>
        {comments.map((comment, index) => (
          <Comment comment={comment} comments={comments} setComments={setComments} key={index} />
        ))}
      </Box>
    </Box>
  )
}
