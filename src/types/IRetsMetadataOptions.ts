import { RetsFormat } from './RetsFormat'
import { RetsMetadataType } from './RetsMetadataType'

export interface IRetsMetadataOptions {
  type: RetsMetadataType
  id?: string
  format?: RetsFormat

  classType?: string
}
