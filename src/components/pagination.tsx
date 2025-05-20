import { Button } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const generatePagination = () => {
    // Se menos de 7 páginas, mostrar todas
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    // Sempre mostrar primeira página, última página, página atual e uma página antes e depois da atual
    const pages = [1]
    
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)
    
    // Adicionar '...' se necessário no início
    if (startPage > 2) {
      pages.push(-1) // Representa ellipsis
    }
    
    // Adicionar as páginas ao redor da atual
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // Adicionar '...' se necessário no final
    if (endPage < totalPages - 1) {
      pages.push(-2) // Representa ellipsis
    }
    
    // Adicionar a última página
    pages.push(totalPages)
    
    return pages
  }
  
  const pages = generatePagination()
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <IconChevronLeft className="h-4 w-4" />
      </Button>
      
      {pages.map((page, index) => (
        page < 0 ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-9 h-9"
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <IconChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}