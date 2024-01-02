/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Title, Text, Container, Button, SimpleGrid } from '@mantine/core'
import { TextInput, Paper } from '@mantine/core'
import { useSession } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

export default function ViaPhone() {
  const router = useRouter()
  const session = useState(useSession())
  const { t } = useTranslation('translations')
  const { t: commonT } = useTranslation('translations')

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  // async function signInWithPhone() {
  //   const fields = {
  //     phone: '+9720548853393',
  //   }
  //   const { error } = await supabase.auth.signInWithOtp({
  //     phone: fields.phone,
  //   })
  //   if (!error) {
  //     CreateNotification(t('signedInSuccessfully'), 'green')
  //   } else {
  //     CreateNotification(t('errorAccured'), 'red')
  //   }
  // }

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
          <form>
            <TextInput
              label={t('phone')}
              defaultValue='+9720548853393'
              placeholder={`${t('enterYour')} ${t('phone')}...`}
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
