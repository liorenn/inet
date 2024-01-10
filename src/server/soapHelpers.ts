import { XMLParser } from 'fast-xml-parser'

export const soapRequestHeaders = {
  'Content-Type': 'text/xml;charset=UTF-8',
}

type MethodParameter = {
  Name: string
  Value: string
}

export function createSoapRequestXml(Method: string, Parameters: MethodParameter) {
  return `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:${Method}><tem:${Parameters.Name}>${Parameters.Value}</tem:${Parameters.Name}></tem:${Method}>
    </soapenv:Body>
  </soapenv:Envelope>
  `
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getResultFromResponse(Method: string, xml: any): string {
  const parser = new XMLParser()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
  const json = parser.parse(xml)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return json['soap:Envelope']['soap:Body'][`${Method} Response`][`${Method} Result`]
}
