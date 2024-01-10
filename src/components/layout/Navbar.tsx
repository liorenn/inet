import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { Avatar, Container, Menu, createStyles } from '@mantine/core'
import { Button, Group, Header, Text } from '@mantine/core'
import { CreateNotification, encodeEmail } from '@/utils/utils'
import { DEFlag, GBFlag, ILFlag } from 'mantine-flagpack'
import { IconCurrencyDollar, IconLanguage, IconMoon, IconSearch, IconSun } from '@tabler/icons'
import { adminAccessKey, websiteUrl } from 'config'
import { currencies, useCurrency } from '@/hooks/useCurrency'
import { languages, useLanguage } from '@/hooks/useLanguage'
import { useEffect, useState } from 'react'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

import Link from 'next/link'
import NavBarDropdown from '@/components/layout/NavbarDropdown'
import setLanguage from 'next-translate/setLanguage'
import { trpc } from '@/server/client'
import useAutoTrigger from '@/hooks/useAutoTrigger'
import { usePostHog } from 'posthog-js/react'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import { useSpotlight } from '@mantine/spotlight'
import useTranslation from 'next-translate/useTranslation'

export default function Navbar() {
  useAutoTrigger()
  const user = useUser()
  const posthog = usePostHog()
  const { classes } = useStyles()
  const { lang } = useTranslation()
  const { t } = useTranslation('translations')
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { imagePath, imageExists, setImageExists, setImagePath } = useProfilePicture()
  const { mutate: isImageExists } = trpc.auth.isImageExists.useMutation()
  const supabase = useSupabaseClient()
  const spotlight = useSpotlight()
  const [session, setSession] = useState(useSession())
  const { currency, setCurrency } = useCurrency()
  const { setLanguage: setlanguageStore } = useLanguage()
  const { data: AccessKey } = trpc.auth.getAccessKey.useQuery({
    email: user?.email,
  })

  useEffect(() => {
    setlanguageStore(
      languages.find((lang) => lang.value === localStorage.getItem('language')) ?? languages[0]
    )
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setLanguage(localStorage.getItem('language') ?? 'en')
    setCurrency(
      currencies.find((Currency) => Currency.value === localStorage.getItem('currency')) ??
        currencies[0]
    )
    supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user?.email) {
      isImageExists(
        { email: user?.email },
        {
          onSuccess(data, params) {
            if (data === true) {
              setImageExists(true)
              setImagePath(`${websiteUrl}/users/${encodeEmail(params.email)}.png`)
            }
          },
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      CreateNotification(t('signedOutSuccessfully'), 'green')
      posthog.capture('User Signed Out', { user })
      setTimeout(() => {
        setImageExists(false)
        setImagePath('')
      }, 500)
    }
  }

  return (
    <Header height={65} className={classes.root} mb={20}>
      <Container className={classes.inner} fluid>
        <Group>
          <div className={classes.dropdown}>
            <NavBarDropdown AccessKey={AccessKey} />
          </div>
          <Link
            className={classes.end}
            style={{
              textDecoration: 'none',
              fontSize: '22px',
              fontWeight: 500,
              color: colorScheme === 'dark' ? '#c1c2c5' : '#a3a8ae',
            }}
            href={'/'}>
            {t('inet')}
          </Link>
          {/* <button onClick={() => signOut()}>click me</button> */}
        </Group>
        <Group spacing={5} className={classes.buttons}>
          <Link href={'/device/compare'}>
            <Button variant='light' color='gray' radius='md' className={classes.end}>
              {t('compare')}
            </Button>
          </Link>
          <Link href={'/device/find'}>
            <Button variant='light' color='gray' radius='md' className={classes.end}>
              {t('find')}
            </Button>
          </Link>
          <Link href={'/device'}>
            <Button variant='light' color='gray' radius='md' className={classes.end}>
              {t('allDevices')}
            </Button>
          </Link>
          {session && (
            <Link href={'/device/favorites'}>
              <Button variant='light' color='gray' radius='md' className={classes.end}>
                {t('favorites')}
              </Button>
            </Link>
          )}
        </Group>
        <Group>
          {!session ? (
            <>
              <Link href={'/auth/signIn'}>
                <Button variant='light' color='gray' radius='md' className={classes.end}>
                  {t('signIn')}
                </Button>
              </Link>
              <Link href={'/auth/signUp'}>
                <Button variant='light' color='gray' radius='md' className={classes.end}>
                  {t('signUp')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              {AccessKey !== undefined && AccessKey >= adminAccessKey && (
                <Link href={'/auth/admin'}>
                  <Button variant='light' color='gray' radius='md' className={classes.end}>
                    {t('admin')}
                  </Button>
                </Link>
              )}
              <Button
                variant='light'
                color='gray'
                radius='md'
                className={classes.end}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => signOut()}>
                {t('signOut')}
              </Button>
              {user?.email && (
                <Link href={'/auth/account'}>
                  <Avatar src={imageExists ? imagePath : ''} radius='md' />
                </Link>
              )}
            </>
          )}
          <ActionIcon
            variant='light'
            radius='md'
            size='lg'
            color='gray'
            onClick={() => spotlight.openSpotlight()}
            title={t('searchDevice')}>
            <IconSearch size={18} />
          </ActionIcon>
          <Menu shadow='md' width={140} offset={14}>
            <Menu.Target>
              <ActionIcon
                variant='light'
                radius='md'
                size='lg'
                color='gray'
                title={t('changeLanguage')}>
                <IconCurrencyDollar size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{t('currencies')}</Menu.Label>
              {currencies.map((Currency) => (
                <Menu.Item
                  key={Currency.value}
                  mt={6}
                  style={{
                    background: currency?.value === Currency.value ? '#1c1c1c' : '',
                  }}
                  icon={Currency.icon({})}
                  onClick={() => {
                    setCurrency(Currency)
                  }}>
                  <Text weight={700}>{Currency.name}</Text>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Menu shadow='md' width={140} offset={14}>
            <Menu.Target>
              <ActionIcon
                variant='light'
                radius='md'
                size='lg'
                color='gray'
                title={t('changeLanguage')}>
                <IconLanguage size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{t('languages')}</Menu.Label>
              {languages.map((language) => (
                <Menu.Item
                  key={language.value}
                  mt={6}
                  style={{
                    background: lang === language.value ? '#1c1c1c' : '',
                  }}
                  icon={
                    language.value === 'en' ? (
                      <GBFlag w={38} />
                    ) : language.value === 'de' ? (
                      <DEFlag w={38} />
                    ) : (
                      language.value === 'he' && <ILFlag w={38} />
                    )
                  }
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    setLanguage(language.value)
                    setlanguageStore(language)
                  }}>
                  <Text weight={700}>{language.name}</Text>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <ActionIcon
            variant='light'
            radius='md'
            size='lg'
            color='gray'
            onClick={() => toggleColorScheme()}
            title={t('toggleColorScheme')}>
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Group>
      </Container>
    </Header>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  inner: {
    height: 65,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },

  dropdown: {
    [theme.fn.largerThan('lg')]: {
      display: 'none',
    },
  },

  buttons: {
    //prev lg, current sm
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  end: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}))
