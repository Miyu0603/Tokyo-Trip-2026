
export type TabType = 'itinerary' | 'prep' | 'luggage' | 'info' | 'cost' | 'shopping';

export interface LocationDetail {
  address?: string;
  mapUrl?: string; // Google Maps URL
  carNaviPhone?: string; // Used for MapCode or Phone navigation
  description?: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  icon?: string; // Emoji or Icon name
  isHighlight?: boolean;
  location?: LocationDetail;
  notes?: string[];
  transport?: {
    type: 'train' | 'walk' | 'bus' | 'taxi' | 'flight';
    detail: string;
  };
}

export interface DailyItinerary {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Day 1"
  items: ItineraryItem[];
  hotel?: string;
  hotelMapUrl?: string;
}

export interface CostItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: 'JPY' | 'TWD';
  payer: 'Anbao' | 'Tingbao';
  splitType: 'average' | 'manual';
  manualSplitPerson?: 'Anbao' | 'Tingbao'; // Who the manual amount belongs to
  manualAmount?: number; // The specific amount for that person
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
}

export interface LuggageItem {
  id: string;
  name: string;
  category: 'carry-on' | 'checked';
  completed: boolean;
}

export interface WeatherData {
  temperature: number;
  code: number; // WMO code
}
