import { Button, Stack, Text, Title } from '@mantine/core'
import { Paper, PasswordInput, TextInput } from '@mantine/core'
import { SignInFormType, getValidators, signInConfig } from '@/models/formValidation'

import Link from 'next/link'
import UnAuthPage from '@/components/pages/UnAuthPage'
import { api } from '@/lib/trpc'
import { createNotification } from '@/lib/utils'
import { useForm } from '@mantine/form'
import { usePostHog } from 'posthog-js/react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

export default function SignIn() {
  const posthog = usePostHog() // Get the posthog
  const {
    settings: { validateInputOnChange }
  } = useSiteSettings()
  const { mutate: signIn } = api.auth.signIn.useMutation()
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
          createNotification(t('errorAccured'), 'red') // Create a error notification
        },
        onSuccess(data) {
          if (data.error === false) {
            createNotification(t('signedInSuccessfully'), 'green') // Create a success notification
            posthog.capture('User Signed In', { data: values }) // Capture the user signed in
            setLoading(false) // Set loading to false
          } else {
            setLoading(false) // Set loading to false
            createNotification(t('userDoesNotExist'), 'red') // Create a error notification
          }
        }
      }
    )
  }

  return (
    <UnAuthPage title={t('signIn')} container={420}>
      <Stack my={40}>
        <Title align='center'>{t('welcomeBack')}</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          {t('dontHaveAnAccount')} <Link href='/signUp'>{t('createAnAccount')}</Link>
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
      </Stack>
    </UnAuthPage>
  )
}
