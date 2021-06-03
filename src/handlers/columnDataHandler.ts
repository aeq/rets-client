import { RetsKeys } from 'types/RetsKeys'

const DATA_SPLIT = '\t'

export const columnDataHandler = ({
  [RetsKeys.Columns]: columns,
  [RetsKeys.Data]: data,
}: {
  [RetsKeys.Columns]: string
  [RetsKeys.Data]: string
}): Record<string, string>[] => {
  const parsedColumns = columns.split(DATA_SPLIT)
  const parsedData = Array.isArray(data)
    ? data.map((row) => row.split(DATA_SPLIT))
    : [data.split(DATA_SPLIT)]
  // console.log('columnDataHandler', parsedColumns, parsedData)
  return parsedData.map((dataSet) =>
    parsedColumns.reduce(
      (result, column, index) => ({
        ...result,
        ...(column ? { [column]: dataSet[index] } : {}),
      }),
      {},
    ),
  )
}
