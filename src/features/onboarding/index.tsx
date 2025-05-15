"use client"

import { useEffect, useState } from "react"
import { Main } from "@/components/layout/main"
import { Card, CardContent } from "@/components/ui/card"
import CreateCardStep from "./steps/create-card-step"
import { useOnboarding } from "@/hooks/use-onboarding"
import UploadInvoiceStep from "./steps/upload-invoice-step"
import SuccessStep from "./steps/success-step"
import { Footer } from "./components/footer"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "@tanstack/react-router"

// Types for form data
interface CardData {
  name: string
  bank: string
  last_digits: string
  conversion_rate: number
  annual_fee: number | null
  active: boolean
  reward_program_id?: string
}

interface InvoiceData {
  invoice_file: File
  reference_date: string
}

export default function Onboarding() {
  const { createCard, uploadInvoice, cardId, setCardId , userHasCards} = useOnboarding()
  const [activeStep, setActiveStep] = useState(0)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const navigate = useNavigate()

  const totalSteps = 3
  const progress = ((activeStep + 1) / totalSteps) * 100

  useEffect(() => {
    userHasCards.refetch()

    if (userHasCards.data && userHasCards.data === true) {
      navigate({ to: "/" })
    }
  }, [])


  const isStepValid = () => {
    if (activeStep === 0) return !!cardData
    if (activeStep === 1) return !!invoiceData
    return true
  }

  const handleContinue = (): void => {
    if (activeStep === 0 && cardData) {
      setIsPending(true)
      createCard.mutate(cardData, {
        onSuccess: (response) => {
          if (response.data && response.data.id) {
            setCardId(response.data.id)
          }
          setIsPending(false)
          setActiveStep(activeStep + 1)
        },
        onError: () => {
          setIsPending(false)
        },
      })
    } else if (activeStep === 1 && invoiceData && cardId) {
      setIsPending(true)
      uploadInvoice.mutate(
        {
          ...invoiceData,
          card_id: cardId,
        },
        {
          onSuccess: () => {
            setIsPending(false)
            setActiveStep(activeStep + 1)
          },
          onError: () => {
            setIsPending(false)
          },
        },
      )
    }
  }

  const renderContent = () => {
    switch (activeStep) {
      case 0:
        return <CreateCardStep onDataChange={setCardData} />
      case 1:
        return <UploadInvoiceStep onDataChange={setInvoiceData} />
      case 2:
        return <SuccessStep />
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (activeStep) {
      case 0:
        return "Adicione seu cartão de crédito"
      case 1:
        return "Envie sua fatura"
      case 2:
        return "Configuração concluída"
      default:
        return ""
    }
  }

  return (
    <Main>
      <Card className="mx-auto max-w-3xl border shadow-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Bem-vindo ao Pontu AI</h1>
            <p className="text-muted-foreground mt-1">
              Vamos configurar sua conta em alguns passos simples para maximizar seus pontos de fidelidade
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{getStepTitle()}</span>
              <span className="text-muted-foreground">
                Passo {activeStep + 1} de {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderContent()}

          <Footer
            isPending={isPending}
            onContinue={handleContinue}
            isLastStep={activeStep === 2}
            isButtonDisabled={!isStepValid()}
          />
        </CardContent>
      </Card>
    </Main>
  )
}
