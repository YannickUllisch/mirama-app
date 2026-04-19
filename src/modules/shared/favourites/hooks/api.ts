// src/modules/shared/favourites/hooks/api.ts
import type { CreateFavouriteRequest } from '@/server/modules/account/favourites/features/create-favourite/schema'
import type { FavouriteResponse } from '@/server/modules/account/favourites/features/response'
import type { FavouriteType } from '@prisma/client'
import { api } from '@src/lib/api'

export const fetchFavouritesFn = async (): Promise<FavouriteResponse[]> => {
  const { data } = await api.get('favourite')
  return data
}

export const fetchFavouritesByTypeFn = async (
  type: FavouriteType,
): Promise<FavouriteResponse[]> => {
  const { data } = await api.get(`favourite?type=${type}`)
  return data
}

export const createFavouritesFn = async (payload: CreateFavouriteRequest) => {
  const { data } = await api.post('favourite', payload)
  return data
}

export const deleteFavouriteFn = async (id: string) => {
  const { data } = await api.delete(`favourite/${id}`)
  return data
}
