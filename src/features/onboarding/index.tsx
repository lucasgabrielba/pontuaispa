// src/features/onboarding/index.tsx
import { useState } from 'react'
import { Main } from '@/components/layout/main'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { BuildingIcon, CreditCardIcon, FileTextIcon } from 'lucide-react'
import CreateCardStep from './steps/create-card-step'
import { useOnboarding } from '@/hooks/use-onboarding'
import { Step, Stepper } from '@/components/stepper'
import UploadInvoiceStep from './steps/upload-invoice-step'
import SuccessStep from './steps/success-step'

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0)
  const { cardId } = useOnboarding()

  return (
    <Main>
      <Card className="mx-auto max-w-3xl border shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bem-vindo ao Pontu AI</CardTitle>
          <CardDescription>
            Vamos configurar sua conta em alguns passos simples para maximizar seus pontos de fidelidade
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <Stepper
            activeStep={activeStep}
            initialStep={0}
            orientation="horizontal"
            state={activeStep === 1 && !cardId ? 'loading' : undefined}
            className="mb-10"
            steps={[
              {
                label: "Configurar Cartão",
                description: "Adicione seu primeiro cartão",
                icon: CreditCardIcon
              },
              {
                label: "Enviar Fatura",
                description: "Adicione uma fatura para análise",
                icon: FileTextIcon
              },
              {
                label: "Concluído",
                description: "Tudo pronto!",
                icon: BuildingIcon
              }
            ]}
          >
            <Step>
              <CreateCardStep setActiveStep={setActiveStep} />
            </Step>
            <Step>
              <UploadInvoiceStep setActiveStep={setActiveStep} cardId={cardId} />
            </Step>
            <Step>
              <SuccessStep />
            </Step>
          </Stepper>
        </CardContent>
      </Card>
    </Main>
  )
}