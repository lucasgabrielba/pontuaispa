import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

const notificationsFormSchema = z.object({
  points_earned_emails: z.boolean().default(true).optional(),
  points_expiring_emails: z.boolean().default(true).optional(),
  special_offers_emails: z.boolean().default(true).optional(),
  card_recommendations_emails: z.boolean().default(true).optional(),
  spending_alerts_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// Isso pode vir do seu banco de dados ou API.
const defaultValues: Partial<NotificationsFormValues> = {
  points_earned_emails: true,
  points_expiring_emails: true,
  special_offers_emails: true,
  card_recommendations_emails: true,
  spending_alerts_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationsFormValues) {
    toast({
      title: 'Você atualizou suas preferências de notificação.',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='relative'>
          <h3 className='mb-4 text-lg font-medium'>Notificações por Email</h3>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='points_earned_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Pontos acumulados
                    </FormLabel>
                    <FormDescription>
                      Receber emails quando acumular novos pontos em suas compras.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='points_expiring_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Pontos expirando
                    </FormLabel>
                    <FormDescription>
                      Receber alertas quando seus pontos estiverem próximos de expirar.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='special_offers_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Ofertas especiais
                    </FormLabel>
                    <FormDescription>
                      Receber emails sobre ofertas exclusivas baseadas em seus gastos habituais.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='card_recommendations_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Recomendações de cartões
                    </FormLabel>
                    <FormDescription>
                      Receber sugestões de cartões que melhor se adequam ao seu perfil de gastos.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='spending_alerts_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Alertas de gastos
                    </FormLabel>
                    <FormDescription>
                      Receber notificações sobre padrões de gastos e oportunidades de economia.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='security_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Emails de segurança
                    </FormLabel>
                    <FormDescription>
                      Receber emails sobre a atividade e segurança da sua conta.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type='submit'>Atualizar notificações</Button>
      </form>
    </Form>
  )
}