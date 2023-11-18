import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Title, Text, Container, Button, SimpleGrid } from '@mantine/core'
import { TextInput, PasswordInput, Paper } from '@mantine/core'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { trpc } from '../../../utils/trpc'
import { CreateNotification } from '../../../utils/functions'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

type Inputs = {
  email: string
  password: string
}

export default function SignIn() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [session, setSession] = useState(useSession())
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation()
  const { t } = useTranslation('auth')
  const { t: commonT } = useTranslation('common')

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({})

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setSession(session)
    }
  })

  const onSubmit: SubmitHandler<Inputs> = (fields) => {
    //when form is submitted and passed validation
    IsUserExistsMutation.mutate(
      {
        email: fields.email,
        password: fields.password,
      },
      {
        async onSuccess(data) {
          if (data) {
            const { error } = await supabase.auth.signInWithPassword({
              email: fields.email,
              password: fields.password,
            })
            if (!error) {
              CreateNotification(t('signedInSuccessfully'), 'green')
              router.push('/')
            } else {
              CreateNotification(t('errorAccured'), 'red')
              reset()
            }
          } else {
            CreateNotification(t('userDoesNotExist'), 'red')
            reset()
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
        <title>{commonT('signIn')}</title>
      </Head>
      <Container size={420} my={40}>
        <Title align='center'>{t('welcomeBack')}</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          {t('dontHaveAnAccount')}{' '}
          <Link href='/auth/signup'>{t('createAnAccount')}</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label={t('email')}
              defaultValue='lior.oren06@gmail.com'
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('email'),
              })}
              error={errors.email && t('wrongPattern')}
              {...register('email', {
                required: true,
                pattern: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
              })}
            />
            <PasswordInput
              label={t('password')}
              defaultValue='123456'
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('password'),
              })}
              error={errors.password && t('wrongPattern')}
              mt='md'
              {...register('password', {
                required: true,
                pattern: /^[A-Za-z\d_.!@#$%^&*]{5,}$/,
              })}
            />
            <Button
              color='gray'
              variant='light'
              fullWidth
              mt='lg'
              type='submit'>
              {commonT('signIn')}
            </Button>
          </form>
          <SimpleGrid cols={2}>
            <Link
              href={'/auth/signin/viaemail'}
              style={{ textDecoration: 'none' }}>
              <Button color='gray' variant='light' fullWidth mt='lg'>
                {t('viaEmail')}
              </Button>
            </Link>
            <Link
              href={'/auth/signin/viaphone'}
              style={{ textDecoration: 'none' }}>
              <Button color='gray' variant='light' fullWidth mt='lg' mb='sm'>
                {t('viaPhone')}
              </Button>
            </Link>
          </SimpleGrid>
          {/* <Link href={'/auth/resetpassword'} style={{ textDecoration: 'none' }}>
            <Text size='sm'>Forgot password?</Text>
          </Link> */}
        </Paper>
      </Container>
    </>
  )
}
