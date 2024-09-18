import { Button, Center, Container, Text, Title } from '@mantine/core'
import { Paper, PasswordInput, TextInput } from '@mantine/core'
import { SignInFormType, getValidators, signInConfig } from '~/src/models/formValidation'

import { CreateNotification } from '@/lib/utils'
import Head from 'next/head'
import Link from 'next/link'
import { api } from '@/lib/trpc'
import { useForm } from '@mantine/form'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

export default function SignIn() {
  const router = useRouter() // Get the router
  const posthog = usePostHog() // Get the posthog
  const {
    settings: { validateInputOnChange }
  } = useSiteSettings()
  const { mutate: signIn } = api.auth.signIn.useMutation()
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const { t } = useTranslation('main') // Get the translation function
  const [loading, setLoading] = useState(false) // State for loading

  // Create the form with the properties
  const form = useForm<SignInFormType>({
    initialValues: signInConfig.defaultValues,
    validateInputOnChange,
    validate: getValidators(signInConfig.fields)
  })

  function handleSubmit(values: SignInFormType) {
    setLoading(true) // Set loading to true
    signIn(
      {
        email: values.email,
        password: values.password
      },
      {
        onError() {
          setLoading(false) // Set loading to false
          CreateNotification(t('errorAccured'), 'red') // Create a error notification
        },
        onSuccess(data) {
          if (data.error === false) {
            CreateNotification(t('signedInSuccessfully'), 'green') // Create a success notification
            posthog.capture('User Signed In', { data: values }) // Capture the user signed in
            setLoading(false) // Set loading to false
            router.push('/') // Redirect to home
          } else {
            setLoading(false) // Set loading to false
            CreateNotification(t('userDoesNotExist'), 'red') // Create a error notification
          }
        }
      }
    )
  }

  // If user is connected
  if (user) {
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
          <form onSubmit={form.onSubmit(handleSubmit)}>
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
