import {
  createFavouritesFn,
  deleteFavouriteFn,
  fetchFavouritesByTypeFn,
  fetchFavouritesFn,
} from '@hooks/api/favourite'
import type { Favourite, FavouriteType } from '@prisma/client'
import type {
  CreateFavouriteType,
  FavouriteResponseType,
} from '@server/domain/favouriteSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const favourite = {
  fetchAll: {
    useQuery: () =>
      useQuery<FavouriteResponseType[]>({
        queryKey: ['favourites'],
        queryFn: fetchFavouritesFn,
      }),
  },

  fetchByType: {
    useQuery: (type: FavouriteType) =>
      useQuery<FavouriteResponseType[]>({
        enabled: !!type,
        queryKey: ['favourites'],
        queryFn: () => fetchFavouritesByTypeFn(type),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        FavouriteResponseType,
        Error,
        CreateFavouriteType,
        { previous?: Favourite[] }
      >({
        mutationFn: createFavouritesFn,
        onMutate: async (newFavourite) => {
          await queryClient.cancelQueries({ queryKey: ['favourites'] })

          const previous = queryClient.getQueryData<FavouriteResponseType[]>([
            'favourites',
          ])

          // Optimistically add the new favourite to the cache
          queryClient.setQueryData<FavouriteResponseType[]>(
            ['favourites'],
            (old = []) => [
              ...old,
              {
                id: `temp-id-${Math.random()}`,
                userId: newFavourite.userId,
                type: newFavourite.type as FavouriteType,
                data: newFavourite.data,
              },
            ],
          )

          return { previous }
        },
        onSuccess: (serverFav, _vars) => {
          queryClient.setQueryData<FavouriteResponseType[]>(
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
        { previous?: FavouriteResponseType[] }
      >({
        mutationFn: deleteFavouriteFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['favourites'] })

          const previous = queryClient.getQueryData<FavouriteResponseType[]>([
            'favourites',
          ])

          // Optimistically remove the favourite from the cache
          queryClient.setQueryData<FavouriteResponseType[]>(
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
