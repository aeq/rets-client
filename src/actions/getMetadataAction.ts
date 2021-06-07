import { metadataHandler } from '../handlers'
import { IRetsMetadataOptions, IRetsRequestConfig, RetsFormat } from '../types'
import { executeCall } from '../utils'
// import { promises as fs } from 'fs'

export const getMetadataAction =
  (actionConfig: IRetsRequestConfig) =>
  async (userOptions: IRetsMetadataOptions): Promise<Array<any>> => {
    const { type, id, format, classType } = userOptions
    const data = {
      Type: type,
      ID: classType && id ? `${id}:${classType}` : id || '0',
      Format: format || RetsFormat.Compact,
    }

    const response = actionConfig ? await executeCall(actionConfig, data) : null

    // await fs.writeFile(
    //   'response.json',
    //   JSON.stringify(
    //     {
    //       data: response.data,
    //     },
    //     undefined,
    //     2,
    //   ),
    // )

    const results = await metadataHandler(response)

    return results[type] || null
  }
