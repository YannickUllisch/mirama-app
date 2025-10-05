import type { UseMutateFunction } from '@tanstack/react-query'

export type HandleFieldUpdate<ResponseType> = <K extends keyof ResponseType>(
  rowData: ResponseType,
  field: K,
  value: ResponseType[K],
) => void

type Mapper<ResponseType, UpdateType> = (data: ResponseType) => UpdateType

export const useEditableColumns = <
  ResponseType extends { id: string },
  UpdateType,
>({
  mutate,
  mapToUpdateInput,
}: {
  mutate: UseMutateFunction<
    any,
    Error,
    { id: string; data: UpdateType },
    unknown
  >
  mapToUpdateInput: Mapper<ResponseType, UpdateType>
}) => {
  const handleUpdate = (data: ResponseType) => {
    const { id } = data
    const mapped = mapToUpdateInput(data)
    mutate({ id, data: mapped })
  }

  const handleFieldUpdate: HandleFieldUpdate<ResponseType> = (
    rowData,
    field,
    value,
  ) => {
    const updated = { ...rowData, [field]: value }
    handleUpdate(updated)
  }

  return {
    handleFieldUpdate,
    handleUpdate,
  }
}
