import type { formUser } from '../components/admin/UserManagement'
import type { formDevice } from '../components/admin/DeviceManagement'
import { deviceSchemaType, userSchemaType } from './schemas'
import { Device, User } from '@prisma/client'

type userField = {
  name: keyof User
  regex: RegExp
  disabled?: boolean
}

const nullableStringRegex = /^([A-Za-z0-9 _,]{3,})?$/
const floatRegex = /^[+-]?\d*\.?\d+$/
const nullableFloatRegex = /^([+-]?\d*\.?\d+)?$/
const stringRegex = /^[A-Za-z0-9 _,]{3,}$/
const booleanRegex = /^(true|false)?$/
const numberRegex = /^(-?\d+)?$/

export function getUserFields() {
  const fields: userField[] = [
    {
      disabled: true,
      name: 'email',
      regex: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
    },

    { name: 'username', regex: /^[A-Za-z\d_.]{5,}$/ },
    {
      name: 'name',
      regex: /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/,
    },

    {
      name: 'password',
      regex: /^[A-Za-z\d_.!@#$%^&*]{5,}$/,
    },
    { name: 'phone', regex: /^0\d{1,2}-?\d{7}$/ },
    { name: 'accessKey', regex: /^(\d)?$/ },
  ]
  const validators: { [key: string]: (value: string) => string | null } = {}

  fields.forEach(({ name, regex }) => {
    validators[name] = (value: string | number) =>
      regex.test(value.toString()) ? null : `${name} is not valid`
  })

  const defaultValues = {
    accessKey: '',
    email: '',
    name: '',
    phone: '',
    username: '',
    password: '',
  }

  return { fields, validators, defaultValues }
}

export function convertFormUserValues(values: formUser): userSchemaType {
  return {
    ...values,
    accessKey: values.accessKey === '' ? 0 : Number(values.accessKey),
  }
}

type deviceField = {
  name: keyof Device
  regex: RegExp
  disabled?: boolean
}

export function getDevicesFields() {
  const fields: deviceField[] = [
    {
      disabled: true,
      name: 'model',
      regex: stringRegex,
    },
    {
      name: 'name',
      regex: stringRegex,
    },
    {
      name: 'type',
      regex: stringRegex,
    },
    {
      name: 'releaseDate',
      regex: stringRegex,
    },
    {
      name: 'releaseOS',
      regex: stringRegex,
    },
    {
      name: 'releasePrice',
      regex: floatRegex,
    },
    {
      name: 'price',
      regex: floatRegex,
    },
    {
      name: 'connector',
      regex: stringRegex,
    },
    {
      name: 'biometrics',
      regex: stringRegex,
    },
    {
      name: 'batterySize',
      regex: numberRegex,
    },
    {
      name: 'chipset',
      regex: stringRegex,
    },
    {
      name: 'weight',
      regex: floatRegex,
    },
    {
      name: 'imageAmount',
      regex: numberRegex,
    },
    {
      name: 'height',
      regex: floatRegex,
    },
    {
      name: 'width',
      regex: floatRegex,
    },
    {
      name: 'depth',
      regex: floatRegex,
    },
    {
      name: 'storage',
      regex: numberRegex,
    },
    {
      name: 'cpu',
      regex: numberRegex,
    },
    {
      name: 'gpu',
      regex: numberRegex,
    },
    {
      name: 'memory',
      regex: numberRegex,
    },
    {
      name: 'magsafe',
      regex: booleanRegex,
    },
    {
      name: 'screenSize',
      regex: nullableFloatRegex,
    },
    {
      name: 'screenType',
      regex: nullableStringRegex,
    },
    {
      name: 'resistanceRating',
      regex: nullableStringRegex,
    },
  ]
  const validators: { [key: string]: (value: string) => string | null } = {}

  fields.forEach(({ name, regex }) => {
    validators[name] = (value: string | number) =>
      regex.test(value.toString()) ? null : `${name} is not valid`
  })

  const defaultValues: formDevice = {
    model: '',
    name: '',
    type: '',
    releaseDate: '',
    releaseOS: '',
    releasePrice: '',
    price: '',
    connector: '',
    biometrics: '',
    batterySize: '',
    chipset: '',
    weight: '',
    imageAmount: '',
    height: '',
    width: '',
    depth: '',
    storage: '',
    cpu: '',
    gpu: '',
    memory: '',
    magsafe: '',
    screenSize: '',
    screenType: '',
    resistanceRating: '',
  }

  return { fields, validators, defaultValues }
}

export function convertFormDeviceValues(values: formDevice): deviceSchemaType {
  return {
    ...values,
    releaseDate: new Date(values.releaseDate),
    releasePrice: Number(values.releasePrice),
    price: Number(values.price),
    weight: Number(values.weight),
    height: Number(values.height),
    width: Number(values.width),
    depth: Number(values.depth),
    imageAmount: Number(values.imageAmount),
    releaseOS: values.releaseOS === '' ? undefined : values.releaseOS,
    batterySize:
      values.batterySize === '' ? undefined : Number(values.batterySize),
    storage: values.storage === '' ? undefined : Number(values.storage),
    cpu: values.cpu === '' ? undefined : Number(values.cpu),
    gpu: values.gpu === '' ? undefined : Number(values.gpu),
    memory: values.memory === '' ? undefined : Number(values.memory),
    magsafe: values.magsafe === '' ? undefined : Boolean(values.magsafe),
    screenSize:
      values.screenSize === '' ? undefined : Number(values.screenSize),
    screenType: values.screenType === '' ? undefined : values.screenType,
    resistanceRating:
      values.resistanceRating === '' ? undefined : values.resistanceRating,
  }
}

export function convertDeviceValues(values: Device): formDevice {
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return {
    ...values,
    releaseDate: formatter.format(values.releaseDate),
    releasePrice: values.releasePrice.toString(),
    price: values.price.toString(),
    weight: values.weight.toString(),
    height: values.height.toString(),
    width: values.width.toString(),
    depth: values.depth.toString(),
    imageAmount: values.imageAmount.toString(),
    releaseOS: values.releaseOS === null ? '' : values.releaseOS,
    batterySize:
      values.batterySize === null ? '' : values.batterySize.toString(),
    storage: values.storage === null ? '' : values.storage.toString(),
    cpu: values.cpu === null ? '' : values.cpu.toString(),
    gpu: values.gpu === null ? '' : values.gpu.toString(),
    memory: values.memory === null ? '' : values.memory.toString(),
    magsafe: values.magsafe === null ? '' : values.magsafe.toString(),
    screenSize: values.screenSize === null ? '' : values.screenSize.toString(),
    screenType: values.screenType === null ? '' : values.screenType,
    resistanceRating:
      values.resistanceRating === null ? '' : values.resistanceRating,
  }
}
