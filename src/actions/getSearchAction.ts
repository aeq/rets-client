import { createReadStream, createWriteStream } from 'fs'
import { Readable } from 'stream'

import { getSearchItemStream, ObjectCollector } from '../stream'
import { executeCall } from '../utils'
import {
  DdfCulture,
  IRetsRequestConfig,
  IRetsSearchOptions,
  RetsFormat,
  RetsQueryCountType,
  RetsQueryStandardNamesType,
  RetsQueryType,
  ReturnType,
} from '../types'

const defaultOptions = {
  returnType: ReturnType.JSON,
  processText: (text: string) => text,
}

export const getSearchAction =
  (actionConfig: IRetsRequestConfig) =>
  async (options: IRetsSearchOptions): Promise<Record<string, string>[] | Readable> => {
    const {
      queryType,
      restrictedIndicator,
      standardNames,
      format,
      offset,
      count,
      limit,
      query,
      searchType,
      className,
      culture,
      select,
      returnType,
      processText,
    } = {
      ...defaultOptions,
      ...options,
    }

    const data = {
      Query: query,
      SearchType: searchType,
      Class: className,
      QueryType: queryType || RetsQueryType.DMQL2,
      RestrictedIndicator: restrictedIndicator || '***',
      StandardNames: standardNames || RetsQueryStandardNamesType.UseSystemName,
      Format: format || RetsFormat.CompactDecoded,
      Offset: offset || 1,
      Count: count || RetsQueryCountType.OnlyRecord,
      Limit: limit || 'NONE',
      Culture: culture || DdfCulture.EN_CA,
      Select: select ? select.join(',') : undefined,
    }
    const { stream } = actionConfig ? await executeCall(actionConfig, data) : null

    // const response = createReadStream('test.raw')

    const searchStream = getSearchItemStream(stream, processText)

    if (returnType === ReturnType.JSON) {
      const objectCollector = new ObjectCollector()

      searchStream.pipe(objectCollector)

      // wait for stream to end before returning collected objects
      await new Promise((fulfill) => objectCollector.on('close', fulfill))

      // console.log('done Data collect', objectCollector.objects)
      return objectCollector.objects
    }

    return searchStream
  }
