import { Button, Group, Pagination, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { CreateNotification, chunkArray } from '@/utils/utils'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { adminAccessKey, adminTableRows, validateInputOnChange } from 'config'
import { convertDeviceValues, convertFormDeviceValues, getDeviceFormFields } from '@/models/forms'
import { useOs, useViewportSize } from '@mantine/hooks'

import type { Device } from '@prisma/client'
import Loader from '@/components/layout/Loader'
import { deviceSchema } from '@/models/schemas'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export type DeviceFormType = {
  [K in keyof Device]: string // Type of the form inputs
}

// The component props
type Props = {
  accessKey: number // Access key of the user
}

export default function DeviceManagement({ accessKey }: Props) {
  const router = useRouter() // Get the router
  const { width } = useViewportSize() // Get the viewport size
  const { t } = useTranslation('main') // Get the translation function
  const [activePage, setActivePage] = useState(0) // The active page of the table
  const [chunkedDevices, setChunkedDevices] = useState<DeviceFormType[][]>([]) // The chunked devices
  const fieldNames = Object.keys(deviceSchema.shape) // The field names of the devices
  const devicesDataQuery = trpc.device.getDevicesData.useQuery() // The devices data query
  const sendEmailsMutation = trpc.auth.sendPriceDropsEmails.useMutation() // Mutation function for sending price drop emails using trpc

  // If the access key is less than the manager access key
  if (accessKey < adminAccessKey) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/') // Redirect to the home page
  }

  // When the devices query data updates
  useEffect(() => {
    // If the devices data query loaded successfully
    if (devicesDataQuery.data) {
      // Set the chunked devices
      setChunkedDevices(
        // Chunk the devices data
        chunkArray(
          devicesDataQuery.data.map((device) => convertDeviceValues(device)),
          adminTableRows
        )
      )
    }
  }, [devicesDataQuery.data])

  return (
    <>
      {devicesDataQuery.isLoading ? ( // If the devices data query is loading
        <Loader /> // Show the loader
      ) : (
        <>
          <ScrollArea mb='sm' type={width < 400 ? 'always' : 'auto'}>
            <Table mb='sm' withBorder withColumnBorders>
              <thead>
                <tr>
                  {fieldNames.map((name, index) => (
                    // For each field name show it
                    <th key={index}>{t(name)}</th>
                  ))}
                  <th>{t('updateDevice')}</th>
                  <th>{t('deleteDevice')}</th>
                </tr>
              </thead>
              <tbody>
                {chunkedDevices &&
                  chunkedDevices[activePage] &&
                  chunkedDevices[activePage].map((device, index) => (
                    <DeviceRow
                      setChunkedDevices={setChunkedDevices}
                      setActivePage={setActivePage}
                      activePage={activePage}
                      device={device}
                      key={index}
                    />
                  ))}
                <DeviceInsertRow
                  setChunkedDevices={setChunkedDevices}
                  setActivePage={setActivePage}
                />
              </tbody>
            </Table>
          </ScrollArea>
          <Pagination.Root
            color='dark'
            total={chunkedDevices.length}
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
      <Group grow mt='lg'>
        <Button
          variant='light'
          color='blue'
          fullWidth
          onClick={() => {
            // Send emails to users
            sendEmailsMutation.mutate(
              {},
              {
                onSuccess: () => {
                  CreateNotification('success', 'green') // Create a success notification
                },
              }
            )
          }}>
          {t('sendEmails')}
        </Button>
        <Button
          variant='light'
          color='orange'
          fullWidth
          onClick={() => {
            // Send test emails to users
            sendEmailsMutation.mutate(
              { sendTest: true },
              {
                onSuccess: () => {
                  CreateNotification('success', 'green') // Create a success notification
                },
              }
            )
          }}>
          {t('sendTestEmails')}
        </Button>
      </Group>
    </>
  )
}

type DeviceInsertRowProps = {
  setActivePage: Dispatch<SetStateAction<number>>
  setChunkedDevices: Dispatch<SetStateAction<DeviceFormType[][]>>
}

function DeviceInsertRow({ setActivePage, setChunkedDevices }: DeviceInsertRowProps) {
  const os = useOs() // Get the client operating system
  const { t } = useTranslation('main') // Get the translation function
  const [loading, setLoading] = useState(false) // The loading state
  const insertDeviceMutation = trpc.device.insertDevice.useMutation() // The insert device mutation
  const { fields, validators, defaultValues } = getDeviceFormFields() // Get the devices form fields

  // Form management function
  const form = useForm<DeviceFormType>({
    initialValues: defaultValues,
    validateInputOnChange,
    validate: validators,
  })

  // Insert device function
  const handleInsert = () => {
    setLoading(true) // Set the loading state to true
    // Insert the device
    insertDeviceMutation.mutate(
      { ...convertFormDeviceValues(form.values) },
      {
        // On insertion success
        onSuccess: () => {
          setLoading(false) // Set the loading state to false
          // Set the chunked devices
          setChunkedDevices((prev) => {
            const newData = prev.slice() // Create a copy of the chunked devices
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
            return newData // Return the new chunked devices
          })
          form.setValues(defaultValues) // Set the form values to the default values
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

  return (
    <>
      <tr>
        {fields.map((field, index) => (
          <td key={index}>
            <DeviceTableFormInput
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
            {loading ? t('loading') : t('insertDevice')}
          </Button>
        </td>
      </tr>
    </>
  )
}

type DeviceRowProps = {
  device: DeviceFormType
  activePage: number
  setActivePage: Dispatch<SetStateAction<number>>
  setChunkedDevices: Dispatch<SetStateAction<DeviceFormType[][]>>
}

function DeviceRow({ device, activePage, setActivePage, setChunkedDevices }: DeviceRowProps) {
  const os = useOs() // Get the client operating system
  const { t } = useTranslation('main') // Get the translation function
  const [editMode, setEditMode] = useState(false) // The edit mode state
  const [loading, setLoading] = useState(false) // The loading state
  const deleteDeviceMutation = trpc.device.deleteDevice.useMutation() // The delete device mutation
  const updateDeviceMutation = trpc.device.updateDevice.useMutation() // The update device mutation
  const { fields, validators } = getDeviceFormFields() // Get the devices form fields

  // Form management function
  const form = useForm<DeviceFormType>({
    initialValues: device,
    validateInputOnChange,
    validate: validators,
  })

  // When device data changes
  useEffect(() => {
    form.setValues(device) // Set the form values to the changed device data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device])

  // Delete device function
  const handleDelete = () => {
    setLoading(true) // Set the loading state to true
    // Delete the device
    deleteDeviceMutation.mutate(
      { model: device.model },
      {
        // On deletion success
        onSuccess: () => {
          setLoading(false) // Set the loading state to false
          // Set the chunked devices
          setChunkedDevices((prev) => {
            let newData = prev.slice() // Create a copy of the chunked devices
            // Delete the device from the current page
            newData[activePage] = newData[activePage].filter((data) => data.model !== device.model)
            // Delete the page if it is empty
            newData = newData.filter((arr) => {
              // If the page is empty
              if (arr.length === 0) {
                setActivePage((prev) => prev - 1) // Set the active page to the previous page
              }
              return arr.length > 0 // Return true if the page is not empty
            })
            return newData // Return the new chunked devices
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

  // Update device function
  const handleUpdate = () => {
    // If the form passed the validation
    if (form.isValid()) {
      setEditMode(false) // Set the edit mode to false
      // If the form values are different from the current device
      if (form.values !== device) {
        // Update the device
        updateDeviceMutation.mutate(
          { ...convertFormDeviceValues(form.values) },
          {
            // On update success
            onSuccess: () => {
              CreateNotification(t('updatedSuccessfully'), 'green', os === 'ios' ? true : false) // Create a success notification
            },
            // On update error
            onError: () => {
              form.setValues(device) // Set the form values to the current device
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
        {fields.map((field, index) => (
          <td key={index}>
            <DeviceTableFormInput
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
              {t('editDevice')}
            </Button>
          ) : (
            <Button fullWidth onClick={handleUpdate} color='lime' variant='light' type='submit'>
              {t('updateDevice')}
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
            {loading ? t('loading') : t('deleteDevice')}
          </Button>
        </td>
      </tr>
    </>
  )
}

type DeviceTableFormInputProps = {
  editMode: boolean
  inputName: keyof DeviceFormType
  disabled?: boolean
  form: UseFormReturnType<DeviceFormType>
}

function DeviceTableFormInput({ form, inputName, disabled, editMode }: DeviceTableFormInputProps) {
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
