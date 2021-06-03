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
}
