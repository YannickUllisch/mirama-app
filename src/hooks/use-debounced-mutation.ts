import { useDebouncedCallback } from '@src/hooks/use-debounced-callback'
import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from '@tanstack/react-query'

type DebouncedMutationOptions<TData, TError, TVariables, TContext> =
  UseMutationOptions<TData, TError, TVariables, TContext> & {
    debounceMs?: number
  }

export function useDebouncedMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: DebouncedMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { debounceMs, ...mutationOptions } = options
  const mutation = useMutation(mutationOptions)

  // Called unconditionally (rules of hooks) - simply unused when debounceMs is unset.
  const debouncedMutate = useDebouncedCallback(
    mutation.mutate as (...args: never[]) => unknown,
    debounceMs ?? 0,
  )

  if (!debounceMs) return mutation

  return {
    ...mutation,
    mutate: debouncedMutate as UseMutationResult<
      TData,
      TError,
      TVariables,
      TContext
    >['mutate'],
  }
}
