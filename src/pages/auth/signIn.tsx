import { Button, Center, Container, Text, Title } from '@mantine/core'
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
import { useSiteSettings } from '@/hooks/useSiteSettings'
import useTranslation from 'next-translate/useTranslation'

// The sign in form properties type
type SignInFormType = {
  email: string
  password: string
}

export default function SignIn() {
  const router = useRouter() // Get the router
  const posthog = usePostHog() // Get the posthog
  const session = useSession() // Get the session
  const {
    settings: { validateInputOnChange },
  } = useSiteSettings()
  const supabase = useSupabaseClient() // Get the supabase client
  const { t } = useTranslation('main') // Get the translation function
  const formProperties = new SignInForm() // Get the form properties
  const [loading, setLoading] = useState(false) // State for loading
  const IsUserExistsMutation = trpc.auth.IsSignInUserExists.useMutation() // Get the IsUserExists mutation
  const accessKeyQuery = trpc.auth.getAccessKey.useQuery({
    email: session?.user?.email,
  }) // Get the access key for the user

  // When access key changes
  useEffect(() => {
    accessKeyQuery.data && accessKeyQuery.data >= 1 && router.push('/') // Check if the data exists and redirect to home
  }, [accessKeyQuery, router])

  // Create the form with the properties
  const form = useForm<SignInFormType>({
    initialValues: formProperties.getDefaultValues() as FormDefaultValues,
    validateInputOnChange,
    validate: formProperties.getValidators(),
  })

  function signIn(values: SignInFormType) {
    setLoading(true) // Set loading to true
    // Check if the user exists in the database
    IsUserExistsMutation.mutate(
      { email: values.email, password: values.password },
      {
        // On operation success
        async onSuccess(data) {
          // If user exists in database
          if (data) {
            // Sign in the user
            const { data: user } = await supabase.auth.signInWithPassword({
              email: values.email,
              password: values.password,
            })
            // If there is no error
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

  // If user is connected
  if (session || accessKeyQuery.isLoading) {
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
        </Paper>
      </Container>
    </>
  )
}
