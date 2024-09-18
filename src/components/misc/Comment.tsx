import { Paper, Group, Text, ActionIcon, Avatar, TextInput, Grid } from '@mantine/core'
import { Tooltip, Rating } from '@mantine/core'
import type { Comment } from '@prisma/client'
import { IconTrash, IconPencil, IconCheck } from '@tabler/icons'
import { useState } from 'react'
import { api } from '@/lib/trpc'
import { calculateAverageRating, CreateNotification, encodeEmail } from '@/lib/utils'
import useTranslation from 'next-translate/useTranslation'

import { useComments } from '@/hooks/useComments'
import { useSiteSettings } from '@/hooks/useSiteSettings'

// The component props
type Props = {
  comment: Comment
  comments: Comment[]
  setComments: (value: Comment[]) => void
}

export default function Comment({ comment, comments, setComments }: Props) {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const [rating, setRating] = useState(comment.rating) // State for the comment rating
  const [editing, setEditing] = useState(false) // State for is user editing the comment
  const [editText, setEditText] = useState(comment.message) // State for the comment text
  const imageExistsQuery = api.auth.isCommentImageExists.useQuery({
    username: comment.username
  }) // Get is the profile picture exists
  const commentEmailQuery = api.auth.getCommentEmail.useQuery({
    username: comment.username
  }) // Get the comment email
  const { mutateAsync: mutateDelete } = api.auth.deleteComment.useMutation() // Delete comment mutation
  const { mutateAsync: mutateEdit } = api.auth.editComment.useMutation() // Edit comment mutation
  const { setCommentsAmount, setRatingValue, username } = useComments() // Get the comments state
  const { t } = useTranslation('main') // Translation hook

  // Delete comment function
  async function deleteComment() {
    // Delete the comment
    await mutateDelete(
      { commentId: comment.id },
      {
        // Add the new comment
        onSuccess() {
          CreateNotification(t('commentDeletedSuccessfully'), 'green') // Create a success notification
        }
      }
    )
    const newArr: Comment[] = [] // Initializes the new array
    // For each comment in the comments
    comments.forEach((iteratedComment) => {
      // If the comment id is not equal to the deleted comment id
      if (iteratedComment.id !== comment.id) {
        newArr.push(iteratedComment) // Push the comment to the new array
      }
    })
    setComments([...newArr]) // Update the comments state
    setCommentsAmount(newArr.length) // Update the comments amount state
    setRatingValue(calculateAverageRating(newArr)) // Update the rating value
  }

  // Edit comment function
  async function editComment() {
    // Edit the comment
    await mutateEdit(
      { commentId: comment.id, message: editText, rating: rating },
      {
        // Add the new comment
        onSuccess() {
          CreateNotification(t('commentEditedSuccessfully'), 'green') // Create a success notification
        }
      }
    )
    // Update the comments state
    const newComments = comments.map(
      (comment) => (comment.id === comment.id ? { ...comment, message: editText, rating } : comment) // Update the comment
    )
    setComments(newComments) // Update the comments state
    setRatingValue(calculateAverageRating(newComments)) // Update the rating value
    setEditing(false) // Set the editing state to false
  }

  return (
    <Paper withBorder radius='md' sx={{ padding: 10, marginTop: 20 }}>
      <Group position='apart' sx={{ marginBottom: 10 }}>
        <Group sx={{ padding: 10 }}>
          <Avatar
            src={
              imageExistsQuery.data && commentEmailQuery.data
                ? `/users/${encodeEmail(commentEmailQuery.data)}.png`
                : ''
            }
            radius='md'
          />
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
          <Rating readOnly={!editing} value={rating} onChange={setRating} />
          {(comment.username === username ||
            (user && (user.role === 'admin' || user.role === 'manager'))) && (
            <>
              <Tooltip color='gray' label={t('edit')}>
                <ActionIcon color='dark'>
                  <IconPencil onClick={() => setEditing(!editing)} />
                </ActionIcon>
              </Tooltip>
              <Tooltip color='gray' label={t('delete')}>
                <ActionIcon color='dark' onClick={deleteComment}>
                  <IconTrash />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
      </Group>
      {editing ? (
        <Grid mr='xs'>
          <Grid.Col span={11}>
            <TextInput
              value={editText}
              onChange={(event) => setEditText(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <ActionIcon w='100%' h='100%' variant='light' onClick={() => editComment()}>
              <IconCheck color='green' />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      ) : (
        <Text ml='sm' mb='sm'>
          {comment.message}
        </Text>
      )}
    </Paper>
  )
}
