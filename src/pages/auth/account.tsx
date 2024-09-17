import { Box, Container, Group, Stack, Text } from '@mantine/core'
import { Center, SimpleGrid, TextInput, UnstyledButton } from '@mantine/core'

import { AccountForm } from '@/models/forms'
import { CreateNotification } from '@/utils/utils'
import { Divider } from '@mantine/core'
import Head from 'next/head'
import ImageUploader from '@/components/misc/UploadAvatar'
import Loader from '@/components/layout/Loader'
import React from 'react'
import { User } from '@/server/auth'
import type { UserSchemaType } from '@/models/schemas'
import { trpc } from '@/utils/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

export type AccountFields = Omit<User, 'email' | 'accessKey'>
export type AccountFieldsNames = keyof AccountFields

type AccountField = {
  name: AccountFieldsNames
  regex: RegExp
  validator: (value: string) => string | null
}

export default function Account() {
  const { data: user } = trpc.auth.getUser.useQuery() // Get the user
  const router = useRouter() // Get the router object
  const formProperties = new AccountForm() // Get the form properties for validation
  const { t } = useTranslation('main') // Get the translation function
  const updateMutation = trpc.auth.updateUser.useMutation()
  const [account, setAccount] = useState<UserSchemaType | undefined>() // State variable to store the user details
  const omitFields = formProperties.getFileds() as Omit<AccountField, 'validator'>[] // Cast the fields to remove the validator
  // Get the fields from the form properties and create the validator
  const fields = omitFields.map((field) => {
    return {
      ...field,
      validator: (value: string | number) =>
        field.regex.test(value?.toString()) ? null : `${field.name} is not valid`
    }
  })
  const [inputs, setInputs] = useState<AccountFields>(formProperties.getDefaultValues()) // State variable to store the user inputs

  // When user details data changes
  useEffect(() => {
    // If user details is not loading
    if (user !== undefined) {
      // If the user doesnt exists
      if (user === null) {
        router.push('/') // Redirect to home
      } else {
        setAccount(user) // Set the user details
        // For each key in the inputs
        Object.keys(inputs).forEach((key) => {
          // If the key exists in the user details
          if (key in user) {
            // Set the input values to updated user details
            setInputs((prevInputs) => ({
              ...prevInputs,
              [key]: user[key as keyof typeof user]
            }))
          }
        })
      }
    }
  }, [user])

  // Update a user property in the database
  function updateProperty(
    user: UserSchemaType,
    property: AccountFieldsNames,
    account: UserSchemaType
  ) {
    // If the property is not validated
    if (fields.find((field) => field.name === property)?.validator(inputs[property]) !== null)
      return // Exist the function
    // Update the user property
    updateMutation.mutate(
      {
        ...account
      },
      {
        // On operation success
        onSuccess(data) {
          CreateNotification(`${t(property)} ${t('updatedSuccessfully')}`, 'green') // Create a success notification
          setAccount({
            ...inputs,
            email: user.email,
            phone: user.phone,
            accessKey: user.accessKey
          })
        },
        onError() {
          CreateNotification(t('errorAccured'), 'red') // Create an error notification
        }
      }
    )
  }

  // If user is not connected
  if (!user) {
    return <Center>{t('accessDeniedMessageSignIn')}</Center>
  }

  // If account details is still loading
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
          {/* <Stack sx={{ marginTop: 28 }}>
            <Text
              ta={width < 400 ? 'left' : 'right'}
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              {`${t('createdAt')} ${dateFormmater.format(
                new Date(user?.updated_at ?? new Date())
              )}`}
            </Text>
            <Text
              ta={width < 400 ? 'left' : 'right'}
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              {`${t('updatedAt')} ${dateFormmater.format(
                new Date(user?.created_at ?? new Date())
              )}`}
            </Text>
            <Text
              ta={width < 400 ? 'left' : 'right'}
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              {`${user?.comments?.length ?? 0} ${t('commentsCommented')}`}
            </Text>
          </Stack> */}
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
                      [field.name]: e.target.value
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
                    updateProperty(user, field.name, account) // Update the user property
                  }}>
                  <Text sx={{ fontSize: 18 }} weight={500} align='right' color='green'>
                    {t('update')}
                  </Text>
                </UnstyledButton>
              </SimpleGrid>
              {index !== fields.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </>
  )
}
