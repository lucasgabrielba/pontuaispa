import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { IconTrash, IconEdit, IconBulb, IconTrendingUp, IconCreditCard, IconMapPin, IconTag, IconStar } from '@tabler/icons-react';
import { Suggestion } from '@/services/suggestions-service';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onEdit?: (suggestion: Suggestion) => void;
  onDelete?: (suggestionId: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

const SUGGESTION_TYPE_ICONS = {
  'card_recommendation': IconCreditCard,
  'merchant_recommendation': IconMapPin,
  'category_optimization': IconTag,
  'points_strategy': IconTrendingUp,
  'general_tip': IconBulb,
};

const PRIORITY_COLORS = {
  'high': 'destructive',
  'medium': 'default',
  'low': 'secondary',
} as const;

const PRIORITY_LABELS = {
  'high': 'Alta',
  'medium': 'Média', 
  'low': 'Baixa',
};

const TYPE_LABELS = {
  'card_recommendation': 'Recomendação de Cartão',
  'merchant_recommendation': 'Recomendação de Estabelecimento',
  'category_optimization': 'Otimização de Categoria',
  'points_strategy': 'Estratégia de Pontos',
  'general_tip': 'Dica Geral',
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function SuggestionsList({ 
  suggestions, 
  onEdit, 
  onDelete, 
  isLoading = false,
  showActions = true 
}: SuggestionsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (suggestionId: string) => {
    setDeletingId(suggestionId);
    try {
      await onDelete?.(suggestionId);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <IconBulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhuma sugestão encontrada para esta fatura.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => {
        const TypeIcon = SUGGESTION_TYPE_ICONS[suggestion.type as keyof typeof SUGGESTION_TYPE_ICONS] || IconBulb;
        
        return (
          <Card key={suggestion.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    <TypeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <Badge variant={PRIORITY_COLORS[suggestion.priority as keyof typeof PRIORITY_COLORS]}>
                        {PRIORITY_LABELS[suggestion.priority as keyof typeof PRIORITY_LABELS]}
                      </Badge>
                      {suggestion.is_personalized && (
                        <Badge variant="outline" className="text-xs">
                          <IconStar className="h-3 w-3 mr-1" />
                          Personalizada
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {TYPE_LABELS[suggestion.type as keyof typeof TYPE_LABELS]}
                    </p>
                  </div>
                </div>
                
                {showActions && (onEdit || onDelete) && (
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(suggestion)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === suggestion.id}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta sugestão? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(suggestion.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Descrição</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Recomendação</h4>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-sm text-blue-800">{suggestion.recommendation}</p>
                  </div>
                </div>
                
                {suggestion.impact_description && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Impacto Esperado</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.impact_description}</p>
                  </div>
                )}
                
                {suggestion.potential_points_increase && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Potencial de Pontos</h4>
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-sm">
                      <IconTrendingUp className="h-3 w-3" />
                      {suggestion.potential_points_increase}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-4">
                    {suggestion.created_by_user && (
                      <span>Por: {suggestion.created_by_user.name}</span>
                    )}
                    <span>
                      {formatDate(suggestion.created_at)}
                    </span>
                  </div>
                  
                  {suggestion.applies_to_future && (
                    <Badge variant="outline" className="text-xs">
                      Aplica ao futuro
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}