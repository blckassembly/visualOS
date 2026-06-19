/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileWarning, 
  Layers, 
  Settings, 
  Factory, 
  ZapOff, 
  Wrench,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PROBLEM_CARDS } from '../data';

interface ProblemSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function ProblemSection({ onScrollToSection }: ProblemSectionProps) {
  const { t } = useLanguage();
  // Map icons dynamically to problem card IDs
  const getProblemIcon = (id: string) => {
    switch (id) {
      case 'flat-images':
        return <ZapOff className="h-6 w-6 text-red-500" />;
      case 'designer-control':
        return <Layers className="h-6 w-6 text-blue-500" />;
      case 'product-requirements':
        return <Settings className="h-6 w-6 text-indigo-500" />;
      case 'manufacturer-input':
        return <Factory className="h-6 w-6 text-slate-700" />;
      default:
        return <FileWarning className="h-6 w-6 text-gray-500" />;
    }
  };

  const colors = {
    'flat-images': 'hover:border-red-200/80 hover:bg-red-500/[0.01]',
    'designer-control': 'hover:border-blue-200/80 hover:bg-blue-500/[0.01]',
    'product-requirements': 'hover:border-indigo-200/80 hover:bg-indigo-500/[0.01]',
    'manufacturer-input': 'hover:border-slate-300 hover:bg-slate-500/[0.01]'
  };

  return (
    <section id="problem" className="py-24 bg-white border-b border-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.03),transparent_50%) pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs font-bold text-red-500 tracking-widest uppercase block mb-3">
              {t('problem.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans leading-tight">
              {t('problem.title')}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('problem.desc')}
            </p>
          </div>
        </div>

        {/* Structured Grid Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" id="problem-cards-grid">
          {PROBLEM_CARDS.map((card, idx) => {
            const translatedTitle = t(`problem.card${idx + 1}.title`) || card.title;
            const translatedDesc = t(`problem.card${idx + 1}.desc`) || card.description;
            
            return (
              <div
                key={card.id}
                id={`problem-card-${card.id}`}
                className={`p-6 sm:p-8 rounded-2xl border border-gray-250 bg-gray-50/50 transition-all duration-300 flex flex-col justify-between ${
                  colors[card.id as keyof typeof colors] || 'hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl inline-flex mb-5 shadow-sm">
                    {getProblemIcon(card.id)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight font-sans mb-3.5">
                    {translatedTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">
                    {translatedDesc}
                  </p>
                </div>

                {/* Status footer inside problem cards */}
                <div className="mt-6 pt-5 border-t border-gray-200/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-red-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    ❌ Bitmap Failure Mode
                  </span>
                  <span className="text-gray-400">Locked Matrix</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call-to-action transition link */}
        <div className="mt-14 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-lg text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-bold text-sm text-gray-900">Ready to transition to absolute vector fidelity?</h4>
              <p className="text-xs text-gray-500">Initialize a parameterized workspace node with native scale guides.</p>
            </div>
          </div>
          <button 
            onClick={() => onScrollToSection('commands')} 
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Bootstrap Interactive Shell</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
