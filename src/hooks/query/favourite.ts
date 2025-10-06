import {
  createFavouritesFn,
  deleteFavouriteFn,
  fetchFavouritesByTypeFn,
  fetchFavouritesFn,
} from '@hooks/api/favourite'
import {} from '@hooks/api/project'
import type { Favourite, FavouriteType } from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const favourite = {
  fetchAll: {
    useQuery: () =>
      useQuery<Favourite[]>({
        queryKey: ['favourites'],
        queryFn: fetchFavouritesFn,
      }),
  },

  fetchByType: {
    useQuery: (type: FavouriteType) =>
      useQuery<Favourite[]>({
        enabled: !!type,
        queryKey: ['favourites'],
        queryFn: () => fetchFavouritesByTypeFn(type),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: createFavouritesFn,
        onMutate: async (_newProject) => {
          await queryClient.cancelQueries({ queryKey: ['favourites'] })

          const previous = queryClient.getQueryData<ProjectResponseInput[]>([
            'favourites',
          ])

          return { previous }
        },
        onError: (_err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['favourites'], ctx.previous)
          }
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
      return useMutation<{ success: boolean }, Error, string>({
        mutationFn: deleteFavouriteFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['favourites'] })

          const previous = queryClient.getQueryData<ProjectResponseInput[]>([
            'favourites',
          ])

          queryClient.setQueryData<ProjectResponseInput[]>(
            ['favourites'],
            (old = []) => old.filter((p) => p.id !== id),
          )

          return { previous }
        },
        // onError: (_err, _vars, ctx) => {
        //   if (ctx?.previous) {
        //     queryClient.setQueryData(['projects'], ctx.previous)
        //   }
        // },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['favourites'] })
        },
      })
    },
  },
}

export default favourite
