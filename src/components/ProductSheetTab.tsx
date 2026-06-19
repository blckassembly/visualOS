import React, { useState } from 'react';
import { 
  Sparkles, Plus, Trash2, Edit2, Check, Download, 
  Layers, Package, Ruler, FileText, Info, Maximize2 
} from 'lucide-react';
import { BrandKit } from './CommandPaletteSimulator';

export interface Callout {
  id: string;
  name: string;
  x: number; // percentage x on Hero view
  y: number; // percentage y on Hero view
  note: string;
}

export interface MaterialBlock {
  id: string;
  part: string;
  material: string;
  finish: string;
}

export interface DimensionBlock {
  id: string;
  label: string;
  value: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export interface SpecBlock {
  id: string;
  key: string;
  value: string;
}

interface ProductSheetTabProps {
  activeBrandKit?: BrandKit;
  logTrace: (message: string) => void;
}

export default function ProductSheetTab({ activeBrandKit, logTrace }: ProductSheetTabProps) {
  // Preset Product Designs
  const productPresets = [
    {
      name: 'Acoustic Nova Pro (Wireless Speaker)',
      type: 'Audio System',
      prompt: 'High fidelity audio system with dual acoustic transducers, textured walnut wooden housing, and knurled aluminum rotary controller.',
      callouts: [
        { id: 'c_1', name: 'Alloy Volume Rotary', x: 82, y: 35, note: 'Rotary controller cut from knurled 6061-T6 space-grade aluminum.' },
        { id: 'c_2', name: 'Acoustic Fiber Fabric', x: 45, y: 55, note: 'Custom blended high-transparency acoustic wool blend.' },
        { id: 'c_3', name: 'Haptic NFC Trigger', x: 20, y: 25, note: 'Integrated sub-surface contactless handoff region.' }
      ],
      materials: [
        { id: 'm_1', part: 'Outer Body Shell', material: 'Black Walnut Wood Planks', finish: 'Satin oil with natural continuous wood grains' },
        { id: 'm_2', part: 'Front Speaker Grille', material: 'Engineered Micromesh Fiber', finish: 'Dust resistant anthracite weave' },
        { id: 'm_3', part: 'Key Interface Accents', material: 'Anodized Pure Matte Metal', finish: 'Bead blasted texture feel' }
      ],
      dimensions: [
        { id: 'd_1', label: 'Total Width', value: '380 mm', position: 'bottom' },
        { id: 'd_2', label: 'Maximum Height', value: '145 mm', position: 'left' },
        { id: 'd_3', label: 'Cabinet Depth', value: '120 mm', position: 'right' }
      ],
      specs: [
        { id: 's_1', key: 'Chassis Material', value: 'Precision CNC hardwood composite' },
        { id: 's_2', key: 'Transducers', value: 'Dual 3-inch long-throw woofers' },
        { id: 's_3', key: 'Frequency Bandwidth', value: '38 Hz - 22,000 Hz (+/- 3dB)' },
        { id: 's_4', key: 'Interface', value: 'Bluetooth 5.3 Low-Latency LE, Wi-Fi AirPlay-3' }
      ]
    },
    {
      name: 'Aero-Vane X8 (Pro Cinematography Drone)',
      type: 'Industrial Drone',
      prompt: 'Heavy payload camera UAV drone with aerodynamic carbon fiber frame arms, visual collision avoid sonar sensors, and active gimbal.',
      callouts: [
        { id: 'c_1', name: 'Carbon Arm Pivot', x: 25, y: 30, note: 'High vibration damping molded carbon weaves.' },
        { id: 'c_2', name: 'Dual Gimbal Camera mount', x: 50, y: 75, note: '3-axis brushless controller with zero backlash.' },
        { id: 'c_3', name: 'Collision Avoidance Radar', x: 50, y: 25, note: 'Solid-state LiDAR module with wide field coverage.' }
      ],
      materials: [
        { id: 'm_1', part: 'Folding Propeller Wings', material: 'Polyester Carbon Composites', finish: 'Unidirectional layup structure' },
        { id: 'm_2', part: 'Core Sensor Housing', material: 'Magnesium Aluminum Alloy', finish: 'Sand-blasted anti-corrosion powder' },
        { id: 'm_3', part: 'Heat Dissipation Exhaust', material: 'Raw Copper Fins Core', finish: 'Thermal interface paste applied' }
      ],
      dimensions: [
        { id: 'd_1', label: 'Rotor Span Size', value: '620 mm', position: 'bottom' },
        { id: 'd_2', label: 'Profile Height', value: '240 mm', position: 'left' }
      ],
      specs: [
        { id: 's_1', key: 'Maximum Payload Class', value: '4.5 kg full camera setups' },
        { id: 's_2', key: 'Operational Wind Limit', value: 'Up to 15 m/s' },
        { id: 's_3', key: 'Telemetry Distance Range', value: '15 km encrypted FCC band' },
        { id: 's_4', key: 'Flight Time Limit', value: '42 minutes empty / 34 minutes loaded' }
      ]
    },
    {
      name: 'OmniDesk Smart workstation v4',
      type: 'Office Furniture',
      prompt: 'Minimalist electronic sit-to-stand desk with micro-textured desktop, digital interface layout, and custom structural power channel.',
      callouts: [
        { id: 'c_1', name: 'Digital OLED Keypad', x: 88, y: 50, note: 'Touch controller with memory heights and warning alarms.' },
        { id: 'c_2', name: 'Hidden Cable Raceway', x: 50, y: 15, note: 'Integrated aluminum management system Tray.' },
        { id: 'c_3', name: 'Induction Charging Pad', x: 20, y: 40, note: 'Sub-surface localized wireless charger.' }
      ],
      materials: [
        { id: 'm_1', part: 'Primary Worktop Layer', material: 'Compressed Bamboo Composite', finish: 'Anti-static oleophobic laminate' },
        { id: 'm_2', part: 'Telescopic Columns legs', material: 'Reinforced Structural Steel', finish: 'Electrostatic powder paint coat' },
        { id: 'm_3', part: 'Joint Bracket Frames', material: 'Cold rolled low carbon steel', finish: 'High density zinc passivated plating' }
      ],
      dimensions: [
        { id: 'd_1', label: 'Desktop width', value: '1600 mm', position: 'bottom' },
        { id: 'd_2', label: 'Elevation Range', value: '620 mm - 1280 mm', position: 'left' },
        { id: 'd_3', label: 'Desktop Depth', value: '800 mm', position: 'right' }
      ],
      specs: [
        { id: 's_1', key: 'Dual Motor Load Force', value: '160 kg lifting power limits' },
        { id: 's_2', key: 'Speed rate profile', value: '38 mm/s flat movement rate' },
        { id: 's_3', key: 'Acoustic Sound Output', value: '< 42 dBA during translation' },
        { id: 's_4', key: 'Adaptive Anti-collision', value: 'Built-in 6D gyro sensor' }
      ]
    }
  ];

  // Primary Workspace States
  const [productName, setProductName] = useState(productPresets[0].name);
  const [productType, setProductType] = useState(productPresets[0].type);
  const [promptInput, setPromptInput] = useState(productPresets[0].prompt);
  
  const [callouts, setCallouts] = useState<Callout[]>(productPresets[0].callouts);
  const [materials, setMaterials] = useState<MaterialBlock[]>(productPresets[0].materials);
  const [dimensions, setDimensions] = useState<DimensionBlock[]>(productPresets[0].dimensions);
  const [specs, setSpecs] = useState<SpecBlock[]>(productPresets[0].specs);

  // Focus and layout options
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>('c_1');
  const [editingCalloutId, setEditingCalloutId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Temp form fields
  const [newPartName, setNewPartName] = useState('');
  const [newMaterialKind, setNewMaterialKind] = useState('');
  const [newMaterialFinish, setNewMaterialFinish] = useState('');

  const [newDimLabel, setNewDimLabel] = useState('');
  const [newDimValue, setNewDimValue] = useState('');
  const [newDimPos, setNewDimPos] = useState<'top' | 'right' | 'bottom' | 'left'>('bottom');

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  const loadPreset = (index: number) => {
    const p = productPresets[index];
    setProductName(p.name);
    setProductType(p.type);
    setPromptInput(p.prompt);
    setCallouts(p.callouts);
    setMaterials(p.materials);
    setDimensions(p.dimensions);
    setSpecs(p.specs);
    setActiveCalloutId(p.callouts[0]?.id || null);
    logTrace(`[PRODUCT ENGINE] Loaded pre-calibrated product data sheet: "${p.name}".`);
  };

  // State trigger actions
  const createProductSheet = (promptText: string) => {
    logTrace(`[PRODUCT ENGINE] createProductSheet: Initializing AI generative analyzer on prompt: "${promptText}"`);
    
    // Auto generate based on keywords in prompt
    const pLower = promptText.toLowerCase();
    let selectedType = 'Consumer hardware';
    let suggestedName = 'Generated Concept Model UX';
    
    if (pLower.includes('speaker') || pLower.includes('audio') || pLower.includes('sound')) {
      selectedType = 'Audio System';
      suggestedName = 'Concept Acoustic H-1';
    } else if (pLower.includes('drone') || pLower.includes('uav') || pLower.includes('copter')) {
      selectedType = 'Industrial Drone';
      suggestedName = 'Apex Aero Vane UAV';
    } else if (pLower.includes('desk') || pLower.includes('table') || pLower.includes('furniture')) {
      selectedType = 'Office Furniture';
      suggestedName = 'OmniDesk Pro V';
    } else if (pLower.includes('watch') || pLower.includes('smartwatch')) {
      selectedType = 'Wearable Wear';
      suggestedName = 'ChronoFit Active Smartwatch';
    } else if (pLower.includes('laptop') || pLower.includes('computer')) {
      selectedType = 'Computing Platform';
      suggestedName = 'VeloBook Pro 14';
    }

    setProductName(suggestedName);
    setProductType(selectedType);
    setPromptInput(promptText);

    // Seed some basic generated structures
    setCallouts([
      { id: 'c_g1', name: 'Integrated Core Module', x: 50, y: 50, note: 'Main housing chamber optimized with tight tolerances constraints.' },
      { id: 'c_g2', name: 'Auxiliary Interface Bezel', x: 75, y: 30, note: 'Polished micro-bezel for responsive touch engagement.' }
    ]);

    setMaterials([
      { id: 'm_g1', part: 'Core Chassis Enclosure', material: 'Recycled Aluminum 7075 Composite', finish: 'Fine Bead-Blasted Matt Anodizing' },
      { id: 'm_g2', part: 'Peripheral Seals and Buffers', material: 'LSR Liquid Silicone Rubber', finish: 'Soft-touch dry tactile skin finish' }
    ]);

    setDimensions([
      { id: 'd_g1', label: 'Maximum Envelope Width', value: '240 mm', position: 'bottom' },
      { id: 'd_g2', label: 'Maximum Envelope Height', value: '180 mm', position: 'left' }
    ]);

    setSpecs([
      { id: 's_g1', key: 'Enclosure Rating', value: 'IP67 Dust and Water Submersibility' },
      { id: 's_g2', key: 'Structural Integrity', value: 'Passed 2.0g impact shock testing standard' },
      { id: 's_g3', key: 'Carbon Footprint Class', value: 'Net Neutral carbon verified composite materials' }
    ]);

    setActiveCalloutId('c_g1');
    logTrace(`[PRODUCT ENGINE] Generated successfully. Form dimensions allocated and default materials locked.`);
  };

  const addCallouts = (name: string, note: string, x?: number, y?: number) => {
    const nCall: Callout = {
      id: `c_${Date.now().toString().slice(-4)}`,
      name: name || 'Dynamic Label Node',
      x: x !== undefined ? x : Math.floor(Math.random() * 50) + 25,
      y: y !== undefined ? y : Math.floor(Math.random() * 50) + 25,
      note: note || 'Specifies structural details of the concept envelope.'
    };
    setCallouts(prev => [...prev, nCall]);
    setActiveCalloutId(nCall.id);
    logTrace(`[PRODUCT ENGINE] addCallouts: Added callout "${nCall.name}" at point (${nCall.x}%, ${nCall.y}%).`);
  };

  const addMaterialBlock = (part: string, material: string, finish: string) => {
    if (!part || !material) return;
    const nMat: MaterialBlock = {
      id: `m_${Date.now().toString().slice(-4)}`,
      part,
      material,
      finish: finish || 'Standard raw finish'
    };
    setMaterials(prev => [...prev, nMat]);
    logTrace(`[PRODUCT ENGINE] addMaterialBlock: Assigned "${material}" to "${part}".`);
  };

  const addDimensionBlock = (label: string, value: string, pos: 'top' | 'right' | 'bottom' | 'left' = 'bottom') => {
    if (!label || !value) return;
    const nDim: DimensionBlock = {
      id: `d_${Date.now().toString().slice(-4)}`,
      label,
      value,
      position: pos
    };
    setDimensions(prev => [...prev, nDim]);
    logTrace(`[PRODUCT ENGINE] addDimensionBlock: Mapped guide ruler "${label}: ${value}".`);
  };

  const addSpecBlock = (key: string, value: string) => {
    if (!key || !value) return;
    const nSpec: SpecBlock = {
      id: `s_${Date.now().toString().slice(-4)}`,
      key,
      value
    };
    setSpecs(prev => [...prev, nSpec]);
    logTrace(`[PRODUCT ENGINE] addSpecBlock: Recorded specification matrix index: "${key}."`);
  };

  const exportProductSheet = (format: 'pdf' | 'png' | 'svg' | 'json') => {
    setIsExporting(true);
    logTrace(`[PRODUCT ENGINE] exportProductSheet: Compiling product design specifications package to format: .${format.toUpperCase()}`);

    const payload = {
      generatorId: 'VisualOS_Product_Sheet_Generator_v2',
      timestamp: new Date().toISOString(),
      metadata: {
        productName,
        productType,
        sourcePrompt: promptInput,
        activeBrandAesthetic: activeBrandKit ? activeBrandKit.name : 'Unbounded Custom'
      },
      specifications: specs,
      dimensionFidelity: dimensions,
      materialBill: materials,
      interactiveCallouts: callouts
    };

    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataString);
    downloadAnchor.setAttribute("download", `${productName.toLowerCase().replace(/\s+/g, '_')}_design_sheet.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setTimeout(() => {
      setIsExporting(false);
      logTrace(`[PRODUCT EXPORTER] Successfully exported file payload index. Views and dimensions locked.`);
    }, 1500);
  };

  // SVG Helper visualizer matches active brand kit aesthetics
  const primaryColor = activeBrandKit?.colors?.primary || '#2563eb';
  const secondaryColor = activeBrandKit?.colors?.secondary || '#db2777';
  const accentColor = activeBrandKit?.colors?.accent || '#38bdf8';
  const fontDisplay = activeBrandKit?.fonts?.display || 'sans-serif';

  return (
    <div className="bg-gray-50 border border-gray-255 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn text-xs">
      
      {/* Module Heading */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-blue-600 block tracking-widest leading-none">Presentation Engine</span>
          <h3 className="text-sm font-extrabold text-slate-800 font-sans mt-0.5">Product Sheet Generator</h3>
        </div>
        <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 font-mono text-[9px] font-bold rounded uppercase">
          ONLINE
        </span>
      </div>

      {/* Preset Pick list */}
      <div className="space-y-1">
        <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Load Reference Product Sheets Preset:</label>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {productPresets.map((p, idx) => (
            <button
              key={`preset-${idx}`}
              type="button"
              onClick={() => loadPreset(idx)}
              className="py-2 px-1 bg-white hover:bg-slate-50 border border-gray-200 text-[9.5px] font-semibold text-slate-700 rounded-lg truncate text-center leading-tight transition shadow-2xs"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Generative Ingestion Prompter */}
      <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-2xs">
        <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
          1. AI Design Sheet Architect Prompter
        </span>
        <div className="space-y-2">
          <textarea
            placeholder="Type your design intent, details, materials, and specification targets. Our CAD solver distributes Views, Callouts, and Measurements instantly..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="w-full h-16 p-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-700 outline-none focus:border-blue-500 font-sans resize-none leading-relaxed"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => createProductSheet(promptInput)}
              className="flex-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wide flex items-center justify-center gap-1 shadow-sm transition"
            >
              <Sparkles className="h-3 w-3" />
              <span>Generate Product Sheet Views</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sheet Preview Workspace and Core Layout alignment */}
      <div className="bg-slate-900 border border-slate-950 p-4 rounded-3xl space-y-4 shadow-inner relative overflow-hidden text-slate-200">
        
        {/* Subtle grid background to look like engineering blueprint drafting board */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1.2px,transparent_1.2px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Header Block inside the Sheet */}
        <div className="border-b border-white/10 pb-2.5 flex justify-between items-start relative z-10">
          <div>
            <div className="text-[8px] font-mono tracking-wider text-blue-400 capitalize bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 inline-block mb-1">
              {productType} Specs Sheet
            </div>
            <h4 className="text-sm font-extrabold text-white font-sans leading-none tracking-tight">{productName}</h4>
          </div>
          <div className="text-right font-mono text-[8px] text-white/50">
            <div>DS-N°: {Date.now().toString().slice(-6)}</div>
            <div>SCALE: 1:2.5 CAD SOLVER</div>
          </div>
        </div>

        {/* Grid of Views */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          
          {/* Main big Hero view spanning 2 columns */}
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-3 min-h-[190px] relative flex flex-col justify-between overflow-hidden">
            <div className="absolute top-2 left-2 text-[8px] font-mono text-white/40 uppercase bg-black/30 px-1 rounded">
              A. Primary Isometric Hero View
            </div>

            {/* Dynamic Vector CAD Draft of Product */}
            <div className="flex-1 flex items-center justify-center relative my-4">
              {productType === 'Audio System' ? (
                /* Draw Speaker SVG */
                <svg className="h-28 w-44 drop-shadow-lg" viewBox="0 0 200 120">
                  <rect x="20" y="25" width="160" height="70" rx="12" fill="#2c2415" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <rect x="24" y="29" width="152" height="62" rx="8" fill="#1b1c22" />
                  {/* Speaker fiber texture mesh background */}
                  <rect x="28" y="33" width="112" height="54" rx="4" fill="rgba(80,80,95,0.7)" />
                  {/* Grille mesh patterns */}
                  <line x1="38" y1="40" x2="130" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="38" y1="50" x2="130" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="38" y1="60" x2="130" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="38" y1="70" x2="130" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="38" y1="80" x2="130" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  {/* Rotary knob */}
                  <circle cx="156" cy="60" r="14" fill="#64748b" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <line x1="156" y1="60" x2="166" y2="50" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="156" cy="60" r="1.5" fill="#fff" />
                  {/* Status lights */}
                  <circle cx="34" cy="38" r="1.5" fill="#10b981" className="animate-pulse" />
                  {/* Wooden stand base */}
                  <rect x="40" y="95" width="120" height="4" rx="1" fill="#451a03" />
                </svg>
              ) : productType === 'Industrial Drone' ? (
                /* Draw Drone SVG */
                <svg className="h-28 w-44 drop-shadow-lg" viewBox="0 0 200 120">
                  {/* Rotor Arms */}
                  <line x1="45" y1="35" x2="155" y2="85" stroke="#475569" strokeWidth="5" />
                  <line x1="45" y1="85" x2="155" y2="35" stroke="#475569" strokeWidth="5" />
                  {/* Propellers */}
                  <ellipse cx="45" cy="35" rx="30" ry="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeDasharray="1,1" />
                  <ellipse cx="155" cy="35" rx="30" ry="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeDasharray="1,1" />
                  <ellipse cx="45" cy="85" rx="30" ry="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeDasharray="1,1" />
                  <ellipse cx="155" cy="85" rx="30" ry="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeDasharray="1,1" />
                  {/* Drone central body capsule */}
                  <rect x="75" y="45" width="50" height="30" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                  <rect x="80" y="40" width="40" height="5" rx="2" fill="#334155" />
                  <circle cx="100" cy="50" r="3" fill={accentColor} />
                  {/* Sonar Sensor lens */}
                  <circle cx="120" cy="62" r="3.5" fill="#f43f5e" />
                  <circle cx="120" cy="62" r="1.5" fill="#fff" />
                  {/* Gimbal & Camera shell */}
                  <line x1="100" y1="75" x2="100" y2="83" stroke="#94a3b8" strokeWidth="2.5" />
                  <circle cx="100" cy="87" r="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                  <circle cx="102" cy="87" r="3" fill="#000" />
                  <circle cx="102" cy="87" r="1" fill="#60a5fa" />
                </svg>
              ) : productType === 'Office Furniture' ? (
                /* Draw Standing Table SVG */
                <svg className="h-28 w-44 drop-shadow-lg" viewBox="0 0 200 120">
                  {/* Table board */}
                  <polygon points="12,48 188,48 174,38 26,38" fill="#78350f" stroke="rgba(255,255,255,0.1)" />
                  <rect x="12" y="47" width="176" height="5" rx="1" fill="#451a03" />
                  {/* Left Column lift Leg */}
                  <rect x="34" y="52" width="10" height="52" fill="#334155" />
                  <rect x="36" y="52" width="6" height="32" fill="#475569" />
                  {/* Right Column lift Leg */}
                  <rect x="156" y="52" width="10" height="52" fill="#334155" />
                  <rect x="158" y="52" width="6" height="32" fill="#475569" />
                  {/* Flat bottom base support structures */}
                  <ellipse cx="39" cy="103" rx="14" ry="3.5" fill="#1e293b" />
                  <ellipse cx="161" cy="103" rx="14" ry="3.5" fill="#1e293b" />
                  {/* Cable channel support core and actuator */}
                  <line x1="44" y1="56" x2="156" y2="56" stroke="#101827" strokeWidth="5.5" />
                  {/* Keypad OLED display visual */}
                  <rect x="160" y="51" width="14" height="4" fill="#020617" />
                  <rect x="162" y="522" width="4" height="2" fill="#10b981" />
                </svg>
              ) : (
                /* Generic Hardware Enclosure */
                <svg className="h-28 w-44 drop-shadow-lg" viewBox="0 0 200 120">
                  <rect x="40" y="25" width="120" height="70" rx="12" fill="#1e293b" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                  <rect x="48" y="32" width="104" height="56" rx="6" fill="#0f172a" />
                  <circle cx="100" cy="60" r="16" fill="none" stroke={accentColor} strokeWidth="2.5" strokeDasharray="15,4" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '6s' }} />
                  <circle cx="100" cy="60" r="10" fill="#1e293b" />
                  <line x1="40" y1="60" x2="20" y2="60" stroke={primaryColor} strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="160" y1="60" x2="180" y2="60" stroke={primaryColor} strokeWidth="1" strokeDasharray="2,2" />
                </svg>
              )}

              {/* Vector Dimensions Markers drawn over product box */}
              {dimensions.map((dim, di) => {
                const isBottom = dim.position === 'bottom';
                const isLeft = dim.position === 'left';
                const isRight = dim.position === 'right';
                const isTop = dim.position === 'top';

                return (
                  <div 
                    key={dim.id} 
                    className={`absolute font-mono text-[8.5px] whitespace-nowrap text-blue-400 flex items-center justify-center gap-1 leading-none ${
                      isBottom ? 'bottom-0 left-0 right-0 border-t border-dashed border-white/25 pt-1.5' :
                      isLeft ? 'left-0 top-0 bottom-0 border-r border-dashed border-white/25 pr-1.5 flex-col' :
                      isRight ? 'right-0 top-0 bottom-0 border-l border-dashed border-white/25 pl-1.5 flex-col' :
                      'top-0 left-0 right-0 border-b border-dashed border-white/25 pb-1.5'
                    }`}
                  >
                    <span className="font-bold">{dim.value}</span>
                    <span className="opacity-60 text-[7px] font-medium font-sans">({dim.label})</span>
                  </div>
                );
              })}

              {/* Interactive Callout Markers on Canvas */}
              {callouts.map((cl) => {
                const isActive = cl.id === activeCalloutId;
                return (
                  <button
                    key={cl.id}
                    type="button"
                    onClick={() => {
                      setActiveCalloutId(cl.id);
                      logTrace(`[SHEET VIEW] Selected callout details: "${cl.name}".`);
                    }}
                    style={{ left: `${cl.x}%`, top: `${cl.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] transition-all relative group z-20 ${
                      isActive 
                        ? 'bg-blue-500 scale-120 text-white shadow-lg ring-4 ring-blue-500/35 ring-offset-2 ring-offset-slate-900 border border-white' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border border-white/40 text-blue-300'
                    }`}
                  >
                    <span>{cl.id.startsWith('c_g') ? 'AI' : cl.id.slice(-1)}</span>
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/85 border border-white/10 px-2 py-0.5 text-[8.5px] rounded opacity-0 scale-90 origin-left transition group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap">
                      {cl.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Active Callout Display inside panel */}
            {(() => {
              const currentCallout = callouts.find(c => c.id === activeCalloutId);
              if (!currentCallout) return null;
              return (
                <div className="bg-black/45 border border-white/10 p-2.5 rounded-xl text-[10px] backdrop-blur-xs relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-blue-300 font-sans">{currentCallout.name}</span>
                    <span className="text-[8px] font-mono text-white/40">CALLOUT ID: {currentCallout.id}</span>
                  </div>
                  <p className="text-[9.5px] text-white/80 leading-relaxed font-serif italic">"{currentCallout.note}"</p>
                </div>
              );
            })()}
          </div>

          {/* Sibling column for auxiliary views aligned perfectly on the side */}
          <div className="space-y-2.5">
            
            {/* Auxiliary 1: Front Elevation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 h-[58px] relative flex flex-col justify-between overflow-hidden">
              <span className="absolute top-1.5 left-1.5 text-[7px] font-mono text-white/40 uppercase">B. Front elevation</span>
              <div className="flex-1 flex items-center justify-center mt-3 scale-60 opacity-60">
                {productType === 'Audio System' ? (
                  <rect x="0" y="0" width="100" height="30" fill="#3f3f46" stroke="#fff" rx="4" />
                ) : (
                  <circle cx="50" cy="20" r="15" fill="#3f3f46" stroke="#fff" />
                )}
              </div>
            </div>

            {/* Auxiliary 2: Side Profile */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 h-[58px] relative flex flex-col justify-between overflow-hidden">
              <span className="absolute top-1.5 left-1.5 text-[7px] font-mono text-white/40 uppercase">C. Side Profile auxiliary</span>
              <div className="flex-1 flex items-center justify-center mt-3 scale-60 opacity-60">
                {productType === 'Audio System' ? (
                  <rect x="0" y="0" width="40" height="30" fill="#3f3f46" stroke="#fff" rx="4" />
                ) : (
                  <ellipse cx="50" cy="20" rx="30" ry="8" fill="#3f3f46" stroke="#fff" />
                )}
              </div>
            </div>

            {/* Auxiliary 3: Top Elevation Plan */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 h-[58px] relative flex flex-col justify-between overflow-hidden">
              <span className="absolute top-1.5 left-1.5 text-[7px] font-mono text-white/40 uppercase">D. Space Top Plan view</span>
              <div className="flex-1 flex items-center justify-center mt-3 scale-60 opacity-60">
                {productType === 'Audio System' ? (
                  <rect x="0" y="0" width="100" height="20" fill="#3f3f46" stroke="#fff" rx="2" />
                ) : (
                  <rect x="25" y="10" width="50" height="20" fill="#3f3f46" stroke="#fff" rx="3" />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Specifications Matrix & Material specs row */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10 relative z-10 text-[10px]">
          
          {/* Bill of Materials list */}
          <div className="space-y-1.5">
            <span className="text-[8.5px] font-mono text-blue-400 uppercase tracking-wider block">BILL OF MATERIALS (BOM)</span>
            <div className="bg-black/35 rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
              {materials.map((m) => (
                <div key={m.id} className="p-2 flex justify-between items-start hover:bg-white/5 gap-2">
                  <div className="leading-snug">
                    <span className="font-bold text-white/90 block">{m.part}</span>
                    <span className="text-[9px] text-white/60">{m.material}</span>
                  </div>
                  <span className="text-[8.5px] text-blue-300 font-mono text-right bg-white/5 px-1.5 py-0.5 rounded leading-none">
                    {m.finish}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Spec Matrix list */}
          <div className="space-y-1.5">
            <span className="text-[8.5px] font-mono text-blue-400 uppercase tracking-wider block">PERFORMANCE COEFFICIENT SPECIFICATION</span>
            <div className="bg-black/35 rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
              {specs.map((s) => (
                <div key={s.id} className="p-2 flex justify-between items-center hover:bg-white/5 text-[9px]">
                  <span className="font-mono text-white/50">{s.key}</span>
                  <span className="font-bold text-white/90 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Editable Management Controllers */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Callouts management */}
        <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-2xs">
          <div className="flex justify-between items-center border-b pb-1">
            <span className="text-[10px] font-mono font-bold text-gray-550 uppercase">Manage Active Callout Points</span>
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded">
              {callouts.length} Active
            </span>
          </div>

          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {callouts.map((cl) => {
              const isEditing = cl.id === editingCalloutId;
              return (
                <div key={cl.id} className="p-2 bg-gray-50 hover:bg-slate-100 border rounded-xl flex flex-col gap-1.5 transition">
                  <div className="flex justify-between items-start gap-1">
                    <div className="leading-tight">
                      <span className="font-bold text-slate-800 text-[10.5px]">{cl.name}</span>
                      <span className="block text-[8.5px] font-mono text-gray-400">Position coords: X:{cl.x}%, Y:{cl.y}%</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        type="button" 
                        onClick={() => {
                          setCallouts(prev => prev.filter(c => c.id !== cl.id));
                          logTrace(`[PRODUCT ENGINE] Deleted callout ID: ${cl.id}.`);
                        }}
                        className="p-1 text-gray-400 hover:text-red-650 rounded-lg hover:bg-white border border-transparent hover:border-gray-100"
                        title="Remove callout"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-gray-600 font-serif italic mb-0.5">"{cl.note}"</p>
                </div>
              );
            })}
          </div>

          {/* Quick spawner for callout */}
          <button
            type="button"
            onClick={() => {
              const label = prompt('Enter visual node detail label (e.g. Haptic Trackpad):', 'Anodized Interface');
              const noteText = prompt('Enter technical specifications description:', 'Seamless touch capacitive surface plate limits.');
              if (label) addCallouts(label, noteText || '');
            }}
            className="w-full py-1.5 bg-gray-5 hover:bg-gray-100 text-slate-705 border rounded-xl font-bold flex items-center justify-center gap-1 text-[10px]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Brand-Linked Callout Node</span>
          </button>
        </div>

        {/* Dimension guides & Materials Configurator */}
        <div className="bg-white border rounded-3xl p-4 space-y-3.5 shadow-2xs">
          <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
            Product CAD Solvers
          </span>

          {/* Add dimensions controller */}
          <div className="space-y-2">
            <span className="block text-[9px] font-mono text-gray-400 uppercase leading-none">Add Dimension Marker Guide</span>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                placeholder="Label (e.g. Leg Base)"
                value={newDimLabel}
                onChange={(e) => setNewDimLabel(e.target.value)}
                className="p-1 px-1.5 bg-gray-5a border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Value (e.g. 720 mm)"
                value={newDimValue}
                onChange={(e) => setNewDimValue(e.target.value)}
                className="p-1 px-1.5 bg-gray-5a border rounded-lg text-xs"
              />
              <select
                value={newDimPos}
                onChange={(e) => setNewDimPos(e.target.value as any)}
                className="p-1 bg-white border rounded-lg text-xs col-span-2"
              >
                <option value="bottom">Bottom Dimension Line</option>
                <option value="left">Left Elevation Height Line</option>
                <option value="right">Right Silhouette Depth Line</option>
                <option value="top">Top Envelope Span Line</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                addDimensionBlock(newDimLabel, newDimValue, newDimPos);
                setNewDimLabel('');
                setNewDimValue('');
              }}
              className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-750 border border-blue-200 rounded-xl text-[9.5px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 shadow-2xs"
            >
              <Ruler className="h-3.5 w-3.5" />
              <span>Map Dimension Vector</span>
            </button>
          </div>

          {/* Add specifications key value */}
          <div className="space-y-1.5 pt-1.5 border-t">
            <span className="block text-[9px] font-mono text-gray-400 uppercase leading-none">Append Performance Metric</span>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                placeholder="Key (e.g. Weight)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="p-1 px-1.5 bg-gray-50 border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Value (e.g. 1.2 kg)"
                value={newSpecVal}
                onChange={(e) => setNewSpecVal(e.target.value)}
                className="p-1 px-1.5 bg-gray-50 border rounded-lg text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                addSpecBlock(newSpecKey, newSpecVal);
                setNewSpecKey('');
                setNewSpecVal('');
              }}
              className="w-full py-1 bg-gray-50 hover:bg-slate-100 border text-[9.5px] font-bold rounded-lg text-slate-700 block text-center"
            >
              Append Metric to Matrix
            </button>
          </div>
        </div>

      </div>

      {/* Export Options Dossier */}
      <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-2xs">
        <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
          Dossier Compiler Exporter Tool
        </span>
        <div className="grid grid-cols-4 gap-2">
          {(['json', 'svg', 'png', 'pdf'] as const).map(fmt => (
            <button
              key={`exp-${fmt}`}
              type="button"
              onClick={() => exportProductSheet(fmt)}
              className="py-2.5 bg-white hover:bg-blue-50/50 border border-gray-200 rounded-xl text-center text-[10px] font-bold uppercase text-slate-700 shadow-2xs flex items-center justify-center gap-1"
            >
              <Download className="h-3 w-3 text-gray-400" />
              <span>{fmt} Spec</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
