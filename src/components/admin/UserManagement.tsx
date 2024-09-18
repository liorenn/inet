import { Button, Group, Pagination, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { UserFormType, getValidators, userManagementConfig } from '@/models/formValidation'
import { UserRole, userSchema } from '@/models/schemas'
import { chunkArray, createNotification } from '@/lib/utils'
import { useOs, useViewportSize } from '@mantine/hooks'

import Loader from '@/components/layout/Loader'
import { api } from '@/lib/trpc'
import { useRouter } from 'next/router'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import useTranslation from 'next-translate/useTranslation'

export default function UserManagement() {
  const { width } = useViewportSize() // Get the viewport size
  const { t } = useTranslation('main') // Get the translation function
  const [activePage, setActivePage] = useState(0) // The active page of the table
  const [chunkedUsers, setChunkedUsers] = useState<UserFormType[][]>([[]]) // The chunked users
  const fieldNames = Object.keys(userSchema.shape) // The field names of the users
  const usersDataQuery = api.admin.getUsersData.useQuery() // The users data query
  const {
    settings: { adminTableRows }
  } = useSiteSettings()

  // When the users query data updates
  useEffect(() => {
    // If the users data query loaded successfully
    if (usersDataQuery.data) {
      // Set the chunked users
      setChunkedUsers(
        // Chunk the users data
        chunkArray(
          usersDataQuery.data.map((user) => {
            return { ...user }
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
          <ScrollArea offsetScrollbars mb='sm' type={width < 400 ? 'always' : 'auto'}>
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
  const { t } = useTranslation('main') // Get the translation function
  const [loading, setLoading] = useState(false) // The loading state
  const insertUserMutation = api.admin.insertUser.useMutation() // The insert user mutation
  const {
    settings: { adminTableRows, validateInputOnChange }
  } = useSiteSettings()

  // Form management function
  const form = useForm<UserFormType>({
    initialValues: userManagementConfig.defaultValues,
    validateInputOnChange,
    validate: getValidators(userManagementConfig.fields)
  })

  // Insert user function
  const handleInsert = () => {
    if (form.isValid()) {
      setLoading(true) // Set the loading state to true
      // Insert the user
      insertUserMutation.mutate(
        { ...form.values },
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
            form.setValues(userManagementConfig.defaultValues) // Set the form values to the default values
            createNotification(t('insertedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
          },
          onError: () => {
            setLoading(false) // Set the loading state to false
            createNotification(t('errorAccured'), 'red', os === 'ios' ? true : false) // Create an error notification
          }
        }
      )
      setLoading(false) // Set the loading state to false
    }
  }

  return (
    <>
      <tr>
        {userManagementConfig.fields.map((field, index) => (
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
  const { t } = useTranslation('main') // Get the translation function
  const [editMode, setEditMode] = useState(false) // The edit mode state
  const [loading, setLoading] = useState(false) // The loading state
  const deleteUserMutation = api.admin.deleteUser.useMutation() // The delete user mutation
  const updateUserMutation = api.admin.updateUser.useMutation() // The update user mutation
  const {
    settings: { validateInputOnChange }
  } = useSiteSettings()

  // Form management function
  const form = useForm<UserFormType>({
    initialValues: user,
    validateInputOnChange,
    validate: getValidators(userManagementConfig.fields)
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
          createNotification(t('deletedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
        },
        onError: () => {
          setLoading(false) // Set the loading state to false
          createNotification(t('errorAccured'), 'red', os === 'ios' ? true : false) // Create an error notification
        }
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
          { ...form.values },
          {
            // On update success
            onSuccess() {
              createNotification(t('updatedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
            }, // On update error
            onError() {
              form.setValues(user) // Set the form values to the current user
              createNotification(t('errorAccured'), 'red', os === 'ios' ? true : false) // Create an error notification
            }
          }
        )
      }
    }
  }

  return (
    <>
      <tr>
        {userManagementConfig.fields.map((field, index) => (
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
            opacity: disabled ? 0.6 : 1
          }}
        />
      ) : (
        <Text>{form.values[inputName]}</Text>
      )}
    </>
  )
}
