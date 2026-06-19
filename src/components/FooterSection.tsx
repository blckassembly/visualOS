/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AppWindow, 
  ArrowRight, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

interface FooterSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function FooterSection({ onScrollToSection }: FooterSectionProps) {
  // Current UTC date/time or general metadata as subtle visual accent
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 font-sans select-none" id="footer-section">
      
      {/* Final CTA Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
        {/* Decorative ambient blueprint grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15 pointer-events-none" />

        <div className="relative z-10 text-center max-w-4.5xl mx-auto border border-gray-800 bg-gray-950/80 p-8 sm:p-14 rounded-3xl space-y-6 shadow-2xl">
          <span className="font-mono text-xs font-bold text-blue-400 tracking-widest uppercase block">
            DEPLOY WITH CONFIDENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans leading-tight">
            Start with a canvas. <br />Leave with a production package.
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
            VisualOS helps founders, designers, engineers, architects, fashion teams, and manufacturers move from idea to editable file to prototype-ready handoff.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onScrollToSection('hero')}
              id="final-cta-btn"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-sans font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <span>Build in VisualOS</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="pt-8 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-center font-mono text-[11px] text-gray-500">
            <div className="flex flex-col items-center">
              <span className="font-bold text-white text-sm">NO CAPTURE</span>
              <span className="mt-1">No video overlays</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-white text-sm">RAW VECTOR</span>
              <span className="mt-1">No flat bitmap locks</span>
            </div>
            <div className="flex flex-col items-center col-span-2 sm:col-span-1">
              <span className="font-bold text-white text-sm">100% EXPLICIT</span>
              <span className="mt-1">No hidden workflows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Footer Section Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <AppWindow className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans font-extrabold text-white text-base tracking-tight">
                VisualOS
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed font-sans">
              AI-first canvas operating system for design-to-manufacturing. Convert prompts and static references into editable vector packages instantly.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="font-mono font-bold text-white block mb-3.5 uppercase tracking-wider text-[10px]">Product</span>
              <ul className="space-y-2 text-gray-500">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('hero')}>Workspace Canvas</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('modules')}>Bento Engines</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('commands')}>Shell Terminal</li>
              </ul>
            </div>
            <div>
              <span className="font-mono font-bold text-white block mb-3.5 uppercase tracking-wider text-[10px]">Resources</span>
              <ul className="space-y-2 text-gray-500">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('usecases')}>Use Cases List</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('quality')}>QC Audit Board</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('exports')}>Export Packages</li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="font-mono font-bold text-white block mb-3.5 uppercase tracking-wider text-[10px]">Constraints</span>
              <p className="text-gray-500 text-[11px] leading-relaxed font-sans italic">
                No video. No flat files. No hidden workflow. Powered by absolute vector coordinate geometry.
              </p>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-mono gap-4">
          <span>&copy; {year} VisualOS Kernel Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Primary Node online
            </span>
            <span>Tolerances Verified: ±0.04mm</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
