import Link from 'next/link'
import { Title, Text, Container, Button, Center } from '@mantine/core'
import { TextInput, Paper } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { trpc } from '../../misc/trpc'
import { CreateNotification } from '../../misc/functions'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { usePostHog } from 'posthog-js/react'
import { User } from '@prisma/client'
import { getSignUpFields } from '../../models/forms'
import { useEffect, useState } from 'react'

export type formType = {
  [K in keyof Omit<User, 'accessKey'>]: string
}

export default function SignUp() {
  const router = useRouter()
  const session = useSession()
  const posthog = usePostHog()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const IsUserExistsMutation = trpc.auth.IsUserExists.useMutation()
  const { mutate } = trpc.auth.createUser.useMutation()
  const { t } = useTranslation('translations')

  const { data, isLoading } = trpc.auth.getAccessKey.useQuery({
    email: session?.user.email,
  })
  useEffect(() => {
    data && data >= 1 && router.push('/')
  }, [data, router])

  const { defaultValues, fields, validators } = getSignUpFields()
  const form = useForm<formType>({
    initialValues: defaultValues,
    validateInputOnChange: true,
    validate: validators,
  })

  function signUp(fields: formType) {
    setLoading(true)
    IsUserExistsMutation.mutate(
      {
        email: fields.email,
        password: fields.password,
        username: fields.username,
      },
      {
        onSuccess(data) {
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
            mutate(
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
                  })
                  if (!error) {
                    CreateNotification(t('accountCreatedSuccessfully'), 'green')
                    posthog.capture('User Signed Up', { data })
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push('/')
                    setLoading(false)
                  } else {
                    CreateNotification('Error Couldnt Create Account', 'red')
                  }
                },
              }
            )
          }
          setLoading(false)
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
          <Link href='/auth/`signin'>{t('signInYourAccount')}</Link>
        </Text>
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form onSubmit={form.onSubmit((values) => signUp(values))}>
            {fields.map((field, index) => (
              <TextInput
                key={index}
                label={t(field.name)}
                placeholder={`${t('enterYour')} ${t(field.name)}...`}
                {...form.getInputProps(field.name)}
              />
            ))}
            <Button
              fullWidth
              disabled={loading}
              color='gray'
              variant='light'
              mt='xl'
              type='submit'>
              {loading ? t('loading') : t('createAccount')}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  )
}
