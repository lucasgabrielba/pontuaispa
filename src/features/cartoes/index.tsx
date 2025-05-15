"use client"

import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { Button } from "@/components/ui/button"
import { Card as CardUI, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCreditCard, IconPlus, IconAlertCircle } from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useCards } from "@/hooks/use-cards"
import type { RecommendedCard } from "@/types/cards"
import { CardComponent } from "./components/card-component"
import { CardFormDrawer } from "./components/card-form-drawer"

export default function CardsPage() {
  const {
    cards,
    recommendedCards,
    rewardPrograms,
    isLoadingCards,
    isLoadingRecommendedCards,
    isLoadingRewardPrograms,
    isCardFormDialogOpen,
    setIsCardFormDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    cardToEdit,
    handleOpenAddCardForm,
    handleOpenEditCardForm,
    handleSubmitCardForm,
    handleUpdateCardStatus,
    handleConfirmDeleteCard,
    handleOpenDeleteDialog,
    isSubmitting,
    isDeleting,
  } = useCards()

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="gap-2" onClick={() => (window.location.href = "/")}>
            <IconCreditCard size={18} />
            Cartões
          </Button>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meus Cartões</h1>
            <p className="text-muted-foreground">
              Gerencie seus cartões de crédito para melhores recomendações de pontos.
            </p>
          </div>
          <Button onClick={handleOpenAddCardForm}>
            <IconPlus className="mr-2 h-4 w-4" />
            Adicionar Cartão
          </Button>
        </div>

        <Tabs defaultValue="meus-cartoes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="meus-cartoes">Meus Cartões</TabsTrigger>
            <TabsTrigger value="recomendados">Recomendados</TabsTrigger>
          </TabsList>

          <TabsContent value="meus-cartoes" className="space-y-4">
            {isLoadingCards ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : cards && cards.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <CardComponent
                    key={card.id}
                    card={card}
                    onStatusChange={handleUpdateCardStatus}
                    onDeleteClick={handleOpenDeleteDialog}
                    onEditClick={handleOpenEditCardForm}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum cartão encontrado"
                description="Você ainda não cadastrou nenhum cartão. Adicione seu primeiro cartão para começar a receber recomendações."
                actionLabel="Adicionar Cartão"
                onAction={handleOpenAddCardForm}
              />
            )}
          </TabsContent>

          <TabsContent value="recomendados" className="space-y-4">
            {isLoadingRecommendedCards ? (
              <CardUI>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border p-4 flex flex-col">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="mt-auto pt-4 flex justify-between items-center">
                          <Skeleton className="h-5 w-1/4" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CardUI>
            ) : recommendedCards && recommendedCards.length > 0 ? (
              <CardUI>
                <CardHeader>
                  <CardTitle>Cartões Recomendados para o seu Perfil</CardTitle>
                  <CardDescription>
                    Com base nos seus gastos, recomendamos estes cartões para maximizar pontos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {recommendedCards.map((card) => (
                      <RecommendedCardComponent key={card.id} card={card} />
                    ))}
                  </div>
                </CardContent>
              </CardUI>
            ) : (
              <EmptyState
                title="Nenhuma recomendação disponível"
                description="Adicione cartões e importe suas faturas para começar a receber recomendações personalizadas."
                actionLabel="Adicionar Cartão"
                onAction={handleOpenAddCardForm}
              />
            )}
          </TabsContent>
        </Tabs>

        <CardFormDrawer
          open={isCardFormDialogOpen}
          onOpenChange={setIsCardFormDialogOpen}
          card={cardToEdit}
          rewardPrograms={rewardPrograms || []}
          isLoadingRewardPrograms={isLoadingRewardPrograms}
          onSubmit={handleSubmitCardForm}
          isSubmitting={isSubmitting}
        />

        <DeleteCardDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDeleteCard}
          isDeleting={isDeleting}
        />
      </Main>
    </>
  )
}

function CardSkeleton() {
  return (
    <CardUI>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </CardUI>
  )
}

interface RecommendedCardComponentProps {
  card: RecommendedCard
}

function RecommendedCardComponent({ card }: RecommendedCardComponentProps) {
  return (
    <div className="rounded-lg border p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold">{card.name}</div>
        <Badge variant="secondary">{card.bank}</Badge>
      </div>
      <div className="text-sm mb-4">{card.description}</div>
      <div className="text-sm mb-2">
        <span className="font-medium">Vantagens:</span> {card.benefits}
      </div>
      <div className="text-sm">
        <span className="font-medium">Programa:</span> {card.rewardProgramName}
      </div>
      <div className="mt-auto pt-4 flex justify-between items-center">
        <div className="text-primary font-semibold">{card.potentialIncrease}% mais pontos</div>
        <Button variant="outline" size="sm">
          Detalhes
        </Button>
        <Button variant="outline" size="sm">
          Detalhes
        </Button>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <IconCreditCard size={48} className="text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button onClick={onAction}>{actionLabel}</Button>
    </div>
  )
}

interface DeleteCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
}

function DeleteCardDialog({ open, onOpenChange, onConfirm, isDeleting }: DeleteCardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Remover Cartão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover este cartão? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Alert variant="destructive">
            <IconAlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Ao remover este cartão, você também perderá o histórico de pontos e recomendações associadas a ele.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Removendo..." : "Remover Cartão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
