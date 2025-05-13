import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/use-toast'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setUser, setAccessToken, reset } = useAuthStore(state => state.auth)

  // Buscar usuário autenticado
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
    enabled: false // Não executar automaticamente
  })

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

      navigate({ to: '/' })
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

      navigate({ to: '/' })
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

      // Limpar queries que dependem de autenticação
      queryClient.invalidateQueries()

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