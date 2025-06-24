import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUsers } from '@/hooks/use-users'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  status: z.enum(['Ativo', 'Inativo'], {
    required_error: 'Status é obrigatório',
  }),
  role: z.enum(['client', 'admin'], {
    required_error: 'Função é obrigatória',
  }),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => {
  if (data.password !== data.password_confirmation) {
    return false
  }
  return true
}, {
  message: 'Senhas não coincidem',
  path: ['password_confirmation'],
})

const editUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  status: z.enum(['Ativo', 'Inativo'], {
    required_error: 'Status é obrigatório',
  }),
  role: z.enum(['client', 'admin'], {
    required_error: 'Função é obrigatória',
  }),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
  password_confirmation: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false
  }
  return true
}, {
  message: 'Senhas não coincidem',
  path: ['password_confirmation'],
})

type UserFormData = z.infer<typeof createUserSchema>

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  userId?: string | null
}

export function UserDialog({ open, onOpenChange, mode, userId }: UserDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const { createUser, updateUser, getUser } = useUsers()
  const { data: userData, isLoading: isLoadingUser } = getUser(userId || '', {
    enabled: mode === 'edit' && !!userId
  })

  const form = useForm<UserFormData>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'Ativo',
      role: 'client',
      password: '',
      password_confirmation: '',
    },
  })

  // Reset form quando o dialog abre/fecha ou modo muda
  useEffect(() => {
    if (!open) {
      form.reset({
        name: '',
        email: '',
        status: 'Ativo',
        role: 'client',
        password: '',
        password_confirmation: '',
      })
      setShowPassword(false)
      setShowPasswordConfirmation(false)
      setIsSubmitting(false)
    }
  }, [open])

  // Preenche form quando editando
  useEffect(() => {
    if (mode === 'edit' && userData && open && !isSubmitting) {
      // Mapeia o status corretamente
      const mappedStatus = userData.status === 'Ativo' || userData.status === 'Ativo' ? 'Ativo' : 'Inativo'
      
      const formData = {
        name: userData.name,
        email: userData.email,
        status: mappedStatus,
        role: (userData.role as 'client' | 'admin') || 'client',
        password: '',
        password_confirmation: '',
      }
      
      // Só atualiza se os dados realmente mudaram
      const currentValues = form.getValues()
      if (JSON.stringify(currentValues) !== JSON.stringify(formData)) {
        //@ts-ignore
        form.reset(formData)
      }
    }
  }, [userData, mode, open, isSubmitting])

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)
    
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        status: data.status,
        role: data.role,
      }

      // Só adiciona senha se foi preenchida
      if (data.password && data.password.trim() !== '') {
        payload.password = data.password
        payload.password_confirmation = data.password_confirmation
      }

      if (mode === 'create') {
        if (!data.password || data.password.trim() === '') {
          toast({
            variant: 'destructive',
            title: 'Erro de validação',
            description: 'Senha é obrigatória para criar usuário'
          })
          return
        }
        await createUser.mutateAsync(payload)
        toast({
          title: 'Sucesso!',
          description: 'Usuário criado com sucesso!'
        })
      } else {
        await updateUser.mutateAsync({ id: userId!, data: payload })
        toast({
          title: 'Sucesso!',
          description: 'Usuário atualizado com sucesso!'
        })
      }

      onOpenChange(false)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: mode === 'create' ? 'Falha ao criar usuário' : 'Falha ao atualizar usuário',
        description: error?.response?.data?.message || 'Verifique os dados e tente novamente'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </SheetTitle>
          <SheetDescription>
            {mode === 'create' 
              ? 'Preencha os dados para criar um novo usuário no sistema.'
              : 'Altere os dados do usuário. Deixe a senha em branco para mantê-la inalterada.'
            }
          </SheetDescription>
        </SheetHeader>

        {mode === 'edit' && isLoadingUser ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando dados do usuário...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
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
                      <Input 
                        type="email" 
                        placeholder="Digite o email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {mode === 'create' ? 'Senha *' : 'Nova Senha (opcional)'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'}
                          placeholder={mode === 'create' ? 'Digite a senha' : 'Deixe em branco para manter atual'}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                    <FormLabel>
                      {mode === 'create' ? 'Confirmar Senha *' : 'Confirmar Nova Senha (opcional)'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPasswordConfirmation ? 'text' : 'password'}
                          placeholder={mode === 'create' ? 'Confirme a senha' : 'Confirme a nova senha se alterada'}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'create' ? 'Criando...' : 'Salvando...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  )
}