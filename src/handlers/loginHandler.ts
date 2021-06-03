import { RetsKeys } from 'types/RetsKeys'

const LINE_SPLIT = '\n'
const KEY_SPLIT = /=(.*)$/

export const loginHandler = async (response: any): Promise<any> => {
  console.log('login response', response.data)
  const { [RetsKeys.Response]: retsResponse } = response?.data[RetsKeys.Rets]

  // if (response.headers['set-cookie']) {
  //   const cookies = ([] as string[]).concat(response.headers['set-cookie'])
  //   for (let i = 0; i < cookies.length; i += 1) {
  //     const matches = cookies[i].match(/(?:(?:RETS-Session-ID)|(?:X-SESSIONID))=([^;]+);/)
  //     if (matches) {
  //       console.log('sessionId', matches)
  //       break
  //     }
  //   }
  // }

  return retsResponse.split(LINE_SPLIT).reduce((data: any, row: string) => {
    const [key, value] = row.split(KEY_SPLIT)

    if (key === '') {
      return data
    }

    return {
      ...data,
      [key]: value,
    }
  }, {})
}
