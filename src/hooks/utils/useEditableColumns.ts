import type { UseMutateFunction } from '@tanstack/react-query'
import type { ZodError, ZodType } from 'zod'

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
  updateSchema,
  mapToUpdateInput,
  getKey,
  onValidationError,
}: {
  mutate: UseMutateFunction<
    any,
    Error,
    { id: string; data: UpdateType },
    unknown
  >
  updateSchema: ZodType<UpdateType, any, any>
  getKey: (data: ResponseType) => string
  mapToUpdateInput: Mapper<ResponseType, UpdateType>
  onValidationError?: (error: ZodError<UpdateType>) => void
}) => {
  const handleUpdate = (data: ResponseType) => {
    const id = getKey(data)
    const mapped = mapToUpdateInput(data)
    const result = updateSchema.safeParse(mapped)
    if (!result.success) {
      onValidationError?.(result.error)
      return
    }
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
