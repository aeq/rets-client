import { createWriteStream } from 'fs'
import { PassThrough } from 'stream'

import { StreamToString, ObjectParser } from '../stream'
import { IRetsObjectOptions, IRetsRequestConfig, RetsFormat } from '../types'
import { executeCall, bufferSplit } from '../utils'
// import { promises as fs } from 'fs'

export const getObjectAction =
  (propsActionConfig: IRetsRequestConfig) =>
  async (userOptions: IRetsObjectOptions): Promise<Array<any>> => {
    const { mime, resource, type, contentId, id, withLocation, culture } = {
      ...userOptions,
    }

    const actionConfig = {
      ...propsActionConfig,
    }

    const data = {
      Resource: resource,
      Type: type,
      ID: `${contentId}:${id || '*'}`,
      Location: withLocation ? 1 : 0,
      // Culture: culture,
    }

    const headers = {
      Accept: mime || 'image/jpeg',
    }

    const { stream, headers: responseHeaders } = actionConfig
      ? await executeCall(actionConfig, data, headers)
      : null

    const isMultipart = responseHeaders['content-type']
      ? responseHeaders['content-type'].match(/multipart/).length > 0
      : false
    const boundaryMatches = responseHeaders['content-type'].match(/boundary=([^;]+);/)
    const boundary =
      isMultipart && boundaryMatches.length > 0 ? Buffer.from(boundaryMatches[1]) : Buffer.from('')
    const boundaryPrefix = Buffer.from('--')

    const objectParser = new ObjectParser({
      boundary,
      boundaryPrefix,
    })
    const outputStream = new PassThrough()

    stream.pipe(objectParser)
    /// debug
    // stream.pipe(outputStream).pipe(objectParser)
    // outputStream.pipe(createWriteStream('test.txt'))

    // wait for stream to end before returning collected objects
    await new Promise((fulfill) => objectParser.on('close', fulfill))

    return objectParser.objects
  }

// console.log('finished!!!', streamToString.parts, streamToString.toBuffer())

// const parts = boundary ? bufferSplit(streamToString.toBuffer(), boundary) : []
// const HEADER_BOUNDARY = '\n\n'
// const HEADER_ITEM_BOUNDARY = '\n'

// console.log('parts', parts.length)

// return parts.map((part) => {
//   // get headers
//   const headerSplit = bufferSplit(part, HEADER_BOUNDARY)

//   if (headerSplit.length > 1) {
//     const header = headerSplit[0]
//     const body = part.slice(part.indexOf(HEADER_BOUNDARY) + HEADER_BOUNDARY.length)
//     // const headerItems = header.split(HEADER_ITEM_BOUNDARY)
//     // const headerData = headerItems.reduce((accumulator, headerItem) => {
//     //   const headerItemParts = headerItem.split('=')
//     //   return {
//     //     ...accumulator,
//     //     ...(headerItemParts.length ? { [headerItemParts[0]]: headerItemParts[1] } : {}),
//     //   }
//     // }, {})

//     return {
//       // ...headerData,
//       header,
//       // body,
//     }
//   }
//   return undefined
