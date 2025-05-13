import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconCreditCard, IconArrowUpRight, IconBuildingStore } from '@tabler/icons-react'

export function RecommendationsList() {
  return (
    <div className="space-y-4">
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
    </div>
  )
}

function getBadgeVariant(gain: number) {
  if (gain > 150) return "destructive"
  if (gain > 75) return "default"
  return "secondary"
}

const recommendations = [
  {
    id: 1,
    title: "Supermercado - Mude de estabelecimento",
    description: "Você gastou R$ 1.235,00 em supermercados este mês. Recomendamos trocar de estabelecimento para maximizar pontos.",
    type: "merchant", 
    recommendation: "Carrefour oferece 4x mais pontos com seu cartão atual",
    potentialGain: 200,
  },
  {
    id: 2,
    title: "Postos de combustível - Use outro cartão",
    description: "Seus gastos em postos são significativos (R$ 420,00/mês). Um cartão específico seria melhor.",
    type: "card",
    recommendation: "Cartão Shell Box Itaucard Platinum",
    potentialGain: 120,
  },
  {
    id: 3,
    title: "Restaurantes - Concentre seus gastos",
    description: "Você frequenta restaurantes diversificados. Concentre gastos em estabelecimentos parceiros.",
    type: "merchant",
    recommendation: "Rede Outback (5x mais pontos às terças-feiras)",
    potentialGain: 85,
  },
  {
    id: 4,
    title: "Streaming - Agrupe serviços",
    description: "Você paga por vários serviços de streaming separadamente. Agrupe para maximizar pontos.",
    type: "merchant",
    recommendation: "Plano combo na Amazon Prime",
    potentialGain: 45,
  },
]