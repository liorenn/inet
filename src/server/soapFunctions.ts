import type { DeviceSchemaType, UserSchemaType } from '@/models/schemas' // Importing schema types
import {
  createSoapRequestXml,
  getResultFromResponse,
  soapRequestHeaders,
} from '@/server/soapHelpers'

import { allDataType } from './routers/auth'
import { env } from '@/server/env' // Importing server environment variables
import soapRequest from 'easy-soap-request' // Importing the easy-soap-request library for making SOAP requests

// Function to convert an object to JSON format
function convertObjectToJson(object: DeviceSchemaType | UserSchemaType | allDataType) {
  return { Name: 'json', Value: JSON.stringify(object) }
}

// Function to insert a user using a SOAP request
export async function restoreDatabaseSoap() {
  const { response } = await soapRequest({
    // Making a SOAP request to insert a user
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('RestoreDatabase'), // Converting the input object to XML
  })
  return getResultFromResponse('RestoreDatabase', response.body) // Extracting the result from the response
}

// Function to insert a user using a SOAP request
export async function backupDatabaseSoap({ input }: { input: allDataType }) {
  const { response } = await soapRequest({
    // Making a SOAP request to insert a user
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('BackupDatabase', {
      Name: 'data',
      Value: JSON.stringify(input),
    }), // Converting the input object to XML
  })
  return getResultFromResponse('BackupDatabase', response.body) // Extracting the result from the response
}

// Function to insert a user using a SOAP request
export async function insertUserSoap({ input }: { input: UserSchemaType }) {
  const { response } = await soapRequest({
    // Making a SOAP request to insert a user
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('InsertUser', convertObjectToJson(input)), // Converting the input object to XML
  })
  return getResultFromResponse('InsertUser', response.body) // Extracting the result from the response
}

// Function to update a user using a SOAP request
export async function updateUserSoap({ input }: { input: UserSchemaType }) {
  const { response } = await soapRequest({
    // Making a SOAP request to update a user
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpdateUser', convertObjectToJson(input)), // Converting the input object to XML
  })
  return getResultFromResponse('UpdateUser', response.body) // Extracting the result from the response
}

// Function to delete a user using a SOAP request
export async function deleteUserSoap({ email }: { email: string }) {
  const { response } = await soapRequest({
    // Making a SOAP request to delete a user
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('DeleteUser', { Name: 'email', Value: email }),
  })
  return getResultFromResponse('DeleteUser', response.body) // Extracting the result from the response
}

// Function to insert a device using a SOAP request
export async function insertDeviceSoap({ input }: { input: DeviceSchemaType }) {
  const { response } = await soapRequest({
    // Making a SOAP request to insert a device
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('InsetDevice', convertObjectToJson(input)), // Converting the input object to XML
  })
  return getResultFromResponse('InsetDevice', response.body) // Extracting the result from the response
}

// Function to update a device using a SOAP request
export async function updateDeviceSoap({ input }: { input: DeviceSchemaType }) {
  const { response } = await soapRequest({
    // Making a SOAP request to update a device
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('UpdateDevice', convertObjectToJson(input)), // Converting the input object to XML
  })
  return getResultFromResponse('UpdateDevice', response.body) // Extracting the result from the response
}

// Function to delete a device using a SOAP request
export async function deleteDeviceSoap({ model }: { model: string }) {
  const { response } = await soapRequest({
    // Making a SOAP request to delete a device
    url: env.soapServerUrl,
    headers: soapRequestHeaders,
    xml: createSoapRequestXml('DeleteDevice', { Name: 'model', Value: model }),
  })
  return getResultFromResponse('DeleteDevice', response.body) // Extracting the result from the response
}
