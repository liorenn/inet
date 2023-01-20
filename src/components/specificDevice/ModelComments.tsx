import { FormEvent, useEffect, useState } from 'react'
import ModelComment from './ModelComment'
import { Textarea, Button, Box, Avatar, Rating } from '@mantine/core'
import { Text, Divider, Group, Accordion } from '@mantine/core'
import { useUser } from '@supabase/auth-helpers-react'
import { Comment, Device } from '@prisma/client'
import { trpc } from '../../utils/trpc'
import { CalcAverageRating, CreateNotification } from '../../utils/functions'

type Props = {
  device: Device
  username: string
  setRatingValue: Function
  setCommentsAmout: Function
}

function ModelComments({
  device,
  username,
  setRatingValue,
  setCommentsAmout,
}: Props) {
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [isFetched, setIsFetched] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const date = new Date().toDateString()
  const { mutate } = trpc.auth.addComment.useMutation()
  const commentsQuery = trpc.auth.getAllComments.useQuery({
    model: device.model,
  })

  useEffect(() => {
    let commentsArr = commentsQuery.data
    if (commentsArr && !isFetched) {
      setIsFetched(true)
      setComments(commentsArr)
      setCommentsAmout(commentsArr.length)
      setRatingValue(CalcAverageRating(commentsArr))
    }
  }, [commentsQuery])

  async function AddComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newComment = {
      createdAt: new Date(),
      deviceTypeValue: device.deviceTypeValue,
      likes: 0,
      message: text,
      model: device.model,
      username: username,
      updatedAt: new Date(),
      Rating: rating,
    }
    mutate(newComment, {
      onSuccess(data) {
        CreateNotification('created comment successfully', 'green')
        setText('')
        setRating(0)
        comments.push({ ...newComment, id: data.id })
        setCommentsAmout(comments.length)
        setRatingValue(CalcAverageRating(comments))
      },
    })
  }

  return (
    <Box sx={{ marginBottom: 80 }}>
      <div>
        <Text sx={{ fontSize: 28 }} weight={700}>
          Comment Section
        </Text>
        <Text sx={{ fontSize: 18 }} weight={500}>
          view comments and add your own comment
        </Text>
      </div>
      <Divider sx={{ marginBottom: 20 }} />
      <Accordion
        defaultValue='comments'
        radius='md'
        styles={{
          label: { fontSize: 24, fontWeight: 500 },
        }}>
        <Accordion.Item value='comments'>
          <Accordion.Control>Write a Comment</Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={(e) => AddComment(e)}>
              <Group position='apart'>
                <Group sx={{ padding: 10 }}>
                  {/* <Image src={image_url} height={45} width={45} radius='xl' /> */}
                  <Avatar />
                  <div>
                    <Text size='lg' weight={500}>
                      {username}
                    </Text>
                    <Text size='xs' weight={400}>
                      {date}
                    </Text>
                  </div>
                </Group>
                <Group>
                  <Rating value={rating} onChange={setRating} />
                  <Button type='submit' variant='subtle'>
                    add comment
                  </Button>
                  <Button type='reset' variant='subtle' color='gray'>
                    cancel
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
          <ModelComment
            comment={comment}
            comments={comments}
            setComments={setComments}
            username={username}
            setCommentsAmout={setCommentsAmout}
            setRatingValue={setRatingValue}
            key={index}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ModelComments
