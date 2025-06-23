import { useMemo } from 'react'
import { useAuth } from './use-auth'

/**
 * Retorna true se o usuário possui role 'admin' ou 'super_admin'.
 */
export function useIsAdmin() {
  const { user } = useAuth()
  // user pode ser um objeto ou um resultado do useQuery
  const userData = user?.data ?? user

  return useMemo(() => {
    if (!userData || !Array.isArray(userData.roles)) return false
    return userData.roles.some(
      (role: any) => role.name === 'admin' || role.name === 'super_admin'
    )
  }, [userData])
}
