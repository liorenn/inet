import { useEffect, useState } from 'react'

import { Loader } from '@mantine/core'
import { trpc } from '@/utils/client'
import { useCurrency } from '@/hooks/useCurrency'

/* eslint-disable @typescript-eslint/no-floating-promises */
export default function PriceText({ priceString }: { priceString: string }) {
  const { currency } = useCurrency()
  const { mutate } = trpc.device.convertPrice.useMutation()
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0'))
  const [prevCurrency, setPrevCurrency] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!currency) return
    if (prevCurrency === undefined) {
      if (currency.value !== 'USD') {
        setNewPrice(currency.value)
      } else setPrevCurrency('USD')
    } else {
      mutate(
        { price, currency: prevCurrency, targetCurrency: currency.value },
        {
          onSuccess(data) {
            setPrice(data)
            setPrevCurrency(currency.value)
          },
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  function setNewPrice(currencyValue: string) {
    mutate(
      { price, currency: 'USD', targetCurrency: currencyValue },
      {
        onSuccess(data) {
          setPrice(data)
          setPrevCurrency(currencyValue)
        },
      }
    )
  }

  if (!currency) {
    return <Loader />
  }
  return <>{price.toFixed(2) + currency.symol}</>
}
