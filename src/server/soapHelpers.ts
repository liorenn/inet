import { XMLBuilder, XMLParser } from 'fast-xml-parser'

export const soapRequestHeaders = {
  'Content-Type': 'text/xml;charset=UTF-8',
}

type MethodParameter = {
  Name: string
  Value: string
}

export function createSoapRequestXml(
  Method: string,
  Parameters: MethodParameter
) {
  return `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:${Method}><tem:${Parameters.Name}>${Parameters.Value}</tem:${Parameters.Name}></tem:${Method}>
    </soapenv:Body>
  </soapenv:Envelope>
  `
}

export function getResultFromResponse(Method: string, xml: any): string {
  const parser = new XMLParser()
  const json = parser.parse(xml)
  return json['soap:Envelope']['soap:Body'][`${Method} Response`][
    `${Method} Result`
  ]
}
