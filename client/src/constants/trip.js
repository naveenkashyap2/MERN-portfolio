import { Train, Bus, Car, Footprints, Shuffle, IndianRupee, Building2, Crown, BedDouble } from 'lucide-react';

export const TRANSPORT_OPTIONS = [
  { value: 'train', label: 'Train', description: 'Fast & economical', icon: Train },
  { value: 'bus', label: 'Bus', description: 'Wide network', icon: Bus },
  { value: 'car', label: 'Car', description: 'Door-to-door', icon: Car },
  { value: 'walking', label: 'Walking', description: 'Free & immersive', icon: Footprints },
  { value: 'any', label: 'Any', description: "Let AI decide", icon: Shuffle },
];

export const STAY_OPTIONS = [
  { value: 'budget', label: 'Budget', price: '₹', description: 'Affordable stays', icon: IndianRupee },
  { value: 'medium', label: 'Medium', price: '₹₹', description: 'Comfort stays', icon: Building2 },
  { value: 'premium', label: 'Premium', price: '₹₹₹', description: 'Premium stays', icon: Crown },
  { value: 'none', label: 'No hotel', price: '—', description: 'Day trips only', icon: BedDouble },
];

export const INTERESTS = [
  'temple',
  'gurudwara',
  'historical',
  'nature',
  'adventure',
  'food',
  'shopping',
  'photography',
  'family',
  'spiritual',
];

export const EXPENSE_CATEGORIES = [
  { value: 'transport', label: 'Transport', color: '#3B82F6' },
  { value: 'hotel', label: 'Hotel', color: '#06B6D4' },
  { value: 'food', label: 'Food', color: '#F59E0B' },
  { value: 'shopping', label: 'Shopping', color: '#A855F7' },
  { value: 'activities', label: 'Activities', color: '#22C55E' },
  { value: 'other', label: 'Other', color: '#94A3B8' },
];

export const TRAVEL_STYLES = [
  { value: 'budget', label: 'Budget' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'premium', label: 'Premium' },
];

export const AI_QUICK_ACTIONS = [
  { id: 'optimize', label: 'Optimize Trip' },
  { id: 'reduce-cost', label: 'Reduce Cost' },
  { id: 'find-nearby', label: 'Find Nearby' },
  { id: 'change-hotel', label: 'Change Hotel' },
  { id: 'add-temple', label: 'Add Temple' },
  { id: 'add-gurudwara', label: 'Add Gurudwara' },
  { id: 'im-late', label: "I'm Late" },
  { id: 'replan', label: 'Replan' },
];

export const GENERATION_STEPS = [
  'Understanding your preferences',
  'Optimizing your route',
  'Finding places',
  'Planning your itinerary',
  'Calculating your budget',
  'Preparing your trip',
];
