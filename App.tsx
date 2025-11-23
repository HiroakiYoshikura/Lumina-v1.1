import React, { useState, useEffect } from 'react';
import { SceneSelector } from './components/SceneSelector';
import { CreationPanel } from './components/CreationPanel';
import { RefinePanel } from './components/RefinePanel';
import { GeneratedImage, PresetConfig, ViewMode } from './types';
import { PRESETS } from './constants';
import { Sparkles, Layers, Layout, ShieldAlert, X, LogIn, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [apiKeyValid, setApiKeyValid] = useState<boolean>(false);
  const [loadingKey, setLoadingKey] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetConfig>(PRESETS[0]);
  const [currentMode, setCurrentMode] = useState<ViewMode>('create');
  const [manualKey, setManualKey] = useState<string>('');
  
  // State to pass from Creation to Refine
  const [lastGeneratedImage, setLastGeneratedImage] = useState<GeneratedImage | undefined>(undefined);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    setLoadingKey(true);
    try {
      // 1. Check Local Storage first (User preference)
      const localKey = localStorage.getItem('lumina_api_key');
      if (localKey) {
        setApiKeyValid(true);
        setShowAuthModal(false);
        return;
      }

      // 2. Check AI Studio environment
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          setApiKeyValid(true);
          setShowAuthModal(false);
          return;
        }
      } else if (process.env.API_KEY) {
          // Fallback for standard env injections
          setApiKeyValid(true);
          setShowAuthModal(false);
          return;
      }
      
      setApiKeyValid(false);
      setShowAuthModal(true);
    } catch (e) {
      console.error("Error checking API key", e);
      setApiKeyValid(false);
      setShowAuthModal(true);
    } finally {
      setLoadingKey(false);
    }
  };

  const handleRequestKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success to avoid race conditions
        setApiKeyValid(true);
        setShowAuthModal(false);
      } catch (e) {
        console.error("Failed to select key", e);
      }
    } else {
       // Fallback logic if needed
    }
  };

  const handleCreationSuccess = (images: GeneratedImage[], text?: string) => {
    if (images.length > 0) {
      setLastGeneratedImage(images[0]);
      // Auto switch to refine mode to show the result
      setCurrentMode('refine');
    }
  };

  const clearKey = () => {
      if (confirm('APIキー設定をリセットしますか？')) {
        localStorage.removeItem('lumina_api_key');
        setApiKeyValid(false);
        setManualKey('');
        setShowAuthModal(true);
      }
  };

  if (loadingKey) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-950 text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30 relative">
      
      {/* Authentication Modal Overlay */}
      {(!apiKeyValid && showAuthModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative max-w-md w-full space-y-6 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
            >
              <X size={20} />
            </button>

            <div className="mx-auto w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 mb-4">
              <ShieldAlert size={32} />
            </div>
            
            <div className="text-center">
               <h1 className="text-2xl font-bold text-white mb-2">認証が必要です</h1>
               <p className="text-gray-400 text-sm">
                 LuminaのImagen 4およびGemini 3モデルを利用するにはAPIキーが必要です。
                 キーを設定せずにUIを確認することは可能です。
               </p>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={handleRequestKey}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                >
                    <Sparkles size={18} />
                    Google APIキーを選択
                </button>
                
                <button 
                    onClick={() => setShowAuthModal(false)}
                    className="w-full py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                    キャンセルしてUIを表示
                </button>
            </div>

            <div className="pt-4 border-t border-gray-800 text-center">
               <p className="text-xs text-gray-600">
                  画像モデルを利用するには、課金が有効なGoogle CloudプロジェクトのAPIキーが必要です。
                  <br />
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-blue-400">
                    課金に関するドキュメントを表示
                  </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="h-16 border-b border-gray-800 flex items-center px-4 md:px-6 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-900/20 flex-shrink-0">
            <Sparkles className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">
              Lumina
            </span>
            <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">
              AI Image Studio
            </span>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
            {/* Desktop Navigation Switcher - Hidden on Mobile */}
            <div className="hidden md:flex bg-gray-900 border border-gray-800 rounded-lg p-1">
                <button 
                    onClick={() => setCurrentMode('create')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentMode === 'create' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <Layout size={14} /> 新規作成
                </button>
                <button 
                    onClick={() => setCurrentMode('refine')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentMode === 'refine' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <Layers size={14} /> 編集・洗練
                </button>
            </div>
            
            {apiKeyValid ? (
              <button 
                  onClick={clearKey}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
                  title="APIキー設定 (リセット)"
              >
                  <Settings size={18} />
                  <span className="hidden md:inline">API設定</span>
              </button>
            ) : (
              <button 
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/30"
              >
                  <LogIn size={14} />
                  <span className="hidden md:inline">ログイン</span>
              </button>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pb-24 md:pb-0">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto h-full p-4 md:p-8 max-w-7xl relative z-10">
          
          {currentMode === 'create' ? (
            <div className="h-full overflow-y-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 scrollbar-hide">
              <div className="text-center mb-8 md:mb-10 mt-4 md:mt-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800/50 text-blue-300 text-xs font-medium tracking-wide uppercase mb-6">
                  <Sparkles size={12} />
                  <span>Lumina - AI Image Studio</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                  Imagine. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Refine.</span> Create.
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg px-4">
                   Imagen 4とGemini 3 Proのハイブリッドインテリジェンス。
                   シーンを選択してクリエイティブな旅を始めましょう。
                </p>
              </div>

              <SceneSelector selectedId={selectedPreset.id} onSelect={setSelectedPreset} />
              
              <div className="max-w-3xl mx-auto">
                 <CreationPanel preset={selectedPreset} onSuccess={handleCreationSuccess} />
              </div>
            </div>
          ) : (
            <div className="h-full pb-4 md:pb-0 animate-in fade-in slide-in-from-right-4 duration-500">
               <RefinePanel initialImage={lastGeneratedImage} />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Improved Design */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Floating blur container with strong top shadow/border for separation */}
        <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]"></div>
        
        <div className="relative flex justify-around items-center p-2 pb-5">
           {/* Create Button */}
           <button 
             onClick={() => setCurrentMode('create')}
             className="relative group flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all duration-300"
           >
             {currentMode === 'create' && (
               <div className="absolute inset-0 bg-blue-500/5 rounded-xl blur-sm" />
             )}
             <div className={`relative p-1 rounded-full transition-all duration-300 ${currentMode === 'create' ? 'text-blue-400 transform -translate-y-1' : 'text-gray-500 group-hover:text-gray-400'}`}>
               <Layout size={22} strokeWidth={currentMode === 'create' ? 2.5 : 2} />
               {/* Active Dot */}
               {currentMode === 'create' && (
                 <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)]"></span>
               )}
             </div>
             <span className={`text-[10px] font-medium tracking-wide transition-colors ${currentMode === 'create' ? 'text-blue-100' : 'text-gray-500'}`}>
               新規作成
             </span>
           </button>

           {/* Divider */}
           <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>

           {/* Refine Button */}
           <button 
             onClick={() => setCurrentMode('refine')}
             className="relative group flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all duration-300"
           >
             {currentMode === 'refine' && (
               <div className="absolute inset-0 bg-purple-500/5 rounded-xl blur-sm" />
             )}
             <div className={`relative p-1 rounded-full transition-all duration-300 ${currentMode === 'refine' ? 'text-purple-400 transform -translate-y-1' : 'text-gray-500 group-hover:text-gray-400'}`}>
               <Layers size={22} strokeWidth={currentMode === 'refine' ? 2.5 : 2} />
               {/* Active Dot */}
               {currentMode === 'refine' && (
                 <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
               )}
             </div>
             <span className={`text-[10px] font-medium tracking-wide transition-colors ${currentMode === 'refine' ? 'text-purple-100' : 'text-gray-500'}`}>
               編集・洗練
             </span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;