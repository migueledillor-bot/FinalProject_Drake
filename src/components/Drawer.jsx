import React, { useState } from 'react';
import { 
  X, History, KeyRound, GraduationCap, 
  Code2, Trash2, CheckCircle2, ChevronRight, ChevronDown, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { SAMPLE_SNIPPETS } from '../data/sampleSnippets';

export default function Drawer({
  isOpen,
  onClose,
  selectedTone,
  setSelectedTone,
  onSelectSnippet,
  history,
  onSelectHistoryItem,
  onClearHistory,
  apiKey,
  onSaveApiKey,
  onOpenInfoModal
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [showKeySection, setShowKeySection] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside 
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm sm:max-w-md bg-white dark:bg-[#0c1220] border-l border-slate-200 dark:border-dark-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-slate-50/70 dark:bg-dark-card/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                DevPlain Menu
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Workspace & Library
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-dark-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          
          {/* Quick Trigger: Student & Project Info (Click to view!) */}
          <button
            onClick={() => {
              onClose();
              onOpenInfoModal();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50/60 dark:from-brand-950/40 dark:to-indigo-950/20 border border-brand-200/70 dark:border-brand-800/40 hover:border-brand-400 transition-all group"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
              <GraduationCap className="w-4 h-4" />
              <span>Project & Student Details</span>
            </div>
            <span className="text-[11px] text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Explanation Tone Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Audience Mode
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'beginner', label: '🐣 Beginner (ELI5)', desc: 'Plain conversational English with analogies.' },
                { id: 'intermediate', label: '💻 Developer', desc: 'Standard logic, control flow & variable scope.' },
                { id: 'senior', label: '🔍 Deep Dive', desc: 'Big-O complexity, memory & optimization.' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTone(item.id)}
                  className={`text-left p-3 rounded-2xl border text-xs transition-all duration-200 ${
                    selectedTone === item.id
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 shadow-sm'
                      : 'border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-card text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ⚡ Sample Snippets Library */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sample Snippets
              </label>
              <span className="text-[10px] text-slate-400">1-click test</span>
            </div>
            <div className="space-y-2">
              {SAMPLE_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => {
                    onSelectSnippet(snippet);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/90 dark:border-dark-border hover:border-brand-400 dark:hover:border-brand-500 bg-white dark:bg-dark-card/50 hover:bg-slate-50 dark:hover:bg-dark-card text-left transition-all duration-200 group shadow-sm"
                >
                  <div className="truncate mr-2">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-300 truncate">
                      {snippet.title}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-slate-400 mt-1">
                      {snippet.language}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* 🕒 Recent History */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <History className="w-3.5 h-3.5" />
                <span>Recent History</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-dark-border text-center text-xs text-slate-400 dark:text-slate-500">
                No past explanations saved yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectHistoryItem(item);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-card transition-colors flex items-center justify-between group"
                  >
                    <div className="truncate mr-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.explanation?.title || 'Code Snippet'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Saved'} • {item.language}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 🔑 API Key (Collapsible Accordion) */}
          <div className="pt-2 border-t border-slate-100 dark:border-dark-border">
            <button
              onClick={() => setShowKeySection(!showKeySection)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-1.5"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-brand-500" />
                <span>Gemini API Key Settings</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showKeySection ? 'rotate-180' : ''}`} />
            </button>

            {showKeySection && (
              <form onSubmit={handleSaveKey} className="mt-3 space-y-2.5 animate-fadeIn">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Save Key</span>
                  </button>
                  {isSavedNotice && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-dark-border bg-slate-50/70 dark:bg-dark-card/70 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>AD-ET 101 Final Project</span>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1"
          >
            <span>Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </aside>
    </>
  );
}
