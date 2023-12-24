import { useEffect, useState } from 'react'
import { Center, Stack, Group, Text } from '@mantine/core'
import { Modal, useMantineColorScheme, Container } from '@mantine/core'
import { ActionIcon, Image } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import useTranslation from 'next-translate/useTranslation'
import { devicePropertiesType } from '../../models/deviceTypes'

type Props = {
  device: devicePropertiesType
  miniphotos: boolean
  withName?: boolean
}

function DevicePhotos({ device, miniphotos, withName }: Props) {
  const [activeLink, setActiveLink] = useState(
    `/images/${device.type}/${device.model}_1.png`
  )
  const [opened, setOpened] = useState(false)
  const { colorScheme } = useMantineColorScheme()
  const { width } = useViewportSize()
  const { t } = useTranslation('translations')
  const dark = colorScheme === 'dark'
  const images_src: string[] = []
  for (let i = 0; i < device.imageAmount; i++) {
    images_src.push(
      `/images/${device.type}/${device.model}_${(i + 1).toString()}.png`
    )
  }

  useEffect(() => {
    setActiveLink(`/images/${device.type}/${device.model}_1.png`)
  }, [device])

  function handleSetActiveLink(index: number) {
    const imageIndex = activeLink.indexOf('_') + 1
    const newLink = replaceAt(imageIndex, index, activeLink)
    setActiveLink(newLink)
  }

  function replaceAt(index: number, replacement: number, string: string) {
    return (
      string.substring(0, index) +
      replacement.toString() +
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
          title={`${device.name} ${t('photos')}`}
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
          caption={
            withName && (
              <Text mb='md' weight={500} size='lg'>
                {`${device.name} ${t('photos')}`}
              </Text>
            )
          }
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
