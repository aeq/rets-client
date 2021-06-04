import { IRetsMetadataOptions, IRetsSearchOptions } from '.'

export interface RetsClientActions {
  search: (options: IRetsSearchOptions) => Promise<any>
  getMetadata: (options: IRetsMetadataOptions) => Promise<any>
  getDataMap: () => Promise<any>
  // getObjects: (options: IRetsGetObjectOptions) => Promise<any>
}
