import soapRequest from 'easy-soap-request'
import { soapServerUrl } from '../../config'
import { deviceSchemaType, userSchemaType } from '../models/schemas'
import {
  soapRequestHeaders,
  createSoapRequestXml,
  getResultFromResponse,
} from './soapHelpers'

export async function upsertUserSoap({ input }: { input: userSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpsertUser', [
      { Name: 'username', Value: input.username },
      { Name: 'name', Value: input.name },
      { Name: 'password', Value: input.password },
      { Name: 'email', Value: input.email },
      { Name: 'phone', Value: input.phone },
      {
        Name: 'accessKey',
        Value: input.accessKey.toString(),
      },
    ]),
  })
  return getResultFromResponse('UpsertUser', response.body)
}

export async function upsertDeviceSoap({ input }: { input: deviceSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpsertDevice', [
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
    ]),
  })
  return getResultFromResponse('UpsertDevice', response.body)
}

export const deviceToDynamicArray = (input: deviceSchemaType) =>
  [...Object.entries(input)].map(([key, value]) => ({
    Name: key,
    Value: value,
  }))
