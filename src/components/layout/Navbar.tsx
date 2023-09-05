import { IconSun, IconMoon, IconDevices, IconLanguage } from '@tabler/icons'
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
import { CreateNotification } from '../../utils/functions'
import { trpc } from '../../utils/trpc'
import { usePublicUrl } from '../../utils/usePublicUrl'
import { DEFlag, ILFlag, GBFlag } from 'mantine-flagpack'
import { languagesType, useLanguageStore } from '../../utils/languageStore'

export const Navbar = () => {
  const { classes } = useStyles()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const supabase = useSupabaseClient()
  const user = useUser()
  const [session, setSession] = useState(useSession())
  // const publicUrl = usePublicUrl((state) => state.publicUrl)
  // const change = usePublicUrl((state) => state.change)
  // const { data: PublicUrl } = trpc.auth.GetPublicUrl.useQuery({
  //   userId: user?.id,
  // })
  const { language, setLanguage } = useLanguageStore()
  useEffect(() => {
    setLanguage((localStorage.getItem('language') as languagesType) ?? 'en')
    supabase.auth.onAuthStateChange((e, session) => {
      setSession(session)
    })
  }, [])

  // useEffect(() => {
  //   if (PublicUrl) {
  //     change(PublicUrl)
  //   }
  // }, [PublicUrl])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      CreateNotification('Signed Out Successfully', 'green')
    }
  }

  return (
    <Header height={65} className={classes.root} mb={20}>
      <Container className={classes.inner} fluid>
        <Group>
          <div className={classes.dropdown}>{/* <NavBarDropdown /> */}</div>
          <Link href={'/'}>
            <Button variant='subtle' color={'gray.' + (dark ? '1' : '9')}>
              <Group spacing='xs'>
                <Text style={{ fontSize: '30px', fontWeight: 500 }} mb='xs'>
                  Inet
                </Text>
                <IconDevices height={30} width={30} />
              </Group>
            </Button>
          </Link>
        </Group>
        <Group spacing={5} className={classes.buttons}>
          {/* <NavBarButtons /> */}
          <Link href={'/compare'}>
            <Button
              variant='light'
              color='gray'
              radius='md'
              className={classes.end}>
              Compare Devices
            </Button>
          </Link>
          <Link href={'/device'}>
            <Button
              variant='light'
              color='gray'
              radius='md'
              className={classes.end}>
              All Devices
            </Button>
          </Link>
          {session && (
            <Link href={'/list'}>
              <Button
                variant='light'
                color='gray'
                radius='md'
                className={classes.end}>
                List
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
                  Sign In
                </Button>
              </Link>
              <Link href={'/auth/signup'}>
                <Button
                  variant='light'
                  color='gray'
                  radius='md'
                  className={classes.end}>
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant='light'
                color='gray'
                radius='md'
                className={classes.end}
                onClick={() => signOut()}>
                Sign Out
              </Button>
              <Link href={'/auth/account'}>
                {/* <Avatar src={publicUrl} radius='md' /> */}
                <Avatar radius='md' />
              </Link>
            </>
          )}
          <Menu shadow='md' width={140} offset={14}>
            <Menu.Target>
              <ActionIcon
                variant='light'
                radius='md'
                size='lg'
                color='gray'
                onClick={() => {}}
                title='Change Language'>
                <IconLanguage size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sprachen</Menu.Label>
              <Menu.Item
                icon={<GBFlag w={38} />}
                onClick={() => setLanguage('en')}>
                <Text weight={700}>english</Text>
              </Menu.Item>
              <Menu.Item
                icon={<DEFlag w={38} />}
                onClick={() => setLanguage('de')}>
                <Text weight={700}>Deutsch</Text>
              </Menu.Item>{' '}
              <Menu.Item
                icon={<ILFlag w={38} />}
                onClick={() => setLanguage('he')}>
                <Text weight={700}>עברית</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ActionIcon
            variant='light'
            radius='md'
            size='lg'
            color='gray'
            onClick={() => toggleColorScheme()}
            title='Toggle color scheme'>
            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
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

// async function getAvatarUrl() {
//   if (user) {
//     const { data } = await supabase
//       .from('profiles')
//       .select('avatar_url')
//       .eq('id', user?.id)

//     const img_name = data[0].avatar_url

//     const { signedURL, error } = await supabase.storage
//       .from('avatars')
//       .createSignedUrl(img_name, 60 * 60 * 24 * 60)

//     setAvatarUrl(signedURL)
//   }
// }

// const handleSignOut = async (e) => {
//   let { error } = await supabase.auth.signOut()
//   if (error) {
//     console.log(error)
//   } else {
//     console.log('user disconnected')
//   }
// }
