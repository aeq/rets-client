import { RetsRequestMethod } from './RetsRequestMethod'

interface AuthConfig {
  username: string
  password: string
}

export interface IRetsRequestConfig {
  method?: RetsRequestMethod
  url: string
  params?: any
  data?: any
  auth?: AuthConfig

  writeResponseToFile?: boolean
  writeResponseFormat?: string
  writeRawResponseToFile?: boolean
  writeRawResponseFormat?: string
  action?: string
}
