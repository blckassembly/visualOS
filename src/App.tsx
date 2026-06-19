/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AppWindow, Cpu, Layers, Download, CheckCircle, Sliders, LayoutGrid, ArrowLeft } from 'lucide-react';
import Navigation from './components/Navigation';
import CommandPaletteSimulator from './components/CommandPaletteSimulator';

export default function App() {
  const [workstationActive, setWorkstationActive] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'>('en');

  // Simple scroll routing on landing page
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'start' || sectionId === 'exports') {
      setWorkstationActive(true);
      return;
    }
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // If workstation mode is active, show the immersive full-bleed command & canvas environment
  if (workstationActive) {
    return (
      <div className="min-h-screen bg-white text-black font-sans antialiased overflow-hidden flex flex-col selection:bg-black selection:text-white">
        
        {/* Workspace Quick-exit Tool Bar */}
        <header className="h-14 border-b border-black/10 px-4 flex items-center justify-between shrink-0 bg-white font-sans select-none z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setWorkstationActive(false)}
              className="flex items-center gap-2 px-3 py-1.5 border border-black/10 hover:border-black rounded-[2px] transition-all text-xs font-medium uppercase tracking-[0.08em] hover:bg-neutral-50"
              id="workstation-exit-btn"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-black" />
              <span>Exit Workstation</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-neutral-50 border border-black/5 rounded-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-600">Active Node: Port 3000</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 border border-black rounded-[2px] text-black bg-white">
              <AppWindow className="h-3.5 w-3.5 stroke-[1.8]" />
            </div>
            <span className="font-display font-light uppercase tracking-[0.18em] text-black text-xs">
              VISUAL OS / WORKSPACE
            </span>
          </div>

          <div className="text-[10px] font-mono text-neutral-400 hidden sm:block">
            Mode: Integrated DFM & Vector Engine
          </div>
        </header>

        {/* The Central Illustrator - Command Control + Visible Canvas */}
        <main className="flex-1 min-h-0 bg-white relative">
          <CommandPaletteSimulator />
        </main>
      </div>
    );
  }

  // Otherwise, render the pristine, quiet luxury landing page
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* Elegantly styled primary navigation header bar */}
      <Navigation 
        onScrollToSection={handleScrollToSection} 
        onOpenPalette={() => setWorkstationActive(true)} 
      />

      {/* Main presentation scroll view */}
      <main className="w-full relative pt-16">
        
        {/* HERO SECTION / THE ATELIER EXHIBIT */}
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 border-b border-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Descriptive Content Column */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 border border-black/10 text-neutral-800 font-mono text-[9px] uppercase tracking-[0.18em] rounded-[2px]">
                  <Sparkles className="h-3.5 w-3.5 text-black" />
                  Atelier Generative Core v1.2
                </span>
                <h1 className="text-4xl sm:text-5xl font-light tracking-tight font-display text-black uppercase leading-[1.1]">
                  THE AI CANVAS OS FOR <br />
                  <span className="font-bold font-sans">PROMPT-TO-PRODUCT</span> <br />
                  REALIZATION.
                </h1>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed max-w-xl font-light">
                ChatGPT gets stuck in flat, non-editable pixel grids. Canva forces you through tedious layouts. 
                <strong className="text-black font-semibold"> Visual OS begins with an active, vector-compilable workspace.</strong> 
                Enter simple guidelines, and watch the AI engineer editable layers, precise bounding anchors, and structural specs right on a visible CAD canvas.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setWorkstationActive(true)}
                  className="px-6 py-3 bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white font-sans font-medium text-xs tracking-[0.18em] uppercase rounded-[2px] transition-all duration-300 flex items-center gap-2.5 border border-black"
                  id="landing-hero-cta"
                >
                  <span>Start Building</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleScrollToSection('capabilities')}
                  className="px-6 py-3 bg-white border border-black/10 hover:bg-neutral-50 text-neutral-700 hover:text-black font-sans font-medium text-xs tracking-[0.18em] uppercase rounded-[2px] transition-all duration-300"
                >
                  Explore Engines
                </button>
              </div>

              {/* Status / Footnote */}
              <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-black font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-black" />
                  DFM Class-1 Grid Lock
                </span>
                <span>|</span>
                <span>Port 3000 Sandbox Active</span>
              </div>
            </div>

            {/* Quiet, Masterfully-Drafted SVG Schematic Column */}
            <div className="lg:col-span-6 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-neutral-50/50 border border-black/10 p-8 rounded-[2px] flex flex-col justify-between relative aspect-square overflow-hidden">
                
                {/* Visual grid behind the design schematic */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
                
                {/* Header Coordinate stats */}
                <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 select-none relative z-10">
                  <span>SCALE_RATIO: 1:1 [MM]</span>
                  <span>CANV_ID: AT_AEROSPACE</span>
                </div>

                {/* Main technical drawing rendering */}
                <div className="my-auto py-6 relative z-10 flex items-center justify-center">
                  <svg viewBox="0 0 400 400" className="w-[85%] h-auto text-neutral-800" stroke="currentColor" fill="none" strokeWidth="1">
                    
                    {/* Bounding main box */}
                    <rect x="50" y="50" width="300" height="300" strokeWidth="0.8" strokeDasharray="5,5" className="stroke-neutral-300" />
                    
                    {/* Center intersection lines */}
                    <line x1="200" y1="20" x2="200" y2="380" strokeWidth="0.5" strokeDasharray="3,3" className="stroke-neutral-400" />
                    <line x1="20" y1="200" x2="380" y2="200" strokeWidth="0.5" strokeDasharray="3,3" className="stroke-neutral-400" />
                    
                    {/* Concentric precise circles */}
                    <circle cx="200" cy="200" r="110" strokeWidth="1.2" className="stroke-black" />
                    <circle cx="200" cy="200" r="85" strokeWidth="0.7" strokeDasharray="2,2" className="stroke-neutral-500" />
                    <circle cx="200" cy="200" r="45" strokeWidth="1" className="stroke-neutral-800" />
                    <circle cx="200" cy="200" r="12" strokeWidth="1.5" className="stroke-black" />

                    {/* Parametric Dimension brackets */}
                    <path d="M 90 200 L 90 150 L 310 150 L 310 200" strokeWidth="0.8" className="stroke-neutral-500" />
                    <path d="M 50 100 L 350 100" strokeWidth="0.8" className="stroke-neutral-400" />
                    
                    {/* Tiny dimension arrow markers */}
                    <polygon points="50,100 58,97 58,103" fill="currentColor" stroke="none" className="fill-neutral-400" />
                    <polygon points="350,100 342,97 342,103" fill="currentColor" stroke="none" className="fill-neutral-400" />
                    
                    {/* Text tags */}
                    <text x="200" y="90" fontFamily="monospace" fontSize="8" textAnchor="middle" letterSpacing="0.1em" className="fill-neutral-500 font-bold">DIM_LOCK: 300.00mm</text>
                    <text x="200" y="142" fontFamily="monospace" fontSize="8" textAnchor="middle" letterSpacing="0.1em" className="fill-neutral-500 font-bold">R_MAX: 110.00mm</text>
                    <text x="200" y="245" fontFamily="monospace" fontSize="9" textAnchor="middle" letterSpacing="0.15em" className="fill-black font-semibold uppercase">COPLANAR BEZIER MOUNT</text>

                    {/* Structural cross reinforcement brackets */}
                    <line x1="122" y1="122" x2="278" y2="278" strokeWidth="1" strokeDasharray="4,8" className="stroke-neutral-400" />
                    <line x1="278" y1="122" x2="122" y2="278" strokeWidth="1" strokeDasharray="4,8" className="stroke-neutral-400" />

                    {/* Precision anchor nodes */}
                    <circle cx="122" cy="122" r="3" fill="white" stroke="black" strokeWidth="1.5" />
                    <circle cx="278" cy="278" r="3" fill="white" stroke="black" strokeWidth="1.5" />
                    <circle cx="278" cy="122" r="3" fill="white" stroke="black" strokeWidth="1.5" />
                    <circle cx="122" cy="278" r="3" fill="white" stroke="black" strokeWidth="1.5" />
                    <circle cx="200" cy="90" r="2.5" fill="black" />
                    <circle cx="200" cy="310" r="2.5" fill="black" />
                  </svg>
                </div>

                {/* Footer specs details on diagram wrapper */}
                <div className="flex justify-between items-center text-[8.5px] font-mono text-neutral-400 select-none relative z-10">
                  <span>ATELIER OS V1.2.5</span>
                  <span>TOLERANCE ±0.015MM</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: THE BACK-END ENGINE ARCHITECTURES */}
        <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-black/5">
          <div className="space-y-3 mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 text-black font-mono text-[9px] uppercase tracking-[0.18em] rounded-[2px] border border-black/10">
              CORE COMPILE SERVICES
            </span>
            <h2 className="text-3xl font-light tracking-tight text-black font-display uppercase">
              ALL DESIGN ENGINES OPERATIONAL IN THE BACK END
            </h2>
            <p className="text-xs text-neutral-500 max-w-xl font-light leading-relaxed">
              No multiple disconnected screens. One core editor platform containing high-precision structural solvers, mechanical cost matrix analyzers, and coordinate visualizers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Engine 1 */}
            <div className="border border-black/10 p-6 space-y-4 rounded-[2px] hover:border-black/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-mono text-xs text-neutral-400 block font-bold">01 / PARAMETRIC VECTOR ENGINE</span>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-black">
                  Vector Path Compilation
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Generates true resolution-independent vector lines with perfect curvature calculations. Instantly editable coordinates allow immediate layout modification and path offset scaling.
                </p>
              </div>
              <div className="pt-2 font-mono text-[10px] text-neutral-400 uppercase">
                Output: CNC & Figma Ready Bezier Paths
              </div>
            </div>

            {/* Engine 2 */}
            <div className="border border-black/10 p-6 space-y-4 rounded-[2px] hover:border-black/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-mono text-xs text-neutral-400 block font-bold">02 / MECHANICAL LAYOUT LINTER</span>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-black">
                  DFM & Tolerance Audit
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  An embedded linter that scans design files for material width constraints, spacing rules, overlapping joints, and typography color contrast in real-time to avoid fabrication defects.
                </p>
              </div>
              <div className="pt-2 font-mono text-[10px] text-neutral-400 uppercase">
                Output: Manufacturing Compliance Sheet
              </div>
            </div>

            {/* Engine 3 */}
            <div className="border border-black/10 p-6 space-y-4 rounded-[2px] hover:border-black/30 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-mono text-xs text-neutral-400 block font-bold">03 / BILL OF MATERIALS INDEXER</span>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-black">
                  Dynamic Spec & Cost Matrix
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  As you construct visual forms, the system compiles direct physical volume, surface area, density parameters, item names, and material lists for live manufacturability costing.
                </p>
              </div>
              <div className="pt-2 font-mono text-[10px] text-neutral-400 uppercase">
                Output: Cost-estimation & Factory BOM PDF
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: SYSTEM WORKFLOW TIMELINE */}
        <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-black/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 text-black font-mono text-[9px] uppercase tracking-[0.18em] rounded-[2px] border border-black/10">
                PIPELINE STATUS
              </span>
              <h2 className="text-3xl font-light tracking-tight text-black font-display uppercase">
                FROM PROMPT INTENT TO SCALE-LOCKED OUTPUT.
              </h2>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Describe design intentions or drop high-level requirements. The platform breaks it down transparently and builds real functional layers inside the interactive CAD workstation. No hidden step.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1 */}
              <div className="flex gap-6 items-start pb-6 border-b border-black/5">
                <div className="p-2 border border-black rounded-[2px] text-xs font-mono font-bold shrink-0 bg-neutral-50">
                  STEP 01
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-black">Natural Language Interpretation</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    Translate raw specs ("fashion tech pack in linen", "aerospace bracket specifying titanium 4 holes") into exact mathematical requirements in real-time.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start pb-6 border-b border-black/5">
                <div className="p-2 border border-black rounded-[2px] text-xs font-mono font-bold shrink-0 bg-neutral-50">
                  STEP 02
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-black">Interactive Layer Decomposition</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    Create independent nodes for typography parameters, dimension locks, force-aligned guidelines, and outline layers inside the visible workspace.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="p-2 border border-black rounded-[2px] text-xs font-mono font-bold shrink-0 bg-neutral-50">
                  STEP 03
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-black">Universal CAD Export Package</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    Compile final, scale-locked vector designs, parts checklists, specification manifests, and materials bills inside a structured digital folder.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: ENERGETIC CENTRAL CALL TO ACTION */}
        <section id="start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-bold block mb-2">
              [ DIRECT FACTORY CAD KERNEL PROVISIONED ]
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight font-display text-black uppercase leading-tight">
              LAUNCH YOUR ATELIER WORKSPACE
            </h2>
            <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
              Open the interactive illustrator canvas. Command-line speed meets high-tolerance vector compilation.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setWorkstationActive(true)}
                className="inline-flex items-center gap-3 bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white font-sans font-medium text-xs tracking-[0.18em] uppercase px-8 py-4 border border-black transition-all duration-300 ease-out"
                id="landing-bottom-cta"
              >
                <span>Enter Workstation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-neutral-50 border-t border-black/10 py-12 text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-light uppercase tracking-[0.18em] text-black text-sm">
              VISUAL OS
            </span>
            <span className="text-black/10">|</span>
            <span className="text-neutral-400 tracking-wider">ATELIER ENGINE V1.2.5</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-wider">
            <span className="flex items-center gap-1.5 text-black font-semibold uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-black" />
              <span>APACHE-2.0 SYSTEM COMPLIANT</span>
            </span>
            <span className="text-black/10">|</span>
            <span className="text-neutral-400 uppercase font-semibold">ALL ENGINES CO-RESIDENT SECURELY</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
