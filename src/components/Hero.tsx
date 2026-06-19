/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Maximize2, 
  Grid, 
  Command, 
  Cpu, 
  FileText, 
  Scale, 
  ChevronRight,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { PRESET_CANVASES } from '../data';
import { PresetCanvas, CanvasElement } from '../types';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
  onSetSimulationCommand?: (command: string) => void;
}

export default function Hero({ onScrollToSection, onSetSimulationCommand }: HeroProps) {
  const { t } = useLanguage();
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePreset = PRESET_CANVASES[activePresetIndex];
  
  // Custom prompt input state
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  
  // Highlighting/interactive states on mock workspace
  const [activeElementId, setActiveElementId] = useState<string | null>('1');
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});
  const [selectedLayoutTheme, setSelectedLayoutTheme] = useState<'blueprint' | 'wireframe' | 'solid'>('blueprint');
  
  // Generation simulation sequence
  const handleSimulateGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = customPrompt.trim() || 'Create customized aerospace hardware clamp with carbon specs';
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationLogs(['[INIT] Initiating Canvas Context Kernel...', '[PARSING] Applying brand guidelines Outfit & Fira Code...']);
    
    setTimeout(() => {
      setGenerationStep(2);
      setGenerationLogs(prev => [...prev, '[VECTOR] Computing parametric vector outlines...', '[CALCULATING] Applying 1:1 scale locked grids...']);
    }, 1000);

    setTimeout(() => {
      setGenerationStep(3);
      setGenerationLogs(prev => [...prev, '[COMPILER] Assembling DFM thresholds...', '[EXPORT] Building structured target ZIP containing BOM, CAD...']);
    }, 2000);

    setTimeout(() => {
      setIsGenerating(false);
      setCustomPrompt('');
      // Cycle to direct customized render showing aerospace model
      const customPreset: PresetCanvas = {
        id: 'aerospace',
        name: 'Aerospace Hardware Clamp Specs',
        category: 'Custom Industrial Prompt',
        promptExample: promptText,
        dimensions: 'Scale 2:1 | High-Tolerance Titanium',
        layers: ['Force Distribution Vectors', 'Mount Hole Offsets', 'Clamp Tolerance Sheet', 'Hardware Part Specification', 'BOM Manifest'],
        bomItems: ['Titanium class 5 clamp core', 'Carbon fiber lock bolts (2)', 'Anodized high-wear backing ring', 'Sealing gasket silicone (1)'],
        dfmChecks: [
          { label: 'Force vectors alignment', pass: true },
          { label: 'Bolt clearance audit', pass: true },
          { label: 'Minimum wall width (>1.2mm)', pass: true }
        ],
        elements: [
          { id: 'custom-1', type: 'vector', x: 40, y: 35, width: 200, height: 130, label: 'Parametric Titanium Clamp Body', color: 'border-blue-500 bg-blue-50/20' },
          { id: 'custom-2', type: 'vector', x: 90, y: 65, width: 40, height: 40, label: 'Bore Clearance Ring', color: 'border-amber-500 bg-amber-500/10' },
          { id: 'custom-3', type: 'dimension', x: 40, y: 175, width: 200, height: 15, label: 'Precision Lock: 124.50mm' },
          { id: 'custom-4', type: 'text', x: 100, y: 110, width: 120, height: 40, label: 'Titanium Anodized Specification' }
        ]
      };
      
      // Inject this as active preset
      PRESET_CANVASES[activePresetIndex] = customPreset;
      // Triggers component update
      setActivePresetIndex(activePresetIndex);
    }, 3200);
  };

  const toggleLayerVisibility = (layer: string) => {
    setHiddenLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <section id="hero" className="relative pt-24 pb-20 bg-gray-50/50 overflow-hidden border-b border-gray-250/30">
      {/* Background blueprint grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4.5xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-mono text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('hero.badge')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-6 font-sans">
            {t('hero.title1')} <br />
            <span className="text-blue-600 bg-clip-text">{t('hero.title2')}</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onScrollToSection('commands')}
              className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-sans font-bold text-sm tracking-wide hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-blue-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              id="hero-primary-cta"
            >
              <span>{t('hero.cta.start')}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => onScrollToSection('workflow')}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-sans font-bold text-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 hover:border-gray-300"
              id="hero-secondary-cta"
            >
              <Play className="h-4 w-4 text-blue-600 fill-blue-600/30" />
              <span>{t('hero.cta.workflow')}</span>
            </button>
          </div>
        </div>

        {/* Live Prompt Simulation bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <form 
            onSubmit={handleSimulateGeneration}
            className="p-1 px-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/40 flex items-center gap-2 relative"
            id="hero-prompt-form"
          >
            <div className="flex items-center gap-2 text-gray-400 pl-3.5 flex-1 min-w-0">
              <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
              <input 
                type="text" 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={activePreset.promptExample}
                className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-0 py-2.5"
                disabled={isGenerating}
                id="hero-prompt-input"
              />
            </div>
            
            <button
              type="submit"
              disabled={isGenerating}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
                isGenerating 
                  ? 'bg-blue-100 text-blue-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
              id="hero-generate-btn"
            >
              {isGenerating ? (
                <>
                  <div className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Compile Canvas</span>
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>

            {/* Simulated Live Compiler Trace Terminal */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2.5 bg-gray-900 border border-gray-800 text-gray-250 p-4 rounded-xl font-mono text-xs shadow-2xl z-20"
                  id="hero-compile-logs"
                >
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                    <span className="text-blue-400 font-bold flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 animate-pulse" />
                      VisualOS Compiler Kern v2.4
                    </span>
                    <span className="text-[10px] text-gray-500">Live Trace</span>
                  </div>
                  <div className="space-y-1.5 font-light">
                    {generationLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 text-gray-300">
                        <span className="text-blue-500 font-medium">❯</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {generationStep < 3 && (
                      <div className="flex items-center gap-1.5 text-gray-500 animate-pulse mt-1">
                        <span>■ Compiling design rules...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-gray-400">
            <span>Or select design presets:</span>
            <div className="flex gap-1.5" id="hero-industry-selector">
              {PRESET_CANVASES.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePresetIndex(idx)}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-sans transition-all ${
                    idx === activePresetIndex
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'
                  }`}
                  id={`preset-tab-${p.id}`}
                >
                  {p.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unified Application Environment Frame */}
        <div 
          className="bg-white border border-gray-250 rounded-2xl shadow-2xl overflow-hidden max-w-7xl mx-auto flex flex-col h-[700px] relative"
          id="visualos-system-canvas"
        >
          {/* OS Titlebar Header */}
          <div className="bg-gray-900 text-white px-4 h-12 flex items-center justify-between border-b border-gray-800 text-xs font-sans shrink-0">
            <div className="flex items-center gap-4">
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-gray-400 border-l border-gray-800 pl-4 font-mono select-none">
                workspace://{activePreset.id}-kernel-sheet
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-[10px] font-mono text-white tracking-wider font-semibold">
                {activePreset.category.toUpperCase()}
              </span>
              <div className="flex items-center gap-2 text-gray-400 px-2 py-1 bg-gray-800 rounded">
                <Grid className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px]">60FPS Grid Lock</span>
              </div>
            </div>
          </div>

          {/* OS Environment Canvas Body Components Split */}
          <div className="flex flex-1 min-h-0 relative">
            
            {/* 1. Left Sidebar: Layer Manager */}
            <div className="w-64 border-r border-gray-250 bg-gray-50 flex flex-col shrink-0 select-none">
              <div className="p-3 border-b border-gray-200/80 bg-white flex items-center justify-between text-xs font-semibold text-gray-700">
                <span className="flex items-center gap-1.5 font-sans">
                  <Layers className="h-4 w-4 text-blue-600" />
                  Layer Manager
                </span>
                <span className="font-mono text-[10px] text-gray-400 px-1 bg-gray-100 rounded">
                  {activePreset.layers.length} Active
                </span>
              </div>
              <div className="p-2 space-y-1 overflow-y-auto flex-1">
                {activePreset.layers.map((layer, index) => {
                  const isHidden = !!hiddenLayers[layer];
                  return (
                    <div 
                      key={layer}
                      onClick={() => toggleLayerVisibility(layer)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isHidden 
                          ? 'border-dashed border-gray-300 bg-gray-100/40 opacity-45 text-gray-400' 
                          : 'border-white bg-white hover:border-gray-300 shadow-sm text-gray-800 hover:shadow'
                      }`}
                      id={`workspace-layer-${index}`}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <span className="font-mono text-[10px] text-gray-400">#{index+1}</span>
                        <span>{layer}</span>
                      </div>
                      <span className="font-mono text-[9px] text-blue-500 uppercase font-bold">
                        {isHidden ? 'Hidden' : 'Vector'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Theme Settings controller */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide mb-2 font-mono">Render View Theme</span>
                <div className="grid grid-cols-3 gap-1" id="render-theme-tabs">
                  {(['blueprint', 'wireframe', 'solid'] as const).map(th => (
                    <button
                      key={th}
                      onClick={() => setSelectedLayoutTheme(th)}
                      className={`px-1 py-1.5 border rounded text-[10px] font-semibold capitalize transition-all ${
                        selectedLayoutTheme === th
                          ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Central Component: Dynamic Layout Canvas Work Area */}
            <div className="flex-1 bg-white relative flex flex-col min-w-0 transition-colors duration-300 overflow-hidden">
              {/* Inner Scale & Dimension locks stats bar */}
              <div className="h-9 border-b border-gray-100 px-4 bg-gray-50/50 flex items-center justify-between text-xs font-mono select-none shrink-0">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  Scale Metric: <span className="text-gray-900 font-bold">{activePreset.dimensions}</span>
                </span>
                <div className="flex gap-4 text-gray-400 text-[11px]">
                  <span>Origin: 0,0</span>
                  <span>Unit: mm</span>
                  <span>Snap Offset: 4px</span>
                </div>
              </div>

              {/* Actual interactive vector workspace simulation sheet */}
              <div 
                className={`flex-1 relative p-8 flex items-center justify-center overflow-auto ${
                  selectedLayoutTheme === 'blueprint' 
                    ? 'bg-blue-50/20 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] [background-size:16px_16px]' 
                    : selectedLayoutTheme === 'wireframe'
                    ? 'bg-gray-50 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:16px_16px]'
                    : 'bg-white'
                }`}
                id="interactive-canvas-vport"
              >
                {/* Simulated Canvas bounding box */}
                <div className="w-[480px] h-[340px] bg-white border-2 border-gray-900 rounded-xl shadow-lg relative p-4 flex flex-col justify-between shrink-0">
                  {/* Absolute positioning of generated nodes */}
                  <div className="absolute top-2.5 left-3 text-[10px] font-mono text-gray-400 font-bold">
                    [ CANVAS FRAME NODE ]
                  </div>
                  <div className="absolute top-2.5 right-3 text-[10px] font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                    Lock State: Active
                  </div>
                  
                  {/* Grid element renders based on active preset */}
                  <div className="relative w-full h-full pt-6 flex flex-col justify-center">
                    {activePreset.elements.map((el) => {
                      const isLayerHidden = activePreset.layers.some((lay, idx) => {
                        // Check if parent block index has layer configuration hidden
                        if (el.type === 'dimension' && idx === 3 && hiddenLayers[lay]) return true;
                        if (el.type === 'text' && idx === 4 && hiddenLayers[lay]) return true;
                        if (el.type === 'vector' && idx < 2 && hiddenLayers[lay]) return true;
                        return false;
                      });

                      if (isLayerHidden) return null;

                      const isSelected = activeElementId === el.id;

                      return (
                        <div
                          key={el.id}
                          onClick={() => setActiveElementId(el.id)}
                          style={{
                            left: `${el.x}px`,
                            top: `${el.y}px`,
                            width: `${el.width}px`,
                            height: `${el.height}px`,
                            position: 'absolute'
                          }}
                          className={`border rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all ${
                            el.color || 'border-gray-800 bg-white'
                          } ${
                            isSelected 
                              ? 'ring-2 ring-blue-600 ring-offset-2 scale-[1.01]' 
                              : 'hover:border-blue-400'
                          }`}
                          id={`canvas-node-${el.id}`}
                        >
                          {/* Anchor point specs */}
                          {isSelected && (
                            <>
                              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white" />
                              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white" />
                              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white" />
                              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white" />
                            </>
                          )}

                          <div className="flex items-center justify-between">
                            <span className={`font-mono text-[9px] uppercase font-bold tracking-wider ${
                              isSelected ? 'text-blue-600' : 'text-gray-400'
                            }`}>
                              [{el.type.toUpperCase()}]
                            </span>
                            <span className="font-mono text-[8px] text-gray-500">
                              {el.width}x{el.height}
                            </span>
                          </div>

                          <div className="flex-1 flex items-center justify-center py-1">
                            <span className="font-sans font-semibold text-[11px] text-gray-800 text-center leading-tight">
                              {el.label}
                            </span>
                          </div>

                          <span className="font-mono text-[8px] text-right text-gray-400 block">
                            id: {el.id}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Corner bounds display overlay */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                    <span>X: 00 | Y: 00</span>
                    <span>VisualOS CAD Core v1.1</span>
                  </div>
                </div>

                {/* Live element property floating overlay card */}
                {activeElementId && (
                  <div className="absolute top-4 right-4 bg-gray-900 border border-gray-800 text-white p-3 rounded-lg w-52 text-[11px] space-y-2 font-mono shadow-xl select-none z-10 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-1.5 text-blue-400 font-bold">
                      <span>Node Properties</span>
                      <button 
                        onClick={() => setActiveElementId(null)}
                        className="text-gray-500 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    {(() => {
                      const selectedEl = activePreset.elements.find(e => e.id === activeElementId);
                      if (!selectedEl) return <div>No selection</div>;
                      return (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ID:</span>
                            <span className="text-gray-300">{selectedEl.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Class:</span>
                            <span className="text-gray-300 font-bold capitalize">{selectedEl.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tag:</span>
                            <span className="text-gray-300 truncate max-w-[120px]">{selectedEl.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Coord:</span>
                            <span className="text-blue-400">X:{selectedEl.x} Y:{selectedEl.y}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">W/H mm:</span>
                            <span className="text-gray-300">{selectedEl.width} * {selectedEl.height}</span>
                          </div>
                          <div className="border-t border-gray-800 pt-1.5 mt-1 text-[10px] text-gray-400 italic">
                            Double click to change vector anchor nodes
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Fast Simulated Command trigger rail at bottom of canvas */}
              <div className="h-10 border-t border-gray-200 px-4 bg-white flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Shell ready for prompt</span>
                </div>
                <button 
                  onClick={() => onScrollToSection('commands')} 
                  className="text-xs text-blue-600 font-sans hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Open Interactive shell simulator</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* 3. Right Sidebar: DFM Validation + Bill of Materials (BOM) */}
            <div className="w-72 border-l border-gray-250 bg-gray-50 flex flex-col shrink-0 select-none">
              
              {/* Product Info & Specifications Sheet Node */}
              <div className="p-4 border-b border-gray-250 bg-white">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide mb-1 font-mono">Product Sheet Metadata</span>
                <h4 className="font-semibold text-gray-900 text-sm truncate font-sans tracking-tight mb-2">
                  {activePreset.name}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-1 px-2 border border-gray-200/80 bg-gray-50 rounded">
                    <span className="text-gray-400 block text-[9px]">COMPLEXITY</span>
                    <span className="text-gray-800 font-bold">14 Shapes</span>
                  </div>
                  <div className="p-1 px-2 border border-gray-200/80 bg-gray-50 rounded">
                    <span className="text-gray-400 block text-[9px]">TOLERANCE</span>
                    <span className="text-gray-800 font-bold">±0.04mm</span>
                  </div>
                </div>
              </div>

              {/* Industrial BOM (Bill of Materials) Grid */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-3 border-b border-gray-200/80 flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50">
                  <span className="flex items-center gap-1.5 font-sans">
                    <Database className="h-3.5 w-3.5 text-blue-600" />
                    Bill of Materials (BOM)
                  </span>
                  <span className="font-mono text-[9px] text-gray-400">
                    Realtime Compilation
                  </span>
                </div>
                <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
                  {activePreset.bomItems.map((item, index) => (
                    <div 
                      key={item}
                      className="p-2 border border-gray-150 rounded-lg bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all text-[11px] flex items-start gap-1.5"
                    >
                      <span className="font-mono bg-gray-200 text-gray-600 px-1 rounded text-[9px] mt-0.5 select-none shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-800 font-medium block truncate leading-tight">
                          {item}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Mat: High Class Alloy / Fiber
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DFM Audit Checkbox verification card */}
              <div className="p-4 border-t border-gray-250 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide font-mono">DFM Callout Checks</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-mono font-bold">
                    CAD Linter
                  </span>
                </div>
                <div className="space-y-1.5">
                  {activePreset.dfmChecks.map((chk, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px]"
                    >
                      <span className="text-gray-700 truncate max-w-[150px] font-sans font-medium">
                        {chk.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {chk.pass ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
                        )}
                        <span className={`font-mono text-[9px] font-bold uppercase ${
                          chk.pass ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {chk.pass ? 'Pass' : 'Fix Needed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* OS Environment Canvas Bar: Footer Stats summary */}
          <div className="h-10 bg-gray-900 border-t border-gray-800 text-gray-400 px-4 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
            <div className="flex items-center gap-4">
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Durable Session Active
              </span>
              <span>Coordinates Ref: Absolute System</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span>Layers Out: {activePreset.layers.length} parsed</span>
              <span className="text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-sans transition-all" onClick={() => onScrollToSection('exports')}>
                <Download className="h-3.5 w-3.5" />
                <span>Export Package</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
