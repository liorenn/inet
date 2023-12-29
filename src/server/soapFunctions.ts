import soapRequest from 'easy-soap-request'
import { soapServerUrl } from '../../config'
import type { deviceSchemaType, userSchemaType } from '../models/schemas'
import {
  soapRequestHeaders,
  createSoapRequestXml,
  getResultFromResponse,
} from './soapHelpers'

function convertObjectToJson(object: deviceSchemaType | userSchemaType) {
  return { Name: 'json', Value: JSON.stringify(object) }
}
export async function insertUserSoap({ input }: { input: userSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('InsertUser', convertObjectToJson(input)),
  })
  return getResultFromResponse('InsertUser', response.body)
}
export async function updateUserSoap({ input }: { input: userSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpdateUser', convertObjectToJson(input)),
  })
  return getResultFromResponse('UpdateUser', response.body)
}
export async function deleteUserSoap({ email }: { email: string }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('DeleteUser', { Name: 'email', Value: email }),
  })
  return getResultFromResponse('DeleteUser', response.body)
}

export async function insertDeviceSoap({ input }: { input: deviceSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('InsetDevice', convertObjectToJson(input)),
  })
  return getResultFromResponse('InsetDevice', response.body)
}

export async function updateDeviceSoap({ input }: { input: deviceSchemaType }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpdateDevice', convertObjectToJson(input)),
  })
  return getResultFromResponse('UpdateDevice', response.body)
}
export async function deleteDeviceSoap({ model }: { model: string }) {
  const { response } = await soapRequest({
    url: soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('DeleteDevice', { Name: 'model', Value: model }),
  })
  return getResultFromResponse('DeleteDevice', response.body)
}
