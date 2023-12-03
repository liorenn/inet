import { Center, Loader, PasswordInput } from '@mantine/core'
import { Text, Container, Stack, Box, Group } from '@mantine/core'
import { TextInput, Divider, Avatar } from '@mantine/core'
import { SimpleGrid, UnstyledButton } from '@mantine/core'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import { trpc } from '../../utils/trpc'
import { CreateNotification } from '../../utils/functions'
import { useViewportSize } from '@mantine/hooks'
import { useSession, useUser } from '@supabase/auth-helpers-react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import UploadAvatar from '../../components/layout/UploadAvatar'
import usePublicUrl from '../../utils/usePublicUrl'
import useTranslation from 'next-translate/useTranslation'

export default function Account() {
  const session = useSession()
  const user = useUser()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { height } = useViewportSize()
  const updateMutation = trpc.auth.updateUserDetails.useMutation()
  const { data: UserDetails } = trpc.auth.getUserDetails.useQuery({
    id: user?.id,
  })
  const { t } = useTranslation('auth')
  const { publicUrl } = usePublicUrl()
  const dateFormmater = Intl.DateTimeFormat('en-us', { dateStyle: 'short' })
  const [IsHovered, setIsHovered] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [usernameLabel, setUsernameLabel] = useState<string>('')
  const [nameLabel, setNameLabel] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [updatedAt, setUpdatedAt] = useState<string>()
  supabase.auth.onAuthStateChange(async (session) => {
    if (!session) {
      await router.push('/')
    }
  })
  const createdAt = dateFormmater.format(
    new Date(user?.created_at ?? new Date())
  )
  useEffect(() => {
    if (UserDetails) {
      setEmail(UserDetails.email)
      setPhone(UserDetails.phone)
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
  }, [UserDetails, user, dateFormmater])

  const translations = [
    { input: 'username', translation: t('username') },
    { input: 'name', translation: t('name') },
    { input: 'email', translation: t('email') },
    { input: 'password', translation: t('password') },
    { input: 'phone', translation: t('phone') },
  ]

  async function UpdateDetail(
    detail: 'email' | 'username' | 'name' | 'password' | 'phone'
  ) {
    if (detail === 'email' || detail === 'password' || detail === 'phone') {
      await supabase.auth.updateUser({
        email: email,
        password: password,
        phone: phone,
      })
    }
    updateMutation.mutate(
      {
        email: email,
        password: password,
        id: user?.id,
        name: name,
        username: username,
        phone: phone,
      },
      {
        onSuccess() {
          setUpdatedAt(dateFormmater.format(new Date()))
          CreateNotification(
            `${
              translations.find((value) => value.input === detail)?.translation
            } ${t('updatedSuccessfully')}`,
            'green'
          )
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
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }

  if (!UserDetails) {
    return (
      <>
        <Head>
          <title>{t('account')}</title>
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
        <title>{t('account')}</title>
      </Head>
      <Container size='xl'>
        <Group position='apart' sx={{ padding: 20, marginBottom: 30 }}>
          <Group spacing='xl'>
            <div
              onMouseOver={() => setIsHovered(true)}
              onMouseOut={() => setIsHovered(false)}>
              {IsHovered ? (
                <UploadAvatar setIsHovered={setIsHovered} />
              ) : (
                <Avatar src={publicUrl} size={160} radius='xl' />
              )}
            </div>
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
              {`${t('createdAt')} ${createdAt}`}
            </Text>
            <Text
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              {`${t('updatedAt')} ${updatedAt}`}
            </Text>
            {/* <Text sx={{ fontSize: 18 }} weight={500} color='dimmed' align='right'>
              comments commented: 0
            </Text> */}
          </Stack>
        </Group>
        <Stack>
          <div>
            <Text sx={{ fontSize: 28 }} weight={700}>
              {t('accountInformation')}
            </Text>
            <Text sx={{ fontSize: 18 }} weight={500}>
              {t('accountInformationDescription')}
            </Text>
          </div>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              {t('username')}
            </Text>
            <TextInput
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('username'),
              })}
              value={username}
              radius='md'
              size='md'
            />
            <UnstyledButton
              onClick={async () => {
                try {
                  await UpdateDetail('username')
                } catch (error) {}
              }}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                {t('update')}
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              {t('name')}
            </Text>
            <TextInput
              onChange={(e) => setName(e.target.value)}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('name'),
              })}
              value={name}
              radius='md'
              size='md'
            />
            <UnstyledButton
              onClick={async () => {
                try {
                  await UpdateDetail('name')
                } catch (error) {}
              }}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                {t('update')}
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              {t('email')}
            </Text>
            <TextInput
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('email'),
              })}
              value={email}
              radius='md'
              size='md'
            />
            <UnstyledButton
              onClick={async () => {
                try {
                  await UpdateDetail('email')
                } catch (error) {}
              }}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                {t('update')}
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              {t('phone')}
            </Text>
            <TextInput
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('phone'),
              })}
              value={phone}
              radius='md'
              size='md'
            />
            <UnstyledButton
              onClick={async () => {
                try {
                  await UpdateDetail('phone')
                } catch (error) {}
              }}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                {t('update')}
              </Text>
            </UnstyledButton>
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text
              sx={{ fontSize: 18, paddingTop: 6 }}
              weight={500}
              color='dimmed'>
              {t('password')}
            </Text>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('password'),
              })}
              value={password}
              radius='md'
              size='md'
            />
            <UnstyledButton onClick={() => UpdateDetail('password')}>
              <Text
                sx={{ fontSize: 18 }}
                weight={500}
                align='right'
                color='green'>
                {t('update')}
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
