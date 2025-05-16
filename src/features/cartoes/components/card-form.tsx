import { useEffect, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import type { Card } from "@/types/cards"
import { Bank } from "@/types"

interface CardFormProps {
  card?: Card | null
  banks?: Bank[]
  isLoadingBanks: boolean
  rewardPrograms?: Array<{ id: string; name: string }>
  isLoadingRewardPrograms: boolean
  onSubmit: (data: Omit<Card, "reward_program_name">) => void
  isSubmitting: boolean
}

interface CardFormData {
  id: string
  name: string
  bank: string
  last_digits: string
  reward_program_id: string
  conversion_rate: number
  annual_fee: string // String no form, convertido para number ou null
  active: boolean
}

export function CardForm({
  card,
  banks,
  isLoadingBanks,
  // rewardPrograms,
  // isLoadingRewardPrograms,
  onSubmit,
  // isSubmitting,
}: CardFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: {
      id: "",
      name: "",
      bank: "",
      last_digits: "",
      reward_program_id: "",
      conversion_rate: 1.0,
      annual_fee: "",
      active: true,
    },
  })

  // Atualiza explicitamente o campo bank quando o card muda
  useEffect(() => {
    if (card && card.bank) {
      setValue('bank', card.bank);
    }
  }, [card, setValue]);

  // Reset form quando o cartão mudar
  useEffect(() => {
    if (card) {      
      setTimeout(() => {
        reset({
          id: card.id || "",
          name: card.name || "",
          bank: card.bank || "",
          last_digits: card.last_digits || "",
          // reward_program_id: card.reward_program_id || "",
          conversion_rate: card.conversion_rate || 1.0,
          annual_fee: card.annual_fee?.toString() || "",
          active: card.active ?? true,
        }, { keepDefaultValues: false });
      }, 50);
    }
  }, [card, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    // Converter annualFee de string para number ou null
    const annualFee = data.annual_fee === "" ? null : Number(data.annual_fee)

    onSubmit({
      ...data,
      conversion_rate: Number(data.conversion_rate),
      annual_fee: annualFee,
    })
  })

  // Expor método para submeter o formulário externamente
  useEffect(() => {
    // Define um método global para acessar a submissão do formulário
    window.submitCardForm = () => {
      formRef.current?.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    };
    
    return () => {
      // Limpa o método global quando o componente é desmontado
      delete window.submitCardForm;
    };
  }, []);

  return (
    <form id="card-form" ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">
            Nome do Cartão
          </Label>
          <Input
            id="name"
            placeholder="Ex: Nubank Platinum"
            {...register("name", { required: "Nome é obrigatório" })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.name.message}
            </p>
          )}
        </div>

          <div className="space-y-2">
          <Label htmlFor="bank" className="font-medium">
            Banco Emissor
          </Label>
          {isLoadingBanks ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Controller
              name="bank"
              control={control}
              rules={{ required: "Banco é obrigatório" }}
              render={({ field }) => {
                if (card?.bank && !field.value) {
                  field.value = card.bank;
                }
                return (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    defaultValue={card?.bank || ""}
                  >
                    <SelectTrigger id="bank" className={errors.bank ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks?.map((bank) => (
                        <SelectItem key={bank.name} value={bank.name}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          )}
          {errors.bank && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.bank.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="last_digits" className="font-medium">
            Últimos 4 dígitos
          </Label>
          <Input
            id="last_digits"
            placeholder="Ex: 1234"
            maxLength={4}
            {...register("last_digits", {
              required: "Últimos dígitos são obrigatórios",
              pattern: {
                value: /^[0-9]{4}$/,
                message: "Digite os 4 últimos dígitos do cartão",
              },
            })}
            className={errors.last_digits ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">Usado para identificar seu cartão</p>
          {errors.last_digits && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.last_digits.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="annual_fee" className="font-medium">
            Anuidade (R$)
          </Label>
          <Input
            id="annual_fee"
            type="number"
            placeholder="Ex: 400 (deixe vazio para gratuito)"
            {...register("annual_fee", {
              min: {
                value: 0,
                message: "Valor não pode ser negativo",
              },
            })}
            className={errors.annual_fee ? "border-destructive" : ""}
          />
          {errors.annual_fee && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.annual_fee.message}
            </p>
          )}
        </div>
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="reward_program_id" className="font-medium">
          Programa de Pontos
        </Label>
        {isLoadingRewardPrograms ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Controller
            name="reward_program_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="reward_program_id">
                  <SelectValue placeholder="Selecione o programa de pontos" />
                </SelectTrigger>
                <SelectContent>
                  {rewardPrograms?.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="conversion_rate" className="font-medium">
          Taxa de Conversão
        </Label>
        <Input
          id="conversion_rate"
          type="number"
          step="0.01"
          placeholder="Ex: 1.2"
          {...register("conversion_rate", {
            required: "Taxa de conversão é obrigatória",
            min: {
              value: 0.1,
              message: "Taxa deve ser maior que 0.1",
            },
          })}
          className={errors.conversion_rate ? "border-destructive" : ""}
        />
        <p className="text-xs text-muted-foreground">Quantos pontos você ganha por cada R$ 1,00 gasto</p>
        {errors.conversion_rate && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.conversion_rate.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="active" className="font-medium">
            Cartão Ativo
          </Label>
          <p className="text-sm text-muted-foreground">Desative caso não esteja mais usando este cartão</p>
        </div>
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Switch id="active" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
    </form>
  )
}

declare global {
  interface Window {
    submitCardForm?: () => void;
  }
}