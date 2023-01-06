import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import {
  Text,
  Container,
  Stack,
  Box,
  Group,
  Center,
  Loader,
  PasswordInput,
} from '@mantine/core'
import { TextInput, Divider, Avatar } from '@mantine/core'
import { SimpleGrid, UnstyledButton } from '@mantine/core'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import { trpc } from '../../utils/trpc'
import { CreateNotification } from '../../utils/functions'
import { useViewportSize } from '@mantine/hooks'

export default function account() {
  const session = useSession()
  const user = useUser()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { height, width } = useViewportSize()
  const updateMutation = trpc.auth.updateUserDetails.useMutation()
  const { data: UserDetails, status } = trpc.auth.getUserDetails.useQuery({
    id: user?.id,
  })
  const dateFormmater = Intl.DateTimeFormat('en-us', { dateStyle: 'short' })
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [usernameLabel, setUsernameLabel] = useState<string>('')
  const [nameLabel, setNameLabel] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [updatedAt, setUpdatedAt] = useState<string>()
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      router.push('/')
    }
  })
  let created_at = dateFormmater.format(
    new Date(user?.created_at ?? new Date())
  )
  useEffect(() => {
    if (UserDetails) {
      setEmail(UserDetails.email)
      setUsername(UserDetails.username)
      setName(UserDetails.name)
      setPassword(UserDetails.password)
      setUsernameLabel(UserDetails.username)
      setNameLabel(UserDetails.name)
      if (user) {
        setUpdatedAt(
          dateFormmater.format(new Date(user?.updated_at ?? user?.created_at))
        )
      }
    }
  }, [UserDetails])

  async function UpdateDestail(
    detail: 'email' | 'username' | 'name' | 'password'
  ) {
    if (detail === 'email' || detail === 'password') {
      const { data, error } = await supabase.auth.updateUser({
        email: email,
        password: password,
      })
    }
    updateMutation.mutate(
      {
        email: email,
        password: password,
        id: user?.id,
        name: name,
        username: username,
      },
      {
        onSuccess() {
          setUpdatedAt(dateFormmater.format(new Date()))
          CreateNotification(detail + ' Updated Successfully', 'green')
          if (detail === 'username') {
            setUsernameLabel(username)
          }
          if (detail === 'name') {
            setNameLabel(name)
          }
        },
      }
    )
  }

  if (!(user && session)) {
    return <>login to view page</>
  }

  if (!UserDetails) {
    return (
      <>
        <Head>
          <title>Account</title>
        </Head>
        <Center>
          <Loader color='gray' size={120} variant='dots' mt={height / 3} />
        </Center>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <Container size='xl'>
        <Group position='apart' sx={{ padding: 20, marginBottom: 30 }}>
          <Group spacing='xl'>
            <Avatar size={160} radius='xl' />
            <Box>
              <Text sx={{ fontSize: 50 }} weight={700}>
                {usernameLabel}
              </Text>
              <Text sx={{ fontSize: 22 }} weight={400}>
                {nameLabel}
              </Text>
            </Box>
          </Group>
          <Stack sx={{ marginTop: 28 }}>
            <Text
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              Created at: {created_at}
            </Text>
            <Text
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              Updated at: {updatedAt}
            </Text>
            {/* <Text sx={{ fontSize: 18 }} weight={500} color='dimmed' align='right'>
              comments commented: 0
            </Text> */}
          </Stack>
        </Group>
        <Stack>
          <div>
            <Text sx={{ fontSize: 28 }} weight={700}>
              Account Information
            </Text>
            <Text sx={{ fontSize: 18 }} weight={500}>
              update and change your account information
            </Text>
          </div>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              Username
            </Text>
            <TextInput
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter Your Username...'
              value={username}
              radius='md'
              size='md'
            />
            <UnstyledButton onClick={() => UpdateDestail('username')}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                Update
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              Name
            </Text>
            <TextInput
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter Your Name...'
              value={name}
              radius='md'
              size='md'
            />
            <UnstyledButton onClick={() => UpdateDestail('name')}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                Update
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              Email
            </Text>
            <TextInput
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Your Email...'
              value={email}
              radius='md'
              size='md'
            />
            <UnstyledButton onClick={() => UpdateDestail('email')}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                Update
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              Password
            </Text>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter Your New Password...'
              value={password}
              radius='md'
              size='md'
            />
            <UnstyledButton onClick={() => UpdateDestail('password')}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                Update
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          {/* <div style={{ marginTop: 26 }}>
            <Text sx={{ fontSize: 28 }} weight={700}>
              Account Comments
            </Text>
            <Text sx={{ fontSize: 18 }} weight={500}>
              view and edit your account comments
            </Text>
          </div>
          <Divider /> */}
        </Stack>
      </Container>
    </>
  )
}
