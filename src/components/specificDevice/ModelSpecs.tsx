import { useState } from 'react'
import {
  ColorSwatch,
  Group,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core'
import { Table, Accordion, Grid, Text } from '@mantine/core'
import { Device, DeviceTypeValue } from '@prisma/client'
import GetIphoneSpecs, {
  accordionContents as iphoneAccordionContents,
} from './devicesSpecs/iphoneSpecs'
import GetImacSpecs, {
  accordionContents as imacAccordionContents,
} from './devicesSpecs/imacSpecs'
import GetAirpodsSpecs, {
  accordionContents as airpodsAccordionContents,
} from './devicesSpecs/airpodsSpecs'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  device: Device
}

export type categoriesType = {
  name: string
  values: {
    label: string
    info: string
  }[]
}[]

type devicePropetiesType = {
  accordionContents: string[]
  deviceTypeValue: DeviceTypeValue
  specsFunction: Function
}

function ModelSpecs({ device }: Props) {
  const { t } = useTranslation('devices')
  const devicePropeties: devicePropetiesType[] = [
    {
      deviceTypeValue: DeviceTypeValue.iphone,
      specsFunction: GetIphoneSpecs,
      accordionContents: [
        t('display'),
        t('battery'),
        t('hardware'),
        t('cameras'),
        t('features'),
        t('availability'),
      ],
    },
    {
      deviceTypeValue: DeviceTypeValue.imac,
      specsFunction: GetImacSpecs,
      accordionContents: [
        t('display'),
        t('hardware'),
        t('cameras'),
        t('features'),
        t('availability'),
      ],
    },
    {
      deviceTypeValue: DeviceTypeValue.airpods,
      specsFunction: GetAirpodsSpecs,
      accordionContents: [
        t('soundFeatures'),
        t('battery'),
        t('hardware'),
        t('features'),
        t('availability'),
      ],
    },
  ]
  const index = devicePropeties.findIndex(
    (object) => object.deviceTypeValue === device.deviceTypeValue
  )
  const [value, setValue] = useState<string[]>(
    devicePropeties[index].accordionContents
  )
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const categories = devicePropeties[index].specsFunction(
    device
  ) as categoriesType

  return (
    <Accordion
      variant='contained'
      radius='md'
      multiple
      value={value}
      onChange={setValue}
      sx={{ marginBottom: 100 }}
      styles={{
        label: { fontSize: 28, fontWeight: 500 },
        content: { backgroundColor: dark ? 'gray.9' : 'white' },
        control: { backgroundColor: dark ? 'gray.9' : 'white' },
      }}>
      {categories.map((category) => (
        <Accordion.Item value={category.name} key={category.name}>
          <Accordion.Control>{category.name}</Accordion.Control>
          <Accordion.Panel>
            <IphoneTable category={category.values} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

type TableProps = {
  category: {
    label: string
    info: string
  }[]
}

function IphoneTable({ category }: TableProps) {
  const { t } = useTranslation('devices')
  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category.map((element) => (
          <tr key={element.label}>
            <td>
              <Grid>
                <Grid.Col span={6} sx={{ fontWeight: 600, fontSize: 20 }}>
                  <Text>{element.label}</Text>
                </Grid.Col>
                <Grid.Col span={6} sx={{ fontWeight: 400, fontSize: 20 }}>
                  <Text>
                    {element.label === t('colors') ? (
                      <Group position='left' spacing='xs'>
                        {element.info.split(' ').map(
                          (color, index) =>
                            color !== undefined && (
                              <Tooltip
                                offset={10}
                                color='gray'
                                label={color.split('/')[1]}
                                key={index}>
                                <ColorSwatch
                                  color={color.split('/')[0]}
                                  withShadow
                                />
                              </Tooltip>
                            )
                        )}
                      </Group>
                    ) : (
                      element.info
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default ModelSpecs
