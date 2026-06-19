/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Download, 
  Files, 
  CheckCircle2, 
  Cpu, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { EXPORT_CATEGORIES } from '../data';

export default function ExportSection() {
  const { t } = useLanguage();
  const [compilingIndex, setCompilingIndex] = useState<number | null>(null);
  const [successIndex, setSuccessIndex] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const triggerExportSimulation = (index: number) => {
    if (compilingIndex !== null) return;
    
    setCompilingIndex(index);
    setSuccessIndex(null);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompilingIndex(null);
          setSuccessIndex(index);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <section id="exports" className="py-24 bg-gray-50 border-b border-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-blue-600 tracking-widest uppercase block mb-3">
            {t('exports.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans mb-4">
            {t('exports.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('exports.desc')}
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="export-categories-grid">
          {EXPORT_CATEGORIES.map((cat, index) => {
            const isCompiling = compilingIndex === index;
            const isSuccess = successIndex === index;
            
            return (
              <div
                key={cat.title}
                id={`export-col-card-${index}`}
                className="bg-white border border-gray-250 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-gray-300 shadow-sm transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded text-blue-700 font-mono text-[9px] font-bold uppercase">
                      {cat.badge}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400">Scale Lock Ready</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-sans tracking-tight mb-2">
                    {cat.title}
                  </h3>
                  
                  <div className="text-xs text-blue-600 font-medium font-sans mb-5 italic">
                    {cat.highlight}
                  </div>

                  <ul className="space-y-2.5 mb-8" id={`export-formats-list-${index}`}>
                    {cat.formats.map((fmt, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-500 font-sans font-medium">
                        <span className="p-0.5 bg-gray-150 rounded text-gray-600 font-mono text-[9px] mt-0.5 select-none shrink-0 font-bold">
                          {String(fIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-tight">{fmt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Simulated Trigger Download interaction button */}
                <div className="pt-5 border-t border-gray-150">
                  <button
                    onClick={() => triggerExportSimulation(index)}
                    id={`btn-trigger-export-${index}`}
                    className={`w-full py-2.5 rounded-lg text-xs font-sans font-semibold tracking-wide flex items-center justify-center gap-2 transition-all ${
                      isCompiling 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-not-allowed' 
                        : isSuccess
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/50'
                        : 'bg-gray-900 hover:bg-blue-600 text-white shadow-sm shadow-gray-950/5'
                    }`}
                  >
                    {isCompiling ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Compiling Pack ({downloadProgress}%) ...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600/10" />
                        <span>Bundle Ready: Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        <span>Compile Production ZIP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global technical manifest display card */}
        <div 
          className="mt-14 p-6 sm:p-8 bg-gray-900 border border-gray-800 rounded-2xl relative overflow-hidden text-gray-300"
          id="export-global-manifest"
        >
          {/* Decors */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-800 border border-gray-750 text-gray-400 font-mono text-[10px] uppercase rounded">
                <Database className="h-3.5 w-3.5" />
                Raw Data Manifest Binding (.visualos)
              </div>
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
                No screenshots. Absolute asset independence.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                When you export, you receive raw modular coordinates in JSON schemas alongside standard format SVGs. If you need to map layouts to proprietary CNC or layout machinery, you can directly pipe our structural manifests into production pipelines.
              </p>
            </div>
            <div className="md:col-span-4 bg-gray-950/80 p-5 rounded-xl border border-gray-800/85">
              <span className="text-[10px] font-mono text-gray-500 block mb-2.5">
                EXCEL_PARSED_OUTPUT_SCHEMA
              </span>
              <pre className="font-mono text-[10px] text-blue-400 leading-5 space-y-1">
                {`{
  "canvasId": "WatchFace_Dial",
  "unit": "metric",
  "gridLock": true,
  "nodesCount": 142,
  "exportSet": ["svg", "step", "bom_csv"]
}`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
