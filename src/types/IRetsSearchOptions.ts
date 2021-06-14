import { DdfCulture, RetsFormat } from 'types'
import { RetsQueryCountType } from './RetsQueryCountType'
import { RetsQueryStandardNamesType } from './RetsQueryStandardNamesType'
import { RetsQueryType } from './RetsQueryType'
import { ReturnType } from './ReturnType'

export interface IRetsSearchOptions {
  query: string
  searchType: string
  className: string

  queryType?: RetsQueryType
  restrictedIndicator?: string
  standardNames?: RetsQueryStandardNamesType
  format?: RetsFormat
  offset?: number
  count?: RetsQueryCountType
  limit?: number
  culture?: DdfCulture
  select?: Array<string>
  returnType?: ReturnType
}
