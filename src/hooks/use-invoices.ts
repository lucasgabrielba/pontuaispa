// src/hooks/use-invoices.ts
import { useState } from 'react'
import { format } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { invoicesService } from '@/services/invoices-service'

export interface InvoiceFormData {
  invoice_file: File
  card_id: string
  reference_date: string
}

export const useInvoices = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('upload')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [referenceDate, setReferenceDate] = useState<Date | undefined>(undefined)
  const [selectedCardId, setSelectedCardId] = useState<string>('')
  
  // Query para obter o histórico de faturas
  const {
    data: invoicesHistory,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['invoices-history'],
    queryFn: () => invoicesService.listInvoices().then(res => res.data),
    enabled: activeTab === 'historico'
  })

  // Mutação para fazer upload de fatura
  const uploadInvoiceMutation = useMutation({
    mutationFn: (data: InvoiceFormData) => 
      invoicesService.uploadInvoice(data),
    onSuccess: () => {
      // Limpar estado após upload bem-sucedido
      setSelectedFile(null)
      setReferenceDate(undefined)
      setSelectedCardId('')
      
      // Invalidar queries para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['invoices-history'] })
      
      toast({
        title: 'Fatura enviada com sucesso',
        description: 'Sua fatura foi enviada e está sendo processada'
      })
      
      // Mudar para a aba de histórico após o upload
      setActiveTab('historico')
    },
    onError: (error: any) => {
      console.error('Erro ao enviar fatura:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar fatura',
        description: error.message || 'Não foi possível enviar a fatura'
      })
    }
  })

  // Handlers para drag-and-drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handler para submeter o formulário
  const handleSubmitInvoice = () => {
    if (!selectedFile || !referenceDate || !selectedCardId) {
      toast({
        variant: 'destructive',
        title: 'Informações incompletas',
        description: 'Por favor, selecione um arquivo, cartão e data de referência'
      })
      return
    }

    const formData: InvoiceFormData = {
      invoice_file: selectedFile,
      card_id: selectedCardId,
      reference_date: format(referenceDate, 'yyyy-MM-dd')
    }

    uploadInvoiceMutation.mutate(formData)
  }

  const clearForm = () => {
    setSelectedFile(null)
    setReferenceDate(undefined)
    setSelectedCardId('')
  }

  return {
    // Estados
    activeTab,
    setActiveTab,
    isDragging,
    selectedFile,
    referenceDate,
    setReferenceDate,
    selectedCardId,
    setSelectedCardId,
    invoicesHistory,
    
    // Estados de loading
    isLoadingHistory,
    isUploading: uploadInvoiceMutation.isPending,
    
    // Erros
    historyError,
    
    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleSubmitInvoice,
    clearForm,
    refetchHistory
  }
}