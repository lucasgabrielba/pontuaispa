import { CheckCircle, BarChart3, Clock, Gift } from "lucide-react"

export default function SuccessStep() {
  return (
    <div className="flex flex-col items-center text-center space-y-8 py-4 w-full">
      <div className="rounded-full bg-primary/10 p-3">
        <CheckCircle className="h-16 w-16 text-primary" />
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-2xl font-bold">Configuração Concluída!</h3>
        <p className="text-muted-foreground">
          Seu cartão foi configurado e sua fatura está sendo processada. Vamos analisar seus gastos e ajudar você a
          maximizar seus pontos!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
        <div className="flex flex-col items-center bg-muted/50 hover:bg-muted transition-colors rounded-lg p-6 text-center">
          <BarChart3 className="h-10 w-10 text-primary mb-3" />
          <h4 className="font-medium">Análise de Gastos</h4>
          <p className="text-sm text-muted-foreground mt-1">Visualize padrões de gastos para economizar</p>
        </div>

        <div className="flex flex-col items-center bg-muted/50 hover:bg-muted transition-colors rounded-lg p-6 text-center">
          <Clock className="h-10 w-10 text-primary mb-3" />
          <h4 className="font-medium">Alerta de Pontos</h4>
          <p className="text-sm text-muted-foreground mt-1">Receba notificações sobre pontos a expirar</p>
        </div>

        <div className="flex flex-col items-center bg-muted/50 hover:bg-muted transition-colors rounded-lg p-6 text-center">
          <Gift className="h-10 w-10 text-primary mb-3" />
          <h4 className="font-medium">Recomendações</h4>
          <p className="text-sm text-muted-foreground mt-1">Dicas personalizadas para acumular mais pontos</p>
        </div>
      </div>
    </div>
  )
}
