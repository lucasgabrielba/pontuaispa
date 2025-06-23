import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user-service'
import { toast } from '@/hooks/use-toast'

export type UserFormData = {
  name: string
  email: string
  status: string
  password?: string
  password_confirmation?: string
  role: 'client' | 'admin'
}

export type User = {
  id: string
  name: string
  email: string
  status: string
  created_at: string
  updated_at: string
}

export type UsersResponse = {
  current_page: number
  data: User[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export const useUsers = () => {
  const queryClient = useQueryClient()

  // Fetch all users with pagination
  const getUsers = (page = 1, perPage = 15) => {
    return useQuery({
      queryKey: ['users', page, perPage],
      queryFn: async () => {
        const response = await userService.getAll({ page, per_page: perPage })
        return response.data as UsersResponse
      }
    })
  }

  // Get user by ID
  const getUser = (id: string) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: async () => {
        const response = await userService.getById(id)
        return response.data as User
      },
      enabled: !!id // Only run if ID is provided
    })
  }

  // Create a new user
  const createUser = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const response = await userService.create(userData)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      toast({
        title: 'Usuário criado com sucesso',
        description: 'O novo usuário foi adicionado ao sistema'
      })
    },
    onError: (error: any) => {
      console.error('Erro ao criar usuário:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao criar usuário',
        description: error.response?.data?.message || 'Não foi possível criar o usuário'
      })
    }
  })

  // Update an existing user
  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserFormData> }) => {
      const response = await userService.update(id, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch users list and the specific user
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
      
      toast({
        title: 'Usuário atualizado com sucesso',
        description: 'As informações do usuário foram atualizadas'
      })
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar usuário:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar usuário',
        description: error.response?.data?.message || 'Não foi possível atualizar o usuário'
      })
    }
  })

  // Delete a user
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await userService.delete(id)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      toast({
        title: 'Usuário removido com sucesso',
        description: 'O usuário foi removido do sistema'
      })
    },
    onError: (error: any) => {
      console.error('Erro ao remover usuário:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao remover usuário',
        description: error.response?.data?.message || 'Não foi possível remover o usuário'
      })
    }
  })

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
}
