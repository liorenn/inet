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

interface CurrencyState {
  currency: currency
  setCurrency: (currency: currency) => void
}

export const useCurrencytore = create<CurrencyState>()((set) => ({
  currency: currencies[0],
  setCurrency: (newCurrency) => {
    set(() => ({ currency: newCurrency }))
    localStorage.setItem('currency', newCurrency.value)
  },
}))
