import useSWR from 'swr'
import { mockUser } from '@/lib/mock-data'
import type { User } from '@/lib/types/api'

export function useAuth() {
  const { data } = useSWR<User>('current-user', () => {
    return Promise.resolve(mockUser)
  })

  const user = data || mockUser

  return {
    user,
    isAuthenticated: true,
  }
}
