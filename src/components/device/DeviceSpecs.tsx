import { formatSpecs, type deviceSpecsType } from '@/models/SpecsFormatter'
import { Button, Container, useMantineColorScheme } from '@mantine/core'
import { Accordion } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import Link from 'next/link'
import DeviceTable from '@/components/device/DeviceTable'
import { deviceSpecsCategories } from '@/models/deviceProperties'

type props = { device: deviceSpecsType }

export default function DeviceSpecs({ device }: props) {
  const { t } = useTranslation('translations')
  const { colorScheme } = useMantineColorScheme()
  const [accordionState, setAccordionState] = useState<string[]>(deviceSpecsCategories)
  const categories = formatSpecs(device)

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
