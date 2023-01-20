import { Paper, Group, Text, ActionIcon, Avatar } from '@mantine/core'
import { Tooltip, Image, Rating } from '@mantine/core'
import { Comment, Device } from '@prisma/client'
import { IconTrash, IconPencil, IconCornerUpLeft } from '@tabler/icons'
import { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'
import { CalcAverageRating, CreateNotification } from '../../utils/functions'

type Props = {
  comment: Comment
  comments: Comment[]
  setComments: Function
  username: string
  setRatingValue: Function
  setCommentsAmout: Function
}

function ModelComment({
  comment,
  comments,
  setComments,
  username,
  setCommentsAmout,
  setRatingValue,
}: Props) {
  const [rating, setRating] = useState(comment.Rating)
  const { mutate } = trpc.auth.deleteComment.useMutation()

  async function DeleteComment() {
    mutate(
      { commentId: comment.id },
      {
        onSuccess() {
          CreateNotification('Comment deleted successfully', 'green')
        },
      }
    )
    const newArr: Comment[] = []
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id !== comment.id) {
        newArr.push(comments[i])
      }
    }
    setComments([...newArr])
    setCommentsAmout(newArr.length)
    setRatingValue(CalcAverageRating(newArr))
  }

  return (
    <Paper withBorder radius='md' sx={{ padding: 10, marginTop: 20 }}>
      <Group position='apart' sx={{ marginBottom: 10 }}>
        <Group sx={{ padding: 10 }}>
          {/* <Image
            src={image_url}
            height={45}
            width={45}
            style={{ borderRadius: '50%' }}
            alt={comment.authur}
            radius='xl'
          /> */}
          <Avatar />
          <div>
            <Text size='lg' weight={500}>
              {comment.username}
            </Text>
            <Text size='xs' weight={400}>
              {comment.createdAt.toDateString()}
            </Text>
          </div>
        </Group>
        <Group sx={{ padding: 10 }}>
          <Rating value={rating} onChange={setRating} />
          <Tooltip label='reply'>
            <ActionIcon color='dark'>
              <IconCornerUpLeft />
            </ActionIcon>
          </Tooltip>
          {comment.username === username && (
            <>
              <Tooltip label='edit'>
                <ActionIcon color='dark'>
                  <IconPencil />
                </ActionIcon>
              </Tooltip>
              <Tooltip label='delete'>
                <ActionIcon color='dark' onClick={DeleteComment}>
                  <IconTrash />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
      </Group>
      <Text>{comment.message}</Text>
    </Paper>
  )
}

export default ModelComment
