import {
  Button,
  ColorSwatch,
  Container,
  Group,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core'
import { Table, Accordion, Grid, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import FortmatSpecs, { type deviceSpecsType } from './SpecsFormatter'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCurrencytore } from '../../utils/CurrencyStore'
import { convertPrice } from '../../utils/functions'

type Props = {
  device: deviceSpecsType
}

export type categoriesType = {
  name: string
  values: {
    label: string
    info: string
  }[]
}[]

function ModelSpecs({ device }: Props) {
  const { t } = useTranslation('devices')
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const formattedSpecs = FortmatSpecs(device)
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

  if (formattedSpecs === null)
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
      value={value}
      onChange={setValue}
      sx={{ marginBottom: 100 }}
      styles={{
        label: { fontSize: 28, fontWeight: 500 },
        content: { backgroundColor: dark ? 'gray.9' : 'white' },
        control: { backgroundColor: dark ? 'gray.9' : 'white' },
      }}>
      {formattedSpecs.map((category) => (
        <Accordion.Item value={category.name} key={category.name}>
          <Accordion.Control>{category.name}</Accordion.Control>
          <Accordion.Panel>
            <IphoneTable
              category={category.values}
              categoryName={category.name}
            />
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
  categoryName: string
}

function IphoneTable({ category, categoryName }: TableProps) {
  const { t } = useTranslation('devices')
  const { currency } = useCurrencytore()
  const priceString = category.find(
    (element) => element.label === 'Release Price'
  )?.info as string
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0'))
  const [prevCurrency, setPrevCurrency] = useState<string>(currency.value)

  useEffect(() => {
    if (categoryName === t('availability') && currency.value !== 'USD') {
      setPrice(0)
      convertPrice(price, 'USD', currency.value)
        .then((data) => {
          console.log('in use effect' + data)
          setPrice(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  useEffect(() => {
    if (!currency || categoryName !== t('availability')) return
    convertPrice(price, prevCurrency, currency.value).then((price) => {
      setPrice(price)
      setPrevCurrency(currency.value)
    })
  }, [currency])

  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category &&
          category.map((element) => (
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
                      ) : element.label === t('releasePrice') ||
                        element.label === t('price') ? (
                        price.toFixed(2) + currency.symol
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
