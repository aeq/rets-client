import { Readable } from 'stream'

import { IRetsMetadataOptions, IRetsSearchOptions } from '.'

export interface RetsClientActions {
  search: (options: IRetsSearchOptions) => Promise<Array<Record<string, string>> | Readable>
  getMetadata: (options: IRetsMetadataOptions) => Promise<Record<string, any>>
  getDataMap: () => Promise<Record<string, any>>
  // getObjects: (options: IRetsGetObjectOptions) => Promise<any>
}
