// src/features/admin/invoices/details/components/suggestions-list.tsx
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp,
  CreditCard,
  Store,
  Target,
  Lightbulb,
  AlertTriangle
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { adminInvoicesService } from '@/services/admin-invoices-service'
import { toast } from '@/hooks/use-toast'

interface Suggestion {
  id: string
  type: 'card_recommendation' | 'merchant_recommendation' | 'category_optimization' | 'points_strategy' | 'general_tip'
  title: string
  description: string
  recommendation: string
  impact_description?: string
  potential_points_increase?: string
  priority: 'low' | 'medium' | 'high'
  is_personalized: boolean
  applies_to_future: boolean
  created_at: string
  created_by: {
    name: string
    id: string
  }
  status: 'active' | 'archived'
}

interface SuggestionsListProps {
  invoiceId: string
  suggestions?: Suggestion[]
  isLoading: boolean
  onRefetch: () => void
  onCreateNew: () => void
}

const suggestionTypeConfig = {
  card_recommendation: {
    label: 'Recomendação de Cartão',
    icon: CreditCard,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  merchant_recommendation: {
    label: 'Recomendação de Estabelecimento',
    icon: Store,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  category_optimization: {
    label: 'Otimização de Categoria',
    icon: Target,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  },
  points_strategy: {
    label: 'Estratégia de Pontos',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  },
  general_tip: {
    label: 'Dica Geral',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
}

const priorityConfig = {
  low: { label: 'Baixa', variant: 'secondary' as const },
  medium: { label: 'Média', variant: 'default' as const },
  high: { label: 'Alta', variant: 'destructive' as const }
}

export function SuggestionsList({ 
  invoiceId, 
  suggestions = [], 
  isLoading, 
  onRefetch, 
  onCreateNew 
}: SuggestionsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [suggestionToDelete, setSuggestionToDelete] = useState<string | null>(null)

  // Mutação para deletar sugestão
  const deleteSuggestion = useMutation({
    mutationFn: (suggestionId: string) =>
      adminInvoicesService.deleteSuggestion(invoiceId, suggestionId),
    onSuccess: () => {
      toast({
        title: 'Sugestão removida',
        description: 'A sugestão foi removida com sucesso.'
      })
      onRefetch()
      setDeleteDialogOpen(false)
      setSuggestionToDelete(null)
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover sugestão',
        description: error?.response?.data?.message || 'Não foi possível remover a sugestão'
      })
    }
  })

  // Mutação para arquivar/desarquivar sugestão
  const toggleSuggestionStatus = useMutation({
    mutationFn: ({ suggestionId, status }: { suggestionId: string, status: 'active' | 'archived' }) =>
      adminInvoicesService.updateSuggestionStatus(invoiceId, suggestionId, status),
    onSuccess: () => {
      toast({
        title: 'Status atualizado',
        description: 'O status da sugestão foi atualizado.'
      })
      onRefetch()
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: error?.response?.data?.message || 'Não foi possível atualizar o status'
      })
    }
  })

  const handleDeleteSuggestion = (suggestionId: string) => {
    setSuggestionToDelete(suggestionId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (suggestionToDelete) {
      deleteSuggestion.mutate(suggestionToDelete)
    }
  }

  const handleToggleStatus = (suggestionId: string, currentStatus: 'active' | 'archived') => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active'
    toggleSuggestionStatus.mutate({ suggestionId, status: newStatus })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma sugestão criada</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Crie sugestões personalizadas para ajudar o usuário a otimizar seus pontos e melhorar suas estratégias de cartão.
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Sugestão
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Sugestões da Fatura</h3>
          <p className="text-sm text-muted-foreground">
            {suggestions.length} sugestão{suggestions.length !== 1 ? 'ões' : ''} criada{suggestions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Sugestão
        </Button>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const typeConfig = suggestionTypeConfig[suggestion.type]
          const TypeIcon = typeConfig.icon
          const priorityInfo = priorityConfig[suggestion.priority]

          return (
            <Card key={suggestion.id} className={suggestion.status === 'archived' ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-md ${typeConfig.color}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {typeConfig.label}
                      </Badge>
                      <Badge variant={priorityInfo.variant} className="text-xs">
                        {priorityInfo.label}
                      </Badge>
                      {suggestion.status === 'archived' && (
                        <Badge variant="secondary" className="text-xs">
                          Arquivada
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {suggestion.description}
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(suggestion.id, suggestion.status)}
                      >
                        {suggestion.status === 'active' ? (
                          <>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Arquivar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Reativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteSuggestion(suggestion.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Recomendação */}
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recomendação:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.recommendation}
                    </p>
                  </div>

                  {/* Impacto e Aumento Potencial */}
                  {(suggestion.impact_description || suggestion.potential_points_increase) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                      {suggestion.impact_description && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Impacto:</h4>
                          <p className="text-sm">{suggestion.impact_description}</p>
                        </div>
                      )}
                      {suggestion.potential_points_increase && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Aumento Potencial:</h4>
                          <p className="text-sm font-medium text-green-600">
                            {suggestion.potential_points_increase}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadados */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <span>Por: {suggestion.created_by.name}</span>
                      <span>{format(new Date(suggestion.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {suggestion.is_personalized && (
                        <Badge variant="outline" className="text-xs">
                          Personalizada
                        </Badge>
                      )}
                      {suggestion.applies_to_future && (
                        <Badge variant="outline" className="text-xs">
                          Futura
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialog de confirmação para deletar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta sugestão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSuggestion.isPending}
            >
              {deleteSuggestion.isPending ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}