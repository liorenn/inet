import {
  type deviceSpecsType,
  formatArrSpecs,
} from '../../models/SpecsFormatter'
import { useMantineColorScheme } from '@mantine/core'
import { Accordion } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useMemo, useState } from 'react'
import { useViewportSize } from '@mantine/hooks'
import DevicesTable from './DevicesTable'

type Props = {
  devices: deviceSpecsType[]
}

export default function DevicesSpecs({ devices }: Props) {
  const { t } = useTranslation('translations')
  const { colorScheme } = useMantineColorScheme()
  const { width } = useViewportSize()
  const accordionContents = [
    t('name'),
    t('display'),
    t('battery'),
    t('hardware'),
    t('dimensions'),
    t('cameras'),
    t('features'),
    t('availability'),
  ]
  const [value, setValue] = useState<string[]>(accordionContents)
  const mergedCategories = useMemo(() => formatArrSpecs(devices), [devices])

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
          <Accordion.Control>{category.name}</Accordion.Control>
          <Accordion.Panel>
            <DevicesTable categories={mergedCategories} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
