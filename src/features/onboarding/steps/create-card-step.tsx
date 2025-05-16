import { useState, useEffect } from "react"
import { onboardingService } from "@/services/onboarding-service"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertCircle } from "lucide-react"
import { Bank } from "@/types"

interface CreateCardFormData {
  name: string
  bank: string
  last_digits: string
  conversion_rate: number
  annual_fee: number | null
  active: boolean 
  reward_program_id?: string
}

interface CreateCardStepProps {
  onDataChange: (data: CreateCardFormData | null) => void
}

export default function CreateCardStep({ onDataChange }: CreateCardStepProps) {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<CreateCardFormData>({
    name: "",
    bank: "",
    last_digits: "",
    conversion_rate: 1,
    annual_fee: 0,
    active: true,
    reward_program_id: "",
  })

  const [errors, setErrors] = useState({
    name: false,
    bank: false,
    last_digits: false,
  })

  useEffect(() => {
    setLoading(true)
    onboardingService
      .getBanks()
      .then((response) => {
        setBanks(response.data.data)
      })
      .catch((error) => {
        console.error("Erro ao carregar bancos:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Validate data before sending to parent
    const nameValid = formData.name.length >= 2
    const bankValid = formData.bank.length >= 1
    const digitsValid = /^\d{4}$/.test(formData.last_digits)

    setErrors({
      name: formData.name.length > 0 && !nameValid,
      bank: formData.bank === "",
      last_digits: formData.last_digits.length > 0 && !digitsValid,
    })

    const isValid = nameValid && bankValid && digitsValid

    if (isValid) {
      onDataChange(formData)
    } else {
      onDataChange(null)
    }
  }, [formData, onDataChange])

  const handleChange = <K extends keyof CreateCardFormData>(field: K, value: CreateCardFormData[K]): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">
              Nome do Cartão
            </Label>
            <Input
              id="name"
              placeholder="Ex: Nubank Platinum"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> O nome do cartão deve ter pelo menos 2 caracteres
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank" className="font-medium">
              Banco Emissor
            </Label>
            <Select value={formData.bank} onValueChange={(value) => handleChange("bank", value)} disabled={loading}>
              <SelectTrigger id="bank" className={errors.bank ? "border-destructive" : ""}>
                <SelectValue placeholder={loading ? "Carregando bancos..." : "Selecione o banco"} />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.name} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> Selecione o banco emissor
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="last_digits" className="font-medium">
              Últimos 4 dígitos
            </Label>
            <Input
              id="last_digits"
              placeholder="Ex: 1234"
              maxLength={4}
              value={formData.last_digits}
              onChange={(e) => handleChange("last_digits", e.target.value)}
              className={errors.last_digits ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">Usado para identificar seu cartão</p>
            {errors.last_digits && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Digite os 4 últimos dígitos do cartão
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_fee" className="font-medium">
              Anuidade (R$)
            </Label>
            <Input
              id="annual_fee"
              type="number"
              placeholder="Ex: 400"
              value={formData.annual_fee !== null ? formData.annual_fee : ""}
              onChange={(e) => handleChange("annual_fee", e.target.value ? Number.parseFloat(e.target.value) : null)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conversion_rate" className="font-medium">
            Taxa de Conversão
          </Label>
          <Input
            id="conversion_rate"
            type="number"
            step="0.01"
            placeholder="Ex: 1.2"
            value={formData.conversion_rate !== undefined ? formData.conversion_rate : ""}
            onChange={(e) => handleChange("conversion_rate", e.target.value ? Number.parseFloat(e.target.value) : 1)}
          />
          <p className="text-xs text-muted-foreground">Quantos pontos você ganha por cada R$ 1,00 gasto</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="active" className="font-medium">
              Cartão Ativo
            </Label>
            <p className="text-sm text-muted-foreground">Desative caso não esteja mais usando este cartão</p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => handleChange("active", checked)}
          />
        </div>
      </div>
    </div>
  )
}