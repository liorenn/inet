import {
  IconCurrencyDollar,
  IconCurrencyEuro,
  IconCurrencyShekel,
  TablerIcon,
} from '@tabler/icons'
import { create } from 'zustand'

type currency = {
  value: string
  name: string
  symol: string
  icon: TablerIcon
}

export const currencies: currency[] = [
  {
    value: 'USD',
    name: 'United States Dollar',
    symol: '$',
    icon: IconCurrencyDollar,
  },
  {
    value: 'ILS',
    name: 'Israeli Shekel',
    symol: '₪',
    icon: IconCurrencyShekel,
  },
  { value: 'EUR', name: 'Euro', symol: '€', icon: IconCurrencyEuro },
]

type CurrencyState = {
  currency: currency | undefined
  setCurrency: (currency: currency) => void
}

export const useCurrency = create<CurrencyState>()((set) => ({
  currency: undefined,
  setCurrency: (newCurrency) => {
    set(() => ({ currency: newCurrency }))
    localStorage.setItem('currency', newCurrency.value)
  },
}))
