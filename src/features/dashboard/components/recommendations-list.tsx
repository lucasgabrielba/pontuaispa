import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  IconCreditCard, 
  IconArrowUpRight, 
  IconBuildingStore, 
  IconLighter,
  IconAlertCircle
} from '@tabler/icons-react'
import { useAnalysis } from '@/hooks/use-analysis'
import { useOnboarding } from '@/hooks/use-onboarding'
import { CardRecommendation } from '@/services/analysis-service'

export function RecommendationsListAI() {
  const { userHasCards } = useOnboarding();
  const { cardsRecommendation } = useAnalysis(userHasCards.data || false);
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const isLoading = cardsRecommendation.isLoading || cardsRecommendation.isRefetching || userHasCards.isLoading;

  // Converter recomendações do formato do backend para o formato esperado pelo componente existente
  useEffect(() => {
    if (cardsRecommendation.data?.recommendations) {
      const formattedRecommendations = cardsRecommendation.data.recommendations.map((rec: CardRecommendation) => ({
        id: Math.random().toString(),
        title: rec.card_name,
        description: rec.description,
        type: "card",
        recommendation: rec.analysis,
        potentialGain: parseInt(rec.potential_points_increase.replace('%', '')) || 0
      }));
      
      setRecommendations(formattedRecommendations);
    }
  }, [cardsRecommendation.data]);

  function getBadgeVariant(gain: number) {
    if (gain > 150) return "destructive"
    if (gain > 75) return "default"
    return "secondary"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="relative animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-8 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (cardsRecommendation.isError) {
    return (
      <Alert variant="default" className="bg-muted">
        <IconAlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Não foi possível carregar as recomendações. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Alert variant="default" className="bg-muted">
        <IconLighter className="h-4 w-4 mr-2" />
        <AlertDescription>
          Para receber recomendações personalizadas, envie mais faturas e continue usando seus cartões. Precisamos de mais dados para gerar sugestões para você.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mostrar mensagem de resumo se existir */}
      {cardsRecommendation.data?.summary && (
        <Alert>
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            {cardsRecommendation.data.summary}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Lista de recomendações */}
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id} className="relative">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                {recommendation.title}
              </CardTitle>
              <Badge variant={getBadgeVariant(recommendation.potentialGain)}>
                +{recommendation.potentialGain}% pontos
              </Badge>
            </div>
            <CardDescription>{recommendation.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="flex-1">
                <div className="flex items-center text-sm font-medium mb-1">
                  {recommendation.type === 'card' ? (
                    <IconCreditCard className="mr-2 h-4 w-4" />
                  ) : (
                    <IconBuildingStore className="mr-2 h-4 w-4" />
                  )}
                  {recommendation.type === 'card' ? 'Cartão Recomendado:' : 'Estabelecimento Recomendado:'}
                </div>
                <div className="text-md">{recommendation.recommendation}</div>
              </div>
              <Button size="sm" className="mt-2 sm:mt-0">
                Ver detalhes
                <IconArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Lista de ações recomendadas se existirem */}
      {cardsRecommendation.data?.action_items && cardsRecommendation.data.action_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações Recomendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cardsRecommendation.data.action_items.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <IconAlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}