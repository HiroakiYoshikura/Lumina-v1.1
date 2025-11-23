import React from 'react';
import { PRESETS } from '../constants';
import { PresetConfig, PresetId } from '../types';
import { Package, PenTool, User, Film, BarChart, Sliders, Check } from 'lucide-react';

interface Props {
  selectedId: PresetId;
  onSelect: (preset: PresetConfig) => void;
}

const IconMap: Record<string, React.ElementType> = {
  'Package': Package,
  'PenTool': PenTool,
  'User': User,
  'Film': Film,
  'BarChart': BarChart,
  'Sliders': Sliders,
};

export const SceneSelector: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="w-full mb-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-4 px-2 md:px-0">制作シーンを選択</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {PRESETS.map((preset) => {
          const Icon = IconMap[preset.iconName] || Sliders;
          const isSelected = selectedId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={`
                relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border transition-all duration-200 min-h-[100px]
                ${isSelected 
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-blue-400">
                  <Check size={14} />
                </div>
              )}
              <Icon size={20} className={`mb-2 md:mb-3 ${isSelected ? 'text-blue-400' : 'text-gray-500'}`} />
              <span className="text-xs md:text-sm font-medium text-center leading-tight">{preset.name.split('(')[0]}</span>
              <span className="text-[9px] md:text-[10px] text-center mt-1 opacity-70 leading-tight px-1">
                 {preset.id === 'storyboard' || preset.id === 'infographic' || preset.id === 'custom' ? 'Gemini 3 Pro' : 'Imagen 4'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};