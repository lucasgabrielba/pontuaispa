// src/features/admin/invoices/index.tsx
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Search as SearchIcon, 
  Users,
  Download,
  ArrowLeft,
  Eye,
  MoreHorizontal,
  Calendar,
  CreditCard,
  DollarSign
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdminInvoices } from '@/hooks/use-admin-invoices'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export default function AdminInvoicesFeature() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userPage, setUserPage] = useState(1)
  const [invoicePage, setInvoicePage] = useState(1)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('')
  const perPage = 15

  const {
    users,
    userInvoices,
    isLoadingUsers,
    isLoadingInvoices,
    refetchUsers,
    refetchUserInvoices
  } = useAdminInvoices({
    userPage,
    invoicePage,
    userSearchQuery,
    invoiceSearchQuery,
    selectedUserId,
    perPage
  })

  const handleUserSelect = (userId: string, userName: string) => {
    setSelectedUserId(userId)
    setActiveTab('invoices')
    setInvoicePage(1) // Reset pagination when selecting new user
  }

  const handleBackToUsers = () => {
    setActiveTab('users')
    setSelectedUserId(null)
    setInvoiceSearchQuery('')
  }

  const getStatusVariant = (status: string) => {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100); // Assumindo que o valor vem em centavos
  }

  const selectedUser = selectedUserId && users?.data ? 
    users.data.find(user => user.id === selectedUserId) : null

  return (
    <>
      {/* ===== Header ===== */}
      <Header>
        <TopNav links={adminTopNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <div className='flex items-center space-x-4 mb-2'>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate({ to: "/admin" })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {activeTab === 'users' ? 'Gestão de Faturas' : `Faturas de ${selectedUser?.name}`}
            </h1>
            <p className='text-muted-foreground'>
              {activeTab === 'users' 
                ? `Gerencie faturas de todos os usuários - ${format(new Date(), "dd 'de' MMMM, yyyy", { locale: pt })}`
                : 'Visualize e gerencie as faturas deste usuário'
              }
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="invoices" disabled={!selectedUserId} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Faturas {selectedUser && `(${selectedUser.name})`}
            </TabsTrigger>
          </TabsList>

          {/* Tab de Usuários */}
          <TabsContent value="users" className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {users?.total?.toLocaleString() || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    {users?.data?.length || 0} exibidos nesta página
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Com Faturas
                  </CardTitle>
                  <FileText className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold text-green-600'>
                      {users?.data?.filter(u => u.invoices_count > 0)?.length || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Usuários ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Faturas Processadas
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold text-blue-600'>
                      {users?.data?.reduce((sum, user) => sum + (user.invoices_count || 0), 0) || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Total no sistema
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Página Atual
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold text-primary'>
                      {users?.current_page || 1}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    de {users?.last_page || 1} páginas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Usuários */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários do Sistema</CardTitle>
                    <CardDescription>
                      Clique em um usuário para ver suas faturas
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar usuários por nome ou email..."
                        className="pl-8"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Faturas</TableHead>
                        <TableHead>Última Atividade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingUsers ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : !users || users.data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            {userSearchQuery ? 'Nenhum usuário encontrado para essa busca' : 'Nenhum usuário encontrado'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.data.map((user) => (
                          <TableRow 
                            key={user.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleUserSelect(user.id, user.name)}
                          >
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {user.invoices_count || 0} faturas
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.last_invoice_date ? formatDate(user.last_invoice_date) : 'Nunca'}
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleUserSelect(user.id, user.name)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Faturas
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => navigate({ to: `/admin/users/${user.id}` })}>
                                    Perfil do Usuário
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {users && users.last_page > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        {users.current_page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setUserPage(users.current_page - 1)} 
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: Math.min(5, users.last_page) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                isActive={page === users.current_page}
                                onClick={() => setUserPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {users.current_page < users.last_page && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setUserPage(users.current_page + 1)} 
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Faturas do Usuário */}
          <TabsContent value="invoices" className="space-y-6">
            {selectedUser && (
              <>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToUsers}
                    className="mb-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Usuários
                  </Button>
                </div>

                {/* Informações do Usuário */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Informações do Usuário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nome</p>
                        <p className="text-lg font-semibold">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Faturas</p>
                        <p className="text-lg font-semibold text-primary">{selectedUser.invoices_count || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Faturas */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Faturas</CardTitle>
                        <CardDescription>
                          Todas as faturas enviadas pelo usuário
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar faturas..."
                            className="pl-8"
                            value={invoiceSearchQuery}
                            onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data Upload</TableHead>
                            <TableHead>Cartão</TableHead>
                            <TableHead>Referência</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingInvoices ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell className="text-right">
                                  <Skeleton className="h-8 w-20 ml-auto" />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : !userInvoices || userInvoices.data.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                {invoiceSearchQuery ? 'Nenhuma fatura encontrada para essa busca' : 'Nenhuma fatura encontrada'}
                              </TableCell>
                            </TableRow>
                          ) : (
                            userInvoices.data.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {formatDate(invoice.created_at)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <div className="font-medium">{invoice.card_name}</div>
                                      <div className="text-xs text-muted-foreground">****{invoice.card_last_digits}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {formatDate(invoice.reference_date)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusVariant(invoice.status)}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    {invoice.total_amount ? formatCurrency(invoice.total_amount) : "R$ 0,00"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => navigate({ to: `/admin/faturas/${invoice.id}` })}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Ver Detalhes
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {userInvoices && userInvoices.last_page > 1 && (
                      <div className="mt-6 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            {userInvoices.current_page > 1 && (
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => setInvoicePage(userInvoices.current_page - 1)} 
                                />
                              </PaginationItem>
                            )}
                            
                            {Array.from({ length: Math.min(5, userInvoices.last_page) }, (_, i) => {
                              const page = i + 1;
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink 
                                    isActive={page === userInvoices.current_page}
                                    onClick={() => setInvoicePage(page)}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            
                            {userInvoices.current_page < userInvoices.last_page && (
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => setInvoicePage(userInvoices.current_page + 1)} 
                                />
                              </PaginationItem>
                            )}
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

// Navegação superior para administradores
const adminTopNav = [
  {
    title: 'Dashboard',
    href: '/admin',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Usuários',
    href: '/admin/usuarios',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Faturas',
    href: '/admin/faturas',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Configurações',
    href: '/configuracoes/conta',
    isActive: false,
    disabled: false,
  },
]