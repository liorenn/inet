import { ActionIcon, Flex, Image } from '@mantine/core'
import { Center, Group, Stack, Text } from '@mantine/core'
import { Container, Modal, useMantineColorScheme } from '@mantine/core'
import { useEffect, useState } from 'react'

import { DevicePropertiesType } from '@/models/enums'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

// The component props
type Props = {
  device: DevicePropertiesType
  miniphotos: boolean
  withName?: boolean
}

export default function DevicePhotos({ device, miniphotos, withName }: Props) {
  const [activeLink, setActiveLink] = useState(`/images/${device.type}/${device.model}_1.png`) // The active image
  const [opened, setOpened] = useState(false) // Is the modal opened
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const { width } = useViewportSize() // Get the viewport size
  const { t } = useTranslation('main') // Get the translation function

  const imagesLinks: string[] = [] // Initialize an array of image links
  // For each image in the images folder
  for (let i = 0; i < device.imageAmount; i++) {
    imagesLinks.push(`/images/${device.type}/${device.model}_${(i + 1).toString()}.png`) // Add the image link to the array
  }

  // When the device data changes
  useEffect(() => {
    setActiveLink(`/images/${device.type}/${device.model}_1.png`) // Set the active image
  }, [device])

  // Handle the active image changes
  function handleSetActiveLink(index: number) {
    const imageIndex = activeLink.indexOf('_') + 1 // Get the index of the image
    const newLink = replaceAt(imageIndex, index, activeLink) // The new image index
    setActiveLink(newLink) // Set the active image
  }

  // Replace a character at a given index
  function replaceAt(index: number, replacement: number, string: string) {
    return (
      string.substring(0, index) + // The string before the index
      replacement.toString() + // The replacement
      string.substring(index + 1, string.length) // The string after the index
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
              mb='sm'
              width={width <= 500 ? 200 : 280}
              height={width <= 560 ? 240 : 340}
            />
          </Center>
          <Container>
            <Group position='apart' spacing='md'>
              {imagesLinks.map((src, index) => (
                <ActionIcon
                  size={width <= 500 ? 100 : 140}
                  key={index}
                  color={colorScheme === 'dark' ? 'gray.9' : 'gray.2'}
                  variant={src === activeLink ? 'filled' : 'subtle'}>
                  <Image
                    src={src}
                    fit='contain'
                    key={index}
                    alt={'photo'}
                    width={width <= 560 ? 78 : 100}
                    height={width <= 560 ? 100 : 132}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSetActiveLink(index + 1)}
                  />
                </ActionIcon>
              ))}
            </Group>
          </Container>
        </Modal>
        <Center>
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
            width={width <= 560 ? 280 : 250}
            height={width <= 560 ? 280 : 300}
            alt={'photo'}
            style={{ cursor: 'zoom-in' }}
            onClick={() => setOpened(true)}
          />
        </Center>
        {miniphotos ? (
          <Center>
            <Flex mih={50} gap='md' justify='center' align='center' direction='row' wrap='wrap'>
              {imagesLinks.map((src, index) => (
                <Center key={index}>
                  <ActionIcon
                    size={92}
                    color={colorScheme === 'dark' ? 'gray.9' : 'gray.2'}
                    variant={src === activeLink ? 'filled' : 'subtle'}>
                    <Image
                      alt={'photo'}
                      fit='contain'
                      src={src}
                      key={index}
                      width={width <= 560 ? 80 : 70}
                      height={width <= 560 ? 80 : 100}
                      onClick={() => handleSetActiveLink(index + 1)}
                    />
                  </ActionIcon>
                </Center>
              ))}
            </Flex>
          </Center>
        ) : (
          ''
        )}
      </Stack>
    </Center>
  )
}
