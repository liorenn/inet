import { Accordion, Divider, Group, Text } from '@mantine/core'
import { Avatar, Box, Button, Rating, Textarea } from '@mantine/core'
import type { Device, Comment as commentType } from '@prisma/client'
import { calculateAverageRating, createNotification } from '@/lib/utils'
import { useEffect, useState } from 'react'

import Comment from '@/components/misc/Comment'
import type { FormEvent } from 'react'
import { api } from '@/lib/trpc'
import { useComments } from '@/hooks/useComments'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import useTranslation from 'next-translate/useTranslation'

// The component props
type Props = {
  device: Device
}

export default function Comments({ device }: Props) {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const [text, setText] = useState('') // State for the comment text
  const [rating, setRating] = useState(0) // State for the comment rating
  const { t } = useTranslation('main') // Get the translation hook
  const [comments, setComments] = useState<commentType[]>([]) // State for the comments
  const addCommentMutation = api.auth.addComment.useMutation() // Add comment mutation
  const { username, setRatingValue, setCommentsAmount } = useComments() // Get the comments state and functions
  const allCommentsQuery = api.auth.getAllComments.useQuery({
    model: device.model
  }) // Get all comments
  const { imageExists, imagePath } = useProfilePicture() // Get the profile picture state

  // When comments query data changes
  useEffect(() => {
    // If the comments query data exists
    if (allCommentsQuery.data) {
      setComments(allCommentsQuery.data) // Set the comments state to the updated comments data
      setCommentsAmount(allCommentsQuery.data.length) // Set the comments amount state to the updated comments data length
      setRatingValue(calculateAverageRating(allCommentsQuery.data)) // Set the rating value state to the average rating
    }
  }, [allCommentsQuery.data])

  // Add comment function
  function AddComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // Prevent the default form submission
    // Create a new comment object
    const newComment = {
      createdAt: new Date(),
      deviceTypeValue: device.type,
      message: text,
      model: device.model,
      username: username,
      updatedAt: new Date(),
      rating: rating
    }

    // Add the new comment
    addCommentMutation.mutate(newComment, {
      // On operation success
      onSuccess(data) {
        createNotification(t('commentAddedSuccessfully'), 'green') // Create a notification
        setText('') // Clear the comment text
        setRating(0) // Clear the comment rating
        setComments((prev) => [...prev, data]) // Add the new comment to the comments state
        setCommentsAmount(comments.length + 1) // Increment the comments amount
        setRatingValue(calculateAverageRating([...comments, data])) // Update the rating value
      }
    })
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
      {user && (
        <Accordion
          defaultValue='comments'
          radius='xl'
          styles={{
            label: { fontSize: 24, fontWeight: 500 }
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
                  <Group mb='sm'>
                    <Rating value={rating} onChange={setRating} />
                    <Button type='submit' size='xs' variant='subtle'>
                      {t('addComment')}
                    </Button>
                    <Button type='reset' size='xs' variant='subtle' color='gray'>
                      {t('cancel')}
                    </Button>
                  </Group>
                </Group>
                <Textarea minRows={4} value={text} onChange={(e) => setText(e.target.value)} />
              </form>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
      <Box sx={{ marginBottom: 120 }}>
        {comments.map((comment, index) => (
          <Comment comment={comment} comments={comments} setComments={setComments} key={index} />
        ))}
      </Box>
    </Box>
  )
}
