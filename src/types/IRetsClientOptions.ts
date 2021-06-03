import { RetsFormat } from './RetsFormat'

export interface IRetsClientOptions {
  url: string

  username: string

  password: string

  format?: RetsFormat
}
