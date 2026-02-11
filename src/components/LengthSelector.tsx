
import { LENGTH_OPTIONS } from '../constants';
import { LengthOption } from '../types';
import { AlignLeft, AlignJustify, AlignCenter, Check } from 'lucide-react';

interface LengthSelectorProps {
  selected: LengthOption;
  onChange: (len: LengthOption) => void;
}

export const LengthSelector: React.FC<LengthSelectorProps> = ({ selected, onChange }) => {
  const getIcon = (id: LengthOption) => {
    switch (id) {
      case 'Short': return <AlignLeft size={20} />;
      case 'Medium': return <AlignCenter size={20} />;
      case 'Long': return <AlignJustify size={20} />;
    }
  };

  return (
    <div>
      <label className="text-primary font-semibold text-xl">Longitud</label>
      <p className="text-sm text-gray-500 mb-4">
        Selecciona el nivel de detalle deseado.
      </p>

      <div className="flex flex-col gap-3">
        {LENGTH_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`
                relative flex items-center p-4 rounded-md border transition-all duration-300
                ${isSelected
                  ? "border-gray-400 bg-gray-100 text-gray-600"
                  : "cursor-pointer bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                }
              `}
            >
              <div
                className={`
                p-2 rounded-full mr-4 transition-colors
                ${isSelected
                    ? "bg-accent text-primary"
                    : "bg-gray-100 text-gray-500"
                  }
              `}
              >
                {getIcon(opt.id)}
              </div>
              <div className="text-left">
                <div
                  className={`font-medium text-sm ${isSelected ? "text-primary" : "text-gray-500"
                    }`}
                >
                  {opt.label}
                </div>
                <div
                  className={`text-xs ${isSelected ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  {opt.desc}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Check size={16} className="text-primary" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};