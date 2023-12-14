import { useState, useEffect } from 'react'
import { convertPrice } from '../../utils/functions'
import { useCurrencytore } from '../../utils/CurrencyStore'
import { Center, Loader } from '@mantine/core'

export default function PriceText({ priceString }: { priceString: string }) {
  const { currency } = useCurrencytore()
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0'))
  const [prevCurrency, setPrevCurrency] = useState<string | undefined>(
    undefined
  )
  async function setNewPrice(currencyValue: string) {
    const newPrice = await convertPrice(price, 'USD', currencyValue)
    setPrice(newPrice)
    setPrevCurrency(currencyValue)
  }

  useEffect(() => {
    if (!currency) return
    if (prevCurrency === undefined) {
      if (currency.value !== 'USD') {
        setNewPrice(currency.value)
      } else setPrevCurrency('USD')
    } else {
      convertPrice(price, prevCurrency, currency.value).then((price) => {
        setPrice(price)
        setPrevCurrency(currency.value)
      })
    }
  }, [currency])

  if (!currency) {
    return (
      <Center>
        <Loader color='gray' size={120} variant='dots' mt={100} />
      </Center>
    )
  }
  return <>{price.toFixed(2) + currency.symol}</>
}
