import { FortmatSpecs, type deviceSpecsType } from '../../models/SpecsFormatter'
import { useMantineColorScheme } from '@mantine/core'
import { Accordion } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useMemo, useState } from 'react'
import { useViewportSize } from '@mantine/hooks'
import DeviceTable from './DeviceTable'

type Props = {
  devices: deviceSpecsType[]
}

export type categoriesType = {
  name: string
  specs: {
    property: keyof deviceSpecsType
    value: string
  }[]
}[]

type MergedCategoriesType = {
  name: string
  specs: {
    property: keyof deviceSpecsType
    values: string[]
  }[]
}[]

export default function DevicesSpecs({ devices }: Props) {
  const { t } = useTranslation('translations')
  const { colorScheme } = useMantineColorScheme()
  const { width } = useViewportSize()
  const accordionContents = [
    t('name'),
    t('display'),
    t('battery'),
    t('hardware'),
    t('cameras'),
    t('features'),
    t('availability'),
  ]
  const [value, setValue] = useState<string[]>(accordionContents)
  const mergedCategories = useMemo(() => mergeCategories(devices), [devices])
  console.log(mergedCategories)

  function mergeCategories(devices: deviceSpecsType[]): MergedCategoriesType {
    const categories: MergedCategoriesType = []
    //const iterator = FortmatSpecs(devices[0])
    // categories.push({
    //   name: 'name',
    //   specs: [
    //     { property: 'name', values: devices.map((device) => device.name) },
    //   ],
    // })
    // iterator.forEach((category, categoryIndex) => {
    //   categories.push({
    //     name: category.name,
    //     specs: category.specs.map((item, itemIndex) => ({
    //       property: item.property,
    //       values: devices.map((device) => {
    //         const specs = FortmatSpecs(device)
    //         //return specs[categoryIndex].specs[itemIndex].value
    //         return 'a'
    //       }),
    //     })),
    //   })
    // })
    return categories
  }

  return (
    <></>
    // <Accordion
    //   variant='contained'
    //   radius='md'
    //   multiple
    //   value={value}
    //   onChange={setValue}
    //   sx={{ marginBottom: 100 }}
    //   styles={{
    //     label: { fontSize: width < 500 ? 20 : 26, fontWeight: 500 },
    //     content: { backgroundColor: colorScheme === 'dark' ? 'gray.9' : 'white' },
    //     control: { backgroundColor: colorScheme === 'dark' ? 'gray.9' : 'white' },
    //   }}>
    //   {mergedCategories.map((category, index) => (
    //     <Accordion.Item value={category.name} key={category.name}>
    //       <Accordion.Control>{category.name}</Accordion.Control>
    //       <Accordion.Panel>
    //          <DeviceTable
    //           category={category.values.map((item) => ({
    //             label: item.label,
    //             info: item.info1,
    //           }))}
    //           secondCatergory={category.values.map((item) => ({
    //             label: item.label,
    //             info: item.info2,
    //           }))}
    //         /> *
    //       </Accordion.Panel>
    //     </Accordion.Item>
    //   ))}
    // </Accordion>
  )
}
