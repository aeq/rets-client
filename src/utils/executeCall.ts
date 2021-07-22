import axios, { AxiosRequestConfig } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { Store, CookieJar } from 'tough-cookie'
import { promises as fs, createWriteStream } from 'fs'
import { createHash } from 'crypto'

// import { loginParser } from 'parsers'
import { PassThrough, Readable, Transform } from 'stream'
import { maxHeaderSize } from 'http'
import { deflateRaw } from 'zlib'
import {
  IRetsResponse,
  IRetsClientOptions,
  IRetsRequestConfig,
  RetsRequestMethod,
  RetsKeys,
} from '../types'

axiosCookieJarSupport(axios)
const cookieJar = new CookieJar()

const generateHeaders = () => ({
  'User-Agent': 'RETS NodeJS-Client/1.x',
  'RETS-Version': 'RETS/1.7',
})

interface ExecuteCallType {
  stream: Readable
  headers: Record<string, string>
}

export const executeCall = async (
  config: IRetsRequestConfig,
  payload?: any,
  headers?: any,
): Promise<any> => {
  const { method, url, auth, debugResponseFilename } = config

  const instance = axios.create()

  const result = await instance({
    jar: cookieJar,
    method,
    url,
    headers: {
      ...generateHeaders(),
      ...headers,
    },
    auth,
    withCredentials: true,
    responseType: 'stream',
    // transformResponse: (data, headers) => {

    // },
    ...(method === RetsRequestMethod.Get ? { params: { ...payload } } : { data: { ...payload } }),
  })

  const { data, headers: responseHeaders } = result

  const debugFilename =
    typeof debugResponseFilename === 'function'
      ? debugResponseFilename(config)
      : debugResponseFilename

  const stream = new PassThrough()
  const fileSave = new PassThrough()

  if (debugFilename !== undefined) {
    // console.log('write to', debugFilename)
    // fileSave.on('data', (data) => console.log('data', data))
    // fileSave.on('close', () => console.log('close', debugFilename))
    fileSave.pipe(createWriteStream(debugFilename))
  }

  data.pipe(stream) // .pipe(fileSave)

  return { stream, headers: responseHeaders }
}
