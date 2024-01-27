/* eslint-disable @typescript-eslint/no-misused-promises */

import { ActionIcon, Avatar, Center, Modal } from '@mantine/core'
import { Button, Group, Text, rem } from '@mantine/core'
import { CreateNotification, encodeEmail } from '@/utils/utils'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons'

import { clientEnv } from '@/utils/env'
import { useDisclosure } from '@mantine/hooks'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Props = {
  email: string
}

export default function ImageUploader({ email }: Props) {
  const router = useRouter() // Get the router
  const [opened, { open, close }] = useDisclosure(false) // Open and close the modal functions
  const [file, setFile] = useState<File | undefined>() // State variable to store the file
  const { setImageExists, setImagePath, imageExists, imagePath } = useProfilePicture() // Get the profile picture state

  async function deleteImage() {
    // Send a request to the server to delete the image
    await fetch('/api/file/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: `public/users/${encodeEmail(email)}.png`, // The name of the image to delete
      }),
    }).then(() => {
      CreateNotification('Profile Picture Deleted', 'green') // Create a success notification
      setImageExists(false) // Set the imageExists state to false
      setFile(undefined) // Set the file state to undefined
      close() // Close the modal
    })
  }

  async function uploadImage() {
    if (!file) return // If no file is selected return
    const formData = new FormData() // Create a FormData object
    const newFileName = `${encodeEmail(email)}.png` // The name of the image to upload
    const newFile = new File([file], newFileName, { type: file.type }) // Create a new file object
    formData.append('file', newFile) // Append the file to the FormData object
    try {
      // Send a request to the server to upload the image
      await fetch('/api/file/upload', {
        method: 'POST',
        body: formData, // Send the FormData object
      }).then((response) => {
        if (response.ok) {
          // If the response is ok
          CreateNotification('Profile Picture Changed', 'green') // Create a success notification
          setImagePath(`${clientEnv.websiteUrl}/users/${newFileName}`) // Set the imagePath state
          setFile(newFile) // Set the file state
          router.reload() // Reload the page
        }
        close() // Close the modal
      })
    } catch (error) {} // Catch any errors
  }

  return (
    <>
      <Modal opened={opened} onClose={close} size='auto' title='Upload Your Profile Photo'>
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
                Attach as many files as you like, each file should not exceed 5mb
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
                <Button onClick={() => deleteImage()} variant='light' color='red' radius='md'>
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
