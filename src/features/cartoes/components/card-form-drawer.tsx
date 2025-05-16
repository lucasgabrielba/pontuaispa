import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { Card } from "@/types/cards"
import { CardForm } from "./card-form"

interface CardFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card?: Card | null
  banks?: string[]
  isLoadingBanks: boolean
  rewardPrograms: Array<{ id: string; name: string }>
  isLoadingRewardPrograms: boolean
  onSubmit: (data: Omit<Card, "rewardProgramName">) => void
  isSubmitting: boolean
}

export function CardFormDrawer({
  open,
  onOpenChange,
  card,
  banks,
  isLoadingBanks,
  rewardPrograms,
  isLoadingRewardPrograms,
  onSubmit,
  isSubmitting,
}: CardFormDrawerProps) {
  const handleFormSubmit = (data: Omit<Card, "rewardProgramName">) => {
    onSubmit(data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{card ? "Editar Cartão" : "Adicionar Novo Cartão"}</SheetTitle>
          <SheetDescription>
            Preencha os dados do seu cartão para receber recomendações personalizadas.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <CardForm
            card={card}
            banks={banks}
            isLoadingBanks={isLoadingBanks}
            rewardPrograms={rewardPrograms}
            isLoadingRewardPrograms={isLoadingRewardPrograms}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="card-form" disabled={isSubmitting}>
            {isSubmitting ? (card ? "Salvando..." : "Adicionando...") : card ? "Salvar" : "Adicionar Cartão"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}