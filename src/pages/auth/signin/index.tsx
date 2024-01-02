/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Title,
  Text,
  Container,
  Button,
  SimpleGrid,
  Center,
} from '@mantine/core'
import { TextInput, PasswordInput, Paper } from '@mantine/core'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useForm } from '@mantine/form'
import { trpc } from '../../../misc/trpc'
import { CreateNotification } from '../../../misc/functions'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { usePostHog } from 'posthog-js/react'
import { getSignInFields } from '../../../models/forms'
import { useEffect, useState } from 'react'

type formType = {
  email: string
  password: string
}

export default function SignIn() {
  const router = useRouter()
  const posthog = usePostHog()
  const session = useSession()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation()
  const { t } = useTranslation('translations')

  const { data, isLoading } = trpc.auth.getAccessKey.useQuery({
    email: session?.user.email,
  })
  useEffect(() => {
    data && data >= 1 && router.push('/')
  }, [data, router])

  const { defaultValues, validators } = getSignInFields()
  const form = useForm<formType>({
    initialValues: defaultValues,
    validateInputOnChange: true,
    validate: validators,
  })

  function signIn(values: formType) {
    setLoading(true)
    IsUserExistsMutation.mutate(
      { email: values.email, password: values.password },
      {
        async onSuccess(data) {
          if (data.email) {
            const { data: user } = await supabase.auth.signInWithPassword({
              email: values.email,
              password: values.password,
            })
            if (user.user) {
              CreateNotification(t('signedInSuccessfully'), 'green')
              posthog.capture('User Signed In', { data: values })
              router.push('/')
              setLoading(false)
            } else {
              setLoading(false)
              CreateNotification(t('errorAccured'), 'red')
            }
          } else {
            setLoading(false)
            CreateNotification(t('userDoesNotExist'), 'red')
          }
        },
      }
    )
  }

  if (session || isLoading) {
    return <Center>{t('accessDeniedMessageSignOut')}</Center>
  }

  return (
    <>
      <Head>
        <title>{t('signIn')}</title>
      </Head>
      <Container size={420} my={40}>
        <Title align='center'>{t('welcomeBack')}</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          {t('dontHaveAnAccount')}{' '}
          <Link href='/auth/signup'>{t('createAnAccount')}</Link>
        </Text>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          Forgot Your Password?{' '}
          <Link href='/auth/resetPassword'>Reset Password</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={form.onSubmit((values) => signIn(values))}>
            <TextInput
              label={t('email')}
              placeholder={`${t('enterYour')} ${t('email')}...`}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label={t('password')}
              placeholder={`${t('enterYour')} ${t('password')}...`}
              {...form.getInputProps('password')}
            />
            <Button
              fullWidth
              disabled={loading}
              color='gray'
              variant='light'
              mt='xl'
              type='submit'>
              {loading ? t('loading') : t('signIn')}
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
        </Paper>
      </Container>
    </>
  )
}
