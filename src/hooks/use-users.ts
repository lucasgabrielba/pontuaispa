import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user-service'

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
  role?: string
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

  // Fetch all users with pagination and search
  const getUsers = (page = 1, perPage = 15, search = '') => {
    return useQuery({
      queryKey: ['users', page, perPage, search],
      queryFn: async () => {
        const params: any = { page, per_page: perPage }
        if (search) {
          params.search = search
        }
        
        const response = await userService.getAll(params)
        return response.data as UsersResponse
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
    })
  }

  // Get user by ID
  const getUser = (id: string, options?: { enabled?: boolean }) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: async () => {
        const response = await userService.getById(id)
        return response.data as User
      },
      enabled: options?.enabled ?? !!id,
      staleTime: 1000 * 60 * 5,
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
    },
    // Remove o toast do hook - será tratado no componente
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
    },
    // Remove o toast do hook - será tratado no componente
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
    },
    // Remove o toast do hook - será tratado no componente
  })

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
}