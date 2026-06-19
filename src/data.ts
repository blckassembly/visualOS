/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ProblemCard,
  WorkflowStep,
  ModuleItem,
  UseCaseItem,
  CommandExample,
  ExportCategory,
  QCEntry,
  PresetCanvas
} from './types';

export const PROBLEM_CARDS: ProblemCard[] = [
  {
    id: 'flat-images',
    title: 'Flat AI images break professional workflows',
    description: 'Generative tools spit out final pixel grids that can’t be engineered, edited, or imported into CAD/Figma. If one letter is off, you have to prompt from scratch.'
  },
  {
    id: 'designer-control',
    title: 'Designers need layers, vectors, and brand guidelines',
    description: 'You cannot scale a brand or layout without explicit bezier controls, precise pixel alignments, separate text bounding boxes, and consistent typography tables.'
  },
  {
    id: 'product-requirements',
    title: 'Product teams need DFM, BOM, and micro-dimensions',
    description: 'An image of a sneaker or a watch contains no scale or material metadata. VisualOS outputs actual thickness details, bill of materials, and manufacturing tolerances.'
  },
  {
    id: 'manufacturer-input',
    title: 'Manufacturers need cleaner inputs before starting prototypes',
    description: 'Factories reject moodboards. VisualOS compiles industrial schemas, manufacturing line assignments, and structured PDFs that shorten quoting cycles from weeks to hours.'
  }
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { step: '01', title: 'Prompt or upload', description: 'Describe any physical component, UI flow, or upload flat design sketches as starting references.', badge: 'AI Parser' },
  { step: '02', title: 'Canvas generation', description: 'VisualOS instantly initialises an active workspace holding infinite coordinate design blocks.', badge: 'Virtual Workspace' },
  { step: '03', title: 'Layers & structures', description: 'Everything is generated into layered canvas elements, separating graphics, dimensions, and callouts.', badge: 'Layer Engine' },
  { step: '04', title: 'Vector objects', description: 'Automatic conversion of flat shapes to editable SVGs, with clean anchors and bezier coordinates.', badge: 'SVG Vectoriser' },
  { step: '05', title: 'Raster polish', description: 'Inject, blend, and mask high-fidelity textures, textures-sets, and refined render elements seamlessly.', badge: 'Bake Texture' },
  { step: '06', title: 'Brand/UI modules', description: 'Attach layout properties, color palettes, spacing tables, and strict brand identity rules.', badge: 'Preset Rules' },
  { step: '07', title: 'DFM + BOM compilation', description: 'Run engineering constraints to automatically calculate physical dimensions, materials, and parts trees.', badge: 'QC Engine' },
  { step: '08', title: 'Export package', description: 'Download raw production files, structured PDF guides, and manufacturing routing parameters.', badge: 'Ready to Ship' }
];

