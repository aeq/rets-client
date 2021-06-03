import { metadataHandler } from 'handlers'
import { IRetsMetadataOptions, IRetsRequestConfig, RetsFormat } from 'types'
import { executeCall } from 'utils'

export const getMetadataAction =
  (actionConfig: IRetsRequestConfig) =>
  async (userOptions: IRetsMetadataOptions): Promise<any> => {
    const { type, id, format, classType } = userOptions
    const data = {
      Type: type,
      ID: classType && id ? `${id}:${classType}` : id || '0',
      Format: format || RetsFormat.Compact,
    }

    const response = actionConfig ? await executeCall(actionConfig, data) : null

    const results = await metadataHandler(response)

    return results[type] || null
  }
