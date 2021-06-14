import { RetsFormat } from './RetsFormat'

export interface IRetsClientOptions {
  url: string

  username: string

  password: string

  format?: RetsFormat

  // callbacks
  onResponse?: (response: any) => void
  onParse?: (parsed: any) => void
}
