import { searchHandler } from 'handlers'
import {
  IRetsRequestConfig,
  IRetsSearchOptions,
  RetsFormat,
  RetsQueryCountType,
  RetsQueryStandardNamesType,
  RetsQueryType,
} from 'types'
import { executeCall } from 'utils'

export const getSearchAction =
  (actionConfig: IRetsRequestConfig) => async (options: IRetsSearchOptions) => {
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
    } = options
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
      Culture: culture,
      Select: select ? select.join(',') : undefined,
    }
    const response = actionConfig ? await executeCall(actionConfig, data) : null

    const results = searchHandler(response)

    return results
  }

// public async search(userOptions: IRetsSearchOptions): Promise<any> {
//   const {
//     queryType,
//     restrictedIndicator,
//     standardNames,
//     format,
//     offset,
//     count,
//     limit,
//     query,
//     searchType,
//     className,
//     culture,
//     select,
//   } = userOptions
//   const data = {
//     Query: query,
//     SearchType: searchType,
//     Class: className,
//     QueryType: queryType || RetsQueryType.DMQL2,
//     RestrictedIndicator: restrictedIndicator || '***',
//     StandardNames: standardNames || RetsQueryStandardNamesType.UseSystemName,
//     Format: format || RetsFormat.CompactDecoded,
//     Offset: offset || 1,
//     Count: count || RetsQueryCountType.OnlyRecord,
//     Limit: limit || 'NONE',
//     Culture: culture,
//     Select: select ? select.join(',') : undefined,
//   }
//   const response = this.actions[RetsAction.Search]
//     ? await executeCall(this.actions[RetsAction.Search], data)
//     : null

//   const results = searchHandler(response)

//   return results
// }
