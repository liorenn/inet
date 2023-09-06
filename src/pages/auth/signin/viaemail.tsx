import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Title, Text, Container, Button, SimpleGrid } from '@mantine/core'
import { TextInput, Paper } from '@mantine/core'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CreateNotification } from '../../../utils/functions'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

type Inputs = {
  email: string
}

export default function viaemail() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [session, setSession] = useState(useSession())
  const { t } = useTranslation('auth')
  const { t: commonT } = useTranslation('common')

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({})

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setSession(session)
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (fields) => {
    //when form is submitted and passed validation
    const { data, error } = await supabase.auth.signInWithOtp({
      email: fields.email,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
      },
    })
    if (!error) {
      CreateNotification(t('checkEmail') + ' ' + fields.email, 'yellow')
    } else {
      CreateNotification(t('errorAccured'), 'red')
    }
  }

  if (session) {
    return <>{t('accessDeniedMessageSignOut')}</>
  }

  return (
    <>
      <Head>
        <title>{t('signInByEmail')}</title>
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
            <Link href={'/auth/signin'} style={{ textDecoration: 'none' }}>
              <Button color='gray' variant='light' fullWidth mt='lg'>
                {t('viaCredentials')}
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