export const MODULE_CARDS: ModuleItem[] = [
  { name: 'Canvas System', tag: 'OS Core', description: 'Infinite viewport environment operating at 60fps with absolute precision coordinates and interactive snapping.', iconName: 'Grid' },
  { name: 'Command Palette', tag: 'Fast Actions', description: 'The interactive system terminal. Type actions to instantly construct, scale, or export elements without menus.', iconName: 'Terminal' },
  { name: 'Layer Manager', tag: 'Nesting', description: 'Surgical control over vector objects, editable text, metadata matrices, and multi-state overrides.', iconName: 'Layers' },
  { name: 'Vector Engine', tag: 'Bezier Curves', description: 'Instantly convert flat lines or raster sketches into edit-ready, mathematical bezier paths and vector layers.', iconName: 'Bezier' },
  { name: 'Raster Image Engine', tag: 'AI Inpainting', description: 'High-res image upscaling, generative layout filling, and intelligent transparent background cuts.', iconName: 'Image' },
  { name: 'Layout Engine', tag: 'AutoLayout', description: 'Intelligent relative positioning. Moves and nests blocks dynamically when dimensions or texts shift.', iconName: 'Move' },
  { name: 'Typography Engine', tag: 'Tables', description: 'Strict type alignments, font weights, and text scale metrics paired to global brand sheets.', iconName: 'Type' },
  { name: 'Brand Identity Engine', tag: 'Assets', description: 'Automatic generation of brand guides, custom token spreadsheets, and theme-compliant color swatches.', iconName: 'Compass' },
  { name: 'UI/UX Engine', tag: 'Prototypes', description: 'Build mock dashboards, button behaviors, screen connection wireframes, and raw CSS styles.', iconName: 'Layers3' },
  { name: 'Product Sheet Generator', tag: 'Handoff', description: 'Automated layout system formatting technical drawings, specifications, and text blocks into callout sheets.', iconName: 'FileText' },
  { name: 'Industrial Design Engine', tag: '3D Orthographic', description: 'Create front, side, orthographic, and isometric schematics from prompts or raster photos.', iconName: 'Box' },
  { name: 'Fashion Tech Pack Engine', tag: 'Apparel', description: 'Generates detailed clothing flats, stitch tolerances, trim parameters, and size specification systems.', iconName: 'Scissors' },
  { name: 'Architecture Drawing Engine', tag: 'Plans', description: 'Produces scaled layout plans, interactive room schedules, layout zones, and material lists.', iconName: 'Ruler' },
  { name: 'Engineering + DFM Engine', tag: 'Validation', description: 'Design for Manufacturing compliance checks. Validates wall thickness, interference fits, and edge radius.', iconName: 'Cpu' },
  { name: 'BOM Engine', tag: 'Estimations', description: 'Compiles real-time structured Bills of Materials, detailing each constituent part, material class, and quantities.', iconName: 'ListChecks' },
  { name: 'Export Manager', tag: 'Universal Packager', description: 'Packs assets into robust zip outputs containing SVGs, CSV spreadsheets, 3D target coordinates, and PDFs.', iconName: 'Download' },
  { name: 'Quality Verification Engine', tag: 'Linter', description: 'Continuous audit monitoring text overflows, color compliance, open vector shapes, and scale errors.', iconName: 'ShieldCheck' },
  { name: 'Unbox Engineering Engine', tag: 'Modularity', description: 'Breaks complex machines, vehicles, and products into modular structural block trees.', iconName: 'Share2' }
];

export const USE_CASES: UseCaseItem[] = [
  {
    title: 'Business cards and letterheads',
    category: 'graphics',
    description: 'Instant corporate stationery generation. Outputs perfect vector assets with custom localized dimensions, CMYK color swatches, and margins.',
    outputs: ['SVG Layout', 'Print PDF', 'Color Matrix JSON'],
    visualType: 'business-card'
  },
  {
    title: 'Brand systems and pitch sheets',
    category: 'graphics',
    description: 'Comprehensive brand standards compiled with modular style tokens, master typography matrices, primary colors, and structural layout guides.',
    outputs: ['Brand Token Sheet', 'Asset Library', 'Design PDF'],
    visualType: 'brand-system'
  },
  {
    title: 'UI screens and UX flows',
    category: 'graphics',
    description: 'Prompt-assembled software layouts. Draws mock dashboards, controls, sidebars, and overlays while keeping each button and heading text fully editable.',
    outputs: ['Figma-ready SVG', 'Tailwind CSS Classes', 'Interactive Flow'],
    visualType: 'ui-ux'
  },
  {
    title: 'Product concepts and callout sheets',
    category: 'industrial',
    description: 'Beautiful industrial renders surrounded by technical arrows, hardware material callouts, and performance specification blocks.',
    outputs: ['Exploded Render', 'Dimension Blueprint', 'Material Specs'],
    visualType: 'product-concept'
  },
  {
    title: 'Fashion flats and tech packs',
    category: 'apparel',
    description: 'Front and rear orthographic garment flats. Maps stitching tracks, trims, zippers, fabric classes, and sizing tolerance guidelines.',
    outputs: ['Sewing Spec Sheet', 'Stitch Guide SVG', 'Colorways PDF'],
    visualType: 'tech-pack'
  },
  {
    title: 'Architecture plans and room schedules',
    category: 'architecture',
    description: 'Bespoke layouts for floor arrangements, room areas, stair vectors, window margins, and structured carpentry lists.',
    outputs: ['Scaled Floorplan SVG', 'Area Schedule CSV', 'PDF Layout'],
    visualType: 'architecture'
  },
  {
    title: 'Industrial design sketches',
    category: 'industrial',
    description: 'Convert raw client napkin sketches into crisp CAD-like line layouts with fully verified proportions and perspective angles.',
    outputs: ['Vector Blueprint', 'Perspective CAD Plan', 'Orthographic PDF'],
    visualType: 'industrial-sketch'
  },
  {
    title: 'DFM reports and BOMs',
    category: 'industrial',
    description: 'Audits physical designs against strict injection modeling or CNC tolerances, listing materials, assembly sequences, and cost factors.',
    outputs: ['BOM Spreadsheet', 'DFM Audit Report', 'Tolerances JSON'],
    visualType: 'dfm-bom'
  },
  {
    title: 'Prototype quote packages',
    category: 'industrial',
    description: 'Prepares an absolute bundle ready for physical production quotes, summarizing the BOM, STEP coordinates, and custom materials sheet.',
    outputs: ['BOM Manifest', 'Production PDF', 'Factory Package ZIP'],
    visualType: 'quote-package'
  },
  {
    title: 'Unboxed manufacturing modules',
    category: 'architecture',
    description: 'Unbox heavy layouts (e.g. EV battery pods, smart kiosks) into distinct sub-component models, showing spatial dependencies.',
    outputs: ['Module Tree Manifest', 'Assembly Line Schema', 'BOM CSV'],
    visualType: 'unbox-module'
  }
];

