import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Title, Text, Container, Button, SimpleGrid } from '@mantine/core'
import { TextInput, Paper } from '@mantine/core'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { CreateNotification } from '../../../misc/functions'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

type Inputs = {
  phone: string
}

export default function ViaPhone() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [session, setSession] = useState(useSession())
  const { t } = useTranslation('translations')
  const { t: commonT } = useTranslation('translations')

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({})

  supabase.auth.onAuthStateChange((_e, session) => {
    if (session) {
      setSession(session)
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (fields) => {
    //when form is submitted and passed validation
    const { error } = await supabase.auth.signInWithOtp({
      phone: fields.phone,
    })
    if (!error) {
      CreateNotification(t('signedInSuccessfully'), 'green')
    } else {
      CreateNotification(t('errorAccured'), 'red')
      reset()
    }
  }

  if (session) {
    return <>{t('accessDeniedMessageSignOut')}</>
  }

  return (
    <>
      <Head>
        <title>{t('signInByPhone')}</title>
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
              label={t('phone')}
              defaultValue='+9720548853393'
              placeholder={t('placeholders.inputPlaceholder', {
                input: t('phone'),
              })}
              error={errors.phone && t('wrongPattern')}
              {...register('phone', {
                required: true,
                pattern: /^\+\d{13}$/,
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
              href={'/auth/signin/viaemail'}
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
