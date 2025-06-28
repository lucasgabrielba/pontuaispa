import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authService } from '@/services/auth-service'
import { onboardingService } from '@/services/onboarding-service'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/use-toast'
import { User } from '@/types/users'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setAccessToken, reset, accessToken } = useAuthStore(state => state.auth)

  // Buscar usuário autenticado - só executa se tiver token
  const user = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const response = await authService.getUser()
      if (response.data) {
        setUser(response.data)
      }
      return response.data
    },
    retry: false,
    enabled: !!accessToken, // Só executa se tiver token
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    refetchOnWindowFocus: false
  }) as UseQueryResult<User>

  // Login
  const login = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await authService.login(credentials)
      return response.data
    },
    onSuccess: async (data) => {
      // Se o backend retornar um token, armazene-o
      if (data?.token) {
        setAccessToken(data.token)
      }

      // Buscar informações do usuário
      await queryClient.fetchQuery({
        queryKey: ['auth-user']
      })

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!'
      })

      // Verificar se é admin primeiro
      const user = queryClient.getQueryData(['auth-user']) as User
      let isAdmin = false
      
      if (user && Array.isArray(user.roles)) {
        isAdmin = user.roles.some((role: any) => role.name === 'admin' || role.name === 'super_admin')
      }

      if (isAdmin) {
        navigate({ to: '/admin' })
        return
      }

      // Para usuários normais, verificar onboarding
      try {
        const hasCardsResponse = await onboardingService.checkUserHasCards()
        
        if (hasCardsResponse.data) {
          navigate({ to: '/' })
        } else {
          navigate({ to: '/onboarding' })
        }
      } catch (error) {
        console.error('Erro ao verificar cartões:', error)
        navigate({ to: '/' })
      }
    },
    onError: (error: any) => {
      console.error('Erro ao fazer login:', error)
      toast({
        variant: 'destructive',
        title: 'Falha no login',
        description: error.response?.data?.message || 'Verifique suas credenciais e tente novamente'
      })
    }
  })

  // Registro
  const register = useMutation({
    mutationFn: async (userData: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => {
      const response = await authService.register(userData)
      return response.data
    },
    onSuccess: async (data) => {
      if (data?.token) {
        setAccessToken(data.token)
      }

      await queryClient.fetchQuery({
        queryKey: ['auth-user']
      })

      toast({
        title: 'Registro realizado com sucesso',
        description: 'Sua conta foi criada com sucesso!'
      })

      // Após registro, sempre vai para onboarding
      navigate({ to: '/onboarding' })
    },
    onError: (error: any) => {
      console.error('Erro ao registrar:', error)
      toast({
        variant: 'destructive',
        title: 'Falha no registro',
        description: error.response?.data?.message || 'Não foi possível criar sua conta'
      })
    }
  })

  // Logout
  const logout = useMutation({
    mutationFn: async () => {
      const response = await authService.logout()
      return response.data
    },
    onSuccess: () => {
      // Limpar o estado de autenticação
      reset()

      // Limpar todas as queries
      queryClient.clear()

      toast({
        title: 'Logout realizado com sucesso',
        description: 'Você saiu da sua conta'
      })

      navigate({ to: '/sign-in' })
    },
    onError: (error) => {
      console.error('Erro ao fazer logout:', error)
      // Em caso de erro, limpar localmente de qualquer forma
      reset()
      queryClient.clear()
      navigate({ to: '/sign-in' })
    }
  })

  // Verificar se está autenticado
  const checkAuth = useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      try {
        const response = await authService.check()
        return response.data
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        reset()
        return null
      }
    },
    retry: false,
    enabled: false // Não executar automaticamente
  })

  return {
    user,
    login,
    register,
    logout,
    checkAuth
  }
}