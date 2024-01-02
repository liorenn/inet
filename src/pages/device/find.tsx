import { Container, SegmentedControl, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import { z } from 'zod'

type inputType = { value: string; label: string }[]
type preferenceType = {
  name: string
  value: string
}

const preferencesNames = ['display', 'battery', 'price']
const inputsNames = ['1', '2', '3', '4']

function generateUrlString(preferences: preferenceType[]) {
  return `?preferences=${preferences
    .map((preference) => {
      return `${preference.name}-${preference.value}`
    })
    .join(',')}`
}

export default function Find() {
  const inputs = Array.from({ length: 3 }, () =>
    inputsNames.map((value) => ({ value, label: value }))
  )
  const router = useRouter()
  const preferences = z
    .string()
    .parse(
      router.query.preferences ??
        generateUrlString(preferencesNames.map((name) => ({ name, value: '' })))
    )
    .split(',')
    .map((value) => {
      return { name: value.split('-')[0], value: value.split('-')[1] }
    })

  useEffect(() => {
    if (!router.query.preferences) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(
        generateUrlString(preferencesNames.map((name) => ({ name, value: '' })))
      )
    }
  }, [router])

  console.log(preferences)

  return (
    <>
      <Head>
        <title>Find</title>
      </Head>
      <Container size={1000}>
        {preferences &&
          inputs.map((input: inputType, index: number) => (
            <PreferenceInput
              value={input}
              preferences={preferences}
              index={index}
              key={index}
            />
          ))}
      </Container>
    </>
  )
}

type preferenceInputType = {
  value: inputType
  index: number
  preferences: preferenceType[]
}

function PreferenceInput({ value, index, preferences }: preferenceInputType) {
  const router = useRouter()
  //console.log(preferences[index].value)
  return (
    <>
      <Stack mt='md' spacing={0}>
        <Text>{preferences[index].name}</Text>
        <SegmentedControl
          data={value}
          defaultValue=''
          value={preferences[index].value}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={(newValue) => (
            (preferences[index].value = newValue),
            router.push(generateUrlString(preferences))
          )}
        />
      </Stack>
    </>
  )
}
