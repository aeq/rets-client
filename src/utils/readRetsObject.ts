import { RetsObject } from '../types'
import { bufferSplit } from './bufferSplit'

const HEADER_BOUNDARY = '\r\n\r\n'
const HEADER_ITEM_BOUNDARY = '\r\n'
const HEADER_ITEM_PARTS_BOUNDARY = ': '

const readRetsHeaders = (buffer: Buffer): Record<string, any> => {
  const headers = buffer.toString().split(HEADER_ITEM_BOUNDARY)

  return headers.reduce((acc, header) => {
    const [key, value] = header.split(HEADER_ITEM_PARTS_BOUNDARY)

    return {
      ...acc,
      ...(key && value ? { [key]: value } : {}),
    }
  }, {})
}

export const readRetsObject = (buffer: Buffer): RetsObject | undefined => {
  const [header, ...rest] = bufferSplit(buffer, Buffer.from(HEADER_BOUNDARY))

  if (rest === undefined || rest.length === 0) {
    return undefined
  }

  const data = Buffer.concat(rest)
  const parsedHeader = readRetsHeaders(header)

  const contentId = parsedHeader['Content-ID'] ? parsedHeader['Content-ID'] : ''
  const objectId = parsedHeader['Object-ID'] ? parseInt(parsedHeader['Object-ID'], 10) : 1
  const contentType = parsedHeader['Content-Type'] ? parsedHeader['Content-Type'] : ''
  const description = parsedHeader.Description ? parsedHeader.Description : ''

  return {
    data,
    contentId,
    objectId,
    contentType,
    description,
  }
}
