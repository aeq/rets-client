import { MetadataParser } from '../stream'
import { IRetsMetadataOptions, IRetsRequestConfig, RetsFormat } from '../types'
import { executeCall } from '../utils'
// import { promises as fs } from 'fs'

export const getMetadataAction =
  (actionConfig: IRetsRequestConfig) =>
  async (userOptions: IRetsMetadataOptions): Promise<Array<any>> => {
    const { type, id, format, classType } = {
      ...userOptions,
    }

    const data = {
      Type: type,
      ID: classType && id ? `${id}:${classType}` : id || '0',
      Format: format || RetsFormat.Compact,
    }

    const response = actionConfig ? await executeCall(actionConfig, data) : null

    const metadataParser = new MetadataParser()

    response.pipe(metadataParser)

    await new Promise((fulfill) => metadataParser.on('close', fulfill))

    return metadataParser.data[type]
  }
