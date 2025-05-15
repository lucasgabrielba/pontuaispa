import { useState, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { FileUpIcon, FileTextIcon, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'

const formSchema = z.object({
  invoice_file: z.instanceof(File, { message: 'O arquivo da fatura é obrigatório' })
    .refine(file => file.size <= 10 * 1024 * 1024, {
      message: 'O arquivo deve ter no máximo 10MB',
    })
    .refine(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/csv'];
      return validTypes.includes(file.type);
    }, {
      message: 'O arquivo deve ser PDF, JPG, PNG ou CSV',
    }),
  reference_date: z.date({
    required_error: 'A data de referência é obrigatória',
  }),
});

type UploadInvoiceFormValues = z.infer<typeof formSchema>

interface UploadInvoiceStepProps {
  setActiveStep: (step: number) => void
  cardId: string | null
}

export default function UploadInvoiceStep({ setActiveStep, cardId }: UploadInvoiceStepProps) {
  const { uploadInvoice } = useOnboarding()
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UploadInvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference_date: new Date(),
    }
  })

  const onSubmit = (data: UploadInvoiceFormValues) => {
    if (!cardId) {
      form.setError('root', { 
        message: 'Não foi possível identificar o cartão. Por favor, tente novamente.' 
      })
      return
    }

    uploadInvoice.mutate({
      invoice_file: data.invoice_file,
      card_id: cardId,
      reference_date: format(data.reference_date, 'yyyy-MM-dd')
    }, {
      onSuccess: () => {
        setActiveStep(2) // Avançar para o próximo passo
      }
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      form.setValue('invoice_file', e.dataTransfer.files[0], { 
        shouldValidate: true,
        shouldDirty: true
      })
    }
  }

  const selectedFile = form.watch('invoice_file')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="invoice_file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Fatura do Cartão</FormLabel>
                <FormControl>
                  <div 
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                      dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
                      "flex flex-col items-center justify-center"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.jpg,.jpeg,.png,.csv"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          onChange(e.target.files[0])
                        }
                      }}
                      {...fieldProps}
                    />
                    
                    {value ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileTextIcon size={40} className="text-primary" />
                        <p className="font-medium">{value.name}</p>
                        <p className="text-sm text-muted-foreground">{(value.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FileUpIcon size={40} className="text-muted-foreground" />
                        <p className="font-medium">Arraste e solte sua fatura aqui</p>
                        <p className="text-sm text-muted-foreground">ou clique para selecionar um arquivo</p>
                        <p className="text-xs text-muted-foreground mt-2">Formatos aceitos: PDF, JPG, PNG, CSV</p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Envie a fatura completa para melhor análise de gastos (10MB max)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Mês de Referência</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MMMM 'de' yyyy", { locale: pt })
                        ) : (
                          <span>Selecione o mês/ano da fatura</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="default"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Mês/ano de referência da fatura
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.errors.root && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4 text-destructive">
              {form.formState.errors.root.message}
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setActiveStep(0)}
          >
            Voltar
          </Button>
          
          <Button 
            type="submit" 
            size="lg"
            disabled={uploadInvoice.isPending || !selectedFile}
          >
            {uploadInvoice.isPending ? 'Enviando...' : 'Continuar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}