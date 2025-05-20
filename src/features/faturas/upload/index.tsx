// src/features/faturas/upload/index.tsx
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUpload, IconFileText, IconCreditCard, IconReceipt, IconLoader } from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInvoices } from "@/hooks/use-invoices"
import { useCards } from "@/hooks/use-cards"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Invoice } from '@/types'
import { useNavigate } from '@tanstack/react-router'

export default function FaturasUpload() {
  const {
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
    isUploading,

    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleSubmitInvoice,
    clearForm,
    refetchHistory
  } = useInvoices()

  const navigate = useNavigate()

  // Obtendo a lista de cartões para o select
  const { cards, isLoadingCards } = useCards()

  // Função para formatar a data
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: pt })
    } catch (e) {
      console.error('Erro ao formatar a data:', e)
      return dateString
    }
  }

  // Função para obter nome do cartão
  function getCardName(cardId: string) {
    if (!cards) return cardId.substring(0, 8)
    const card = cards.find(c => c.id === cardId)
    return card ? `${card.name} (${card.last_digits})` : cardId.substring(0, 8)
  }

  function getStatusVariant(status: string) {
    switch (status) {
      case 'Analisado':
        return 'default'
      case 'Processando':
        return 'secondary'
      case 'Erro':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => window.location.href = "/"}
          >
            <IconFileText size={18} />
            Faturas
          </Button>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Envio de Faturas</h1>
          <p className='text-muted-foreground'>
            Envie suas faturas de cartão de crédito para análise e recomendações personalizadas.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value)
          if (value === 'historico') {
            refetchHistory()
          }
        }} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Upload de Fatura</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Nova Fatura</CardTitle>
                <CardDescription>
                  Envie o PDF da sua fatura de cartão de crédito para análise. Seus dados serão protegidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    {selectedFile ? (
                      <>
                        <IconFileText size={40} className="text-primary" />
                        <div className="text-sm font-medium">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </div>
                      </>
                    ) : (
                      <>
                        <IconUpload size={40} className="text-muted-foreground" />
                        <p className="text-lg font-medium">Arraste e solte sua fatura aqui</p>
                        <p className="text-sm text-muted-foreground">ou clique para selecionar um arquivo</p>
                        <p className="text-xs text-muted-foreground mt-2">Formatos aceitos: PDF, JPG, PNG</p>
                      </>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.csv"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cartao">Cartão de Crédito</Label>
                    {isLoadingCards ? (
                      <Skeleton className="h-9 w-full" />
                    ) : cards && cards.length > 0 ? (
                      <Select
                        value={selectedCardId}
                        onValueChange={setSelectedCardId}
                      >
                        <SelectTrigger id="cartao">
                          <SelectValue placeholder="Selecione o cartão" />
                        </SelectTrigger>
                        <SelectContent>
                          {cards.map((card) => (
                            <SelectItem key={card.id} value={card.id}>
                              {card.name} - **** {card.last_digits}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Alert variant="destructive">
                        <IconAlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Você não possui cartões cadastrados. <a href="/cartoes" className="underline">Adicione um cartão</a> primeiro.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mes-referencia">Mês de Referência</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="mes-referencia"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !referenceDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {referenceDate ? (
                            format(referenceDate, "MMMM 'de' yyyy", { locale: pt })
                          ) : (
                            <span>Selecione o mês de referência</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={referenceDate}
                          onSelect={setReferenceDate}
                          initialFocus
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={clearForm}
                    disabled={isUploading || !selectedFile}
                  >
                    Limpar
                  </Button>
                  <Button
                    onClick={handleSubmitInvoice}
                    disabled={isUploading || !selectedFile || !selectedCardId || !referenceDate}
                  >
                    {isUploading ? (
                      <>
                        <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>Enviar para Análise</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dicas para Envio de Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <IconFileText size={32} className="mb-2 text-primary" />
                    <h3 className="text-sm font-semibold">Arquivos Completos</h3>
                    <p className="text-xs text-muted-foreground mt-1">Envie a fatura completa para melhor análise de gastos</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <IconCreditCard size={32} className="mb-2 text-primary" />
                    <h3 className="text-sm font-semibold">Ocultamos Dados Sensíveis</h3>
                    <p className="text-xs text-muted-foreground mt-1">Os números do cartão são automaticamente protegidos</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <IconReceipt size={32} className="mb-2 text-primary" />
                    <h3 className="text-sm font-semibold">Formatos Aceitos</h3>
                    <p className="text-xs text-muted-foreground mt-1">PDF, imagens de PDF, fotos da fatura (JPG/PNG)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Faturas</CardTitle>
                <CardDescription>
                  Visualize suas faturas enviadas anteriormente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : invoicesHistory && invoicesHistory.data && invoicesHistory.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data de Envio</TableHead>
                        <TableHead>Cartão</TableHead>
                        <TableHead>Mês Referência</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoicesHistory.data.map((invoice: Invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{formatDate(invoice.created_at!)}</TableCell>
                          <TableCell>{getCardName(invoice.card_id)}</TableCell>
                          <TableCell>{formatDate(invoice.reference_date)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>R$ {invoice.total_amount ? invoice.total_amount.toFixed(2) : "0.00"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => { navigate({ to: '/faturas/$invoiceId', params: { invoiceId: invoice?.id } }) }}>
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <IconFileText size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma fatura encontrada</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      Você ainda não enviou nenhuma fatura para análise. Envie sua primeira fatura para começar a receber recomendações.
                    </p>
                    <Button onClick={() => setActiveTab('upload')}>
                      Enviar Fatura
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}