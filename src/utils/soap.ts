import { XMLParser } from 'fast-xml-parser'

export const sendSoapRequest: boolean = true
export const soapServerUrl: string =
  'https://localhost:44394/Asp/WebService1.asmx'

export const soapRequestHeaders = {
  'Content-Type': 'text/xml;charset=UTF-8',
}

type MethodParameter = {
  Name: string
  Value: string
}

export function createSoapRequestXml(
  Method: string,
  Parameters: MethodParameter[]
) {
  return `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
     <tem:${Method}>
        ${Parameters.map(
          (property) =>
            `<tem:${property.Name}>${property.Value}</tem:${property.Name}>`
        ).join('')}
     </tem:${Method}>
  </soapenv:Body>
</soapenv:Envelope>
  `
}

export function getResultFromResponse(Method: string, xml: any) {
  const parser = new XMLParser()
  const json = parser.parse(xml)
  return json['soap:Envelope']['soap:Body'][Method + 'Response'][
    Method + 'Result'
  ]
}
