import { useState } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card as CardUI, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Card } from '@/types/cards';

interface CardComponentProps {
  card: Card;
  onStatusChange: (id: string, isActive: boolean) => void;
  onDeleteClick: (id: string) => void;
  onEditClick: (card: Card) => void;
}

export function CardComponent({ card, onStatusChange, onDeleteClick, onEditClick }: CardComponentProps) {
  const [isActive, setIsActive] = useState(card.active);
  
  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    onStatusChange(card.id, checked);
  };

  return (
    <CardUI className={`transition-all duration-200 ${!isActive ? "opacity-55 " : ""} hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-medium">{card.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              **** **** **** {card.last_digits}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className="px-2 py-1 bg-popover-50 font-medium"
          >
            {card.bank}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          {/* <span className="text-muted-foreground">Programa:</span> */}
          {/* <span className="text-right font-medium">{card.reward_program_name || "Sem programa"}</span> */}
          
          <span className="text-muted-foreground">Taxa de conversão:</span>
          <span className="text-right font-medium">R$ 1 = {card.conversion_rate} pontos</span>
          
          <span className="text-muted-foreground">Anuidade:</span>
          <span className="text-right font-medium">{card.annual_fee ? `R$ ${card.annual_fee}` : 'Gratuito'}</span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t mt-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusChange}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-xs text-muted-foreground">
              {isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditClick(card)}
              className="h-8 w-8 p-0 rounded-full hover:bg-popover-100"
            >
              <IconPencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteClick(card.id)}
              className="h-8 w-8 p-0 rounded-full hover:bg-popover-100"
            >
              <IconTrash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </CardUI>
  );
}