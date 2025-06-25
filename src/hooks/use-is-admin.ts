import { useMemo } from 'react'
import { useAuth } from './use-auth'

/**
 * Retorna true se o usuário possui role 'admin' ou 'super_admin'.
 */
export function useIsAdmin() {
  const { user } = useAuth()

  const userData = user?.data ?? user

  return useMemo(() => {
    // @ts-ignore
    if (!userData || !Array.isArray(userData.roles)) return false
    // @ts-ignore
    return userData.roles.some(
      (role: any) => role.name === 'admin' || role.name === 'super_admin'
    )
  }, [userData])
}
