// Importing the XMLParser class from the fast-xml-parser library

import { XMLParser } from 'fast-xml-parser'

// Defining the SOAP request headers
export const soapRequestHeaders = {
  'Content-Type': 'text/xml;charset=UTF-8',
}

// Defining the structure of a method parameter
type MethodParameter = {
  Name: string
  Value: string
}

// Function to create a SOAP request XML
export function createSoapRequestXml(Method: string, Parameter?: MethodParameter) {
  return `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:${Method}>${
    Parameter ? `<tem:${Parameter.Name}>${Parameter.Value}</tem:${Parameter.Name}>` : ''
  }</tem:${Method}>
    </soapenv:Body>
  </soapenv:Envelope>
  `
}

// Function to extract the result from a SOAP response XML
export function getResultFromResponse(Method: string, xml: any): string {
  const parser = new XMLParser() // Create a xml parser
  const json = parser.parse(xml) // Convert the xml to json
  return json['soap:Envelope']['soap:Body'][`${Method}Response`][`${Method}Result`] // Extract the result
}
