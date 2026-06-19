/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  FolderGit2, 
  Sparkles, 
  Download, 
  Maximize2, 
  Files, 
  ArrowUpRight 
} from 'lucide-react';
import { USE_CASES } from '../data';

export default function UseCasesSection() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'graphics' | 'industrial' | 'apparel' | 'architecture'>('all');

  const filteredUseCases = USE_CASES.filter(uc => {
    return selectedCategory === 'all' || uc.category === selectedCategory;
  });

  const categories = [
    { label: 'All Projects', id: 'all' },
    { label: 'Graphics & Layouts', id: 'graphics' },
    { label: 'Industrial Design / CAD', id: 'industrial' },
    { label: 'Fashion & Apparel', id: 'apparel' },
    { label: 'Architecture Specs', id: 'architecture' },
  ];

  return (
    <section id="usecases" className="py-24 bg-gray-50 border-b border-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top,rgba(59,130,246,0.03),transparent_60%) pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header containing Filters */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-blue-600 tracking-widest uppercase block mb-3">
            {t('usecases.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans mb-4">
            {t('usecases.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('usecases.desc')}
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" id="usecase-category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              id={`usecase-cat-tab-${cat.id}`}
              className={`px-4 py-2 border rounded-xl font-sans text-xs font-bold tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" id="usecase-cards-container">
          {filteredUseCases.map((uc, index) => (
            <div
              key={uc.title}
              id={`usecase-box-card-${index}`}
              className="bg-white border border-gray-250 rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between hover:border-gray-300 hover:shadow-xl shadow-sm transition-all duration-300"
            >
              {/* Card top */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono text-[10px] font-bold uppercase">
                    {uc.category.toUpperCase()} STATE
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                    <span>100% Vector</span>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 font-sans tracking-tight">
                  {uc.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {uc.description}
                </p>
              </div>

              {/* Dynamic canvas trace graphics mockup rendering block */}
              <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden select-none">
                <span className="text-[9px] font-mono font-bold text-gray-400 block mb-2.5">
                  [ SIMULATED CANVAS BLUEPRINT NODE ]
                </span>

                {/* Simulated visual layout based on category */}
                <div className="h-28 flex items-center justify-center relative border border-dashed border-gray-200 rounded-lg bg-white p-2">
                  {uc.visualType === 'business-card' && (
                    <div className="w-40 h-16 border border-gray-900 rounded p-1.5 flex flex-col justify-between bg-blue-50/10">
                      <div className="w-8 h-3 bg-blue-600 rounded" />
                      <div className="space-y-1">
                        <div className="w-16 h-1.5 bg-gray-300 rounded" />
                        <div className="w-20 h-1 bg-gray-200 rounded" />
                      </div>
                    </div>
                  )}

                  {uc.visualType === 'brand-system' && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600" />
                      <div className="w-8 h-8 rounded-full bg-slate-900" />
                      <div className="w-8 h-8 rounded-full bg-amber-500" />
                      <div className="w-16 h-3 bg-gray-200 rounded-lg" />
                    </div>
                  )}

                  {uc.visualType === 'ui-ux' && (
                    <div className="w-48 h-20 border border-gray-300 rounded-lg flex bg-slate-550/10">
                      <div className="w-12 border-r border-gray-200 bg-gray-50 p-1 space-y-1">
                        <div className="w-full h-1 bg-gray-300 rounded" />
                        <div className="w-4/5 h-1 bg-gray-200 rounded" />
                      </div>
                      <div className="flex-1 p-2 space-y-1.5">
                        <div className="w-12 h-3 bg-blue-100 rounded" />
                        <div className="grid grid-cols-3 gap-1">
                          <div className="h-6 bg-gray-100 rounded border border-gray-200" />
                          <div className="h-6 bg-gray-100 rounded border border-gray-200" />
                          <div className="h-6 bg-gray-100 rounded border border-gray-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  {uc.visualType === 'product-concept' && (
                    <div className="relative w-36 h-20 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-500 animate-spin" style={{ animationDuration: '20s' }} />
                      <div className="absolute top-2 left-2 text-[8px] font-mono text-gray-500">Ø 42mm</div>
                      <div className="absolute right-2 bottom-2 text-[8px] font-mono text-gray-500">FKM Silicon</div>
                    </div>
                  )}

                  {uc.visualType === 'tech-pack' && (
                    <div className="w-28 h-20 border border-gray-300 bg-cyan-50/5 p-1 flex flex-col justify-between">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 border border-gray-800 rounded-md bg-white flex items-center justify-center text-[10px] font-bold">FLAT</div>
                      <div className="flex justify-between text-[8px] font-mono text-gray-400">
                        <span>L: 450mm</span>
                        <span>W: 300mm</span>
                      </div>
                    </div>
                  )}

                  {uc.visualType === 'architecture' && (
                    <div className="w-40 h-22 border border-dashed border-blue-500/80 bg-blue-550/5 relative p-1.5 flex flex-col justify-between">
                      <div className="grid grid-cols-3 gap-1 flex-1">
                        <div className="border border-gray-200 bg-white" />
                        <div className="border border-gray-200 bg-white col-span-2" />
                      </div>
                      <span className="text-[8px] font-mono text-blue-600 block text-right mt-1">Scale 1:50 | Node 14</span>
                    </div>
                  )}

                  {/* Fallback mock blueprint schematic wireframe for items */}
                  {!['business-card', 'brand-system', 'ui-ux', 'product-concept', 'tech-pack', 'architecture'].includes(uc.visualType) && (
                    <div className="w-48 h-18 border border-gray-300 rounded p-2 bg-slate-50/5 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                        <span>P_LOCK: TRUE</span>
                        <span>0.024 RMS_VAL</span>
                      </div>
                      <div className="h-0.5 bg-blue-600 w-full" />
                      <div className="flex justify-between text-[8px] text-gray-400">
                        <span>Part Specification Matrix</span>
                        <span>Rev r4.2</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card outputs */}
              <div className="pt-5 border-t border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide mb-2.5 font-mono">
                  Standard Handoff Formats
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {uc.outputs.map(out => (
                    <span
                      key={out}
                      className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 font-mono text-[10px] font-bold"
                    >
                      {out}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
