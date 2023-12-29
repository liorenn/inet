/* eslint-disable @typescript-eslint/no-misused-promises */
import { Group, Button, rem, Text } from '@mantine/core'
import { ActionIcon, Modal, Avatar, Center } from '@mantine/core'
import { CreateNotification, encodeEmail } from '../../misc/functions'
import { useDisclosure } from '@mantine/hooks'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons'
import { useState } from 'react'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useProfilePicture } from '../../hooks/useProfilePicture'

type props = {
  email: string
}

export default function ImageUploader({ email }: props) {
  const [opened, { open, close }] = useDisclosure(false)
  const [file, setFile] = useState<File | undefined>()
  const { setImageExists, setImagePath, imageExists, imagePath } =
    useProfilePicture()

  async function deleteImage() {
    await fetch('/api/file/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: `public/users/${encodeEmail(email)}.png`,
      }),
    }).then((response) => {
      console.log(response)
      CreateNotification('Profile Picture Deleted', 'green')
      setImageExists(false)
      setFile(undefined)
      close()
    })
  }

  async function uploadImage() {
    if (!file) return
    const formData = new FormData()
    const newFileName = `${encodeEmail(email)}.png`
    const newFile = new File([file], newFileName, { type: file.type })
    formData.append('file', newFile)
    try {
      await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        if (response.ok) {
          CreateNotification('Profile Picture Changed', 'green')
          setImagePath(`/users/${newFileName}`)
          setFile(undefined)
        }
        close()
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size='auto'
        title='Upload Your Profile Photo'>
        <Dropzone
          onDrop={(files) => setFile(files[0])}
          onReject={(file) => console.log('rejected files', file)}
          accept={IMAGE_MIME_TYPE}
          multiple={false}>
          <Group
            position='center'
            spacing='xl'
            style={{ minHeight: rem(80), pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload size='3.2rem' stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size='3.2rem' stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size='3.2rem' stroke={1.5} />
            </Dropzone.Idle>
            <div>
              <Text size='xl' inline>
                Drag images here or click to select files
              </Text>
              <Text size='sm' color='dimmed' inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
        {(file || imageExists) && (
          <>
            <Center>
              <Avatar
                mt='xl'
                radius='xl'
                size={200}
                src={file ? URL.createObjectURL(file) : imagePath}
              />
            </Center>
            <Group grow mt='xl'>
              <Button
                onClick={async () => {
                  try {
                    await uploadImage()
                  } catch (error) {}
                }}
                variant='light'
                color='green'
                radius='md'>
                Confirm
              </Button>
              {imageExists && (
                <Button
                  onClick={() => deleteImage()}
                  variant='light'
                  color='red'
                  radius='md'>
                  Delete
                </Button>
              )}
              <Button onClick={close} variant='light' color='gray' radius='md'>
                Cancel
              </Button>
            </Group>
          </>
        )}
      </Modal>
      <ActionIcon size={160} radius='xl' onClick={open}>
        <Avatar size={160} radius='xl' src={imageExists ? imagePath : ''} />
      </ActionIcon>
    </>
  )
}
