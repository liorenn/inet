import { useState } from 'react'
import { IconMenu2 } from '@tabler/icons'
import { Drawer, ActionIcon, Text, createStyles, rem } from '@mantine/core'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { CreateNotification } from '../../utils/functions'

function NavBarDropdown() {
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()
  const [activeLink] = useState('Settings')
  const { t } = useTranslation('common')
  const { t: authT } = useTranslation('auth')
  const session = useSession()
  const supabase = useSupabaseClient()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      CreateNotification(authT('signedOutSuccessfully'), 'green')
    }
  }

  const authButtons = session
    ? [
        { title: authT('account'), href: '/auth/account' },
        { title: t('signOut'), href: '/' },
      ]
    : [
        { title: t('signIn'), href: '/auth/signin' },
        { title: t('signUp'), href: '/auth/signup' },
      ]
  const Buttons = [
    { title: t('home'), href: '/' },
    { title: t('allDevices'), href: '/device' },
    { title: t('compare'), href: '/compare' },
    { title: t('favorites'), href: '/favorites' },
    ...authButtons,
  ]

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding='xl'
        title={
          <Text weight={600} size='xl'>
            {t('pages')}
          </Text>
        }
        size={280}
        withOverlay={true}>
        {Buttons.map((link) => (
          <Link
            className={cx(classes.link, {
              [classes.linkActive]: activeLink === link.href,
            })}
            href={link.href}
            onClick={() => {
              link.title === t('signOut') && signOut()
              setOpened(false)
            }}
            key={link.title}>
            {link.title}
          </Link>
        ))}
      </Drawer>
      <ActionIcon size='xl'>
        <IconMenu2 onClick={() => setOpened(true)} />
      </ActionIcon>
    </>
  )
}

export default NavBarDropdown

const useStyles = createStyles((theme) => ({
  link: {
    boxSizing: 'border-box',
    display: 'block',
    textDecoration: 'none',
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: rem(44),
    lineHeight: rem(44),

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  linkActive: {
    '&, &:hover': {
      borderLeftColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor,
      }).background,
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor,
      }).background,
      color: theme.white,
    },
  },
}))
