import { Device, User } from '@prisma/client'
import { DeviceSchemaType, UserSchemaType } from '@/models/schemas'

import type { DeviceFormType } from '@/components/admin/DeviceManagement'
import type { UserFormType } from '@/components/admin/UserManagement'

// Define the user properties type
export type InputPropertyName = keyof User

// Define the user property class
class InputProperty {
  name: InputPropertyName // Property name
  regex: RegExp // Regular expression for validation
  disabled?: boolean // Is the property disabled

  // Constructor for the class
  constructor(name: InputPropertyName, regex: RegExp, disabled?: boolean) {
    this.name = name
    this.regex = regex
    this.disabled = disabled
  }
}
// Define the form default values class
export class FormDefaultValues {
  email: string // The user email
  password: string // The user password
  username: string // The user username
  name: string // The user name
  phone: string // The user phone
  accessKey: string // The user access key

  // Constructor for the class
  constructor(
    email: string,
    password: string,
    username: string,
    name: string,
    phone: string,
    accessKey: string
  ) {
    this.email = email
    this.password = password
    this.username = username
    this.name = name
    this.phone = phone
    this.accessKey = accessKey
  }
}

// Define the sign in form class
export class SignInForm {
  email: InputProperty // The user email
  password: InputProperty // The user password

  // Constructor for the class
  constructor() {
    this.email = {
      name: 'email',
      regex: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/
    }
    this.password = {
      name: 'password',
      regex: /^[A-Za-z\d_.!@#$%^&*]{5,}$/
    }
  }

  // Get the user properties from the form
  getFileds() {
    return [this.email, this.password]
  }

  // Get the default values for the form
  getDefaultValues(): Partial<FormDefaultValues> {
    return {
      email: '',
      password: ''
    }
  }

  // Get the validators for the form
  getValidators() {
    const validators: { [key: string]: (value: string) => string | null } = {} // Create an object to store the validators
    this.getFileds().forEach(({ name, regex }) => {
      validators[name] = (value: string | number) =>
        regex.test(value.toString()) ? null : `${name} is not valid` // Add the validator
    })
    return validators // Return the validators
  }
}

// Define the user form class that extends the sign in form class
class UserForm extends SignInForm {
  username: InputProperty // The user username
  name: InputProperty // The user name
  phone: InputProperty // The user phone

  // Constructor for the class
  constructor() {
    super() // Call the constructor of the parent class
    this.username = {
      name: 'username',
      regex: /^[A-Za-z\d_.]{5,}$/
    }
    this.name = {
      name: 'name',
      regex: /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/
    }
    this.phone = {
      name: 'phone',
      regex: /^0\d{1,2}-?\d{7}$/
    }
  }
}

// Define the account form class that extends the user form class
export class AccountForm extends UserForm {
  // Constructor for the class
  constructor() {
    super() // Call the constructor of the parent class
  }

  // Get the user properties from the form
  getFileds(): InputProperty[] {
    return [this.username, this.name, this.phone]
  }

  // Get the default values for the form
  getDefaultValues() {
    return {
      username: '',
      name: '',
      password: '',
      phone: ''
    }
  }
}

// Define the sign up form class that extends the account form class
export class SignUpForm extends UserForm {
  // Constructor for the class
  constructor() {
    super() // Call the constructor of the parent class
  }

  // Get the user properties from the form
  getFileds(): InputProperty[] {
    return [this.email, this.username, this.name, this.password, this.phone]
  }
  // Get the default values for the form
  getDefaultValues() {
    return {
      email: '',
      name: '',
      phone: '',
      username: '',
      password: ''
    }
  }
}

// Define the user management form class that extends the sign up form class
export class UserManagementForm extends UserForm {
  accessKey: InputProperty // The user access key

  // Constructor for the class
  constructor() {
    super() // Call the constructor of the parent class
    this.accessKey = { name: 'accessKey', regex: /^\d$/ }
    this.email = {
      name: 'email',
      regex: /^[A-Za-z]+(\.?\w+)*@\w+(\.?\w+)?$/,
      disabled: true
    }
  }

  // Get the user properties from the form
  getFileds(): InputProperty[] {
    return [this.email, this.username, this.name, this.phone, this.password, this.accessKey]
  }

  // Get the default values for the form
  getDefaultValues() {
    return {
      email: '',
      username: '',
      name: '',
      phone: '',
      password: '',
      accessKey: ''
    }
  }
}

// Convert the user values to string values
export function convertFormUserValues(values: UserFormType): UserSchemaType {
  return {
    ...values,
    accessKey: values.accessKey === '' ? 0 : Number(values.accessKey)
  }
}

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
