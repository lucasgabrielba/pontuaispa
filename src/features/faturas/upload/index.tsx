import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconUpload, IconFileText, IconCreditCard, IconReceipt } from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function FaturasUpload() {
  const [activeTab, setActiveTab] = useState('upload')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <IconUpload size={40} className="text-muted-foreground" />
                    
                    {selectedFile ? (
                      <div className="text-sm font-medium">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </div>
                    ) : (
                      <>
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
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cartao">Cartão de Crédito</Label>
                    <Input id="cartao" placeholder="Selecione o cartão" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mes-referencia">Mês de Referência</Label>
                    <Input id="mes-referencia" type="month" />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>Limpar</Button>
                  <Button disabled={!selectedFile}>Enviar para Análise</Button>
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
                    {historicoFaturas.map((fatura) => (
                      <TableRow key={fatura.id}>
                        <TableCell>{fatura.dataEnvio}</TableCell>
                        <TableCell>{fatura.cartao}</TableCell>
                        <TableCell>{fatura.mesReferencia}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(fatura.status)}>
                            {fatura.status}
                          </Badge>
                        </TableCell>
                        <TableCell>R$ {fatura.valor}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'Analisado':
      return 'default'
    case 'Em análise':
      return 'secondary'
    case 'Pendente':
      return 'outline'
    default:
      return 'secondary'
  }
}

const historicoFaturas = [
  {
    id: 1,
    dataEnvio: '10/05/2023',
    cartao: 'Nubank',
    mesReferencia: 'Abril/2023',
    status: 'Analisado',
    valor: '3.245,78'
  },
  {
    id: 2,
    dataEnvio: '12/04/2023',
    cartao: 'Itaucard Platinum',
    mesReferencia: 'Março/2023',
    status: 'Analisado',
    valor: '2.987,45'
  },
  {
    id: 3,
    dataEnvio: '08/06/2023',
    cartao: 'Nubank',
    mesReferencia: 'Maio/2023',
    status: 'Em análise',
    valor: '3.521,89'
  },
  {
    id: 4,
    dataEnvio: '05/03/2023',
    cartao: 'Itaucard Platinum',
    mesReferencia: 'Fevereiro/2023',
    status: 'Analisado',
    valor: '2.458,32'
  },
  {
    id: 5,
    dataEnvio: '10/07/2023',
    cartao: 'Nubank',
    mesReferencia: 'Junho/2023',
    status: 'Pendente',
    valor: '3.789,45'
  }
]