import { ActionIcon, Image } from '@mantine/core'
import { Center, Grid, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Container, Modal, useMantineColorScheme } from '@mantine/core'
import { useEffect, useState } from 'react'

import { DevicePropertiesType } from '@/models/enums'
import { translateDeviceName } from '@/utils/utils'
import useTranslation from 'next-translate/useTranslation'
import { useViewportSize } from '@mantine/hooks'

type Props = {
  device: DevicePropertiesType
  miniphotos: boolean
  withName?: boolean
}

export default function DevicePhotos({ device, miniphotos, withName }: Props) {
  const [activeLink, setActiveLink] = useState(`/images/${device.type}/${device.model}_1.png`)
  const [opened, setOpened] = useState(false)
  const { colorScheme } = useMantineColorScheme()
  const { width } = useViewportSize()
  const { t } = useTranslation('translations')
  const imagesLinks: string[] = []
  for (let i = 0; i < device.imageAmount; i++) {
    imagesLinks.push(`/images/${device.type}/${device.model}_${(i + 1).toString()}.png`)
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
          title={`${translateDeviceName(t, device.name)} ${t('photos')}`}
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
        <Grid>
          <Grid.Col span={miniphotos ? 12 : 12} sm={miniphotos ? 8 : 12}>
            <Center>
              <Image
                caption={
                  withName && (
                    <Text mb='md' weight={500} size='lg'>
                      {`${translateDeviceName(t, device.name)} ${t('photos')}`}
                    </Text>
                  )
                }
                src={activeLink}
                fit='contain'
                width={width <= 560 ? 280 : 280}
                height={width <= 560 ? 280 : 320}
                alt={'photo'}
                style={{ cursor: 'zoom-in' }}
                onClick={() => setOpened(true)}
              />
            </Center>
          </Grid.Col>
          <Grid.Col span={miniphotos ? 12 : 0} sm={miniphotos ? 4 : 0}>
            <SimpleGrid
              breakpoints={[
                { minWidth: 'sm', cols: 2 },
                { minWidth: 100, cols: 3 },
              ]}
              spacing='md'>
              {miniphotos
                ? imagesLinks.map((src, index) => (
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
                          className='SmallGalleryImg'
                          onClick={() => handleSetActiveLink(index + 1)}
                        />
                      </ActionIcon>
                    </Center>
                  ))
                : ''}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Stack>
    </Center>
  )
}
