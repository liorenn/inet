import { trpc } from '../../misc/trpc'
import useTranslation from 'next-translate/useTranslation'
import type { User } from '@prisma/client'
import { Controller, useForm } from 'react-hook-form'
import debounce from 'lodash.debounce'
import { CreateNotification } from '../../misc/functions'
import { useState } from 'react'
import { adminAccessKey } from '../../../config'
import { useRouter } from 'next/router'
import Loader from '../layout/Loader'
import { Button, ScrollArea, Table, TextInput } from '@mantine/core'

export default function DeviceManagement({ accessKey }: { accessKey: number }) {
  const router = useRouter()
  const { t } = useTranslation('device')
  const { data: tableData } = trpc.admin.getUsersData.useQuery()
  if (accessKey < adminAccessKey) {
    router.push('/')
  }

  if (!tableData) {
    return <Loader />
  }
  return (
    <>
      <ScrollArea>
        <Table mb='md' withBorder withColumnBorders>
          <thead>
            <tr>
              <th>{t('deleteDevice')}</th>
              <th>{t('model')}</th>
              <th>{t('name')}</th>
              <th>{t('type')}</th>
              <th>{t('releaseDate')}</th>
              <th>{t('releaseOS')}</th>
              <th>{t('releasePrice')}</th>
              <th>{t('connector')}</th>
              <th>{t('biometrics')}</th>
              <th>{t('batterySize')}</th>
              <th>{t('chipset')}</th>
              <th>{t('weight')}</th>
              <th>{t('description')}</th>
              <th>{t('imageAmount')}</th>
              <th>{t('height')}</th>
              <th>{t('width')}</th>
              <th>{t('depth')}</th>
              <th>{t('storage')}</th>
              <th>{t('cpu')}</th>
              <th>{t('gpu')}</th>
              <th>{t('memory')}</th>
              <th>{t('wiredCharging')}</th>
              <th>{t('magsafe')}</th>
              <th>{t('wirelessCharging')}</th>
              <th>{t('screenSize')}</th>
              <th>{t('screenType')}</th>
              <th>{t('resistanceRating')}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => {
              return <UserRow data={data} key={index} />
            })}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

function UserRow({ data }: { data: User }) {
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
          CreateNotification(t('updatedSuccessfully'), 'green')
        },
        onError: () => {
          CreateNotification(t('errorAccured'), 'red')
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
  }

  function FormInput({ inputName, defaultValue, regex }: FormInputProps) {
    const [error, setError] = useState(!regex.test(defaultValue))
    return (
      <Controller
        control={control}
        name={inputName}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextInput
            {...field}
            w='100%'
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
            regex={/^\+\d{13}$/}
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
