import { useState } from 'react'
import { useUsers } from '@/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { UserDialog } from './user-dialog'
import { UserDeleteDialog } from './user-delete-dialog'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function UserManagement() {
  const [page, setPage] = useState(1)
  const [perPage] = useState(15)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  
  const { getUsers } = useUsers()
  const { data: usersData, isLoading } = getUsers(page, perPage)

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setSelectedUserId(userId)
    setIsDeleteDialogOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const renderPaginationLinks = () => {
    if (!usersData) return null

    const links = []
    for (let i = 1; i <= usersData.last_page; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={i === usersData.current_page}
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>Gerencie os usuários do sistema</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  className="pl-8"
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
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : !usersData || usersData.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Ativo' ? 'success' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
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
                            onClick={() => handleDeleteUser(user.id)}
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
            <div className="mt-4 flex justify-center">
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
      />
    </div>
  )
}
