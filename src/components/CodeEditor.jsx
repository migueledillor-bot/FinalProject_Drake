import React, { useRef } from 'react';
import { 
  Clipboard, Trash2, Sparkles, Terminal, Play 
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  'Auto-Detect',
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'SQL',
  'PHP',
  'HTML / CSS',
  'Kotlin',
  'Swift'
];

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  isLoading,
  onExplain,
  onPickRandomSample
}) {
  const textareaRef = useRef(null);

  // Compute line numbers
  const lines = code ? code.split('\n') : [''];
  const lineCount = lines.length;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
      }
    } catch (err) {
      alert('Clipboard permission denied. Please paste manually using Ctrl+V / Cmd+V.');
    }
  };

  const handleClear = () => {
    setCode('');
  };

  // Handle Tab key to insert 2 spaces
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-card rounded-2xl border border-slate-300 dark:border-dark-border shadow-md dark:shadow-none overflow-hidden min-h-0">
      
      {/* Editor Top Toolbar */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-dark-border bg-slate-100/80 dark:bg-dark-surface/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">Editor</span>

          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={onPickRandomSample}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-medium transition-colors shadow-sm"
            title="Load random sample snippet"
          >
            <Play className="w-3 h-3 text-brand-600 dark:text-brand-400" />
            <span>Sample</span>
          </button>
          
          <button
            onClick={handlePaste}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-medium transition-colors shadow-sm"
            title="Paste code from clipboard"
          >
            <Clipboard className="w-3 h-3" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {code && (
            <button
              onClick={handleClear}
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-300 dark:border-dark-border hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 font-medium transition-colors"
              title="Clear editor"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body (Full height scrollable) */}
      <div className="relative flex-1 flex min-h-0 bg-white dark:bg-[#0c1220] overflow-hidden">
        
        {/* Line Numbers Column */}
        <div 
          aria-hidden="true"
          className="select-none py-3 px-2.5 text-right text-xs font-mono font-bold border-r border-slate-200 dark:border-dark-border/60 bg-slate-100/80 dark:bg-dark-bg/60 text-slate-400 dark:text-slate-500 min-w-[3rem] overflow-hidden shrink-0"
        >
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="// Paste any code snippet here...&#10;// DevPlain will explain it step-by-step in plain English."
          spellCheck="false"
          className="code-font flex-1 p-3.5 bg-transparent text-slate-950 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none focus:outline-none text-xs sm:text-sm leading-6 whitespace-pre overflow-auto tab-size-2 font-mono"
        />
      </div>

      {/* Editor Bottom Bar */}
      <div className="px-3.5 py-2.5 border-t border-slate-200 dark:border-dark-border bg-slate-100/80 dark:bg-dark-surface/60 flex items-center justify-between gap-2 shrink-0">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="font-bold text-slate-700 dark:text-slate-200">{lineCount}</span> lines • <span className="font-bold text-slate-700 dark:text-slate-200">{code.length}</span> chars
        </div>

        <button
          onClick={onExplain}
          disabled={isLoading || !code.trim()}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md ${
            isLoading || !code.trim()
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 active:scale-[0.98] shadow-brand-500/25 glow-primary'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explain Code</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
