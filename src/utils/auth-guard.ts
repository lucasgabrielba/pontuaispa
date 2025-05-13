import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/use-auth'

export const useAuthGuard = () => {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const { accessToken } = useAuthStore(state => state.auth)

  useEffect(() => {
    const verifyAuth = async () => {
      if (!accessToken) {
        navigate({ to: '/sign-in' })
        return
      }

      try {
        // Verificar se o token ainda é válido
        await checkAuth.refetch()
      } catch (error: any) {
        console.error('Erro ao verificar o token:', error)
        navigate({ to: '/sign-in' })
      }
    }

    verifyAuth()
  }, [accessToken, navigate, checkAuth])

  return { isLoading: checkAuth.isLoading }
}