import {
  type deviceSpecsType,
  formatArrSpecs,
} from '../../models/SpecsFormatter'
import { useMantineColorScheme } from '@mantine/core'
import { Accordion } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { useViewportSize } from '@mantine/hooks'
import DevicesTable from './DevicesTable'

type props = {
  devices: deviceSpecsType[]
}

const devicesSpecsCategories = [
  'name',
  'display',
  'battery',
  'hardware',
  'dimensions',
  'cameras',
  'features',
  'availability',
]

export default function DevicesSpecs({ devices }: props) {
  const { t } = useTranslation('translations')
  const { colorScheme } = useMantineColorScheme()
  const { width } = useViewportSize()
  const [value, setValue] = useState<string[]>(devicesSpecsCategories)
  const mergedCategories = formatArrSpecs(devices)
  return (
    <Accordion
      variant='contained'
      radius='md'
      multiple
      value={value}
      onChange={setValue}
      sx={{ marginBottom: 100 }}
      styles={{
        label: { fontSize: width < 500 ? 20 : 26, fontWeight: 500 },
        content: {
          backgroundColor: colorScheme === 'dark' ? 'gray.9' : 'white',
        },
        control: {
          backgroundColor: colorScheme === 'dark' ? 'gray.9' : 'white',
        },
      }}>
      {mergedCategories.map((category, index) => (
        <Accordion.Item value={category.name} key={index}>
          <Accordion.Control>{t(category.name)}</Accordion.Control>
          <Accordion.Panel>
            <DevicesTable specs={category.specs} name={category.name} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
