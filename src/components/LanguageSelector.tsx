import React from 'react';
import { AVAILABLE_LANGUAGES } from '../constants';
import { LanguageCode } from '../types';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  selected: LanguageCode[];
  onChange: (langs: LanguageCode[]) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  const toggleLanguage = (langId: LanguageCode) => {
    if (selected.includes(langId)) {
      onChange(selected.filter(id => id !== langId));
    } else {
      if (selected.length < 3) {
        onChange([...selected, langId]);
      }
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-baseline">
          <label className="text-primary font-bold text-xl">
            Idiomas
          </label>
          <span className="hidden md:block text-xs text-gray-400">
            {selected.length}/3 seleccionados
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Elige hasta 3 idiomas para la descripción.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AVAILABLE_LANGUAGES.map((lang) => {
          const isSelected = selected.includes(lang.id);
          const isDisabled = !isSelected && selected.length >= 3;

          return (
            <button
              key={lang.id}
              onClick={() => toggleLanguage(lang.id)}
              disabled={isDisabled}
              className={`
                relative flex items-center justify-start px-3 py-2 rounded-md border border-gray-200 transition-all duration-200 ease-in-out
                ${isSelected
                  ? "bg-accent border-accent transform scale-[1.02]"
                  : "bg-white border-gray-100 hover:border-accent hover:bg-accent-soft"
                }
                ${isDisabled
                  ? "opacity-50 cursor-not-allowed hover:border-gray-100 hover:bg-white"
                  : "cursor-pointer"
                }
              `}
            >
              <span
                className={`font-medium text-sm ${isSelected ? "text-primary" : "text-gray-500"
                  }`}
              >
                {lang.label}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check size={13} className="text-primary" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};