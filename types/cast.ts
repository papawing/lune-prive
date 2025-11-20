// Cast Profile Type Definitions

export type LocalizedText = {
  en?: string;
  zh?: string;
  ja?: string;
};

export type CastProfile = {
  id: string;
  userId: string;

  // Classification & Status
  tierClassification: "STANDARD" | "HIGH_CLASS";
  isActive: boolean;
  isFeatured: boolean;

  // Basic Information
  age: number;
  birthday?: Date | null;
  location: string;
  languages: string[];

  // Physical Attributes
  bustSize?: string | null;
  height?: number | null;
  weight?: number | null;
  bodyMeasurements?: string | null;
  englishLevel?: string | null;

  // Profile Content - Multilingual
  bio?: LocalizedText | null;
  personality?: LocalizedText | null;
  appearance?: LocalizedText | null;
  serviceStyle?: LocalizedText | null;
  preferredType?: LocalizedText | null;

  // Lifestyle
  hobbies: string[];
  holidayStyle: string[];
  interests: string[]; // Legacy

  // Relations (when included)
  user?: {
    nickname: string;
    verificationStatus: string;
  };
  photos?: Array<{
    id: string;
    photoUrl: string;
    displayOrder: number;
  }>;
};

// Predefined options for consistency
export const BUST_SIZES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'G+'] as const;
export type BustSize = typeof BUST_SIZES[number];

export const ENGLISH_LEVELS = ['Native', 'Fluent', 'Conversational', 'Basic', 'None'] as const;
export type EnglishLevel = typeof ENGLISH_LEVELS[number];

export const HOBBY_OPTIONS = [
  'gourmet',
  'beauty',
  'music',
  'travel',
  'sports',
  'art',
  'reading',
  'movies',
  'gaming',
  'outdoor',
  'shopping',
  'cooking',
  'fitness',
  'photography',
  'dancing'
] as const;
export type Hobby = typeof HOBBY_OPTIONS[number];

export const HOLIDAY_STYLE_OPTIONS = [
  'home',
  'cafe',
  'shopping',
  'travel',
  'nature',
  'cultural',
  'nightlife',
  'sports',
  'spa',
  'adventure'
] as const;
export type HolidayStyle = typeof HOLIDAY_STYLE_OPTIONS[number];
