import soapRequest from 'easy-soap-request'
import { soapServerUrl } from '../../config'
import { deviceSchemaType, userSchemaType } from '../models/schemas'
import {
  soapRequestHeaders,
  createSoapRequestXml,
  getResultFromResponse,
} from './soapHelpers'

export async function insertUserSoap({ input }: { input: userSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('InsertUser', [
      { Name: 'email', Value: input.email },
      { Name: 'username', Value: input.username },
      { Name: 'name', Value: input.name },
      { Name: 'password', Value: input.password },
      { Name: 'phone', Value: input.phone },
      {
        Name: 'accessKey',
        Value: input.accessKey.toString(),
      },
      {
        Name: 'FromReact',
        Value: 'true',
      },
    ]),
  })
  return getResultFromResponse('InsertUser', response.body)
}
export async function updateUserSoap({ input }: { input: userSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpdateUser', [
      { Name: 'email', Value: input.email },
      { Name: 'username', Value: input.username },
      { Name: 'name', Value: input.name },
      { Name: 'password', Value: input.password },
      { Name: 'phone', Value: input.phone },
      {
        Name: 'accessKey',
        Value: input.accessKey.toString(),
      },
      {
        Name: 'FromReact',
        Value: 'true',
      },
    ]),
  })
  return getResultFromResponse('UpdateUser', response.body)
}
export async function deleteUserSoap({ email }: { email: string }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('DeleteUser', [
      { Name: 'email', Value: email },
      {
        Name: 'FromReact',
        Value: 'true',
      },
    ]),
  })
  return getResultFromResponse('DeleteUser', response.body)
}

export async function insertDeviceSoap({ input }: { input: deviceSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('InsetDevice', [
      { Name: 'model', Value: input.model },
      { Name: 'name', Value: input.name },
      { Name: 'type', Value: input.type },
      { Name: 'releaseDate', Value: input.releaseDate.toString() },
      { Name: 'releaseOS', Value: input.releaseOS ?? 'null' },
      { Name: 'releasePrice', Value: input.releasePrice.toString() },
      { Name: 'connector', Value: input.connector },
      { Name: 'biometrics', Value: input.biometrics },
      {
        Name: 'batterySize',
        Value: input.batterySize ? input.batterySize.toString() : 'null',
      },
      { Name: 'chipset', Value: input.chipset },
      { Name: 'weight', Value: input.weight.toString() },
      { Name: 'imageAmount', Value: input.imageAmount.toString() },
      { Name: 'height', Value: input.height.toString() },
      { Name: 'width', Value: input.width.toString() },
      { Name: 'depth', Value: input.depth.toString() },
      {
        Name: 'storage',
        Value: input.storage ? input.storage.toString() : 'null',
      },
      {
        Name: 'cpu',
        Value: input.cpu ? input.cpu.toString() : 'null',
      },
      {
        Name: 'gpu',
        Value: input.gpu ? input.gpu.toString() : 'null',
      },
      {
        Name: 'memory',
        Value: input.memory ? input.memory.toString() : 'null',
      },
      {
        Name: 'magsafe',
        Value: input.magsafe ? 'true' : 'false',
      },
      {
        Name: 'screenSize',
        Value: input.screenSize ? input.screenSize.toString() : 'null',
      },
      {
        Name: 'screenType',
        Value: input.screenType ? input.screenType.toString() : 'null',
      },
      {
        Name: 'resistanceRating',
        Value: input.resistanceRating
          ? input.resistanceRating.toString()
          : 'null',
      },
      {
        Name: 'FromReact',
        Value: 'true',
      },
    ]),
  })
  return getResultFromResponse('InsetDevice', response.body)
}
export async function updateDeviceSoap({ input }: { input: deviceSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpdagteDevice', [
      { Name: 'model', Value: input.model },
      { Name: 'name', Value: input.name },
      { Name: 'type', Value: input.type },
      { Name: 'releaseDate', Value: input.releaseDate.toString() },
      { Name: 'releaseOS', Value: input.releaseOS ?? 'null' },
      { Name: 'releasePrice', Value: input.releasePrice.toString() },
      { Name: 'connector', Value: input.connector },
      { Name: 'biometrics', Value: input.biometrics },
      {
        Name: 'batterySize',
        Value: input.batterySize ? input.batterySize.toString() : 'null',
      },
      { Name: 'chipset', Value: input.chipset },
      { Name: 'weight', Value: input.weight.toString() },
      { Name: 'imageAmount', Value: input.imageAmount.toString() },
      { Name: 'height', Value: input.height.toString() },
      { Name: 'width', Value: input.width.toString() },
      { Name: 'depth', Value: input.depth.toString() },
      {
        Name: 'storage',
        Value: input.storage ? input.storage.toString() : 'null',
      },
      {
        Name: 'cpu',
        Value: input.cpu ? input.cpu.toString() : 'null',
      },
      {
        Name: 'gpu',
        Value: input.gpu ? input.gpu.toString() : 'null',
      },
      {
        Name: 'memory',
        Value: input.memory ? input.memory.toString() : 'null',
      },
      {
        Name: 'magsafe',
        Value: input.magsafe ? 'true' : 'false',
      },
      {
        Name: 'screenSize',
        Value: input.screenSize ? input.screenSize.toString() : 'null',
      },
      {
        Name: 'screenType',
        Value: input.screenType ? input.screenType.toString() : 'null',
      },
      {
        Name: 'resistanceRating',
        Value: input.resistanceRating
          ? input.resistanceRating.toString()
          : 'null',
      },
      {
        Name: 'FromReact',
        Value: 'true',
      },
    ]),
  })
  return getResultFromResponse('UpdagteDevice', response.body)
}
export async function deleteDeviceSoap({ model }: { model: string }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('DeleteDevice', [
      { Name: 'model', Value: model },
      {
        Name: 'FromReact',
        Value: 'true',
      },
    ]),
  })
  return getResultFromResponse('DeleteDevice', response.body)
}

export const deviceToDynamicArray = (input: deviceSchemaType) =>
  [...Object.entries(input)].map(([key, value]) => ({
    Name: key,
    Value: value,
  }))
