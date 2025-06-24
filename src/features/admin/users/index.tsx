import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUsers } from '@/hooks/use-users'
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
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search as SearchIcon, 
  Users,
  Download,
  ArrowLeft
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
import { UserDeleteDialog } from './components/user-delete-dialog'
import { UserDialog } from './components/user-dialog'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export default function UsersFeature() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [perPage] = useState(15)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string>('')
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('')
  
  const { getUsers } = useUsers()
  const { data: usersData, isLoading } = getUsers(page, perPage, searchQuery)

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (userId: string, userName: string, userEmail: string) => {
    setSelectedUserId(userId)
    setSelectedUserName(userName)
    setSelectedUserEmail(userEmail)
    setIsDeleteDialogOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const renderPaginationLinks = () => {
    if (!usersData) return null

    const links = []
    const totalPages = usersData.last_page
    const currentPage = usersData.current_page

    // Mostra no máximo 5 páginas
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return links
  }

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
            <h1 className='text-3xl font-bold tracking-tight'>Gestão de Usuários</h1>
            <p className='text-muted-foreground'>
              Gerencie todos os usuários da plataforma Pontu AI - {format(new Date(), "dd 'de' MMMM, yyyy", { locale: pt })}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className='text-2xl font-bold'>
                  {usersData?.total?.toLocaleString() || 0}
                </div>
              )}
              <p className='text-xs text-muted-foreground'>
                {usersData?.data?.length || 0} exibidos nesta página
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Usuários Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className='text-2xl font-bold text-green-600'>
                  {usersData?.data?.filter(u => u.status === 'Ativo')?.length || 0}
                </div>
              )}
              <p className='text-xs text-muted-foreground'>
                Na página atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Novos Hoje
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className='text-2xl font-bold text-blue-600'>
                  {usersData?.todayCount || 0}
                </div>
              )}
              <p className='text-xs text-muted-foreground'>
                Registros hoje
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
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className='text-2xl font-bold text-primary'>
                  {usersData?.current_page || 1}
                </div>
              )}
              <p className='text-xs text-muted-foreground'>
                de {usersData?.last_page || 1} páginas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : !usersData || usersData.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {searchQuery ? 'Nenhum usuário encontrado para essa busca' : 'Nenhum usuário encontrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    usersData.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Ativo' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {usersData && usersData.last_page > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {usersData.current_page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(usersData.current_page - 1)} 
                        />
                      </PaginationItem>
                    )}
                    
                    {renderPaginationLinks()}
                    
                    {usersData.current_page < usersData.last_page && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(usersData.current_page + 1)} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <UserDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          mode="create"
        />

        <UserDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          mode="edit"
          userId={selectedUserId}
        />

        <UserDeleteDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen}
          userId={selectedUserId}
          userName={selectedUserName}
          userEmail={selectedUserEmail}
        />
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
    href: '/admin/users',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Faturas',
    href: '/admin/invoices',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    isActive: false,
    disabled: false,
  },
]