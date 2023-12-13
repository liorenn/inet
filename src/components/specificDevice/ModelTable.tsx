import { Table, Grid, Text, Group, Tooltip, ColorSwatch } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useState, useEffect } from 'react'
import { useCurrencytore } from '../../utils/CurrencyStore'
import { convertPrice } from '../../utils/functions'

type catergory = {
  label: string
  info: string
}
type TableProps = {
  category: catergory[]
  secondCatergory?: catergory[]
  categoryName: string
}

export default function ModelTable({
  category,
  categoryName,
  secondCatergory,
}: TableProps) {
  const { t } = useTranslation('devices')
  const { currency } = useCurrencytore()
  const priceString = category.find(
    (element) => element.label === t('releasePrice')
  )?.info as string
  const priceString2 = secondCatergory?.find(
    (element) => element.label === t('releasePrice')
  )?.info
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0'))
  const [price2, setPrice2] = useState<number>(parseFloat(priceString2 ?? '0'))
  const [prevCurrency, setPrevCurrency] = useState<string | undefined>(
    undefined
  )

  async function setNewPrice() {
    const newPrice = await convertPrice(price, 'USD', currency.value)
    setPrice(newPrice)
    if (secondCatergory) {
      const newPrice2 = await convertPrice(price2, 'USD', currency.value)
      setPrice2(newPrice2)
    }
    setPrevCurrency('USD')
  }

  useEffect(() => {
    if (categoryName === t('availability')) {
      setNewPrice()
    }
  }, [])

  useEffect(() => {
    if (!currency || categoryName !== t('availability') || !prevCurrency) return
    convertPrice(price, prevCurrency, currency.value).then((price) => {
      setPrice(price)
      setPrevCurrency(currency.value)
    })
    if (secondCatergory) {
      convertPrice(price2, prevCurrency, currency.value).then((price) => {
        setPrice2(price)
      })
    }
  }, [currency])

  return (
    <Table fontSize={16} highlightOnHover verticalSpacing='lg'>
      <tbody>
        {category &&
          category.map((element, index) => (
            <tr key={element.label}>
              <td>
                <Grid>
                  <Grid.Col
                    span={secondCatergory ? 4 : 6}
                    sx={{ fontWeight: 600, fontSize: 20 }}>
                    <Text>{element.label}</Text>
                  </Grid.Col>
                  <Grid.Col
                    span={secondCatergory ? 4 : 6}
                    sx={{ fontWeight: 400, fontSize: 20 }}>
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
                  {secondCatergory && (
                    <Grid.Col span={4} sx={{ fontWeight: 400, fontSize: 20 }}>
                      <Text>
                        {secondCatergory[index].label === t('colors') ? (
                          <Group position='left' spacing='xs'>
                            {secondCatergory[index].info.split(' ').map(
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
                        ) : secondCatergory[index].label ===
                            t('releasePrice') ||
                          secondCatergory[index].label === t('price') ? (
                          price2.toFixed(2) + currency.symol
                        ) : (
                          secondCatergory[index].info
                        )}
                      </Text>
                    </Grid.Col>
                  )}
                </Grid>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}
