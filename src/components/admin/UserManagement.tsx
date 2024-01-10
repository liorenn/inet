import { Button, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { convertFormUserValues, getUserFields } from '@/models/forms'

import { CreateNotification } from '@/utils/utils'
import Loader from '@/components/layout/Loader'
import type { User } from '@prisma/client'
import { managerAccessKey } from 'config'
import { trpc } from '@/server/client'
import { useOs } from '@mantine/hooks'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { userSchema } from '@/models/schemas'

export type formType = {
  [K in keyof User]: string
}

type props = {
  accessKey: number
}

export default function UserManagement({ accessKey }: props) {
  const router = useRouter()
  const { t } = useTranslation('translations')
  const [users, setUsers] = useState<formType[]>([])
  const fieldNames = Object.keys(userSchema.shape)
  const { data: tableData, isLoading } = trpc.auth.getUsersData.useQuery()
  if (accessKey < managerAccessKey) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/')
  }

  useEffect(() => {
    if (tableData) {
      setUsers(
        tableData.map((user) => {
          return { ...user, accessKey: user.accessKey.toString() }
        })
      )
    }
  }, [tableData])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollArea>
          <Table mb='md' withBorder withColumnBorders>
            <thead>
              <tr>
                {fieldNames.map((name, index) => (
                  <th key={index}>{t(name)}</th>
                ))}
                <th>{t('updateAccount')}</th>
                <th>{t('deleteAccount')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((data, index) => (
                <UserRow setUsers={setUsers} data={data} key={index} />
              ))}
              <InsertRow setUsers={setUsers} />
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  )
}

type insertRowProps = {
  setUsers: Dispatch<SetStateAction<formType[]>>
}

function InsertRow({ setUsers }: insertRowProps) {
  const os = useOs()
  const { t } = useTranslation('translations')
  const [loading, setLoading] = useState(false)
  const { mutate: mutateInsert } = trpc.auth.insertUser.useMutation()
  const { fields, validators, defaultValues } = getUserFields()
  const form = useForm<formType>({
    initialValues: defaultValues,
    validateInputOnChange: true,
    validate: validators,
  })

  const handleInsert = () => {
    setLoading(true)
    mutateInsert(
      { ...convertFormUserValues(form.values) },
      {
        onSuccess: () => {
          setLoading(false)
          setUsers((prev) => [...prev, form.values])
          form.setValues(defaultValues)
          CreateNotification(t('insertedSuccessfully'), 'green', os === 'ios' ? true : false)
        },
        onError: () => {
          setLoading(false)
          CreateNotification(t('errorAccured'), 'red', os === 'ios' ? true : false)
        },
      }
    )
  }

  return (
    <>
      <tr>
        {fields.map((field, index) => (
          <td key={index}>
            <FormInput form={form} editMode={true} disabled={false} inputName={field.name} />
          </td>
        ))}
        <td colSpan={2}>
          <Button
            fullWidth
            onClick={handleInsert}
            disabled={loading}
            color={loading ? 'gray' : 'orange'}
            variant='light'
            type='submit'>
            {loading ? t('loading') : t('insertAccount')}
          </Button>
        </td>
      </tr>
    </>
  )
}

type userRowProps = {
  data: formType
  setUsers: Dispatch<SetStateAction<formType[]>>
}

function UserRow({ data, setUsers }: userRowProps) {
  const os = useOs()
  const { t } = useTranslation('translations')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const { mutate: mutateDelete } = trpc.auth.deleteUser.useMutation()
  const { mutate: mutateUpdate } = trpc.auth.updateUser.useMutation()
  const { fields, validators } = getUserFields()
  const form = useForm<formType>({
    initialValues: data,
    validateInputOnChange: true,
    validate: validators,
  })

  const handleDelete = () => {
    setLoading(true)
    mutateDelete(
      { email: data.email },
      {
        onSuccess: () => {
          setLoading(false)
          setUsers((prev) => prev.filter((user) => user.email !== data.email))
          CreateNotification(t('deletedSuccessfully'), 'green', os === 'ios' ? true : false)
        },
        onError: () => {
          setLoading(false)
          CreateNotification(t('errorAccured'), 'red', os === 'ios' ? true : false)
        },
      }
    )
  }
  const handleUpdate = () => {
    if (form.isValid()) {
      setEditMode(false)
      if (form.values !== data) {
        mutateUpdate(
          { ...convertFormUserValues(form.values) },
          {
            onSuccess: () => {
              CreateNotification(t('updatedSuccessfully'), 'green', os === 'ios' ? true : false)
            },
            onError: () => {
              form.setValues(data)
              CreateNotification(t('errorAccured'), 'red', os === 'ios' ? true : false)
            },
          }
        )
      }
    }
  }

  return (
    <>
      <tr>
        {fields.map((field, index) => (
          <td key={index}>
            <FormInput
              form={form}
              editMode={editMode}
              disabled={field.disabled}
              inputName={field.name}
            />
          </td>
        ))}

        <td>
          {editMode === false ? (
            <Button
              fullWidth
              onClick={() => setEditMode(true)}
              color='lime'
              variant='light'
              type='button'>
              {t('editAccount')}
            </Button>
          ) : (
            <Button fullWidth onClick={handleUpdate} color='lime' variant='light' type='submit'>
              {t('updateAccount')}
            </Button>
          )}
        </td>
        <td>
          <Button
            fullWidth
            onClick={handleDelete}
            disabled={loading}
            color={loading ? 'gray' : 'red'}
            variant='light'
            type='button'>
            {loading ? t('loading') : t('deleteAccount')}
          </Button>
        </td>
      </tr>
    </>
  )
}

type FormInputProps = {
  editMode: boolean
  inputName: keyof formType
  disabled?: boolean
  form: UseFormReturnType<formType>
}

function FormInput({ form, inputName, disabled, editMode }: FormInputProps) {
  return (
    <>
      {editMode && !disabled ? (
        <TextInput
          {...form.getInputProps(inputName)}
          w='120px'
          style={{
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.6 : 1,
          }}
        />
      ) : (
        <Text>{form.values[inputName]}</Text>
      )}
    </>
  )
}
