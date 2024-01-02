import { useState } from 'react'
import { IconMenu2 } from '@tabler/icons'
import { Drawer, ActionIcon, Text, createStyles, rem } from '@mantine/core'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { CreateNotification } from '../../misc/functions'

type props = { AccessKey: number | undefined }

function NavBarDropdown({ AccessKey }: props) {
  const { t } = useTranslation('translations')
  const [activeLink, setActiveLink] = useState('Settings')
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()
  const session = useSession()
  const supabase = useSupabaseClient()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      CreateNotification(t('signedOutSuccessfully'), 'green')
    }
  }

  const Buttons = [
    { title: t('home'), href: '/' },
    { title: t('allDevices'), href: '/device' },
    { title: t('compare'), href: '/compare' },
    { title: t('favorites'), href: '/favorites' },
  ]

  if (session) {
    Buttons.push({ title: t('account'), href: '/auth/account' })
    if (AccessKey && AccessKey >= 5) {
      Buttons.push({ title: t('admin'), href: '/auth/admin' })
    }
    Buttons.push({ title: t('signOut'), href: '/' })
  } else {
    Buttons.push({ title: t('signIn'), href: '/auth/signin' })
    Buttons.push({ title: t('signUp'), href: '/auth/signup' })
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding='xl'
        title={
          <Text weight={600} mt={32} size='xl'>
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
              setActiveLink(link.title)
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
