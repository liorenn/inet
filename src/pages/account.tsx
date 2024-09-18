import { AccountFields, AccountFieldsNames, accountConfig } from '@/models/formValidation'
import { Box, Button, Group, Stack, Text, Tooltip } from '@mantine/core'
import { SimpleGrid, TextInput } from '@mantine/core'

import { Divider } from '@mantine/core'
import ImageUploader from '@/components/misc/UploadAvatar'
import Loader from '@/components/layout/Loader'
import ProtectedPage from '~/src/components/pages/ProtectedPage'
import React from 'react'
import { User } from '@prisma/client'
import { api } from '@/lib/trpc'
import { createNotification } from '@/lib/utils'
import { useEffect } from 'react'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

export default function Account() {
  const { data: user } = api.auth.getUser.useQuery() // Get the user
  const { t } = useTranslation('main') // Get the translation function
  const updateMutation = api.auth.updateUserProperty.useMutation()
  // Get the fields from the form properties and create the validator
  const fields = accountConfig.fields.map((field) => {
    return {
      ...field,
      validator: (value: string) =>
        field.regex.test(value?.toString()) ? null : `${field.name} is not valid`
    }
  })
  const [inputs, setInputs] = useState<AccountFields>(accountConfig.defaultValues) // State variable to store the user inputs

  // When user details data changes
  useEffect(() => {
    if (user) {
      Object.keys(inputs).forEach((key) => {
        // If the key exists in the user details and is not the password
        if (key in user && key !== 'password') {
          // Set the input values to updated user details
          setInputs((prevInputs) => ({
            ...prevInputs,
            [key]: user[key as keyof typeof user]
          }))
        }
      })
    }
  }, [user])

  // Update a user property in the database
  function updateProperty(property: AccountFieldsNames, value: string) {
    // If the property is not validated
    if (
      fields.find((field) => field.name === property)?.validator(inputs[property]) !== null ||
      !user ||
      user[property] === value
    )
      return // Exist the function
    // Update the user property
    updateMutation.mutate(
      {
        email: user.email,
        property,
        value: inputs[property]
      },
      {
        // On operation success
        onSuccess() {
          createNotification(`${t(property)} ${t('updatedSuccessfully')}`, 'green') // Create a success notification
        },
        onError() {
          createNotification(t('errorAccured'), 'red') // Create an error notification
        }
      }
    )
  }

  return (
    <ProtectedPage container='xl' title={t('account')}>
      {!user ? (
        <Loader />
      ) : (
        <>
          <Group position='apart' sx={{ padding: 20, marginBottom: 30 }}>
            <Group spacing='xl'>
              <ImageUploader email={user.email} />
              <Box>
                <Text sx={{ fontSize: 50 }} weight={700}>
                  {user.username}
                </Text>
                <Text sx={{ fontSize: 22 }} weight={400}>
                  {user.name}
                </Text>
                <Text sx={{ fontSize: 18 }} weight={400}>
                  {user.email}
                </Text>
              </Box>
            </Group>
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
            {fields.map((field, index) => {
              const property = field.name as AccountFieldsNames
              return (
                <React.Fragment key={index}>
                  <SimpleGrid
                    cols={3}
                    sx={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
                    <Text sx={{ fontSize: 22 }} weight={500} color='dimmed'>
                      {t(field.name)}
                    </Text>
                    <TextInput
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          [field.name]: e.target.value
                        }))
                      }
                      placeholder={`${t('enterYour')} ${property === 'password' && t('new')} ${t(
                        field.name
                      )}...`}
                      error={
                        inputs[field.name as keyof typeof inputs] !== ''
                          ? field.validator(inputs[field.name as keyof typeof inputs])
                          : null
                      }
                      value={inputs[field.name as keyof typeof inputs]}
                      radius='md'
                      size='md'
                    />
                    <Tooltip
                      ml={42}
                      color='dark'
                      position='top-end'
                      label='Change Value to Update Property'>
                      <Group position='right'>
                        <Button
                          disabled={
                            user[property] === inputs[property] ||
                            field.validator(inputs[property]) !== null
                          }
                          px={36}
                          variant='light'
                          color='green'
                          onClick={() => {
                            updateProperty(property, inputs[property])
                            if (field.name === 'password')
                              setInputs((prev) => ({ ...prev, password: '' }))
                          }}
                          sx={{ width: 'auto' }}>
                          <Text sx={{ fontSize: 18 }} weight={500}>
                            {t(field.name !== 'password' ? 'update' : 'reset')}
                          </Text>
                        </Button>
                      </Group>
                    </Tooltip>
                  </SimpleGrid>
                  <Divider />
                </React.Fragment>
              )
            })}
          </Stack>
        </>
      )}
    </ProtectedPage>
  )
}
