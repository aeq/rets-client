import { IRetsMetadataOptions, IRetsRequestConfig, RetsFormat, RetsMetadataType } from '../types'

type MetadataFunction = (userOptions: IRetsMetadataOptions) => Promise<any[]>

// (
//   await getMetadata({
//     type: RetsMetadataType.Class,
//   })
// ).reduce(
//   async (a, { ClassName }) => ({
//     ...a,
//     [ClassName]: await getMetadata({
//       type: RetsMetadataType.Table,
//       classType: ClassName,
//     }),
//   }),
//   {},
// ),

const getTableData = async (getMetadata: MetadataFunction, classType: string, id: string) =>
  (
    await getMetadata({
      type: RetsMetadataType.Table,
      classType,
      id,
    })
  ).reduce(async (a, { StandardName }) => [...(await a), StandardName], [])

const getClassData = async (getMetadata: MetadataFunction, ResourceID: string) =>
  (
    await getMetadata({
      type: RetsMetadataType.Class,
    })
  ).reduce(
    async (a, { ClassName }, index) => ({
      ...(await a),
      [ClassName]: await getTableData(getMetadata, ClassName, ResourceID),
    }),
    {},
  )

export const getDataMapAction = (getMetadata: MetadataFunction) => async (): Promise<any> =>
  (
    await getMetadata({
      type: RetsMetadataType.Resource,
    })
  ).reduce(
    async (acc, { ResourceID }) => ({
      ...(await acc),
      [ResourceID]: await getClassData(getMetadata, ResourceID),
    }),
    {},
  )

// .reduce(
//   (a, { ClassName }) => ({
//     ...a,
//     [ClassName]: await getMetadata({
//       type: RetsMetadataType.Table,
//       classType: ClassName,
//     }),
//   }),
//   {},
// ),
