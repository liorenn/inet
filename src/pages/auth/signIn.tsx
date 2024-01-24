import { Button, Center, Container, SimpleGrid, Text, Title } from '@mantine/core'
import { FormDefaultValues, SignInForm } from '@/models/forms'
import { Paper, PasswordInput, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import { CreateNotification } from '@/utils/utils'
import Head from 'next/head'
import Link from 'next/link'
import { trpc } from '@/utils/client'
import { useForm } from '@mantine/form'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { validateInputOnChange } from 'config'

type formType = {
  email: string
  password: string
}

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
export default function SignIn() {
  const router = useRouter() // Get the router
  const posthog = usePostHog() // Get the posthog
  const session = useSession() // Get the session
  const supabase = useSupabaseClient() // Get the supabase
  const formProperties = new SignInForm() // Get the form properties
  const [loading, setLoading] = useState(false) // State for loading
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation() // Get the IsUserExists mutation
  const { t } = useTranslation('translations') // Get the translation function
  const { data, isLoading } = trpc.auth.getAccessKey.useQuery({
    email: session?.user.email,
  }) // Get the access key for the user
  useEffect(() => {
    data && data >= 1 && router.push('/') // Check if the data exists and redirect to home
  }, [data, router])

  const form = useForm<formType>({
    initialValues: formProperties.getDefaultValues() as FormDefaultValues,
    validateInputOnChange,
    validate: formProperties.getValidators(),
  })

  function signIn(values: formType) {
    setLoading(true) // Set loading to true
    IsUserExistsMutation.mutate(
      // Check if the user exists in the database
      { email: values.email, password: values.password },
      {
        async onSuccess(data) {
          if (data.email) {
            const { data: user } = await supabase.auth.signInWithPassword({
              email: values.email,
              password: values.password,
            }) // Sign in the user
            if (user.user) {
              CreateNotification(t('signedInSuccessfully'), 'green') // Create a success notification
              posthog.capture('User Signed In', { data: values }) // Capture the user signed in
              router.push('/') // Redirect to home
              setLoading(false) // Set loading to false
            } else {
              setLoading(false) // Set loading to false
              CreateNotification(t('errorAccured'), 'red') // Create a error notification
            }
          } else {
            setLoading(false) // Set loading to false
            CreateNotification(t('userDoesNotExist'), 'red') // Create a error notification
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
          {t('dontHaveAnAccount')} <Link href='/auth/signUp'>{t('createAnAccount')}</Link>
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
            <Button fullWidth disabled={loading} color='gray' variant='light' mt='xl' type='submit'>
              {loading ? t('loading') : t('signIn')}
            </Button>
          </form>
          <SimpleGrid cols={2}>
            <Link href={'/auth/signin/viaemail'} style={{ textDecoration: 'none' }}>
              <Button color='gray' variant='light' fullWidth mt='lg'>
                {t('viaEmail')}
              </Button>
            </Link>
            <Link href={'/auth/signin/viaphone'} style={{ textDecoration: 'none' }}>
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
