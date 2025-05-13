import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconCreditCard, IconPlus, IconPencil, IconTrash } from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectDropdown } from '@/components/select-dropdown'

export default function CartoesPage() {
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false)
  
  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => window.location.href = "/"}
          >
            <IconCreditCard size={18} />
            Cartões
          </Button>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Meus Cartões</h1>
            <p className='text-muted-foreground'>
              Gerencie seus cartões de crédito para melhores recomendações de pontos.
            </p>
          </div>
          <Button onClick={() => setIsAddCardDialogOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Adicionar Cartão
          </Button>
        </div>
        
        <Tabs defaultValue="meus-cartoes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="meus-cartoes">Meus Cartões</TabsTrigger>
            <TabsTrigger value="recomendados">Recomendados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meus-cartoes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cartoesUsuario.map((cartao) => (
                <CardCartao 
                  key={cartao.id} 
                  cartao={cartao}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recomendados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cartões Recomendados para o seu Perfil</CardTitle>
                <CardDescription>
                  Com base nos seus gastos, recomendamos estes cartões para maximizar pontos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {cartoesRecomendados.map((cartao) => (
                    <div key={cartao.id} className="rounded-lg border p-4 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{cartao.nome}</div>
                        <Badge variant="secondary">{cartao.banco}</Badge>
                      </div>
                      <div className="text-sm mb-4">{cartao.descricao}</div>
                      <div className="text-sm mb-2">
                        <span className="font-medium">Vantagens:</span> {cartao.vantagens}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Programa:</span> {cartao.programa}
                      </div>
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <div className="text-primary font-semibold">{cartao.potencial}% mais pontos</div>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <AddCardDialog 
          open={isAddCardDialogOpen} 
          onOpenChange={setIsAddCardDialogOpen} 
        />
      </Main>
    </>
  )
}

interface CardCartaoProps {
  cartao: typeof cartoesUsuario[0]
}

function CardCartao({ cartao }: CardCartaoProps) {
  const [ativo, setAtivo] = useState(cartao.ativo)
  
  return (
    <Card className={!ativo ? "opacity-70" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{cartao.nome}</CardTitle>
          <Badge variant="outline">{cartao.banco}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <CardDescription>
            Final {cartao.final}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Ativo</span>
            <Switch 
              checked={ativo} 
              onCheckedChange={setAtivo} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Programa:</span>
          <span>{cartao.programa}</span>
        </div>
        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Taxa de conversão:</span>
          <span>R$ 1 = {cartao.taxaConversao} pontos</span>
        </div>
        <div className="text-sm flex justify-between">
          <span className="text-muted-foreground">Anuidade:</span>
          <span>{cartao.anuidade ? `R$ ${cartao.anuidade}` : 'Gratuito'}</span>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm">
            <IconPencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <IconTrash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface AddCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cartão</DialogTitle>
          <DialogDescription>
            Preencha os dados do seu cartão para receber recomendações personalizadas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome" className="text-right">Nome</Label>
            <Input id="nome" placeholder="Ex: Nubank" className="col-span-3" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="banco" className="text-right">Banco</Label>
            <Input id="banco" placeholder="Ex: Nubank" className="col-span-3" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="final" className="text-right">Últimos dígitos</Label>
            <Input id="final" placeholder="Ex: 4321" maxLength={4} className="col-span-3" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="programa" className="text-right">Programa</Label>
            <SelectDropdown
              items={[
                { label: 'Livelo', value: 'livelo' },
                { label: 'Smiles', value: 'smiles' },
                { label: 'Esfera', value: 'esfera' },
                { label: 'Dotz', value: 'dotz' },
                { label: 'TudoAzul', value: 'tudoazul' },
                { label: 'PontosMiles', value: 'pontomiles' },
              ]}
              defaultValue=""
              placeholder="Selecione o programa de pontos"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxaConversao" className="text-right">Taxa de conversão</Label>
            <Input id="taxaConversao" placeholder="Ex: 1.2" type="number" step="0.1" className="col-span-3" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="anuidade" className="text-right">Anuidade (R$)</Label>
            <Input id="anuidade" placeholder="Ex: 400" type="number" className="col-span-3" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit">Adicionar Cartão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const cartoesUsuario = [
  {
    id: 1,
    nome: 'Nubank Platinum',
    banco: 'Nubank',
    final: '4321',
    programa: 'Livelo',
    taxaConversao: '1.2',
    anuidade: '400',
    ativo: true,
  },
  {
    id: 2,
    nome: 'Itaucard Platinum',
    banco: 'Itaú',
    final: '7890',
    programa: 'Sempre Presente',
    taxaConversao: '1.5',
    anuidade: '650',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Santander Select',
    banco: 'Santander',
    final: '2468',
    programa: 'Esfera',
    taxaConversao: '1.0',
    anuidade: '480',
    ativo: false,
  },
]

const cartoesRecomendados = [
  {
    id: 1,
    nome: 'Shell Box Itaucard Platinum',
    banco: 'Itaú',
    descricao: 'Ideal para seus gastos com combustível',
    vantagens: '10% de desconto em postos Shell e 5x pontos',
    programa: 'Sempre Presente',
    potencial: 175,
  },
  {
    id: 2,
    nome: 'Santander Infinite',
    banco: 'Santander',
    descricao: 'Excelente para suas compras em supermercados',
    vantagens: '5x pontos em supermercados parceiros',
    programa: 'Esfera',
    potencial: 120,
  },
  {
    id: 3,
    nome: 'Bradesco Smiles Infinite',
    banco: 'Bradesco',
    descricao: 'Perfeito para suas viagens',
    vantagens: '3.5x pontos em qualquer compra',
    programa: 'Smiles',
    potencial: 90,
  },
]