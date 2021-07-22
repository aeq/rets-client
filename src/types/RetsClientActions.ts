import { Readable } from 'stream'

import { IRetsMetadataOptions, IRetsSearchOptions, IRetsObjectOptions } from '.'
import { RetsObject } from './RetsObject'

export interface RetsClientActions {
  search: (options: IRetsSearchOptions) => Promise<any>
  getMetadata: (options: IRetsMetadataOptions) => Promise<Record<string, any>>
  getDataMap: () => Promise<Record<string, any>>
  getObject: (options: IRetsObjectOptions) => Promise<RetsObject[]>
}