export const COMMAND_PALETTE_EXAMPLES: CommandExample[] = [
  {
    command: '/create canvas business card',
    description: 'Spawns a 3.5" x 2" layout canvas with text blocks, logo constraints, brand guidelines, and print marks.',
    actionLabel: 'Bootstrap Card Layout',
    simulatedOutput: 'Generated Card Canvas (3.5" x 2.0") with 8 vectorized layout nodes.',
    outputType: 'vector'
  },
  {
    command: '/upload brand guide',
    description: 'Extracts hex colors, core fonts, logomarks, and margins from custom document and binds them to the workspace rules.',
    actionLabel: 'Extract Style Rules',
    simulatedOutput: 'Registered 4 primary colors, 2 font families (Outfit, Fira Code), and global padding constants.',
    outputType: 'list'
  },
  {
    command: '/trace image to vector',
    description: 'Traces any active raster object into editable vector anchors, smooth bezier lines, and fill polygons.',
    actionLabel: 'Convert to SVGs',
    simulatedOutput: 'Vectorized image block into 142 distinct high-integrity SVG vector nodes.',
    outputType: 'vector'
  },
  {
    command: '/generate product sheet',
    description: 'Turns the active item into a detailed product guide complete with callouts, annotations, and a spec table.',
    actionLabel: 'Compile Tech Sheet',
    simulatedOutput: 'Formatted orthographic projection with 6 leader lines and material annotations.',
    outputType: 'sheet'
  },
  {
    command: '/create UI flow',
    description: 'Renders multiple app interactive boards and draws logical lines mapping interactions.',
    actionLabel: 'Wireframe Dashboard',
    simulatedOutput: 'Instantiated /dashboard, /settings, /billing layout screens stacked with editable layer arrays.',
    outputType: 'vector'
  },
  {
    command: '/create fashion tech pack',
    description: 'Creates a full sizing specification canvas for any apparel flat, calculating seams and trims.',
    actionLabel: 'Compile Tech Pack',
    simulatedOutput: 'Initialized sizing grid (Sizes S to XXL), stitching metrics table, and trim manifest.',
    outputType: 'sheet'
  },
  {
    command: '/unbox EV into modules',
    description: 'Segments electric vehicles into separate sub-assemply canvas zones: chassis, battery pod, body, and infotainment cabinet.',
    actionLabel: 'Sub-module Parsing',
    simulatedOutput: 'Disassembled drivetrain and engine assets into 6 module trees containing item-lock hierarchies.',
    outputType: 'unboxed'
  },
  {
    command: '/export DFM package',
    description: 'Performs wall checks and prints out fully-compliant production packages containing STEP coordinates, BOM, and PDF specs.',
    actionLabel: 'Run Factory Build',
    simulatedOutput: 'Verified 14 thickness markers. Compiled manufacturing-ready bundle (DFM_Package_r4.zip).',
    outputType: 'sheet'
  }
];

