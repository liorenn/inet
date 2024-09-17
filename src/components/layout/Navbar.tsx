import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { Avatar, Container, Menu, createStyles } from '@mantine/core'
import { Button, Group, Header, Text } from '@mantine/core'
import { CreateNotification, encodeEmail } from '@/utils/utils'
import { DEFlag, ESFlag, FRFlag, GBFlag, ILFlag, ITFlag, RUFlag } from 'mantine-flagpack'
import { IconCurrencyDollar, IconLanguage, IconMoon, IconSearch, IconSun } from '@tabler/icons'
import { currencies, useCurrency } from '@/hooks/useCurrency'
import { languages, useLanguage } from '@/hooks/useLanguage'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import NavBarDropdown from '@/components/layout/NavbarDropdown'
import setLanguage from 'next-translate/setLanguage'
import { trpc } from '@/utils/client'
import { usePostHog } from 'posthog-js/react'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import { useRouter } from 'next/router'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useSpotlight } from '@mantine/spotlight'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

export default function Navbar() {
  const { data: user } = trpc.auth.getUser.useQuery() // Get the user
  const { mutate } = trpc.auth.signOut.useMutation()
  const router = useRouter() // Get the router
  const posthog = usePostHog() // Get the posthog client instance
  const { classes } = useStyles() // Get the styles
  const { width } = useViewportSize() // Get the width of the viewport
  const { t, lang } = useTranslation('main') // Get the translation function and the current language
  const [visitedAdminPage, setVisitedAdminPage] = useState(false) // The visited admin page state
  const { colorScheme, toggleColorScheme } = useMantineColorScheme() // Get the color scheme
  const { imagePath, imageExists, setImageExists, setImagePath } = useProfilePicture() // Get the profile picture state
  const closeEditorMutation = trpc.auth.closeDatabaseEditor.useMutation() // Mutation to close the database editor
  const isImageExistsMutation = trpc.auth.isImageExists.useMutation() // Mutation to check if the profile picture exists
  const spotlight = useSpotlight() // Get the spotlight
  const { currency, setCurrency } = useCurrency() // Get the selected currency
  const { setLanguage: setlanguageStore } = useLanguage() // Get the select language function
  const accessKeyQuery = trpc.auth.getAccessKey.useQuery({
    email: user?.email
  }) // Get the access key query
  const {
    settings: { adminAccessKey, defaultLanguage }
  } = useSiteSettings()

  // When the user changes router
  useEffect(() => {
    // If the user is on the admin page
    if (router.asPath === '/auth/admin') {
      setVisitedAdminPage(true) // Set the visited admin page state to true
    } else if (
      // If the user is not on the admin page and visited the admin page
      accessKeyQuery.data &&
      accessKeyQuery.data >= adminAccessKey &&
      visitedAdminPage &&
      !router.asPath.includes('admin')
    ) {
      closeEditorMutation.mutate() // Close the database editor
    }
  }, [router.asPath])

  // When component mounts
  useEffect(() => {
    // Set the selected language state to the language stored in local storage
    setlanguageStore(
      languages.find((lang) => lang.value === localStorage.getItem('language')) ?? languages[0]
    )
    setLanguage(localStorage.getItem('language') ?? defaultLanguage) // Set the selected language to the language stored in local storage
    // Set the selected currency state to the currency stored in local storage
    setCurrency(
      currencies.find((Currency) => Currency.value === localStorage.getItem('currency')) ??
        currencies[0]
    )
  }, [])

  // When the user state changes
  useEffect(() => {
    // If the user has an email
    if (user?.email) {
      // Check if the profile picture exists
      isImageExistsMutation.mutate(
        { email: user?.email },
        {
          // On operation success
          onSuccess(data, params) {
            // If the profile picture exists
            if (data === true) {
              setImageExists(true) // Set the imageExists state to true
              setImagePath(`${''}/users/${encodeEmail(params.email)}.png`) // Set the imagePath state
            }
          }
        }
      )
    }
  }, [user])

  // Sign out the user
  async function signOut() {
    mutate(undefined, {
      // If the sign out was successful
      onSuccess() {
        CreateNotification(t('signedOutSuccessfully'), 'green') // Create a notification
        posthog.capture('User Signed Out', { user }) // Capture the event in PostHog statistics
        // After half a second
        setTimeout(() => {
          setImageExists(false) // Set the imageExists state to false
          setImagePath('') // Set the imagePath state to an empty string
          router.push('/')
        }, 500)
      }
    }) // Sign out the user
  }

  return (
    <Header height={65} className={classes.root} mb={width < 400 ? 14 : 40}>
      <Container className={classes.inner} fluid>
        <Group>
          <div className={classes.dropdown}>
            <NavBarDropdown AccessKey={accessKeyQuery.data} />
          </div>
          <Link
            className={classes.title}
            style={{
              textDecoration: 'none',
              fontSize: '22px',
              fontWeight: 500,
              color: colorScheme === 'dark' ? '#c1c2c5' : '#a3a8ae'
            }}
            href={'/'}>
            {t('inet')}
          </Link>
        </Group>
        <Group spacing={5} className={classes.buttons}>
          <Link href={'/device'}>
            <Button variant='light' color='gray' radius='md' className={classes.end}>
              {t('allDevices')}
            </Button>
          </Link>
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
          {user && (
            <Link href={'/device/favorites'}>
              <Button variant='light' color='gray' radius='md' className={classes.end}>
                {t('favorites')}
              </Button>
            </Link>
          )}
        </Group>
        <Group>
          {!user ? (
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
              {accessKeyQuery.data !== undefined && accessKeyQuery.data >= adminAccessKey && (
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
                onClick={() => signOut()}>
                {t('signOut')}
              </Button>
              {user?.email && (
                <Link className={classes.actionIcon} href={'/auth/account'}>
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
            title={t('searchDevice')}
            className={classes.actionIcon}>
            <IconSearch size={18} />
          </ActionIcon>
          <Menu shadow='md' width={140} offset={14}>
            <Menu.Target>
              <ActionIcon
                variant='light'
                radius='md'
                size='lg'
                color='gray'
                title={t('changeLanguage')}
                className={classes.actionIcon}>
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
                      currency?.value === Currency.value
                        ? colorScheme === 'dark'
                          ? '#1c1c1c'
                          : '#f2f2f2'
                        : ''
                  }}
                  icon={Currency.icon({})}
                  onClick={() => {
                    setCurrency(Currency) // Set the selected currency
                  }}>
                  <Text weight={700}>{t(Currency.value.toLowerCase())}</Text>
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
                title={t('changeLanguage')}
                className={classes.actionIcon}>
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
                    background:
                      lang === language.value
                        ? colorScheme === 'dark'
                          ? '#1c1c1c'
                          : '#f2f2f2'
                        : ''
                  }}
                  icon={
                    language.value === 'en' ? (
                      <GBFlag w={28} />
                    ) : language.value === 'he' ? (
                      <ILFlag w={28} />
                    ) : language.value === 'ru' ? (
                      <RUFlag w={28} />
                    ) : language.value === 'de' ? (
                      <DEFlag w={28} />
                    ) : language.value === 'fr' ? (
                      <FRFlag w={28} />
                    ) : language.value === 'es' ? (
                      <ESFlag w={28} />
                    ) : (
                      language.value === 'it' && <ITFlag w={28} />
                    )
                  }
                  onClick={() => {
                    setLanguage(language.value) // Set the language
                    setlanguageStore(language) // Set the language in local storage
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
            title={t('toggleColorScheme')}
            className={classes.actionIcon}>
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
    zIndex: 1
  },

  inner: {
    height: 65,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    [theme.fn.smallerThan(450)]: {
      display: 'none'
    }
  },

  dropdown: {
    [theme.fn.largerThan(1200)]: {
      display: 'none'
    }
  },

  buttons: {
    //prev lg, current sm
    [theme.fn.smallerThan(1200)]: {
      display: 'none'
    }
  },

  end: {
    [theme.fn.smallerThan(650)]: {
      display: 'none'
    }
  },

  actionIcon: {
    [theme.fn.smallerThan(370)]: {
      display: 'none'
    }
  }
}))
