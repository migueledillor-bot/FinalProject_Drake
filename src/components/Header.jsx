import React from 'react';
import { Code2, Moon, Sun, Menu, KeyRound, Sparkles } from 'lucide-react';

export default function Header({
  isDarkMode,
  setIsDarkMode,
  isDrawerOpen,
  setIsDrawerOpen,
  hasApiKey,
  openApiKeyModal,
  selectedTone,
  setSelectedTone
}) {
  return (
    <header className="h-14 shrink-0 w-full border-b border-slate-300 dark:border-dark-border bg-white dark:bg-dark-bg/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 select-none shadow-sm">
      
      {/* Left: Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
          <Code2 className="w-4 h-4 stroke-[2.2]" />
        </div>
        <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
          DevPlain
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-2.5 h-2.5" />
          <span>AI</span>
        </span>
      </div>

      {/* Center: Clean Segmented Tone Control */}
      <div className="hidden sm:flex items-center bg-slate-100 dark:bg-dark-card p-1 rounded-xl border border-slate-300/80 dark:border-dark-border text-xs font-semibold">
        {[
          { id: 'beginner', label: '🐣 Beginner' },
          { id: 'intermediate', label: '💻 Developer' },
          { id: 'senior', label: '🔍 Deep Dive' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTone(item.id)}
            className={`px-3 py-1 rounded-lg transition-all ${
              selectedTone === item.id
                ? 'bg-white dark:bg-dark-surface text-brand-600 dark:text-brand-300 shadow-sm border border-slate-200 dark:border-brand-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right: Quick Controls */}
      <div className="flex items-center gap-2">
        {/* API Key Status Pill */}
        <button
          onClick={openApiKeyModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            hasApiKey
              ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
              : 'border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
          }`}
          title="Configure Gemini API Key"
        >
          <KeyRound className="w-3 h-3" />
          <span className="hidden md:inline">{hasApiKey ? 'API Ready' : 'Set Key'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        </button>

        {/* Dark/Light Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-dark-surface border border-slate-300 dark:border-dark-border transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Sandwich Menu Button */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label="Toggle menu"
          className="p-1.5 rounded-lg text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-dark-surface border border-slate-300 dark:border-dark-border transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
}
