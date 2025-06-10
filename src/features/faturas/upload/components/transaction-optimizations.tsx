import {
  Card as CardUI,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IconCreditCard,
  IconAlertCircle,
  IconArrowRight,
  IconReplace
} from "@tabler/icons-react"
import { useAnalysis } from "@/hooks/use-analysis"
import { useOnboarding } from "@/hooks/use-onboarding"

export function TransactionOptimizationsComponent() {
  const { userHasCards } = useOnboarding();
  const { transactionOptimizations } = useAnalysis(userHasCards.data || false);

  const isLoading = transactionOptimizations.isLoading || transactionOptimizations.isRefetching || userHasCards.isLoading;

  if (isLoading) {
    return (
      <CardUI>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </CardUI>
    );
  }

  if (transactionOptimizations.isError) {
    return (
      <CardUI>
        <CardHeader>
          <CardTitle>Otimizações de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as otimizações. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      </CardUI>
    );
  }

  if (!transactionOptimizations.data || !transactionOptimizations.data.optimizations || transactionOptimizations.data.optimizations.length === 0) {
    return (
      <CardUI>
        <CardHeader>
          <CardTitle>Otimizações de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <IconCreditCard size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma otimização disponível</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Adicione mais transações recentes para que possamos analisar e sugerir otimizações.
            </p>
            <Button>Importar Fatura</Button>
          </div>
        </CardContent>
      </CardUI>
    );
  }

  const { optimizations, summary, estimated_monthly_point_increase } = transactionOptimizations.data;

  // Função auxiliar para formatar o nome do cartão
  const formatCardName = (card: any) => {
    if (typeof card === 'string') return card;
    if (typeof card === 'object' && card?.name) {
      return `${card.name}${card.last_digits ? ` ****${card.last_digits}` : ''}`;
    }
    return 'Cartão não identificado';
  };

  return (
    <CardUI>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconReplace size={20} className="text-primary" />
          Otimizações de Transações
        </CardTitle>
        <CardDescription>
          Estas são suas oportunidades para maximizar pontos em transações futuras
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary && (
          <Alert className="mb-4">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>{summary}</AlertDescription>
          </Alert>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Estabelecimento</TableHead>
              <TableHead>Cartão Atual</TableHead>
              <TableHead>Cartão Recomendado</TableHead>
              <TableHead className="text-right">Aumento Potencial</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimizations.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {item.transaction_details.merchant_name}
                  {item.transaction_details.amount && (
                    <div className="text-xs text-muted-foreground">
                      R$ {(item.transaction_details.amount / 100).toFixed(2).replace(".", ",")}
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatCardName(item.current_card)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IconArrowRight className="text-green-500" size={16} />
                    <span className="font-medium">{formatCardName(item.recommended_card)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    +{item.potential_increase_percentage}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {estimated_monthly_point_increase && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
            <div className="text-lg font-semibold text-primary">
              Estimativa de aumento mensal de pontos: {estimated_monthly_point_increase}
            </div>
            <div className="text-sm text-muted-foreground">
              Seguindo essas recomendações
            </div>
          </div>
        )}
      </CardContent>
    </CardUI>
  );
}