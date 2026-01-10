import { LanguageCode, LengthOption } from './types';

export const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dfcv0exad/image/upload/v1739440780/next-cloudinary-uploads/upload_1739440780559_product-sample_pfg4nl.jpg";

export const AVAILABLE_LANGUAGES: { id: LanguageCode; label: string; flag: string }[] = [
  { id: 'Spanish', label: 'Español', flag: '🇪🇸' },
  { id: 'English', label: 'Inglés', flag: '🇺🇸' },
  { id: 'French', label: 'Francés', flag: '🇫🇷' },
  { id: 'German', label: 'Alemán', flag: '🇩🇪' },
  { id: 'Italian', label: 'Italiano', flag: '🇮🇹' },
  { id: 'Portuguese', label: 'Portugués', flag: '🇵🇹' },
  { id: 'Japanese', label: 'Japonés', flag: '🇯🇵' },
  { id: 'Korean', label: 'Coreano', flag: '🇰🇷' },
  { id: 'Chinese', label: 'Chino', flag: '🇨🇳' },
];

export const LENGTH_OPTIONS: { id: LengthOption; label: string; desc: string }[] = [
  { id: 'Short', label: 'Corto', desc: 'Conciso y directo' },
  { id: 'Medium', label: 'Medio', desc: 'Equilibrado' },
  { id: 'Long', label: 'Largo', desc: 'Detallado' },
];