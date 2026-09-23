import React from 'react';
import {
  Utensils,
  HeartPulse,
  Car,
  GraduationCap,
  Zap,
  Receipt,
  ShoppingBag,
  Home,
  Film,
  MoreHorizontal,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  CreditCard,
  Wallet,
  HandCoins,
  BadgeDollarSign,
  LucideIcon
} from 'lucide-react';
import { CategoryId, TransactionType } from '../types';
import { getCategoryInfo } from '../utils/categorizer';

interface CategoryIconProps {
  categoryId?: CategoryId;
  type?: TransactionType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBackground?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  HeartPulse,
  Car,
  GraduationCap,
  Zap,
  Receipt,
  ShoppingBag,
  Home,
  Film,
  MoreHorizontal,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  CreditCard,
  Wallet,
  HandCoins,
  BadgeDollarSign,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  type,
  size = 'md',
  className = '',
  showBackground = true,
}) => {
  let IconComponent: LucideIcon = Tag;
  let color = '#64748b';
  let bgColor = '#f1f5f9';

  if (categoryId) {
    const info = getCategoryInfo(categoryId);
    IconComponent = ICON_MAP[info.iconName] || Tag;
    color = info.color;
    bgColor = info.bgColor;
  } else if (type) {
    switch (type) {
      case 'income':
        IconComponent = ArrowDownLeft;
        color = '#10b981';
        bgColor = '#ecfdf5';
        break;
      case 'expense':
        IconComponent = ArrowUpRight;
        color = '#ef4444';
        bgColor = '#fef2f2';
        break;
      case 'savings':
        IconComponent = PiggyBank;
        color = '#8b5cf6';
        bgColor = '#f5f3ff';
        break;
      case 'credit':
        IconComponent = CreditCard;
        color = '#f59e0b';
        bgColor = '#fffbeb';
        break;
      case 'debit':
        IconComponent = Wallet;
        color = '#06b6d4';
        bgColor = '#ecfeff';
        break;
      case 'loan':
        IconComponent = HandCoins;
        color = '#ec4899';
        bgColor = '#fdf2f8';
        break;
      case 'loan_repayment':
        IconComponent = BadgeDollarSign;
        color = '#14b8a6';
        bgColor = '#f0fdfa';
        break;
    }
  }

  const sizeClasses = {
    sm: { box: 'w-7 h-7 min-w-[28px]', icon: 14 },
    md: { box: 'w-10 h-10 min-w-[40px]', icon: 20 },
    lg: { box: 'w-12 h-12 min-w-[48px]', icon: 24 },
  }[size];

  if (!showBackground) {
    return <IconComponent size={sizeClasses.icon} style={{ color }} className={className} />;
  }

  return (
    <div
      className={`rounded-xl flex items-center justify-center transition-transform shrink-0 ${sizeClasses.box} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <IconComponent size={sizeClasses.icon} style={{ color }} />
    </div>
  );
};
