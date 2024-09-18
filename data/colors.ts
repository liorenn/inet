export type Color = { name: string; hex: string }

export const Colors = [
  { name: 'Blue Gray', hex: '#4f525d' },
  { name: 'Netural Gray', hex: '#9d9a94' },
  { name: 'Space Black', hex: '#383635' },
  { name: 'Silver', hex: '#F5F5F0' },
  { name: 'Light Blue', hex: '#add8e6' },
  { name: 'Light Green', hex: '#b2f3b2' },
  { name: 'Light Yellow', hex: '#fef8e2' },
  { name: 'Light Pink', hex: '#fbe4e2' },
  { name: 'Dark Purple', hex: '#3c3943' },
  { name: 'Gold', hex: '#e9d8af' },
  { name: 'Light Purple', hex: '#e5ddeb' },
  { name: 'Midnight', hex: '#1b1f25' },
  { name: 'Yellow', hex: '#fae26f' },
  { name: 'Red', hex: '#d5302a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Purple', hex: '#353b71' },
  { name: 'Orange', hex: '#e86740' },
  { name: 'Mustard', hex: '#e0901a' },
  { name: 'Turquoise', hex: '#10505b' },
  { name: 'Ocean Blue', hex: '#26476d' },
  { name: 'Rose Pink', hex: '#f5b7b1' },
  { name: 'Black', hex: '#101010' },
  { name: 'Pink', hex: '#f5b7b1' },
  { name: 'Dark Red', hex: '#b30000' },
  { name: 'Dark Green', hex: '#003312' },
] as const

export type ColorName = (typeof Colors)[number]['name']
