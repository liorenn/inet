import { Menu, Button } from '@mantine/core'
import Link from 'next/link'

function NavBarButtons() {
  const Buttons = [
    { title: 'Home', href: '/' },
    { title: 'Search', href: '/search' },
    { title: 'Comapre', href: '/compare' },
    { title: 'List', href: '/list' },
  ]

  const Devices = [
    { title: 'Airpods', href: '/airpods' },
    { title: 'Iphone', href: '/iphone' },
    { title: 'Ipad', href: '/ipad' },
    { title: 'Mac', href: '/mac' },
  ]

  return (
    <>
      {Buttons.map((item, index) => (
        <Link href={item.href}>
          <Button
            variant='subtle'
            color='gray'
            radius='md'
            size='md'
            key={index}>
            {item.title}
          </Button>
        </Link>
      ))}

      <Menu shadow='xl' radius='md' trigger='hover'>
        <Menu.Target>
          <Button variant='subtle' color='gray' radius='md' size='md'>
            Devices
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {Devices.map((item, index) => (
            <Menu.Item key={index}>
              <Link href={item.href}>
                <Button
                  variant='subtle'
                  color='gray'
                  radius='md'
                  size='md'
                  fullWidth>
                  {item.title}
                </Button>
              </Link>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </>
  )
}

export default NavBarButtons
