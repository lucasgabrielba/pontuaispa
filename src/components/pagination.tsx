import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
  children?: React.ReactNode;
} 

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
  children
}: PaginationProps) {

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, totalPages]);

  const generatePageButtons = () => {
    const buttons = [];
    let startPage, endPage;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
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

    buttons.push(
      <span key="mobile-info" className="text-sm text-muted-foreground sm:hidden">
        Página {currentPage} de {totalPages}
      </span>
    );

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
      {children ? children : generatePageButtons()}
    </div>
  );
}