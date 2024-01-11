import { Button, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturnType, useForm } from '@mantine/form'
import { convertDeviceValues, convertFormDeviceValues, getDevicesFields } from '@/models/forms'

import { CreateNotification } from '@/utils/utils'
import type { Device } from '@prisma/client'
import Loader from '../layout/Loader'
import { deviceSchema } from '@/models/schemas'
import { managerAccessKey } from 'config'
import { trpc } from '@/server/client'
import { useOs } from '@mantine/hooks'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export type formType = {
  [K in keyof Device]: string
}

type props = {
  accessKey: number
}

export default function DeviceManagement({ accessKey }: props) {
  const router = useRouter()
  const { t } = useTranslation('translations')
  const [devices, setDevices] = useState<formType[]>([])
  const fieldNames = Object.keys(deviceSchema.shape)
  const { data: tableData, isLoading } = trpc.device.getDevicesData.useQuery()
  if (accessKey < managerAccessKey) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/')
  }

  useEffect(() => {
    if (tableData) {
      setDevices(tableData.map((device) => convertDeviceValues(device)))
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
                <th>{t('updateDevice')}</th>
                <th>{t('deleteDevice')}</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((data, index) => (
                <DeviceRow setDevices={setDevices} data={data} key={index} />
              ))}
              <InsertRow setUsers={setDevices} />
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  )
}

function InsertRow({ setUsers }: { setUsers: Dispatch<SetStateAction<formType[]>> }) {
  const os = useOs()
  const { t } = useTranslation('translations')
  const [loading, setLoading] = useState(false)
  const { mutate: mutateInsert } = trpc.device.insertDevice.useMutation()
  const { fields, validators, defaultValues } = getDevicesFields()
  const form = useForm<formType>({
    initialValues: defaultValues,
    validateInputOnChange: true,
    validate: validators,
  })

  const handleInsert = () => {
    setLoading(true)
    mutateInsert(
      { ...convertFormDeviceValues(form.values) },
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
            {loading ? t('loading') : t('insertDevice')}
          </Button>
        </td>
      </tr>
    </>
  )
}

function DeviceRow({
  data,
  setDevices,
}: {
  data: formType
  setDevices: Dispatch<SetStateAction<formType[]>>
}) {
  const os = useOs()
  const { t } = useTranslation('translations')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const { mutate: mutateDelete } = trpc.device.deleteDevice.useMutation()
  const { mutate: mutateUpdate } = trpc.device.updateDevice.useMutation()
  const { fields, validators } = getDevicesFields()
  const form = useForm<formType>({
    initialValues: data,
    validateInputOnChange: true,
    validate: validators,
  })

  const handleDelete = () => {
    setLoading(true)
    mutateDelete(
      { model: data.model },
      {
        onSuccess: () => {
          setLoading(false)
          setDevices((prev) => prev.filter((device) => device.model !== data.model))
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
          { ...convertFormDeviceValues(form.values) },
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
