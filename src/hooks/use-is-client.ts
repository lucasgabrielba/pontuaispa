import { useMemo } from 'react'
import { useAuth } from './use-auth'

/**
 * Retorna true se o usuário NÃO possui role 'admin' ou 'super_admin'.
 */
export function useIsClient() {
  const { user } = useAuth()
  const userData = user?.data ?? user

  return useMemo(() => {
    if (!userData || !('roles' in userData) || !Array.isArray(userData.roles)) return false
    return !userData.roles.some(
      (role: any) => role.name === 'admin' || role.name === 'super_admin'
    )
  }, [userData])
}
