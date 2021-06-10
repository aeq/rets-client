import { parse, X2jOptionsOptional } from 'fast-xml-parser'
import { promises as fs } from 'fs'

import { RetsKeys } from '../types'

const defaultParseOptions = {
  // fast-xml-parser config
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: false,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, // "strict"
}

export const parseRetsResponse = (data: any, headers?: any) => {
  // console.log('parseRetsResponse')

  const parseOptions = {
    ...defaultParseOptions,
  }
  const parsed = parse(data, parseOptions)

  return parsed
}
