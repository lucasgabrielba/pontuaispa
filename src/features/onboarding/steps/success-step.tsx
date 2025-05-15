import { useNavigate } from '@tanstack/react-router'
import { CheckCircle, ArrowRight, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessStep() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="rounded-full bg-primary/10 p-3">
        <CheckCircle className="h-16 w-16 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Configuração Concluída!</h3>
        <p className="text-muted-foreground">
          Seu cartão foi configurado e sua fatura está sendo processada. 
          Vamos analisar seus gastos e ajudar você a maximizar seus pontos!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
        <div className="flex flex-col items-center bg-muted rounded-lg p-4 text-center">
          <BarChart3 className="h-10 w-10 text-primary mb-2" />
          <h4 className="font-medium">Análise de Gastos</h4>
          <p className="text-sm text-muted-foreground">Visualize padrões de gastos para economizar</p>
        </div>
        
        <div className="flex flex-col items-center bg-muted rounded-lg p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <h4 className="font-medium">Alerta de Pontos</h4>
          <p className="text-sm text-muted-foreground">Receba notificações sobre pontos a expirar</p>
        </div>
        
        <div className="flex flex-col items-center bg-muted rounded-lg p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <h4 className="font-medium">Recomendações</h4>
          <p className="text-sm text-muted-foreground">Dicas personalizadas para acumular mais pontos</p>
        </div>
      </div>

      <Button 
        className="mt-8" 
        size="lg"
        onClick={() => navigate({ to: '/' })}
      >
        Ir para o Dashboard <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}