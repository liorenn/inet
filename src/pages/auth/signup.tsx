import Link from 'next/link'
import { useEffect } from 'react'
import { Title, Text, Container, Button } from '@mantine/core'
import { TextInput, PasswordInput, Paper } from '@mantine/core'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { trpc } from '../../utils/trpc'
import { CreateNotification } from '../../utils/functions'
import Head from 'next/head'

type Inputs = {
  username: string
  name: string
  email: string
  password: string
}

export default function signUp() {
  const router = useRouter()
  const session = useSession()
  const supabase = useSupabaseClient()
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation()
  const CreateUserMutation = trpc.auth.CreateUser.useMutation()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({})

  const onSubmit: SubmitHandler<Inputs> = (fields) => {
    //when form is submitted and passed validation
    IsUserExistsMutation.mutate(
      {
        email: fields.email,
        password: fields.password,
        username: fields.username,
      },
      {
        async onSuccess(data) {
          //if trpc return results
          const IsExist = data
          if (IsExist?.email && !IsExist.username) {
            CreateNotification(
              'Account With The Same Email Already Exists',
              'red'
            )
          }
          if (!IsExist?.email && IsExist?.username) {
            CreateNotification(
              'Account With The Same Username Already Exists',
              'red'
            )
          }
          if (IsExist?.email && IsExist?.username) {
            CreateNotification(
              'Account With The Same Email And Username Already Exists',
              'red'
            )
          }
          if (!IsExist?.email && !IsExist?.username) {
            //if user doesnt exist create new user and saves data in user table
            let { data, error } = await supabase.auth.signUp({
              email: fields.email,
              password: fields.password,
            })
            if (!error) {
              CreateNotification('Account Created Successfully', 'green')
              router.push('/')
              router.reload()
              if (data.user?.id !== undefined) {
                CreateUserMutation.mutate({
                  id: data.user?.id,
                  email: fields.email,
                  name: fields.name,
                  password: fields.password,
                  username: fields.username,
                })
                if (error) {
                  CreateNotification('Error Couldnt Retrive Account Id', 'red')
                }
              }
            } else {
              CreateNotification('Error Couldnt Create Account', 'red')
            }
          }
        },
      }
    )
  }
  //----------------------------------------------

  const GetPasswordError = (): string => {
    const error = errors.password?.type
    if (error === 'required') return 'Enter Password Field'
    if (error === 'pattern') return 'Wrong Pattern'
    return error + ' Error'
  }

  function GetEmailError(): string {
    const error = errors.email?.type
    if (error === 'required') return 'Enter Email Field'
    if (error === 'pattern') return 'Wrong Pattern'
    return error + ' Error'
  }
  function GetNameError(): string {
    const error = errors.name?.type
    if (error === 'required') return 'Enter Name Field'
    if (error === 'pattern') return 'Wrong Pattern'
    return error + ' Error'
  }
  function GetUserNameError(): string {
    const error = errors.username?.type
    if (error === 'required') return 'Enter UserName Field'
    if (error === 'pattern') return 'Wrong Pattern'
    return error + ' Error'
  }

  function GetError(field: string): string {
    const error = errors.username?.type
    if (error === 'required') return 'Enter ' + field + ' Field'
    if (error === 'pattern') return 'Wrong ' + field + ' Pattern'
    return error + ' Error'
  }

  const onError: SubmitErrorHandler<Inputs> = (errors) => {
    console.log(errors)
  }

  if (session) {
    return <>you already have an account</>
  }

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Container size={420} my={40}>
        <Title
          align='center'
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}>
          Create An Account
        </Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          Already Have An Account?{' '}
          <Link href='/auth/`signin'>Sign In Your Account</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <TextInput
              label='Username'
              placeholder='Enter Your Username...'
              defaultValue='lioren'
              error={errors.username ? GetUserNameError() : ''}
              {...register('username', {
                required: true,
                pattern: /^[A-Za-z\d_.]{5,}$/,
              })}
            />
            <TextInput
              label='Name'
              placeholder='Enter Your Name...'
              defaultValue='Lior Oren'
              error={errors.name ? GetNameError() : ''}
              {...register('name', {
                required: true,
                pattern: /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/,
              })}
            />
            <TextInput
              label='Email'
              placeholder='Enter Your Email...'
              defaultValue='lior.oren06@gmail.com'
              error={errors.email ? GetEmailError() : ''}
              {...register('email', {
                required: true,
                pattern: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
              })}
            />
            <PasswordInput
              label='Password'
              placeholder='Enter Your password...'
              defaultValue='123456'
              error={errors.password ? GetPasswordError() : ''}
              mt='md'
              {...register('password', {
                required: true,
                pattern: /^[A-Za-z\d_.!@#$%^&*]{5,}$/,
              })}
            />
            <Button
              fullWidth
              color='gray'
              variant='light'
              mt='xl'
              type='submit'>
              Create Account
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  )
}

// const handleSignup = async (e) => {
//   e.preventDefault()
//   const { error, user } = await supabase.auth.signUp({
//     email,
//     password,
//   })
//   if (error) {
//     console.log({ type: 'error', content: error.message })
//   } else {
//     if (user) {
//       console.log('user created')
//       console.log('Check your email for the confirmation link.')
//       console.log(user)
//       CreateProfie(user.id)
//     }
//   }
// }
// const CreateProfie = async (id) => {
//   try {
//     const { data, error } = await supabase
//       .from('profiles')
//       .upsert({
//         id: id,
//         username: username,
//         name: name,
//         updated_at: new Date(),
//         comments: null,
//       })
//       .eq('id', id)
//     console.log(data)
//     router.push('/')
//     if (error) {
//       throw error
//     }
//   } catch (error) {
//     alert(error.message)
//   }
// }
