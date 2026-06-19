/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Database, 
  Check, 
  Cpu 
} from 'lucide-react';

interface QCCheckItem {
  name: string;
  category: 'Aesthetics' | 'CAD Specs' | 'Handoff';
  initialStatus: 'clean' | 'warning' | 'critical';
  resolvedStatus: 'clean';
  details: string;
}

export default function QualityControl() {
  const { t } = useLanguage();
  const [auditRunning, setAuditRunning] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  // Exact 10 checks listed in prompt:
  // - Alignment
  // - Layer naming
  // - Text overflow
  // - Brand compliance
  // - Wrong aspect ratio
  // - Missing units
  // - Missing dimensions
  // - Thin walls
  // - Missing material
  // - Human review flags
  const [checks, setChecks] = useState<QCCheckItem[]>([
    { name: 'Alignment Check', category: 'Aesthetics', initialStatus: 'clean', resolvedStatus: 'clean', details: 'All vectors aligned perfectly to 4px spacing tracks.' },
    { name: 'Layer Naming Constraints', category: 'Handoff', initialStatus: 'warning', resolvedStatus: 'clean', details: 'Found 4 unnamed shapes ("Group 41", "Layer 9") that break structural export hierarchies.' },
    { name: 'Text Overflow Audit', category: 'Aesthetics', initialStatus: 'clean', resolvedStatus: 'clean', details: 'No boundary leaks. All description elements fit container bounds.' },
    { name: 'Brand Compliance', category: 'Aesthetics', initialStatus: 'clean', resolvedStatus: 'clean', details: 'All fills and strokes align with active Outfit brand tokens.' },
    { name: 'Wrong Aspect Ratio Probe', category: 'Handoff', initialStatus: 'clean', resolvedStatus: 'clean', details: 'Current canvas complies with selected standards.' },
    { name: 'Missing Units Watch', category: 'CAD Specs', initialStatus: 'warning', resolvedStatus: 'clean', details: 'Found 2 drawing vertices with unspecified metric scaling denominators.' },
    { name: 'Missing Dimensions Guard', category: 'CAD Specs', initialStatus: 'critical', resolvedStatus: 'clean', details: 'Kiosk Shell core elements do not hold clear specified physical thicknesses.' },
    { name: 'Thin Walls Check', category: 'CAD Specs', initialStatus: 'warning', resolvedStatus: 'clean', details: 'CNC pocket wall drops below safe 0.8mm tolerance limits.' },
    { name: 'Missing Material Matrix', category: 'CAD Specs', initialStatus: 'critical', resolvedStatus: 'clean', details: 'Gasket clamp missing core material classification lookup.' },
    { name: 'Human Review Flags', category: 'Handoff', initialStatus: 'clean', resolvedStatus: 'clean', details: 'All engineer-level overrides passed validation.' },
  ]);

  const handleRunAudit = () => {
    if (auditRunning) return;
    setAuditRunning(true);
    
    setTimeout(() => {
      setIsResolved(true);
      setAuditRunning(false);
    }, 1800);
  };

  const handleResetAudit = () => {
    setIsResolved(false);
  };

  return (
    <section id="quality" className="py-24 bg-gray-50 border-b border-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_0%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-6 space-y-3">
            <span className="font-mono text-xs font-bold text-blue-600 tracking-widest uppercase block">
              {t('quality.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans">
              {t('quality.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium font-sans max-w-xl">
              {t('quality.desc')}
            </p>
          </div>
          <div className="lg:col-span-6 flex items-center justify-end h-full">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {!isResolved ? (
                <button
                  onClick={handleRunAudit}
                  disabled={auditRunning}
                  id="btn-run-qc-audit"
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-md shadow-blue-500/10 ${
                    auditRunning 
                      ? 'bg-blue-100 text-blue-600 border border-blue-200 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {auditRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Running Linter Checks...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Run Production Audit</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleResetAudit}
                  id="btn-reset-qc-audit"
                  className="w-full sm:w-auto px-6 py-3.5 border border-emerald-350 bg-emerald-50 text-emerald-800 rounded-xl font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Audit Cleared (Reset)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Audit status list dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6" id="qc-audit-dashboard-grid">
          {checks.map((chk, index) => {
            const status = isResolved ? 'clean' : chk.initialStatus;
            
            return (
              <div
                key={chk.name}
                id={`qc-card-row-${index}`}
                className={`p-5 rounded-2xl border bg-white transition-all duration-300 flex items-start gap-4 ${
                  status === 'clean'
                    ? 'border-emerald-200/60 hover:border-emerald-300'
                    : status === 'warning'
                    ? 'border-amber-200/80 hover:border-amber-300 bg-amber-500/[0.005]'
                    : 'border-red-200/85 hover:border-red-300 bg-red-500/[0.005]'
                }`}
              >
                {/* Status Icon Indicator */}
                <div className="shrink-0 mt-0.5 select-none text-left">
                  {status === 'clean' && (
                    <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  {status === 'warning' && (
                    <div className="p-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-md">
                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                    </div>
                  )}
                  {status === 'critical' && (
                    <div className="p-2 bg-red-50 text-red-650 border border-red-100 rounded-md">
                      <AlertTriangle className="h-5 w-5 animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Content description */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans font-bold text-sm text-gray-900 leading-tight">
                      {chk.name}
                    </h3>
                    <div className="flex items-center gap-1.5 font-mono text-[9px]">
                      <span className="text-gray-400 capitalize">{chk.category}</span>
                      <span className="text-gray-300 select-none">|</span>
                      <span className={`font-bold uppercase ${
                        status === 'clean' 
                          ? 'text-emerald-600' 
                          : status === 'warning' 
                          ? 'text-amber-600' 
                          : 'text-red-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    {chk.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
