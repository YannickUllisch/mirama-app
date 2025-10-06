import { api } from '@api'
import type { Favourite, FavouriteType } from '@prisma/client'
import type { CreateFavouriteInput } from '@server/domain/favouriteSchema'

export const fetchFavouritesFn = async (): Promise<Favourite[]> => {
  const { data } = await api.get('favourite')
  return data
}

export const fetchFavouritesByTypeFn = async (
  type: FavouriteType,
): Promise<Favourite[]> => {
  const { data } = await api.get(`favourite?type=${type}`)
  return data
}

export const createFavouritesFn = async (payload: CreateFavouriteInput) => {
  const { data } = await api.post('favourite', payload)
  return data
}

export const deleteFavouriteFn = async (id: string) => {
  const { data } = await api.delete(`favourite/${id}`)
  return data
}
