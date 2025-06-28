import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  IconTrash,
  IconAlertCircle,
  IconStar,
  IconTarget,
  IconCreditCard,
  IconTrendingUp
} from "@tabler/icons-react"
import { adminInvoicesService } from '@/services/admin-invoices-service'
import { toast } from '@/hooks/use-toast'
import { Lightbulb, TrendingUp, Target } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'

interface Suggestion {
  id: string
  type: string
  title: string
  description: string
  recommendation: string
  impact_description?: string
  potential_points_increase?: string
  priority: 'low' | 'medium' | 'high'
  is_active?: boolean
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
  created_by: {
    id: string
    name: string
  }
  created_at: string
}

interface SuggestionsListProps {
  invoiceId?: string
  suggestions?: Suggestion[]
  isLoading: boolean
  onRefetch: () => void
  onCreateNew: () => void
}

const getSuggestionIcon = (type: string) => {
  switch (type) {
    case 'card_recommendation':
      return <IconCreditCard className="h-4 w-4" />
    case 'merchant_recommendation':
      return <IconTarget className="h-4 w-4" />
    case 'category_optimization':
      return <IconTrendingUp className="h-4 w-4" />
    case 'points_strategy':
      return <IconStar className="h-4 w-4" />
    default:
      return <Lightbulb className="h-4 w-4" />
  }
}

const getSuggestionTypeLabel = (type: string) => {
  const types = {
    'card_recommendation': 'Cartão',
    'merchant_recommendation': 'Estabelecimento',
    'category_optimization': 'Categoria',
    'points_strategy': 'Pontos',
    'general_tip': 'Geral'
  }
  // @ts-expect-error - dasdas
  return types[type] || type
}

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive' as const, label: 'Alta', color: 'text-red-600' }
    case 'medium':
      return { variant: 'default' as const, label: 'Média', color: 'text-orange-600' }
    case 'low':
      return { variant: 'secondary' as const, label: 'Baixa', color: 'text-green-600' }
    default:
      return { variant: 'outline' as const, label: priority, color: 'text-gray-600' }
  }
}

export function SuggestionsList({
  invoiceId = '',
  suggestions = [],
  isLoading,
  onRefetch,
}: SuggestionsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (suggestionId: string) => {
    if (deletingId) return

    try {
      setDeletingId(suggestionId)
      await adminInvoicesService.deleteSuggestion(invoiceId, suggestionId)

      toast({
        title: 'Sugestão removida',
        description: 'A sugestão foi removida com sucesso.'
      })

      onRefetch()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover sugestão',
        description: error?.response?.data?.message || 'Não foi possível remover a sugestão'
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Alert>
        <IconAlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhuma sugestão foi criada ainda.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => {
        const priorityConfig = getPriorityConfig(suggestion.priority)
        const isActive = suggestion.is_active !== false

        return (
          <Card
            key={suggestion.id}
            className={`transition-all duration-200 hover:shadow-md ${!isActive ? 'opacity-60 bg-muted/30' : ''
              }`}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0 ${!isActive ? 'grayscale' : ''
                    }`}>
                    {suggestion.category ?
                      (
                        <CategoryIcon
                          iconName={suggestion.category.icon || 'help-circle'}
                          color={suggestion.category.color || 'gray'}
                          size={12}
                        />
                      ) : (
                        getSuggestionIcon(suggestion.type)
                      )
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground mb-2 leading-tight">
                  {suggestion.category ? `${suggestion.category.name}: ${suggestion.title}` : suggestion.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </Badge>

                      <Badge variant={priorityConfig.variant} className="text-xs">
                        {priorityConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(suggestion.id)}
                    disabled={deletingId === suggestion.id}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">Recomendação</p>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {suggestion.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Impact & Points */}
                {(suggestion.impact_description || suggestion.potential_points_increase) && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {suggestion.impact_description && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-green-800 mb-1">Impacto</p>
                            <p className="text-sm text-green-700">
                              {suggestion.impact_description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {suggestion.potential_points_increase && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <IconStar className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-amber-800 mb-1">Potencial</p>
                            <p className="text-sm text-amber-700 font-medium">
                              {suggestion.potential_points_increase}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Por {suggestion.created_by.name} • {' '}
                    {new Date(suggestion.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}