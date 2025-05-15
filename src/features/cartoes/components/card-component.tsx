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
  const [isActive, setIsActive] = useState(card.isActive);
  
  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    onStatusChange(card.id, checked);
  };
  
  return (
    <CardUI className={!isActive ? "opacity-70" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{card.name}</CardTitle>
          <Badge variant="outline">{card.bank}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <CardDescription>
            Final {card.lastDigits}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Ativo</span>
            <Switch 
              checked={isActive} 
              onCheckedChange={handleStatusChange} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Programa:</span>
          <span>{card.rewardProgramName || "Sem programa"}</span>
        </div>
        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Taxa de conversão:</span>
          <span>R$ 1 = {card.conversionRate} pontos</span>
        </div>
        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Anuidade:</span>
          <span>{card.annualFee ? `R$ ${card.annualFee}` : 'Gratuito'}</span>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEditClick(card)}
          >
            <IconPencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDeleteClick(card.id)}
          >
            <IconTrash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </CardUI>
  );
}