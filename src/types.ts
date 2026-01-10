export type LanguageCode = 
  | 'English' 
  | 'Spanish' 
  | 'French' 
  | 'German' 
  | 'Italian' 
  | 'Portuguese' 
  | 'Japanese' 
  | 'Korean' 
  | 'Chinese';

export type LengthOption = 'Short' | 'Medium' | 'Long';

export interface GeneratedDescription {
  language: string;
  title: string;
  description: string;
}

export interface AppState {
  image: string | null;
  selectedLanguages: LanguageCode[];
  selectedLength: LengthOption;
  isGenerating: boolean;
  results: GeneratedDescription[] | null;
  error: string | null;
}