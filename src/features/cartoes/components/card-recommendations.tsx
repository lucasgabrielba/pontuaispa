import { Card as CardUI, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { IconCreditCard, IconAlertCircle, IconAward, IconTrendingUp } from "@tabler/icons-react"
import { useAnalysis } from "@/hooks/use-analysis"
import { useOnboarding } from "@/hooks/use-onboarding"

export function CardRecommendationsComponent() {
  const { userHasCards } = useOnboarding();
  const { cardsRecommendation } = useAnalysis(userHasCards.data || false);
  
  const isLoading = cardsRecommendation.isLoading || cardsRecommendation.isRefetching || userHasCards.isLoading;
  
  if (isLoading) {
    return (
      <CardUI>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
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
    );
  }
  
  if (cardsRecommendation.isError) {
    return (
      <CardUI>
        <CardHeader>
          <CardTitle>Recomendações de Cartões</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as recomendações. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      </CardUI>
    );
  }
  
  if (!cardsRecommendation.data || !cardsRecommendation.data.recommendations || cardsRecommendation.data.recommendations.length === 0) {
    return (
      <CardUI>
        <CardHeader>
          <CardTitle>Recomendações de Cartões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <IconCreditCard size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma recomendação disponível</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Adicione cartões e importe suas faturas para começar a receber recomendações personalizadas.
            </p>
            <Button>Adicionar Cartão</Button>
          </div>
        </CardContent>
      </CardUI>
    );
  }
  
  const { recommendations, summary, action_items } = cardsRecommendation.data;
  
  return (
    <CardUI>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAward size={20} className="text-primary" />
          Cartões Recomendados para o seu Perfil
        </CardTitle>
        <CardDescription>
          Com base nos seus gastos, recomendamos estes cartões para maximizar pontos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary && (
          <Alert className="mb-4">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>{summary}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((card, index) => (
            <div key={index} className="rounded-lg border p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold">{card.card_name}</div>
                <Badge variant="secondary">
                  {card.annual_fee > 0
                    ? `R$ ${(card.annual_fee / 100).toFixed(2).replace(".", ",")}`
                    : "Sem anuidade"}
                </Badge>
              </div>
              <div className="text-sm mb-4">{card.description}</div>
              <div className="text-sm mb-2">
                <span className="font-medium">Análise: </span>
                {card.analysis}
              </div>
              <div className="mt-auto pt-4 flex justify-between items-center">
                <div className="text-primary font-semibold flex items-center gap-1">
                  <IconTrendingUp size={16} />
                  {card.potential_points_increase} mais pontos
                </div>
                <Button variant="outline" size="sm">
                  Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>

        {action_items && action_items.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Ações Recomendadas:</h4>
            <ul className="space-y-1">
              {action_items.map((action, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <IconAlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </CardUI>
  );
}