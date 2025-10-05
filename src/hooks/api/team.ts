import type { User } from '@/prisma/zod'
import { api } from '@api'

export const fetchTeamMembers = async (): Promise<User[]> => {
  const { data } = await api.get('team/member')
  return data
}