export const EXPORT_CATEGORIES: ExportCategory[] = [
  {
    title: 'Design Exports',
    badge: 'Vector & Raster Master Files',
    formats: ['JPEG (High fidelity)', 'PNG (Alpha channel transparency)', 'Layered Vector PDF', 'Raw SVG Paths', '.visualos (Raw native)', 'JSON System Schema Manifest'],
    highlight: 'Retains raw layer names, colors, text blocks, and bezier math.'
  },
  {
    title: 'Product Exports',
    badge: 'Hardware & Spec Guides',
    formats: ['Polished Product Specification sheet', 'Part-Callout Technical Drawing PDF', 'Engineering DFM Compliance Report', 'Active item Bill of Materials', 'Factory-ready Prototype spec bundle'],
    highlight: 'Scale-locked layout featuring direct measurements.'
  },
  {
    title: 'Fashion Exports',
    badge: 'Apparel & Tech Materials',
    formats: ['Complete Technical Pack PDF handbook', 'Colorway mapping sheet (Pantone)', 'Garment size measurement table PDF', 'Hardware trim and binding inventory list', 'Thread/Stitch detailed BOM list'],
    highlight: 'Includes sizing tolerance variables and stitching coordinates.'
  },
  {
    title: 'Architecture Exports',
    badge: 'Plans & BIM Schedules',
    formats: ['Scaled blueprint floor plan PDF', 'High-res structural SVG drawing', 'DXF targeting standard CAD imports', 'BIM Room occupancy layout scale list', 'Material classification schedule sheet'],
    highlight: 'Strictly preserves scale ratios (1:50, 1:100).'
  },
  {
    title: 'Manufacturing Exports',
    badge: 'Direct Machine-ready Packages',
    formats: ['Absolute physical scale token manifest', 'CSV Parts list configured with BOM details', 'Manufacturing Execution System routing JSON', 'Full DFM tolerance spreadsheet', 'Factory-quote assembly guide pack'],
    highlight: 'Formatted for rapid machine translation.'
  }
];

export const QC_ENTRIES: QCEntry[] = [
  { name: 'Component Alignment Check', status: 'clean', details: 'All vector blocks snapped perfectly to 4px spacing tracks.', category: 'Aesthetics' },
  { name: 'Layer Name Audit', status: 'warning', details: 'Found 4 unnamed shapes ("Group 41", "Layer 9") that break the DFM hierarchy tags.', category: 'Handoff' },
  { name: 'Text Boundary Overflow', status: 'clean', details: 'No content boundary leaks. All description elements fit container bounds.', category: 'Aesthetics' },
  { name: 'Brand Compliance (Colors)', status: 'clean', details: 'All fills and strokes align with active Outfit stylesheet tokens.', category: 'Aesthetics' },
  { name: 'Aspect Ratio Mismatch', status: 'clean', details: 'Current canvas (3.5" x 2") complies with selected US-Standard standards.', category: 'Aesthetics' },
  { name: 'Material Dimension Scale', status: 'critical', details: '"Chassis Plate #2" structural elements do not have specified physical depth.', category: 'CAD' },
  { name: 'Edge Thickness Audit', status: 'warning', details: 'CNC edge radius of brackets drops below 0.8mm inside pockets.', category: 'CAD' },
  { name: 'Material Specification', status: 'critical', details: '"Battery Pod bracket" misses component material class definition.', category: 'CAD' },
  { name: 'Human Review Flag Check', status: 'clean', details: 'All custom engineer overrides approved for production routing.', category: 'Handoff' }
];

