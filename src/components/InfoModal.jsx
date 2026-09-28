import React from 'react';
import { X, GraduationCap, User, BookOpen, Hash, CheckCircle2 } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#0c1220] rounded-3xl border border-slate-200 dark:border-dark-border shadow-2xl overflow-hidden animate-fadeInUp">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-gradient-to-r from-brand-50/50 via-white to-indigo-50/30 dark:from-brand-950/30 dark:to-dark-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Project & Student Info
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Final Project Submission Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200/80 dark:border-dark-border flex items-center justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-500" />
                <span>Student</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Miguel Edillor
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200/80 dark:border-dark-border flex items-center justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-500" />
                <span>Course & Year</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                BSIT - 3
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200/80 dark:border-dark-border flex items-center justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                <span>Subject</span>
              </span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                AD-ET 101 Final Project
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200/80 dark:border-dark-border flex items-center justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Assigned Topic
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                Code Explainer Tool
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200/80 dark:border-dark-border flex items-center justify-between">
              <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Hash className="w-4 h-4 text-brand-500" />
                <span>Facebook Tag</span>
              </span>
              <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">
                #ADETFinals2026
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-transform active:scale-[0.98] shadow-md"
            >
              Close Information
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
