import { RetsRequestMethod } from './RetsRequestMethod'
import { IRetsResponse } from './IRetsResponse'

export interface IRetsAction {
  handleResponse(response: any): void
  method: RetsRequestMethod
  url: string
  params: Record<string, unknown>
  data: Record<string, unknown>
  headers: Record<string, unknown>
  baseURL: string
}
