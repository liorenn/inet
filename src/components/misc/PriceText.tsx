/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, useEffect } from 'react'
import { convertPrice } from '../../misc/functions'
import { useCurrency } from '../../hooks/useCurrency'
import { Loader } from '@mantine/core'

export default function PriceText({ priceString }: { priceString: string }) {
  const { currency } = useCurrency()
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0'))
  const [prevCurrency, setPrevCurrency] = useState<string | undefined>(
    undefined
  )

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  async function setNewPrice(currencyValue: string) {
    const newPrice = await convertPrice(price, 'USD', currencyValue)
    setPrice(newPrice)
    setPrevCurrency(currencyValue)
  }

  if (!currency) {
    return <Loader />
  }
  return <>{price.toFixed(2) + currency.symol}</>
}
