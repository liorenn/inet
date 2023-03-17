import { Group, Button, rem, FileInputProps } from '@mantine/core'
import { ActionIcon, Modal, FileInput, Avatar, Center } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUpload } from '@tabler/icons'
import { Dispatch, SetStateAction, useState } from 'react'
import { CreateNotification } from '../../utils/functions'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { trpc } from '../../utils/trpc'
import { usePublicUrl } from '../../utils/usePublicUrl'

type props = {
  setIsHovered: Dispatch<SetStateAction<boolean>>
}

export default function UploadAvatar({ setIsHovered }: props) {
  const [opened, { open, close }] = useDisclosure(false)
  const [file, setFile] = useState<File>()
  const supabase = useSupabaseClient()
  const user = useUser()
  const change = usePublicUrl((state) => state.change)

  const { data: UserDetails } = trpc.auth.getUserDetails.useQuery({
    id: user?.id,
  })
  async function SubmitFile(file: File) {
    const { data } = await supabase.storage
      .from('pictures')
      .list(UserDetails?.id)

    let action = 'upload'
    data?.map((value) => {
      if (value.name === 'profile.png') action = 'update'
    })

    if (action === 'upload') {
      await supabase.storage
        .from('pictures')
        .upload(UserDetails?.id + '/profile.png', file, { upsert: true })
    }
    if (action === 'update') {
      await supabase.storage
        .from('pictures')
        .update(UserDetails?.id + '/profile.png', file, { upsert: true })
    }
    change(URL.createObjectURL(file))
    CreateNotification('Profile Picture Changed', 'green')
    setFile(undefined)
    close()
    setIsHovered(false)
  }

  function ChangeFile(newFile: File | null) {
    if (newFile) {
      setFile(newFile)
    }
  }

  const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
    if (Array.isArray(value)) {
      return <div></div>
    }
    return <div></div>
  }

  return (
    <>
      <ActionIcon size={160} radius='xl' onClick={open}>
        <IconUpload size='5rem' />
      </ActionIcon>

      <Modal opened={opened} onClose={close} title='Upload Your Profile Photo'>
        <FileInput
          multiple={false}
          valueComponent={ValueComponent}
          icon={<IconUpload size={rem(20)} />}
          onChange={(e) => ChangeFile(e)}
        />

        {file && (
          <>
            <Center>
              <Avatar
                mt='xl'
                radius='50%'
                size={200}
                src={URL.createObjectURL(file)}
              />
            </Center>
            <Group grow mt='xl'>
              <Button
                onClick={() => SubmitFile(file)}
                variant='light'
                color='green'
                radius='md'>
                Confirm
              </Button>
              <Button
                onClick={() => close()}
                variant='light'
                color='red'
                radius='md'>
                Cancel
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </>
  )
}
