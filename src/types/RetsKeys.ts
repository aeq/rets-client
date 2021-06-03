import { RetsMetadataType } from './RetsMetadataType'

enum GeneralRetsKeys {
  Rets = 'RETS',
  Columns = 'COLUMNS',
  Data = 'DATA',
  Status = 'RETS-STATUS',
  Response = 'RETS-RESPONSE',
  Delimiter = 'DELIMITER',
}

export const RetsKeys = {
  ...GeneralRetsKeys,
  ...RetsMetadataType,
}
export type RetsKeys = GeneralRetsKeys | RetsMetadataType
