export type EventType =
  | 'birthday'
  | 'wedding'
  | 'anniversary'
  | 'freshers'
  | 'college_fest'
  | 'graduation'
  | 'community'
  | 'corporate';

export type VenueType = 'indoor' | 'outdoor' | 'hybrid' | 'beach' | 'rooftop' | 'banquet';

export type FoodPreference =
  | 'pure_veg'
  | 'veg_non_veg'
  | 'jain_available'
  | 'cocktail_finger_food'
  | 'buffet_multi_cuisine'
  | 'traditional_thali';

export interface ExpenseItem {
  id: string;
  category: BudgetCategory;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  status: 'pending' | 'deposit_paid' | 'paid_in_full';
  notes?: string;
  vendorId?: string;
}

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'entertainment'
  | 'invitations'
  | 'logistics'
  | 'miscellaneous';

export interface CategoryAllocation {
  category: BudgetCategory;
  name: string;
  percentage: number;
  allocatedAmount: number;
  spentAmount: number;
  iconName: string;
  color: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'planning' | 'booking' | 'creatives' | 'guests' | 'execution';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  phase: '60_days' | '30_days' | '14_days' | '7_days' | '1_day' | 'event_day';
}

export interface VendorItem {
  id: string;
  name: string;
  category: BudgetCategory;
  contactPerson: string;
  phone: string;
  email: string;
  estimatedPrice: number;
  status: 'inquiry' | 'quote_received' | 'shortlisted' | 'booked' | 'rejected';
  rating: number; // 1-5
  notes: string;
  location?: string;
}

export interface AIPlanSection {
  conceptTitle: string;
  conceptSummary: string;
  themeStyle: string;
  colorPalette: { name: string; hex: string }[];
  vibeKeywords: string[];
  cateringSuggestions: string[];
  entertainmentIdeas: string[];
  guestExperienceHighlights: string[];
  costSavingTips: { tip: string; estimatedSavingsINR: number }[];
  backupPlan: {
    weatherRisk: string;
    vendorContingency: string;
    powerSoundContingency: string;
  };
  suggestedSchedule: { time: string; activity: string }[];
}

export interface CreativeAsset {
  id: string;
  type: 'invitation' | 'caption' | 'speech' | 'tagline' | 'schedule';
  title: string;
  content: string;
  tags?: string[];
}

export interface EventPlan {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  location: string;
  guestCount: number;
  totalBudget: number; // in INR
  preferredTheme: string;
  decorationStyle: string;
  foodPreference: FoodPreference;
  venueType: VenueType;
  specialRequirements: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;

  // Structured Sections
  aiPlan: AIPlanSection;
  expenses: ExpenseItem[];
  tasks: TaskItem[];
  vendors: VendorItem[];
  creativeAssets: CreativeAsset[];
}

export type ActiveTab =
  | 'landing'
  | 'wizard'
  | 'dashboard'
  | 'overview'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'creative'
  | 'settings';
