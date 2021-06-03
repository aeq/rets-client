import axios, { AxiosRequestConfig } from 'axios'
import request from 'request'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { Store, CookieJar } from 'tough-cookie'
import {
  IRetsAction,
  IRetsResponse,
  IRetsClientOptions,
  IRetsRequestConfig,
  RetsRequestMethod,
} from 'types'
import { parseRetsResponse } from './parseRetsResponse'

axiosCookieJarSupport(axios)
const cookieJar = new CookieJar()

const generateHeaders = () => ({
  'User-Agent': 'RETS NodeJS-Client/1.x',
  'RETS-Version': 'RETS/1.7',
})
//   this.headers['User-Agent'] = this.configuration.userAgent || 'RETS NodeJS-Client/1.x';
//   this.headers['RETS-Version'] = this.configuration.version;
//   if (this.configuration.userAgentPassword) {
//       this.headers['RETS-UA-Authorization'] = 'Digest ' + createHash('md5').update([
//           createHash('md5').update(`${this.configuration.userAgent}:${this.configuration.userAgentPassword}`).digest('hex'),
//           '',
//           this.configuration.sessionId || '',
//           this.headers['RETS-Version']
//       ].join(':')).digest('hex');
//   }
// }

const simpleStringify = (object: Record<string, any>) => {
  const simpleObject = Object.keys(object).reduce(
    (result, key) => ({
      ...result,
      ...(typeof object[key] === 'object' || typeof object[key] === 'function'
        ? {}
        : { [key]: object[key] }),
    }),
    {},
  )

  return JSON.stringify(simpleObject, null, 2)
  // const simpleObject
  // var simpleObject = {};
  // for (var prop in object ){
  //     if (!object.hasOwnProperty(prop)){
  //         continue;
  //     }
  //     if (typeof(object[prop]) == 'object'){
  //         continue;
  //     }
  //     if (typeof(object[prop]) == 'function'){
  //         continue;
  //     }
  //     simpleObject[prop] = object[prop];
  // }
  // return JSON.stringify(simpleObject); // returns cleaned up JSON
}

axios.interceptors.request.use((axiosRequest) => {
  console.log('interceptors.Request', JSON.stringify(axiosRequest, null, 2))
  return axiosRequest
})

axios.interceptors.response.use(
  (response) => {
    console.log('interceptors.Response:', simpleStringify(response), response.data)
    return response
  },
  // (error) => console.log('interceptors.ResponseError', JSON.stringify(error, null, 2)),
  (error) => {
    throw new Error(error.message)
  },
)

export const executeCall = async (config: IRetsRequestConfig, payload?: any): Promise<any> => {
  const { method, url, params, auth } = config

  console.log('------------------------------------', url)

  return axios({
    jar: cookieJar,
    method,
    url,
    headers: generateHeaders(),
    auth,
    withCredentials: true,
    transformResponse: parseRetsResponse,
    ...(method === RetsRequestMethod.Get ? { params: { ...payload } } : { data: { ...payload } }),
  })
}
