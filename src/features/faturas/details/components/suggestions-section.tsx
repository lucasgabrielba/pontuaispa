import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconBulb } from '@tabler/icons-react';
import { SuggestionsList } from './suggestions-list';
import { SuggestionSheet } from './suggestion-sheet';
import { useSuggestions } from '@/hooks/use-suggestions';
import { useIsAdmin } from '@/hooks/use-is-admin';

interface SuggestionsSectionProps {
  invoiceId: string;
}

export function SuggestionsSection({ invoiceId }: SuggestionsSectionProps) {
  const isAdmin = useIsAdmin();
  const {
    suggestions,
    stats,
    isLoading,
    error,
    deleteSuggestion,
    refetchAll,
    hasSuggestions,
    totalSuggestions,
    highPrioritySuggestions
  } = useSuggestions({ invoiceId });

  const handleSuggestionCreated = () => {
    refetchAll();
  };

  const handleSuggestionDeleted = async (suggestionId: string) => {
    const result = await deleteSuggestion(suggestionId);
    if (!result.success) {
      console.error('Erro ao deletar sugestão:', result.error);
      // Aqui você pode adicionar um toast de erro
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">
            Erro ao carregar sugestões. Tente novamente mais tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconBulb className="h-5 w-5" />
              Sugestões de Otimização
            </CardTitle>
            <CardDescription>
              Recomendações personalizadas para maximizar seus pontos
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {hasSuggestions && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {totalSuggestions} sugestão{totalSuggestions !== 1 ? 'ões' : ''}
                </Badge>
                {highPrioritySuggestions > 0 && (
                  <Badge variant="destructive">
                    {highPrioritySuggestions} prioridade alta
                  </Badge>
                )}
              </div>
            )}
            
            {isAdmin && (
              <SuggestionSheet 
                invoiceId={invoiceId} 
                onCreated={handleSuggestionCreated}
              />
            )}
          </div>
        </div>
        
        {/* {stats && hasSuggestions && (
          <div className="flex items-center gap-4 mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Por tipo:</span>
              {Object.entries(stats.by_type).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {count}
                </Badge>
              ))}
            </div>
            
            {stats.personalized > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.personalized} personalizada{stats.personalized !== 1 ? 's' : ''}
              </Badge>
            )}
            
            {stats.applies_to_future > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.applies_to_future} aplica ao futuro
              </Badge>
            )}
          </div>
        )} */}
      </CardHeader>
      
      <CardContent>
        <SuggestionsList
          suggestions={suggestions}
          onDelete={isAdmin ? handleSuggestionDeleted : undefined}
          isLoading={isLoading}
          showActions={isAdmin}
        />
      </CardContent>
    </Card>
  );
}