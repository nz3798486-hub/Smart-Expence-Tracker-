import { CategoryId, CategoryInfo } from '../types';

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'food',
    label: 'Food & Dining',
    iconName: 'Utensils',
    color: '#10b981', // emerald
    bgColor: '#ecfdf5',
    keywords: [
      'food', 'grocery', 'groceries', 'supermarket', 'market', 'restaurant',
      'cafe', 'coffee', 'starbucks', 'dinner', 'lunch', 'breakfast', 'brunch',
      'pizza', 'burger', 'bakery', 'bread', 'milk', 'snack', 'doordash',
      'ubereats', 'deliveroo', 'takeaway', 'meal', 'bistro', 'barbecue', 'sushi'
    ]
  },
  {
    id: 'health',
    label: 'Health & Medical',
    iconName: 'HeartPulse',
    color: '#ef4444', // red
    bgColor: '#fef2f2',
    keywords: [
      'health', 'doctor', 'hospital', 'clinic', 'dentist', 'dental', 'medicine',
      'pharmacy', 'prescription', 'drugs', 'therapy', 'counselor', 'optician',
      'glasses', 'gym', 'fitness', 'vitamins', 'supplement', 'healthcare', 'medical'
    ]
  },
  {
    id: 'transportation',
    label: 'Transportation',
    iconName: 'Car',
    color: '#3b82f6', // blue
    bgColor: '#eff6ff',
    keywords: [
      'transport', 'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'subway',
      'metro', 'transit', 'gas', 'fuel', 'petrol', 'diesel', 'parking', 'toll',
      'flight', 'airline', 'ticket', 'vehicle', 'car wash', 'commute', 'rail'
    ]
  },
  {
    id: 'education',
    label: 'Education',
    iconName: 'GraduationCap',
    color: '#8b5cf6', // purple
    bgColor: '#f5f3ff',
    keywords: [
      'education', 'school', 'college', 'university', 'tuition', 'course',
      'udemy', 'coursera', 'class', 'book', 'textbook', 'bootcamp', 'training',
      'exam', 'cert', 'certification', 'workshop', 'learning', 'tutor'
    ]
  },
  {
    id: 'electricity',
    label: 'Electricity',
    iconName: 'Zap',
    color: '#f59e0b', // amber
    bgColor: '#fffbeb',
    keywords: [
      'electric', 'electricity', 'power', 'energy', 'hydro', 'edison', 'kilowatt',
      'electric bill', 'solar power', 'utility power'
    ]
  },
  {
    id: 'utilities',
    label: 'Utility Bills',
    iconName: 'Receipt',
    color: '#06b6d4', // cyan
    bgColor: '#ecfeff',
    keywords: [
      'utility', 'utilities', 'water', 'water bill', 'gas bill', 'internet',
      'wifi', 'broadband', 'phone bill', 'mobile bill', 'verizon', 'at&t',
      't-mobile', 'comcast', 'sewer', 'trash', 'garbage', 'heating'
    ]
  },
  {
    id: 'shopping',
    label: 'Shopping',
    iconName: 'ShoppingBag',
    color: '#ec4899', // pink
    bgColor: '#fdf2f8',
    keywords: [
      'shop', 'shopping', 'amazon', 'clothes', 'clothing', 'shoes', 'apparel',
      'fashion', 'zara', 'nike', 'adidas', 'target', 'walmart', 'electronics',
      'gadget', 'hardware', 'store', 'mall', 'furniture', 'cosmetics', 'beauty'
    ]
  },
  {
    id: 'housing',
    label: 'Housing & Rent',
    iconName: 'Home',
    color: '#6366f1', // indigo
    bgColor: '#eef2ff',
    keywords: [
      'rent', 'mortgage', 'housing', 'apartment', 'house', 'hoa', 'property',
      'lease', 'maintenance', 'repair', 'plumber', 'landlord', 'remodel', 'home'
    ]
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    iconName: 'Film',
    color: '#14b8a6', // teal
    bgColor: '#f0fdfa',
    keywords: [
      'entertainment', 'movie', 'cinema', 'netflix', 'spotify', 'apple tv',
      'disney', 'hulu', 'hbo', 'concert', 'ticket', 'game', 'gaming', 'steam',
      'playstation', 'xbox', 'nintendo', 'party', 'bar', 'club', 'pub', 'hobby'
    ]
  },
  {
    id: 'other',
    label: 'Other / Miscellaneous',
    iconName: 'MoreHorizontal',
    color: '#64748b', // slate
    bgColor: '#f8fafc',
    keywords: ['other', 'misc', 'general', 'fee', 'charge', 'service']
  }
];

export function getCategoryInfo(categoryId: CategoryId): CategoryInfo {
  const found = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
  if (found) return found;
  return {
    id: categoryId,
    label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    iconName: 'Tag',
    color: '#64748b',
    bgColor: '#f1f5f9',
    keywords: []
  };
}

/**
 * Intelligently classifies an expense description into one of our predefined categories.
 */
export function autoClassifyCategory(text: string): { categoryId: CategoryId; confidence: 'high' | 'medium' | 'none'; matchedKeyword?: string } {
  if (!text || !text.trim()) {
    return { categoryId: 'other', confidence: 'none' };
  }

  const clean = text.toLowerCase().trim();

  // 1. Direct or multi-word specific checks first (e.g. electric bill, water bill)
  for (const cat of DEFAULT_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (kw.includes(' ') && clean.includes(kw)) {
        return { categoryId: cat.id, confidence: 'high', matchedKeyword: kw };
      }
    }
  }

  // 2. Tokenized word matching
  const words = clean.split(/[\s,._\-/+&]+/);
  for (const word of words) {
    if (word.length < 3) continue;
    for (const cat of DEFAULT_CATEGORIES) {
      for (const kw of cat.keywords) {
        if (word === kw || (kw.length >= 4 && word.startsWith(kw)) || (word.length >= 5 && kw.startsWith(word))) {
          return { categoryId: cat.id, confidence: 'high', matchedKeyword: kw };
        }
      }
    }
  }

  // 3. Substring matching for distinctive terms
  for (const cat of DEFAULT_CATEGORIES) {
    if (cat.id === 'other') continue;
    for (const kw of cat.keywords) {
      if (kw.length >= 4 && clean.includes(kw)) {
        return { categoryId: cat.id, confidence: 'medium', matchedKeyword: kw };
      }
    }
  }

  return { categoryId: 'other', confidence: 'none' };
}
