import { DdfCulture } from '.'

export interface IRetsObjectOptions {
  resource: string
  type: string
  contentId: string

  mime?: string // image/jpeg
  id?: string | undefined // *, means all objects under target resource
  withLocation?: boolean
  culture?: DdfCulture
}
