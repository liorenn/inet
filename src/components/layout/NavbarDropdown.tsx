import { useState } from 'react'
import { IconMenu2 } from '@tabler/icons'
import { Drawer, ActionIcon, Button, Text } from '@mantine/core'
import Link from 'next/link'

function NavBarDropdown() {
  const [opened, setOpened] = useState(false)

  const Buttons = [
    { title: 'Home', href: '/' },
    { title: 'Airpods', href: '/airpdos' },
    { title: 'Iphone', href: '/iphone' },
    { title: 'Ipad', href: '/ipad' },
    { title: 'Mac', href: '/mac' },
    { title: 'Search', href: '/search' },
    { title: 'Comapre', href: '/compare' },
    { title: 'List', href: '/list' },
  ]

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding='xl'
        title={
          <Text weight={600} size='xl'>
            Pages
          </Text>
        }
        size={280}
        overlayBlur={3}
        withOverlay={true}>
        {Buttons.map((item, index) => (
          <Link href={item.href} key={index}>
            <Button
              onClick={() => setOpened(false)}
              variant='subtle'
              color='gray'
              radius='md'
              size='md'
              fullWidth>
              <Text size='lg' weight={600}>
                {item.title}
              </Text>
            </Button>
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
