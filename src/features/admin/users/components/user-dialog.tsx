import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUsers, UserFormData } from '@/hooks/use-users'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  userId?: string | null
}

export function UserDialog({ open, onOpenChange, mode, userId }: UserDialogProps) {
  const { getUser, createUser, updateUser } = useUsers()
  const { data: userData, isLoading: isLoadingUser } = getUser(userId || '')
  
  const createUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    status: z.string(),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    password_confirmation: z.string(),
    role: z.enum(['client', 'admin'])
  }).refine(data => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation']
  })

  const editUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    status: z.string(),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
    password_confirmation: z.string().optional().or(z.literal('')),
    role: z.enum(['client', 'admin'])
  }).refine(data => !data.password || data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation']
  })

  const schema = mode === 'create' ? createUserSchema : editUserSchema

  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      status: 'active',
      password: '',
      password_confirmation: '',
      role: 'client'
    }
  })

  useEffect(() => {
    if (mode === 'edit' && userData) {
      form.reset({
        name: userData.name,
        email: userData.email,
        status: userData.status === 'Ativo' ? 'active' : 'inactive',
        password: '',
        password_confirmation: '',
        role: 'client' // Assuming role is not returned in the API, set a default
      })
    } else if (mode === 'create') {
      form.reset({
        name: '',
        email: '',
        status: 'active',
        password: '',
        password_confirmation: '',
        role: 'client'
      })
    }
  }, [userData, mode, form])

  const onSubmit = async (data: UserFormData) => {
    try {
      if (mode === 'create') {
        await createUser.mutateAsync(data)
      } else if (mode === 'edit' && userId) {
        // Remove empty password fields for edit
        const updateData = { ...data }
        if (!updateData.password) {
          delete updateData.password
          delete updateData.password_confirmation
        }
        
        await updateUser.mutateAsync({ id: userId, data: updateData })
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>
        
        {mode === 'edit' && isLoadingUser ? (
          <div className="flex justify-center p-4">Carregando...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{mode === 'edit' ? 'Nova Senha (opcional)' : 'Senha'}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={createUser.isPending || updateUser.isPending}
                >
                  {createUser.isPending || updateUser.isPending
                    ? 'Salvando...'
                    : mode === 'create' ? 'Criar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
