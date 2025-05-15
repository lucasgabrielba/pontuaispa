// useCards.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { cardsService } from '@/services/cards-service';
import { Card, RecommendedCard, RewardProgram } from '@/types/cards';

export function useCards() {
  const queryClient = useQueryClient();
  const [isCardFormDialogOpen, setIsCardFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  // Query para buscar cartões
  const {
    data: cards,
    isLoading: isLoadingCards,
    error: cardsError,
    refetch: refetchCards
  } = useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: cardsService.getCards
  });

  // Query para buscar cartões recomendados
  const {
    data: recommendedCards,
    isLoading: isLoadingRecommendedCards,
    error: recommendedCardsError
  } = useQuery<RecommendedCard[]>({
    queryKey: ['recommendedCards'],
    queryFn: cardsService.getRecommendedCards
  });

  // Query para buscar programas de recompensas
  const {
    data: rewardPrograms,
    isLoading: isLoadingRewardPrograms
  } = useQuery<RewardProgram[]>({
    queryKey: ['rewardPrograms'],
    queryFn: cardsService.getRewardPrograms
  });

  // Mutação para adicionar cartão
  const addCardMutation = useMutation({
    mutationFn: cardsService.addCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      setIsCardFormDialogOpen(false);
      toast({
        title: 'Cartão adicionado com sucesso',
        description: 'O cartão foi cadastrado e está pronto para uso'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar cartão',
        description: error.message || 'Não foi possível adicionar o cartão'
      });
    }
  });

  // Mutação para editar cartão
  const updateCardMutation = useMutation({
    mutationFn: cardsService.updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      setIsCardFormDialogOpen(false);
      setCardToEdit(null);
      toast({
        title: 'Cartão atualizado com sucesso',
        description: 'Os dados do cartão foram atualizados'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar cartão',
        description: error.message || 'Não foi possível atualizar o cartão'
      });
    }
  });

  // Mutação para atualizar status do cartão (ativo/inativo)
  const updateCardStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) => 
      cardsService.updateCardStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do cartão foi atualizado com sucesso'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: error.message || 'Não foi possível atualizar o status do cartão'
      });
    }
  });

  // Mutação para deletar cartão
  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => cardsService.deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      setIsDeleteDialogOpen(false);
      setCardToDelete(null);
      toast({
        title: 'Cartão removido',
        description: 'O cartão foi removido com sucesso'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover cartão',
        description: error.message || 'Não foi possível remover o cartão'
      });
    }
  });

  // Handler para abrir formulário para adicionar cartão
  const handleOpenAddCardForm = () => {
    setCardToEdit(null);
    setIsCardFormDialogOpen(true);
  };

  // Handler para abrir formulário para editar cartão
  const handleOpenEditCardForm = (card: Card) => {
    setCardToEdit(card);
    setIsCardFormDialogOpen(true);
  };

  // Handler para submeter formulário (adicionar ou editar)
  const handleSubmitCardForm = (cardData: Omit<Card, 'rewardProgramName'>) => {
    if (cardData.id) {
      // Para edição, precisamos incluir o nome do programa para o updateCard
      const rewardProgram = rewardPrograms?.find(p => p.id === cardData.rewardProgramId);
      const fullCardData: Card = {
        ...cardData,
        rewardProgramName: rewardProgram?.name || 'Sem programa'
      };
      updateCardMutation.mutate(fullCardData);
    } else {
      // Para adição, o backend vai adicionar o nome do programa
      addCardMutation.mutate(cardData);
    }
  };

  // Handler para atualizar status do cartão
  const handleUpdateCardStatus = (id: string, isActive: boolean) => {
    updateCardStatusMutation.mutate({ id, isActive });
  };

  // Handler para confirmar exclusão de cartão
  const handleConfirmDeleteCard = () => {
    if (cardToDelete) {
      deleteCardMutation.mutate(cardToDelete);
    }
  };

  // Handler para abrir o diálogo de exclusão
  const handleOpenDeleteDialog = (id: string) => {
    setCardToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return {
    cards,
    recommendedCards,
    rewardPrograms,
    isLoadingCards,
    isLoadingRecommendedCards,
    isLoadingRewardPrograms,
    cardsError,
    recommendedCardsError,
    isCardFormDialogOpen,
    setIsCardFormDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    cardToEdit,
    cardToDelete,
    handleOpenAddCardForm,
    handleOpenEditCardForm,
    handleSubmitCardForm,
    handleUpdateCardStatus,
    handleConfirmDeleteCard,
    handleOpenDeleteDialog,
    refetchCards,
    isSubmitting: addCardMutation.isPending || updateCardMutation.isPending,
    isUpdating: updateCardStatusMutation.isPending,
    isDeleting: deleteCardMutation.isPending
  };
}