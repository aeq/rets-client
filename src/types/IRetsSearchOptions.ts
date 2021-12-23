import { DdfCulture } from './DdfCulture'
import { RetsQueryCountType } from './RetsQueryCountType'
import { RetsQueryStandardNamesType } from './RetsQueryStandardNamesType'
import { RetsQueryType } from './RetsQueryType'
import { ReturnType } from './ReturnType'
import { RetsFormat } from './RetsFormat'

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
  processText?: (text: string) => string
  returnType?: ReturnType
}
