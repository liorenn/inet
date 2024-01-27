import { Device, User } from '@prisma/client'
import { DeviceSchemaType, UserSchemaType } from '@/models/schemas'

import type { DeviceFormType } from '@/components/admin/DeviceManagement'
import type { UserFormType } from '@/components/admin/UserManagement'

export type UserPropertyName = keyof User

class UserProperty {
  name: UserPropertyName
  regex: RegExp
  disabled?: boolean

  constructor(name: UserPropertyName, regex: RegExp, disabled?: boolean) {
    this.name = name
    this.regex = regex
    this.disabled = disabled
  }
}

export class FormDefaultValues {
  email: string
  password: string
  username: string
  name: string
  phone: string
  accessKey: number

  constructor(
    email: string,
    password: string,
    username: string,
    name: string,
    phone: string,
    accessKey: number
  ) {
    this.email = email
    this.password = password
    this.username = username
    this.name = name
    this.phone = phone
    this.accessKey = accessKey
  }
}

export class SignInForm {
  email: UserProperty
  password: UserProperty
  constructor() {
    this.email = {
      name: 'email',
      regex: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
    }
    this.password = {
      name: 'password',
      regex: /^[A-Za-z\d_.!@#$%^&*]{5,}$/,
    }
  }
  getFileds() {
    return [this.email, this.password]
  }
  getDefaultValues(): Partial<FormDefaultValues> {
    return {
      email: 'lior.oren06@gmail.com',
      password: '123456',
    }
  }
  getValidators() {
    const validators: { [key: string]: (value: string) => string | null } = {}
    this.getFileds().forEach(({ name, regex }) => {
      validators[name] = (value: string | number) =>
        regex.test(value.toString()) ? null : `${name} is not valid`
    })
    return validators
  }
}
class UserForm extends SignInForm {
  username: UserProperty
  name: UserProperty
  phone: UserProperty

  constructor() {
    super()
    this.username = {
      name: 'username',
      regex: /^[A-Za-z\d_.]{5,}$/,
    }
    this.name = {
      name: 'name',
      regex: /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/,
    }
    this.phone = {
      name: 'phone',
      regex: /^0\d{1,2}-?\d{7}$/,
    }
  }
}
export class AccountForm extends UserForm {
  constructor() {
    super()
  }
  getFileds(): UserProperty[] {
    return [this.username, this.name, this.phone, this.password]
  }
  getDefaultValues() {
    return {
      username: '',
      name: '',
      password: '',
      phone: '',
    }
  }
}
export class SignUpForm extends AccountForm {
  constructor() {
    super()
  }

  getFileds(): UserProperty[] {
    return [this.email, this.username, this.name, this.password, this.phone]
  }
  getDefaultValues() {
    return {
      email: 'lior.oren10@gmail.com',
      name: 'Lior Oren',
      phone: '0548853393',
      username: 'lioren10',
      password: '123456',
    }
  }
}
export class UserManagementForm extends SignUpForm {
  accessKey: UserProperty
  constructor() {
    super()
    this.accessKey = { name: 'accessKey', regex: /^\d$/ }
    this.email = {
      name: 'email',
      regex: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
      disabled: true,
    }
  }
  getFileds(): UserProperty[] {
    return [this.email, this.username, this.name, this.phone, this.password, this.accessKey]
  }
  getDefaultValues() {
    return {
      email: '',
      username: '',
      name: '',
      phone: '',
      password: '',
      accessKey: '',
    }
  }
}

export function convertFormUserValues(values: UserFormType): UserSchemaType {
  return {
    ...values,
    accessKey: values.accessKey === '' ? 0 : Number(values.accessKey),
  }
}

type DeviceField = {
  name: keyof Device
  regex: RegExp
  disabled?: boolean
}

export function getDevicesFields() {
  const nullableStringRegex = /^([A-Za-z0-9 _,]{3,})?$/
  const floatRegex = /^[+-]?\d*\.?\d+$/
  const nullableFloatRegex = /^([+-]?\d*\.?\d+)?$/
  const stringRegex = /^[A-Za-z0-9 _,]{3,}$/
  const booleanRegex = /^(true|false)?$/
  const numberRegex = /^(-?\d+)?$/

  const fields: DeviceField[] = [
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
    resistanceRating: '',
  }

  return { fields, validators, defaultValues }
}

export function convertFormDeviceValues(values: DeviceFormType): DeviceSchemaType {
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
    resistanceRating: values.resistanceRating === '' ? undefined : values.resistanceRating,
  }
}

export function convertDeviceValues(values: Device): DeviceFormType {
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
    batterySize: values.batterySize === null ? '' : values.batterySize.toString(),
    storage: values.storage === null ? '' : values.storage.toString(),
    cpu: values.cpu === null ? '' : values.cpu.toString(),
    gpu: values.gpu === null ? '' : values.gpu.toString(),
    memory: values.memory === null ? '' : values.memory.toString(),
    magsafe: values.magsafe === null ? '' : values.magsafe.toString(),
    screenSize: values.screenSize === null ? '' : values.screenSize.toString(),
    screenType: values.screenType === null ? '' : values.screenType,
    resistanceRating: values.resistanceRating === null ? '' : values.resistanceRating,
  }
}
