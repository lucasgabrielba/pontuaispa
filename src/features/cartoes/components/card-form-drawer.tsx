import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import type { Card } from "@/types/cards"
import { CustomSelect } from "@/components/custom-select"

interface CardFormData {
  name: string
  bank: string
  lastDigits: string
  rewardProgramId: string
  conversionRate: number
  annualFee: string // String no form, convertido para number ou null
  isActive: boolean
}

interface CardFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card?: Card | null
  rewardPrograms: Array<{ id: string; name: string }>
  isLoadingRewardPrograms: boolean
  onSubmit: (data: Omit<Card, "rewardProgramName">) => void
  isSubmitting: boolean
}

export function CardFormDrawer({
  open,
  onOpenChange,
  card,
  rewardPrograms,
  isLoadingRewardPrograms,
  onSubmit,
  isSubmitting,
}: CardFormDrawerProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: {
      name: "",
      bank: "",
      lastDigits: "",
      rewardProgramId: "",
      conversionRate: 1.0,
      annualFee: "",
      isActive: true,
    },
  })

  // Reset form when card changes or drawer opens
  useEffect(() => {
    if (open) {
      reset({
        name: card?.name || "",
        bank: card?.bank || "",
        lastDigits: card?.lastDigits || "",
        rewardProgramId: card?.rewardProgramId || "",
        conversionRate: card?.conversionRate || 1.0,
        annualFee: card?.annualFee?.toString() || "",
        isActive: card?.isActive ?? true,
      })
    }
  }, [card, reset, open])

  const handleFormSubmit = handleSubmit((data) => {
    // Converter annualFee de string para number ou null
    const annualFee = data.annualFee === "" ? null : Number(data.annualFee)

    // Ensure rewardProgramId is empty string if it's "none"
    const rewardProgramId = data.rewardProgramId === "none" ? "" : data.rewardProgramId

    onSubmit({
      ...data,
      rewardProgramId,
      id: card?.id || "",
      conversionRate: Number(data.conversionRate),
      annualFee,
    })
  })

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <form onSubmit={handleFormSubmit}>
          <SheetHeader>
            <SheetTitle>{card ? "Editar Cartão" : "Adicionar Novo Cartão"}</SheetTitle>
            <SheetDescription>
              Preencha os dados do seu cartão para receber recomendações personalizadas.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="Ex: Nubank Platinum"
                  {...register("name", { required: "Nome é obrigatório" })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank" className="text-right">
                Banco
              </Label>
              <div className="col-span-3">
                <Input
                  id="bank"
                  placeholder="Ex: Nubank"
                  {...register("bank", { required: "Banco é obrigatório" })}
                  className={errors.bank ? "border-destructive" : ""}
                />
                {errors.bank && <p className="text-destructive text-xs mt-1">{errors.bank.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastDigits" className="text-right">
                Últimos dígitos
              </Label>
              <div className="col-span-3">
                <Input
                  id="lastDigits"
                  placeholder="Ex: 4321"
                  maxLength={4}
                  {...register("lastDigits", {
                    required: "Últimos dígitos são obrigatórios",
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "Informe 4 dígitos numéricos",
                    },
                  })}
                  className={errors.lastDigits ? "border-destructive" : ""}
                />
                {errors.lastDigits && <p className="text-destructive text-xs mt-1">{errors.lastDigits.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardProgramId" className="text-right">
                Programa
              </Label>
              <div className="col-span-3">
                {isLoadingRewardPrograms ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Controller
                    name="rewardProgramId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        id="rewardProgramId"
                        value={field.value || "none"}
                        onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                        items={[
                          { label: "Sem programa de pontos", value: "none" },
                          ...rewardPrograms.map((program) => ({
                            label: program.name,
                            value: program.id,
                          })),
                        ]}
                        placeholder="Selecione o programa de pontos"
                      />
                    )}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conversionRate" className="text-right">
                Taxa de conversão
              </Label>
              <div className="col-span-3">
                <Input
                  id="conversionRate"
                  placeholder="Ex: 1.2"
                  type="number"
                  step="0.1"
                  min="0.1"
                  {...register("conversionRate", {
                    required: "Taxa de conversão é obrigatória",
                    min: {
                      value: 0.1,
                      message: "Taxa deve ser maior que 0.1",
                    },
                  })}
                  className={errors.conversionRate ? "border-destructive" : ""}
                />
                {errors.conversionRate && (
                  <p className="text-destructive text-xs mt-1">{errors.conversionRate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="annualFee" className="text-right">
                Anuidade (R$)
              </Label>
              <div className="col-span-3">
                <Input
                  id="annualFee"
                  placeholder="Ex: 400 (deixe vazio para gratuito)"
                  type="number"
                  min="0"
                  {...register("annualFee", {
                    min: {
                      value: 0,
                      message: "Valor não pode ser negativo",
                    },
                  })}
                  className={errors.annualFee ? "border-destructive" : ""}
                />
                {errors.annualFee && <p className="text-destructive text-xs mt-1">{errors.annualFee.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <span className="text-sm text-muted-foreground">Cartão está em uso atualmente</span>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (card ? "Salvando..." : "Adicionando...") : card ? "Salvar" : "Adicionar Cartão"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
