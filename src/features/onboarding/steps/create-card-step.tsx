import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingService } from '@/services/onboarding-service'
import { useOnboarding } from '@/hooks/use-onboarding'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome do cartão é obrigatório' }),
  bank: z.string().min(1, { message: 'O banco emissor do cartão é obrigatório' }),
  last_digits: z.string().length(4, { message: 'Os últimos 4 dígitos do cartão são obrigatórios' })
    .regex(/^\d{4}$/, { message: 'Os últimos dígitos devem conter apenas números' }),
  conversion_rate: z.number().optional(),
  annual_fee: z.number().nullable().optional(),
  active: z.boolean().default(true),
  reward_program_id: z.string().optional(),
})

type CreateCardFormValues = z.infer<typeof formSchema>

interface CreateCardStepProps {
  setActiveStep: (step: number) => void
}

export default function CreateCardStep({ setActiveStep }: CreateCardStepProps) {
  const { createCard, rewardPrograms } = useOnboarding()
  const [banks, setBanks] = useState<string[]>([])
  const [rewardProgramsState, setRewardProgramsState] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    // Carregar bancos
    onboardingService.getBanks().then(response => {
      setBanks(response.data)
    })

    // Carregar programas de recompensas
    onboardingService.getMockRewardPrograms().then(response => {
      setRewardProgramsState(response.data)
    })
  }, [])

  const form = useForm<CreateCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bank: '',
      last_digits: '',
      conversion_rate: 1,
      annual_fee: 0,
      active: true,
    }
  })

  const onSubmit = (data: CreateCardFormValues) => {
    // Montar objeto para envio da API
    const cardData = {
      ...data,
      reward_programs: data.reward_program_id ? [{
        reward_program_id: data.reward_program_id,
        is_primary: true
      }] : undefined
    }

    // Remover campo extra do form que não é usado na API
    delete (cardData as any).reward_program_id

    createCard.mutate(cardData, {
      onSuccess: () => {
        setActiveStep(1) // Avançar para o próximo passo
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank Platinum" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco Emissor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks.map(bank => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="last_digits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Últimos 4 dígitos</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 1234" maxLength={4} {...field} />
                  </FormControl>
                  <FormDescription>
                    Usado para identificar seu cartão
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="annual_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anuidade (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 400" 
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value !== null ? field.value : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />
          
          <FormField
            control={form.control}
            name="reward_program_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programa de Pontos</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o programa de pontos" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rewardProgramsState.map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Programa principal de pontos do cartão
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="conversion_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Conversão</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="Ex: 1.2" 
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    value={field.value !== undefined ? field.value : ''}
                  />
                </FormControl>
                <FormDescription>
                  Quantos pontos você ganha por cada R$ 1,00 gasto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Cartão Ativo</FormLabel>
                  <FormDescription>
                    Desative caso não esteja mais usando este cartão
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
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={createCard.isPending}
          >
            {createCard.isPending ? 'Salvando...' : 'Continuar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}