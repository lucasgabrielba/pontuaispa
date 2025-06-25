import React, { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useIsAdmin } from '@/hooks/use-is-admin';
import { suggestionsService, CreateSuggestionData } from '@/services/suggestions-service';

interface SuggestionSheetProps {
  invoiceId: string;
  onCreated?: () => void;
  isAdmin?: boolean;
  className?: string;
}

const SUGGESTION_TYPES = [
  { value: 'card_recommendation', label: 'Recomendação de Cartão' },
  { value: 'merchant_recommendation', label: 'Recomendação de Estabelecimento' },
  { value: 'category_optimization', label: 'Otimização de Categoria' },
  { value: 'points_strategy', label: 'Estratégia de Pontos' },
  { value: 'general_tip', label: 'Dica Geral' },
];

const PRIORITIES = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

export function SuggestionSheet({ invoiceId, onCreated, isAdmin = false, className }: SuggestionSheetProps) {
  const isAdminUser = useIsAdmin();
  const showSheet = isAdmin ? true : isAdminUser;
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateSuggestionData>({
    title: '',
    description: '',
    type: 'general_tip',
    priority: 'medium',
    recommendation: '',
    impact_description: '',
    potential_points_increase: '',
    is_personalized: false,
    applies_to_future: false,
    additional_data: {},
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (name: string) => {
    setForm({ ...form, [name]: !form[name as keyof typeof form] });
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      type: 'general_tip',
      priority: 'medium',
      recommendation: '',
      impact_description: '',
      potential_points_increase: '',
      is_personalized: false,
      applies_to_future: false,
      additional_data: {},
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload: CreateSuggestionData = {
        ...form,
        // Garantir que campos opcionais vazios sejam undefined
        impact_description: form.impact_description || undefined,
        potential_points_increase: form.potential_points_increase || undefined,
      };

      await suggestionsService.invoice.create(invoiceId, payload);
      
      setOpen(false);
      resetForm();
      onCreated?.();
    } catch (err: any) {
      console.error('Erro ao criar sugestão:', err);
      setError('Erro ao criar sugestão. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!showSheet) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={className}>
        <Button variant="outline" className="w-full mb-2">
          Criar sugestão
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-lg w-full">
        <div className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Criar Sugestão</SheetTitle>
            <SheetDescription>
              Use este formulário para criar uma sugestão personalizada para a fatura.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título da sugestão"
              maxLength={80}
            />
            
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição detalhada"
              rows={3}
              maxLength={500}
            />
            
            <Textarea
              name="recommendation"
              value={form.recommendation}
              onChange={handleChange}
              placeholder="Recomendação prática (ex: troque para o cartão XPTO nas compras do mês que vem)"
              rows={2}
              maxLength={300}
            />
            
            <div className="flex gap-2">
              <Select value={form.type} onValueChange={v => handleSelect('type', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {SUGGESTION_TYPES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={form.priority} onValueChange={v => handleSelect('priority', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Input
              name="impact_description"
              value={form.impact_description}
              onChange={handleChange}
              placeholder="Impacto esperado (opcional)"
              maxLength={120}
            />
            
            <Input
              name="potential_points_increase"
              value={form.potential_points_increase}
              onChange={handleChange}
              placeholder="Potencial de pontos a mais (opcional)"
              maxLength={32}
            />
            
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_personalized}
                  onChange={() => handleCheckbox('is_personalized')}
                  className="accent-primary"
                />
                Personalizada
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.applies_to_future}
                  onChange={() => handleCheckbox('applies_to_future')}
                  className="accent-primary"
                />
                Aplicar para próximas faturas
              </label>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          <SheetFooter>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? 'Criando...' : 'Criar Sugestão'}
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full mt-2">
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}