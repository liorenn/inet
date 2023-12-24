import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Title, Text, Container, Button } from '@mantine/core'
import { TextInput, Paper } from '@mantine/core'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { CreateNotification } from '../../misc/functions'
import Head from 'next/head'

export default function ResetPassword() {
  const supabase = useSupabaseClient()
  const [session, setSession] = useState(useSession())
  const [currentForm, setCurrentForm] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('lior.oren06@gmail.com')
  const [password, setPassword] = useState('1234567')

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        setCurrentForm('password')
        setSession(session)
      }
    })
  }, [supabase.auth])

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await supabase.auth.resetPasswordForEmail(email).then((data) => {
      data &&
        CreateNotification(`Check Your Email To Sign In at ${email}`, 'yellow')
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    if (data) {
      CreateNotification('Password updated successfully', 'green')
    }
    if (error) {
      CreateNotification('There was an error updating your password', 'red')
    }
  }

  function emailForm() {
    return (
      <>
        <form onSubmit={(e) => handleEmailSubmit(e)}>
          <TextInput
            label='Email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder='Your Email...'
          />
          <Button fullWidth mt='xl' type='submit'>
            Sign In
          </Button>
        </form>
        <Link href={'/auth/signin'} style={{ textDecoration: 'none' }}>
          <Button fullWidth mt='lg'>
            Login via Credencials
          </Button>
        </Link>
        <Link href={'/auth/signin/viaphone'} style={{ textDecoration: 'none' }}>
          <Button fullWidth mt='lg' mb='sm'>
            Login via Phone
          </Button>
        </Link>
      </>
    )
  }

  function passwordForm() {
    return (
      <>
        <Head>
          <title>Reset Password</title>
        </Head>
        <form onSubmit={(e) => handlePasswordSubmit(e)}>
          <TextInput
            label='Password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            placeholder='Your Password...'
          />
          <Button fullWidth mt='xl' type='submit'>
            Update Password
          </Button>
        </form>
        <Link href={'/'} style={{ textDecoration: 'none' }}>
          <Button fullWidth mt='lg' mb='sm'>
            Cancel Updating Password
          </Button>
        </Link>
      </>
    )
  }

  if (session) {
    return <>you are already logged in</>
  }

  return (
    <>
      {' '}
      <Container size={420} my={40}>
        <Title
          align='center'
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}>
          {currentForm === 'email'
            ? 'Enter Your Email'
            : 'Enter Your New Password'}{' '}
        </Title>
        {currentForm === 'email' && (
          <Text color='dimmed' size='sm' align='center' mt={5}>
            Do not have an account yet?{' '}
            <Link href='/signup'>Create Account</Link>
          </Text>
        )}
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          {currentForm === 'email' ? emailForm() : passwordForm()}{' '}
        </Paper>
      </Container>
    </>
  )
}
