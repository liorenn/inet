import { Button, Group, Pagination, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { CreateNotification, chunkArray } from '@/utils/utils'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { InputPropertyName, UserManagementForm, convertFormUserValues } from '@/models/forms'
import { UseFormReturnType, useForm } from '@mantine/form'
import { useOs, useViewportSize } from '@mantine/hooks'

import Loader from '@/components/layout/Loader'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import useTranslation from 'next-translate/useTranslation'
import { userSchema } from '@/models/schemas'

export type UserFormType = {
  [K in InputPropertyName]: string // Type of the form inputs
}

// The component props
type Props = {
  accessKey: number // Access key of the user
}

export default function UserManagement({ accessKey }: Props) {
  const router = useRouter() // Get the router
  const { width } = useViewportSize() // Get the viewport size
  const { t } = useTranslation('main') // Get the translation function
  const [activePage, setActivePage] = useState(0) // The active page of the table
  const [chunkedUsers, setChunkedUsers] = useState<UserFormType[][]>([[]]) // The chunked users
  const fieldNames = Object.keys(userSchema.shape) // The field names of the users
  const usersDataQuery = trpc.auth.getUsersData.useQuery() // The users data query
  const {
    settings: { adminTableRows, managerAccessKey },
  } = useSiteSettings()

  // If the access key is less than the manager access key
  if (accessKey < managerAccessKey) {
    router.push('/') // Redirect to the home page
  }

  // When the users query data updates
  useEffect(() => {
    // If the users data query loaded successfully
    if (usersDataQuery.data) {
      // Set the chunked users
      setChunkedUsers(
        // Chunk the users data
        chunkArray(
          usersDataQuery.data.map((user) => {
            return { ...user, accessKey: user.accessKey.toString() }
          }),
          adminTableRows
        )
      )
    }
  }, [usersDataQuery.data])

  return (
    <>
      {usersDataQuery.isLoading ? ( // If the users data query is loading
        <Loader /> // Show the loader
      ) : (
        <>
          <ScrollArea mb='sm' type={width < 400 ? 'always' : 'auto'}>
            <Table mb='sm' withBorder withColumnBorders>
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
                {chunkedUsers &&
                  chunkedUsers[activePage] &&
                  chunkedUsers[activePage].map((user, index) => (
                    <UserRow
                      setChunkedUsers={setChunkedUsers}
                      activePage={activePage}
                      setActivePage={setActivePage}
                      user={user}
                      key={index}
                    />
                  ))}
                <UserInsertRow setChunkedUsers={setChunkedUsers} setActivePage={setActivePage} />
              </tbody>
            </Table>
          </ScrollArea>
          <Pagination.Root
            color='dark'
            total={chunkedUsers.length}
            value={activePage + 1}
            onChange={(value) => setActivePage(value - 1)}>
            <Group spacing={5}>
              <Pagination.First />
              <Pagination.Previous />
              <Pagination.Items />
              <Pagination.Next />
              <Pagination.Last />
            </Group>
          </Pagination.Root>
        </>
      )}
    </>
  )
}

type UserInsertRowProps = {
  setActivePage: Dispatch<SetStateAction<number>>
  setChunkedUsers: Dispatch<SetStateAction<UserFormType[][]>>
}

function UserInsertRow({ setActivePage, setChunkedUsers }: UserInsertRowProps) {
  const os = useOs() // Get the client operating system
  const formProperties = new UserManagementForm() // Get the form properties
  const { t } = useTranslation('main') // Get the translation function
  const [loading, setLoading] = useState(false) // The loading state
  const insertUserMutation = trpc.auth.insertUser.useMutation() // The insert user mutation
  const {
    settings: { adminTableRows, validateInputOnChange },
  } = useSiteSettings()

  // Form management function
  const form = useForm<UserFormType>({
    initialValues: formProperties.getDefaultValues(),
    validateInputOnChange,
    validate: formProperties.getValidators(),
  })

  // Insert user function
  const handleInsert = () => {
    if (form.isValid()) {
      setLoading(true) // Set the loading state to true
      // Insert the user
      insertUserMutation.mutate(
        { ...convertFormUserValues(form.values) },
        {
          // On insertion success
          onSuccess: () => {
            setLoading(false) // Set the loading state to false
            // Set the chunked users
            setChunkedUsers((prev) => {
              const newData = prev.slice() // Create a copy of the chunked users
              // If the last page is not full
              if (newData[prev.length - 1].length < adminTableRows) {
                newData[prev.length - 1].push(form.values) // Push the form values to the last page
                setActivePage(prev.length - 1) // Set the active page to the last page
              }
              // If the last page is full
              else {
                newData.push([form.values]) // Create a new page after the last page
                setActivePage(newData.length - 1) // Set the active page to the new page
              }
              return newData // Return the new chunked users
            })
            form.setValues(formProperties.getDefaultValues()) // Set the form values to the default values
            CreateNotification(t('insertedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
          },
          onError: () => {
            setLoading(false) // Set the loading state to false
            CreateNotification(t('errorAccured'), 'red', os === 'ios' ? true : false) // Create an error notification
          },
        }
      )
      setLoading(false) // Set the loading state to false
    }
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
  activePage: number
  setActivePage: Dispatch<SetStateAction<number>>
  setChunkedUsers: Dispatch<SetStateAction<UserFormType[][]>>
}

function UserRow({ user, activePage, setActivePage, setChunkedUsers }: UserRowProps) {
  const os = useOs() // Get the client operating system
  const formProperties = new UserManagementForm() // Get the form properties
  const { t } = useTranslation('main') // Get the translation function
  const [editMode, setEditMode] = useState(false) // The edit mode state
  const [loading, setLoading] = useState(false) // The loading state
  const deleteUserMutation = trpc.auth.deleteUser.useMutation() // The delete user mutation
  const updateUserMutation = trpc.auth.updateUser.useMutation() // The update user mutation
  const {
    settings: { validateInputOnChange },
  } = useSiteSettings()

  // Form management function
  const form = useForm<UserFormType>({
    initialValues: user,
    validateInputOnChange,
    validate: formProperties.getValidators(),
  })

  // When user data changes
  useEffect(() => {
    form.setValues(user) // Set the form values to the changed user data
  }, [user])

  // Delete user function
  const handleDelete = () => {
    setLoading(true) // Set the loading state to true
    // Delete the user
    deleteUserMutation.mutate(
      { email: user.email },
      {
        // On deletion success
        onSuccess: () => {
          setLoading(false) // Set the loading state to false
          // Set the chunked users
          setChunkedUsers((prev) => {
            let newData = prev.slice() // Create a copy of the chunked users
            // Delete the user from the current page
            newData[activePage] = newData[activePage].filter((data) => data.email !== user.email)
            // Delete the page if it is empty
            newData = newData.filter((arr) => {
              // If the page is empty
              if (arr.length === 0) {
                setActivePage((prev) => prev - 1) // Set the active page to the previous page
              }
              return arr.length > 0 // Return true if the page is not empty
            })
            return newData // Return the new chunked users
          })
          CreateNotification(t('deletedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
        },
        onError: () => {
          setLoading(false) // Set the loading state to false
          CreateNotification(t('errorAccured'), 'red', os === 'ios' ? true : false) // Create an error notification
        },
      }
    )
    setLoading(false) // Set the loading state to false
  }

  // Update user function
  const handleUpdate = () => {
    // If the form passed the validation
    if (form.isValid()) {
      setEditMode(false) // Set the edit mode to false
      // If the form values are different from the current user
      if (JSON.stringify(form.values) !== JSON.stringify(user)) {
        // Update the user
        updateUserMutation.mutate(
          { ...convertFormUserValues(form.values) },
          {
            // On update success
            onSuccess() {
              CreateNotification(t('updatedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
            }, // On update error
            onError() {
              form.setValues(user) // Set the form values to the current user
              CreateNotification(t('errorAccured'), 'red', os === 'ios' ? true : false) // Create an error notification
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
