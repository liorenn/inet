import { Container, Group, SegmentedControl, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { z } from 'zod'

type inputType = { value: string; label: string }[]
function generateUrlString(buttons: string[][]) {
  return `?preferences=${buttons
    .map(([key, value]) => {
      return `${key}-${value}`
    })
    .join(',')}`
}

export default function Find() {
  const router = useRouter()
  console.log(router.query)
  const buttons = z
    .string()
    .parse(router.query.preferences ?? '')
    .split(',')
    .map((value) => value.split('-'))

  useEffect(() => {
    if (!router.query.deviceList) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(
        generateUrlString([
          ['display', ''],
          ['battery', ''],
          ['price', ''],
        ])
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const inputs: inputType[] = [
    [
      { value: 'small', label: 'small' },
      { value: 'medium', label: 'medium' },
      { value: 'large', label: 'large' },
    ],
    [
      { value: 'small', label: 'small' },
      { value: 'medium', label: 'medium' },
      { value: 'large', label: 'large' },
    ],
    [
      { value: 'small', label: 'small' },
      { value: 'medium', label: 'medium' },
      { value: 'large', label: 'large' },
    ],
  ]

  return (
    <Container size={1000}>
      {buttons.length > 0 &&
        inputs.map((input, index) => (
          <PreferenceInput
            value={input}
            buttons={buttons}
            index={index}
            key={index}
          />
        ))}
    </Container>
  )
}

type preferenceInputType = {
  value: inputType
  index: number
  buttons: string[][]
}

function PreferenceInput({ value, index, buttons }: preferenceInputType) {
  const router = useRouter()
  return (
    <>
      <Stack mt='md' spacing={0}>
        <Text>{buttons[index][0]}</Text>
        <SegmentedControl
          data={value}
          defaultValue=''
          value={buttons[index][1]}
          onChange={(newValue) => {
            const x = buttons
            x[index][1] = newValue
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push(generateUrlString(x))
          }}
        />
      </Stack>
    </>
  )
}
