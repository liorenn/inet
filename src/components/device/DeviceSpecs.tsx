import { formatSpecs, type DeviceSpecsType } from '@/models/SpecsFormatter'
import { Button, Container, useMantineColorScheme } from '@mantine/core'
import { Accordion } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import Link from 'next/link'
import DeviceTable from '@/components/device/DeviceTable'
import { deviceSpecsCategories } from '@/models/deviceProperties'

// The component props
type Props = { device: DeviceSpecsType }

export default function DeviceSpecs({ device }: Props) {
  const { t } = useTranslation('main') // Get the translation function
  const { colorScheme } = useMantineColorScheme() // Get the color scheme
  const [accordionState, setAccordionState] = useState<string[]>(deviceSpecsCategories) // The accordion state
  const categories = formatSpecs(device) // Format the device specs

  // If the device doesn't exist return a message and a button to go to the home page
  if (!categories)
    return (
      <Container size='lg'>
        {t('deviceDoesntExist')}
        <br />
        <Link href={'/'}>
          <Button color='gray' size='lg' radius='md' mt='lg' variant='light'>
            {t('goToHomePage')}
          </Button>
        </Link>
      </Container>
    )

  return (
    <Accordion
      variant='contained'
      radius='md'
      multiple
      value={accordionState}
      onChange={setAccordionState}
      sx={{ marginBottom: 20 }}
      styles={{
        label: { fontSize: 28, fontWeight: 500 },
        content: { backgroundColor: colorScheme === 'dark' ? 'gray.9' : 'white' },
        control: { backgroundColor: colorScheme === 'dark' ? 'gray.9' : 'white' },
      }}>
      {categories.map((category, index) => (
        <Accordion.Item value={category.name} key={index}>
          <Accordion.Control>{t(category.name)}</Accordion.Control>
          <Accordion.Panel>
            <DeviceTable specs={category.specs} name={category.name} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
