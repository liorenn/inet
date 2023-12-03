import {
  Button,
  Center,
  Loader,
  ScrollArea,
  Table,
  TextInput,
} from '@mantine/core'
import { trpc } from '../../utils/trpc'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import type { User } from '@prisma/client'
import { Controller, useForm } from 'react-hook-form'
import debounce from 'lodash.debounce'
import { CreateNotification } from '../../utils/functions'
import { useState } from 'react'
import { useOs } from '@mantine/hooks'

export default function UserManagement() {
  const { t } = useTranslation('auth')
  const { data: tableData } = trpc.admin.getUsersData.useQuery()

  if (!tableData) {
    return (
      <>
        <Head>
          <title>{t('account')}</title>
        </Head>
        <Center>
          <Loader color='gray' size={120} variant='dots' />
        </Center>
      </>
    )
  }
  return (
    <>
      <ScrollArea>
        <Table mb='md' withBorder withColumnBorders>
          <thead>
            <tr>
              <th>{t('deleteAccount')}</th>
              <th>{t('username')}</th>
              <th>{t('name')}</th>
              <th>{t('password')}</th>
              <th>{t('email')}</th>
              <th>{t('phone')}</th>
              <th>{t('accessKey')}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => {
              return <UserRow data={data} key={index} />
            })}
          </tbody>
        </Table>
      </ScrollArea>
      {/* <Affix position={{ bottom: 20, right: 20 }}>
        <Button
          variant='light'
          color='gray'
          leftIcon={<IconRefresh size={16} />}
          onClick={() => {
            refetch().then((data) => {
              setTableData(() => {
                if (data.data) {
                  return [...data.data]
                } else {
                  return []
                }
              })
            })
          }}>
          {t('refresh')}
        </Button>
      </Affix> */}
    </>
  )
}

function UserRow({ data }: { data: User }) {
  const os = useOs()
  const { t } = useTranslation('auth')
  const { mutate: mutateUpdate } = trpc.admin.updateUser.useMutation()
  const { mutate: mutateDelete } = trpc.admin.deleteUser.useMutation()
  const { getValues, control } = useForm<User>()

  const handleDelete = () => {
    mutateDelete({ id: data.id })
  }

  const handleEdit = debounce((fields: User) => {
    fields.accessKey = Number(fields.accessKey)
    mutateUpdate(
      { ...fields, id: data.id },
      {
        onSuccess: () => {
          CreateNotification(
            t('updatedSuccessfully'),
            'green',
            os === 'ios' ? true : false
          )
        },
        onError: () => {
          CreateNotification(
            t('errorAccured'),
            'red',
            os === 'ios' ? true : false
          )
        },
      }
    )
  }, 1200)

  type inputName =
    | 'name'
    | 'accessKey'
    | 'id'
    | 'phone'
    | 'username'
    | 'password'
    | 'email'

  type FormInputProps = {
    inputName: inputName
    defaultValue: string
    regex: RegExp
    disabled?: boolean
  }

  function FormInput({
    inputName,
    defaultValue,
    regex,
    disabled,
  }: FormInputProps) {
    const [error, setError] = useState(!regex.test(defaultValue))
    return (
      <Controller
        control={control}
        name={inputName}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextInput
            {...field}
            w='160px'
            style={{
              pointerEvents: disabled ? 'none' : 'auto',
              opacity: disabled ? 0.6 : 1,
            }}
            onChange={(event) => {
              field.onChange(event)
              if (regex.test(event.target.value)) {
                handleEdit(getValues())
                setError(false)
              } else {
                setError(true)
              }
            }}
            error={error && t('wrongPattern')}
          />
        )}
      />
    )
  }

  return (
    <>
      <tr>
        <td>
          <Button
            fullWidth
            onClick={handleDelete}
            color='red'
            variant='light'
            type='button'>
            {t('deleteAccount')}
          </Button>
        </td>
        <td>
          <FormInput
            disabled
            inputName='username'
            defaultValue={data.username}
            regex={/^[A-Za-z\d_.]{5,}$/}
          />
        </td>
        <td>
          <FormInput
            inputName='name'
            defaultValue={data.name}
            regex={/^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/}
          />
        </td>
        <td>
          <FormInput
            inputName='password'
            defaultValue={data.password}
            regex={/^[A-Za-z\d_.!@#$%^&*]{5,}$/}
          />
        </td>
        <td>
          <FormInput
            inputName='email'
            defaultValue={data.email}
            regex={/^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/}
          />
        </td>
        <td>
          <FormInput
            inputName='phone'
            defaultValue={data.phone}
            regex={/^0\d{1,2}-?\d{7}$/}
          />
        </td>
        <td>
          <FormInput
            inputName='accessKey'
            defaultValue={String(data.accessKey)}
            regex={/^\d$/}
          />
        </td>
      </tr>
    </>
  )
}
