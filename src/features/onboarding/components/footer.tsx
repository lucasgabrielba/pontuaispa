"use client"

import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface FooterProps {
  isPending: boolean
  onContinue: () => void
  isLastStep?: boolean
  isButtonDisabled?: boolean
}

export function Footer({ isPending, onContinue, isLastStep = false, isButtonDisabled = false }: FooterProps) {
  const navigate = useNavigate()

  if (isLastStep) {
    return (
      <div className="flex justify-center mt-8">
        <Button size="lg" onClick={() => navigate({ to: "/" })} className="px-8">
          Ir para o Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-end mt-8">
      <Button onClick={onContinue} disabled={isPending || isButtonDisabled} size="lg" className="px-8">
        {isPending ? "Processando..." : "Continuar"} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
