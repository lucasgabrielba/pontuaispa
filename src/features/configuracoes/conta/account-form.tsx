import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUsers } from '@/hooks/use-users'

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Nome deve ter pelo menos 2 caracteres.',
    })
    .max(30, {
      message: 'Nome não pode ter mais de 30 caracteres.',
    }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { updateUsuario } = useUsers()
  const user = useAuthStore(state => state.auth.user)
  const setUser = useAuthStore(state => state.auth.setUser)

  const defaultValues: Partial<AccountFormValues> = {
    name: user?.name || '',
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
    try {
      await updateUsuario.mutateAsync({ id: user!.id, data })
      // Atualizar o state local do usuário após sucesso
      if (user) {
        setUser({
          ...user,
          ...data
        })
      }
    } catch (error) {
      // O erro já é tratado no hook
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder='Seu nome' {...field} />
              </FormControl>
              <FormDescription>
                Esse nome será exibido em seu perfil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={updateUsuario.isPending}
        >
          {updateUsuario.isPending ? 'Atualizando...' : 'Atualizar Conta'}
        </Button>
      </form>
    </Form>
  )
}