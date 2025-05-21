import { Button } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Não exibir paginação se houver apenas uma página
  if (totalPages <= 1) return null

  // Função para gerar um array com os números de página a serem exibidos
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for menor que o máximo a mostrar, exibir todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre mostrar a primeira página
      pages.push(1)
      
      // Calcular páginas intermediárias
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Ajustar para mostrar sempre 3 páginas intermediárias quando possível
      if (startPage === 2) endPage = Math.min(totalPages - 1, 4)
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3)
      
      // Adicionar ellipsis após a primeira página se necessário
      if (startPage > 2) {
        pages.push('ellipsis-start')
      }
      
      // Adicionar páginas intermediárias
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Adicionar ellipsis antes da última página se necessário
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      
      // Sempre mostrar a última página
      pages.push(totalPages)
    }
    
    return pages
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <IconChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-muted-foreground">
              ...
            </span>
          )
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="h-8 w-8"
            onClick={() => handlePageClick(page as number)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <IconChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}