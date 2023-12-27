import {
  IconSun,
  IconMoon,
  IconLanguage,
  IconCurrencyDollar,
  IconSearch,
} from '@tabler/icons'
import { createStyles, Container, Avatar, Menu } from '@mantine/core'
import { Header, Group, Button, Text } from '@mantine/core'
import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link'
import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { CreateNotification, encodeEmail } from '../../misc/functions'
import { DEFlag, ILFlag, GBFlag } from 'mantine-flagpack'
import { languages, useLanguage } from '../../hooks/useLanguage'
import setLanguage from 'next-translate/setLanguage'
import useTranslation from 'next-translate/useTranslation'
import NavBarDropdown from './NavbarDropdown'
import { trpc } from '../../misc/trpc'
import { currencies, useCurrency } from '../../hooks/useCurrency'
import { usePostHog } from 'posthog-js/react'
import { adminAccessKey } from '../../../config'
import useAutoTrigger from '../../hooks/useAutoTrigger'
import { useProfilePicture } from '../../hooks/useProfilePicture'
import { useSpotlight } from '@mantine/spotlight'

export const Navbar = () => {
  useAutoTrigger()
  const user = useUser()
  const posthog = usePostHog()
  const { classes } = useStyles()
  const { lang } = useTranslation()
  const { t } = useTranslation('translations')
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { imagePath, imageExists, setImageExists, setImagePath } =
    useProfilePicture()
  const { mutate } = trpc.device.isImageExists.useMutation()
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
      languages.find(
        (lang) => lang.value === localStorage.getItem('language')
      ) ?? languages[0]
    )
    setLanguage(localStorage.getItem('language') ?? 'en')
    setCurrency(
      currencies.find(
        (Currency) => Currency.value === localStorage.getItem('currency')
      ) ?? currencies[0]
    )
    supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (user?.email) {
      mutate(
        { email: user?.email },
        {
          onSuccess(data, params) {
            if (data) {
              setImageExists(true)
              setImagePath(`../users/${encodeEmail(params.email)}.png`)
            }
          },
        }
      )
    }
  }, [user, imageExists, imagePath])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      CreateNotification(t('signedOutSuccessfully'), 'green')
      posthog.capture('User Signed Out', { user })
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
        </Group>
        <Group spacing={5} className={classes.buttons}>
          <Link href={'/compare'}>
            <Button
              variant='light'
              color='gray'
              radius='md'
              className={classes.end}>
              {t('compare')}
            </Button>
          </Link>
          <Link href={'/device'}>
            <Button
              variant='light'
              color='gray'
              radius='md'
              className={classes.end}>
              {t('allDevices')}
            </Button>
          </Link>
          {session && (
            <Link href={'/favorites'}>
              <Button
                variant='light'
                color='gray'
                radius='md'
                className={classes.end}>
                {t('favorites')}
              </Button>
            </Link>
          )}
        </Group>
        <Group>
          {!session ? (
            <>
              <Link href={'/auth/signin'}>
                <Button
                  variant='light'
                  color='gray'
                  radius='md'
                  className={classes.end}>
                  {t('signIn')}
                </Button>
              </Link>
              <Link href={'/auth/signup'}>
                <Button
                  variant='light'
                  color='gray'
                  radius='md'
                  className={classes.end}>
                  {t('signUp')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              {AccessKey && AccessKey >= adminAccessKey && (
                <Link href={'/auth/admin'}>
                  <Button
                    variant='light'
                    color='gray'
                    radius='md'
                    className={classes.end}>
                    {t('admin')}
                  </Button>
                </Link>
              )}

              <Button
                variant='light'
                color='gray'
                radius='md'
                className={classes.end}
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
                    background:
                      currency?.value === Currency.value ? '#1c1c1c' : '',
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
            {colorScheme === 'dark' ? (
              <IconSun size={18} />
            ) : (
              <IconMoon size={18} />
            )}
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
