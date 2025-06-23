import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useUsers } from '@/hooks/use-users'

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}

export function UserDeleteDialog({ open, onOpenChange, userId }: UserDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteUser, getUser } = useUsers()
  const { data: userData } = getUser(userId || '')

  const handleDelete = async () => {
    if (!userId) return
    
    try {
      setIsDeleting(true)
      await deleteUser.mutateAsync(userId)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o usuário{' '}
            <strong>{userData?.name || 'selecionado'}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
