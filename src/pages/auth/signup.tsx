import { Button, Center, Container, Text, Title } from '@mantine/core'
import { FormDefaultValues, SignUpForm } from '@/models/forms'
import { Paper, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import { CreateNotification } from '@/utils/utils'
import Head from 'next/head'
import Link from 'next/link'
import { User } from '@prisma/client'
import { trpc } from '@/utils/client'
import { useForm } from '@mantine/form'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { validateInputOnChange } from 'config'

export type formType = {
  [K in keyof Omit<User, 'accessKey'>]: string
}

export default function SignUp() {
  const router = useRouter() // Get the router
  const posthog = usePostHog() // Get the posthog
  const session = useSession() // Get the session
  const supabase = useSupabaseClient() // Get the supabase
  const formProperties = new SignUpForm() // Get the form properties
  const [loading, setLoading] = useState(false) // State for loading
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation() // Get the IsUserExists mutation
  const { mutate } = trpc.auth.createUser.useMutation() // Get the createUser mutation
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

  function signUp(fields: formType) {
    setLoading(true) // Set loading to true
    IsUserExistsMutation.mutate(
      // Check if the user exists in the database
      {
        email: fields.email,
        password: fields.password,
        username: fields.username,
      },
      {
        onSuccess(data) {
          const IsExist = data // Is user exists in database
          if (IsExist?.email && !IsExist.username) {
            // If email  exist in database and username does not exists
            CreateNotification(t('emailExistMessage'), 'red') // Create a error notification
          }
          if (!IsExist?.email && IsExist?.username) {
            // If email does not exist in database and username exists
            CreateNotification(t('usernameExistMessage'), 'red') // Create a error notification
          }
          if (IsExist?.email && IsExist?.username) {
            // If both email and username exist in database
            CreateNotification(t('usernameAndEmailExistMessage'), 'red') // Create a error notification
          }
          if (!IsExist?.email && !IsExist?.username) {
            // If both email and username does not exist in database
            mutate(
              // Create the user
              {
                email: fields.email,
                phone: fields.phone,
                name: fields.name,
                password: fields.password,
                username: fields.username,
              },
              {
                async onSuccess() {
                  const { data, error } = await supabase.auth.signUp({
                    phone: fields.phone,
                    email: fields.email,
                    password: fields.password,
                  }) // Sign up the user
                  if (!error) {
                    // If there is no error
                    CreateNotification(t('accountCreatedSuccessfully'), 'green') // Create a success notification
                    posthog.capture('User Signed Up', { data })
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push('/') // Redirect to home
                    setLoading(false) // Set loading to false
                  } else {
                    // If there is an error
                    CreateNotification('Error Couldnt Create Account', 'red') // Create a errpr notification
                  }
                },
              }
            )
          }
          setLoading(false) // Set loading to false
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
            {formProperties.getFileds().map((field, index) => (
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
