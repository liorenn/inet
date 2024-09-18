import { Button, PasswordInput, Stack, Text, Title } from '@mantine/core'
import { Paper, TextInput } from '@mantine/core'
import { SignUpFormType, getValidators, signUpConfig } from '@/models/formValidation'

import Link from 'next/link'
import UnAuthPage from '@/components/pages/UnAuthPage'
import { api } from '@/lib/trpc'
import { createNotification } from '@/lib/utils'
import { useForm } from '@mantine/form'
import { usePostHog } from 'posthog-js/react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

export default function SignUp() {
  const {
    settings: { validateInputOnChange }
  } = useSiteSettings()
  const posthog = usePostHog()
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
          createNotification('Error Couldnt Create Account', 'red') // Create an error notification
        },
        onSuccess(data) {
          if (data.error === false) {
            createNotification(t('accountCreatedSuccessfully'), 'green') // Create a success notification
            posthog.capture('User Signed Up', { data }) // Capture the user signed up
            setLoading(false) // Set loading to false
          } else {
            // If there is an error
            createNotification('Error Couldnt Create Account', 'red') // Create a errpr notification
          }
        }
      }
    )
    setLoading(false) // Set loading to false
  }

  return (
    <UnAuthPage title={t('signUp')} container={420}>
      <Stack my={40}>
        <Title align='center'>{t('createAnAccount')}</Title>
        <Text color='dimmed' size='sm' align='center' mt={5}>
          {t('alreadyHaveAnAccount')}
          <br />
          <Link href='/signIn'>{t('signInYourAccount')}</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={form.onSubmit((values) => signUp(values))}>
            {signUpConfig.fields.map((field, index) => {
              const Input = field.name === 'password' ? PasswordInput : TextInput
              return (
                <Input
                  key={index}
                  label={t(field.name)}
                  placeholder={`${t('enterYour')} ${t(field.name)}...`}
                  {...form.getInputProps(field.name)}
                />
              )
            })}
            <Button fullWidth disabled={loading} color='gray' variant='light' mt='xl' type='submit'>
              {loading ? t('loading') : t('createAccount')}
            </Button>
          </form>
        </Paper>
      </Stack>
    </UnAuthPage>
  )
}
