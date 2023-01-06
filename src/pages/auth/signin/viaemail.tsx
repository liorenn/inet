import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Title, Text, Container, Button, SimpleGrid } from '@mantine/core'
import { TextInput, Paper } from '@mantine/core'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { trpc } from '../../../utils/trpc'
import { CreateNotification } from '../../../utils/functions'
import Head from 'next/head'

type Inputs = {
  email: string
}

export default function viaemail() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [session, setSession] = useState(useSession())
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation()
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({})

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setSession(session)
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (fields) => {
    //when form is submitted and passed validation
    const { data, error } = await supabase.auth.signInWithOtp({
      email: fields.email,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
      },
    })
    if (!error) {
      CreateNotification(
        'Check Your Email To Sign In at ' + fields.email,
        'yellow'
      )
    } else {
      CreateNotification('Error has accured', 'red')
    }
  }

  function GetEmailError(): string {
    const error = errors.email?.type
    if (error === 'required') return 'Enter Email Field'
    if (error === 'pattern') return 'Wrong Pattern'
    return error + ' Error'
  }

  const onError: SubmitErrorHandler<Inputs> = (errors) => {
    console.log(errors)
  }

  if (session) {
    return <>you are already logged in</>
  }

  return (
    <>
      <Head>
        <title>Sign In By Email</title>
      </Head>
      <Container size={420} my={40}>
        <Title
          align='center'
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}>
          Welcome back!
        </Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          Do not have an account yet? <Link href='/signup'>Create Account</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <TextInput
              label='Email'
              defaultValue='lior.oren06@gmail.com'
              placeholder='Your Email...'
              error={errors.email ? GetEmailError() : ''}
              {...register('email', {
                required: true,
                pattern: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
              })}
            />
            <Button
              color='gray'
              variant='light'
              fullWidth
              mt='lg'
              type='submit'>
              Sign In
            </Button>
          </form>
          <SimpleGrid cols={2}>
            <Link href={'/auth/signin'} style={{ textDecoration: 'none' }}>
              <Button color='gray' variant='light' fullWidth mt='lg'>
                Via Credentials
              </Button>
            </Link>
            <Link
              href={'/auth/signin/viaphone'}
              style={{ textDecoration: 'none' }}>
              <Button color='gray' variant='light' fullWidth mt='lg' mb='sm'>
                Via Phone
              </Button>
            </Link>
          </SimpleGrid>
        </Paper>
      </Container>
    </>
  )
}
