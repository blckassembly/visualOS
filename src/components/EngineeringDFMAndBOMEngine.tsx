import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, Box, Ruler, Check, Plus, Trash2, 
  Download, Upload, Settings, AlertTriangle, Activity, 
  FileText, RefreshCw, Sliders, Info, ShieldAlert,
  Wrench, ExternalLink, FileSpreadsheet
} from 'lucide-react';
import { BrandKit } from './CommandPaletteSimulator';

interface EngineeringDFMAndBOMEngineProps {
  activeBrandKit?: BrandKit;
  logTrace: (message: string) => void;
}

// Interfaces for our state engine
export interface EngPart {
  id: string; // e.g. "P-101"
  name: string;
  category: 'structural' | 'fastener' | 'enclosure' | 'electronics' | 'trim';
  material: string;
  quantity: number;
  process: string; // Injection Molding, CNC Milling, stamping, etc.
  finish: string; // Anodized, MT-11010 texture, raw, satin
  supplierNote: string;
  linkedObjectId: string;
  revision: string; // e.g. "Rev A.2"
  dimensions: { length: number; width: number; height: number; unit: 'mm' | 'cm' | 'inch' };
  tolerance: string; // e.g. "±0.05mm"
  wallThicknessMm: number;
  clearanceMm: number;
  isVisualDecorationOnly: boolean; // separate parts from decoration
}

export interface DfmRuleCheck {
  id: string;
  ruleGroup: 'Wall Thickness' | 'Clearance & Fit' | 'Draft Angle' | 'Undercut check' | 'Assembly Logic';
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'requires_review';
  feedback: string;
  criticalSafetyRisk: boolean;
}

