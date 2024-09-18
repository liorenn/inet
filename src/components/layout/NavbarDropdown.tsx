import { ActionIcon, Drawer, Text, createStyles, rem } from '@mantine/core'

import { CreateNotification } from '@/lib/utils'
import { IconMenu2 } from '@tabler/icons'
import Link from 'next/link'
import { api } from '@/lib/trpc'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

export default function NavBarDropdown() {
  const { mutate } = api.auth.signOut.useMutation()
  const { data: user } = api.auth.getUser.useQuery()
  const { classes, cx } = useStyles() // Get the styles
  const [opened, setOpened] = useState(false) // State of is the drawer opened
  const { t } = useTranslation('main') // Get the translation function
  const [activeLink, setActiveLink] = useState('Settings') // The active link

  // Sign out the user
  async function signOut() {
    mutate(undefined, {
      onSuccess(data, variables, context) {
        // If the sign out was successful
        if (!data.error) {
          CreateNotification(t('signedOutSuccessfully'), 'green')
        }
      }
    })
  }

  // The buttons data that should be displayed in the navbar
  const buttons = [
    { title: t('home'), href: '/' },
    { title: t('allDevices'), href: '/device' },
    { title: t('compare'), href: '/device/compare' },
    { title: t('find'), href: '/device/find' }
  ]

  // Add the buttons to the navbar
  if (user) {
    buttons.push({ title: t('favorites'), href: '/device/favorites' })
    buttons.push({ title: t('account'), href: '/auth/account' })
    // If the user has an access key greater than or equal to the admin access key
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      buttons.push({ title: t('admin'), href: '/auth/admin' }) // Add the admin button
    }
    buttons.push({ title: t('signOut'), href: '/' })
  } else {
    buttons.push({ title: t('signIn'), href: '/auth/signIn' })
    buttons.push({ title: t('signUp'), href: '/auth/signUp' })
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
        {buttons.map((link) => (
          <Link
            className={cx(classes.link, {
              [classes.linkActive]: activeLink === link.href
            })}
            href={link.href}
            onClick={() => {
              link.title === t('signOut') && signOut() // If the button is the sign out button
              setActiveLink(link.title) // Set the active link
              setOpened(false) // Close the drawer
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

// Create the styles for the component
const useStyles = createStyles((theme) => ({
  link: {
    boxSizing: 'border-box',
    display: 'block',
    textDecoration: 'none',
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: rem(44),
    lineHeight: rem(44),

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  linkActive: {
    '&, &:hover': {
      borderLeftColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background,
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor
      }).background,
      color: theme.white
    }
  }
}))
