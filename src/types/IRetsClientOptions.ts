import { RetsFormat } from './RetsFormat'

export interface IRetsClientOptions {
  url: string

  username: string

  password: string

  format?: RetsFormat

  // debuging and output
  writeResponseToFile?: boolean

  writeResponseFormat?: string

  writeRawResponseToFile?: boolean

  writeRawResponseFormat?: string
}
