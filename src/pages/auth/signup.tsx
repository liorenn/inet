import { Button, Center, Container, Text, Title } from '@mantine/core'
import { Paper, TextInput } from '@mantine/core'
import { SignUpFormType, getValidators, signUpConfig } from '~/src/models/formValidation'

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

export default function SignUp() {
  const router = useRouter() // Get the router
  const {
    settings: { validateInputOnChange }
  } = useSiteSettings()
  const posthog = usePostHog()
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const [loading, setLoading] = useState(false) // State for loading
  const { mutate } = api.auth.signUp.useMutation() // Get the createUser mutation
  const { t } = useTranslation('main') // Get the translation function

  // Create the form with the properties
  const form = useForm<SignUpFormType>({
    initialValues: signUpConfig.defaultValues,
    validateInputOnChange,
    validate: getValidators(signUpConfig.fields)
  })

  //Sign up the user
  function signUp(fields: SignUpFormType) {
    setLoading(true) // Set loading to true
    // Check if the user exists in the database
    mutate(
      {
        email: fields.email,
        password: fields.password,
        name: fields.name,
        phone: fields.phone,
        username: fields.username
      },
      {
        onError() {
          CreateNotification('Error Couldnt Create Account', 'red') // Create an error notification
        },
        onSuccess(data) {
          if (data.error === false) {
            CreateNotification(t('accountCreatedSuccessfully'), 'green') // Create a success notification
            posthog.capture('User Signed Up', { data }) // Capture the user signed up
            router.push('/') // Redirect to home
            setLoading(false) // Set loading to false
          } else {
            // If there is an error
            CreateNotification('Error Couldnt Create Account', 'red') // Create a errpr notification
          }
        }
      }
    )
    setLoading(false) // Set loading to false
  }

  // If user is connected
  if (user) {
    return <Center>{t('accessDeniedMessageSignOut')}</Center>
  }

  return (
    <>
      <Head>
        <title>{t('signUp')}</title>
      </Head>
      <Container size={420} my={40}>
        <Title align='center'>{t('createAnAccount')}</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          {t('alreadyHaveAnAccount')}
          <br />
          <Link href='/auth/signIn'>{t('signInYourAccount')}</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={form.onSubmit((values) => signUp(values))}>
            {signUpConfig.fields.map((field, index) => (
              <TextInput
                key={index}
                label={t(field.name)}
                placeholder={`${t('enterYour')} ${t(field.name)}...`}
                {...form.getInputProps(field.name)}
              />
            ))}
            <Button fullWidth disabled={loading} color='gray' variant='light' mt='xl' type='submit'>
              {loading ? t('loading') : t('createAccount')}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  )
}
