import { cookieCompare } from 'tough-cookie'
import { RetsMetadataType, RetsKeys } from 'types'
import { columnDataHandler } from '.'

export const metadataHandler = async (response: any): Promise<any> => {
  // console.log('metadataHandler response', response.data)

  const out = Object.keys(response?.data[RetsKeys.Rets]).reduce(
    (result, key) => ({
      ...result,
      ...((Object.values(RetsMetadataType) as string[]).includes(key)
        ? {
            [key]: Array.isArray(response.data[RetsKeys.Rets][key])
              ? response.data[RetsKeys.Rets][key].map((item: any) => columnDataHandler(item))[1]
              : columnDataHandler(response.data[RetsKeys.Rets][key]),
          }
        : {}),
    }),
    {},
  )
  // console.log('metaout', out)

  return out
}
