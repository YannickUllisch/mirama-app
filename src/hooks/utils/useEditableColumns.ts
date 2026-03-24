import type { UseMutateFunction } from '@tanstack/react-query'
import type { ZodError, ZodType } from 'zod'

export type HandleFieldUpdate<ResponseType> = <K extends keyof ResponseType>(
  rowData: ResponseType,
  field: K,
  value: ResponseType[K],
) => void

export const useEditableColumns = <
  ResponseType extends { id: string },
  UpdateType,
  MutationInputType = { id: string; data: UpdateType },
>({
  mutate,
  updateSchema,
  getKey,
  mapToUpdateInput,
  prepareMutation,
  onValidationError,
}: {
  mutate: UseMutateFunction<any, Error, MutationInputType, unknown>
  updateSchema: ZodType<UpdateType, any, any>
  getKey?: (data: ResponseType) => string
  mapToUpdateInput: (data: ResponseType) => UpdateType
  prepareMutation: (id: string, data: UpdateType) => MutationInputType
  onValidationError?: (error: ZodError<UpdateType>) => void
}) => {
  const handleUpdate = (data: ResponseType) => {
    const id = getKey ? getKey(data) : (data as any).id

    const mapped = mapToUpdateInput(data)
    const result = updateSchema.safeParse(mapped)

    if (!result.success) {
      onValidationError?.(result.error)
      return
    }

    mutate(prepareMutation(id, result.data))
  }

  const handleFieldUpdate: HandleFieldUpdate<ResponseType> = (
    rowData,
    field,
    value,
  ) => {
    handleUpdate({ ...rowData, [field]: value })
  }

  return { handleFieldUpdate, handleUpdate }
}
