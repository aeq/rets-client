import { RetsKeys } from 'types'
import { columnDataHandler } from '.'

export const searchHandler = async (response: any): Promise<any> =>
  // console.log('searchHandler response', Object.keys(response.data[RetsKeys.Rets]))

  columnDataHandler(response.data[RetsKeys.Rets])

// ...(response?.data[RetsKeys.Rets][RetsKeys.Delimiter]
//   ? { delimiter: response?.data[RetsKeys.Rets][RetsKeys.Delimiter]['@_value'] }
//   : {}),
