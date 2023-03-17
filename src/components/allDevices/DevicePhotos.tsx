import { useEffect, useState } from 'react'
import { Center, Stack, Group } from '@mantine/core'
import { Modal, useMantineColorScheme, Container } from '@mantine/core'
import { useMantineTheme, ActionIcon, Image } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { getDeviceType } from '../../utils/functions'

type Props = {
  device: { model: string; name: string; imageAmount: number }
  miniphotos: boolean
}

function DevicePhotos({ device, miniphotos }: Props) {
  const deviceType = getDeviceType(device.model)
  const [activeLink, setActiveLink] = useState(
    '/images/' + deviceType + '/' + device.model + '_1.png'
  )
  const [opened, setOpened] = useState(false)
  const { colorScheme } = useMantineColorScheme()
  const { width } = useViewportSize()
  const theme = useMantineTheme()
  const dark = colorScheme === 'dark'
  const images_src = []
  for (let i = 0; i < device.imageAmount; i++) {
    images_src.push(
      '/images/' + deviceType + '/' + device.model + '_' + (i + 1) + '.png'
    )
  }

  useEffect(() => {
    setActiveLink('/images/' + deviceType + '/' + device.model + '_1.png')
  }, [device])

  function handleSetActiveLink(index: number) {
    const img_num_index = activeLink.indexOf('_') + 1
    const new_link = replaceAt(img_num_index, index, activeLink)
    setActiveLink(new_link)
  }

  function replaceAt(index: number, replacement: number, string: string) {
    return (
      string.substring(0, index) +
      replacement +
      string.substring(index + 1, string.length)
    )
  }

  return (
    <Center>
      <Stack align='center' spacing='xs'>
        <Modal
          size='85%'
          opened={opened}
          radius='md'
          title={device.name + ' Photos'}
          onClose={() => setOpened(false)}>
          <Center>
            <Image
              src={activeLink}
              fit='contain'
              alt={'photo'}
              width={430}
              height={550}
            />
          </Center>
          <Container>
            <Group position='apart' spacing='md'>
              {miniphotos &&
                images_src.map((src, index) => (
                  <ActionIcon
                    size={width <= 500 ? 100 : 140}
                    key={index}
                    color={dark ? 'gray.9' : 'gray.2'}
                    variant={src === activeLink ? 'filled' : 'subtle'}>
                    <Image
                      src={src}
                      fit='contain'
                      key={index}
                      alt={'photo'}
                      width={width <= 500 ? 78 : 100}
                      height={width <= 500 ? 100 : 132}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSetActiveLink(index + 1)}
                    />
                  </ActionIcon>
                ))}
            </Group>
          </Container>
        </Modal>
        <Image
          src={activeLink}
          fit='contain'
          width={300}
          height={300}
          alt={'photo'}
          style={{ cursor: 'zoom-in' }}
          onClick={() => setOpened(true)}
        />
        <Group position='center' spacing='lg'>
          {miniphotos
            ? images_src.map((src, index) => (
                <ActionIcon
                  size={80}
                  key={index}
                  color={dark ? 'gray.9' : 'gray.2'}
                  variant={src === activeLink ? 'filled' : 'subtle'}>
                  <Image
                    alt={'photo'}
                    fit='contain'
                    src={src}
                    key={index}
                    width={65}
                    height={82}
                    className='SmallGalleryImg'
                    onClick={() => handleSetActiveLink(index + 1)}
                  />
                </ActionIcon>
              ))
            : ''}
        </Group>
      </Stack>
    </Center>
  )
}

export default DevicePhotos
