import { Button, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { UserManagementForm, UserPropertyName, convertFormUserValues } from '@/models/forms'
import { managerAccessKey, validateInputOnChange } from 'config'
import { useOs, useViewportSize } from '@mantine/hooks'

import { CreateNotification } from '@/utils/utils'
import Loader from '@/components/layout/Loader'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { userSchema } from '@/models/schemas'

export type UserFormType = {
  [K in UserPropertyName]: string
}

type Props = {
  accessKey: number
}

export default function UserManagement({ accessKey }: Props) {
  const router = useRouter()
  const { width } = useViewportSize()
  const { t } = useTranslation('translations')
  const [users, setUsers] = useState<UserFormType[]>([])
  const fieldNames = Object.keys(userSchema.shape)
  const usersDataQuery = trpc.auth.getUsersData.useQuery()
  if (accessKey < managerAccessKey) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/')
  }

  useEffect(() => {
    if (usersDataQuery.data) {
      setUsers(
        usersDataQuery.data.map((user) => {
          return { ...user, accessKey: user.accessKey.toString() }
        })
      )
    }
  }, [usersDataQuery.data])

  return (
    <>
      {usersDataQuery.isLoading ? (
        <Loader />
      ) : (
        <ScrollArea type={width < 400 ? 'always' : 'auto'}>
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
              {users.map((user, index) => (
                <UserRow setUsers={setUsers} user={user} key={index} />
              ))}
              <UserInsertRow setUsers={setUsers} />
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  )
}

type UserInsertRowProps = {
  setUsers: Dispatch<SetStateAction<UserFormType[]>>
}

function UserInsertRow({ setUsers }: UserInsertRowProps) {
  const os = useOs()
  const formProperties = new UserManagementForm()
  const { t } = useTranslation('translations')
  const [loading, setLoading] = useState(false)
  const insertUserMutation = trpc.auth.insertUser.useMutation()

  const form = useForm<UserFormType>({
    initialValues: formProperties.getDefaultValues(),
    validateInputOnChange,
    validate: formProperties.getValidators(),
  })

  const handleInsert = () => {
    setLoading(true)
    insertUserMutation.mutate(
      { ...convertFormUserValues(form.values) },
      {
        onSuccess: () => {
          setLoading(false)
          setUsers((prev) => [...prev, form.values])
          form.setValues(formProperties.getDefaultValues())
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
        {formProperties.getFileds().map((field, index) => (
          <td key={index}>
            <UserTableFormInput
              form={form}
              editMode={true}
              disabled={false}
              inputName={field.name}
            />
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

type UserRowProps = {
  user: UserFormType
  setUsers: Dispatch<SetStateAction<UserFormType[]>>
}

function UserRow({ user, setUsers }: UserRowProps) {
  const os = useOs()
  const formProperties = new UserManagementForm()
  const { t } = useTranslation('translations')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const deleteUserMutation = trpc.auth.deleteUser.useMutation()
  const updateUserMutation = trpc.auth.updateUser.useMutation()
  const form = useForm<UserFormType>({
    initialValues: user,
    validateInputOnChange,
    validate: formProperties.getValidators(),
  })

  useEffect(() => {
    form.setValues(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDelete = () => {
    setLoading(true)
    setUsers((prev) => prev.filter((user) => user.email !== user.email))
    deleteUserMutation.mutate(
      { email: user.email },
      {
        onSuccess: () => {
          setLoading(false)
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
      if (form.values !== user) {
        updateUserMutation.mutate(
          { ...convertFormUserValues(form.values) },
          {
            onSuccess: () => {
              CreateNotification(t('updatedSuccessfully'), 'green', os === 'ios' ? true : false)
            },
            onError: () => {
              form.setValues(user)
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
        {formProperties.getFileds().map((field, index) => (
          <td key={index}>
            <UserTableFormInput
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

type UserTableFormInputProps = {
  editMode: boolean
  inputName: keyof UserFormType
  disabled?: boolean
  form: UseFormReturnType<UserFormType>
}

function UserTableFormInput({ form, inputName, disabled, editMode }: UserTableFormInputProps) {
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
