import { useState } from 'react'
import { useMantineColorScheme } from '@mantine/core'
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

type Props = {
  device: Device
  //refs: any
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
const devicePropeties: devicePropetiesType[] = [
  {
    deviceTypeValue: DeviceTypeValue.iphone,
    specsFunction: GetIphoneSpecs,
    accordionContents: iphoneAccordionContents,
  },
  {
    deviceTypeValue: DeviceTypeValue.imac,
    specsFunction: GetImacSpecs,
    accordionContents: imacAccordionContents,
  },
  {
    deviceTypeValue: DeviceTypeValue.airpods,
    specsFunction: GetAirpodsSpecs,
    accordionContents: airpodsAccordionContents,
  },
]

function ModelSpecs({ device }: Props) {
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
  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category.map((element: any) => (
          <tr key={element.label}>
            <td>
              <Grid>
                <Grid.Col span={6} sx={{ fontWeight: 600, fontSize: 20 }}>
                  <Text ref={element?.ref}>{element.label}</Text>
                </Grid.Col>
                <Grid.Col span={6} sx={{ fontWeight: 400, fontSize: 20 }}>
                  <Text>{element.info}</Text>
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
