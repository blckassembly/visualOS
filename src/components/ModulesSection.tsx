/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Grid, 
  Terminal, 
  Layers, 
  Fingerprint, 
  Image, 
  Move, 
  Type, 
  Compass, 
  FileText, 
  Box, 
  Scissors, 
  Ruler, 
  Cpu, 
  ListChecks, 
  Download, 
  ShieldCheck, 
  Share2,
  Layers3,
  Search,
  BookOpen
} from 'lucide-react';
import { MODULE_CARDS } from '../data';
import { useLanguage } from '../context/LanguageContext';

export default function ModulesSection() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Grid': return <Grid className="h-5 w-5 text-blue-600" />;
      case 'Terminal': return <Terminal className="h-5 w-5 text-indigo-600" />;
      case 'Layers': return <Layers className="h-5 w-5 text-fuchsia-600" />;
      case 'Bezier': return <Fingerprint className="h-5 w-5 text-pink-600" />;
      case 'Image': return <Image className="h-5 w-5 text-emerald-600" />;
      case 'Move': return <Move className="h-5 w-5 text-amber-600" />;
      case 'Type': return <Type className="h-5 w-5 text-teal-600" />;
      case 'Compass': return <Compass className="h-5 w-5 text-rose-600" />;
      case 'Layers3': return <Layers3 className="h-5 w-5 text-violet-600" />;
      case 'FileText': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'Box': return <Box className="h-5 w-5 text-cyan-600" />;
      case 'Scissors': return <Scissors className="h-5 w-5 text-orange-600" />;
      case 'Ruler': return <Ruler className="h-5 w-5 text-emerald-600" />;
      case 'Cpu': return <Cpu className="h-5 w-5 text-red-650" />;
      case 'ListChecks': return <ListChecks className="h-5 w-5 text-amber-500" />;
      case 'Download': return <Download className="h-5 w-5 text-slate-800" />;
      case 'ShieldCheck': return <ShieldCheck className="h-5 w-5 text-teal-500" />;
      case 'Share2': return <Share2 className="h-5 w-5 text-violet-500" />;
      default: return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const allTags = ['All', ...Array.from(new Set(MODULE_CARDS.map(m => m.tag)))];

  const filteredModules = MODULE_CARDS.filter(mod => {
    const matchesSearch = mod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || mod.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <section id="modules" className="py-24 bg-white border-b border-gray-200 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.02),transparent_70%) pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header containing Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs font-bold text-blue-600 tracking-widest uppercase block mb-3">
              {t('modules.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans mb-2">
              {t('modules.title')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
              {t('modules.desc')}
            </p>
          </div>

          {/* Search bar layout */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search OS engines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-modules-input"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Quick Tag filter pills selector */}
        <div className="flex flex-wrap gap-1.5 mb-10 pb-4 border-b border-gray-150" id="modules-tag-filter">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              id={`module-tag-btn-${tag.replace(/\s+/g, '-').toLowerCase()}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="modules-cards-grid">
          {filteredModules.map((mod, index) => (
            <div
              key={mod.name}
              id={`module-bento-card-${mod.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="p-6 rounded-2xl border border-gray-250 bg-gray-50/40 hover:bg-white hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 bg-white border border-gray-150 rounded-xl inline-flex shadow-sm">
                    {getModuleIcon(mod.iconName)}
                  </div>
                  <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                    {mod.tag}
                  </span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight font-sans mb-2.5">
                  {mod.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                  {mod.description}
                </p>
              </div>

              {/* Status checklist metrics */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>SYSTEM REGISTRATION</span>
                <span className="text-emerald-500 font-bold uppercase">Ready</span>
              </div>
            </div>
          ))}

          {filteredModules.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 font-sans" id="modules-no-results">
              No specific visual engine modules match your search boundaries.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
