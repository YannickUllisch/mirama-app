// src/modules/shared/favourites/hooks/hooks.ts
import type { CreateFavouriteRequest } from '@/server/modules/account/favourites/features/create-favourite/schema'
import type { FavouriteResponse } from '@/server/modules/account/favourites/features/response'
import type { FavouriteType } from '@prisma/client'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFavouritesFn,
  deleteFavouriteFn,
  fetchFavouritesByTypeFn,
  fetchFavouritesFn,
} from './api'

export const favouriteKeys = {
  root: ['favourites'] as const,
}

const favourite = {
  fetchAll: {
    useQuery: () =>
      useQuery<FavouriteResponse[]>({
        queryKey: favouriteKeys.root,
        queryFn: fetchFavouritesFn,
      }),
  },

  fetchByType: {
    useQuery: (type: FavouriteType) =>
      useQuery<FavouriteResponse[]>({
        enabled: !!type,
        queryKey: favouriteKeys.root,
        queryFn: () => fetchFavouritesByTypeFn(type),
      }),
  },

  create: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        FavouriteResponse,
        Error,
        CreateFavouriteRequest,
        { previous?: FavouriteResponse[] }
      >({
        mutationFn: createFavouritesFn,
        ...optimisticList<FavouriteResponse, CreateFavouriteRequest>(
          qc,
          favouriteKeys.root,
          {
            successMessage: 'Added to favourites',
            apply: (old, vars) => [
              ...old,
              {
                id: `temp-${Date.now()}`,
                memberId: '',
                type: vars.type,
                data: vars.data,
              },
            ],
          },
        ),
      })
    },
  },

  delete: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: FavouriteResponse[] }
      >({
        mutationFn: deleteFavouriteFn,
        ...optimisticList<FavouriteResponse, string>(qc, favouriteKeys.root, {
          successMessage: 'Removed from favourites',
          apply: (old, id) => old.filter((f) => f.id !== id),
        }),
      })
    },
  },
}

export default favourite
