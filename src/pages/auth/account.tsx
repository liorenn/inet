import { Box, Container, Group, Stack, Text } from '@mantine/core'
import { Center, SimpleGrid, TextInput, UnstyledButton } from '@mantine/core'
import { useSession, useUser } from '@supabase/auth-helpers-react'

import { AccountForm } from '@/models/forms'
import { CreateNotification } from '@/utils/utils'
import { Divider } from '@mantine/core'
import Head from 'next/head'
import ImageUploader from '@/components/misc/UploadAvatar'
import Loader from '@/components/layout/Loader'
import React from 'react'
import { User } from '@prisma/client'
import { trpc } from '@/server/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import type { userSchemaType } from '@/models/schemas'

export type accountFields = Omit<User, 'email' | 'accessKey'>
export type accountFieldsNames = keyof accountFields
type accountField = {
  name: accountFieldsNames
  regex: RegExp
  validator: (value: string) => string | null
}

export default function Account() {
  const user = useUser()
  const router = useRouter()
  const session = useSession()
  const formProperties = new AccountForm()
  const { t } = useTranslation('translations')
  const dateFormmater = Intl.DateTimeFormat('en-us', { dateStyle: 'short' })
  const updateMutation = trpc.auth.updateUserDetails.useMutation()
  const { data } = trpc.auth.getUserDetails.useQuery({
    email: user?.email,
  })
  const [account, setAccount] = useState<userSchemaType | undefined>()
  const omitFields = formProperties.getFileds() as Omit<accountField, 'validator'>[]
  const fields = omitFields.map((field) => {
    return {
      ...field,
      validator: (value: string | number) =>
        field.regex.test(value?.toString()) ? null : `${field.name} is not valid`,
    }
  })
  const [inputs, setInputs] = useState<accountFields>(formProperties.getDefaultValues())

  useEffect(() => {
    if (data !== undefined) {
      if (data === null) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push('/')
      } else {
        setAccount(data)
        Object.keys(inputs).forEach((key) => {
          if (key in data) {
            setInputs((prevInputs) => ({
              ...prevInputs,
              [key]: data[key as keyof typeof data],
            }))
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  function updateProperty(property: accountFieldsNames, account: userSchemaType) {
    if (fields.find((field) => field.name === property)?.validator(inputs[property]) !== null)
      return
    // if (property === 'password' || property === 'phone') {
    //   await supabase.auth.updateUser({
    //     password: account.password,
    //     phone: account.phone,
    //   })
    // }
    updateMutation.mutate(
      {
        email: account.email,
        property: property,
        value: inputs[property],
      },
      {
        onSuccess(data) {
          CreateNotification(`${t(property)} ${t('updatedSuccessfully')}`, 'green')
          setAccount({
            ...data,
            [property]: inputs[property],
          })
        },
        onError() {
          CreateNotification(t('errorAccured'), 'red')
        },
      }
    )
  }

  if (!(user && session)) {
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }
  if (!account) return <Loader />
  return (
    <>
      <Head>
        <title>{t('account')}</title>
      </Head>
      <Container size='xl'>
        <Group position='apart' sx={{ padding: 20, marginBottom: 30 }}>
          <Group spacing='xl'>
            <ImageUploader email={account.email} />
            <Box>
              <Text sx={{ fontSize: 50 }} weight={700}>
                {account.username}
              </Text>
              <Text sx={{ fontSize: 22 }} weight={400}>
                {account.name}
              </Text>
              <Text sx={{ fontSize: 18 }} weight={400}>
                {account.email}
              </Text>
            </Box>
          </Group>
          <Stack sx={{ marginTop: 28 }}>
            <Text sx={{ fontSize: 18 }} weight={500} color='dimmed' align='right'>
              {`${t('createdAt')} ${dateFormmater.format(
                new Date(user?.updated_at ?? new Date())
              )}`}
            </Text>
            <Text sx={{ fontSize: 18 }} weight={500} color='dimmed' align='right'>
              {`${t('updatedAt')} ${dateFormmater.format(
                new Date(user?.created_at ?? new Date())
              )}`}
            </Text>
            <Text sx={{ fontSize: 18 }} weight={500} color='dimmed' align='right'>
              {`${data?.comments.length ?? 0} ${t('commentsCommented')}`}
            </Text>
          </Stack>
        </Group>
        <Stack>
          <div>
            <Text sx={{ fontSize: 28 }} weight={700}>
              {t('accountInformation')}
            </Text>
            <Text sx={{ fontSize: 18 }} weight={500}>
              {t('accountInformationDescription')}
            </Text>
          </div>
          <Divider />
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
                <Text sx={{ fontSize: 18, paddingTop: 6 }} weight={500} color='dimmed'>
                  {t(field.name)}
                </Text>
                <TextInput
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  placeholder={`${t('enterYour')} ${t(field.name)}...`}
                  error={field.validator(inputs[field.name])}
                  value={inputs[field.name]}
                  radius='md'
                  size='md'
                />
                <UnstyledButton
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    updateProperty(field.name, account)
                  }}>
                  <Text sx={{ fontSize: 18 }} weight={500} align='right' color='green'>
                    {t('update')}
                  </Text>
                </UnstyledButton>
              </SimpleGrid>
              <Divider />
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </>
  )
}
