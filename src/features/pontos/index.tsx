import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Calendar, Waypoints } from 'lucide-react'

export default function PontosPage() {
  const [activeTab, setActiveTab] = useState('resumo')
  
  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => window.location.href = "/"}
          >
            <Waypoints size={18} />
            Pontos
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
          <h1 className='text-2xl font-bold tracking-tight'>Meus Pontos</h1>
          <p className='text-muted-foreground'>
            Acompanhe seus pontos em cada programa de fidelidade e histórico de acúmulo.
          </p>
        </div>
        
        <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total de Pontos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,069</div>
              <p className="text-xs text-muted-foreground">
                +15% do mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pontos a Expirar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450</div>
              <p className="text-xs text-muted-foreground">
                Próximos 30 dias
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Valor Estimado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 276,21</div>
              <p className="text-xs text-muted-foreground">
                Baseado nas taxas atuais
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Eficiência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48%</div>
              <p className="text-xs text-muted-foreground">
                Do potencial máximo
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="transferencias">Transferências</TabsTrigger>
            <TabsTrigger value="resgate">Resgate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pontos por Programa</CardTitle>
                <CardDescription>
                  Saldo atual de pontos em cada programa de fidelidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Programa</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Valor Estimado</TableHead>
                      <TableHead>Próx. Expiração</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programas.map((programa) => (
                      <TableRow key={programa.id}>
                        <TableCell className="font-medium">{programa.nome}</TableCell>
                        <TableCell>{programa.pontos.toLocaleString()}</TableCell>
                        <TableCell>R$ {programa.valorEstimado}</TableCell>
                        <TableCell>
                          {programa.proximaExpiracao ? (
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1 text-muted-foreground" />
                              {programa.proximaExpiracao}
                            </div>
                          ) : (
                            "Sem expiração próxima"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={programa.status === "Ativo" ? "default" : "secondary"}
                          >
                            {programa.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Pontos</CardTitle>
                  <CardDescription>
                    Acúmulo de pontos nos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={evolucaoPontos}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="Livelo" 
                          stroke="#ff6b6b" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Smiles" 
                          stroke="#feca57" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Esfera" 
                          stroke="#48dbfb" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Eficiência de Acúmulo</CardTitle>
                  <CardDescription>
                    Potencial de pontos vs. pontos ganhos por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {categorias.map((categoria) => (
                      <div key={categoria.nome} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">{categoria.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            {categoria.pontosGanhos} / {categoria.pontosPotenciais} pontos
                          </div>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(categoria.pontosGanhos / categoria.pontosPotenciais) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((categoria.pontosGanhos / categoria.pontosPotenciais) * 100)}% do potencial máximo
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Últimas transações que geraram ou utilizaram pontos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Programa</TableHead>
                      <TableHead>Cartão</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Valor (R$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoes.map((transacao) => (
                      <TableRow key={transacao.id}>
                        <TableCell>{transacao.data}</TableCell>
                        <TableCell>{transacao.descricao}</TableCell>
                        <TableCell>{transacao.programa}</TableCell>
                        <TableCell>{transacao.cartao}</TableCell>
                        <TableCell className={transacao.pontos > 0 ? "text-green-600" : "text-red-600"}>
                          {transacao.pontos > 0 ? "+" : ""}{transacao.pontos}
                        </TableCell>
                        <TableCell>R$ {transacao.valor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transferencias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transferir Pontos</CardTitle>
                <CardDescription>
                  Transfira pontos entre programas ou para outras pessoas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resgate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Opções de Resgate</CardTitle>
                <CardDescription>
                  Maneiras de utilizar seus pontos acumulados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const programas = [
  {
    id: 1,
    nome: 'Livelo',
    pontos: 1567,
    valorEstimado: '125,36',
    proximaExpiracao: '15/08/2023',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Smiles',
    pontos: 853,
    valorEstimado: '93,83',
    proximaExpiracao: '30/09/2023',
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Esfera',
    pontos: 435,
    valorEstimado: '39,15',
    proximaExpiracao: '',
    status: 'Ativo',
  },
  {
    id: 4,
    nome: 'TudoAzul',
    pontos: 214,
    valorEstimado: '17,87',
    proximaExpiracao: '',
    status: 'Inativo',
  },
]

const evolucaoPontos = [
  { name: 'Jan', Livelo: 720, Smiles: 430, Esfera: 180 },
  { name: 'Fev', Livelo: 832, Smiles: 512, Esfera: 250 },
  { name: 'Mar', Livelo: 901, Smiles: 630, Esfera: 320 },
  { name: 'Abr', Livelo: 1134, Smiles: 732, Esfera: 340 },
  { name: 'Mai', Livelo: 1290, Smiles: 823, Esfera: 390 },
  { name: 'Jun', Livelo: 1567, Smiles: 853, Esfera: 435 },
]

const categorias = [
  {
    nome: 'Supermercados',
    pontosGanhos: 580,
    pontosPotenciais: 1450,
  },
  {
    nome: 'Restaurantes',
    pontosGanhos: 320,
    pontosPotenciais: 480,
  },
  {
    nome: 'Combustível',
    pontosGanhos: 210,
    pontosPotenciais: 700,
  },
  {
    nome: 'Streaming',
    pontosGanhos: 90,
    pontosPotenciais: 120,
  },
]

const transacoes = [
  {
    id: 1,
    data: '10/06/2023',
    descricao: 'Supermercado Extra',
    programa: 'Livelo',
    cartao: 'Nubank Platinum',
    pontos: 97,
    valor: '243,56',
  },
  {
    id: 2,
    data: '08/06/2023',
    descricao: 'Posto Shell',
    programa: 'Livelo',
    cartao: 'Nubank Platinum',
    pontos: 110,
    valor: '210,45',
  },
  {
    id: 3,
    data: '05/06/2023',
    descricao: 'Restaurante Outback',
    programa: 'Smiles',
    cartao: 'Itaucard Platinum',
    pontos: 90,
    valor: '180,76',
  },
  {
    id: 4,
    data: '01/06/2023',
    descricao: 'Resgate - Passagem Aérea',
    programa: 'Smiles',
    cartao: '-',
    pontos: -5000,
    valor: '750,00',
  },
  {
    id: 5,
    data: '28/05/2023',
    descricao: 'Amazon',
    programa: 'Esfera',
    cartao: 'Santander Select',
    pontos: 72,
    valor: '143,20',
  },
]