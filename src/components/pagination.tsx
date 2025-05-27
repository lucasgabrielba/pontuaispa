// Este é o código que precisamos garantir para o componente de paginação
// Verifique se seu componente implementa adequadamente o método onPageChange

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
}: PaginationProps) {
  console.log('Pagination component - currentPage:', currentPage, 'totalPages:', totalPages);

  const handlePageChange = useCallback((page: number) => {
    console.log('Pagination component - changing to page:', page);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, totalPages]);

  // Não modificando a lógica de exibição, apenas garantindo que o evento seja chamado corretamente

  // Gerar botões de paginação
  const generatePageButtons = () => {
    const buttons = [];
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      // Mostrar todas as páginas se o total for menor que o máximo de botões
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calcular quais páginas mostrar
      const halfMaxButtons = Math.floor(maxButtons / 2);
      
      if (currentPage <= halfMaxButtons) {
        startPage = 1;
        endPage = maxButtons;
      } else if (currentPage + halfMaxButtons >= totalPages) {
        startPage = totalPages - maxButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfMaxButtons;
        endPage = currentPage + halfMaxButtons;
      }
    }

    // Botão de página anterior
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IconChevronLeft className="h-4 w-4" />
      </Button>
    );

    // Botões com números de página
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="hidden sm:inline-flex"
        >
          {i}
        </Button>
      );
    }

    // Info de página atual (mobile)
    buttons.push(
      <span key="mobile-info" className="text-sm text-muted-foreground sm:hidden">
        Página {currentPage} de {totalPages}
      </span>
    );

    // Botão de próxima página
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <IconChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="flex items-center gap-1">
      {generatePageButtons()}
    </div>
  );
}