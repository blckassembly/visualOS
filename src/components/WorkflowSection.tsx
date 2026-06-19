/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  HelpCircle, 
  ChevronsRight, 
  Sparkles, 
  Activity, 
  ArrowDownIcon 
} from 'lucide-react';
import { WORKFLOW_STEPS } from '../data';

export default function WorkflowSection() {
  const { t } = useLanguage();
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const activeStep = WORKFLOW_STEPS[selectedStepIndex];

  return (
    <section id="workflow" className="py-24 bg-gray-50 border-b border-gray-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-blue-600 tracking-widest uppercase block mb-3">
            {t('workflow.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans mb-4">
            {t('workflow.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('workflow.desc')}
          </p>
        </div>

        {/* Horizontal Sequence Scroll Cards */}
        <div className="relative mb-12">
          {/* Connecting gradient pipeline bar behind cards */}
          <div className="absolute top-[52px] left-8 right-8 h-0.5 bg-gradient-to-right from-blue-500 via-indigo-400 to-emerald-500 opacity-20 hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4" id="workflow-steps-connector">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isSelected = selectedStepIndex === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setSelectedStepIndex(idx)}
                  id={`workflow-card-step-${step.step}`}
                  className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 relative ${
                    isSelected 
                      ? 'border-blue-600 bg-white shadow-md' 
                      : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  {/* Direction arrow badge indicators for desktop */}
                  {idx < WORKFLOW_STEPS.length - 1 && (
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 hidden lg:flex items-center text-gray-300">
                      <ChevronsRight className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-150 text-gray-500'
                    }`}>
                      {step.step}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400 uppercase font-semibold">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-xs text-gray-900 leading-tight truncate">
                    {step.title}
                  </h3>
                  
                  {/* Sparkle indicator for active selected state */}
                  {isSelected && (
                    <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic workflow details display board */}
        <div 
          className="bg-white border border-gray-250 rounded-2xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          id="workflow-dashboard-panel"
        >
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded text-blue-700 font-mono text-[10px] font-bold uppercase">
                Active Component Segment #{activeStep.step}
              </span>
              <span className="font-mono text-xs text-gray-400">
                → {activeStep.badge} ENGINE
              </span>
            </div>
            
            <h4 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-sans tracking-tight">
              {activeStep.title}
            </h4>
            
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-sans">
              {activeStep.description}
            </p>

            <div className="pt-4 border-t border-gray-150 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                <Activity className="h-4 w-4 animate-pulse" />
                Live OS Kernel state compiled.
              </span>
              <span>Tolerance Factor: OK</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-gray-900 text-gray-300 p-5 rounded-xl font-mono text-[11px] space-y-2.5 border border-gray-800 shadow-inner select-none">
            <div className="flex justify-between text-xs text-gray-500 border-b border-gray-800 pb-2">
              <span>DEBUG_PIPELINE_FLOW</span>
              <span className="text-blue-500 underline">Trace file block</span>
            </div>
            <div className="space-y-1">
              <div><span className="text-blue-500">❯ EXECUTABLE:</span> kernel_step_{activeStep.step}.so</div>
              <div><span className="text-gray-500">❯ STATE_TRANSITION:</span> OK</div>
              <div><span className="text-gray-500">❯ CACHE_POLICY:</span> bypass_active</div>
              <div><span className="text-gray-500">❯ OUTPUT_HASH:</span> sha256_8f93e1a0d3</div>
              <div className="pt-2 text-emerald-400 font-bold flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready for next pipeline index
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
