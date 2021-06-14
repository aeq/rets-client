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
    const response = actionConfig ? await executeCall(actionConfig, data) : null
    // response.pipe(createWriteStream('response-search-simple.json'))

    // const response = createReadStream('response-search-simple.json')
    // const response = createReadStream('response-raw-2021-06-09-search.json')

    const searchStream = getSearchItemStream(response)

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
