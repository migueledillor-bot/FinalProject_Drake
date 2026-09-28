import React, { useState } from 'react';
import { X, KeyRound, ExternalLink, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSave }) {
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(inputValue.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#0c1220] rounded-2xl border border-gray-200 dark:border-dark-border shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Google Gemini API Key
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Required for real-time code analysis
            </p>
          </div>
        </div>

        {/* Notice on Free Tier */}
        <div className="p-3 mb-4 rounded-xl bg-indigo-50/60 dark:bg-brand-950/30 border border-indigo-100 dark:border-brand-900/50 text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
          <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free & No Credit Card Needed</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Google provides a free tier via Google AI Studio. You can generate a free key in 30 seconds.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-medium text-[11px]"
          >
            <span>Get your free key from Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Enter API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2.5 pr-10 text-xs font-mono rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              Saved strictly in your browser (<code className="font-mono">localStorage</code>). It is never sent to our servers.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors shadow-md shadow-brand-500/20"
            >
              Save Key
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
