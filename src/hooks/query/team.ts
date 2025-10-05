import { fetchTeamMembers } from '@hooks/api/team'
import type { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

const team = {
  fetchMembers: {
    useQuery: () =>
      useQuery<User[]>({
        queryKey: ['teamMembers'],
        queryFn: fetchTeamMembers,
      }),
  },
}

export default team
