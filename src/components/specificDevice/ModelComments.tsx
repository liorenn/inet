import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import ModelComment from './ModelComment'
import { Textarea, Button, Box, Image, Rating } from '@mantine/core'
import { Text, Divider, Group, Accordion } from '@mantine/core'
import type { Comment, Device } from '@prisma/client'
import { trpc } from '../../utils/trpc'
import { CalcAverageRating, CreateNotification } from '../../utils/functions'
import usePublicUrl from '../../utils/usePublicUrl'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  device: Device
  username: string
  setRatingValue: (value: number) => void
  setCommentsAmout: (value: number) => void
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
  const [usersIds, setUsersIds] = useState<string[]>([])
  const [picturesUrls, setPicturesUrls] = useState<string[]>([])
  const publicUrl = usePublicUrl((state) => state.publicUrl)
  const date = new Date().toDateString()
  const { mutate } = trpc.auth.addComment.useMutation()
  const commentsQuery = trpc.auth.getAllComments.useQuery({
    model: device.model,
  })
  const { mutate: mutateUsersIds } = trpc.auth.getUsersIds.useMutation()
  const { mutate: mutatePicturesUrls } = trpc.auth.GetPublicUrlArr.useMutation()
  const { t } = useTranslation('devices')

  useEffect(() => {
    if (comments.length > 0) {
      const arr: { username: string }[] = []
      for (let i = 0; i < comments.length; i++) {
        const username = comments[i].username
        if (username) {
          arr.push({ username: username })
        }
        mutateUsersIds(arr, {
          onSuccess(data) {
            setUsersIds(data)
          },
        })
      }
    }
  }, [comments, mutateUsersIds])

  useEffect(() => {
    if (usersIds.length > 0) {
      mutatePicturesUrls(usersIds, {
        onSuccess(data) {
          setPicturesUrls(data)
        },
      })
    }
  }, [usersIds, mutatePicturesUrls])

  useEffect(() => {
    const commentsArr = commentsQuery.data
    if (commentsArr && !isFetched) {
      setIsFetched(true)
      setComments(commentsArr)
      setCommentsAmout(commentsArr.length)
      setRatingValue(CalcAverageRating(commentsArr))
    }
  }, [commentsQuery, isFetched, setCommentsAmout, setRatingValue])

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
      Rating: rating,
    }
    mutate(newComment, {
      onSuccess(data) {
        CreateNotification(t('commentDeletedSuccessfully'), 'green')
        setText('')
        setRating(0)
        setComments((prev) => pushComment(prev, data))
        setCommentsAmout(comments.length)
        setRatingValue(CalcAverageRating(comments))
      },
    })
  }

  function pushComment(comments: Comment[], newComment: Comment) {
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
        defaultValue=''
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
                  <Image
                    src={publicUrl}
                    height={45}
                    width={45}
                    alt='image'
                    radius='xl'
                  />
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
          <ModelComment
            pictureUrl={picturesUrls[index]}
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
