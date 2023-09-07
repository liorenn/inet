import { ColorSwatch, Tooltip, useMantineColorScheme } from '@mantine/core'
import { Table, Accordion, Grid, Text, Group } from '@mantine/core'
import { Device, DeviceTypeValue } from '@prisma/client'
import GetIphoneSpecs from './devicesSpecs/iphoneSpecs'
import GetImacSpecs from './devicesSpecs/imacSpecs'
import GetAirpodsSpecs from './devicesSpecs/airpodsSpecs'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'

type Props = {
  device1: Device
  device2: Device
}

export type categoriesType = {
  name: string
  values: {
    label: string
    info: string
  }[]
}[]

type MergedCategoriesType = {
  name: string
  values: {
    label: string
    info1: string
    info2: string
  }[]
}[]

type TableProps = {
  category: {
    label: string
    info1: string
    info2: string
  }[]
}

type devicePropetiesType = {
  accordionContents: string[]
  deviceTypeValue: DeviceTypeValue
  specsFunction: Function
}

function ModelsSpecs({ device1, device2 }: Props) {
  const { t } = useTranslation('devices')
  const devicePropeties: devicePropetiesType[] = [
    {
      deviceTypeValue: DeviceTypeValue.iphone,
      specsFunction: GetIphoneSpecs,
      accordionContents: [
        t('name'),
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
    (object) => object.deviceTypeValue === device1.deviceTypeValue
  )
  const [value, setValue] = useState<string[]>([
    'Name',
    ...devicePropeties[index].accordionContents,
  ])
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const index1 = devicePropeties.findIndex(
    (object) => object.deviceTypeValue === device1.deviceTypeValue
  )
  const categories1 = devicePropeties[index1].specsFunction(
    device1
  ) as categoriesType
  const index2 = devicePropeties.findIndex(
    (object) => object.deviceTypeValue === device2.deviceTypeValue
  )
  const categories2 = devicePropeties[index2].specsFunction(
    device2
  ) as categoriesType
  const mergedCategories = mergeCategories(categories1, categories2)

  function mergeCategories(
    originalCategories: categoriesType,
    additionalCategories: categoriesType
  ): MergedCategoriesType {
    const mergedCategories: MergedCategoriesType = []
    mergedCategories.push({
      name: t('name'),
      values: [{ label: t('name'), info1: device1.name, info2: device2.name }],
    })
    for (let i = 0; i < originalCategories.length; i++) {
      const originalCategory = originalCategories[i]
      const additionalCategory = additionalCategories[i]

      if (originalCategory && additionalCategory) {
        const mergedValues = originalCategory.values.map(
          (originalValue, index) => ({
            label: originalValue.label,
            info1: originalValue.info,
            info2: additionalCategory.values[index]?.info || '', // Ensure info2 exists
          })
        )
        mergedCategories.push({
          name: originalCategory.name,
          values: mergedValues,
        })
      }
    }
    return mergedCategories
  }

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
      {mergedCategories.map((category) => (
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

function IphoneTable({ category }: TableProps) {
  const { t } = useTranslation('devices')
  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category.map((element) => (
          <tr key={element.label}>
            <td>
              <Grid>
                <Grid.Col span={4} sx={{ fontWeight: 600, fontSize: 20 }}>
                  <Text>{element.label}</Text>
                </Grid.Col>
                <Grid.Col span={4} sx={{ fontWeight: 400, fontSize: 20 }}>
                  <Text>
                    {element.label === t('colors') ? (
                      <Group position='left' spacing='xs'>
                        {element.info1.split(' ').map(
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
                      element.info1
                    )}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4} sx={{ fontWeight: 400, fontSize: 20 }}>
                  <Text>
                    {element.label === t('colors') ? (
                      <Group position='left' spacing='xs'>
                        {element.info1.split(' ').map(
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
                      element.info1
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

export default ModelsSpecs
