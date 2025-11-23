import type { FavouriteType } from '@prisma/client'
import type {
  CreateFavouriteType,
  FavouriteResponseType,
} from '@server/domain/favouriteSchema'
import { api } from '@src/lib/api'

export const fetchFavouritesFn = async (): Promise<FavouriteResponseType[]> => {
  const { data } = await api.get('favourite')
  return data
}

export const fetchFavouritesByTypeFn = async (
  type: FavouriteType,
): Promise<FavouriteResponseType[]> => {
  const { data } = await api.get(`favourite?type=${type}`)
  return data
}

export const createFavouritesFn = async (payload: CreateFavouriteType) => {
  const { data } = await api.post('favourite', payload)
  return data
}

export const deleteFavouriteFn = async (id: string) => {
  const { data } = await api.delete(`favourite/${id}`)
  return data
}
