import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import type { Card } from "@/types/cards"

interface CardFormProps {
  card?: Card | null
  banks?: string[]
  isLoadingBanks: boolean
  rewardPrograms: Array<{ id: string; name: string }>
  isLoadingRewardPrograms: boolean
  onSubmit: (data: Omit<Card, "rewardProgramName">) => void
  isSubmitting: boolean
}

interface CardFormData {
  id: string
  name: string
  bank: string
  lastDigits: string
  rewardProgramId: string
  conversionRate: number
  annualFee: string // String no form, convertido para number ou null
  isActive: boolean
}

export function CardForm({
  card,
  banks = [],
  isLoadingBanks,
  rewardPrograms,
  isLoadingRewardPrograms,
  onSubmit,
  isSubmitting,
}: CardFormProps) {
  console.log(
    'rewardPrograms',
    rewardPrograms,
  );
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: {
      id: "",
      name: "",
      bank: "",
      lastDigits: "",
      rewardProgramId: "",
      conversionRate: 1.0,
      annualFee: "",
      isActive: true,
    },
  })
  console.log(isSubmitting);
  // Reset form quando o cartão mudar
  useEffect(() => {
    reset({
      id: card?.id || "",
      name: card?.name || "",
      bank: card?.bank || "",
      lastDigits: card?.lastDigits || "",
      rewardProgramId: card?.rewardProgramId || "",
      conversionRate: card?.conversionRate || 1.0,
      annualFee: card?.annualFee?.toString() || "",
      isActive: card?.isActive ?? true,
    })
  }, [card, reset])

  const handleFormSubmit = handleSubmit((data) => {
    // Converter annualFee de string para number ou null
    const annualFee = data.annualFee === "" ? null : Number(data.annualFee)

    onSubmit({
      ...data,
      conversionRate: Number(data.conversionRate),
      annualFee,
    })
  })

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="bank" className={errors.bank ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
          <Label htmlFor="lastDigits" className="font-medium">
            Últimos 4 dígitos
          </Label>
          <Input
            id="lastDigits"
            placeholder="Ex: 1234"
            maxLength={4}
            {...register("lastDigits", {
              required: "Últimos dígitos são obrigatórios",
              pattern: {
                value: /^[0-9]{4}$/,
                message: "Digite os 4 últimos dígitos do cartão",
              },
            })}
            className={errors.lastDigits ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">Usado para identificar seu cartão</p>
          {errors.lastDigits && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.lastDigits.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualFee" className="font-medium">
            Anuidade (R$)
          </Label>
          <Input
            id="annualFee"
            type="number"
            placeholder="Ex: 400 (deixe vazio para gratuito)"
            {...register("annualFee", {
              min: {
                value: 0,
                message: "Valor não pode ser negativo",
              },
            })}
            className={errors.annualFee ? "border-destructive" : ""}
          />
          {errors.annualFee && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.annualFee.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rewardProgramId" className="font-medium">
          Programa de Pontos
        </Label>
        {isLoadingRewardPrograms ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Controller
            name="rewardProgramId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="rewardProgramId">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="conversionRate" className="font-medium">
          Taxa de Conversão
        </Label>
        <Input
          id="conversionRate"
          type="number"
          step="0.01"
          placeholder="Ex: 1.2"
          {...register("conversionRate", {
            required: "Taxa de conversão é obrigatória",
            min: {
              value: 0.1,
              message: "Taxa deve ser maior que 0.1",
            },
          })}
          className={errors.conversionRate ? "border-destructive" : ""}
        />
        <p className="text-xs text-muted-foreground">Quantos pontos você ganha por cada R$ 1,00 gasto</p>
        {errors.conversionRate && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.conversionRate.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="isActive" className="font-medium">
            Cartão Ativo
          </Label>
          <p className="text-sm text-muted-foreground">Desative caso não esteja mais usando este cartão</p>
        </div>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
    </form>
  )
}