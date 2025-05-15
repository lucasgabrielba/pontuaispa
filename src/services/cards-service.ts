// cardsService.js
import { Card, RecommendedCard, RewardProgram } from '@/types/cards';

const MOCK_REWARD_PROGRAMS: RewardProgram[] = [
  { id: '01HQ5Y3GHZ1RJSX9VPKC96ZBXW', name: 'Livelo' },
  { id: '01HQ5Y3T1QY2Z3JFPXK4BM5N6P', name: 'Smiles' },
  { id: '01HQ5Y43C7D8E9F0G1H2J3K4L5', name: 'Esfera' },
  { id: '01HQ5Y4FM6N7P8Q9R0S1T2U3V4', name: 'Dotz' },
  { id: '01HQ5Y4W5X6Y7Z8A9B0C1D2E3F', name: 'TudoAzul' },
  { id: '01HQ5Y57G8H9J0K1L2M3N4P5Q6', name: 'PontosMiles' },
];

const MOCK_CARDS: Card[] = [
  {
    id: '01HQ5Y5RR8S9T0U1V2W3X4Y5Z6',
    name: 'Nubank Platinum',
    bank: 'Nubank',
    lastDigits: '4321',
    rewardProgramId: '01HQ5Y3GHZ1RJSX9VPKC96ZBXW', // Livelo
    rewardProgramName: 'Livelo',
    conversionRate: 1.2,
    annualFee: 400,
    isActive: true,
  },
  {
    id: '01HQ5Y6A7B8C9D0E1F2G3H4J5K',
    name: 'Itaucard Platinum',
    bank: 'Itaú',
    lastDigits: '7890',
    rewardProgramId: '01HQ5Y3T1QY2Z3JFPXK4BM5N6P', // Smiles
    rewardProgramName: 'Sempre Presente',
    conversionRate: 1.5,
    annualFee: 650,
    isActive: true,
  },
  {
    id: '01HQ5Y6L6M7N8P9Q0R1S2T3U4V',
    name: 'Santander Select',
    bank: 'Santander',
    lastDigits: '2468',
    rewardProgramId: '01HQ5Y43C7D8E9F0G1H2J3K4L5', // Esfera
    rewardProgramName: 'Esfera',
    conversionRate: 1.0,
    annualFee: 480,
    isActive: false,
  },
];

const MOCK_RECOMMENDED_CARDS: RecommendedCard[] = [
  {
    id: '01HQ5Y755W6X7Y8Z9A0B1C2D3E',
    name: 'Shell Box Itaucard Platinum',
    bank: 'Itaú',
    description: 'Ideal para seus gastos com combustível',
    benefits: '10% de desconto em postos Shell e 5x pontos',
    rewardProgramName: 'Sempre Presente',
    potentialIncrease: 175,
  },
  {
    id: '01HQ5Y7F4G5H6J7K8L9M0N1P2Q',
    name: 'Santander Infinite',
    bank: 'Santander',
    description: 'Excelente para suas compras em supermercados',
    benefits: '5x pontos em supermercados parceiros',
    rewardProgramName: 'Esfera',
    potentialIncrease: 120,
  },
  {
    id: '01HQ5Y7R3S4T5U6V7W8X9Y0Z1A',
    name: 'Bradesco Smiles Infinite',
    bank: 'Bradesco',
    description: 'Perfeito para suas viagens',
    benefits: '3.5x pontos em qualquer compra',
    rewardProgramName: 'Smiles',
    potentialIncrease: 90,
  },
];

// Simulação de delay da API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cardsService = {
  getCards: async (): Promise<Card[]> => {
    await delay(800); // Simula tempo de resposta da API
    return MOCK_CARDS;
  },
  
  getRecommendedCards: async (): Promise<RecommendedCard[]> => {
    await delay(1000); // Simula tempo de resposta da API
    return MOCK_RECOMMENDED_CARDS;
  },
  
  getRewardPrograms: async (): Promise<RewardProgram[]> => {
    await delay(500);
    return MOCK_REWARD_PROGRAMS;
  },
  
  addCard: async (card: Omit<Card, 'id' | 'rewardProgramName'>): Promise<Card> => {
    await delay(800);
    
    // Encontra o nome do programa de recompensa baseado no ID
    const rewardProgram = MOCK_REWARD_PROGRAMS.find(p => p.id === card.rewardProgramId);
    
    // Cria um novo card com um ID simulado
    const newCard: Card = {
      ...card,
      id: `01HQ${Date.now().toString(36)}`,
      rewardProgramName: rewardProgram?.name || 'Sem programa'
    };
    
    // Em uma implementação real, o cartão seria enviado para a API
    // e aqui apenas retornamos o objeto criado com o ID gerado pelo servidor
    return newCard;
  },
  
  updateCard: async (card: Card): Promise<Card> => {
    await delay(800);
    
    // Encontra o nome do programa de recompensa baseado no ID
    const rewardProgram = card.rewardProgramId 
      ? MOCK_REWARD_PROGRAMS.find(p => p.id === card.rewardProgramId)
      : null;
    
    // Atualiza o nome do programa de recompensa
    const updatedCard: Card = {
      ...card,
      rewardProgramName: rewardProgram?.name || 'Sem programa'
    };
    
    return updatedCard;
  },
  
  updateCardStatus: async (id: string, isActive: boolean): Promise<Card> => {
    await delay(500);
    
    // Em uma implementação real, enviaria uma requisição para a API
    // e retornaria o objeto atualizado
    // Aqui apenas simulamos o retorno
    const card = MOCK_CARDS.find(c => c.id === id);
    
    if (!card) {
      throw new Error('Cartão não encontrado');
    }
    
    return {
      ...card,
      isActive
    };
  },
  
  deleteCard: async (id: string): Promise<void> => {
    await delay(700);
    console.log(`Cartão ${id} removido`);
    // Em uma implementação real, enviaria uma requisição para a API
  }
};