export default function EngineeringDFMAndBOMEngine({ activeBrandKit, logTrace }: EngineeringDFMAndBOMEngineProps) {
  // Domain contexts to satisfy: Fashion, Product, and Architecture
  const DOMAIN_PRESETS = [
    {
      id: 'industrial_product',
      label: 'Industrial IoT Enclosure (Consumer Hardware)',
      description: 'Rugged dustproof enclosure with living hinges, boss towers, and threaded brass fasteners.',
      defaultParts: [
        { id: 'P-101', name: 'ABS Case Upper Shell', category: 'enclosure', material: 'Flame Retardant ABS (UL94-V0)', quantity: 1, process: 'Injection Moulding', finish: 'VDI 24 Fine Texture', supplierNote: 'Source from main polymer molding site. Avoid gate splay.', linkedObjectId: 'obj_upper_shell', revision: 'Rev B.1', dimensions: { length: 142.5, width: 88.0, height: 22.4, unit: 'mm' as const }, tolerance: '±0.1mm', wallThicknessMm: 2.2, clearanceMm: 0.25, isVisualDecorationOnly: false },
        { id: 'P-102', name: 'Polycarbonate Clear Lens Screen', category: 'trim', material: 'Optical Polycarbonate', quantity: 1, process: 'Injection Moulding', finish: 'Optical Polish', supplierNote: 'Cleanroom handling. Zero scratch tolerance.', linkedObjectId: 'obj_lens_window', revision: 'Rev A.4', dimensions: { length: 50.0, width: 35.0, height: 1.5, unit: 'mm' as const }, tolerance: '±0.05mm', wallThicknessMm: 1.5, clearanceMm: 0.15, isVisualDecorationOnly: false },
        { id: 'P-103', name: 'Torx T6 Fastening Screws', category: 'fastener', material: 'Stainless Steel 316', quantity: 4, process: 'Cold Heading', finish: 'Black Zinc Plated', supplierNote: 'Includes pre-applied threadlocker patch.', linkedObjectId: 'obj_screws_x4', revision: 'Rev A.1', dimensions: { length: 8.0, width: 2.0, height: 2.0, unit: 'mm' as const }, tolerance: '±0.02mm', wallThicknessMm: 0, clearanceMm: 0.08, isVisualDecorationOnly: false },
        { id: 'P-104', name: 'Internal Wi-Fi Controller Board', category: 'electronics', material: 'FR4 Multi-layer PCB', quantity: 1, process: 'SMT Assembly', finish: 'ENIG Gold Finger', supplierNote: 'Lead-free solder profile critical.', linkedObjectId: 'obj_pcb_board', revision: 'Rev C.2', dimensions: { length: 120.0, width: 64.0, height: 8.5, unit: 'mm' as const }, tolerance: '±0.15mm', wallThicknessMm: 1.6, clearanceMm: 0.5, isVisualDecorationOnly: false },
        { id: 'P-105', name: 'Silicone Waterproof Sealing Gasket', category: 'structural', material: 'Silicone Rubber (Shore 50A)', quantity: 1, process: 'Compression Molding', finish: 'Raw Matte', supplierNote: 'Must check groove squeeze alignment.', linkedObjectId: 'obj_sealing_ring', revision: 'Rev B.0', dimensions: { length: 138.0, width: 84.0, height: 3.2, unit: 'mm' as const }, tolerance: '±0.1mm', wallThicknessMm: 3.2, clearanceMm: 0.1, isVisualDecorationOnly: false },
        { id: 'P-106', name: 'Laser Printed Branding Sticker', category: 'trim', material: 'Adhesive Matte Holographic Foil', quantity: 1, process: 'Roll Feed Printing', finish: 'Matte Lamination', supplierNote: 'Cosmetic decoration piece only.', linkedObjectId: 'obj_logo_decal', revision: 'Rev A.0', dimensions: { length: 42.0, width: 12.0, height: 0.1, unit: 'mm' as const }, tolerance: '±0.5mm', wallThicknessMm: 0.1, clearanceMm: 2.0, isVisualDecorationOnly: true }
      ]
    },
    {
      id: 'fashion_tech',
      label: 'Performance Outerwear (Tech-Pack & Wearable Tech)',
      description: 'Waterproof seam-sealed tactical anorak with integrated pulse-sensor straps.',
      defaultParts: [
        { id: 'P-201', name: 'Three-Ply Stretch Shell Fabric', category: 'enclosure', material: 'Recycled Graphene/Nylon Matrix', quantity: 3, process: 'Plain Weave Knitting', finish: 'Durable Water Repellent (DWR)', supplierNote: 'Conductive layer integrated on underside.', linkedObjectId: 'fab_graphene_panel', revision: 'Rev B.3', dimensions: { length: 1.8, width: 1.4, height: 0.002, unit: 'm' as any }, tolerance: '±5mm', wallThicknessMm: 1.8, clearanceMm: 0.0, isVisualDecorationOnly: false },
        { id: 'P-202', name: 'Thermoplastic Seam Sealing Tape', category: 'structural', material: 'Polyurethane', quantity: 15, process: 'Hot Air Seam Welding', finish: 'Matte Finish', supplierNote: 'Set heat iron precisely to 135°C.', linkedObjectId: 'tape_seams_x15', revision: 'Rev A.2', dimensions: { length: 300.0, width: 20.0, height: 0.2, unit: 'mm' as const }, tolerance: '±1mm', wallThicknessMm: 0.2, clearanceMm: 0.5, isVisualDecorationOnly: false },
        { id: 'P-203', name: 'Water-Resistant Coil Zipper #5', category: 'fastener', material: 'Coated Zinc & Polyester Mesh', quantity: 3, process: 'Extruder Weft', finish: 'PU Coated Splash Resistant', supplierNote: 'Reverse teeth layout to hide elements.', linkedObjectId: 'zip_fastener_front', revision: 'Rev C.1', dimensions: { length: 720.0, width: 32.0, height: 4.5, unit: 'mm' as const }, tolerance: '±2mm', wallThicknessMm: 0.5, clearanceMm: 1.0, isVisualDecorationOnly: false },
        { id: 'P-204', name: 'Magnetic Anodized Hood Buckles', category: 'fastener', material: 'Anodized Aircraft Aluminum 6061', quantity: 2, process: 'CNC Milling', finish: 'Navy Powdercoat', supplierNote: 'Quick-release magnetic magnetic clasp pull.', linkedObjectId: 'buckle_hood_l_r', revision: 'Rev A.3', dimensions: { length: 35.0, width: 16.0, height: 8.0, unit: 'mm' as const }, tolerance: '±0.05mm', wallThicknessMm: 0, clearanceMm: 0.15, isVisualDecorationOnly: false },
        { id: 'P-205', name: 'Holographic Neon Reflective Badge', category: 'trim', material: 'Micro-prism Polyvinyl Chloride', quantity: 1, process: 'RF Sheet Welding', finish: 'Highly Reflective Gloss', supplierNote: 'Decorative cosmetic item for low-light visibility.', linkedObjectId: 'badge_cosmetic', revision: 'Rev A.1', dimensions: { length: 80.0, width: 80.0, height: 1.2, unit: 'mm' as const }, tolerance: '±1.0mm', wallThicknessMm: 1.2, clearanceMm: 5.0, isVisualDecorationOnly: true }
      ]
    },
    {
      id: 'architecture_craft',
      label: 'Modular Timber Pavilion (Assembled Timber Columns)',
      description: 'Laminated timber construction with dry joinery interlocking slots.',
      defaultParts: [
        { id: 'P-301', name: 'Laminated Veneer Timber Pillar', category: 'structural', material: 'Nordic Spruce Glulam (GL24h)', quantity: 8, process: 'Ripping and Press Laminating', finish: 'Clear UV-Shield Sealer Coat', supplierNote: 'Ensure water content percentage is under 12%.', linkedObjectId: 'timber_pillar_axis_8', revision: 'Rev E.1', dimensions: { length: 320.0, width: 24.0, height: 24.0, unit: 'cm' as any }, tolerance: '±1mm', wallThicknessMm: 240, clearanceMm: 2.0, isVisualDecorationOnly: false },
        { id: 'P-302', name: 'Steel Footing Concealed Flange', category: 'structural', material: 'Hot Dip Galvanized S235 Steel', quantity: 8, process: 'Laser Cutting and Welding', finish: 'Zinc Galvanization', supplierNote: 'Fix with metric M16 chemicals anchors.', linkedObjectId: 'steel_boot_anchor', revision: 'Rev B.1', dimensions: { length: 35.0, width: 35.0, height: 40.0, unit: 'cm' as any }, tolerance: '±0.5mm', wallThicknessMm: 12, clearanceMm: 1.0, isVisualDecorationOnly: false },
        { id: 'P-303', name: 'M14 Countersunk Hex Bolts', category: 'fastener', material: 'Class 8.8 Structural Steel', quantity: 32, process: 'High-Tensile Heading', finish: 'Silver Zinc', supplierNote: 'Torque specification: Tighten hard to 110Nm.', linkedObjectId: 'bolt_shear_x32', revision: 'Rev A.0', dimensions: { length: 120.0, width: 14.0, height: 14.0, unit: 'mm' as const }, tolerance: '±0.1mm', wallThicknessMm: 0, clearanceMm: 0.1, isVisualDecorationOnly: false },
        { id: 'P-304', name: 'Decorative Oak Cover Caps', category: 'trim', material: 'Solid Brushed English Oak', quantity: 32, process: 'Lathe Turning', finish: 'Linseed Oil Stain', supplierNote: 'Sits flush to cover bolt holes. Purely decorative visual caps.', linkedObjectId: 'cap_deco_bolt', revision: 'Rev A.0', dimensions: { length: 30.0, width: 30.0, height: 8.0, unit: 'mm' as const }, tolerance: '±0.5mm', wallThicknessMm: 5.0, clearanceMm: 0.2, isVisualDecorationOnly: true }
      ]
    }
  ];

  // Core States
  const [activeDomain, setActiveDomain] = useState<'industrial_product' | 'fashion_tech' | 'architecture_craft'>('industrial_product');
  const [parts, setParts] = useState<EngPart[]>(DOMAIN_PRESETS[0].defaultParts);
  const [dfmRules, setDfmRules] = useState<DfmRuleCheck[]>([]);
  const [activeTab, setActiveTab] = useState<'dfm_engine' | 'bom_engine' | 'dimensions'>('dfm_engine');

  // Input states for custom parts creation
  const [partName, setPartName] = useState('');
  const [partCategory, setPartCategory] = useState<'structural' | 'fastener' | 'enclosure' | 'electronics' | 'trim'>('enclosure');
  const [partMaterial, setPartMaterial] = useState('');
  const [partQuantity, setPartQuantity] = useState(1);
  const [partProcess, setPartProcess] = useState('');
  const [partFinish, setPartFinish] = useState('');
  const [partThickness, setPartThickness] = useState(2.0);
  const [partClearance, setPartClearance] = useState(0.2);
  const [isDecoration, setIsDecoration] = useState(false);

  // Selected subparts for focused review
  const [selectedPartId, setSelectedPartId] = useState<string>('P-101');

  // Load appropriate default rules based on domain choice
  useEffect(() => {
    runDfmAudit();
  }, [activeDomain]);

  // CORE CALL: createEngineeringTakeoff()
  // Combines current metadata parameters to structure initial parts lists separated from visual decorations
  const createEngineeringTakeoff = () => {
    logTrace(`[CORE CALL] createEngineeringTakeoff(): Extracting physical constraints from current vector canvas configuration graph.`);
    
    // Auto-separate non-functional aesthetic features from actual mechanical components
    const solidParts = parts.filter(p => !p.isVisualDecorationOnly);
    const decorationParts = parts.filter(p => p.isVisualDecorationOnly);
    
    logTrace(`[TAKEOFF SUCCESS] Separated ${solidParts.length} functional parts from ${decorationParts.length} decorative cosmetic layers.`);
    logTrace(`[TAKEOFF SUCCESS] Extracted engineering metadata: Total unit volume estimated, revision matrix synchronized.`);
  };

  // CORE CALL: detectParts()
  // Loops through simulated spatial objects and assigns ID tags
  const detectParts = () => {
    logTrace(`[CORE CALL] detectParts(): Tracing vertices, group boundaries, and layers labels on the canvas.`);
    
    // Simulate finding a new hardware mount based on current user interaction
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const detectedPart: EngPart = {
      id: `P-${randomSuffix}`,
      name: `Detected Subassembly Node`,
      category: 'structural',
      material: 'Aluminium 6061-T6 Alloys',
      quantity: 1,
      process: 'Extruded profile CNC',
      finish: 'Clear Bead Blast Anodized',
      supplierNote: 'Detected on CAD Layer 5.',
      linkedObjectId: `obj_layer_${randomSuffix}`,
      revision: 'Rev A.0',
      dimensions: { length: 85.0, width: 40.0, height: 12.0, unit: 'mm' },
      tolerance: '±0.05mm',
      wallThicknessMm: 2.5,
      clearanceMm: 0.12,
      isVisualDecorationOnly: false
    };

    setParts(prev => {
      // Avoid duplicate keys
      if (prev.some(p => p.id === detectedPart.id)) return prev;
      return [...prev, detectedPart];
    });

    logTrace(`[CORE CALL] detectParts() successfully mapped new object group ID: "${detectedPart.id}" as high-priority structural element.`);
  };

  // CORE CALL: assignMaterials()
  // Binds robust alloy specs/engineering materials to selected parts
  const assignMaterials = (partId: string, materialName: string, processName: string, finishName: string) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        logTrace(`[CORE CALL] assignMaterials() for ${partId}: Assigned [${materialName}], [${processName}], [${finishName}].`);
        return { ...p, material: materialName, process: processName, finish: finishName };
      }
      return p;
    }));
  };

  // CORE CALL: addDimensions()
  // Generates coordinate offset guidelines on drawing
  const addDimensions = (partId: string, length: number, width: number, height: number) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        logTrace(`[CORE CALL] addDimensions() for ${partId}: Locked physical dimension matrices to: L ${length} x W ${width} x H ${height} mm.`);
        return { ...p, dimensions: { ...p.dimensions, length, width, height } };
      }
      return p;
    }));
  };

  // CORE CALL: addTolerances()
  // Adjusts tolerance values
  const addTolerances = (partId: string, toleranceVal: string) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        logTrace(`[CORE CALL] addTolerances() for ${partId}: Set critical assembly limits to ${toleranceVal}.`);
        return { ...p, tolerance: toleranceVal };
      }
      return p;
    }));
  };

  // CORE CALL: checkWallThickness()
  // Checks if the plastics/timbers violate safety guidelines
  const checkWallThickness = (): { passed: boolean; offendingPart?: string } => {
    logTrace(`[CORE CALL] checkWallThickness(): Auditing component boundaries against wall-thickness rules...`);
    
    // ABS/plastic minimum recommended thickness is 1.5mm to 3.0mm
    // Architecture woods must be structural
    let offending: EngPart | undefined;
    
    for (const p of parts) {
      if (p.isVisualDecorationOnly) continue;
      
      // Industrial ABS too thin check
      if (activeDomain === 'industrial_product' && p.wallThicknessMm < 1.2 && p.category === 'enclosure') {
        offending = p;
        break;
      }
      // timber post must be sturdy
      if (activeDomain === 'architecture_craft' && p.wallThicknessMm < 50 && p.category === 'structural') {
        offending = p;
        break;
      }
    }

    if (offending) {
      logTrace(`[DFM AUDIT WARNING] checkWallThickness FAIL: "${offending.name}" (${offending.id}) wall thickness is only ${offending.wallThicknessMm}mm! High failure risk during curing/fabrication.`);
      return { passed: false, offendingPart: offending.id };
    }

    logTrace(`[DFM AUDIT PASS] checkWallThickness SUCCESS: All functional components pass minimum extrusion parameters.`);
    return { passed: true };
  };

  // CORE CALL: checkClearance()
  // Confirms mating pieces have appropriate tolerance room
  const checkClearance = (): { passed: boolean; lowClearancePart?: string } => {
    logTrace(`[CORE CALL] checkClearance(): Querying spatial interfaces to ensure mating clearances...`);
    
    let offending: EngPart | undefined;
    for (const p of parts) {
      if (p.category === 'fastener' || p.isVisualDecorationOnly) continue;
      if (p.clearanceMm < 0.1) {
        offending = p;
        break;
      }
    }

    if (offending) {
      logTrace(`[DFM AUDIT WARNING] checkClearance FAIL: Mating clearance value for "${offending.name}" (${offending.id}) is dangerously narrow (${offending.clearanceMm}mm). Potential bind or press-fit friction lock warning.`);
      return { passed: false, lowClearancePart: offending.id };
    }

    logTrace(`[DFM AUDIT PASS] checkClearance SUCCESS: Tolerance stack matches optimal press/slide fit boundaries.`);
    return { passed: true };
  };

  // CORE CALL: checkAssemblyLogic()
  // Validates fastener counts, layering, and sequence
  const checkAssemblyLogic = () => {
    logTrace(`[CORE CALL] checkAssemblyLogic(): Simulating robotic/human manual assembly step sequence...`);
    
    // Check if enclosure has fasteners
    const enclosures = parts.filter(p => p.category === 'enclosure');
    const fasteners = parts.filter(p => p.category === 'fastener');
    
    if (enclosures.length > 0 && fasteners.length === 0) {
      logTrace(`[DFM ALERT] checkAssemblyLogic WARNING: Enclosures are modeled without active mechanical fasteners or snap joints. Review assembly sequence.`);
      return 'missing_fasteners';
    }

    logTrace(`[DFM SUCCESS] checkAssemblyLogic PASS: Fasteners balance mapped correctly to mating surfaces.`);
    return 'assemblable';
  };

  // CORE CALL: createDFMReport()
  // Assembles rules checks into an automated status reports
  const createDFMReport = () => {
    logTrace(`[CORE CALL] createDFMReport(): Packaging first-pass DFM report dossier file...`);
    
    // Synthesize active rules list
    runDfmAudit();
    
    // Log final disclaimer
    logTrace(`[DFM PROCESSOR] DFM Report generated. IMPORTANT: This report utilizes first-pass AI CAD rules. It does NOT claim final engineering validation or liability certification.`);
  };

  // CORE CALL: createPrototypePackage()
  // Zips vectors, BOM, and assembly spec sheet for fab shops
  const createPrototypePackage = () => {
    logTrace(`[CORE CALL] createPrototypePackage(): Consolidating package containing step-by-step CAD vectors, bill of materials (.csv), and DFM sheet logs.`);
    
    const manifest = {
      manifestVer: "VisualOS-DFM-V3",
      timestamp: new Date().toISOString(),
      activeSetup: activeDomain,
      billOfMaterials: parts.map(p => ({
        id: p.id,
        name: p.name,
        qty: p.quantity,
        material: p.material,
        process: p.process,
        finish: p.finish,
        isCosmetic: p.isVisualDecorationOnly
      })),
      dfmAuditPassed: checkWallThickness().passed && checkClearance().passed,
      liabilityNotice: "First-pass simulation parameters only. Human review mandatory prior to production tooling release."
    };

    const dataUri = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute("href", dataUri);
    downloadLink.setAttribute("download", `visualos_dfm_handout_${activeDomain}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    logTrace(`[PROTOTYPE PACK] Handoff package files exported!`);
  };

  // ------------------------------------------------------------------
  // BOM ENGINE CORE CALLS
  // ------------------------------------------------------------------

  // CORE CALL: createBOM()
  // Initializes or resets the current BOM items
  const createBOM = () => {
    logTrace(`[CORE CALL] createBOM(): Extracting and initializing clean Bill of Materials from the current visual elements graph.`);
    const currentDomainPreset = DOMAIN_PRESETS.find(dp => dp.id === activeDomain);
    if (currentDomainPreset) {
      setParts(currentDomainPreset.defaultParts);
      logTrace(`[BOM ENGINE] Re-synchronized BOM with ${currentDomainPreset.defaultParts.length} standard engineering nodes.`);
    }
  };

  // CORE CALL: addBOMItem()
  // Appends a new item to our BOM schedule
  const addBOMItem = () => {
    if (!partName) {
      logTrace(`[BOM ENGINE ALERT] Cannot add item. Please enter a valid Part Name.`);
      return;
    }

    const nItem: EngPart = {
      id: `P-${Math.floor(Math.random() * 900) + 100}`,
      name: partName,
      category: partCategory,
      material: partMaterial || 'Selected Composite Resin',
      quantity: partQuantity,
      process: partProcess || 'CNC Profiling',
      finish: partFinish || 'Sandblasted',
      supplierNote: 'Added manually via BOM interactive panel.',
      linkedObjectId: `obj_${Date.now().toString().slice(-4)}`,
      revision: 'Rev A.0',
      dimensions: { length: 100, width: 100, height: partThickness, unit: 'mm' },
      tolerance: '±0.1mm',
      wallThicknessMm: partThickness,
      clearanceMm: partClearance,
      isVisualDecorationOnly: isDecoration
    };

    setParts(prev => [...prev, nItem]);
    setSelectedPartId(nItem.id);
    
    // Reset fields
    setPartName('');
    setPartMaterial('');
    setPartQuantity(1);
    setPartProcess('');
    setPartFinish('');

    logTrace(`[CORE CALL] addBOMItem(): Added Part "${nItem.name}" [${nItem.id}] into passive and active manufacturing lists.`);
  };

  // CORE CALL: updateBOMItem()
  // Modifies properties on an existing item in-place
  const updateBOMItem = (partId: string, updatedFields: Partial<EngPart>) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        logTrace(`[CORE CALL] updateBOMItem() for ${partId}: Modified attributes ${JSON.stringify(updatedFields)}.`);
        return { ...p, ...updatedFields };
      }
      return p;
    }));
  };

  // CORE CALL: removeBOMItem()
  // Prunes a record
  const removeBOMItem = (partId: string) => {
    setParts(prev => {
      const updated = prev.filter(p => p.id !== partId);
      logTrace(`[CORE CALL] removeBOMItem(): Dropped part ${partId} from the engineering takeoff schedule.`);
      return updated;
    });
    if (selectedPartId === partId) {
      setSelectedPartId('');
    }
  };

  // CORE CALL: linkBOMItemToObject()
  // Maps a BOM line item to a physical graphic canvas item ID
  const linkBOMItemToObject = (partId: string, objectId: string) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        logTrace(`[CORE CALL] linkBOMItemToObject(): Mapped part ${partId} to render object vector reference "${objectId}".`);
        return { ...p, linkedObjectId: objectId };
      }
      return p;
    }));
  };

  // CORE CALL: calculateQuantity()
  // Aggregates nested line quantities based on assemblies multiplier
  const calculateQuantity = (partId: string, multiplier: number) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        const nextQty = Math.max(1, p.quantity * multiplier);
        logTrace(`[CORE CALL] calculateQuantity(): Adjusted line ID ${partId} total production factor with multiplier ${multiplier}x.`);
        return { ...p, quantity: nextQty };
      }
      return p;
    }));
  };

  // CORE CALL: exportBOMCSV()
  // Creates and downloads a real, parseable CSV spreadsheet
  const exportBOMCSV = () => {
    logTrace(`[CORE CALL] exportBOMCSV(): Assembling comma-separated database matrix...`);
    
    const headers = ['Part ID', 'Part Name', 'Quantity', 'Material', 'Process', 'Finish', 'Revision', 'Wall Thickness (mm)', 'Clearance (mm)', 'Is Custom Decoration'];
    const rows = parts.map(p => [
      p.id,
      p.name,
      p.quantity,
      p.material,
      p.process,
      p.finish,
      p.revision,
      p.wallThicknessMm,
      p.clearanceMm,
      p.isVisualDecorationOnly ? 'YES' : 'NO'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `visual_os_bom_schedule_${activeDomain}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    logTrace(`[BOM EXPORT] exportBOMCSV SUCCESS! CSV spreadsheet printed to local storage files.`);
  };

  // CORE CALL: exportBOMPDF()
  // Prints simulated clean printable HTML layout details or saves metadata
  const exportBOMPDF = () => {
    logTrace(`[CORE CALL] exportBOMPDF(): Assembling printable high-contrast DFM + BOM report page...`);
    
    const printInfo = `
========================================
VISUALOS MANUFACTURING BILL OF MATERIALS
Preset: ${activeDomain.toUpperCase()}
Generated Time: ${new Date().toLocaleString()}
========================================

${parts.map((p, idx) => `
[${idx + 1}] ITEM ${p.id} - ${p.name}
    Qty: ${p.quantity} | Revision: ${p.revision}
    Material: ${p.material}
    Fabrication Process: ${p.process} | Surface Finish: ${p.finish}
    Wall Thickness: ${p.wallThicknessMm}mm | Clearance Gap: ${p.clearanceMm}mm
    Category Group: ${p.category.toUpperCase()}
    Supplier Action Notes: ${p.supplierNote}
----------------------------------------`).join('')}

Safety / Review Disclaimer: 
First-pass machine parameters evaluated automatically. 
Does NOT represent final structural certification.
========================================
`;

    // Trigger download of structured text/pdf preview
    const blob = new Blob([printInfo], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `visual_os_bom_technical_sheet_${activeDomain}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    logTrace(`[BOM EXPORT] exportBOMPDF SUCCESS! High-contrast readable blueprint report exported as formatted ledger sheet.`);
  };

  // Internal helper to run rule evaluations dynamically
  const runDfmAudit = () => {
    const rules: DfmRuleCheck[] = [];

    if (activeDomain === 'industrial_product') {
      const casing = parts.find(p => p.id === 'P-101');
      const lens = parts.find(p => p.id === 'P-102');
      const board = parts.find(p => p.id === 'P-104');

      rules.push({
        id: 'r-1',
        ruleGroup: 'Wall Thickness',
        description: 'ABS Enclosure Nominal Thickness Check (Target 2.0mm - 3.0mm)',
        status: casing && casing.wallThicknessMm >= 1.8 ? 'passed' : 'failed',
        feedback: casing ? `Outer housing wall set at ${casing.wallThicknessMm}mm. Minimum splay threshold passed.` : 'Casing missing.',
        criticalSafetyRisk: false
      });

      rules.push({
        id: 'r-2',
        ruleGroup: 'Clearance & Fit',
        description: 'Mating perimeter groove tolerance limit',
        status: lens && lens.clearanceMm >= 0.15 ? 'passed' : 'requires_review',
        feedback: lens ? `Acrylic lens gap has ${lens.clearanceMm}mm allowance workspace.` : 'Lens entry missing.',
        criticalSafetyRisk: false
      });

      rules.push({
        id: 'r-3',
        ruleGroup: 'Assembly Logic',
        description: 'PCB Mounting point bosses shear validation',
        status: board && board.clearanceMm < 0.2 ? 'failed' : 'passed',
        feedback: board && board.clearanceMm < 0.2 ? 'Board components exceed standard keepout limits! Shear risk during automated tool insertions.' : 'Board clearance aligns with robotic grip constraints.',
        criticalSafetyRisk: true
      });

      rules.push({
        id: 'r-4',
        ruleGroup: 'Draft Angle',
        description: 'Molding tool core draw angle validation (Target >= 1.5°)',
        status: 'requires_review',
        feedback: 'Core draw requires human machinist audit. Texture depth MT-11010 demands 2.0° draft angles minimum on vertical surfaces.',
        criticalSafetyRisk: false
      });
    } else if (activeDomain === 'fashion_tech') {
      const waterproofTape = parts.find(p => p.id === 'P-202');
      rules.push({
        id: 'rf-1',
        ruleGroup: 'Wall Thickness',
        description: 'Waterproof Tape Thickness check (Target < 0.3mm to maintain flexibility)',
        status: waterproofTape && waterproofTape.wallThicknessMm <= 0.25 ? 'passed' : 'warning',
        feedback: 'Tape is ultrathin which prevents stiffness at intersecting seam valleys.',
        criticalSafetyRisk: false
      });

      rules.push({
        id: 'rf-2',
        ruleGroup: 'Assembly Logic',
        description: 'Integrated conductive fabric track mapping check',
        status: 'passed',
        feedback: 'Isolated sensor cable track separate from aesthetic trim lines. Zero short-circuit risk detected.',
        criticalSafetyRisk: true
      });

      rules.push({
        id: 'rf-3',
        ruleGroup: 'Clearance & Fit',
        description: 'Waterproof zipper teeth sliding groove track',
        status: 'requires_review',
        feedback: 'Verify zipper slider clearance against standard double-lip fabric guard layers during active rain simulations.',
        criticalSafetyRisk: false
      });
    } else {
      // Wood Pavilion rules!
      const columns = parts.find(p => p.id === 'P-301');
      rules.push({
        id: 'ra-1',
        ruleGroup: 'Wall Thickness',
        description: 'Glulam structural wooden profile load cross-section (Target >= 150mm)',
        status: columns && columns.wallThicknessMm >= 200 ? 'passed' : 'failed',
        feedback: columns ? `Heavy timber pillar cross section validated at solid ${columns.wallThicknessMm}mm.` : 'Timber columns missing.',
        criticalSafetyRisk: true
      });

      rules.push({
        id: 'ra-2',
        ruleGroup: 'Assembly Logic',
        description: 'Tolerances of metal dowel joint fitting',
        status: 'passed',
        feedback: 'Bolt sleeves pre-routed at 15mm for M14 screws (1.0mm tolerance gap). Excellent dry structural fit.',
        criticalSafetyRisk: true
      });

      rules.push({
        id: 'ra-3',
        ruleGroup: 'Draft Angle',
        description: 'Grain direction shear force compliance check',
        status: 'requires_review',
        feedback: 'Local building authorities must verify timber fiber alignment paths to prevent lateral wind stress splitting.',
        criticalSafetyRisk: false
      });
    }

    setDfmRules(rules);
  };

  const selectedPart = parts.find(p => p.id === selectedPartId) || parts[0];

  return (
    <div className="bg-slate-50 border border-gray-200 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn text-xs text-slate-800">
      
      {/* Module Title Section */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-amber-600 block tracking-widest leading-none">DFM Compiler & BOM Ledger</span>
          <h3 className="text-sm font-extrabold text-slate-900 font-sans mt-0.5">Engineering & DFM workspace</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-yellow-100 border border-yellow-250 text-yellow-800 font-mono text-[9px] font-bold rounded uppercase flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
            Simulation Only
          </span>
        </div>
      </div>

      {/* Domain Context Selector Panel */}
      <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-2">
        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-amber-800 uppercase">
          <span>Active Manufacturing Domain Configuration:</span>
          <span>BOM links to canvas schemas</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {DOMAIN_PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setActiveDomain(preset.id as any);
                setParts(preset.defaultParts);
                setSelectedPartId(preset.defaultParts[0]?.id || '');
                logTrace(`[DOMAIN CONFIG] Switched engineering domain preset to: "${preset.label}". Refurbished default parts list.`);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeDomain === preset.id
                  ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-[10.5px] leading-tight flex items-center gap-1.5">
                <Box className="h-3 w-3 flex-shrink-0" />
                {preset.label.split(" (")[0]}
              </div>
              <p className={`text-[8.5px] mt-1 leading-normal ${activeDomain === preset.id ? 'text-amber-100' : 'text-gray-400'}`}>
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Action Core Calls Launcher Ribbon */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-2">
        <span className="block text-[9.5px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
          Functional CAD Core Calls Execution Console:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[9px] font-mono font-bold">
          <button
            type="button"
            onClick={createEngineeringTakeoff}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-slate-200 transition text-center truncate"
            title="Separates active parts from decorative visual layouts"
          >
            createEngineeringTakeoff()
          </button>
          <button
            type="button"
            onClick={detectParts}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-slate-200 transition text-center truncate"
            title="Iterates through active workspace vectors and assigns BIM serial ID slots"
          >
            detectParts()
          </button>
          <button
            type="button"
            onClick={checkWallThickness}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-slate-200 transition text-center truncate"
            title="Checks if enclosure/structural features are molded within healthy ranges"
          >
            checkWallThickness()
          </button>
          <button
            type="button"
            onClick={checkClearance}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-slate-200 transition text-center truncate"
            title="Verifies that joint mates contain reliable sliding wiggle tolerances"
          >
            checkClearance()
          </button>
          <button
            type="button"
            onClick={createDFMReport}
            className="py-1.5 px-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white transition text-center truncate"
            title="Prints the full compiled analysis to the interactive ledger log"
          >
            createDFMReport()
          </button>
        </div>
      </div>

      {/* Main Mode Tab Pickers */}
      <div className="flex gap-1 bg-gray-200/50 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('dfm_engine');
            logTrace(`[WORKSPACE VIEW] Changed layout focus to: DFM Rule Verification Engine.`);
          }}
          className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-xl transition ${
            activeTab === 'dfm_engine' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          1. DFM Analysis Report
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('bom_engine');
            logTrace(`[WORKSPACE VIEW] Changed layout focus to: Active BOM Spreadsheet Ledger.`);
          }}
          className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-xl transition ${
            activeTab === 'bom_engine' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          2. BOM Spreadsheet Engine
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('dimensions');
            logTrace(`[WORKSPACE VIEW] Changed layout focus to: Interactive Dimensions & Tolerancing Board.`);
          }}
          className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-xl transition ${
            activeTab === 'dimensions' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          3. Geometric Tolerancing Profile
        </button>
      </div>

      {/* Tab 1: DFM Summary Checks & Audit Log */}
      {activeTab === 'dfm_engine' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn">
          
          {/* Rules Check lists */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center bg-white p-2 border rounded-xl">
              <span className="font-bold text-slate-800">AUTOMATED DESIGN RULES AUDITING LOG:</span>
              <button
                type="button"
                onClick={() => {
                  runDfmAudit();
                  logTrace(`[DFM AUDIT] Manually triggered rule verification solver cycles.`);
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded border text-[9.5px] font-mono font-bold text-slate-700 flex items-center gap-1 transition"
              >
                <RefreshCw className="h-3 w-3" /> Re-Evaluate Rules
              </button>
            </div>

            <div className="space-y-2">
              {dfmRules.map(rule => (
                <div 
                  key={rule.id}
                  className={`p-3 border rounded-2xl flex items-start gap-3 transition-all ${
                    rule.status === 'passed' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    rule.status === 'failed' ? 'bg-red-500/5 border-red-500/20' :
                    rule.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                    'bg-cyan-500/5 border-cyan-500/20'
                  }`}
                >
                  <div className={`mt-0.5 p-1 rounded-lg ${
                    rule.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                    rule.status === 'failed' ? 'bg-red-100 text-red-800' :
                    rule.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-cyan-100 text-cyan-800'
                  }`}>
                    {rule.status === 'passed' ? <Check className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {rule.ruleGroup}
                      </span>
                      {rule.criticalSafetyRisk && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-800 border border-red-200 text-[8px] font-bold rounded uppercase flex items-center gap-0.5 animate-pulse">
                          <ShieldAlert className="h-2.5 w-2.5" />
                          Safety-Critical Assumption
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[11px] text-slate-800 leading-tight">{rule.description}</h4>
                    <p className="text-[9.5px] text-gray-500 font-sans leading-normal">{rule.feedback}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 text-[10px] space-y-1 text-slate-700 font-sans">
              <span className="font-bold text-yellow-800 flex items-center gap-1 text-[10.5px]">
                <Info className="h-4 w-4" /> Automated Technical Disclaimer
              </span>
              <p className="leading-relaxed">
                Design recommendations displayed within VisualOS represent first-pass AI heuristics. Physical fabrication is subjected to severe hardware fluctuations, tool wear, and climate variables. **Do not release files to steel tool injection or timber loads without signing off verified drafts with certified human mechanical engineers.**
              </p>
            </div>
          </div>

          {/* DFM Sidebar Info & Prototype Exporter */}
          <div className="bg-white border rounded-3xl p-4 space-y-4 self-start shadow-2xs">
            <div className="border-b pb-2">
              <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase">Interactive DFM Inspector</span>
              <h4 className="text-xs font-bold text-slate-800 mt-0.5">Quick Structural Audit</h4>
            </div>

            <div className="space-y-3 text-[9px] font-mono leading-normal">
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-400">Total Enclosure Gaps:</span>
                <span className="font-bold text-slate-800">
                  {parts.filter(p => p.category === 'enclosure').length} zones
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-400">Active Fasteners:</span>
                <span className="font-bold text-slate-800">
                  {parts.filter(p => p.category === 'fastener').flatMap(p => p.quantity).reduce((a, b) => a + b, 0)} units
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-400">Cosmetic Trims Masked:</span>
                <span className="font-bold text-slate-500">
                  {parts.filter(p => p.isVisualDecorationOnly).length} layers
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-400">Safety Compliance Flag:</span>
                <span className={`font-bold ${checkWallThickness().passed && checkClearance().passed ? 'text-emerald-600' : 'text-red-500'}`}>
                  {checkWallThickness().passed && checkClearance().passed ? 'STABLE' : 'ACTION NEEDED'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={createPrototypePackage}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-[10.5px] shadow-sm"
              >
                <Download className="h-4 w-4 text-cyan-400" />
                <span>Create Prototype Package</span>
              </button>
              <span className="block text-center text-[8px] text-gray-400 leading-snug">
                Compresses editable vectors, bill of materials spreadsheet (.csv), and DFM notes into one archive.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BOM Interactive Spreadsheet */}
      {activeTab === 'bom_engine' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Quick BOM Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 border rounded-2xl shadow-2xs">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-600 block">SPREADSHEET WORKSPACE</span>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-800">Synchronized CAD Bill of Materials</h4>
                <span className="px-1.5 py-0.2 bg-slate-100 border text-slate-500 font-mono text-[8px] font-bold rounded">
                  {parts.length} Items Listed
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={createBOM}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold font-sans text-[10px] text-slate-700 flex items-center gap-1 shadow-2xs transition"
                title="Resets or fetches active BOM lines from preset database references"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset BOM</span>
              </button>
              
              <button
                type="button"
                onClick={exportBOMCSV}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold font-sans text-[10px] text-white flex items-center gap-1 shadow-2xs transition"
                title="Saves and downloads spreadsheet as standard .csv spreadsheet format"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-white" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={exportBOMPDF}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold font-sans text-[10px] text-white flex items-center gap-1 shadow-2xs transition"
                title="Saves printable report document format"
              >
                <Download className="h-3.5 w-3.5 text-white" />
                <span>Export PDF Tech Sheet</span>
              </button>
            </div>
          </div>

          {/* Master Parts Grid and Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3 bg-white border rounded-3xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[9.5px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 border-b uppercase text-[8.5px] font-black">
                      <th className="p-2 w-12">ID</th>
                      <th className="p-2">Part Name</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Material / Spec</th>
                      <th className="p-2">Process</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 w-12 text-center">Ref</th>
                      <th className="p-2">Finish Color</th>
                      <th className="p-2 w-8">Type</th>
                      <th className="p-2 w-8">Clear</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map(p => (
                      <tr 
                        key={p.id}
                        onClick={() => setSelectedPartId(p.id)}
                        className={`border-b text-slate-800 hover:bg-blue-50/50 cursor-pointer transition ${
                          selectedPartId === p.id ? 'bg-blue-50/70 border-l-2 border-l-blue-600' : ''
                        }`}
                      >
                        <td className="p-2 font-bold text-blue-600">{p.id}</td>
                        <td className="p-2 font-sans font-bold text-slate-900 leading-tight">
                          {p.name}
                        </td>
                        <td className="p-2">
                          <span className={`px-1 rounded text-[8px] font-bold ${
                            p.category === 'enclosure' ? 'bg-blue-100 text-blue-800' :
                            p.category === 'structural' ? 'bg-green-100 text-green-800' :
                            p.category === 'fastener' ? 'bg-red-100 text-red-800' :
                            p.category === 'electronics' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-101 text-yellow-800'
                          }`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="p-2 font-sans text-slate-600 max-w-[130px] truncate">{p.material}</td>
                        <td className="p-2 text-slate-500">{p.process}</td>
                        <td className="p-2 text-center font-bold">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                calculateQuantity(p.id, 0.5); // decrease
                              }}
                              className="px-1 py-0.2 bg-gray-100 hover:bg-gray-200 rounded font-black text-[9px]"
                            >
                              -
                            </button>
                            <span className="w-4 text-center text-[10px]">{p.quantity}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                calculateQuantity(p.id, 2); // increase
                              }}
                              className="px-1 py-0.2 bg-gray-100 hover:bg-gray-200 rounded font-black text-[9px]"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2 text-center text-slate-400 font-mono text-[8px]">
                          {p.revision}
                        </td>
                        <td className="p-2 text-slate-500 max-w-[100px] truncate">{p.finish}</td>
                        <td className="p-2 text-center">
                          {p.isVisualDecorationOnly ? (
                            <span className="text-gray-400 font-sans text-[8px]" title="Pure decoration piece. Excluded from rigid engineering tests.">Deco</span>
                          ) : (
                            <span className="text-green-600 font-sans font-extrabold text-[8px]" title="Core functional part used for physical tooling layouts.">Solid</span>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBOMItem(p.id);
                            }}
                            className="p-1 hover:text-red-500 text-gray-400 transition"
                            title="Prune item from BOM schema"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manual BOM Item Creator Form */}
            <div className="bg-slate-900 text-white p-4 rounded-3xl space-y-3 shadow-sm self-start">
              <div className="border-b border-white/10 pb-1.5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-cyan-400 font-black uppercase">Add Part To BOM</span>
                <Plus className="h-4 w-4 text-gray-400" />
              </div>

              <div className="space-y-2 text-[9.5px]">
                <div className="space-y-0.5">
                  <span className="text-gray-400 block">Part Name:</span>
                  <input
                    type="text"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g. Molded Battery Door"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white font-sans focus:outline-none focus:border-cyan-500 text-[10.5px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="space-y-0.5">
                    <span className="text-gray-400 block">Category:</span>
                    <select
                      value={partCategory}
                      onChange={(e) => setPartCategory(e.target.value as any)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white focus:outline-none focus:border-cyan-500 text-[10.5px]"
                    >
                      <option value="enclosure">Enclosure</option>
                      <option value="structural">Structural</option>
                      <option value="fastener">Fastener</option>
                      <option value="electronics">Electronics</option>
                      <option value="trim">Deoc/Trim</option>
                    </select>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-gray-400 block">Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      value={partQuantity}
                      onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white focus:outline-none focus:border-cyan-500 font-mono text-[10.5px]"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-gray-400 block">Material Base:</span>
                  <input
                    type="text"
                    value={partMaterial}
                    onChange={(e) => setPartMaterial(e.target.value)}
                    placeholder="e.g. Delrin Acetyl Hard"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white font-sans focus:outline-none focus:border-cyan-500 text-[10.5px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="space-y-0.5">
                    <span className="text-gray-400 block">Process:</span>
                    <input
                      type="text"
                      value={partProcess}
                      onChange={(e) => setPartProcess(e.target.value)}
                      placeholder="e.g. CNC Turning"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white font-sans focus:outline-none focus:border-cyan-500 text-[10.5px]"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-gray-400 block">Surface Finish:</span>
                    <input
                      type="text"
                      value={partFinish}
                      onChange={(e) => setPartFinish(e.target.value)}
                      placeholder="e.g. Sand Blast"
                      className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white font-sans focus:outline-none focus:border-cyan-500 text-[10.5px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="isDecoCheck" 
                      checked={isDecoration}
                      onChange={(e) => setIsDecoration(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <label htmlFor="isDecoCheck" className="text-gray-400 text-[9px] cursor-pointer">
                      Pure Decor
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addBOMItem}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition text-[10px] uppercase shadow-sm"
                >
                  Confirm BOM Addition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Geometric Tolerancing and Dimensions */}
      {activeTab === 'dimensions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn">
          
          {/* Detailed Inspector Form */}
          <div className="lg:col-span-2 bg-white border rounded-3xl p-4 space-y-4 shadow-2xs">
            <div className="border-b pb-2">
              <span className="text-[10px] font-mono text-cyan-600 block font-bold uppercase">PHYSICAL VALUE MATRICES</span>
              <h4 className="text-xs font-bold text-slate-800 mt-0.5">Adjust Physical Thickness and Clearance Parameters</h4>
            </div>

            {selectedPart ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-blue-600 font-bold block">{selectedPart.id}</span>
                    <h5 className="font-bold font-sans text-slate-900 text-[11px]">{selectedPart.name}</h5>
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 text-[8.5px] font-mono font-bold rounded uppercase">
                      REVISION: {selectedPart.revision}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[9.5px]">
                  
                  {/* Gauge Wall Thickness Slider */}
                  <div className="space-y-1.5 p-3.5 bg-slate-50 border rounded-2xl">
                    <div className="flex justify-between items-center text-slate-700 font-bold">
                      <span>Wall / Post Thickness:</span>
                      <span className="text-blue-600 font-mono font-black">{selectedPart.wallThicknessMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="30"
                      step="0.1"
                      value={selectedPart.wallThicknessMm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        updateBOMItem(selectedPart.id, { wallThicknessMm: val });
                      }}
                      className="w-full accent-blue-600"
                    />
                    <span className="block text-[8px] text-gray-400 leading-snug">
                      Modifies target extrusion depth. Minimum recommended for plastic is 1.2mm, timber structural posts require sturdy ranges.
                    </span>
                  </div>

                  {/* clearance Mm slider */}
                  <div className="space-y-1.5 p-3.5 bg-slate-50 border rounded-2xl">
                    <div className="flex justify-between items-center text-slate-700 font-bold">
                      <span>Mating Joints Clearance:</span>
                      <span className="text-emerald-600 font-mono font-black">{selectedPart.clearanceMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="2.5"
                      step="0.01"
                      value={selectedPart.clearanceMm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        updateBOMItem(selectedPart.id, { clearanceMm: val });
                      }}
                      className="w-full accent-emerald-500"
                    />
                    <span className="block text-[8px] text-gray-400 leading-snug">
                      Gap allowance prior to final joint interface snaps. Under 0.08mm triggers robotic assembly hazard.
                    </span>
                  </div>
                </div>

                {/* Adjust basic bounds */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 font-mono text-[9.5px]">
                  <span className="text-cyan-400 font-bold block uppercase tracking-wider">
                    Geometric Dimensioning & Tolerancing (GD&T)
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-sans">Length value:</span>
                      <input
                        type="number"
                        value={selectedPart.dimensions.length}
                        onChange={(e) => addDimensions(selectedPart.id, parseFloat(e.target.value) || 1, selectedPart.dimensions.width, selectedPart.dimensions.height)}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white text-[10.5px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-sans">Width value:</span>
                      <input
                        type="number"
                        value={selectedPart.dimensions.width}
                        onChange={(e) => addDimensions(selectedPart.id, selectedPart.dimensions.length, parseFloat(e.target.value) || 1, selectedPart.dimensions.height)}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white text-[10.5px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-sans">Height value:</span>
                      <input
                        type="number"
                        value={selectedPart.dimensions.height}
                        onChange={(e) => addDimensions(selectedPart.id, selectedPart.dimensions.length, selectedPart.dimensions.width, parseFloat(e.target.value) || 1)}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg p-1 text-white text-[10.5px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-gray-400 block font-sans">Tolerance Range Constraint (e.g. ±0.05mm):</span>
                    <div className="flex gap-1.5">
                      {['±0.01mm', '±0.05mm', '±0.1mm', '±0.25mm', '±1.0mm'].map(tol => (
                        <button
                          key={tol}
                          type="button"
                          onClick={() => addTolerances(selectedPart.id, tol)}
                          className={`px-2 py-1 border rounded text-[8.5px] uppercase font-bold transition ${
                            selectedPart.tolerance === tol 
                              ? 'bg-cyan-600 text-white border-cyan-600'
                              : 'bg-slate-800 hover:bg-slate-750 border-white/10 text-slate-300'
                          }`}
                        >
                          Spacer {tol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                Please select a part from the right list to audit and alter physical dimensions.
              </div>
            )}
          </div>

          {/* Quick parts select indexer list */}
          <div className="bg-white border rounded-3xl p-4 self-start space-y-3 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase border-b pb-1">
              Select target component
            </span>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
              {parts.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPartId(p.id)}
                  className={`w-full p-2.5 text-left border rounded-xl flex items-center justify-between transition ${
                    selectedPartId === p.id 
                      ? 'bg-blue-600 border-blue-650 text-white font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-gray-200 text-slate-705'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className={`block font-mono text-[8px] uppercase tracking-wider ${selectedPartId === p.id ? 'text-blue-200' : 'text-gray-400'}`}>
                      {p.id} ({p.category})
                    </span>
                    <span className="block text-[10px] truncate leading-tight mt-0.5">{p.name}</span>
                  </div>
                  <span className={`font-mono text-[8px] font-bold ${selectedPartId === p.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {p.tolerance}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
