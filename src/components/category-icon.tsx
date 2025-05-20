import React from 'react';
import { cn } from '@/lib/utils';
import {
  Utensils,
  ShoppingCart,
  Car,
  Fuel,
  Play,
  Pill,
  ShoppingBag,
  Package,
  GraduationCap,
  HeartPulse,
  Film,
  Plane,
  Shirt,
  CalendarCheck,
  Home,
  Wine,
  ArrowLeftRight,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

// Mapeamento de nomes de ícones para componentes Lucide
const iconMap: Record<string, LucideIcon> = {
  'utensils': Utensils,
  'shopping-cart': ShoppingCart,
  'car': Car,
  'fuel': Fuel,
  'play': Play,
  'pill': Pill,
  'shopping-bag': ShoppingBag,
  'package': Package,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  'film': Film,
  'plane': Plane,
  'shirt': Shirt,
  'calendar-check': CalendarCheck,
  'home': Home,
  'wine': Wine,
  'arrow-left-right': ArrowLeftRight,
  'help-circle': HelpCircle
};

// Mapeamento de cores para estilos Tailwind
const colorMap: Record<string, { bg: string, text: string }> = {
  'red': { bg: 'bg-red-100', text: 'text-red-600' },
  'yellow': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  'green': { bg: 'bg-green-100', text: 'text-green-600' },
  'orange': { bg: 'bg-orange-100', text: 'text-orange-600' },
  'blue': { bg: 'bg-blue-100', text: 'text-blue-600' },
  'purple': { bg: 'bg-purple-100', text: 'text-purple-600' },
  'pink': { bg: 'bg-pink-100', text: 'text-pink-600' },
  'cyan': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  'teal': { bg: 'bg-teal-100', text: 'text-teal-600' },
  'indigo': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  'gray': { bg: 'bg-gray-100', text: 'text-gray-600' },
  'violet': { bg: 'bg-violet-100', text: 'text-violet-600' },
  'rose': { bg: 'bg-rose-100', text: 'text-rose-600' },
  'amber': { bg: 'bg-amber-100', text: 'text-amber-600' },
  'emerald': { bg: 'bg-emerald-100', text: 'text-emerald-600' }
};

interface CategoryIconProps {
  iconName: string;
  color: string;
  size?: number;
  className?: string;
  fallback?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  iconName, 
  color, 
  size = 20, 
  className,
  // fallback = '??' 
}) => {
  // Obter o componente de ícone com base no nome
  const IconComponent = iconMap[iconName] || HelpCircle;
  
  // Obter as classes de cor do Tailwind
  const colorClasses = colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  
  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full',
        colorClasses.bg,
        className
      )}
      style={{ width: `${size + 12}px`, height: `${size + 12}px` }}
    >
      <IconComponent 
        className={colorClasses.text} 
        size={size} 
      />
    </div>
  );
};