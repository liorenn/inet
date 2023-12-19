import { Group, Button, rem } from '@mantine/core'
import { ActionIcon, Modal, FileInput, Avatar, Center } from '@mantine/core'
import { CreateNotification, encodeEmail } from '../../misc/functions'
import { useDisclosure } from '@mantine/hooks'
import { IconUpload } from '@tabler/icons'
import { useState } from 'react'

type props = {
  email: string
}

export default function UploadAvatar({ email }: props) {
  const [opened, { open, close }] = useDisclosure(false)
  const [file, setFile] = useState<File | undefined>()

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
      setFile(undefined)
      close()
    })
  }

  async function uploadImage(file: File) {
    const formData = new FormData()
    const newFileName = `${encodeEmail(email)}.png`
    const newFile = new File([file], newFileName, { type: file.type })
    formData.append('file', newFile)
    try {
      await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        console.log(response)
        CreateNotification('Profile Picture Changed', 'green')
        setFile(undefined)
        close()
      })
    } catch (error) {
      console.log(error)
    }
  }

  function changeFile(newFile: File | null) {
    if (newFile) {
      setFile(newFile)
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title='Upload Your Profile Photo'>
        <FileInput
          multiple={false}
          icon={<IconUpload size={rem(20)} />}
          onChange={(e) => changeFile(e)}
        />

        {file && (
          <>
            <Center>
              <Avatar
                mt='xl'
                radius='xl'
                size={200}
                src={URL.createObjectURL(file)}
              />
            </Center>
            <Group grow mt='xl'>
              <Button
                onClick={async () => {
                  try {
                    await uploadImage(file)
                  } catch (error) {}
                }}
                variant='light'
                color='green'
                radius='md'>
                Confirm
              </Button>
              <Button onClick={close} variant='light' color='red' radius='md'>
                Cancel
              </Button>
            </Group>
          </>
        )}
      </Modal>
      <ActionIcon size={160} radius='xl' onClick={open}>
        <Avatar
          size={160}
          radius='xl'
          src={`/users/${encodeEmail(email)}.png`}
        />
      </ActionIcon>
    </>
  )
}
