import { userService } from '../services/user-service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'

export const useUsers = () => {
  const queryClient = useQueryClient()

  // Buscar todos os usuários
  const useGetUsers = (params?: any) => useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params).then(res => res.data),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  // Buscar usuário por ID
  const useGetUserById = (id: string) => useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id).then(res => res.data),
    enabled: !!id
  })

  // Criar usuário
  const createUsuario = useMutation({
    mutationFn: (data: any) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuário criado',
        description: 'O usuário foi criado com sucesso!'
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar usuário',
        description: error.response?.data?.message || 'Não foi possível criar o usuário'
      })
    }
  })

  // Atualizar usuário
  const updateUsuario = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
      toast({
        title: 'Usuário atualizado',
        description: 'O usuário foi atualizado com sucesso!'
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar usuário',
        description: error.response?.data?.message || 'Não foi possível atualizar o usuário'
      })
    }
  })

  // Excluir usuário
  const deleteUsuario = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso!'
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir usuário',
        description: error.response?.data?.message || 'Não foi possível excluir o usuário'
      })
    }
  })

  return {
    useGetUsers,
    useGetUserById,
    createUsuario,
    updateUsuario,
    deleteUsuario
  }
}