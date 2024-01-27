import { Button, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { convertDeviceValues, convertFormDeviceValues, getDevicesFields } from '@/models/forms'
import { managerAccessKey, validateInputOnChange } from 'config'
import { useOs, useViewportSize } from '@mantine/hooks'

import { CreateNotification } from '@/utils/utils'
import type { Device } from '@prisma/client'
import Loader from '@/components/layout/Loader'
import { deviceSchema } from '@/models/schemas'
import { trpc } from '@/utils/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export type DeviceFormType = {
  [K in keyof Device]: string
}

type Props = {
  accessKey: number
}

export default function DeviceManagement({ accessKey }: Props) {
  const router = useRouter()
  const { width } = useViewportSize()
  const { t } = useTranslation('translations')
  const [devices, setDevices] = useState<DeviceFormType[]>([])
  const fieldNames = Object.keys(deviceSchema.shape)
  const devicesDataQuery = trpc.device.getDevicesData.useQuery()
  if (accessKey < managerAccessKey) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/')
  }

  useEffect(() => {
    if (devicesDataQuery.data) {
      setDevices(devicesDataQuery.data.map((device) => convertDeviceValues(device)))
    }
  }, [devicesDataQuery.data])

  return (
    <>
      {devicesDataQuery.isLoading ? (
        <Loader />
      ) : (
        <ScrollArea type={width < 400 ? 'always' : 'auto'}>
          <Table mb='md' withBorder withColumnBorders>
            <thead>
              <tr>
                {fieldNames.map((name, index) => (
                  <th key={index}>{t(name)}</th>
                ))}
                <th>{t('updateDevice')}</th>
                <th>{t('deleteDevice')}</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <DeviceRow setDevices={setDevices} device={device} key={index} />
              ))}
              <DeviceInsertRow setDevices={setDevices} />
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  )
}

type DeviceInsertRowProps = { setDevices: Dispatch<SetStateAction<DeviceFormType[]>> }

function DeviceInsertRow({ setDevices }: DeviceInsertRowProps) {
  const os = useOs()
  const { t } = useTranslation('translations')
  const [loading, setLoading] = useState(false)
  const insertDeviceMutation = trpc.device.insertDevice.useMutation()
  const { fields, validators, defaultValues } = getDevicesFields()
  const form = useForm<DeviceFormType>({
    initialValues: defaultValues,
    validateInputOnChange,
    validate: validators,
  })

  const handleInsert = () => {
    setLoading(true)
    insertDeviceMutation.mutate(
      { ...convertFormDeviceValues(form.values) },
      {
        onSuccess: () => {
          setLoading(false)
          setDevices((prev) => [...prev, form.values])
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
  setDevices: Dispatch<SetStateAction<DeviceFormType[]>>
}

function DeviceRow({ device, setDevices }: DeviceRowProps) {
  const os = useOs()
  const { t } = useTranslation('translations')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const deleteDeviceMutation = trpc.device.deleteDevice.useMutation()
  const updateDeviceMutation = trpc.device.updateDevice.useMutation()
  const { fields, validators } = getDevicesFields()
  const form = useForm<DeviceFormType>({
    initialValues: device,
    validateInputOnChange,
    validate: validators,
  })

  useEffect(() => {
    form.setValues(device)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device])

  const handleDelete = () => {
    setLoading(true)
    deleteDeviceMutation.mutate(
      { model: device.model },
      {
        onSuccess: () => {
          setLoading(false)
          setDevices((prev) => prev.filter((device) => device.model !== device.model))
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
      if (form.values !== device) {
        updateDeviceMutation.mutate(
          { ...convertFormDeviceValues(form.values) },
          {
            onSuccess: () => {
              CreateNotification(t('updatedSuccessfully'), 'green', os === 'ios' ? true : false)
            },
            onError: () => {
              form.setValues(device)
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
