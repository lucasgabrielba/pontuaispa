import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useUsers } from '@/hooks/use-users'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  userName?: string
  userEmail?: string
}

export function UserDeleteDialog({ open, onOpenChange, userId, userName, userEmail }: UserDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { deleteUser } = useUsers()

  const handleDelete = async () => {
    if (!userId) return
    
    setIsDeleting(true)
    
    try {
      await deleteUser.mutateAsync(userId)
      toast({
        title: 'Sucesso!',
        description: 'Usuário excluído com sucesso!'
      })
      onOpenChange(false)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Falha ao excluir usuário',
        description: error?.response?.data?.message || 'Erro interno do servidor. Tente novamente'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir o usuário{' '}
              <span className="font-semibold">{userName}</span>
              {userEmail && (
                <>
                  {' '}(<span className="font-mono text-sm">{userEmail}</span>)
                </>
              )}?
            </p>
            <p className="text-destructive font-medium">
              Esta ação não pode ser desfeita. Todos os dados relacionados a este usuário serão permanentemente removidos.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Usuário'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}