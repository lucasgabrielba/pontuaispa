// src/features/cartoes/components/card-form-drawer.tsx
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CardForm } from "./card-form"
import { Bank, Card } from "@/types"

interface CardFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card?: Card | null
  banks?: Bank[]
  isLoadingBanks: boolean
  rewardPrograms?: Array<{ id: string; name: string }>
  isLoadingRewardPrograms: boolean
  onSubmit: (data: Omit<Card, "reward_program_name">) => void
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
  const handleFormSubmit = (data: Omit<Card, "reward_program_name">) => {
    onSubmit(data);
  };

  const handleButtonClick = () => {
    // Aciona o método de submissão exposto pelo componente CardForm
    if (window.submitCardForm) {
      window.submitCardForm();
    }
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
          <Button 
            type="button" 
            onClick={handleButtonClick} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (card ? "Salvando..." : "Adicionando...") : card ? "Salvar" : "Adicionar Cartão"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}