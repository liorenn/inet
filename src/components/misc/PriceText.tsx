import { useEffect, useState } from 'react'

import { Loader } from '@mantine/core'
import { trpc } from '@/utils/client'
import { useCurrency } from '@/hooks/useCurrency'

/* eslint-disable @typescript-eslint/no-floating-promises */
export default function PriceText({ priceString }: { priceString: string }) {
  const { currency } = useCurrency() // Get the selected currency
  const convertPriceMutation = trpc.device.convertPrice.useMutation() // Convert price mutation
  const [price, setPrice] = useState<number>(parseFloat(priceString ?? '0')) // State variable to store the price
  const [prevCurrency, setPrevCurrency] = useState<string | undefined>(undefined) // State variable to store the previous currency

  // When the selected currency changes
  useEffect(() => {
    if (!currency) return // If the selected currency is undefined exit the function
    // If there if not previous currency
    if (prevCurrency === undefined) {
      // If new currency is not usd
      if (currency.value !== 'USD') {
        setNewPrice(currency.value) // Convert the price to usd
      } else setPrevCurrency('USD') // Set the previous currency to usd
    } else {
      // Convert the price to the selected currency
      convertPriceMutation.mutate(
        { price, currency: prevCurrency, targetCurrency: currency.value },
        {
          // On operation success
          onSuccess(data) {
            setPrice(data) // Set the price
            setPrevCurrency(currency.value) // Set the previous currency
          },
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  // Function to convert the price to the selected currency
  function setNewPrice(currencyValue: string) {
    // Convert the price to the selected currency
    convertPriceMutation.mutate(
      { price, currency: 'USD', targetCurrency: currencyValue },
      {
        // On operation success
        onSuccess(data) {
          setPrice(data) // Set the price
          setPrevCurrency(currencyValue) // Set the previous currency
        },
      }
    )
  }

  // If the selected currency is loading
  if (!currency) {
    return <Loader /> // If the selected currency is undefined return a loader
  }

  return <>{`${price.toFixed(2)} ${currency.symbol}`}</>
}
