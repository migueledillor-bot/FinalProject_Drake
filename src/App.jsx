import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Drawer from './components/Drawer';
import CodeEditor from './components/CodeEditor';
import ExplanationView from './components/ExplanationView';
import ApiKeyModal from './components/ApiKeyModal';
import InfoModal from './components/InfoModal';
import { SAMPLE_SNIPPETS } from './data/sampleSnippets';
import { explainCodeSnippet, getSavedApiKey, saveApiKey } from './services/gemini';
import { Code, Lightbulb, Info } from 'lucide-react';

export default function App() {
  // Theme state (Dark mode default)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Drawer & Modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Gemini API Key state
  const [apiKey, setApiKey] = useState(() => getSavedApiKey());

  // Workspace state
  const [code, setCode] = useState(SAMPLE_SNIPPETS[0].code);
  const [language, setLanguage] = useState(SAMPLE_SNIPPETS[0].language);
  const [selectedTone, setSelectedTone] = useState('beginner');

  // AI Explanation state
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mobile active tab: 'code' or 'explanation'
  const [mobileTab, setMobileTab] = useState('code');

  // History state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('code_explainer_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync theme with HTML document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle saving API Key
  const handleSaveApiKey = (newKey) => {
    saveApiKey(newKey);
    setApiKey(newKey);
    if (error === 'MISSING_API_KEY' || error === 'INVALID_API_KEY') {
      setError(null);
    }
  };

  // Handle selecting a sample snippet
  const handleSelectSnippet = (snippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setExplanation(null);
    setError(null);
    setMobileTab('code');
  };

  // Pick a random sample snippet
  const handlePickRandomSample = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_SNIPPETS.length);
    handleSelectSnippet(SAMPLE_SNIPPETS[randomIndex]);
  };

  // Load a past history item
  const handleSelectHistoryItem = (item) => {
    setCode(item.code);
    setLanguage(item.language || 'Auto-Detect');
    setExplanation(item.explanation);
    setError(null);
    setMobileTab('explanation');
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('code_explainer_history');
  };

  // Trigger Fast Gemini Code Explanation
  const handleExplainCode = async () => {
    if (!code.trim()) return;

    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      setError('MISSING_API_KEY');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMobileTab('explanation');

    try {
      const result = await explainCodeSnippet({
        code,
        language,
        tone: selectedTone,
        apiKey
      });

      setExplanation(result);

      // Save to history
      const newHistoryItem = {
        id: Date.now().toString(),
        code,
        language: result.language || language,
        explanation: result,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('code_explainer_history', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while explaining code.');
      if (err.message === 'MISSING_API_KEY' || err.message.startsWith('Invalid Gemini API Key')) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#eaedf2] dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Header (Streamlined, compact, zero clutter) */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        hasApiKey={Boolean(apiKey)}
        openApiKeyModal={() => setIsApiKeyModalOpen(true)}
        selectedTone={selectedTone}
        setSelectedTone={setSelectedTone}
      />

      {/* Sandwich Menu Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedTone={selectedTone}
        setSelectedTone={setSelectedTone}
        onSelectSnippet={handleSelectSnippet}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSave={handleSaveApiKey}
      />

      {/* Project & Student Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Main Full-Height Workspace (Maximized space, edge-to-edge) */}
      <main className="flex-1 w-full p-2.5 sm:p-3.5 overflow-hidden flex flex-col min-h-0">
        
        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex items-center bg-slate-200/80 dark:bg-dark-card p-1 rounded-xl mb-2.5 shrink-0 border border-slate-300 dark:border-dark-border">
          <button
            onClick={() => setMobileTab('code')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'code'
                ? 'bg-white dark:bg-dark-surface text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Input</span>
          </button>
          <button
            onClick={() => setMobileTab('explanation')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all relative ${
              mobileTab === 'explanation'
                ? 'bg-white dark:bg-dark-surface text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Explanation</span>
            {explanation && (
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Dual Panel Grid (100% Height, 50/50 Split on Desktop) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 h-full min-h-0 overflow-hidden">
          
          {/* Left Panel: Code Input */}
          <div className={`${mobileTab === 'code' ? 'flex' : 'hidden'} md:flex flex-col h-full min-h-0`}>
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              isLoading={isLoading}
              onExplain={handleExplainCode}
              onPickRandomSample={handlePickRandomSample}
            />
          </div>

          {/* Right Panel: AI Explanation Output */}
          <div className={`${mobileTab === 'explanation' ? 'flex' : 'hidden'} md:flex flex-col h-full min-h-0`}>
            <ExplanationView
              explanation={explanation}
              isLoading={isLoading}
              error={error}
              code={code}
              apiKey={apiKey}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            />
          </div>

        </div>

      </main>

      {/* Slim Modern Footer (Zero clutter) */}
      <footer className="h-8 px-4 sm:px-6 shrink-0 border-t border-slate-300 dark:border-dark-border bg-white/80 dark:bg-dark-bg/90 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">DevPlain</span>
          <span>•</span>
          <span>Code Explainer Tool</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors flex items-center gap-1"
          >
            <Info className="w-3 h-3 text-brand-500" />
            <span>Project Info</span>
          </button>
          <span>•</span>
          <span className="text-brand-600 dark:text-brand-400 font-semibold">
            Google Gemini
          </span>
        </div>
      </footer>

    </div>
  );
}
