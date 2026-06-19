/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppWindow, Menu, X, ArrowRight, Globe, Check, Layers, Download, LayoutGrid } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useProjectMetrics } from '../context/ProjectMetricsContext';

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenPalette?: () => void;
}

export default function Navigation({ onScrollToSection, onOpenPalette }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { canvasesCount, layersCount, activeExportsCount } = useProjectMetrics();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  const navItems = [
    { label: t('nav.product'), targetId: 'hero' },
    { label: t('nav.modules'), targetId: 'modules' },
    { label: t('nav.usecases'), targetId: 'usecases' },
    { label: t('nav.commands'), targetId: 'commands' },
    { label: t('nav.exports'), targetId: 'exports' },
    { label: t('nav.unboxing'), targetId: 'unboxing' },
    { label: t('nav.quality'), targetId: 'quality' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onScrollToSection('hero')}
            id="nav-logo-container"
          >
            <div className="p-1.5 border border-black rounded-[2px] text-black bg-white group-hover:invert transition-all duration-300">
              <AppWindow className="h-4.5 w-4.5 stroke-[1.8]" id="app-logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-light uppercase tracking-[0.18em] text-black text-sm leading-none">
                VISUAL OS
              </span>
              <span className="font-mono text-[8.5px] tracking-[0.15em] text-neutral-400 uppercase font-medium leading-none mt-1">
                Atelier Engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.targetId}
                id={`nav-link-${item.targetId}`}
                onClick={() => onScrollToSection(item.targetId)}
                className="px-3.5 py-1.5 rounded-[2px] font-sans font-light tracking-[0.05em] text-xs uppercase text-neutral-500 hover:text-black transition-all duration-150"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Call To Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Project Metrics Dashboard */}
            <div 
              id="project-metrics-dashboard"
              className="flex items-center gap-4 px-3.5 py-1.5 bg-neutral-50 border border-black/10 rounded-[2px]"
              title="Real-time CAD Workspace Project Metrics"
            >
              {/* Heading / Label */}
              <div className="flex flex-col border-r border-black/10 pr-3.5">
                <span className="font-mono text-[8px] tracking-[0.18em] text-neutral-400 uppercase font-semibold leading-none">
                  Project
                </span>
                <span className="font-display text-[10px] uppercase font-bold text-neutral-800 tracking-[0.05em] leading-none mt-1">
                  Metrics
                </span>
              </div>

              {/* Counts section */}
              <div className="flex items-center gap-3.5">
                {/* Canvases Count */}
                <div 
                  className="flex items-center gap-1.5" 
                  id="metric-canvases-count"
                >
                  <LayoutGrid className="h-3.5 w-3.5 text-neutral-400 stroke-[1.8]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] font-bold text-black leading-none">
                      {canvasesCount}
                    </span>
                    <span className="font-sans text-[7.5px] text-neutral-400 font-medium leading-none mt-1 uppercase tracking-[0.12em]">
                      Canvases
                    </span>
                  </div>
                </div>

                {/* Layers Count */}
                <div 
                  className="flex items-center gap-1.5" 
                  id="metric-layers-count"
                >
                  <Layers className="h-3.5 w-3.5 text-neutral-400 stroke-[1.8]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] font-bold text-black leading-none">
                      {layersCount}
                    </span>
                    <span className="font-sans text-[7.5px] text-neutral-400 font-medium leading-none mt-1 uppercase tracking-[0.12em]">
                      Layers
                    </span>
                  </div>
                </div>

                {/* Active Exports */}
                <div 
                  className="flex items-center gap-1.5 relative group" 
                  id="metric-exports-count"
                >
                  <div className="relative">
                    <Download className={`h-3.5 w-3.5 stroke-[1.8] transition-colors duration-300 ${activeExportsCount > 0 ? 'text-neutral-800' : 'text-neutral-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-mono text-[11px] font-bold leading-none ${activeExportsCount > 0 ? 'text-black' : 'text-neutral-900'}`}>
                      {activeExportsCount}
                    </span>
                    <span className="font-sans text-[7.5px] text-neutral-400 font-medium leading-none mt-1 uppercase tracking-[0.12em]">
                      {activeExportsCount > 1 ? 'Exports' : 'Export'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Language Selector Dropdown */}
            <div className="relative" id="nav-lang-dropdown-wrapper">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                id="header-btn-lang-toggle"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-black/10 font-sans text-xs text-neutral-700 bg-white hover:bg-neutral-50 hover:text-black transition-all focus:outline-none"
              >
                <Globe className="h-3.5 w-3.5 text-neutral-500" />
                <span className="font-medium uppercase tracking-[0.1em]">{language}</span>
                <span className="text-[8px] text-neutral-400">▼</span>
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-45" onClick={() => setIsLangOpen(false)} />
                  <div 
                    id="nav-lang-dropdown-menu" 
                    className="absolute right-0 mt-2 w-40 bg-white border border-black/10 rounded-[2px] py-1 z-50 shadow-sm"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        id={`lang-select-${lang.code}`}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-2 text-left text-xs font-sans hover:bg-neutral-50 transition-colors ${
                          language === lang.code ? 'text-black font-semibold bg-neutral-50' : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                        {language === lang.code && <Check className="h-3 w-3 text-black" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {onOpenPalette && (
              <button 
                onClick={onOpenPalette}
                id="header-btn-palette"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-black/10 font-mono text-[10px] uppercase text-neutral-500 bg-white hover:bg-neutral-50 hover:text-black transition-all"
              >
                <span>kbd [⌘K]</span>
              </button>
            )}
            <button
              onClick={onOpenPalette || (() => onScrollToSection('hero'))}
              id="header-btn-cta"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white hover:bg-neutral-800 rounded-[2px] font-sans font-medium text-xs tracking-[0.12em] uppercase transition-all duration-300 border border-black"
            >
              <span>{t('nav.start')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick globe for mobile */}
            <button
              onClick={() => {
                const currentIndex = languages.findIndex(l => l.code === language);
                const nextIndex = (currentIndex + 1) % languages.length;
                setLanguage(languages[nextIndex].code);
              }}
              className="p-2 rounded-[2px] text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all focus:outline-none"
              title="Cycle Language"
              id="nav-mobile-lang-cycle"
            >
              <Globe className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="nav-mobile-toggle"
              className="p-2 rounded-[2px] text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" id="nav-mobile-close" /> : <Menu className="h-6 w-6" id="nav-mobile-open" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-black/10 bg-white" id="nav-mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.targetId}
                id={`nav-mobile-link-${item.targetId}`}
                onClick={() => {
                  onScrollToSection(item.targetId);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3.5 py-2.5 rounded-[2px] font-sans font-light tracking-[0.05em] text-sm uppercase text-neutral-600 hover:text-black hover:bg-neutral-50 transition-all"
              >
                {item.label}
              </button>
            ))}
            
            {/* Dedicated mobile language list */}
            <div className="pt-4 border-t border-black/10 py-2.5" id="nav-mobile-lang-selector">
              <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-[0.18em] mb-2.5 px-3.5 font-bold">
                Language / Idioma / Langue
              </span>
              <div className="grid grid-cols-3 gap-1.5 px-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-mobile-select-${lang.code}`}
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    className={`py-2 px-1 rounded-[2px] font-sans text-xs text-center border transition-all ${
                      language === lang.code 
                        ? 'bg-neutral-50 border-black text-black font-semibold' 
                        : 'bg-white border-black/10 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="mr-1">{lang.flag}</span>
                    <span>{lang.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Project Metrics Dashboard */}
            <div className="pt-4 border-t border-black/10 px-3.5 animate-fadeIn" id="nav-mobile-metrics">
              <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-[0.18em] mb-2.5 font-bold">
                Active Workspace Metrics
              </span>
              <div className="grid grid-cols-3 gap-2.5 bg-neutral-50 border border-black/10 p-3 rounded-[2px]">
                {/* Canvases */}
                <div className="flex flex-col items-center p-2 rounded-[2px] bg-white border border-black/10 text-center">
                  <LayoutGrid className="h-4 w-4 text-black mb-1" />
                  <span className="font-mono text-sm font-bold text-black leading-none">
                    {canvasesCount}
                  </span>
                  <span className="font-sans text-[8px] text-neutral-400 font-medium mt-1 uppercase tracking-wider">
                    Canvases
                  </span>
                </div>
                {/* Layers */}
                <div className="flex flex-col items-center p-2 rounded-[2px] bg-white border border-black/10 text-center">
                  <Layers className="h-4 w-4 text-black mb-1" />
                  <span className="font-mono text-sm font-bold text-black leading-none">
                    {layersCount}
                  </span>
                  <span className="font-sans text-[8px] text-neutral-400 font-medium mt-1 uppercase tracking-wider">
                    Layers
                  </span>
                </div>
                {/* Exports */}
                <div className="flex flex-col items-center p-2 rounded-[2px] bg-white border border-black/10 text-center relative">
                  <Download className="h-4 w-4 text-black mb-1" />
                  <span className="font-mono text-sm font-bold text-black leading-none">
                    {activeExportsCount}
                  </span>
                  <span className="font-sans text-[8px] text-neutral-400 font-medium mt-1 uppercase tracking-wider">
                    {activeExportsCount > 0 ? 'Active' : 'Exports'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t border-black/10 px-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  if (onOpenPalette) {
                    onOpenPalette();
                  } else {
                    onScrollToSection('hero');
                  }
                  setIsOpen(false);
                }}
                id="nav-mobile-btn-cta"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black text-white hover:bg-neutral-800 font-sans font-medium text-xs tracking-[0.18em] uppercase rounded-[2px]"
              >
                <span>{t('nav.start')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

