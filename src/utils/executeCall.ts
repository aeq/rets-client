import axios, { AxiosRequestConfig } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { Store, CookieJar } from 'tough-cookie'
import { promises as fs, createWriteStream } from 'fs'

// import { loginParser } from 'parsers'
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

export const executeCall = async (config: IRetsRequestConfig, payload?: any): Promise<any> => {
  const { method, url, auth } = config

  const instance = axios.create()

  const result = await instance({
    jar: cookieJar,
    method,
    url,
    headers: generateHeaders(),
    auth,
    withCredentials: true,
    responseType: 'stream',
    // transformResponse: parseRetsResponse,
    ...(method === RetsRequestMethod.Get ? { params: { ...payload } } : { data: { ...payload } }),
  })

  return result.data
}
