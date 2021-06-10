import axios, { AxiosRequestConfig } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { Store, CookieJar } from 'tough-cookie'
import { promises as fs } from 'fs'

import {
  IRetsResponse,
  IRetsClientOptions,
  IRetsRequestConfig,
  RetsRequestMethod,
  RetsKeys,
} from '../types'
import { parseRetsResponse } from './parseRetsResponse'

axiosCookieJarSupport(axios)
const cookieJar = new CookieJar()

const generateHeaders = () => ({
  'User-Agent': 'RETS NodeJS-Client/1.x',
  'RETS-Version': 'RETS/1.7',
})

const executeTemplate = (template: string, vars: Record<string, string | null>) =>
  new Function(`return \`${template}\`;`).call(vars)

const dateToString = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`

export const executeCall = async (config: IRetsRequestConfig, payload?: any): Promise<any> => {
  const {
    method,
    url,
    auth,
    writeResponseToFile,
    writeResponseFormat,
    writeRawResponseToFile,
    writeRawResponseFormat,
    action,
  } = {
    writeResponseToFile: false,
    writeResponseFormat: 'response-${this.date}-${this.action}.json',
    writeRawResponseToFile: false,
    writeRawResponseFormat: 'response-raw-${this.date}-${this.action}.json',
    action: '',
    ...config,
  }

  const instance = axios.create()

  const date = dateToString(new Date())

  if (writeRawResponseToFile) {
    instance.interceptors.response.use(async (response) => response)
  }

  const result = await instance({
    jar: cookieJar,
    method,
    url,
    headers: generateHeaders(),
    auth,
    withCredentials: true,
    // transformResponse: parseRetsResponse,
    ...(method === RetsRequestMethod.Get ? { params: { ...payload } } : { data: { ...payload } }),
  })

  if (writeRawResponseToFile) {
    await fs.writeFile(executeTemplate(writeRawResponseFormat, { date, action }), result.data)
  }

  const parsed = parseRetsResponse(result?.data)

  if (writeResponseToFile) {
    await fs.writeFile(
      executeTemplate(writeResponseFormat, { date, action }),
      JSON.stringify(parsed),
    )
  }

  return {
    data: parsed,
  }
}
