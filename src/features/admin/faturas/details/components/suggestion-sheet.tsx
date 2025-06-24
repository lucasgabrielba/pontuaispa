// src/features/admin/invoices/details/components/suggestion-sheet.tsx
import { useState } from 'react'
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useMutation } from '@tanstack/react-query'
import { adminInvoicesService } from '@/services/admin-invoices-service'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const suggestionSchema = z.object({
  type: z.enum(['card_recommendation', 'merchant_recommendation', 'category_optimization', 'points_strategy', 'general_tip'], {
    required_error: 'Tipo de sugestão é obrigatório',
  }),
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100, 'Título não pode ter mais de 100 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(500, 'Descrição não pode ter mais de 500 caracteres'),
  recommendation: z.string().min(20, 'Recomendação deve ter pelo menos 20 caracteres').max(1000, 'Recomendação não pode ter mais de 1000 caracteres'),
  impact_description: z.string().optional(),
  potential_points_increase: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Prioridade é obrigatória',
  }),
  is_personalized: z.boolean().default(true),
  applies_to_future: z.boolean().default(false),
})

type SuggestionFormData = z.infer<typeof suggestionSchema>

interface SuggestionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceId: string
  onSuccess: () => void
}

const suggestionTypes = [
  { value: 'card_recommendation', label: 'Recomendação de Cartão', description: 'Sugerir cartão específico para categoria' },
  { value: 'merchant_recommendation', label: 'Recomendação de Estabelecimento', description: 'Indicar melhores locais para comprar' },
  { value: 'category_optimization', label: 'Otimização de Categoria', description: 'Como maximizar pontos em categoria específica' },
  { value: 'points_strategy', label: 'Estratégia de Pontos', description: 'Dicas para acumular mais pontos' },
  { value: 'general_tip', label: 'Dica Geral', description: 'Conselho geral sobre cartões e pontos' },
]

const priorityLevels = [
  { value: 'low', label: 'Baixa', description: 'Sugestão opcional' },
  { value: 'medium', label: 'Média', description: 'Sugestão recomendada' },
  { value: 'high', label: 'Alta', description: 'Sugestão importante' },
]

export function SuggestionSheet({ open, onOpenChange, invoiceId, onSuccess }: SuggestionSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      type: 'card_recommendation',
      title: '',
      description: '',
      recommendation: '',
      impact_description: '',
      potential_points_increase: '',
      priority: 'medium',
      is_personalized: true,
      applies_to_future: false,
    },
  })

  // Mutação para criar sugestão
  const createSuggestion = useMutation({
    mutationFn: (data: SuggestionFormData) =>
      adminInvoicesService.createSuggestion(invoiceId, data),
    onSuccess: () => {
      toast({
        title: 'Sugestão criada com sucesso',
        description: 'A sugestão foi adicionada à fatura.'
      })
      form.reset()
      onSuccess()
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar sugestão',
        description: error?.response?.data?.message || 'Não foi possível criar a sugestão'
      })
    }
  })

  const onSubmit = async (data: SuggestionFormData) => {
    setIsSubmitting(true)
    try {
      await createSuggestion.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nova Sugestão</SheetTitle>
          <SheetDescription>
            Crie uma recomendação personalizada para esta fatura. As sugestões ajudam o usuário a otimizar seus pontos.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            {/* Tipo de Sugestão */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Sugestão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de sugestão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suggestionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Use o cartão Nubank para supermercados" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Título claro e direto da sugestão (5-100 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve explicação do contexto da sugestão..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Contexto e justificativa da sugestão (10-500 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recomendação */}
            <FormField
              control={form.control}
              name="recommendation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recomendação</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhe específico do que o usuário deve fazer para otimizar seus pontos..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Ação específica recomendada ao usuário (20-1000 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Impacto */}
              <FormField
                control={form.control}
                name="impact_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Impacto</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Economia de R$ 200/ano em anuidades..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Benefício esperado (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aumento Potencial de Pontos */}
              <FormField
                control={form.control}
                name="potential_points_increase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aumento Potencial</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: +25% pontos, +500 pontos/mês"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Aumento estimado de pontos (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Prioridade */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{priority.label}</span>
                            <span className="text-xs text-muted-foreground">{priority.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opções Avançadas */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium">Opções Avançadas</h4>
              
              <FormField
                control={form.control}
                name="is_personalized"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Sugestão Personalizada
                      </FormLabel>
                      <FormDescription>
                        Esta sugestão é específica para este usuário
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
                name="applies_to_future"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Aplicar a Futuras Faturas
                      </FormLabel>
                      <FormDescription>
                        Mostrar esta sugestão em faturas futuras similares
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
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Sugestão'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}