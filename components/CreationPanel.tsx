import React, { useState, useEffect } from 'react';
import { PresetConfig, GeneratedImage } from '../types';
import { generateContent } from '../services/geminiService';
import { Loader2, Upload, ArrowRight, Wand2, Zap, Sparkles } from 'lucide-react';

interface Props {
  preset: PresetConfig;
  onSuccess: (images: GeneratedImage[], text?: string) => void;
}

export const CreationPanel: React.FC<Props> = ({ preset, onSuccess }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [useEconomy, setUseEconomy] = useState(false);

  // Reset form when preset changes
  useEffect(() => {
    setFormData({});
    setUploadedFiles([]);
    // Default to Pro mode for quality, unless user switches
    setUseEconomy(false);
  }, [preset.id]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 14) {
        alert("一度にアップロードできる参照画像は最大14枚です。最初の14枚のみが選択されました。");
        setUploadedFiles(files.slice(0, 14));
      } else {
        setUploadedFiles(files);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const result = await generateContent(preset, formData, uploadedFiles, useEconomy);
      
      const newImages: GeneratedImage[] = result.images.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url,
        prompt: preset.name, 
        model: preset.model.includes('imagen') ? 'Imagen 4' : (useEconomy ? 'Gemini 2.5 Flash' : 'Gemini 3 Pro'),
        timestamp: Date.now()
      }));

      onSuccess(newImages, result.text);
    } catch (error: any) {
      alert(`生成に失敗しました: ${error.message || "不明なエラー"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const isGemini = preset.model.includes('gemini');

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Wand2 className="text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{preset.name} 設定</h3>
            <p className="text-sm text-gray-400">{preset.description}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {preset.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                <option value="">選択してください</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[6rem] resize-y"
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                required
              />
            ) : (
              <input
                type="text"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                required
              />
            )}
          </div>
        ))}

        {/* Reference Image Uploader */}
        {isGemini && (
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                参照画像 (任意 - 最大14枚)
              </label>
              {uploadedFiles.length > 0 && (
                <span className="text-xs text-blue-400 font-mono">{uploadedFiles.length}/14</span>
              )}
            </div>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-800 file:text-blue-400
                  hover:file:bg-gray-700
                  cursor-pointer
                "
              />
              <Upload className="absolute right-3 top-2 text-gray-600 pointer-events-none" size={18} />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {uploadedFiles.map((f, i) => (
                   <div key={i} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 whitespace-nowrap border border-gray-700">
                     {f.name}
                   </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Economy Mode Toggle - Only for Gemini presets */}
        {isGemini && (
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-2">
               {useEconomy ? <Zap className="text-yellow-400" size={18} /> : <Sparkles className="text-purple-400" size={18} />}
               <div className="flex flex-col">
                 <span className="text-sm font-medium text-white">
                    {useEconomy ? 'エコノミー (Gemini 2.5)' : 'プロフェッショナル (Gemini 3)'}
                 </span>
                 <span className="text-xs text-gray-400">
                    {useEconomy ? '高速・低コスト・標準画質' : '高画質(4K)・高推論・検索機能'}
                 </span>
               </div>
            </div>
            <button
              type="button"
              onClick={() => setUseEconomy(!useEconomy)}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${useEconomy ? 'bg-yellow-600/50' : 'bg-purple-600'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${useEconomy ? 'translate-x-0' : 'translate-x-5'}
                `}
              />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className={`
            w-full py-4 rounded-lg font-semibold text-white shadow-lg flex items-center justify-center gap-2
            transition-all duration-300 transform hover:-translate-y-0.5
            ${isGenerating 
              ? 'bg-gray-800 cursor-not-allowed opacity-70' 
              : useEconomy
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 shadow-yellow-900/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
            }
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <span>生成する</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};