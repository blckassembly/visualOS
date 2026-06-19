import React, { useState } from 'react';
import { 
  Sparkles, Layers, Box, Maximize2, RotateCcw, 
  Trash2, Plus, Sliders, CheckSquare, Settings, Download
} from 'lucide-react';
import { BrandKit } from './CommandPaletteSimulator';

interface IndustrialDesignTabProps {
  activeBrandKit?: BrandKit;
  logTrace: (message: string) => void;
}

export default function IndustrialDesignTab({ activeBrandKit, logTrace }: IndustrialDesignTabProps) {
  // Option lists
  const productTypes = [
    'Laptop', 'Charger', 'Furniture', 'Appliance', 
    'Vehicle concept', 'Robotics housing', 'Consumer product', 
    'Tool', 'Packaging', 'Hardware enclosure'
  ];

  const shapeLanguages = [
    'Rounded Organic (Fluid, natural curvature)',
    'Brutalist Blocky (Extruded monoliths, sharp edges)',
    'Chamfered Hexagonal (Precision double bevels)',
    'Sleek Streamlined (Aero-optimized sleek vectors)'
  ];

  const ventStyles = ['Honeycomb Matrix', 'Linear Louvers', 'Slotted Radial Outflow'];
  const handleStyles = ['Flush Integrated Recess', 'Surface Mounted Arch', 'Modular Heavy-Duty Extrusion'];
  const fastenerTypes = ['Torx T6 Security Star', 'Hex Socket Bolt', 'Flat Flush Rivets', 'Philips Machine Screws'];
  const portTypes = ['USB-C SuperSpeed+', 'HDMI 2.1 video port', 'AC Power Outlet (IEC)', 'TRS 3.5mm Jack'];

  // Main State Engine
  const [productType, setProductType] = useState<string>('Robotics housing');
  const [shapeLanguage, setShapeLanguage] = useState<string>(shapeLanguages[0]); // Rounded Organic
  const [panelLinesCount, setPanelLinesCount] = useState<number>(4);
  const [seamsCount, setSeamsCount] = useState<number>(2);
  const [ventStyle, setVentStyle] = useState<string>('Linear Louvers');
  const [ventSize, setVentSize] = useState<number>(3); // level 1-5
  const [handlePosition, setHandlePosition] = useState<string>('Top Centered Ridge');
  const [handleStyle, setHandleStyle] = useState<string>('Flush Integrated Recess');
  const [portsList, setPortsList] = useState<{id: string; type: string; y: number}[]>([
    { id: 'p1', type: 'USB-C SuperSpeed+', y: 40 },
    { id: 'p2', type: 'AC Power Outlet (IEC)', y: 70 }
  ]);
  const [fastenersType, setFastenersType] = useState<string>('Torx T6 Security Star');
  const [fastenerCount, setFastenerCount] = useState<number>(6);
  
  const [materialZones, setMaterialZones] = useState<{id: string; zone: string; material: string}[]>([
    { id: 'z1', zone: 'Primary Structural Case Shell', material: 'Reinforced Carbon ABS Blend Resin' },
    { id: 'z2', zone: 'Peripheral Impact Dampeners', material: 'Durometer 60 Elastomeric TPE' }
  ]);

  const [explodedView, setExplodedView] = useState<boolean>(false);
  const [showCalloutSheet, setShowCalloutSheet] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Quick inputs
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneMaterial, setNewZoneMaterial] = useState('');
  const [newPortType, setNewPortType] = useState('USB-C SuperSpeed+');

  // Trigger Action calls
  const createIndustrialSketch = (pType: string, lang: string) => {
    logTrace(`[INDUSTRIAL ENGINE] createIndustrialSketch: Creating standard outline sketch for: "${pType}" styling on "${lang}" shape guidelines.`);
    setProductType(pType);
    setShapeLanguage(lang);
    setPanelLinesCount(Math.floor(Math.random() * 5) + 3);
    setSeamsCount(Math.floor(Math.random() * 3) + 1);
    setExplodedView(false);
    logTrace(`[INDUSTRIAL ENGINE] Initial CAD constraints generated. Outline, form vectors, and isometric alignment parameters loaded.`);
  };

  const handleSetShapeLanguage = (lang: string) => {
    setShapeLanguage(lang);
    logTrace(`[INDUSTRIAL ENGINE] setShapeLanguage: Adjusting bezier curvature and anchor profiles to conform to: "${lang}" template rules.`);
  };

  const adjustPanelLines = (count: number) => {
    setPanelLinesCount(count);
    logTrace(`[INDUSTRIAL ENGINE] addPanelLines: Redrawing sheet vector coordinates to project ${count} distinct panel split lines.`);
  };

  const adjustSeams = (count: number) => {
    setSeamsCount(count);
    logTrace(`[INDUSTRIAL ENGINE] addSeams: Split tooling paths allocated to support ${count} distinct assembly interface gaps.`);
  };

  const updateVents = (style: string, size: number) => {
    setVentStyle(style);
    setVentSize(size);
    logTrace(`[INDUSTRIAL ENGINE] addVents: Calculated airflow dynamics matching pattern "${style}" at magnitude scale level ${size}/5.`);
  };

  const updateHandle = (style: string, pos: string) => {
    setHandleStyle(style);
    setHandlePosition(pos);
    logTrace(`[INDUSTRIAL ENGINE] addHandles: Fixed structural handle attachment point at "${pos}" using format "${style}".`);
  };

  const addPortItem = (type: string) => {
    const nPort = {
      id: `p_${Date.now().toString().slice(-4)}`,
      type,
      y: Math.floor(Math.random() * 60) + 20
    };
    setPortsList(prev => [...prev, nPort]);
    logTrace(`[INDUSTRIAL ENGINE] addPorts: Provisioned functional interface node: ${type} connector.`);
  };

  const updateFastenerProfile = (type: string, count: number) => {
    setFastenersType(type);
    setFastenerCount(count);
    logTrace(`[INDUSTRIAL ENGINE] addFasteners: Configured mounting points with ${count} thread locations utilizing "${type}" hardware.`);
  };

  const registerMaterialZone = (zone: string, material: string) => {
    if (!zone || !material) return;
    const nZone = {
      id: `z_${Date.now().toString().slice(-4)}`,
      zone,
      material
    };
    setMaterialZones(prev => [...prev, nZone]);
    logTrace(`[INDUSTRIAL ENGINE] addMaterialZones: Assigned "${material}" surface parameters to regional zone: "${zone}".`);
  };

  const triggerExplodedView = () => {
    setExplodedView(prev => !prev);
    logTrace(`[INDUSTRIAL ENGINE] createExplodedView: Workspace rendering state set to ${!explodedView ? 'EXPLODED ASSEMBLY breakdown' : 'COMPOSITE SOLID product sketch'}.`);
  };

  const triggerCalloutSheet = () => {
    setShowCalloutSheet(prev => !prev);
    logTrace(`[INDUSTRIAL ENGINE] createCalloutSheet: Visualizing index of annotated tags directly mapped onto the structural drafting sheet.`);
  };

  const exportIndustrialDossier = (format: 'svg' | 'png' | 'json') => {
    setIsExporting(true);
    logTrace(`[INDUSTRIAL EXPORTER] Compiling professional layered vectors and technical blueprints format: .${format.toUpperCase()}`);

    const payload = {
      identifier: 'VisualOS_Industrial_Design_CAD_Engine_v1',
      productType,
      visualFormLanguage: shapeLanguage,
      parameters: {
        panelLines: panelLinesCount,
        assemblySeams: seamsCount,
        fasteners: {
          style: fastenersType,
          quantity: fastenerCount
        },
        airflowVents: {
          pattern: ventStyle,
          scaleLevel: ventSize
        },
        transportHandle: {
          location: handlePosition,
          mechanism: handleStyle
        },
        materialAssignments: materialZones,
        ioTerminals: portsList
      },
      assemblyState: explodedView ? 'Exploded Bracket Breakdown' : 'Assembled Housing'
    };

    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataString);
    downloadAnchor.setAttribute("download", `industrial_sketch_${productType.toLowerCase().replace(/\s+/g, '_')}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setTimeout(() => {
      setIsExporting(false);
      logTrace(`[INDUSTRIAL EXPORTER] CAD file export operations finalized.`);
    }, 1200);
  };

  const primaryColor = activeBrandKit?.colors?.primary || '#2563eb';
  const accentColor = activeBrandKit?.colors?.accent || '#38bdf8';

  return (
    <div className="bg-gray-50 border border-gray-255 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn text-xs">
      
      {/* Tab Heading */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-violet-600 block tracking-widest leading-none">Modeling System</span>
          <h3 className="text-sm font-extrabold text-slate-800 font-sans mt-0.5">Industrial Design Engine</h3>
        </div>
        <span className="px-1.5 py-0.5 bg-violet-50 border border-violet-200 text-violet-600 font-mono text-[9px] font-bold rounded uppercase">
          ONLINE
        </span>
      </div>

      {/* Sketch parameters configurator panels */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Outline Form Core Controls */}
        <div className="bg-white border rounded-3xl p-4 space-y-3.5 shadow-2xs">
          <span className="block text-[10px] font-mono font-bold text-gray-550 uppercase border-b pb-1">
            1. Form Language Parameters
          </span>

          <div className="space-y-3">
            <div>
              <label className="block text-[9.5px] text-gray-400 font-mono uppercase mb-0.5">Target Product Category</label>
              <select
                value={productType}
                onChange={(e) => createIndustrialSketch(e.target.value, shapeLanguage)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[9.5px] text-gray-400 font-mono uppercase mb-0.5">Primary Geometric Form Language</label>
              <select
                value={shapeLanguage}
                onChange={(e) => handleSetShapeLanguage(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                {shapeLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="block text-[9px] text-gray-400 font-mono mb-0.5">Panel Split Lines ({panelLinesCount})</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={panelLinesCount}
                  onChange={(e) => adjustPanelLines(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-mono mb-0.5">Seams Gap Clearance ({seamsCount})</label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={seamsCount}
                  onChange={(e) => adjustSeams(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Functional details configurations */}
        <div className="bg-white border rounded-3xl p-4 space-y-3.5 shadow-2xs">
          <span className="block text-[10px] font-mono font-bold text-gray-550 uppercase border-b pb-1">
            2. Functional Details Solvers
          </span>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] text-gray-400 font-mono uppercase mb-0.5">Air Vents Spec</label>
                <select
                  value={ventStyle}
                  onChange={(e) => updateVents(e.target.value, ventSize)}
                  className="w-full p-1.5 bg-gray-50 border text-[11px] rounded-lg"
                >
                  {ventStyles.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-mono uppercase mb-0.5">Vent Grid Scale</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ventSize}
                  onChange={(e) => updateVents(ventStyle, Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-violet-600 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t pt-2">
              <div>
                <label className="block text-[9px] text-gray-400 font-mono uppercase mb-0.5">Assembly Fastener</label>
                <select
                  value={fastenersType}
                  onChange={(e) => updateFastenerProfile(e.target.value, fastenerCount)}
                  className="w-full p-1.5 bg-gray-50 border text-[11px] rounded-lg"
                >
                  {fastenerTypes.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-mono uppercase mb-0.5">Screw Points Count</label>
                <select
                  value={fastenerCount}
                  onChange={(e) => updateFastenerProfile(fastenersType, Number(e.target.value))}
                  className="w-full p-1.5 bg-gray-50 border text-[11px] rounded-lg"
                >
                  {[2, 4, 6, 8, 12].map(c => <option key={c} value={c}>{c} Anchor Nodes</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Assembly Mode Action Bar (Exploded Assembly triggers) */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={triggerExplodedView}
          className={`flex-1 py-2 px-4 rounded-xl font-bold uppercase text-[10.5px] flex items-center justify-center gap-1.5 shadow-sm transition border ${
            explodedView 
              ? 'bg-amber-650 border-amber-700 text-white' 
              : 'bg-white hover:bg-slate-50 text-slate-705 border-gray-205'
          }`}
        >
          <Box className={`h-4 w-4 ${explodedView ? 'animate-spin' : ''}`} />
          <span>Toggle Assembly Exploded View: {explodedView ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={triggerCalloutSheet}
          className={`px-4 py-2 rounded-xl font-bold uppercase text-[10.5px] border flex items-center justify-center gap-1.5 ${
            showCalloutSheet ? 'bg-violet-50 text-violet-750 border-violet-200' : 'bg-white hover:bg-slate-50 text-slate-600 border-gray-200'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          <span>Technical Annotations Ledger</span>
        </button>
      </div>

      {/* Drafting Board Viewport Canvas */}
      <div className="bg-slate-900 border border-slate-950 p-4 rounded-3xl space-y-4 shadow-inner relative overflow-hidden min-h-[340px] flex flex-col justify-between text-slate-300">
        
        {/* CAD drafting grids and crosshair overlay patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1.1px,transparent_1.1px)] bg-[size:14px_14px] pointer-events-none" />
        <div className="absolute top-2 right-2 border border-white/5 bg-black/40 text-[8px] px-1.5 py-0.5 rounded font-mono text-violet-400">
          PRO-ID: {productType.toUpperCase().slice(0, 8)} // GRID SNAPPING FIXED
        </div>

        {/* Technical title block markup */}
        <div className="border-b border-white/10 pb-2 flex justify-between items-center relative z-10 font-mono text-[9px]">
          <div>
            <span className="text-violet-400 font-bold block">// DESIGN ENGINE RENDER SEED</span>
            <span className="text-white font-extrabold text-[12px] font-sans block">{productType}</span>
          </div>
          <div className="text-right text-gray-505 leading-tight">
            <div>STYLE: {shapeLanguage.split(' (')[0]}</div>
            <div>SHIELD_LOCK: ONLINE</div>
          </div>
        </div>

        {/* Dynamic Canvas drawing based on details State values */}
        <div className="flex-1 flex items-center justify-center relative my-6 min-h-[160px]">
          
          {explodedView ? (
            /* EXPLODED VIEW RENDER BLUEPRINT - Stack of separated layer geometries with connection line traces */
            <svg className="w-full max-w-[280px] h-[180px] overflow-visible" viewBox="0 0 100 100">
              {/* Vertical dotted connection axis path */}
              <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" strokeDasharray="3,3" />

              {/* Layer 1: Top Enclosure Shell Shield */}
              <g transform="translate(0, -25)">
                <path d="M25,35 Q50,25 75,35 L70,42 Q50,34 30,42 Z" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="0.8" />
                <text x="50" y="22" textAnchor="middle" fill="#818cf8" fontSize="4.5" fontFamily="monospace">1. TOP HOUSING SHELL</text>
                {/* Vent lines drawn on surface top layer */}
                {ventStyle === 'Linear Louvers' && (
                  <path d="M42,32 L58,32 M40,34 L60,34" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
                )}
              </g>

              {/* Layer 2: Core PCB Board and functional mounting hubs */}
              <g transform="translate(0, 0)">
                <rect x="28" y="44" width="44" height="6" rx="1.2" fill="rgba(16,185,129,0.3)" stroke="#10b981" strokeWidth="0.8" />
                <circle cx="36" cy="47" r="2" fill="#fff" />
                <circle cx="64" cy="47" r="2.5" fill="#38bdf8" />
                <text x="50" y="39" textAnchor="middle" fill="#34d399" fontSize="4.5" fontFamily="monospace">2. ACTIVE PCB INTERFACES</text>
                {/* Port attachments indicated */}
                {portsList.map((p, i) => (
                  <line key={p.id} x1={32 + (i*26)} y1="50" x2={32 + (i*26)} y2="54" stroke="#f43f5e" strokeWidth="0.8" />
                ))}
              </g>

              {/* Layer 3: Struct Plate Frame, ports base, and fasteners lines */}
              <g transform="translate(0, 25)">
                <path d="M22,55 L78,55 L74,63 L26,63 Z" fill="rgba(71,85,105,0.4)" stroke="#94a3b8" strokeWidth="0.8" />
                <text x="50" y="73" textAnchor="middle" fill="#cbd5e1" fontSize="4.5" fontFamily="monospace">3. SUPPORT BRACKET BOTTOM</text>
                {/* Draw Fasteners cross dots indicating screw assembly path */}
                <circle cx="26" cy="55" r="1" fill="#fbbf24" />
                <line x1="26" y1="55" x2="26" y2="35" stroke="rgba(251,191,36,0.3)" strokeWidth="0.5" strokeDasharray="1,1" />
                <circle cx="74" cy="55" r="1" fill="#fbbf24" />
                <line x1="74" y1="55" x2="74" y2="35" stroke="rgba(251,191,36,0.3)" strokeWidth="0.5" strokeDasharray="1,1" />
              </g>
            </svg>
          ) : (
            /* COMPOSITE CAD RENDERING DRAWINGS - Dependent on product category and style curves constraints */
            <div className="text-center relative">
              <svg className="w-56 h-40 overflow-visible drop-shadow-xl" viewBox="0 0 120 90">
                {/* Base Product Outline according to selected shape style */}
                {shapeLanguage.includes('Rounded') ? (
                  /* Rounded Organic curved geometry vectors */
                  <g>
                    <path d="M20,20 Q60,10 100,20 Q112,50 100,80 Q60,90 20,80 Q8,50 20,20 Z" fill="rgba(255,255,255,0.06)" stroke={primaryColor} strokeWidth="1.5" />
                    {/* Interior assembly seam lines offset inside */}
                    <path d="M24,25 Q60,16 96,25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  </g>
                ) : shapeLanguage.includes('Brutalist') ? (
                  /* Brutalist block monolithic shapes */
                  <g>
                    <rect x="15" y="15" width="90" height="60" fill="rgba(255,255,255,0.06)" stroke={primaryColor} strokeWidth="2" />
                    <line x1="15" y1="30" x2="105" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  </g>
                ) : shapeLanguage.includes('Hexagonal') ? (
                  /* Double chamfer precision hexagonal profile */
                  <g>
                    <polygon points="30,12 90,12 110,35 110,65 90,82 30,82 10,65 10,35" fill="rgba(255,255,255,0.06)" stroke={primaryColor} strokeWidth="1.8" />
                    <line x1="30" y1="12" x2="30" y2="82" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                    <line x1="90" y1="12" x2="90" y2="82" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                  </g>
                ) : (
                  /* Sleek aerodynamic vectors */
                  <g>
                    <path d="M10,45 Q60,15 110,45 Q114,60 106,72 Q60,52 14,72 Q6,60 10,45 Z" fill="rgba(255,255,255,0.06)" stroke={primaryColor} strokeWidth="1.6" />
                    <path d="M10,45 Q60,35 110,45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  </g>
                )}

                {/* Draw Vents grid depending on style option state */}
                {ventStyle === 'Linear Louvers' && (
                  <g transform="translate(42, 38)">
                    {Array.from({ length: ventSize }).map((_, vi) => (
                      <rect key={vi} x="0" y={vi * 4} width="36" height="1.8" rx="0.5" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
                    ))}
                  </g>
                )}
                {ventStyle === 'Honeycomb Matrix' && (
                  <g transform="translate(46, 38)" className="opacity-40">
                    <circle cx="4" cy="4" r="1.5" fill="#fff" />
                    <circle cx="12" cy="4" r="1.5" fill="#fff" />
                    <circle cx="20" cy="4" r="1.5" fill="#fff" />
                    <circle cx="8" cy="10" r="1.5" fill="#fff" />
                    <circle cx="16" cy="10" r="1.5" fill="#fff" />
                  </g>
                )}
                {ventStyle === 'Slotted Radial Outflow' && (
                  <g transform="translate(60, 44)">
                    <circle cx="0" cy="0" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3,2" />
                    <circle cx="0" cy="0" r="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeDasharray="2,1" />
                  </g>
                )}

                {/* Panel lines split coordinates traces */}
                {Array.from({ length: panelLinesCount }).map((_, pli) => {
                  const pct = (pli + 1) / (panelLinesCount + 1);
                  return (
                    <line
                      key={`pl-${pli}`}
                      x1={18 + (84 * pct)}
                      y1="20"
                      x2={18 + (84 * pct)}
                      y2="76"
                      stroke="rgba(56,189,248,0.25)"
                      strokeWidth="0.8"
                      strokeDasharray="4,4"
                    />
                  );
                })}

                {/* Seams tooling gap offsets */}
                {Array.from({ length: seamsCount }).map((_, si) => {
                  const seamY = 24 + (si * 18);
                  return (
                    <path
                      key={`seam-${si}`}
                      d={`M13,${seamY} Q60,${seamY - 8} 107,${seamY}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="0.6"
                    />
                  );
                })}

                {/* Ports list drawings */}
                {portsList.map((p) => (
                  <rect
                    key={p.id}
                    x="11"
                    y={15 + (p.y * 0.6)}
                    width="4"
                    height="2"
                    rx="0.5"
                    fill="#10b981"
                    stroke="#fff"
                    strokeWidth="0.4"
                    title={p.type}
                  />
                ))}

                {/* Screw points fastener icons */}
                {Array.from({ length: fastenerCount }).map((_, fi) => {
                  // Distribute on corners of the primary body frame boundary
                  const isLeft = fi % 2 === 0;
                  const xCoord = isLeft ? 18 : 102;
                  const yRow = Math.floor(fi / 2);
                  const yCoord = 21 + (yRow * 18);

                  return (
                    <g key={`fastener-${fi}`} transform={`translate(${xCoord}, ${yCoord})`}>
                      <circle cx="0" cy="0" r="1.5" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
                      <line x1="-1" y1="0" x2="1" y2="0" stroke="#fbbf24" strokeWidth="0.4" />
                      <line x1="0" y1="-1" x2="0" y2="1" stroke="#fbbf24" strokeWidth="0.4" />
                    </g>
                  );
                })}

                {/* Interactive Annotations pins */}
                <g transform="translate(60, 20)">
                  <line x1="0" y1="0" x2="15" y2="-10" stroke={accentColor} strokeWidth="0.6" />
                  <circle cx="0" cy="0" r="1.5" fill={accentColor} />
                  <rect x="15" y="-14" width="30" height="6" rx="1.5" fill="rgba(0,0,0,0.8)" stroke={accentColor} strokeWidth="0.5" />
                  <text x="30" y="-10" textAnchor="middle" fill="#fff" fontSize="3" fontFamily="sans-serif">Case Material</text>
                </g>
              </svg>
            </div>
          )}

        </div>

        {/* Textual specs summary bottom drawer */}
        <div className="border-t border-white/5 pt-2.5 flex justify-between items-center relative z-10 text-[9px] font-mono text-slate-400">
          <div>SPECS: IP-68 ASSEMBLY SHIELD LOCKING</div>
          <div>DRAFT: VER. {panelLinesCount}.{seamsCount}</div>
        </div>

      </div>

      {/* Assembly Ledger Technical Breakdown */}
      {showCalloutSheet && (
        <div className="p-4 bg-white border border-gray-205 rounded-3xl space-y-3.5 shadow-2xs">
          <div className="flex justify-between items-center border-b pb-1">
            <span className="text-[10px] font-mono font-bold text-gray-550 uppercase">Technical Construction Ledger</span>
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded">
              Verified Specs
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {/* Left Col: Hardware detailing list */}
            <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-2xl border">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">CAD SOLVER COMPONENTS</span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fasteners style:</span>
                  <span className="font-bold text-slate-800">{fastenersType.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fastener total point:</span>
                  <span className="font-bold text-slate-800">{fastenerCount} bolts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Air vents flow:</span>
                  <span className="font-bold text-slate-800">{ventStyle} (X{ventSize})</span>
                </div>
              </div>
            </div>

            {/* Right Col: I/O interface pins config */}
            <div className="space-y-1.5 bg-gray-50/50 p-2.5 rounded-2xl border">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">PORTS TERMINATION BLOCKS</span>
              <div className="space-y-1">
                {portsList.map((p) => (
                  <div key={p.id} className="flex justify-between text-[10px] bg-white px-2 py-0.5 border rounded">
                    <span className="text-slate-700 font-mono text-[9px]">{p.type.split(' ')[0]}</span>
                    <span className="text-gray-400">Fixed Offset {p.y}mm</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Spawners section */}
          <div className="pt-2 border-t flex gap-2">
            <button
              type="button"
              onClick={() => {
                const pType = prompt('Select socket connector type (e.g. RJ45 Ethernet, USB-A):', 'USB-C SuperSpeed+');
                if (pType) addPortItem(pType);
              }}
              className="flex-1 py-1.5 bg-gray-50 hover:bg-slate-100 text-[10px] font-bold rounded-lg border text-center"
            >
              + Append Port Bus Terminal
            </button>
            <button
              type="button"
              onClick={() => {
                const zName = prompt('Enter material boundary surface zone (e.g. Outer faceplate):', 'Exhaust Grille Bezel');
                const zMat = prompt('Enter engineering compound material spec:', 'Nickel Plated Copper-Zinc');
                if (zName && zMat) registerMaterialZone(zName, zMat);
              }}
              className="flex-1 py-1.5 bg-gray-50 hover:bg-slate-100 text-[10px] font-bold rounded-lg border text-center"
            >
              + Register Material Zone
            </button>
          </div>

          {/* Detailed registered material zones */}
          <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
            {materialZones.map((z) => (
              <div key={z.id} className="flex justify-between p-1 px-2 border border-gray-150 rounded-lg text-[9.5px] items-center bg-white">
                <span className="font-bold text-slate-700">{z.zone}</span>
                <span className="text-violet-650 font-mono">{z.material}</span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Exporter blueprints controls */}
      <div className="p-4 bg-white border border-gray-205 rounded-3xl space-y-3.5 shadow-2xs">
        <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
          Dossier Compiler Exporter Tool
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['json', 'svg', 'png'] as const).map(fmt => (
            <button
              key={`exp-${fmt}`}
              type="button"
              onClick={() => exportIndustrialDossier(fmt)}
              className="py-2.5 bg-white hover:bg-violet-50/50 border border-gray-200 rounded-xl text-center text-[10.5px] font-bold uppercase text-slate-700 shadow-2xs flex items-center justify-center gap-1"
            >
              <Download className="h-3 w-3 text-gray-400" />
              <span>{fmt} Spec Blueprint</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
