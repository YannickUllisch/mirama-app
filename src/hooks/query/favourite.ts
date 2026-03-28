import type { CreateFavouriteRequest } from '@/server/modules/account/favourites/features/create-favourite/schema'
import type { FavouriteResponse } from '@/server/modules/account/favourites/features/response'
import {
  createFavouritesFn,
  deleteFavouriteFn,
  fetchFavouritesByTypeFn,
  fetchFavouritesFn,
} from '@hooks/api/favourite'
import type { FavouriteType } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const favourite = {
  fetchAll: {
    useQuery: () =>
      useQuery<FavouriteResponse[]>({
        queryKey: ['favourites'],
        queryFn: fetchFavouritesFn,
      }),
  },

  fetchByType: {
    useQuery: (type: FavouriteType) =>
      useQuery<FavouriteResponse[]>({
        enabled: !!type,
        queryKey: ['favourites'],
        queryFn: () => fetchFavouritesByTypeFn(type),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        FavouriteResponse,
        Error,
        CreateFavouriteRequest,
        { previous?: FavouriteResponse[] }
      >({
        mutationFn: createFavouritesFn,
        onMutate: async (newFavourite) => {
          await queryClient.cancelQueries({ queryKey: ['favourites'] })

          const previous = queryClient.getQueryData<FavouriteResponse[]>([
            'favourites',
          ])

          // Optimistically add the new favourite to the cache
          queryClient.setQueryData<FavouriteResponse[]>(
            ['favourites'],
            (old = []) => [
              ...old,
              {
                id: `temp-id-${Math.random()}`,
                memberId: '',
                type: newFavourite.type,
                data: newFavourite.data,
              },
            ],
          )

          return { previous }
        },
        onSuccess: (serverFav, _vars) => {
          queryClient.setQueryData<FavouriteResponse[]>(
            ['favourites'],
            (old = []) => [...old, serverFav],
          )
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['favourites'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['favourites'] })
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: FavouriteResponse[] }
      >({
        mutationFn: deleteFavouriteFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['favourites'] })

          const previous = queryClient.getQueryData<FavouriteResponse[]>([
            'favourites',
          ])

          // Optimistically remove the favourite from the cache
          queryClient.setQueryData<FavouriteResponse[]>(
            ['favourites'],
            (old = []) => old.filter((p) => p.id !== id),
          )

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['favourites'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['favourites'] })
        },
      })
    },
  },
}

export default favourite
