import { IconCurrencyDollar, IconCurrencyEuro, IconCurrencyShekel, TablerIcon } from '@tabler/icons'

import { create } from 'zustand'

// Define the type for a currency
type Currency = {
  value: string // The currency code
  symbol: string // The currency string symbol
  icon: TablerIcon // The currency icon
}

// Define an array of supported currencies
export const currencies: Currency[] = [
  {
    value: 'USD',
    symbol: '$',
    icon: IconCurrencyDollar,
  },
  {
    value: 'ILS',
    symbol: '₪',
    icon: IconCurrencyShekel,
  },
  {
    value: 'EUR',
    symbol: '€',
    icon: IconCurrencyEuro,
  },
]

// Define the type for the currency state and its setter function
type CurrencyState = {
  currency: Currency | undefined
  setCurrency: (currency: Currency) => void
}

// Create and export the custom hook for managing the selected currency state
export const useCurrency = create<CurrencyState>()((set) => ({
  currency: undefined, // Initialize the selected currency as undefined
  setCurrency: (newCurrency) => {
    set(() => ({ currency: newCurrency })) // Set the selected currency
    localStorage.setItem('currency', newCurrency.value) // Store the selected currency in local storage
  },
}))
