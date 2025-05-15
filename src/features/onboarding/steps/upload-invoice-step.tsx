"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { FileUpIcon, FileTextIcon, CalendarIcon, AlertCircle, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InvoiceData {
  invoice_file: File
  reference_date: string
}

interface UploadInvoiceStepProps {
  onDataChange: (data: InvoiceData | null) => void
}

export default function UploadInvoiceStep({ onDataChange }: UploadInvoiceStepProps) {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [referenceDate, setReferenceDate] = useState<Date>(new Date())
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedFile && referenceDate) {
      onDataChange({
        invoice_file: selectedFile,
        reference_date: format(referenceDate, "yyyy-MM-dd"),
      })
    } else {
      onDataChange(null)
    }
  }, [selectedFile, referenceDate, onDataChange])

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File): void => {
    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("O arquivo deve ter no máximo 10MB")
      return
    }

    // Validate type
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "text/csv"]
    if (!validTypes.includes(file.type)) {
      setError("O arquivo deve ser PDF, JPG, PNG ou CSV")
      return
    }

    setError("")
    setSelectedFile(file)
  }

  const getFileIcon = () => {
    if (!selectedFile) return <FileUpIcon size={40} className="text-muted-foreground" />

    switch (selectedFile.type) {
      case "application/pdf":
        return <FileTextIcon size={40} className="text-primary" />
      case "image/jpeg":
      case "image/png":
        return <FileIcon size={40} className="text-primary" />
      case "text/csv":
        return <FileTextIcon size={40} className="text-primary" />
      default:
        return <FileIcon size={40} className="text-primary" />
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="font-medium">Fatura do Cartão</Label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
              "flex flex-col items-center justify-center h-48",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png,.csv"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                {getFileIcon()}
                <div>
                  <p className="font-medium text-primary">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <FileUpIcon size={40} className="text-muted-foreground" />
                <div>
                  <p className="font-medium">Arraste e solte sua fatura aqui</p>
                  <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar um arquivo</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            <span>Formatos aceitos: PDF, JPG, PNG, CSV (10MB max)</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Mês de Referência</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full pl-3 text-left font-normal", !referenceDate && "text-muted-foreground")}
              >
                {referenceDate ? (
                  format(referenceDate, "MMMM 'de' yyyy", { locale: pt })
                ) : (
                  <span>Selecione o mês/ano da fatura</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={referenceDate}
                onSelect={(date) => date && setReferenceDate(date)}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">Mês/ano de referência da fatura</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
