import Link from 'next/link'
import { useEffect } from 'react'
import { Title, Text, Container, Button } from '@mantine/core'
import { TextInput, PasswordInput, Paper } from '@mantine/core'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { trpc } from '../../misc/trpc'
import { CreateNotification } from '../../misc/functions'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { usePostHog } from 'posthog-js/react'

type Inputs = {
  username: string
  name: string
  email: string
  password: string
  phone: string
}

export default function SignUp() {
  const router = useRouter()
  const session = useSession()
  const posthog = usePostHog()
  const supabase = useSupabaseClient()
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation()
  const CreateUserMutation = trpc.auth.CreateUser.useMutation()
  const { t } = useTranslation('auth')
  const { t: commonT } = useTranslation('common')

  useEffect(() => {
    if (session) {
      router.push('/').catch((error) => {
        console.error('Navigation error:', error)
      })
    }
  }, [session, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

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
            CreateNotification(t('emailExistMessage'), 'red')
          }
          if (!IsExist?.email && IsExist?.username) {
            CreateNotification(t('usernameExistMessage'), 'red')
          }
          if (IsExist?.email && IsExist?.username) {
            CreateNotification(t('usernameAndEmailExistMessage'), 'red')
          }
          if (!IsExist?.email && !IsExist?.username) {
            //if user doesnt exist create new user and saves data in user table
            const { data, error } = await supabase.auth.signUp({
              phone: fields.phone,
              email: fields.email,
              password: fields.password,
            })
            if (!error) {
              CreateNotification(t('accountCreatedSuccessfully'), 'green')
              posthog.capture('User Signed Up', { data })
              if (data.user?.id !== undefined) {
                CreateUserMutation.mutate({
                  id: data.user?.id,
                  email: fields.email,
                  phone: fields.phone,
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

  if (session) {
    return <>{t('accessDeniedMessageSignOut')}</>
  }

  return (
    <>
      <Head>
        <title>{commonT('signUp')}</title>
      </Head>
      <Container size={420} my={40}>
        <Title align='center'>{t('createAnAccount')}</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          {t('alreadyHaveAnAccount')}
          <br />
          <Link href='/auth/`signin'>{t('signInYourAccount')}</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label={t('username')}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('username'),
              })}
              defaultValue='lioren'
              error={errors.username && t('wrongPattern')}
              {...register('username', {
                required: true,
                pattern: /^[A-Za-z\d_.]{5,}$/,
              })}
            />
            <TextInput
              label={t('name')}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('name'),
              })}
              defaultValue='Lior Oren'
              error={errors.name && t('wrongPattern')}
              {...register('name', {
                required: true,
                pattern: /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/,
              })}
            />
            <TextInput
              label={t('email')}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('email'),
              })}
              defaultValue='lior.oren06@gmail.com'
              error={errors.email && t('wrongPattern')}
              {...register('email', {
                required: true,
                pattern: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
              })}
            />
            <TextInput
              label={t('phone')}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('phone'),
              })}
              defaultValue='+9720548853393'
              error={errors.phone && t('wrongPattern')}
              {...register('phone', {
                required: true,
                pattern: /^0\d{1,2}-?\d{7}$/,
              })}
            />
            <PasswordInput
              label={t('password')}
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('password'),
              })}
              defaultValue='123456'
              error={errors.password && t('wrongPattern')}
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
              {t('createAccount')}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  )
}
