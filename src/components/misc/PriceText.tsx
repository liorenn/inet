import { useEffect, useState } from 'react'

import { Loader } from '@mantine/core'
import { trpc } from '@/utils/client'
import { useCurrency } from '@/hooks/useCurrency'

/* eslint-disable @typescript-eslint/no-floating-promises */
export default function PriceText({ priceString }: { priceString: string }) {
  const { currency } = useCurrency() // Get the selected currency
  const { mutate } = trpc.device.convertPrice.useMutation() // Convert price mutation
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0')) // State variable to store the price
  const [prevCurrency, setPrevCurrency] = useState<string | undefined>(undefined) // State variable to store the previous currency

  useEffect(() => {
    if (!currency) return // If the selected currency is undefined return
    if (prevCurrency === undefined) {
      if (currency.value !== 'USD') {
        // If the selected currency is not USD
        setNewPrice(currency.value) // Convert the price to USD
      } else setPrevCurrency('USD') // Set the previous currency to USD
    } else {
      mutate(
        // Convert the price to the selected currency
        { price, currency: prevCurrency, targetCurrency: currency.value },
        {
          onSuccess(data) {
            setPrice(data) // Set the price
            setPrevCurrency(currency.value) // Set the previous currency
          },
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  function setNewPrice(currencyValue: string) {
    mutate(
      // Convert the price to the selected currency
      { price, currency: 'USD', targetCurrency: currencyValue },
      {
        onSuccess(data) {
          setPrice(data) // Set the price
          setPrevCurrency(currencyValue) // Set the previous currency
        },
      }
    )
  }

  if (!currency) {
    return <Loader /> // If the selected currency is undefined return a loader
  }
  return <>{`${price.toFixed(2)} ${currency.symbol}`}</>
}
