import { createWriteStream } from 'fs'
import { PassThrough } from 'stream'
import { parse } from 'parse-multipart-data'

import { StreamToString } from '../stream'
import { IRetsObjectOptions, IRetsRequestConfig, RetsFormat } from '../types'
import { executeCall } from '../utils'
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
    const boundary = isMultipart && boundaryMatches.length > 0 ? boundaryMatches[1] : null

    const streamToString = new StreamToString()
    const outputStream = new PassThrough()

    // stream.on('error', (err) => console.log('error', err))
    // stream.on('end', () => console.log('end'))
    // stream.on('data', (chunk) => console.log('data', chunk))
    // stream.on('close', () => console.log('close'))
    // stream.on('finish', () => console.log('finish'))
    // outputStream.on('data', (chunk) => console.log('data', chunk))

    stream.pipe(outputStream).pipe(streamToString)
    outputStream.pipe(createWriteStream('output.txt'))
    // console.log('streaming...', stream)

    // wait for stream to end before returning collected objects
    await new Promise((fulfill) => outputStream.on('close', fulfill))

    console.log('finished!!!', streamToString.parts, streamToString.toBuffer())

    const parts = parse(streamToString.toBuffer(), boundary)
    console.log('parts', parts)

    return parts
  }
