import { Device, User } from '@prisma/client'
import { DeviceSchemaType, UserRole } from '~/src/models/schemas'

import { DeviceFormType } from '~/src/components/admin/DeviceManagement'

type InputPropertyName = keyof User

type InputProperty = {
  name: InputPropertyName
  regex: RegExp
  disabled?: boolean
}

type FormConfig = {
  fields: InputProperty[]
}

const createInputProperty = (
  name: InputPropertyName,
  regex: RegExp,
  disabled?: boolean
): InputProperty => ({
  name,
  regex,
  disabled
})

export const emailProperty = createInputProperty('email', /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/)
export const passwordProperty = createInputProperty('password', /^[A-Za-z\d_.!@#$%^&*]{5,}$/)
export const usernameProperty = createInputProperty('username', /^[A-Za-z\d_.]{5,}$/)
export const nameProperty = createInputProperty('name', /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/)
export const phoneProperty = createInputProperty('phone', /^0\d{1,2}-?\d{7}$/)
export const roleProperty = createInputProperty('role', /^\d$/)

export type SignInFormType = {
  email: string
  password: string
}

const signInConfig: FormConfig & { defaultValues: SignInFormType } = {
  fields: [emailProperty, passwordProperty],
  defaultValues: {
    email: 'lior.oren06@gmail.com',
    password: '123456'
  }
}

export type AccountFields = Omit<User, 'email' | 'role' | 'id' | 'password'>
export type AccountFieldsNames = keyof AccountFields

const accountConfig: FormConfig & { defaultValues: AccountFields } = {
  fields: [usernameProperty, nameProperty, phoneProperty],
  defaultValues: {
    username: '',
    name: '',
    phone: ''
  }
}

export type SignUpFormType = {
  [K in keyof Omit<User, 'role' | 'id'>]: string
}

const signUpConfig: FormConfig & { defaultValues: SignUpFormType } = {
  fields: [emailProperty, usernameProperty, nameProperty, passwordProperty, phoneProperty],
  defaultValues: {
    email: '',
    name: '',
    phone: '',
    username: '',
    password: ''
  }
}

export type UserFormType = Omit<User, 'role'> & { role: UserRole }

const userManagementConfig: FormConfig & { defaultValues: UserFormType } = {
  fields: [
    { ...emailProperty, disabled: true },
    usernameProperty,
    nameProperty,
    phoneProperty,
    passwordProperty,
    roleProperty
  ],
  defaultValues: {
    id: '',
    email: '',
    username: '',
    name: '',
    phone: '',
    password: '',
    role: 'user'
  }
}

const getValidators = (fields: InputProperty[]) => {
  const validators: { [key: string]: (value: string) => string | null } = {}
  fields.forEach(({ name, regex }) => {
    validators[name] = (value: string) => (regex.test(value) ? null : `${name} is not valid`)
  })
  return validators
}

export { signInConfig, accountConfig, signUpConfig, userManagementConfig, getValidators }
// Define the device form type
type DeviceField = {
  name: keyof Device
  regex: RegExp
  disabled?: boolean
}

// Define the device form fields
export function getDeviceFormFields() {
  // Define the regexes for the fields
  const nullableStringRegex = /^([A-Za-z0-9 _,]{3,})?$/
  const floatRegex = /^[+-]?\d*\.?\d+$/
  const nullableFloatRegex = /^([+-]?\d*\.?\d+)?$/
  const stringRegex = /^[A-Za-z0-9 _,]{2,}$/
  const booleanRegex = /^(true|false)?$/
  const numberRegex = /^(-?\d+)?$/

  // Assign for each field a regex
  const fields: DeviceField[] = [
    {
      disabled: true,
      name: 'model',
      regex: stringRegex
    },
    {
      name: 'name',
      regex: stringRegex
    },
    {
      name: 'type',
      regex: stringRegex
    },
    {
      name: 'releaseDate',
      regex: stringRegex
    },
    {
      name: 'releaseOS',
      regex: nullableStringRegex
    },
    {
      name: 'releasePrice',
      regex: floatRegex
    },
    {
      name: 'price',
      regex: floatRegex
    },
    {
      name: 'connector',
      regex: stringRegex
    },
    {
      name: 'biometrics',
      regex: stringRegex
    },
    {
      name: 'batterySize',
      regex: numberRegex
    },
    {
      name: 'chipset',
      regex: stringRegex
    },
    {
      name: 'weight',
      regex: floatRegex
    },
    {
      name: 'imageAmount',
      regex: numberRegex
    },
    {
      name: 'height',
      regex: floatRegex
    },
    {
      name: 'width',
      regex: floatRegex
    },
    {
      name: 'depth',
      regex: floatRegex
    },
    {
      name: 'storage',
      regex: numberRegex
    },
    {
      name: 'cpu',
      regex: numberRegex
    },
    {
      name: 'gpu',
      regex: numberRegex
    },
    {
      name: 'memory',
      regex: numberRegex
    },
    {
      name: 'magsafe',
      regex: booleanRegex
    },
    {
      name: 'screenSize',
      regex: nullableFloatRegex
    },
    {
      name: 'screenType',
      regex: nullableStringRegex
    },
    {
      name: 'resistanceRating',
      regex: nullableStringRegex
    }
  ]

  const validators: { [key: string]: (value: string) => string | null } = {} // Create an object to store the validators

  fields.forEach(({ name, regex }) => {
    validators[name] = (value: string | number) =>
      regex.test(value.toString()) ? null : `${name} is not valid` // Add the validator
  })

  // Define the dafult values
  const defaultValues: DeviceFormType = {
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
    resistanceRating: ''
  }

  return { fields, validators, defaultValues } // Return the device form fields
}

// Convert string values to device
export function convertFormDeviceValues(values: DeviceFormType): DeviceSchemaType {
  // Return all values as the device values
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
    batterySize: values.batterySize === '' ? undefined : Number(values.batterySize),
    storage: values.storage === '' ? undefined : Number(values.storage),
    cpu: values.cpu === '' ? undefined : Number(values.cpu),
    gpu: values.gpu === '' ? undefined : Number(values.gpu),
    memory: values.memory === '' ? undefined : Number(values.memory),
    magsafe: values.magsafe === '' ? undefined : Boolean(values.magsafe),
    screenSize: values.screenSize === '' ? undefined : Number(values.screenSize),
    screenType: values.screenType === '' ? undefined : values.screenType,
    resistanceRating: values.resistanceRating === '' ? undefined : values.resistanceRating
  }
}

// Convert device values to string values
export function convertDeviceValues(values: Device): DeviceFormType {
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) // Create a date formatter
  // Return all values as strings
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
    batterySize: values.batterySize === null ? '' : values.batterySize.toString(),
    storage: values.storage === null ? '' : values.storage.toString(),
    cpu: values.cpu === null ? '' : values.cpu.toString(),
    gpu: values.gpu === null ? '' : values.gpu.toString(),
    memory: values.memory === null ? '' : values.memory.toString(),
    magsafe: values.magsafe === null ? '' : values.magsafe.toString(),
    screenSize: values.screenSize === null ? '' : values.screenSize.toString(),
    screenType: values.screenType === null ? '' : values.screenType,
    resistanceRating: values.resistanceRating === null ? '' : values.resistanceRating
  }
}