export const PRESET_CANVASES: PresetCanvas[] = [
  {
    id: 'architecture',
    name: 'Smart Retail Kiosk Floorplan',
    category: 'Architecture',
    promptExample: 'Generate retail layout with CAD schedules',
    dimensions: 'Scale 1:50 | 4.2m x 3.6m',
    layers: ['Furniture Schedule', 'Electrical Anchors', 'Vector Walls', 'Dimension Lines', 'Text Annotations'],
    bomItems: ['Tempered Glass panel (4)', 'Heavy Extruded Aluminum frame', 'Active LED visual sign board', 'Custom Carpentry cabinet'],
    dfmChecks: [
      { label: 'Scale validation', pass: true },
      { label: 'Clearance verification', pass: true },
      { label: 'Structural thickness', pass: false }
    ],
    elements: [
      { id: '1', type: 'vector', x: 20, y: 30, width: 220, height: 160, label: 'Kiosk Shell Outline', color: 'border-blue-500 bg-blue-500/10' },
      { id: '2', type: 'vector', x: 40, y: 50, width: 80, height: 120, label: 'Countertop Area', color: 'border-slate-400 bg-slate-500/10' },
      { id: '3', type: 'dimension', x: 20, y: 195, width: 220, height: 15, label: 'Scale Lock: 4200mm' },
      { id: '4', type: 'text', x: 130, y: 60, width: 90, height: 40, label: 'Display Pod (LED 4K)' }
    ]
  },
  {
    id: 'hardware',
    name: 'Watch Dial Assembly Specifications',
    category: 'Industrial Design',
    promptExample: 'Compile wrist watch face dimensions with materials',
    dimensions: 'Scale 4:1 | 42.0mm Diameter',
    layers: ['Laser Bezel Specs', 'Hour Markers Offset', 'Subdial Callouts', 'Crown Mechanics', 'BOM Manifest'],
    bomItems: ['Sapphire crystal lens', '316L Stainless steel core casing', 'FKM rubber strap module', 'Miyota chronograph engine'],
    dfmChecks: [
      { label: 'Edge radii constraints', pass: true },
      { label: 'Gasket seal tolerances', pass: true },
      { label: 'BOM material matches', pass: true }
    ],
    elements: [
      { id: '1', type: 'vector', x: 60, y: 20, width: 140, height: 140, label: 'Inner Bezel Ø 42mm', color: 'border-emerald-500 bg-emerald-500/5' },
      { id: '2', type: 'palette', x: 215, y: 20, width: 20, height: 100, label: 'Pantone Steel Space', color: 'border-slate-500 bg-slate-100' },
      { id: '3', type: 'dimension', x: 60, y: 165, width: 140, height: 15, label: 'Diameter Lock: 42.00mm' },
      { id: '4', type: 'text', x: 75, y: 80, width: 110, height: 30, label: 'Laser-Etched Chrono Grid' }
    ]
  },
  {
    id: 'fashion',
    name: 'Eco-Canvas Travelpack Techpack',
    category: 'Fashion Techpack',
    promptExample: 'Generate water resistance zipper layout spec with components',
    dimensions: 'Scale 1:5 | 45cm x 30cm x 15cm',
    layers: ['Zipper Track Tolerances', 'Waterproof Backing', 'Pocket Stitch Margins', 'Strap Stress Vectors', 'Bill of Materials'],
    bomItems: ['1200D Eco-canvas shell', 'YKK Aquaguard #8 zipper (3)', 'Duraflex plastic slider', 'Reclaim padding mesh'],
    dfmChecks: [
      { label: 'Seam thickness allowances', pass: true },
      { label: 'Stress point bar-tacks', pass: false },
      { label: 'Colorway PMS constraints', pass: true }
    ],
    elements: [
      { id: '1', type: 'vector', x: 30, y: 25, width: 160, height: 150, label: 'Main Compartment Flat', color: 'border-cyan-500 bg-cyan-500/10' },
      { id: '2', type: 'vector', x: 45, y: 70, width: 130, height: 10, label: 'YKK Aquaguard Rail', color: 'border-indigo-400 bg-slate-900' },
      { id: '3', type: 'dimension', x: 30, y: 180, width: 160, height: 15, label: 'Height Lock: 450mm' },
      { id: '4', type: 'text', x: 45, y: 90, width: 130, height: 70, label: 'Padded Strap Anchoring System' }
    ]
  }
];
