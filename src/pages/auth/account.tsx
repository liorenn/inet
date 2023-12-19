import { Center, SimpleGrid, TextInput, UnstyledButton } from '@mantine/core'
import { Text, Container, Stack, Box, Group } from '@mantine/core'
import { Divider } from '@mantine/core'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import { trpc } from '../../misc/trpc'
import { CreateNotification } from '../../misc/functions'
import { useSession, useUser } from '@supabase/auth-helpers-react'
import UploadAvatar from '../../components/misc/UploadAvatar'
import useTranslation from 'next-translate/useTranslation'
import Loader from '../../components/layout/Loader'
import { supabase } from '../../server/supabase'
import {
  updatePropertiesType,
  userSchemaType,
  updatePropertiesSchema,
  updatePropertiesObjectType,
} from '../../models/schemas'
import React from 'react'

export default function Account() {
  const user = useUser()
  const router = useRouter()
  const session = useSession()
  const { t } = useTranslation('auth')
  const dateFormmater = Intl.DateTimeFormat('en-us', { dateStyle: 'short' })
  const updateMutation = trpc.auth.updateUserDetails.useMutation()
  const { data } = trpc.auth.getUserDetails.useQuery({
    email: user?.email,
  })
  const [account, setAccount] = useState<userSchemaType | undefined>()
  const [inputs, setInputs] = useState<updatePropertiesObjectType>({
    name: '',
    password: '',
    phone: '',
    username: '',
  })
  useEffect(() => {
    if (data) {
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
  }, [data])

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      router.push('/')
    }
  })

  async function updateProperty(
    property: updatePropertiesType,
    account: userSchemaType
  ) {
    if (property === 'password' || property === 'phone') {
      await supabase.auth.updateUser({
        password: account.password,
        phone: account.phone,
      })
    }
    updateMutation.mutate(
      {
        email: account.email,
        property: property,
        value: inputs[property],
      },
      {
        onSuccess(data) {
          CreateNotification(
            `${t(property)} ${t('updatedSuccessfully')}`,
            'green'
          )
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
            <UploadAvatar email={account.email} />
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
            <Text
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              {`${t('createdAt')} ${dateFormmater.format(
                new Date(user?.updated_at ?? new Date())
              )}`}
            </Text>
            <Text
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
              {`${t('updatedAt')} ${dateFormmater.format(
                new Date(user?.created_at ?? new Date())
              )}`}
            </Text>
            <Text
              sx={{ fontSize: 18 }}
              weight={500}
              color='dimmed'
              align='right'>
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
          {updatePropertiesSchema._def.values.map((property, index) => (
            <React.Fragment key={property}>
              <SimpleGrid cols={3} sx={{ paddingLeft: 5, paddingRight: 5 }}>
                <Text
                  sx={{ fontSize: 18, paddingTop: 6 }}
                  weight={500}
                  color='dimmed'>
                  {t(property)}
                </Text>
                <TextInput
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [property]: e.target.value,
                    }))
                  }
                  placeholder={t('placeholders.inputPlaceholder', {
                    input: t(property),
                  })}
                  value={inputs[property]}
                  radius='md'
                  size='md'
                />
                <UnstyledButton
                  onClick={async () => {
                    try {
                      await updateProperty(property, account)
                    } catch (error) {}
                  }}>
                  <Text
                    sx={{ fontSize: 18 }}
                    weight={500}
                    align='right'
                    color='green'>
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
