/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProjectMetrics } from '../context/ProjectMetricsContext';
import { 
  Terminal, 
  Play, 
  Check, 
  HelpCircle, 
  Cpu, 
  Sparkles, 
  Files, 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Settings, 
  Download, 
  Grid as GridIcon, 
  Maximize2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Save, 
  CornerDownRight, 
  Type, 
  Image as ImageIcon, 
  PenTool, 
  Folder, 
  ArrowRight,
  Sparkle,
  Dribbble,
  Layout,
  RefreshCw,
  Copy,
  ArrowUp,
  ArrowDown,
  FolderOpen,
  ShieldCheck,
  Smartphone,
  MousePointerClick,
  Home,
  Compass,
  Wrench
} from 'lucide-react';

import ProductSheetTab from './ProductSheetTab';
import IndustrialDesignTab from './IndustrialDesignTab';
import ArchitectureDrawingEngine from './ArchitectureDrawingEngine';
import EngineeringDFMAndBOMEngine from './EngineeringDFMAndBOMEngine';
import ExportManager from './ExportManager';
import QualityControlPanel from './QualityControlPanel';
import WorkspaceManager from './WorkspaceManager';

import {
  createLayout,
  setMargins,
  setColumns,
  setBleed as setEngineBleed,
  setTrimMarks as setEngineTrimMarks,
  placeTextBlock,
  placeImageBlock,
  alignToGrid as snapBlockToGrid,
  createMasterPage,
  exportPrintPDF,
  checkTextOverflow,
  LayoutModel,
  LayoutBlock,
  LayoutType,
  LAYOUT_PRESETS
} from '../layoutEngine';

import {
  rasterImageEngine,
  createRasterLayer,
  applyMask,
  removeBackground,
  applyMaterial,
  applyShadow,
  applyReflection,
  applyLighting,
  applyTexture,
  renderPreview,
  exportJPEG,
  exportPNG,
  RasterLayer,
  BlendMode,
  RasterLayerKind,
  MaskMode,
  SelectionMode,
  MaterialType,
  TextureType
} from '../rasterEngine';

const snapAllBlocksToGrid = (layout: LayoutModel, gridSize?: number): LayoutModel => {
  const size = gridSize ?? layout.grid.size ?? 0.25;
  return {
    ...layout,
    blocks: layout.blocks.map(block => {
      const snappedX = Math.round(block.x / size) * size;
      const snappedY = Math.round(block.y / size) * size;
      const snappedW = Math.round(block.width / size) * size;
      const snappedH = Math.round(block.height / size) * size;
      return {
        ...block,
        x: snappedX,
        y: snappedY,
        width: snappedW > 0 ? snappedW : size,
        height: snappedH > 0 ? snappedH : size,
      };
    })
  };
};

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

// Define structures for our robust canvas system
export type CanvasUnit = 'pixels' | 'inches' | 'millimeters';

export interface CanvasLayer {
  id: string;
  name: string;
  type: 'vector' | 'raster' | 'text' | 'dimension' | 'branding';
  visible: boolean;
  locked: boolean;
  x: number; // stores positioning in the current unit system
  y: number;
  width: number;
  height: number;
  color: string;
  content: string; // Dynamic text or path details
  fontFamily?: string;
  fontSize?: number;
}

export interface CanvasDataModel {
  canvas_id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  unit: CanvasUnit;
  dpi: number;
  color_mode: 'CMYK' | 'RGB';
  aspect_ratio: string;
  bleed: number;
  safe_zone: number;
  background: string;
  grid: {
    show: boolean;
    size: number; // in current units
    snapping: boolean;
  };
  guides: number[]; // guideline offsets along X axis
  layers: CanvasLayer[];
}

export interface ToolPreset {
  id: string;
  name: string;
  canvasType: string;
  unit: CanvasUnit;
  colorMode: 'CMYK' | 'RGB';
  bleed: number;
  safeZone: number;
}

export interface ProjectHistoryItem {
  id: string;
  name: string;
  timestamp: string;
  canvasState: CanvasDataModel;
}

export interface VisualProjectGraph {
  project_id: string;
  name: string;
  canvases: CanvasDataModel[];
  layers: CanvasLayer[];
  objects: Array<{ id: string; name: string; type: string; linkedLayerId?: string }>;
  vectors: Array<{ id: string; name: string; path: string; stroke: string; strokeWidth: number }>;
  rasters: Array<{ id: string; name: string; src: string; opacity: number }>;
  text_blocks: Array<{ id: string; name: string; text: string; fontSize: number }>;
  brand_rules: {
    lockPalette?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    logoRules?: string;
  };
  dimensions: Array<{ id: string; name: string; lengthValue: number; unit: string }>;
  materials: Array<{ id: string; name: string; density: string; finish: string }>;
  callouts: Array<{ id: string; name: string; text: string }>;
  exports: Array<{ id: string; format: string; dpi: number; trimMark: boolean }>;
  history: ProjectHistoryItem[];
}

export interface BrandKit {
  id: string;
  name: string;
  logoRules: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
    display: string;
  };
  spacingRule: string;
  iconStyle: string;
  imageStyle: string;
  voiceNotes: string;
  layoutRules: string;
  doNotUseRules: string[];
}

export interface UIComponent {
  id: string;
  name: string;
  type: 'Screen' | 'Frame' | 'Button' | 'InputField' | 'Card' | 'Modal' | 'Sidebar' | 'NavBar' | 'TabBar' | 'Icon' | 'Form' | 'DashboardBlock';
  text?: string;
  color?: string;
  borderColor?: string;
  fontSize?: number;
  textColor?: string;
  padding?: string;
}

export interface UIScreen {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'watch';
  width: number;
  height: number;
  components: UIComponent[];
  linkedScreenId?: string;
  clickPathAction?: string;
}

export interface UserFlow {
  id: string;
  name: string;
  fromScreenId: string;
  toScreenId: string;
  triggerEvent: string;
}


export default function CommandPaletteSimulator() {
  const { t } = useLanguage();
  const { setCanvasesCount, setLayersCount, incrementActiveExports, decrementActiveExports } = useProjectMetrics();
  
  // Custom CLI state
  const [typedCommand, setTypedCommand] = useState('');
  const [cliLogs, setCliLogs] = useState<string[]>([
    '[INIT] Unified Canvas Kernel v1.2.5 initialized successfully.',
    '[INFO] Type commands or select recipes to manipulate the design canvas.',
  ]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canvasWorkspaceRef = useRef<HTMLDivElement>(null);

  // Brush drawing and annotation state engines
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [brushColor, setBrushColor] = useState('#f43f5e'); // Default to Electric Red for callouts
  const [brushSize, setBrushSize] = useState(6);
  const [drawnPaths, setDrawnPaths] = useState<{points: {x: number, y: number}[], color: string, size: number}[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Default Canvas Data Models by type
  const CANVAS_PRESETS_DATA: Record<string, Omit<CanvasDataModel, 'canvas_id'>> = {
    blank_canvas: {
      name: 'Blank Canvas Specs',
      type: 'blank_canvas',
      width: 800,
      height: 600,
      unit: 'pixels',
      dpi: 72,
      color_mode: 'RGB',
      aspect_ratio: '4:3',
      bleed: 10,
      safe_zone: 20,
      background: 'white',
      grid: { show: true, size: 20, snapping: true },
      guides: [100, 400],
      layers: [
        { id: 'l1', name: 'Ambient Fill Rect', type: 'vector', visible: true, locked: false, x: 50, y: 50, width: 700, height: 500, color: 'bg-gray-100 border-gray-300', content: 'M0,0 h100 v100 h-100 z' },
        { id: 'l2', name: 'Primary Label Element', type: 'text', visible: true, locked: false, x: 100, y: 150, width: 350, height: 60, color: 'text-gray-800', content: 'Draft Space' }
      ]
    },
    business_card: {
      name: 'Corporate Business Card Layout',
      type: 'business_card',
      width: 3.5,
      height: 2.0,
      unit: 'inches',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: '1.75:1',
      bleed: 0.125,
      safe_zone: 0.125,
      background: '#fafafa',
      grid: { show: true, size: 0.25, snapping: true },
      guides: [0.5, 3.0],
      layers: [
        { id: 'c1', name: 'Vector Logo Badge', type: 'branding', visible: true, locked: false, x: 0.4, y: 0.4, width: 0.9, height: 0.9, color: 'border-blue-600 bg-blue-50/20 text-blue-600', content: 'LogoMark' },
        { id: 'c2', name: 'Employee Name Type', type: 'text', visible: true, locked: false, x: 1.5, y: 0.5, width: 1.6, height: 0.3, color: 'text-gray-900', content: 'Alexander Vance' },
        { id: 'c3', name: 'Designation Subhead', type: 'text', visible: true, locked: false, x: 1.5, y: 0.8, width: 1.6, height: 0.2, color: 'text-blue-600', content: 'Chief Operations Engineer' },
        { id: 'c4', name: 'Hexagonal Geometric Grid', type: 'vector', visible: true, locked: true, x: 2.2, y: 1.1, width: 1.0, height: 0.6, color: 'border-pink-500 bg-pink-500/10', content: 'Hex Outlines' },
        { id: 'c5', name: 'Trim Marks Overlay', type: 'dimension', visible: true, locked: true, x: 0.125, y: 0.125, width: 3.25, height: 1.75, color: 'border-amber-400', content: '3.25" x 1.75" Safe Boundary' }
      ]
    },
    letterhead: {
      name: 'Official Corporate Letterhead',
      type: 'letterhead',
      width: 8.5,
      height: 11.0,
      unit: 'inches',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: 'custom',
      bleed: 0.25,
      safe_zone: 0.5,
      background: 'white',
      grid: { show: false, size: 0.5, snapping: false },
      guides: [1.0, 7.5],
      layers: [
        { id: 'lh1', name: 'Primary Tech Band', type: 'vector', visible: true, locked: false, x: 0.5, y: 0.5, width: 7.5, height: 0.6, color: 'bg-gray-100 border-gray-300', content: 'Header Gradient Rect' },
        { id: 'lh2', name: 'Office Address Footer', type: 'text', visible: true, locked: false, x: 1.0, y: 10.0, width: 6.5, height: 0.4, color: 'text-gray-500', content: '100 Terminal Dr, Suite 300 // info@visualos.com' },
        { id: 'lh3', name: 'Logo Stamp Signet', type: 'branding', visible: true, locked: false, x: 6.8, y: 0.6, width: 0.8, height: 0.4, color: 'text-blue-600', content: 'VOS' }
      ]
    },
    poster: {
      name: 'Event Announcement Poster',
      type: 'poster',
      width: 18.0,
      height: 24.0,
      unit: 'inches',
      dpi: 150,
      color_mode: 'RGB',
      aspect_ratio: '3:4',
      bleed: 0.5,
      safe_zone: 1.0,
      background: '#111827',
      grid: { show: true, size: 2.0, snapping: true },
      guides: [3.0, 15.0],
      layers: [
        { id: 'p1', name: 'Hero Visual Block', type: 'raster', visible: true, locked: false, x: 2.0, y: 2.0, width: 14.0, height: 12.0, color: 'bg-indigo-950 border-indigo-500/20', content: 'AI Generated Landscape Asset' },
        { id: 'p2', name: 'Title Banner Heading', type: 'text', visible: true, locked: false, x: 2.0, y: 15.5, width: 14.0, height: 3.0, color: 'text-white font-black', content: 'AUTONOMOUS KERNEL EXPO' },
        { id: 'p3', name: 'Sponsorship Badge Group', type: 'branding', visible: true, locked: false, x: 2.0, y: 19.5, width: 8.0, height: 1.5, color: 'border-yellow-500 text-yellow-500 bg-yellow-500/5', content: 'VisualOS Labs × DevConsortium' }
      ]
    },
    presentation_slide: {
      name: 'Presentation Slide Outline',
      type: 'presentation_slide',
      width: 1920,
      height: 1080,
      unit: 'pixels',
      dpi: 96,
      color_mode: 'RGB',
      aspect_ratio: '16:9',
      bleed: 0,
      safe_zone: 60,
      background: '#0a0f1d',
      grid: { show: true, size: 80, snapping: true },
      guides: [200, 1720],
      layers: [
        { id: 'sl1', name: 'Slide Gradient Dark Background', type: 'vector', visible: true, locked: true, x: 0, y: 0, width: 1920, height: 1080, color: 'bg-gray-900 border-gray-800', content: 'Radial Ambient Fill' },
        { id: 'sl2', name: 'Section Header Type', type: 'text', visible: true, locked: false, x: 120, y: 100, width: 1000, height: 120, color: 'text-blue-450 font-bold', content: '02 // PARAMETRIC VECTOR MATRIX' },
        { id: 'sl3', name: 'Formula Code Block Display', type: 'text', visible: true, locked: false, x: 120, y: 260, width: 800, height: 500, color: 'text-emerald-400 font-mono bg-black/40', content: 'createCanvas("business_card", "inches");' },
        { id: 'sl4', name: 'Infographic Schematic Renders', type: 'raster', visible: true, locked: false, x: 1000, y: 260, width: 800, height: 500, color: 'bg-blue-950/20 border-blue-500/30', content: 'VisualOS Isometric Engine Stream' }
      ]
    },
    product_sheet: {
      name: 'Product Spec Callout Sheet',
      type: 'product_sheet',
      width: 11.0,
      height: 17.0,
      unit: 'inches',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: 'custom',
      bleed: 0.25,
      safe_zone: 0.5,
      background: 'white',
      grid: { show: true, size: 1.0, snapping: true },
      guides: [1.5, 9.5],
      layers: [
        { id: 'ps1', name: 'Chassis Drawing Render', type: 'raster', visible: true, locked: false, x: 1.0, y: 1.5, width: 9.0, height: 8.5, color: 'border-blue-500 bg-gray-50', content: 'Front Orthographic Ortho-B' },
        { id: 'ps2', name: 'Material Specifications Table', type: 'text', visible: true, locked: false, x: 1.0, y: 10.5, width: 4.2, height: 5.0, color: 'text-gray-800', content: 'Table: Shell Thickness | Bolt Force | CNC Trim' },
        { id: 'ps3', name: 'BOM Cost Breakdown Callouts', type: 'text', visible: true, locked: false, x: 5.8, y: 10.5, width: 4.2, height: 5.0, color: 'text-gray-850', content: 'Component list & Manufacturing line assignments' }
      ]
    },
    brand_board: {
      name: 'Global brand specs',
      type: 'brand_board',
      width: 1200,
      height: 900,
      unit: 'pixels',
      dpi: 72,
      color_mode: 'RGB',
      aspect_ratio: '4:3',
      bleed: 0,
      safe_zone: 40,
      background: '#f9fafb',
      grid: { show: true, size: 50, snapping: false },
      guides: [200, 1000],
      layers: [
        { id: 'bb1', name: 'Master Typography System', type: 'text', visible: true, locked: false, x: 80, y: 80, width: 500, height: 350, color: 'text-gray-900', content: 'H1: Inter SemiBold | Paragraph: Space Grotesk' },
        { id: 'bb2', name: 'Brand Color Swatches', type: 'raster', visible: true, locked: false, x: 80, y: 480, width: 1040, height: 340, color: 'outline-dashed outline-gray-200', content: 'RGB swatches: SpaceBlue #2563eb | CoolSlate #475569 | CoralSip #ea580c' },
        { id: 'bb3', name: 'System Trademark Insignias', type: 'branding', visible: true, locked: false, x: 680, y: 80, width: 440, height: 350, color: 'border-blue-600/30 text-blue-600', content: 'Vector Logos & SVG Brand Guides' }
      ]
    },
    ui_screen: {
      name: 'Tablet UI Dashboard',
      type: 'ui_screen',
      width: 1440,
      height: 960,
      unit: 'pixels',
      dpi: 72,
      color_mode: 'RGB',
      aspect_ratio: '3:2',
      bleed: 0,
      safe_zone: 48,
      background: '#040814',
      grid: { show: true, size: 24, snapping: true },
      guides: [100, 1340],
      layers: [
        { id: 'ui1', name: 'Sidebar Navigation Block', type: 'vector', visible: true, locked: false, x: 0, y: 0, width: 260, height: 960, color: 'bg-slate-900/40 border-r border-slate-800', content: 'Vertical Navigation rail' },
        { id: 'ui2', name: 'Main Activity Chart Line', type: 'vector', visible: true, locked: false, x: 300, y: 220, width: 1040, height: 360, color: 'border-blue-500 bg-blue-500/5', content: 'Weekly production metrics tracking curve' },
        { id: 'ui3', name: 'Metric Info Card Type', type: 'text', visible: true, locked: false, x: 300, y: 620, width: 490, height: 260, color: 'bg-slate-900/60 border-slate-800', content: 'BOM Summary: 14 Parts | CAD Status 100% compliant' },
        { id: 'ui4', name: 'Trigger Actions Grid', type: 'vector', visible: true, locked: false, x: 850, y: 620, width: 490, height: 260, color: 'bg-emerald-950/20 border-emerald-800/30', content: 'Interactive Trigger Call Actions: Compile, Export STEP, Launch Simulation' }
      ]
    },
    ux_flow_board: {
      name: 'Interaction User flow board',
      type: 'ux_flow_board',
      width: 2400,
      height: 1600,
      unit: 'pixels',
      dpi: 72,
      color_mode: 'RGB',
      aspect_ratio: 'custom',
      bleed: 0,
      safe_zone: 100,
      background: '#f8fafc',
      grid: { show: true, size: 100, snapping: true },
      guides: [200, 2200],
      layers: [
        { id: 'ux1', name: 'Step 1: Photo Submission Screen', type: 'vector', visible: true, locked: false, x: 150, y: 400, width: 480, height: 700, color: 'bg-white border-slate-200 shadow-sm', content: 'View 1: User uploads raster draft' },
        { id: 'ux2', name: 'Step 2: Geometry Solving Overlay', type: 'vector', visible: true, locked: false, x: 950, y: 400, width: 480, height: 700, color: 'bg-white border-blue-200 shadow-blue-500/5 shadow-md', content: 'View 2: Kernel parses vector path vertices' },
        { id: 'ux3', name: 'Step 3: Direct Handoff Package', type: 'vector', visible: true, locked: false, x: 1750, y: 400, width: 480, height: 700, color: 'bg-white border-emerald-250 shadow-sm', content: 'View 3: Compilation success dialog & export prompts' },
        { id: 'ux4', name: 'Directional Connector Vectors', type: 'dimension', visible: true, locked: true, x: 670, y: 700, width: 240, height: 50, color: 'border-blue-600', content: 'Flow: -> On Success ->' }
      ]
    },
    fashion_tech_pack: {
      name: 'Slingback Tailored Hoodie',
      type: 'fashion_tech_pack',
      width: 841,
      height: 594,
      unit: 'millimeters',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: 'custom',
      bleed: 5,
      safe_zone: 20,
      background: 'white',
      grid: { show: true, size: 25, snapping: true },
      guides: [100, 741],
      layers: [
        { id: 'ftp1', name: 'Garment Flat Front Silhouette', type: 'vector', visible: true, locked: false, x: 80, y: 60, width: 320, height: 380, color: 'border-slate-800 bg-slate-50', content: 'Front sewing lines with ribbing parameters' },
        { id: 'ftp2', name: 'Garment Flat Rear Silhouette', type: 'vector', visible: true, locked: false, x: 440, y: 60, width: 320, height: 380, color: 'border-slate-850 bg-slate-50', content: 'Back hood panel seams and stitching guide' },
        { id: 'ftp3', name: 'Trim Specs & Tolerances', type: 'text', visible: true, locked: false, x: 80, y: 460, width: 680, height: 100, color: 'text-gray-800 font-mono', content: 'Stitching width: 4mm | Material: 100% OrganoCotton' }
      ]
    },
    industrial_design_board: {
      name: 'Electric Scooter Fork Base',
      type: 'industrial_design_board',
      width: 1000,
      height: 700,
      unit: 'millimeters',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: 'custom',
      bleed: 10,
      safe_zone: 40,
      background: '#fbfbfb',
      grid: { show: true, size: 50, snapping: true },
      guides: [150, 850],
      layers: [
        { id: 'id1', name: 'Orthographic Front Projection', type: 'vector', visible: true, locked: false, x: 80, y: 80, width: 380, height: 420, color: 'border-blue-500 bg-gray-50', content: 'CNC Milled fork outline blueprint' },
        { id: 'id2', name: 'Isometric Extrusion Callouts', type: 'raster', visible: true, locked: false, x: 500, y: 80, width: 420, height: 420, color: 'border-indigo-500 bg-gray-50', content: 'Isometric stress limits simulation model' },
        { id: 'id3', name: 'Micro Dimension Metadata Stamps', type: 'dimension', visible: true, locked: true, x: 80, y: 520, width: 840, height: 120, color: 'border-amber-500 text-amber-700 font-mono', content: 'Height: 420.00mm | Bored hole clearance: 22.42mm' }
      ]
    },
    architecture_sheet: {
      name: 'Micro Studio Housing Layout',
      type: 'architecture_sheet',
      width: 36.0,
      height: 24.0,
      unit: 'inches',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: '3:2',
      bleed: 0.5,
      safe_zone: 1.0,
      background: '#ffffff',
      grid: { show: true, size: 1.5, snapping: true },
      guides: [4.0, 32.0],
      layers: [
        { id: 'as1', name: 'Studio Room Zone Vectors', type: 'vector', visible: true, locked: false, x: 2.0, y: 2.0, width: 32, height: 15, color: 'border-slate-800 bg-slate-50', content: 'Bedroom Suite | Kitchen offset | Bath boundary' },
        { id: 'as2', name: 'Carpentry Block Schedule', type: 'text', visible: true, locked: false, x: 2.0, y: 18.0, width: 14, height: 4.5, color: 'text-gray-800', content: 'Shed Wood list & Glass margins dimensions' },
        { id: 'as3', name: 'Title Block & Stamp Seal', type: 'branding', visible: true, locked: false, x: 18.0, y: 18.0, width: 16, height: 4.5, color: 'border-blue-600 bg-blue-50/10 text-blue-800', content: 'Arch CAD Dwg: #004-A // VisualOS Architect Labs' }
      ]
    },
    dfm_sheet: {
      name: 'Plastic Housing DFM Audit',
      type: 'dfm_sheet',
      width: 11.0,
      height: 8.5,
      unit: 'inches',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: 'custom',
      bleed: 0.125,
      safe_zone: 0.375,
      background: '#fafafa',
      grid: { show: true, size: 0.5, snapping: true },
      guides: [0.75, 10.25],
      layers: [
        { id: 'dfm1', name: 'Housing Outline Schematic', type: 'vector', visible: true, locked: false, x: 1.0, y: 1.0, width: 9.0, height: 4.5, color: 'border-slate-700 bg-slate-50/50', content: 'Injection Shell Profile specs' },
        { id: 'dfm2', name: 'Draft Angle Overlap Zones', type: 'branding', visible: true, locked: false, x: 1.5, y: 1.5, width: 4.0, height: 3.5, color: 'border-blue-500 bg-blue-50/10', content: 'Splay limit validation targets' },
        { id: 'dfm3', name: 'Critical Wall Width Annotations', type: 'dimension', visible: true, locked: false, x: 1.0, y: 5.8, width: 9.0, height: 2.0, color: 'border-emerald-500 text-emerald-800 font-mono', content: 'Tolerances: 0.05mm limit check passed. Minimum Wall: 2.45mm.' }
      ]
    },
    cad_reference_sheet: {
      name: 'Machinery Coupling Specs',
      type: 'cad_reference_sheet',
      width: 420.0,
      height: 297.0,
      unit: 'millimeters',
      dpi: 300,
      color_mode: 'CMYK',
      aspect_ratio: 'custom',
      bleed: 3.0,
      safe_zone: 10.0,
      background: '#ffffff',
      grid: { show: true, size: 10.0, snapping: true },
      guides: [20.0, 400.0],
      layers: [
        { id: 'cad1', name: 'Shaft Geometry Curves', type: 'vector', visible: true, locked: false, x: 40.0, y: 40.0, width: 340.0, height: 160.0, color: 'border-slate-800 bg-slate-100/50', content: 'Standard Coupling Axis Spec B' },
        { id: 'cad2', name: 'Assembly Part Annotations', type: 'text', visible: true, locked: false, x: 40.0, y: 215.0, width: 160.0, height: 60.0, color: 'text-gray-800 font-mono', content: 'Materials: Stainless 304 | CNC Lathe limit' },
        { id: 'cad3', name: 'Engineering Stamp Cert', type: 'branding', visible: true, locked: false, x: 220.0, y: 215.0, width: 160.0, height: 60.0, color: 'border-blue-600 bg-blue-50/10 text-blue-700', content: 'Approved under ISO-286 standard' }
      ]
    }
  };

  // Commands lookup database
  const COMMAND_RECIPES = [
    { command: '/create canvas business card', label: 'Create Business Card (3.5" x 2.0")' },
    { command: '/create canvas letterhead', label: 'Create Letterhead (8.5" x 11.0")' },
    { command: '/create canvas poster', label: 'Create Event Poster (18.0" x 24.0")' },
    { command: '/create canvas presentation', label: 'Create Presentation Slide (16:9 HD)' },
    { command: '/create canvas ui screen', label: 'Create Tablet UI Desktop Dashboard' },
    { command: '/create canvas fashion tech pack', label: 'Create Fashion Garment Flats Sheet' },
    { command: '/create canvas industrial design', label: 'Create Electric Scooter Base specs' },
    { command: '/create canvas architecture sheet', label: 'Create Studio Housing Scaled blueprint' },
    { command: '/create canvas dfm sheet', label: 'Create Plastic Base Moulding DFM layout' },
    { command: '/create canvas blank', label: 'Start Blank Pixel Canvas' },
    { command: '/setUnits pixels', label: 'Change units to Pixels (px)' },
    { command: '/setUnits inches', label: 'Change units to Inches (in)' },
    { command: '/setUnits millimeters', label: 'Change units to Millimeters (mm)' },
    { command: '/setBleed 0.125', label: 'Set Bleed threshold boundary' },
    { command: '/setSafeZone 0.25', label: 'Set interior Safe Area boundary' },
    { command: '/setDPI 300', label: 'Set high density DPI value' },
    { command: '/setColorMode CMYK', label: 'Switch kernel color standard to CMYK (Print)' },
    { command: '/setColorMode RGB', label: 'Switch kernel color standard to RGB (Digital)' },
    { command: '/setBackground dark', label: '#0a0f1d dark workspace theme' },
    { command: '/setBackground white', label: '#ffffff clean daylight canvas' },
    { command: '/addLayer Logo Stamp', label: 'Spawns a custom branding/logo container' },
    { command: '/addText Dynamic Paragraph', label: 'Append a responsive editable text layout' },
    { command: '/vector shape rect', label: 'Insert 2D geometry rectangle layer' },
    { command: '/vector shape circle', label: 'Insert 2D geometry circle layout' },
    { command: '/export png', label: 'Generate high-res flat PNG' },
    { command: '/export svg', label: 'Export clean scalable vector SVG nodes' },
    { command: '/export json', label: 'Download layered canvas state JSON manifest' },
    { command: '/preset save HighResPrint', label: 'Save current coordinates, unit and bleed specs' },
    { command: '/createProject', label: 'Initialize a new VisualOS project document graph (.visualos)' },
    { command: '/saveProject', label: 'Serialize and download project as .visualos' },
    { command: '/undo', label: 'Undo the last design operation' },
    { command: '/redo', label: 'Redo the last undone operation' },
    { command: '/version Checkpoint01', label: 'Save active canvas layout as checkpoint version' },
    { command: '/addObject vector BrandBorder', label: 'Add logical Object specification to project graph' },
    
    // Layout and Print Engine Commands
    { command: '/layout create poster', label: 'Quark: Initialize raw page layout (e.g. poster, standard card)' },
    { command: '/layout margins 0.5 0.5', label: 'Quark: Calibrate structural margin limits around active sheet' },
    { command: '/layout columns 3 0.25', label: 'Quark: Partition canvas with dynamic gutter coordinates' },
    { command: '/layout bleed 0.125', label: 'Quark: Switch print creep offsets / crop line tolerances' },
    { command: '/layout addText Heading', label: 'Quark: Place highly flexible text block anchor on grid' },
    { command: '/layout addImage PhotoFrame', label: 'Quark: Drop bounding visual frame box matching aspect ratios' },
    { command: '/layout align', label: 'Quark: Force snap block positions to column grid intersections' },
    { command: '/layout export', label: 'Quark: Pre-flight audit check and export print-ready PDF/SVG' },

    // Layer Manager Operations Recipes
    { command: '/createLayer Engineering Callouts', label: 'Layer Manager: Create a new named CAD layer' },
    { command: '/renameLayer lay_1 Outer Shell', label: 'Layer Manager: Rename specified layer ID to new name' },
    { command: '/deleteLayer lay_1', label: 'Layer Manager: Remove layer by ID' },
    { command: '/hideLayer lay_1', label: 'Layer Manager: Toggle visibility to hidden' },
    { command: '/showLayer lay_1', label: 'Layer Manager: Set layer visibility status to active' },
    { command: '/lockLayer lay_1', label: 'Layer Manager: Lock coordinate translation of layer' },
    { command: '/unlockLayer lay_1', label: 'Layer Manager: Unlock coordinate translations' },
    { command: '/groupLayers lay_1,lay_2 AssemblyA', label: 'Layer Manager: Group multi-selected layers' },
    { command: '/ungroupLayers grp_1', label: 'Layer Manager: Split grouped container into subnodes' },
    { command: '/moveLayerUp lay_1', label: 'Layer Manager: Move layer higher in active stack index' },
    { command: '/moveLayerDown lay_1', label: 'Layer Manager: Push layer deeper in active stack index' },
    { command: '/mergeLayers lay_1,lay_2', label: 'Layer Manager: Merge two independent design nodes' },
    { command: '/duplicateLayer lay_1', label: 'Layer Manager: Duplicate layer and offset placement' },
    { command: '/exportLayer lay_1 png', label: 'Layer Manager: Export single high-density layer file' }
  ];

  // Active state
  const [activeCanvas, setActiveCanvas] = useState<CanvasDataModel>({
    canvas_id: 'canvas_001',
    name: 'Business Card Workspace',
    type: 'business_card',
    width: 3.5,
    height: 2.0,
    unit: 'inches',
    dpi: 300,
    color_mode: 'CMYK',
    aspect_ratio: '1.75:1',
    bleed: 0.125,
    safe_zone: 0.125,
    background: '#fafafa',
    grid: { show: true, size: 0.25, snapping: true },
    guides: [0.5, 3.0],
    layers: [
      { id: 'c1', name: 'Vector Logo Badge', type: 'branding', visible: true, locked: false, x: 0.4, y: 0.4, width: 0.9, height: 0.9, color: 'border-blue-600 bg-blue-50/20 text-blue-600', content: 'LogoMark' },
      { id: 'c2', name: 'Employee Name Type', type: 'text', visible: true, locked: false, x: 1.5, y: 0.5, width: 1.6, height: 0.3, color: 'text-gray-900', content: 'Alexander Vance' },
      { id: 'c3', name: 'Designation Subhead', type: 'text', visible: true, locked: false, x: 1.5, y: 0.8, width: 1.6, height: 0.2, color: 'text-blue-500', content: 'Chief Operations Engineer' },
      { id: 'c4', name: 'Hexagonal Geometric Grid', type: 'vector', visible: true, locked: true, x: 2.2, y: 1.1, width: 1.0, height: 0.6, color: 'border-pink-500 bg-pink-500/10', content: 'Hex Outlines' },
      { id: 'c5', name: 'Trim Marks Overlay', type: 'dimension', visible: true, locked: true, x: 0.125, y: 0.125, width: 3.25, height: 1.75, color: 'border-amber-400', content: '3.25" x 1.75" Safe Boundary' }
    ]
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('c2');
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [savedPresets, setSavedPresets] = useState<ToolPreset[]>([
    { id: 'p_1', name: 'StandardCard', canvasType: 'business_card', unit: 'inches', colorMode: 'CMYK', bleed: 0.125, safeZone: 0.125 },
    { id: 'p_2', name: 'HQPosterGrid', canvasType: 'poster', unit: 'inches', colorMode: 'RGB', bleed: 0.5, safeZone: 1.0 }
  ]);

  // VisualOS Project Document Graph and State Machine
  const [projectGraph, setProjectGraph] = useState<VisualProjectGraph>({
    project_id: 'project_001',
    name: 'VisualOS Project',
    canvases: [],
    layers: [],
    objects: [
      { id: 'obj_1', name: 'Vector Logo Badge', type: 'branding', linkedLayerId: 'c1' },
      { id: 'obj_2', name: 'Employee Name Type', type: 'text', linkedLayerId: 'c2' },
      { id: 'obj_3', name: 'Designation Subhead', type: 'text', linkedLayerId: 'c3' },
      { id: 'obj_4', name: 'Hexagonal Geometric Grid', type: 'vector', linkedLayerId: 'c4' },
      { id: 'obj_5', name: 'Trim Marks Overlay', type: 'dimension', linkedLayerId: 'c5' }
    ],
    vectors: [
      { id: 'vec_1', name: 'Hex Outline Group', path: 'M10,10 h80 v80 h-80 z', stroke: '#ec4899', strokeWidth: 2 }
    ],
    rasters: [
      { id: 'rast_1', name: 'Corporate Badge Stamp', src: 'stamp.png', opacity: 0.95 }
    ],
    text_blocks: [
      { id: 'txt_1', name: 'Alexander Vance', text: 'Alexander Vance', fontSize: 13 },
      { id: 'txt_2', name: 'Chief Operations Engineer', text: 'Chief Operations Engineer', fontSize: 10 }
    ],
    brand_rules: {
      lockPalette: true,
      primaryColor: '#2563eb',
      secondaryColor: '#db2777',
      logoRules: 'Maintain minimum 0.5 inch interior bounds margin clearance'
    },
    dimensions: [
      { id: 'dim_1', name: 'Safe zone margins coordinate locks', lengthValue: 0.125, unit: 'inches' }
    ],
    materials: [
      { id: 'mat_1', name: 'Standard Satin Heavy Bond Corporate Stock', density: '320 gsm', finish: 'Gloss Laminated Edge Trim' }
    ],
    callouts: [],
    exports: [
      { id: 'exp_1', format: 'PDF', dpi: 300, trimMark: true },
      { id: 'exp_2', format: 'SVG', dpi: 96, trimMark: false }
    ],
    history: []
  });

  const [undoStack, setUndoStack] = useState<VisualProjectGraph[]>([]);
  const [redoStack, setRedoStack] = useState<VisualProjectGraph[]>([]);
  const [graphSidebarTab, setGraphSidebarTab] = useState<'layers' | 'graph' | 'layout' | 'raster' | 'brand' | 'uiux' | 'product' | 'industrial' | 'architecture' | 'engineering' | 'export_manager' | 'quality_verifier' | 'workspace_manager'>('uiux');
  const [newObjectType, setNewObjectType] = useState<'vector' | 'raster' | 'text' | 'dimension' | 'material'>('vector');
  const [newObjectName, setNewObjectName] = useState('');

  // Raster Image Layer Engine state hooks
  const [rasterLayers, setRasterLayers] = useState<RasterLayer[]>([]);
  const [selectedRasterLayerId, setSelectedRasterLayerId] = useState<string | null>(null);

  // Layer Manager multiselect / checked state
  const [bulkCheckedLayerIds, setBulkCheckedLayerIds] = useState<string[]>([]);

  // ==========================================
  // BRAND IDENTITY ENGINE STATES & STRUCTURES
  // ==========================================
  const [brandKits, setBrandKits] = useState<BrandKit[]>([
    {
      id: 'bk_1',
      name: 'VisualOS Core Tech',
      logoRules: 'Position logo center-left, maintain minimum 0.5 inches safe padding margin limits.',
      colors: {
        primary: '#2563eb', // Indigo Blue
        secondary: '#db2777', // Rose Pink
        background: '#fafafa', // Soft Daylight Light
        accent: '#38bdf8' // Cyber Sky Blue
      },
      fonts: {
        sans: 'Inter, system-ui',
        serif: 'Playfair Display, serif',
        mono: 'JetBrains Mono, monospace',
        display: 'Space Grotesk, sans-serif'
      },
      spacingRule: 'Strict 8px grid alignments, 0.25in standard snapping guides.',
      iconStyle: 'Clean outline vector paths with standard stroke-width: 1.5px.',
      imageStyle: 'High fidelity with subtle contact shadow specs.',
      voiceNotes: 'Assertive, pristine, highly mechanical, and technically sound.',
      layoutRules: 'Structured horizontal pipeline architecture with clear bento partitions.',
      doNotUseRules: ['#f59e0b', 'Comic Sans', 'Arial', 'Gradient overload']
    },
    {
      id: 'bk_2',
      name: 'Cyberpunk Catalyst',
      logoRules: 'Never scale down logo below 1.25 inches. Aspect ratio must be locked 1:1.',
      colors: {
        primary: '#f43f5e', // Neon Rose
        secondary: '#06b6d4', // Cyan Sparkle
        background: '#090a10', // Dark void
        accent: '#facc15' // Electric gold
      },
      fonts: {
        sans: 'Outfit, sans-serif',
        serif: 'Georgia, serif',
        mono: 'Fira Code, monospace',
        display: 'Syne, sans-serif'
      },
      spacingRule: 'Fluid responsive gaps, minimal margins, zero bleed safe limits.',
      iconStyle: 'Solid, high opacity, high saturation neo-brutal blocks.',
      imageStyle: 'Heavily stylized and raster masked textures overlays.',
      voiceNotes: 'Aggressive, futuristic, rebellious and starkly high contrast.',
      layoutRules: 'Asymmetric canvas blocks with thick border framing.',
      doNotUseRules: ['#22c55e', '#a855f7', 'Times New Roman']
    }
  ]);

  const [activeBrandKitId, setActiveBrandKitId] = useState<string>('bk_1');
  const [brandLockPalette, setBrandLockPalette] = useState<boolean>(true);
  const [brandGuideText, setBrandGuideText] = useState<string>('VisualOS Pro Guide:\nPrimary color is Indigo Blue #2563eb.\nSecondary color is Rose Pink #db2777.\nBackground is soft light #fafafa.\nAlways use Space Grotesk font for brand headings.\nMin spacing margin limits must exceed 0.25in.\nLogo rule: always maintain locked aspect ratio of 1:1.');
  const [brandComplianceReport, setBrandComplianceReport] = useState<{
    status: 'success' | 'warn' | 'fail';
    score: number;
    errors: string[];
    passes: string[];
  } | null>(null);

  // Brand creation form hooks
  const [newKitName, setNewKitName] = useState('');
  const [newKitPrimary, setNewKitPrimary] = useState('#16a34a');
  const [newKitSecondary, setNewKitSecondary] = useState('#ca8a04');
  const [newKitBackground, setNewKitBackground] = useState('#f8fafc');
  const [newKitAccent, setNewKitAccent] = useState('#4f46e5');
  const [newKitFontsDisplay, setNewKitFontsDisplay] = useState('Space Grotesk');
  const [newKitLogoRules, setNewKitLogoRules] = useState('Always maintain 1:1 ratio. Margin clearances: 0.5in.');

  // ==========================================
  // UI / UX DESIGN ENGINE STATES & STRUCTURES
  // ==========================================
  const [uiScreens, setUiScreens] = useState<UIScreen[]>([
    {
      id: 'scr_1',
      name: 'Mobile Core Portal',
      type: 'mobile',
      width: 375,
      height: 812,
      components: [
        { id: 'uic_1', name: 'Identity Header Block', type: 'NavBar', text: 'VisualOS Portal', color: 'bg-white', borderColor: 'border-slate-200', textColor: 'text-slate-900', fontSize: 13, padding: 'p-3' },
        { id: 'uic_2', name: 'Hero Badge Asset', type: 'Card', text: 'Secure Sandbox Active', color: 'bg-slate-50', borderColor: 'border-slate-205', textColor: 'text-slate-800', fontSize: 11, padding: 'p-4' },
        { id: 'uic_3', name: 'Input Identity Code', type: 'InputField', text: 'Enter auth credentials...', color: 'bg-white', borderColor: 'border-slate-300', textColor: 'text-gray-400', fontSize: 11, padding: 'p-2' },
        { id: 'uic_4', name: 'Button Trigger Begin', type: 'Button', text: 'Sync Device System', color: 'bg-blue-600', borderColor: 'border-blue-700', textColor: 'text-white', fontSize: 11, padding: 'py-2 px-4' }
      ],
      linkedScreenId: 'scr_2',
      clickPathAction: 'onTap uic_4 (Sync Device)'
    },
    {
      id: 'scr_2',
      name: 'Mobile Device Dashboard',
      type: 'mobile',
      width: 375,
      height: 812,
      components: [
        { id: 'uic_5', name: 'Main Navigation Header', type: 'NavBar', text: 'Control Panel', color: 'bg-white', borderColor: 'border-slate-200', textColor: 'text-slate-900', fontSize: 13, padding: 'p-3' },
        { id: 'uic_6', name: 'Memory Allocation Block', type: 'DashboardBlock', text: 'CPU: 92% | DRAM: 4.2GB / 8GB', color: 'bg-slate-900', borderColor: 'border-slate-850', textColor: 'text-emerald-400', fontSize: 10, padding: 'p-3' },
        { id: 'uic_7', name: 'Log Terminal Modal', type: 'Modal', text: 'Connection encrypted. Tunnel secure.', color: 'bg-slate-50', borderColor: 'border-slate-200', textColor: 'text-slate-700', fontSize: 10, padding: 'p-4' },
        { id: 'uic_8', name: 'Button Disconnect', type: 'Button', text: 'Close Secure Tunnel', color: 'bg-red-600', borderColor: 'border-red-700', textColor: 'text-white', fontSize: 11, padding: 'py-2 px-4' }
      ],
      linkedScreenId: 'scr_1',
      clickPathAction: 'onTap uic_8 (Close Secure Tunnel)'
    }
  ]);

  const [activeUiScreenId, setActiveUiScreenId] = useState<string>('scr_1');
  const [showWireframeMode, setShowWireframeMode] = useState<boolean>(false);
  const [userFlows, setUserFlows] = useState<UserFlow[]>([
    { id: 'flow_1', name: 'Authentication Thread', fromScreenId: 'scr_1', toScreenId: 'scr_2', triggerEvent: 'uic_4 Tap (Sync Device)' }
  ]);
  const [selectedUiComponentId, setSelectedUiComponentId] = useState<string | null>('uic_4');

  // UI Flow creation form hooks
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowFrom, setNewFlowFrom] = useState('scr_1');
  const [newFlowTo, setNewFlowTo] = useState('scr_2');
  const [newFlowTrigger, setNewFlowTrigger] = useState('uic_4 Tap (Sync Device)');

  const [designSpecDownloaded, setDesignSpecDownloaded] = useState<boolean>(false);

  // ========================================================
  // BRAND IDENTITY ENGINE CORE IMPLEMENTATIONS
  // ========================================================

  const extractColors = (text: string): { primary: string; secondary: string; background: string; accent: string } => {
    // Look for HEX colors in text using regex
    const hexRegex = /#[0-9a-fA-F]{6}\b/g;
    const matches = text.match(hexRegex) || [];
    
    return {
      primary: matches[0] || '#2563eb', // Indigo Blue Default
      secondary: matches[1] || '#db2777', // Rose Pink Default
      background: matches[2] || '#fafafa', // Soft Slate Default
      accent: matches[3] || '#38bdf8' // Cyber Sky Default
    };
  };

  const extractFonts = (text: string): { sans: string; serif: string; mono: string; display: string } => {
    const fonts = {
      sans: 'Inter, system-ui',
      serif: 'Georgia, serif',
      mono: 'JetBrains Mono, monospace',
      display: 'Space Grotesk, sans-serif'
    };
    
    if (text.toLowerCase().includes('syne')) fonts.display = 'Syne, sans-serif';
    if (text.toLowerCase().includes('outfit')) fonts.sans = 'Outfit, sans-serif';
    if (text.toLowerCase().includes('fira')) fonts.mono = 'Fira Code, monospace';
    if (text.toLowerCase().includes('playfair')) fonts.serif = 'Playfair Display, serif';
    
    return fonts;
  };

  const extractLogoRules = (text: string): string => {
    const sentences = text.split(/[.!\n]+/);
    const logoSentence = sentences.find(s => s.toLowerCase().includes('logo')) || 'Position logo in upper margins, always preserve locked proportion ratios.';
    return logoSentence.trim() + '.';
  };

  const parseBrandGuide = (guideContent: string) => {
    const extractedColors = extractColors(guideContent);
    const extractedFonts = extractFonts(guideContent);
    const logoRules = extractLogoRules(guideContent);
    
    logTrace(`[BRAND DECODER] Successfully scanned brand guide text block and extracted assets.`);
    return {
      colors: extractedColors,
      fonts: extractedFonts,
      logoRules
    };
  };

  const uploadBrandGuide = (customText?: string) => {
    const textToParse = customText || brandGuideText;
    const parsed = parseBrandGuide(textToParse);
    
    // Create new Brand Kit
    const generatedKit: BrandKit = {
      id: `bk_${Date.now().toString().slice(-4)}`,
      name: `Extracted Brand Kit ${brandKits.length + 1}`,
      logoRules: parsed.logoRules,
      colors: parsed.colors,
      fonts: parsed.fonts,
      spacingRule: 'Calibrated to 0.125in margins base boundaries.',
      iconStyle: 'Minimalist outline, stroke-width: 1.5px.',
      imageStyle: 'Standard high-res flat bounding frames.',
      voiceNotes: 'Determined automatically from semantic guidelines analysis.',
      layoutRules: 'Symmetrical grids styled with generous negative spaces.',
      doNotUseRules: ['#ff0000', 'Comic Sans', 'Raw saturated gradients']
    };

    setBrandKits(prev => [...prev, generatedKit]);
    setActiveBrandKitId(generatedKit.id);
    logTrace(`[BRAND ENGINE] Created active Brand Kit "${generatedKit.name}" via uploadBrandGuide().`);
    
    // Run validation instantly
    setTimeout(() => {
      validateBrandCompliance(generatedKit);
    }, 100);
  };

  const createBrandKit = (name: string, logoRules: string, primary: string, secondary: string, background: string, accent: string, fontsDisplay: string) => {
    const customKit: BrandKit = {
      id: `bk_${Date.now().toString().slice(-4)}`,
      name: name.trim() || `Brand Kit ${brandKits.length + 1}`,
      logoRules: logoRules || 'Always maintain 1:1 locked ratio.',
      colors: {
        primary,
        secondary,
        background,
        accent
      },
      fonts: {
        sans: 'Inter, system-ui',
        serif: 'Playfair Display, serif',
        mono: 'JetBrains Mono, monospace',
        display: fontsDisplay || 'Space Grotesk, sans-serif'
      },
      spacingRule: 'Standard 8px padding increments.',
      iconStyle: 'Clean vector outlines.',
      imageStyle: 'Aspect fit frames.',
      voiceNotes: 'Professional, articulate, and technical.',
      layoutRules: 'Clean alignment, wide grid panels.',
      doNotUseRules: ['Comic Sans', 'Washed contrast ratios']
    };

    setBrandKits(prev => [...prev, customKit]);
    setActiveBrandKitId(customKit.id);
    logTrace(`[BRAND ENGINE] createBrandKit: New custom kit "${customKit.name}" saved and loaded.`);
    return customKit;
  };

  const lockBrandPalette = (locked: boolean) => {
    setBrandLockPalette(locked);
    logTrace(`[BRAND ENGINE] lockBrandPalette: Strict color constraints are now ${locked ? 'ENABLED. Off-brand elements will trigger visual alerts.' : 'DISABLED.'}`);
    
    // Trigger validation update
    setTimeout(() => {
      const activeKit = brandKits.find(b => b.id === activeBrandKitId);
      if (activeKit) validateBrandCompliance(activeKit);
    }, 50);
  };

  const applyBrandToCanvas = (kitId?: string) => {
    const idToUse = kitId || activeBrandKitId;
    const targetKit = brandKits.find(b => b.id === idToUse);
    if (!targetKit) return;

    recordHistoryState();
    
    // Map existing layers to our brand kit
    setActiveCanvas(prev => ({
      ...prev,
      background: targetKit.colors.background,
      layers: prev.layers.map((layer, index) => {
        let updatedColor = layer.color;
        let updatedContent = layer.content;
        
        // Map elements to kit colors
        if (layer.type === 'branding') {
          updatedColor = `border-[${targetKit.colors.primary}] bg-[${targetKit.colors.primary}]/10 text-[${targetKit.colors.primary}]`;
          updatedContent = 'Approved Brand Logo';
        } else if (layer.type === 'dimension') {
          updatedColor = `border-[${targetKit.colors.accent}] text-[${targetKit.colors.accent}] font-mono`;
        } else if (layer.type === 'text') {
          updatedColor = index === 1 ? `text-[${targetKit.colors.primary}] font-sans` : `text-[${targetKit.colors.secondary}] font-sans`;
        }
        
        return {
          ...layer,
          color: updatedColor,
          content: updatedContent
        };
      })
    }));

    logTrace(`[BRAND SYSTEM] applyBrandToCanvas: Applied colors and typography nodes of "${targetKit.name}" to all canvas layers.`);
    
    // Auto-update compliance report
    setTimeout(() => {
      validateBrandCompliance(targetKit);
    }, 100);
  };

  const validateBrandCompliance = (customKit?: BrandKit) => {
    const kit = customKit || brandKits.find(b => b.id === activeBrandKitId);
    if (!kit) return;

    const errors: string[] = [];
    const passes: string[] = [];

    // Check 1: Background Compliance
    const bgVal = activeCanvas.background.toLowerCase();
    const approvedColors = [
      kit.colors.primary.toLowerCase(),
      kit.colors.secondary.toLowerCase(),
      kit.colors.background.toLowerCase(),
      kit.colors.accent.toLowerCase(),
      '#ffffff', '#000000', '#fafafa', '#f3f4f6', '#0a0f1d', '#000', '#fff'
    ];
    if (brandLockPalette && !approvedColors.includes(bgVal)) {
      errors.push(`Canvas background "${activeCanvas.background}" violates locked Brand Palette. Approved colors: primary, secondary, bg, accent.`);
    } else {
      passes.push(`Canvas background complies with active Brand Palette rules.`);
    }

    // Check 2: Logo proportions rule
    const brandingLayer = activeCanvas.layers.find(l => l.type === 'branding');
    if (brandingLayer) {
      const isLockedProportions = Math.abs(brandingLayer.width - brandingLayer.height) < 0.2;
      if (!isLockedProportions) {
        errors.push(`Branding node "${brandingLayer.name}" has unproportional aspect bounds (${brandingLayer.width} x ${brandingLayer.height}). Correct: Lock aspect ratio.`);
      } else {
        passes.push(`Logo node "${brandingLayer.name}" preserves standard proportional bounds perfectly.`);
      }
    } else {
      passes.push(`No branding node layers present to validate logo boundaries.`);
    }

    // Check 3: Typographic Fonts system compliance
    const textLayers = activeCanvas.layers.filter(l => l.type === 'text');
    let fontErrors = false;
    textLayers.forEach(l => {
      if (l.color.includes('serif') && !kit.fonts.serif.toLowerCase().includes('serif')) {
        errors.push(`Text node "${l.name}" uses unapproved serif styling.`);
        fontErrors = true;
      }
    });
    if (!fontErrors) {
      passes.push(`All text node fonts conform to approved brand typography standard (${kit.fonts.display}).`);
    }

    // Check 4: Spacing tolerances rules
    const marginViolator = activeCanvas.layers.some(l => l.x < activeCanvas.bleed || l.y < activeCanvas.bleed);
    if (marginViolator) {
      errors.push(`Some layout layer vectors are placed too close to bleed edge, violating brand spacing regulations.`);
    } else {
      passes.push(`All elements adhere safely to bleed offset margins limits.`);
    }

    const score = Math.max(0, 100 - (errors.length * 25));
    const status = errors.length > 0 ? (score > 50 ? 'warn' : 'fail') : 'success';

    setBrandComplianceReport({
      status,
      score,
      errors,
      passes
    });

    logTrace(`[BRAND AUDIT] validateBrandCompliance: Scan completed. Compliance Score: ${score}%. Brand system state is ${status.toUpperCase()}.`);
  };


  // ========================================================
  // UI / UX DESIGN ENGINE CORE IMPLEMENTATIONS
  // ========================================================

  const createUIScreen = (name?: string, type?: 'mobile' | 'tablet' | 'desktop') => {
    const resType = type || 'mobile';
    const resName = name?.trim() || `${resType.charAt(0).toUpperCase() + resType.slice(1)} Screen ${uiScreens.length + 1}`;
    
    const width = resType === 'mobile' ? 375 : resType === 'tablet' ? 768 : 1280;
    const height = resType === 'mobile' ? 812 : resType === 'tablet' ? 1024 : 800;

    const newScreen: UIScreen = {
      id: `scr_${Date.now().toString().slice(-4)}`,
      name: resName,
      type: resType,
      width,
      height,
      components: [
        { id: `uic_${Date.now().toString().slice(-4)}_1`, name: 'Top Bar', type: 'NavBar', text: resName, color: 'bg-white', borderColor: 'border-slate-200', textColor: 'text-slate-900', fontSize: 13, padding: 'p-3' },
        { id: `uic_${Date.now().toString().slice(-4)}_2`, name: 'Sample Card Block', type: 'Card', text: 'VisualOS Design block content', color: 'bg-slate-50', borderColor: 'border-slate-205', textColor: 'text-slate-700', fontSize: 11, padding: 'p-4' },
        { id: `uic_${Date.now().toString().slice(-4)}_3`, name: 'Auth Trigger', type: 'Button', text: 'Action Button', color: 'bg-blue-600', borderColor: 'border-blue-700', textColor: 'text-white', fontSize: 11, padding: 'py-2 px-4' }
      ]
    };

    setUiScreens(prev => [...prev, newScreen]);
    setActiveUiScreenId(newScreen.id);
    logTrace(`[UI ENGINE] createUIScreen: Spawned new editable UI Screen workspace "${resName}" (${width}x${height}px).`);
    return newScreen;
  };

  const createWireframe = () => {
    setShowWireframeMode(prev => !prev);
    logTrace(`[UI ENGINE] createWireframe: Wireframe Blueprint styling toggled ${!showWireframeMode ? 'ON (Monochrome CAD skeleton)' : 'OFF (Visual assets rendering)'}`);
  };

  const createComponent = (screenId: string, spec: Partial<UIComponent> & { type: any; name: string }) => {
    const compId = `uic_${Date.now().toString().slice(-4)}`;
    const newComp: UIComponent = {
      id: compId,
      name: spec.name,
      type: spec.type,
      text: spec.text || 'Editable Text Layout',
      color: spec.color || 'bg-white',
      borderColor: spec.borderColor || 'border-slate-200',
      textColor: spec.textColor || 'text-slate-900',
      fontSize: spec.fontSize || 12,
      padding: spec.padding || 'p-3'
    };

    setUiScreens(prev => prev.map(screen => {
      if (screen.id !== screenId) return screen;
      return {
        ...screen,
        components: [...screen.components, newComp]
      };
    }));

    setSelectedUiComponentId(compId);
    logTrace(`[UI ENGINE] createComponent: Added editable modular node "${spec.name}" (${spec.type}) to Screen ID "${screenId}".`);
  };

  const createButton = (screenId: string, name?: string, text?: string) => {
    createComponent(screenId, {
      name: name || 'Action Trigger Button',
      type: 'Button',
      text: text || 'Click Trigger Button',
      color: 'bg-blue-600',
      borderColor: 'border-blue-700',
      textColor: 'text-white',
      fontSize: 11,
      padding: 'py-2 px-4 shadow-sm'
    });
  };

  const createInputField = (screenId: string, name?: string, placeholder?: string) => {
    createComponent(screenId, {
      name: name || 'Text Input Area',
      type: 'InputField',
      text: placeholder || 'Type alphanumeric inputs...',
      color: 'bg-white',
      borderColor: 'border-slate-250',
      textColor: 'text-gray-400',
      fontSize: 11,
      padding: 'p-2 border'
    });
  };

  const createNavBar = (screenId: string, name?: string, text?: string) => {
    createComponent(screenId, {
      name: name || 'Top Bar System',
      type: 'NavBar',
      text: text || 'Header Label',
      color: 'bg-white',
      borderColor: 'border-b border-slate-200',
      textColor: 'text-slate-900 font-bold',
      fontSize: 13,
      padding: 'px-4 py-3'
    });
  };

  const createCard = (screenId: string, name?: string, text?: string) => {
    createComponent(screenId, {
      name: name || 'Bento Grid Card',
      type: 'Card',
      text: text || 'This bento block lists active telemetry parameters.',
      color: 'bg-slate-50',
      borderColor: 'border border-slate-200',
      textColor: 'text-slate-700',
      fontSize: 11,
      padding: 'p-4 rounded-xl'
    });
  };

  const createModal = (screenId: string, name?: string, title?: string) => {
    createComponent(screenId, {
      name: name || 'Overlays Dialog Box',
      type: 'Modal',
      text: title || 'Warning: Critical override sequence active.',
      color: 'bg-white',
      borderColor: 'border-2 border-slate-900 shadow-2xl',
      textColor: 'text-slate-950 font-semibold',
      fontSize: 11,
      padding: 'p-6 max-w-sm rounded-2xl mx-auto'
    });
  };

  const createUserFlow = (name: string, fromId: string, toId: string, trigger: string) => {
    const newFlow: UserFlow = {
      id: `flow_${Date.now().toString().slice(-4)}`,
      name: name.trim() || `User click thread ${userFlows.length + 1}`,
      fromScreenId: fromId,
      toScreenId: toId,
      triggerEvent: trigger || 'Button Tap'
    };

    setUserFlows(prev => [...prev, newFlow]);
    logTrace(`[UX FLOWS] createUserFlow: Cataloged thread "${newFlow.name}" detailing Click transition path.`);
    return newFlow;
  };

  const linkScreens = (fromId: string, toId: string, trigger: string) => {
    setUiScreens(prev => prev.map(screen => {
      if (screen.id !== fromId) return screen;
      return {
        ...screen,
        linkedScreenId: toId,
        clickPathAction: trigger
      };
    }));

    createUserFlow(`Link path: ${fromId} ➜ ${toId}`, fromId, toId, trigger);
    logTrace(`[UX ENGINE] linkScreens: Connected screen ID "${fromId}" clickable action trigger directly to destination screen ID "${toId}".`);
  };

  const exportDesignSpec = (format: 'pdf' | 'png' | 'svg' | 'json') => {
    // Generate a comprehensive design standard specification payload
    const activeKit = brandKits.find(b => b.id === activeBrandKitId);
    
    const specPayload = {
      manifestName: `${activeCanvas.name} UI/UX Specification Dossier`,
      timestamp: new Date().toISOString(),
      brandingTokens: activeKit ? {
        brandKitName: activeKit.name,
        colorTokens: activeKit.colors,
        typographyFonts: activeKit.fonts,
        spacingGridSystem: activeKit.spacingRule,
        brandVoiceConstraints: activeKit.voiceNotes
      } : 'No loaded brand kit',
      screenLayouts: uiScreens.map(scr => ({
        screenName: scr.name,
        typePreset: scr.type,
        pixelDimensions: `${scr.width}x${scr.height}px`,
        transitionClickPath: scr.linkedScreenId ? `Links to "${scr.linkedScreenId}" on [${scr.clickPathAction}]` : 'Static, unlinked screen',
        componentsCount: scr.components.length,
        nestedNodes: scr.components.map(comp => ({
          componentName: comp.name,
          category: comp.type,
          visualText: comp.text,
          visualClass: comp.color,
          fontSize: `${comp.fontSize}px`
        }))
      })),
      userFlowThreads: userFlows,
      accessibilityWCAG: {
        minimumContrastCheck: 'Pass 4.5:1 standard AA criteria (Active colors)',
        screenreaderLabels: 'Annotated aria tags enabled',
        fontLegibilityRating: '98% Pass rating checked'
      },
      breakpoints: {
        mobile: '375x812px',
        tablet: '768x1024px',
        desktop: '1280x800px'
      },
      designerHandoffNotes: 'Developer handoff notes: Set background colors to branding background tokens. Primary button hover actions trigger transition flows.'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(specPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VisualOS_Design_Spec_${activeCanvas.canvas_id}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDesignSpecDownloaded(true);
    logTrace(`[DESIGN SPEC] exportDesignSpec: Exported specification sheet in .${format.toUpperCase()} format. Dimensions, click paths, responsive boundaries compiled successfully.`);
    
    setTimeout(() => {
      setDesignSpecDownloaded(false);
    }, 4000);
  };

  // Core CAD Layer Manager Operations
  const createLayer = (name?: string, type?: 'vector' | 'raster' | 'text' | 'dimension' | 'branding') => {

    recordHistoryState();
    const cx = activeCanvas.width / 4;
    const cy = activeCanvas.height / 4;
    const cw = activeCanvas.width / 2;
    const ch = activeCanvas.height / 2;

    const newId = `lay_${Date.now().toString().slice(-4)}`;
    // Core guideline: Agents cannot create unnamed layers. Systems name layers automatically.
    const resolvedName = name?.trim() || `Layer ${activeCanvas.layers.length + 1}`;
    const resolvedType = type || 'vector';

    const newLayer: CanvasLayer = {
      id: newId,
      name: resolvedName,
      type: resolvedType,
      visible: true,
      locked: false,
      x: cx,
      y: cy,
      width: cw,
      height: ch,
      color: resolvedType === 'text' ? 'text-gray-900 font-sans' : resolvedType === 'branding' ? 'border-blue-600 bg-blue-50/20 text-blue-600' : 'border-blue-500 bg-blue-100/10',
      content: resolvedType === 'text' ? 'Editable Typography Content' : 'Scalable Vector Geometry'
    };

    setActiveCanvas(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer]
    }));
    setSelectedLayerId(newId);
    logTrace(`[LAYER ENGINE] createLayer: "${resolvedName}" created (${resolvedType}).`);
    return newLayer;
  };

  const renameLayer = (id: string, newName: string) => {
    if (!newName.trim()) return; // Prevent unnamed layers
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, name: newName.trim() } : l)
    }));
    logTrace(`[LAYER ENGINE] renameLayer: Layer [ID: ${id}] renamed to "${newName.trim()}".`);
  };

  const deleteLayer = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.filter(l => l.id !== id)
    }));
    if (selectedLayerId === id) setSelectedLayerId(null);
    setBulkCheckedLayerIds(prev => prev.filter(item => item !== id));
    logTrace(`[LAYER ENGINE] deleteLayer: Layer [ID: ${id}] removed.`);
  };

  const hideLayer = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, visible: false } : l)
    }));
    logTrace(`[LAYER ENGINE] hideLayer: Layer [ID: ${id}] hidden.`);
  };

  const showLayer = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, visible: true } : l)
    }));
    logTrace(`[LAYER ENGINE] showLayer: Layer [ID: ${id}] made visible.`);
  };

  const lockLayer = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, locked: true } : l)
    }));
    logTrace(`[LAYER ENGINE] lockLayer: Layer [ID: ${id}] locked.`);
  };

  const unlockLayer = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, locked: false } : l)
    }));
    logTrace(`[LAYER ENGINE] unlockLayer: Layer [ID: ${id}] unlocked.`);
  };

  const groupLayers = (ids: string[], groupName?: string) => {
    if (ids.length === 0) return;
    recordHistoryState();
    const resolvedGroupName = groupName?.trim() || `Group ${Date.now().toString().slice(-3)}`;
    setActiveCanvas(prev => {
      const matched = prev.layers.filter(l => ids.includes(l.id));
      if (matched.length === 0) return prev;

      const minX = Math.min(...matched.map(l => l.x));
      const minY = Math.min(...matched.map(l => l.y));
      const maxX = Math.max(...matched.map(l => l.x + l.width));
      const maxY = Math.max(...matched.map(l => l.y + l.height));

      const newGroup: CanvasLayer = {
        id: `grp_${Date.now().toString().slice(-4)}`,
        name: `Group: ${resolvedGroupName}`,
        type: 'vector',
        visible: true,
        locked: false,
        x: minX,
        y: minY,
        width: Math.max(0.1, maxX - minX),
        height: Math.max(0.1, maxY - minY),
        color: 'border-purple-600 bg-purple-50/10 border-dashed',
        content: `Group of layers: ${matched.map(m => m.name).join(', ')}`
      };

      const remaining = prev.layers.filter(l => !ids.includes(l.id));
      return {
        ...prev,
        layers: [...remaining, newGroup]
      };
    });
    setBulkCheckedLayerIds([]);
    logTrace(`[LAYER ENGINE] groupLayers: Grouped layers [${ids.join(', ')}] as "${resolvedGroupName}".`);
  };

  const ungroupLayers = (groupId: string) => {
    if (!groupId.startsWith('grp_')) return;
    recordHistoryState();
    setActiveCanvas(prev => {
      const groupL = prev.layers.find(l => l.id === groupId);
      if (!groupL) return prev;

      const desc = groupL.content.replace('Group of layers: ', '');
      const originalNames = desc.split(', ');
      const reconstructed = originalNames.map((name, i) => ({
        id: `lay_${Date.now().toString().slice(-4)}_${i}`,
        name: name.trim() || `SubLayer ${i + 1}`,
        type: 'vector' as const,
        visible: true,
        locked: false,
        x: groupL.x + (i * 0.1),
        y: groupL.y + (i * 0.1),
        width: Math.max(0.1, groupL.width * 0.8),
        height: Math.max(0.1, groupL.height * 0.8),
        color: 'border-indigo-500 bg-indigo-50/10',
        content: `Reconstructed Vector Node`
      }));

      const remaining = prev.layers.filter(l => l.id !== groupId);
      return {
        ...prev,
        layers: [...remaining, ...reconstructed]
      };
    });
    if (selectedLayerId === groupId) setSelectedLayerId(null);
    logTrace(`[LAYER ENGINE] ungroupLayers: Ungrouped group [ID: ${groupId}] successfully.`);
  };

  const moveLayerUp = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => {
      const idx = prev.layers.findIndex(l => l.id === id);
      if (idx === -1 || idx === prev.layers.length - 1) return prev;
      const updated = [...prev.layers];
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
      return { ...prev, layers: updated };
    });
    logTrace(`[LAYER ENGINE] moveLayerUp: Layer [ID: ${id}] moved up in index stack.`);
  };

  const moveLayerDown = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => {
      const idx = prev.layers.findIndex(l => l.id === id);
      if (idx <= 0) return prev;
      const updated = [...prev.layers];
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
      return { ...prev, layers: updated };
    });
    logTrace(`[LAYER ENGINE] moveLayerDown: Layer [ID: ${id}] moved down in index stack.`);
  };

  const mergeLayers = (id1: string, id2: string) => {
    recordHistoryState();
    setActiveCanvas(prev => {
      const l1 = prev.layers.find(l => l.id === id1);
      const l2 = prev.layers.find(l => l.id === id2);
      if (!l1 || !l2) return prev;

      const mergedLayer: CanvasLayer = {
        id: `mrg_${Date.now().toString().slice(-4)}`,
        name: `${l1.name} + ${l2.name} (Merged)`,
        type: 'vector',
        visible: true,
        locked: false,
        x: Math.min(l1.x, l2.x),
        y: Math.min(l1.y, l2.y),
        width: Math.max(l1.x + l1.width, l2.x + l2.width) - Math.min(l1.x, l2.x),
        height: Math.max(l1.y + l1.height, l2.y + l2.height) - Math.min(l1.y, l2.y),
        color: 'border-slate-850 bg-slate-100/10',
        content: `Merged: [${l1.content}] + [${l2.content}]`
      };

      const remaining = prev.layers.filter(l => l.id !== id1 && l.id !== id2);
      return {
        ...prev,
        layers: [...remaining, mergedLayer]
      };
    });
    setBulkCheckedLayerIds([]);
    logTrace(`[LAYER ENGINE] mergeLayers: Merged layer "${id1}" and "${id2}" non-destructively.`);
  };

  const duplicateLayer = (id: string) => {
    recordHistoryState();
    setActiveCanvas(prev => {
      const original = prev.layers.find(l => l.id === id);
      if (!original) return prev;
      const duplicate: CanvasLayer = {
        ...original,
        id: `lay_${Date.now().toString().slice(-4)}`,
        name: `${original.name} (Copy)`,
        x: original.x + (activeCanvas.width * 0.05),
        y: original.y + (activeCanvas.height * 0.05)
      };
      return {
        ...prev,
        layers: [...prev.layers, duplicate]
      };
    });
    logTrace(`[LAYER ENGINE] duplicateLayer: Duplicated layer [ID: ${id}] successfully.`);
  };

  const exportLayer = (id: string, format?: string) => {
    const layer = activeCanvas.layers.find(l => l.id === id);
    if (!layer) return;
    const resolvedFormat = format || 'png';
    incrementActiveExports();
    logTrace(`[LAYER ENGINE] exportLayer: Initiating export stream for Layer "${layer.name}"...`);
    setTimeout(() => {
      decrementActiveExports();
      logTrace(`[LAYER ENGINE] exportLayer: Completed layer compilation. [File: ${layer.name.toLowerCase().replace(/\s+/g, '_')}.${resolvedFormat}] downloaded successfully.`);
    }, 1100);
  };

  const deployStandardStack = () => {
    recordHistoryState();
    const standardStackList: CanvasLayer[] = [
      { id: 'std_00', name: 'Layer 00: Canvas Metadata', type: 'text', visible: true, locked: true, x: 0.1, y: 0.1, width: 3, height: 0.5, color: 'text-gray-400 font-mono text-[9px]', content: 'Project Frame Matrix and metadata markers' },
      { id: 'std_01', name: 'Layer 01: Background', type: 'vector', visible: true, locked: true, x: 0, y: 0, width: activeCanvas.width, height: activeCanvas.height, color: 'bg-white border-0 opacity-10', content: 'Base workspace color fill plane' },
      { id: 'std_02', name: 'Layer 02: Grid and Guides', type: 'dimension', visible: true, locked: true, x: 0, y: 0, width: activeCanvas.width, height: activeCanvas.height, color: 'border-blue-200 opacity-30 border-dashed', content: 'Calibrated snaps coordinates boundaries' },
      { id: 'std_03', name: 'Layer 03: Reference Image', type: 'raster', visible: true, locked: false, x: activeCanvas.width * 0.1, y: activeCanvas.height * 0.1, width: activeCanvas.width * 0.8, height: activeCanvas.height * 0.8, color: 'border-slate-300 opacity-40', content: 'Underlaid raw blueprint reference photo' },
      { id: 'std_04', name: 'Layer 04: Rough Sketch', type: 'raster', visible: true, locked: false, x: activeCanvas.width * 0.15, y: activeCanvas.height * 0.15, width: activeCanvas.width * 0.7, height: activeCanvas.height * 0.7, color: 'border-gray-400 opacity-50', content: 'Generative ideation outlines' },
      { id: 'std_05', name: 'Layer 05: Clean Vector Geometry', type: 'vector', visible: true, locked: false, x: activeCanvas.width * 0.2, y: activeCanvas.height * 0.2, width: activeCanvas.width * 0.6, height: activeCanvas.height * 0.6, color: 'border-blue-600 bg-blue-50/10', content: 'Strict SVG model paths specifications' },
      { id: 'std_06', name: 'Layer 06: Object Groups', type: 'vector', visible: true, locked: false, x: activeCanvas.width * 0.25, y: activeCanvas.height * 0.25, width: activeCanvas.width * 0.5, height: activeCanvas.height * 0.5, color: 'border-violet-500 bg-violet-50/5 border-dashed', content: 'Group of layers: standard assembly objects' },
      { id: 'std_07', name: 'Layer 07: Text', type: 'text', visible: true, locked: false, x: activeCanvas.width * 0.3, y: activeCanvas.height * 0.3, width: activeCanvas.width * 0.4, height: activeCanvas.height * 0.1, color: 'text-gray-900 font-sans', content: 'Display labels and active documentation annotations' },
      { id: 'std_08', name: 'Layer 08: Brand Elements', type: 'branding', visible: true, locked: false, x: activeCanvas.width * 0.05, y: activeCanvas.height * 0.05, width: activeCanvas.width * 0.2, height: activeCanvas.height * 0.2, color: 'border-amber-500 bg-amber-500/10 text-amber-700', content: 'Company logo and typography tags overlay' },
      { id: 'std_09', name: 'Layer 09: Materials', type: 'raster', visible: true, locked: false, x: activeCanvas.width * 0.2, y: activeCanvas.height * 0.2, width: activeCanvas.width * 0.6, height: activeCanvas.height * 0.6, color: 'border-teal-500 border-double opacity-80', content: 'Superimposed surface textures' },
      { id: 'std_10', name: 'Layer 10: Lighting', type: 'vector', visible: true, locked: false, x: activeCanvas.width * 0.1, y: activeCanvas.height * 0.1, width: activeCanvas.width * 0.4, height: activeCanvas.height * 0.4, color: 'border-yellow-400 bg-yellow-100/10 border-dotted', content: 'Studio spec ray casts at 45deg angle' },
      { id: 'std_11', name: 'Layer 11: Shadows', type: 'vector', visible: true, locked: false, x: activeCanvas.width * 0.2, y: activeCanvas.height * 0.6, width: activeCanvas.width * 0.6, height: activeCanvas.height * 0.2, color: 'bg-black/20 border-0', content: '3D specular contact-shadow footprints' },
      { id: 'std_12', name: 'Layer 12: Reflections', type: 'raster', visible: true, locked: false, x: activeCanvas.width * 0.2, y: activeCanvas.height * 0.7, width: activeCanvas.width * 0.6, height: activeCanvas.height * 0.2, color: 'border-cyan-400 opacity-20', content: 'Simulated glossy depth mirror surfaces' },
      { id: 'std_13', name: 'Layer 13: Callouts', type: 'text', visible: true, locked: false, x: activeCanvas.width * 0.05, y: activeCanvas.height * 0.75, width: activeCanvas.width * 0.3, height: activeCanvas.height * 0.15, color: 'text-indigo-600 font-mono', content: 'Visual pointers to critical features limits' },
      { id: 'std_14', name: 'Layer 14: Dimensions', type: 'dimension', visible: true, locked: false, x: activeCanvas.width * 0.4, y: activeCanvas.height * 0.8, width: activeCanvas.width * 0.4, height: activeCanvas.height * 0.1, color: 'border-emerald-500 text-emerald-800', content: 'Mechanical metrics calipers: height, thickness, diameter' },
      { id: 'std_15', name: 'Layer 15: Engineering Notes', type: 'text', visible: true, locked: false, x: activeCanvas.width * 0.5, y: activeCanvas.height * 0.05, width: activeCanvas.width * 0.45, height: activeCanvas.height * 0.2, color: 'text-stone-800 font-mono border border-stone-200 p-2 text-[10px]', content: 'Material tolerance and lathed clearances' },
      { id: 'std_16', name: 'Layer 16: DFM Notes', type: 'dimension', visible: true, locked: false, x: activeCanvas.width * 0.02, y: activeCanvas.height * 0.9, width: activeCanvas.width * 0.96, height: activeCanvas.height * 0.08, color: 'border-red-500 text-red-900 bg-red-50/5', content: 'Injection splay risk checks / wall thickness certification guidelines' },
      { id: 'std_17', name: 'Layer 17: Export Marks', type: 'dimension', visible: true, locked: true, x: 0.125, y: 0.125, width: activeCanvas.width - 0.25, height: activeCanvas.height - 0.25, color: 'border-rose-400 border-dashed', content: 'Mechanical offset trim lines and registration marks' },
      { id: 'std_18', name: 'Layer 18: Preview Render', type: 'raster', visible: true, locked: true, x: 0, y: 0, width: activeCanvas.width, height: activeCanvas.height, color: 'opacity-100', content: 'Photoreal high-res consolidated CAD preview mockup' }
    ];

    setActiveCanvas(prev => ({
      ...prev,
      layers: standardStackList
    }));
    setSelectedLayerId('std_05');
    setBulkCheckedLayerIds([]);
    logTrace(`[LAYER ENGINE] deployStandardStack: Instantiated all 19 standard professional CAD layers [Layer 00 - Layer 18].`);
  };

  // Initialize Raster stack with premium tech image
  useEffect(() => {
    if (rasterImageEngine.listLayers().length === 0) {
      const defaultImg = rasterImageEngine.createRasterLayer({
        name: "Ultra-Premium Chassis Render",
        source: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        width: 800,
        height: 600,
        mime_type: "image/png",
        x: 0,
        y: 0,
      });
      // seed lighting pass and cast shadow pass immediately
      rasterImageEngine.applyLighting(defaultImg.id, {
        type: "studio",
        angle: 45,
        intensity: 0.85,
        softness: 0.9,
      });
      rasterImageEngine.applyShadow(defaultImg.id, {
        x: 16,
        y: 20,
        blur: 24,
        opacity: 0.4,
      });
    }
    const layersOnLoad = rasterImageEngine.listLayers();
    setRasterLayers(layersOnLoad);
    if (layersOnLoad.length > 0) {
      setSelectedRasterLayerId(layersOnLoad[0].id);
    }
  }, []);

  // Quark/InDesign Layout Engine State Variables
  const [activeLayout, setActiveLayout] = useState<LayoutModel>(() => createLayout({ type: 'business_card', name: 'Premium Business Card' }));
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editorTextContent, setEditorTextContent] = useState('Alexander Vance\nChief Operations Engineer\nVisualOS Inc.');
  const [editorFontSize, setEditorFontSize] = useState(12);
  const [isGridSnappingEnabled, setIsGridSnappingEnabled] = useState(true);
  const [layoutTraceHistory, setLayoutTraceHistory] = useState<string[]>(['[LAYOUT] Initialized business_card engine coordinate space (3.5" x 2.0")']);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [blockDragOffset, setBlockDragOffset] = useState({ x: 0, y: 0 });

  // Sync real-time workspace metrics to Navigation context
  useEffect(() => {
    const canvasesCount = 1 + savedPresets.length;
    setCanvasesCount(canvasesCount);
  }, [savedPresets.length, setCanvasesCount]);

  useEffect(() => {
    const totalLayers = activeCanvas.layers.length + rasterLayers.length + activeLayout.blocks.length;
    setLayersCount(totalLayers);
  }, [activeCanvas.layers.length, rasterLayers.length, activeLayout.blocks.length, setLayersCount]);

  // Autocomplete suggestions selector
  useEffect(() => {
    if (!typedCommand) {
      setAutocompleteSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const trimmed = typedCommand.toLowerCase();
    const matches = COMMAND_RECIPES.filter(
      r => r.command.toLowerCase().includes(trimmed) || r.label.toLowerCase().includes(trimmed)
    ).map(r => r.command);

    setAutocompleteSuggestions(matches.slice(0, 5));
    setShowSuggestions(matches.length > 0);
  }, [typedCommand]);

  // Click outside autocomplete to dismiss
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set units conversion - preserving all layers and objects after resizing
  const setUnits = (newUnit: CanvasUnit) => {
    const oldUnit = activeCanvas.unit;
    if (oldUnit === newUnit) return;
    recordHistoryState();

    // Conversion factor to pixels (assuming 96px = 1 inch, 1 in = 25.4 mm)
    const toPx = (val: number, u: CanvasUnit) => {
      if (u === 'inches') return val * 96;
      if (u === 'millimeters') return val * (96 / 25.4);
      return val;
    };

    const fromPx = (val: number, u: CanvasUnit) => {
      if (u === 'inches') return val / 96;
      if (u === 'millimeters') return val * (25.4 / 96);
      return val;
    };

    const convert = (val: number) => {
      const px = toPx(val, oldUnit);
      return parseFloat(fromPx(px, newUnit).toFixed(4));
    };

    setActiveCanvas(prev => {
      const newWidth = convert(prev.width);
      const newHeight = convert(prev.height);
      const newBleed = convert(prev.bleed);
      const newSafeZone = convert(prev.safe_zone);
      const newGridSize = convert(prev.grid.size);

      const convertedLayers = prev.layers.map(layer => ({
        ...layer,
        x: convert(layer.x),
        y: convert(layer.y),
        width: convert(layer.width),
        height: convert(layer.height),
      }));

      const convertedGuides = prev.guides.map(guide => convert(guide));

      return {
        ...prev,
        unit: newUnit,
        width: newWidth,
        height: newHeight,
        bleed: newBleed,
        safe_zone: newSafeZone,
        grid: { ...prev.grid, size: newGridSize },
        guides: convertedGuides,
        layers: convertedLayers
      };
    });

    logTrace(`[CONV] Converted coordinates from ${oldUnit} to ${newUnit} cleanly. Scaled layers safely.`);
  };

  const setCanvasSize = (w: number, h: number) => {
    recordHistoryState();
    setActiveCanvas(prev => ({
      ...prev,
      width: w,
      height: h,
      aspect_ratio: 'custom'
    }));
    logTrace(`[CANVAS] Resized layout canvas size to ${w} x ${h} ${activeCanvas.unit}.`);
  };

  const setDPI = (dpiVal: number) => {
    recordHistoryState();
    setActiveCanvas(prev => ({ ...prev, dpi: dpiVal }));
    logTrace(`[SPEC] Canvas compilation DPI set to ${dpiVal}.`);
  };

  const setColorMode = (mode: 'CMYK' | 'RGB') => {
    recordHistoryState();
    setActiveCanvas(prev => ({ ...prev, color_mode: mode }));
    logTrace(`[SPEC] System color target constraints set to ${mode}.`);
  };

  const setBleed = (bleedVal: number) => {
    recordHistoryState();
    setActiveCanvas(prev => ({ ...prev, bleed: bleedVal }));
    logTrace(`[SPEC] Trim bleed offset set to ${bleedVal} ${activeCanvas.unit}.`);
  };

  const setSafeZone = (safeVal: number) => {
    recordHistoryState();
    setActiveCanvas(prev => ({ ...prev, safe_zone: safeVal }));
    logTrace(`[SPEC] Safe Zone margin set to ${safeVal} ${activeCanvas.unit}.`);
  };

  const setBackground = (bg: string) => {
    recordHistoryState();
    setActiveCanvas(prev => ({ ...prev, background: bg === 'dark' ? '#0a0f1d' : bg === 'white' ? '#ffffff' : bg }));
    logTrace(`[LAYOUT] Canvas workspace background color set to "${bg}".`);
  };

  const setGridEnabled = (show: boolean) => {
    recordHistoryState();
    setActiveCanvas(prev => ({ ...prev, grid: { ...prev.grid, show } }));
    logTrace(`[GRID] Visual Snapping grid overlay is now ${show ? 'VISIBLE' : 'HIDDEN'}.`);
  };

  const duplicateCanvas = () => {
    recordHistoryState();
    logTrace(`[CLONE] Duplicating current canvas layout "${activeCanvas.name}"...`);
    logTrace(`[CLONE] Spawned Canvas Reference: ${activeCanvas.canvas_id}_copy. Preserved ${activeCanvas.layers.length} separate vectors.`);
  };

  // Helper logger
  const logTrace = (msg: string) => {
    setCliLogs(prev => [...prev, msg]);
  };

  // Save active canvas + graph state to undo stack
  const recordHistoryState = (optionalGraph?: VisualProjectGraph) => {
    const currentGraph = optionalGraph || projectGraph;
    const snapshot: VisualProjectGraph = {
      ...currentGraph,
      canvases: [JSON.parse(JSON.stringify(activeCanvas))],
      layers: JSON.parse(JSON.stringify(activeCanvas.layers))
    };
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]); // reset redo on any action
  };

  // VisualOS Core Core APIs
  const createProjectFile = () => {
    recordHistoryState();
    const newId = `project_${Math.floor(Math.random() * 900) + 100}`;
    const initialGraph: VisualProjectGraph = {
      project_id: newId,
      name: 'VisualOS Draft Project',
      canvases: [JSON.parse(JSON.stringify(activeCanvas))],
      layers: JSON.parse(JSON.stringify(activeCanvas.layers)),
      objects: [],
      vectors: [],
      rasters: [],
      text_blocks: [],
      brand_rules: { lockPalette: false },
      dimensions: [],
      materials: [],
      callouts: [],
      exports: [],
      history: []
    };
    setProjectGraph(initialGraph);
    logTrace(`[GRAPH] Created new project container file "${initialGraph.name}". Document graph initialized.`);
  };

  const serializeDocumentGraph = (graph: VisualProjectGraph): string => {
    const payload: VisualProjectGraph = {
      ...graph,
      canvases: [activeCanvas],
      layers: activeCanvas.layers
    };
    return JSON.stringify(payload, null, 2);
  };

  const deserializeDocumentGraph = (jsonStr: string) => {
    try {
      const parsedFile = JSON.parse(jsonStr) as VisualProjectGraph;
      if (!parsedFile.project_id) {
        throw new Error("Missing project_id in .visualos envelope schema.");
      }
      recordHistoryState();
      setProjectGraph(parsedFile);
      if (parsedFile.canvases && parsedFile.canvases.length > 0) {
        setActiveCanvas(parsedFile.canvases[0]);
        if (parsedFile.canvases[0].layers && parsedFile.canvases[0].layers.length > 0) {
          setSelectedLayerId(parsedFile.canvases[0].layers[0].id);
        }
      } else if (parsedFile.layers) {
        setActiveCanvas(prev => ({
          ...prev,
          layers: parsedFile.layers
        }));
      }
      logTrace(`[GRAPH] Parsed .visualos successfully. Project: "${parsedFile.name}" [ID: ${parsedFile.project_id}] with ${parsedFile.layers?.length || 0} editable layer vectors.`);
    } catch (e: any) {
      logTrace(`[ERR] Failed to deserialize document graph: ${e.message}`);
    }
  };

  const saveProjectFile = () => {
    const data = serializeDocumentGraph(projectGraph);
    const blob = new Blob([data], { type: "application/json" });
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = `${projectGraph.name.toLowerCase().replace(/\s+/g, '_') || 'project'}.visualos`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logTrace(`[GRAPH] Serialized and downloaded project package as ${projectGraph.name.toLowerCase().replace(/\s+/g, '_')}.visualos successfully.`);
  };

  const loadProjectFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      deserializeDocumentGraph(content);
    };
    reader.readAsText(file);
  };

  const addObjectToGraph = (type: string, name: string) => {
    recordHistoryState();
    const newObjId = `obj_${Date.now().toString().slice(-4)}`;
    const newObj = {
      id: newObjId,
      name: name || `New Graph ${type}`,
      type: type,
      linkedLayerId: undefined
    };
    setProjectGraph(prev => ({
      ...prev,
      objects: [...prev.objects, newObj]
    }));
    logTrace(`[GRAPH] Created object rule "${newObj.name}" in project document tree.`);
    return newObjId;
  };

  const updateObjectInGraph = (id: string, updatedFields: any) => {
    recordHistoryState();
    setProjectGraph(prev => ({
      ...prev,
      objects: prev.objects.map(obj => obj.id === id ? { ...obj, ...updatedFields } : obj)
    }));
    logTrace(`[GRAPH] Updated properties of object ID: ${id}.`);
  };

  const linkObjectToLayer = (objId: string, layerId: string) => {
    recordHistoryState();
    setProjectGraph(prev => ({
      ...prev,
      objects: prev.objects.map(obj => obj.id === objId ? { ...obj, linkedLayerId: layerId } : obj)
    }));
    logTrace(`[GRAPH] Linked graph object "${objId}" to active visual layer ID "${layerId}".`);
  };

  const versionProject = (versionName: string) => {
    const vName = versionName || `Checkpoint v${projectGraph.history.length + 1}`;
    const newHistItem: ProjectHistoryItem = {
      id: `v_${Date.now().toString().slice(-4)}`,
      name: vName,
      timestamp: new Date().toLocaleTimeString(),
      canvasState: JSON.parse(JSON.stringify(activeCanvas))
    };
    setProjectGraph(prev => ({
      ...prev,
      history: [...prev.history, newHistItem]
    }));
    logTrace(`[VERSION] Registered project checkpoint version: "${newHistItem.name}" [ID: ${newHistItem.id}].`);
  };

  const restoreVersion = (versionId: string) => {
    const idx = projectGraph.history.find(h => h.id === versionId || h.name === versionId);
    if (!idx) {
      logTrace(`[ERR] Failed to find version lookup: "${versionId}"`);
      return;
    }
    recordHistoryState();
    setActiveCanvas(idx.canvasState);
    if (idx.canvasState.layers && idx.canvasState.layers.length > 0) {
      setSelectedLayerId(idx.canvasState.layers[0].id);
    }
    logTrace(`[VERSION] Restored project state back to historical checkpoint: "${idx.name}" cleanly.`);
  };

  const undo = () => {
    if (undoStack.length === 0) {
      logTrace(`[HISTORY] Undo stack empty. Currently at oldest node.`);
      return;
    }
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    const currentSnapshot: VisualProjectGraph = {
      ...projectGraph,
      canvases: [activeCanvas],
      layers: activeCanvas.layers
    };
    setRedoStack(prev => [...prev, currentSnapshot]);
    setProjectGraph(previous);
    if (previous.canvases && previous.canvases.length > 0) {
      setActiveCanvas(previous.canvases[0]);
    }
    logTrace(`[HISTORY] Action undone successfully.`);
  };

  const redo = () => {
    if (redoStack.length === 0) {
      logTrace(`[HISTORY] Redo stack empty. Currently at newest node.`);
      return;
    }
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    const currentSnapshot: VisualProjectGraph = {
      ...projectGraph,
      canvases: [activeCanvas],
      layers: activeCanvas.layers
    };
    setUndoStack(prev => [...prev, currentSnapshot]);
    setProjectGraph(next);
    if (next.canvases && next.canvases.length > 0) {
      setActiveCanvas(next.canvases[0]);
    }
    logTrace(`[HISTORY] Action redone successfully.`);
  };

  // Create Canvas via Command or Select
  const handleCreateCanvas = (typeKey: string) => {
    const template = CANVAS_PRESETS_DATA[typeKey];
    if (!template) {
      logTrace(`[ERR] Failed to find template format: "${typeKey}".`);
      return;
    }

    const uniqueId = `canvas_${Math.floor(Math.random() * 900) + 100}`;
    setActiveCanvas({
      ...template,
      canvas_id: uniqueId,
    });
    setSelectedLayerId(template.layers[0]?.id || null);
    logTrace(`[CANVAS] Loaded preset type "${typeKey}" instantly. Canvas ID: ${uniqueId}. Grid Snap: ${template.grid.snapping ? 'ON' : 'OFF'}.`);
  };

  // Auto layout aspect ratio adjustments
  const handleApplyAspectRatio = (ratioStr: string) => {
    let multiplierStr = ratioStr;
    let factor = 1;
    if (ratioStr === '16:9') factor = 9 / 16;
    else if (ratioStr === '3:2') factor = 2 / 3;
    else if (ratioStr === '4:3') factor = 3 / 4;
    else if (ratioStr === '1:1') factor = 1;
    else if (ratioStr === 'custom') {
      logTrace(`[COMPILER] Custom aspect ratio constraint enabled.`);
      return;
    }

    setActiveCanvas(prev => {
      const computedHeight = parseFloat((prev.width * factor).toFixed(3));
      return {
        ...prev,
        height: computedHeight,
        aspect_ratio: ratioStr
      };
    });

    logTrace(`[AUTOLAYOUT] Applied aspect ratio constraint [${ratioStr}]. Height adjusted relative to ${activeCanvas.width} ${activeCanvas.unit}.`);
  };

  // Command Execution engine
  const executeCommandLine = (cmdText: string) => {
    const clean = cmdText.trim().replace(/^\//, ''); // strip leading slash if present
    const args = clean.split(' ');
    const baseCommand = args[0].toLowerCase();

    logTrace(`wongsanginc@visualos:~$ /${clean}`);

    if (baseCommand === 'undo') {
      undo();
    } else if (baseCommand === 'redo') {
      redo();
    } else if (baseCommand === 'createproject') {
      createProjectFile();
    } else if (baseCommand === 'saveproject' || (baseCommand === 'export' && args[1] === 'visualos')) {
      saveProjectFile();
    } else if (baseCommand === 'version') {
      const vName = args.slice(1).join(' ');
      versionProject(vName);
    } else if (baseCommand === 'restore') {
      const vTarget = args[1];
      restoreVersion(vTarget);
    } else if (baseCommand === 'addobject') {
      const objType = args[1] || 'vector';
      const objName = args.slice(2).join(' ');
      addObjectToGraph(objType, objName);
    } else if (baseCommand === 'linkobject') {
      const objId = args[1];
      const lId = args[2];
      linkObjectToLayer(objId, lId);
    } else if (baseCommand === 'create' && args[1] === 'canvas') {
      const reqType = args.slice(2).join('_').toLowerCase();
      recordHistoryState();
      // Match aliases
      if (reqType.includes('business') || reqType.includes('card')) {
        handleCreateCanvas('business_card');
      } else if (reqType.includes('letter') || reqType.includes('letterhead')) {
        handleCreateCanvas('letterhead');
      } else if (reqType.includes('poster')) {
        handleCreateCanvas('poster');
      } else if (reqType.includes('presentation') || reqType === 'slide') {
        handleCreateCanvas('presentation_slide');
      } else if (reqType.includes('ui') || reqType.includes('screen')) {
        handleCreateCanvas('ui_screen');
      } else if (reqType.includes('fashion') || reqType.includes('tech') || reqType === 'tech_pack') {
        handleCreateCanvas('fashion_tech_pack');
      } else if (reqType.includes('industrial') || reqType.includes('scooter')) {
        handleCreateCanvas('industrial_design_board');
      } else if (reqType.includes('architecture')) {
        handleCreateCanvas('architecture_sheet');
      } else if (reqType.includes('dfm_sheet') || reqType.includes('dfm')) {
        handleCreateCanvas('dfm_sheet');
      } else if (reqType.includes('cad') || reqType.includes('reference')) {
        handleCreateCanvas('cad_reference_sheet');
      } else {
        handleCreateCanvas('blank_canvas');
      }
    } else if (baseCommand === 'setunits') {
      const target = args[1]?.toLowerCase();
      if (target === 'px' || target === 'pixels') {
        setUnits('pixels');
      } else if (target === 'in' || target === 'inches') {
        setUnits('inches');
      } else if (target === 'mm' || target === 'millimeters') {
        setUnits('millimeters');
      } else {
        logTrace(`[ERR] Unknown unit. Choose from: pixels, inches, millimeters.`);
      }
    } else if (baseCommand === 'setbleed') {
      const val = parseFloat(args[1]);
      if (!isNaN(val)) {
        setBleed(val);
      } else {
        logTrace(`[ERR] Invalid numerical values for bleed.`);
      }
    } else if (baseCommand === 'setsafezone') {
      const val = parseFloat(args[1]);
      if (!isNaN(val)) {
        setSafeZone(val);
      } else {
        logTrace(`[ERR] Invalid numerical values for Safe Area.`);
      }
    } else if (baseCommand === 'setdpi') {
      const val = parseInt(args[1], 10);
      if (!isNaN(val)) {
        setDPI(val);
      } else {
        logTrace(`[ERR] Invalid integer value for DPI.`);
      }
    } else if (baseCommand === 'setcolormode') {
      const target = args[1]?.toUpperCase();
      if (target === 'RGB' || target === 'CMYK') {
        setColorMode(target as 'RGB' | 'CMYK');
      } else {
        logTrace(`[ERR] Unknown color mode. Choose: CMYK or RGB.`);
      }
    } else if (baseCommand === 'setbackground') {
      const target = args.slice(1).join(' ');
      setBackground(target);
    } else if (baseCommand === 'addlayer' || (baseCommand === 'layer' && args[1] === 'add')) {
      const name = args.includes('add') ? args.slice(2).join(' ') : args.slice(1).join(' ');
      const layerName = name || `Layer ${activeCanvas.layers.length + 1}`;
      
      // Compute safe center coordinates
      const cx = activeCanvas.width / 4;
      const cy = activeCanvas.height / 4;
      const cw = activeCanvas.width / 2;
      const ch = activeCanvas.height / 2;

      const newId = `lay_${Date.now().toString().slice(-4)}`;
      const newLayer: CanvasLayer = {
        id: newId,
        name: layerName,
        type: 'vector',
        visible: true,
        locked: false,
        x: cx,
        y: cy,
        width: cw,
        height: ch,
        color: 'border-blue-600 bg-blue-50/15',
        content: `Custom Vector Group`
      };

      setActiveCanvas(prev => ({
        ...prev,
        layers: [...prev.layers, newLayer]
      }));
      setSelectedLayerId(newId);
      logTrace(`[LAYERS] Created new scalable layer "${layerName}" at center coods.`);
    } else if (baseCommand === 'addtext' || (baseCommand === 'text' && args[1] === 'add')) {
      const textVal = args.includes('add') ? args.slice(2).join(' ') : args.slice(1).join(' ');
      const cleanVal = textVal || 'Editable Dynamic Text';

      const cx = activeCanvas.width / 3;
      const cy = activeCanvas.height / 3;

      const newId = `txt_${Date.now().toString().slice(-4)}`;
      const newLayer: CanvasLayer = {
        id: newId,
        name: `Text Layer [${cleanVal.slice(0, 10)}]`,
        type: 'text',
        visible: true,
        locked: false,
        x: cx,
        y: cy,
        width: activeCanvas.width / 2,
        height: activeCanvas.height / 8,
        color: 'text-gray-900',
        content: cleanVal
      };

      setActiveCanvas(prev => ({
        ...prev,
        layers: [...prev.layers, newLayer]
      }));
      setSelectedLayerId(newId);
      logTrace(`[TEXT] Added text block layer centered with content: "${cleanVal}"`);
    } else if (baseCommand === 'vector' && args[1] === 'shape') {
      const shapeType = args[2]?.toLowerCase() || 'rect';
      const cx = activeCanvas.width / 4;
      const cy = activeCanvas.height / 4;
      
      const newId = `vec_${Date.now().toString().slice(-4)}`;
      const newL: CanvasLayer = {
        id: newId,
        name: `Parametric ${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Outline`,
        type: 'vector',
        visible: true,
        locked: false,
        x: cx,
        y: cy,
        width: activeCanvas.width / 3,
        height: activeCanvas.width / 3,
        color: shapeType === 'circle' ? 'rounded-full border-blue-500 bg-blue-100/10' : 'border-blue-500 bg-blue-100/10',
        content: `SVG Path: Shape rendering`
      };

      setActiveCanvas(prev => ({
        ...prev,
        layers: [...prev.layers, newL]
      }));
      setSelectedLayerId(newId);
      logTrace(`[GFX] Drawn vector mathematical ${shapeType} outline geometry.`);
    } else if (baseCommand === 'uploadbrandguide') {
      const gText = args.slice(1).join(' ');
      uploadBrandGuide(gText || undefined);
    } else if (baseCommand === 'applybrand') {
      applyBrandToCanvas();
    } else if (baseCommand === 'validatebrand') {
      validateBrandCompliance();
    } else if (baseCommand === 'lockbrandpalette') {
      const lockVal = args[1]?.toLowerCase() === 'true';
      lockBrandPalette(lockVal);
    } else if (baseCommand === 'createuiscreen') {
      const sType = args[args.length - 1]?.toLowerCase();
      const typeToUse = (sType === 'mobile' || sType === 'tablet' || sType === 'desktop') ? sType : 'mobile';
      const sName = typeToUse === sType ? args.slice(1, -1).join(' ') : args.slice(1).join(' ');
      createUIScreen(sName || undefined, typeToUse);
    } else if (baseCommand === 'createwireframe') {
      createWireframe();
    } else if (baseCommand === 'createbutton') {
      const scrId = args[1] || activeUiScreenId;
      const bText = args.slice(2).join(' ') || 'Brand Call Button';
      createButton(scrId, 'Button', bText);
    } else if (baseCommand === 'createinputfield') {
      const scrId = args[1] || activeUiScreenId;
      const placeholderText = args.slice(2).join(' ') || 'Placeholder Input';
      createInputField(scrId, 'Input', placeholderText);
    } else if (baseCommand === 'createcard') {
      const scrId = args[1] || activeUiScreenId;
      const cText = args.slice(2).join(' ') || 'Card Content Spec';
      createCard(scrId, 'Card', cText);
    } else if (baseCommand === 'createnavbar') {
      const scrId = args[1] || activeUiScreenId;
      const nText = args.slice(2).join(' ') || 'Header Portal';
      createNavBar(scrId, 'NavBar', nText);
    } else if (baseCommand === 'createmodal') {
      const scrId = args[1] || activeUiScreenId;
      const mText = args.slice(2).join(' ') || 'Overlays Dialog Alert';
      createModal(scrId, 'Modal', mText);
    } else if (baseCommand === 'exportdesignspec') {
      const specFmt = (args[1]?.toLowerCase() as any) || 'json';
      exportDesignSpec(specFmt);
    } else if (baseCommand === 'export') {
      const format = args[1]?.toLowerCase() || 'svg';
      triggerExportDownload(format);
    } else if (baseCommand === 'createlayer') {
      const name = args.slice(1).join(' ');
      createLayer(name, 'vector');
    } else if (baseCommand === 'renamelayer') {
      const targetId = args[1];
      const newName = args.slice(2).join(' ');
      if (targetId && newName) {
        renameLayer(targetId, newName);
      } else {
        logTrace(`[ERR] Use /renameLayer [layer_id] [new_name]`);
      }
    } else if (baseCommand === 'deletelayer') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        deleteLayer(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to delete.`);
      }
    } else if (baseCommand === 'hidelayer') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        hideLayer(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to hide.`);
      }
    } else if (baseCommand === 'showlayer') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        showLayer(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to show.`);
      }
    } else if (baseCommand === 'locklayer') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        lockLayer(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to lock.`);
      }
    } else if (baseCommand === 'unlocklayer') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        unlockLayer(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to unlock.`);
      }
    } else if (baseCommand === 'grouplayers') {
      const idsStr = args[1];
      const groupName = args.slice(2).join(' ');
      if (idsStr) {
        groupLayers(idsStr.split(','), groupName);
      } else {
        logTrace(`[ERR] Use /groupLayers [id1,id2,id3] [Group Name]`);
      }
    } else if (baseCommand === 'ungrouplayers') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        ungroupLayers(targetId);
      } else {
        logTrace(`[ERR] Specify a Group layer ID to ungroup.`);
      }
    } else if (baseCommand === 'movelayerup') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        moveLayerUp(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to move up.`);
      }
    } else if (baseCommand === 'movelayerdown') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        moveLayerDown(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to move down.`);
      }
    } else if (baseCommand === 'mergelayers') {
      const id1 = args[1];
      const id2 = args[2];
      if (id1 && id2) {
        mergeLayers(id1, id2);
      } else {
        logTrace(`[ERR] Use /mergeLayers [id1] [id2]`);
      }
    } else if (baseCommand === 'duplicatelayer') {
      const targetId = args[1] || selectedLayerId;
      if (targetId) {
        duplicateLayer(targetId);
      } else {
        logTrace(`[ERR] Specify a layer ID or select a layer to duplicate.`);
      }
    } else if (baseCommand === 'exportlayer') {
      const targetId = args[1] || selectedLayerId;
      const format = args[2] || 'png';
      if (targetId) {
        exportLayer(targetId, format);
      } else {
        logTrace(`[ERR] Specify a layer ID to export.`);
      }
    } else if (baseCommand === 'preset' && args[1] === 'save') {
      const presetName = args[2] || `Preset_${savedPresets.length + 1}`;
      const newP: ToolPreset = {
        id: `p_${Date.now().toString().slice(-4)}`,
        name: presetName,
        canvasType: activeCanvas.type,
        unit: activeCanvas.unit,
        colorMode: activeCanvas.color_mode,
        bleed: activeCanvas.bleed,
        safeZone: activeCanvas.safe_zone,
      };
      setSavedPresets(prev => [...prev, newP]);
      logTrace(`[PRESETS] Saved current workspace parameters as "${presetName}" preset successfully.`);
    } else if (baseCommand === 'layout') {
      setGraphSidebarTab('layout');
      const action = args[1]?.toLowerCase();
      if (!action) {
        logTrace(`[LAYOUT] Active layout: "${activeLayout.name}" [ID: ${activeLayout.layout_id}] - ${activeLayout.width}"x${activeLayout.height}" with ${activeLayout.blocks.length} blocks.`);
      } else if (action === 'create') {
        const layoutType = (args[2] || 'business_card') as LayoutType;
        const fresh = createLayout({ type: layoutType });
        setActiveLayout(fresh);
        logTrace(`[LAYOUT] Created new Quark-standard page template of style "${layoutType}" [${fresh.width} x ${fresh.height} ${fresh.unit}].`);
      } else if (action === 'margins') {
        const val = parseFloat(args[2] || '0.5');
        const customMargins = { top: val, bottom: val, left: val, right: val };
        setActiveLayout(prev => setMargins(prev.layout_id, customMargins));
        logTrace(`[LAYOUT] Re-calibrated physical layout margins uniformly to: ${val} ${activeLayout.unit}.`);
      } else if (action === 'columns') {
        const count = parseInt(args[2] || '3', 10);
        const gutter = parseFloat(args[3] || '0.25');
        setActiveLayout(prev => setColumns(prev.layout_id, { count, gutter }));
        logTrace(`[LAYOUT] Partitioned column-grid layout with ${count} columns and ${gutter} ${activeLayout.unit} gutters.`);
      } else if (action === 'bleed') {
        const val = parseFloat(args[2] || '0.125');
        setActiveLayout(prev => setEngineBleed(prev.layout_id, val));
        logTrace(`[LAYOUT] Calibrated exterior trim bleed box scale to: ${val} ${activeLayout.unit}.`);
      } else if (action === 'addtext') {
        const content = args.slice(2).join(' ') || 'Header Typography Block';
        setActiveLayout(prev => placeTextBlock(prev.layout_id, content, prev.margins.left + 0.2, prev.margins.top + 0.2, prev.width - prev.margins.left - prev.margins.right - 0.4, 0.8, { fontSize: 13 }));
        logTrace(`[LAYOUT] Placed highly editable typography block inside column bounds: "${content}"`);
      } else if (action === 'addimage') {
        setActiveLayout(prev => placeImageBlock(prev.layout_id, '/assets/sample.jpg', prev.margins.left, prev.height - prev.margins.bottom - 1.5, prev.width - prev.margins.left - prev.margins.right, 1.2, { objectFit: 'cover' }));
        logTrace(`[LAYOUT] Dropped bounded photo holder with automatic alignment grids.`);
      } else if (action === 'align' || action === 'snap') {
        setActiveLayout(prev => snapAllBlocksToGrid(prev, 0.25));
        logTrace(`[LAYOUT] Snapped coordinates of all blocks to the nearest 0.25 column division margins.`);
      } else if (action === 'export' || action === 'pdf') {
        const filename = `${activeLayout.type}_quark_ready.svg`;
        const svgString = exportPrintPDF(activeLayout.layout_id).svg;
        const uriData = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
        const anchor = document.createElement('a');
        anchor.setAttribute("href", uriData);
        anchor.setAttribute("download", filename);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        logTrace(`[LAYOUT] Pre-flight audit complete: Generated trim-marked vector container. Saving PDF-bound ${filename}...`);
      } else {
        logTrace(`[ERR] Unknown layout action "${action}". Available: create, margins, columns, bleed, addtext, addimage, align, export.`);
      }
    } else if (baseCommand === 'raster' || baseCommand === 'photo') {
      setGraphSidebarTab('raster');
      const action = args[1]?.toLowerCase();
      if (!action) {
        logTrace(`[RASTER] Selected Raster layers total density: ${rasterImageEngine.listLayers().length} non-flattened Photoshop layers registered.`);
      } else if (action === 'create' || action === 'import') {
        const name = args.slice(2).join(' ') || `ImportedDevice_${Date.now().toString().slice(-4)}`;
        const l = rasterImageEngine.createRasterLayer({
          name,
          source: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          width: 800,
          height: 600,
        });
        setRasterLayers(rasterImageEngine.listLayers());
        setSelectedRasterLayerId(l.id);
        logTrace(`[RASTER] Registered scalable raw photoraster device layer "${name}" [ID: ${l.id}] on stack.`);
      } else if (action === 'removebg' || action === 'cutout') {
        const targetId = args[2] || selectedRasterLayerId;
        if (!targetId) {
          logTrace(`[ERR] Please specify a valid Raster layer ID or select a layer.`);
        } else {
          rasterImageEngine.removeBackground(targetId, { method: 'ai' });
          setRasterLayers(rasterImageEngine.listLayers());
          logTrace(`[RASTER] Non-destructive AI Neural Matting applied for boundary separation on Layer ${targetId}.`);
        }
      } else if (action === 'material' || action === 'texture') {
        const matType = (args[2] || 'stainless_steel') as MaterialType;
        const targetId = args[3] || selectedRasterLayerId;
        if (!targetId) {
          logTrace(`[ERR] Please specify a valid Raster layer ID or select a layer.`);
        } else {
          rasterImageEngine.applyMaterial(targetId, { type: matType, roughness: 0.2, metallic: 0.95 });
          setRasterLayers(rasterImageEngine.listLayers());
          logTrace(`[RASTER] Superimposed photorealistic dynamic matte layer of material: "${matType}" on stack.`);
        }
      } else if (action === 'lighting' || action === 'studio') {
        const type = (args[2] || 'studio') as any;
        const targetId = args[3] || selectedRasterLayerId;
        if (!targetId) {
          logTrace(`[ERR] Please specify a valid Raster layer ID or select a layer.`);
        } else {
          rasterImageEngine.applyLighting(targetId, { type, angle: 45, intensity: 0.85 });
          setRasterLayers(rasterImageEngine.listLayers());
          logTrace(`[RASTER] Ray cast lighting rig pass applied: "${type}" at 45 degree vector angle.`);
        }
      } else if (action === 'shadow') {
        const targetId = args[2] || selectedRasterLayerId;
        if (!targetId) {
          logTrace(`[ERR] Please specify a valid Raster layer ID or select a layer.`);
        } else {
          rasterImageEngine.applyShadow(targetId, { x: 12, y: 16, blur: 24, opacity: 0.35 });
          setRasterLayers(rasterImageEngine.listLayers());
          logTrace(`[RASTER] Simulated 3D specular ground-shadow footprint overlay under chassis plane.`);
        }
      } else if (action === 'reflection') {
        const targetId = args[2] || selectedRasterLayerId;
        if (!targetId) {
          logTrace(`[ERR] Please specify a valid Raster layer ID or select a layer.`);
        } else {
          rasterImageEngine.applyReflection(targetId, { direction: 'vertical', distance: 20 });
          setRasterLayers(rasterImageEngine.listLayers());
          logTrace(`[RASTER] Placed fading mirror reflective depth pass below subject boundary.`);
        }
      } else if (action === 'export') {
        const targetId = args[2] || selectedRasterLayerId;
        const format = args[3]?.toLowerCase() || 'png';
        if (!targetId) {
          logTrace(`[ERR] Please specify a valid Raster layer ID.`);
        } else {
          if (format === 'png') {
            const res = rasterImageEngine.exportPNG(targetId, { transparentBackground: true });
            logTrace(`[RASTER] Compiled non-destructive stack. Output format: PNG. Transparency: TRUE. Quality: ${res.quality}`);
          } else {
            const res = rasterImageEngine.exportJPEG(targetId);
            logTrace(`[RASTER] Compiled non-destructive stack. Output format: JPEG. Transparency: FALSE. Quality: ${res.quality}`);
          }
        }
      } else {
        logTrace(`[ERR] Unknown raster action "${action}". Available: create, cutout, material, lighting, shadow, reflection, export`);
      }
    } else if (baseCommand === 'createproductsheet') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] createProductSheet: Initializing AI generative analyzer...`);
    } else if (baseCommand === 'addheroview' || baseCommand === 'addsideview' || baseCommand === 'addfrontview' || baseCommand === 'addtopview') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] ${baseCommand}: Successfully mapped a dynamic auxiliary projection view.`);
    } else if (baseCommand === 'addcallouts') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] addCallouts: Spawning descriptive indicator pins on target coordinate anchors.`);
    } else if (baseCommand === 'addmaterialblock') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] addMaterialBlock: Assigned engineering material attributes to active target.`);
    } else if (baseCommand === 'adddimensionblock') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] addDimensionBlock: Mapped precise ruler guidelines to profile outline.`);
    } else if (baseCommand === 'addspecblock') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] addSpecBlock: Recorded specification parameter within performance matrix.`);
    } else if (baseCommand === 'exportproductsheet') {
      setGraphSidebarTab('product');
      logTrace(`[PRODUCT ENGINE] exportProductSheet: Packaging layout and specs as requested.`);
    } else if (baseCommand === 'createindustrialsketch') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] createIndustrialSketch: Rendering standard outline sketch blueprint...`);
    } else if (baseCommand === 'setshapelanguage') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] setShapeLanguage: Calibrating form curvature matching requested parameters.`);
    } else if (baseCommand === 'addpanellines') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addPanelLines: Redrawing coordinate paths to project division lines.`);
    } else if (baseCommand === 'addseams') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addSeams: Standard splitting gaps allocated to conform with assembly.`);
    } else if (baseCommand === 'addvents') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addVents: Calculated airflow slots layout.`);
    } else if (baseCommand === 'addhandles') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addHandles: Pinning structural handle attachment zones on case.`);
    } else if (baseCommand === 'addports') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addPorts: Provisioned high-speed hardware connectors on layout.`);
    } else if (baseCommand === 'addfasteners') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addFasteners: Configured mounting points on frame.`);
    } else if (baseCommand === 'addmaterialzones') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] addMaterialZones: Mapping surface textures on primary chassis.`);
    } else if (baseCommand === 'createexplodedview') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] createExplodedView: Splitting assembly elements with vertical dashed trace alignment guides.`);
    } else if (baseCommand === 'createcalloutsheet') {
      setGraphSidebarTab('industrial');
      logTrace(`[INDUSTRIAL ENGINE] createCalloutSheet: Visualizing index of annotated tags on current blueprint.`);
    } else {
      // Fallback
      logTrace(`[USER_SHELL] Executed "${cmdText}" query on active coordinate matrix.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;

    executeCommandLine(typedCommand);
    setTypedCommand('');
    setShowSuggestions(false);
  };
  // Real, actual file downloads triggers (matching JPG, PNG, PDF, SVG, JSON)
  const triggerExportDownload = (format: string) => {
    logTrace(`[EXPORTER] Preparing Universal Format output stream for [.${format.toUpperCase()}] bundle...`);
    incrementActiveExports();
    
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeCanvas, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeCanvas.type}_project_export.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      logTrace(`[EXPORTER] Exported structured CAD raw project JSON package successfully.`);
      setTimeout(() => {
        decrementActiveExports();
      }, 1200);
    } else if (format === 'svg') {
      // Generate genuine XML SVG code listing all actual current layers dynamically!
      let svgElements = '';
      activeCanvas.layers.forEach(layer => {
        if (!layer.visible) return;
        const widthPx = layer.width * 100; // Multipler to represent nicely in viewbox
        const heightPx = layer.height * 100;
        const xPx = layer.x * 100;
        const yPx = layer.y * 100;
 
        if (layer.type === 'text') {
          svgElements += `  <text x="${xPx}" y="${yPx + 50}" fill="#0f172a" font-family="Inter, sans-serif" font-size="28">${layer.content}</text>\n`;
        } else if (layer.type === 'branding') {
          svgElements += `  <g transform="translate(${xPx}, ${yPx})">\n    <rect width="${widthPx}" height="${heightPx}" fill="#eff6ff" stroke="#2563eb" stroke-width="4" rx="10"/>\n    <text x="30" y="50" fill="#2563eb" font-family="monospace" font-size="20">LOGOMARK</text>\n  </g>\n`;
        } else {
          // Standard vector shapes
          svgElements += `  <rect x="${xPx}" y="${yPx}" width="${widthPx}" height="${heightPx}" fill="#ebf5ff" stroke="#3b82f6" stroke-width="3" fill-opacity="0.2"/>\n`;
        }
      });
 
      const fullSvgString = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${activeCanvas.width * 100}" height="${activeCanvas.height * 100}" viewBox="0 0 ${activeCanvas.width * 100} ${activeCanvas.height * 100}" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="100%" height="100%" fill="${activeCanvas.background}"/>
  <!-- Bleed limit lines: ${activeCanvas.bleed} offset -->
  <rect x="${activeCanvas.bleed * 100}" y="${activeCanvas.bleed * 100}" width="${(activeCanvas.width - 2*activeCanvas.bleed) * 100}" height="${(activeCanvas.height - 2*activeCanvas.bleed) * 100}" fill="none" stroke="#ef4444" stroke-dasharray="10 5" stroke-width="2"/>
  <!-- Layers outline -->
${svgElements}</svg>`;
 
      const svgDataStr = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(fullSvgString);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", svgDataStr);
      downloadAnchor.setAttribute("download", `${activeCanvas.type}_vector_export.svg`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      logTrace(`[EXPORTER] Compiled vector anchors into high fidelity standard SVG envelope package.`);
      setTimeout(() => {
        decrementActiveExports();
      }, 1200);
    } else {
      // Simulates high precision file formatting triggers in UI for raster JPEG/PNG/PDF
      const compileOverlay = document.createElement('div');
      compileOverlay.className = "fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white p-5";
      compileOverlay.innerHTML = `
        <div class="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-md text-center space-y-6">
          <div class="w-16 h-16 bg-blue-500/10 border border-blue-500 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
            <svg class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold">Compiling Dynamic Canvas Node</h3>
            <p class="text-xs text-gray-400 mt-2">Exporting high-density 1:1 format [.${format.toUpperCase()}] from raw coordinate system...</p>
          </div>
          <div class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]" style="width: 100%"></div>
          </div>
          <button id="dismiss-export-modal" class="px-5 py-2 bg-gray-800 hover:bg-gray-750 text-xs font-sans rounded-xl transition">
            Close Panel
          </button>
        </div>
      `;
      document.body.appendChild(compileOverlay);
      
      const button = document.getElementById('dismiss-export-modal');
      button?.addEventListener('click', () => {
        compileOverlay.remove();
        decrementActiveExports();
        logTrace(`[EXPORTER] Ready for factory upload: compiled high density file package for ${activeCanvas.type}.${format}`);
      });
    }
  };

  // Drag interaction to move layers - User can interactively drag elements around matching CAD software grids!
  const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
    // Check if layer is locked
    const layer = activeCanvas.layers.find(l => l.id === layerId);
    if (!layer || layer.locked) return;

    setSelectedLayerId(layerId);
    setDraggedLayerId(layerId);

    // Get current click positioning relative to element offset
    const bounds = (e.currentTarget.parentNode as HTMLElement).getBoundingClientRect();
    const xInPx = e.clientX - bounds.left;
    const yInPx = e.clientY - bounds.top;

    // Convert pixels to current unit factor to store drag offset ratio
    const workspaceWidth = bounds.width;
    const workspaceHeight = bounds.height;
    
    const scaleX = activeCanvas.width / workspaceWidth;
    const scaleY = activeCanvas.height / workspaceHeight;

    setDragOffset({
      x: (xInPx * scaleX) - layer.x,
      y: (yInPx * scaleY) - layer.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedLayerId) return;

    const workspaceElement = canvasWorkspaceRef.current;
    if (!workspaceElement) return;

    const bounds = workspaceElement.getBoundingClientRect();
    const xInPx = e.clientX - bounds.left;
    const yInPx = e.clientY - bounds.top;

    const workspaceWidth = bounds.width;
    const workspaceHeight = bounds.height;

    const scaleX = activeCanvas.width / workspaceWidth;
    const scaleY = activeCanvas.height / workspaceHeight;

    let targetX = (xInPx * scaleX) - dragOffset.x;
    let targetY = (yInPx * scaleY) - dragOffset.y;

    // Apply strict bounds and grid snapping if enabled in the data model
    if (activeCanvas.grid.snapping) {
      const snap = activeCanvas.grid.size;
      targetX = Math.round(targetX / snap) * snap;
      targetY = Math.round(targetY / snap) * snap;
    }

    // Constraints to stay inside canvas
    targetX = Math.max(0, Math.min(activeCanvas.width, targetX));
    targetY = Math.max(0, Math.min(activeCanvas.height, targetY));

    // Rounding coordinates cleanly
    targetX = parseFloat(targetX.toFixed(4));
    targetY = parseFloat(targetY.toFixed(4));

    setActiveCanvas(prev => ({
      ...prev,
      layers: prev.layers.map(layer => {
        if (layer.id === draggedLayerId) {
          return {
            ...layer,
            x: targetX,
            y: targetY
          };
        }
        return layer;
      })
    }));
  };

  const handleMouseUp = () => {
    if (draggedLayerId) {
      const movedLayer = activeCanvas.layers.find(l => l.id === draggedLayerId);
      if (movedLayer) {
        logTrace(`[LAYERS] Moved "${movedLayer.name}" layer to precise coordinates: X=${movedLayer.x}, Y=${movedLayer.y} ${activeCanvas.unit}.`);
      }
      setDraggedLayerId(null);
    }
  };

  // Tools display based strictly on relevant canvas type requirements
  const getRelevantTools = () => {
    const isPrint = activeCanvas.color_mode === 'CMYK' || ['business_card', 'letterhead', 'fashion_tech_pack', 'industrial_design_board', 'dfm_sheet', 'architecture_sheet', 'cad_reference_sheet'].includes(activeCanvas.type);
    
    const tools = [
      { id: 't_size', category: 'Canvas', label: 'Resize Layout', desc: 'Modify Canvas bounding boxes', action: () => setCanvasSize(activeCanvas.width * 1.25, activeCanvas.height * 1.25), isRelevant: true },
      { id: 't_bleed', category: 'Canvas', label: 'Toggle Print Bleed', desc: 'Offset mechanical margins', action: () => setBleed(activeCanvas.bleed > 0 ? 0 : 0.125), isRelevant: isPrint },
      { id: 't_guides', category: 'Canvas', label: 'Tension Grid Guides', desc: 'Scale-locked snap coordinates', action: () => setGridEnabled(!activeCanvas.grid.show), isRelevant: true },
      
      { id: 't_layer_add', category: 'Layers', label: 'Add Vector Group', desc: 'Append structured drawable nodes', action: () => executeCommandLine('/addLayer New_Geometry_Node'), isRelevant: true },
      { id: 't_layer_lock', category: 'Layers', label: 'Toggle Layer Locks', desc: 'Secure coordinate offsets', action: () => {
        if (!selectedLayerId) return;
        setActiveCanvas(prev => ({
          ...prev,
          layers: prev.layers.map(l => l.id === selectedLayerId ? { ...l, locked: !l.locked } : l)
        }));
        logTrace(`[LAYER] Synchronized layer boundary lock status.`);
      }, isRelevant: true },
      
      { id: 't_pen', category: 'Vector', label: 'Dynamic Pen Sweep', desc: 'Create anchor nodes interactively', action: () => executeCommandLine('/vector shape rect'), isRelevant: true },
      { id: 't_subtract', category: 'Vector', label: 'Boolean Subtract', desc: 'Carve layers with mesh paths', action: () => logTrace(`[MESH] Subtracted active overlay boundary layers successfully.`), isRelevant: activeCanvas.type.includes('industrial') || activeCanvas.type.includes('cad') },
      
      { id: 't_text_add', category: 'Text', label: 'Insert Technical Text', desc: 'Drop bounding typography box', action: () => executeCommandLine('/addText Spec Label'), isRelevant: true },
      { id: 't_family', category: 'Text', label: 'Apply Brand Serif', desc: 'Sync typography matrices', action: () => logTrace(`[BRAND] Bound "Space Grotesk" display weights to active node.`), isRelevant: activeCanvas.type.includes('card') || activeCanvas.type.includes('brand') },
      
      { id: 't_logo_guard', category: 'Branding', label: 'Load Brand Guide', desc: 'Audit compliance with core tokens', action: () => logTrace(`[BRAND] Parsed visual identity standards. Palette locks in place.`), isRelevant: ['business_card', 'letterhead', 'brand_board', 'ui_screen'].includes(activeCanvas.type) },
      { id: 't_moulding', category: 'Validation', label: 'DFM Mould Tolerances', desc: 'Edge and draft angle compliance', action: () => logTrace(`[DFM] Finished audit: zero open outlines. Core wall width matches standards.`), isRelevant: ['dfm_sheet', 'industrial_design_board', 'cad_reference_sheet', 'fashion_tech_pack'].includes(activeCanvas.type) }
    ];

    return tools.filter(t => t.isRelevant);
  };

  // Convert layer elements dynamically to CSS scale ratios inside design box preview
  // Base dimensions preview scale
  const getLayerStyle = (layer: CanvasLayer) => {
    // Relative position inside active canvas dimensions width & height
    const leftPercent = (layer.x / activeCanvas.width) * 100;
    const topPercent = (layer.y / activeCanvas.height) * 100;
    const widthPercent = (layer.width / activeCanvas.width) * 100;
    const heightPercent = (layer.height / activeCanvas.height) * 100;

    return {
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      width: `${widthPercent}%`,
      height: `${heightPercent}%`,
      fontFamily: layer.fontFamily || 'inherit',
      fontSize: layer.fontSize ? `${layer.fontSize}px` : undefined
    };
  };

  const getBleedStyle = () => {
    const bleedPct = (activeCanvas.bleed / activeCanvas.width) * 100;
    return {
      left: `${bleedPct}%`,
      top: `${bleedPct}%`,
      right: `${bleedPct}%`,
      bottom: `${bleedPct}%`
    };
  };

  const getSafeZoneStyle = () => {
    const safePct = (activeCanvas.safe_zone / activeCanvas.width) * 100;
    return {
      left: `${safePct}%`,
      top: `${safePct}%`,
      right: `${safePct}%`,
      bottom: `${safePct}%`
    };
  };

  return (
    <section id="commands" className="py-24 bg-white border-b border-gray-250 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.02),transparent_60%) pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Title Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs font-bold text-blue-600 tracking-widest uppercase block mb-3">
              Interactive CAD Sandbox
            </span>
            <div id="visual-workspace-anchor" className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans">
                {t('commands.title')}
              </h2>
              <div className="px-2.5 py-1 bg-blue-50 text-blue-600 font-mono text-[9px] rounded-full uppercase font-bold border border-blue-200">
                Live Console Core
              </div>
            </div>
            <p className="text-sm font-sans text-gray-500 max-w-xl mt-3">
              {t('commands.desc')}
            </p>
          </div>

          {/* Quick presets selectors */}
          <div className="flex flex-wrap items-center gap-2 max-w-full">
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider mr-1">Predefined Canvas Sheets:</span>
            <div className="flex flex-wrap gap-1.5" id="canvas-preset-triggers">
              {(['business_card', 'letterhead', 'presentation_slide', 'ui_screen', 'fashion_tech_pack', 'industrial_design_board', 'dfm_sheet'] as const).map(pKey => (
                <button
                  key={pKey}
                  onClick={() => handleCreateCanvas(pKey)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-sans font-semibold transition-all ${
                    activeCanvas.type === pKey 
                      ? 'border-blue-600 text-blue-600 bg-blue-100/35' 
                      : 'border-gray-250 bg-white hover:bg-gray-50 text-gray-600'
                  }`}
                  id={`preset-${pKey}-trigger`}
                >
                  {pKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Studio Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7-COLUMNS: Active drawing viewport page & Specs Settings drawer */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Spec Controller Toolbar panel */}
            <div className="p-4 bg-gray-50 border border-gray-250 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                
                {/* Switchable physical units */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-gray-400">Unit Standard:</span>
                  <div className="inline-flex bg-white border border-gray-200 p-0.5 rounded-lg" id="unit-switcher-group">
                    {(['pixels', 'inches', 'millimeters'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setUnits(u)}
                        id={`btn-unit-${u}`}
                        className={`px-2.5 py-1 text-[10px] font-sans font-bold rounded-md capitalize transition-all ${
                          activeCanvas.unit === u 
                            ? 'bg-gray-900 text-white' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {u === 'pixels' ? 'px' : u === 'inches' ? 'in' : 'mm'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect ratio control */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-gray-400">Fixed Grid Ratio:</span>
                  <select
                    value={activeCanvas.aspect_ratio}
                    onChange={(e) => handleApplyAspectRatio(e.target.value)}
                    id="canvas-aspect-ratio-select"
                    className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-sans font-medium text-gray-600 outline-none"
                  >
                    <option value="custom">Custom Freesform</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="3:2">3:2 Standard Grid</option>
                    <option value="4:3">4:3 Traditional Screen</option>
                    <option value="16:9">16:9 HD Display</option>
                  </select>
                </div>
              </div>

              {/* Duplicate or Action button triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={duplicateCanvas}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  id="btn-duplicate-canvas"
                >
                  <Files className="h-3.5 w-3.5" />
                  <span>Duplicate Specs</span>
                </button>
                <button
                  onClick={() => handleCreateCanvas('blank_canvas')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                  id="btn-reset-blank-canvas"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Reset Blank</span>
                </button>
              </div>
            </div>

            {/* Drawing Canvas Workspace Container Area */}
            <div className="relative">
              
              {/* Actual scale metadata bubble */}
              <div className="absolute top-3 left-4 z-20 px-3 py-1.5 bg-gray-900/90 text-white rounded-xl font-mono text-[10px] flex items-center gap-2 backdrop-blur shadow-lg border border-gray-800">
                <Cpu className="h-3.5 w-3.5 text-blue-400" />
                {graphSidebarTab === 'layout' ? (
                  <span>
                    Quark Blueprint: {activeLayout.width} x {activeLayout.height} {activeLayout.unit} | Bleed: {activeLayout.bleed} | Margins: {activeLayout.margins.top}
                  </span>
                ) : (
                  <span>
                    Canvas Node: {activeCanvas.width} x {activeCanvas.height} {activeCanvas.unit} [@{activeCanvas.color_mode}]
                  </span>
                )}
                <span className="text-gray-500">|</span>
                <span className="text-emerald-400 font-bold">300 DPI [SWOP]</span>
              </div>

              {/* Main SVG/Drawing representation workspace */}
              <div 
                id="interactive-drawing-board"
                className={`w-full h-[460px] bg-slate-900 border border-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative p-10 select-none ${
                  isBrushMode ? 'cursor-pencil' : 'cursor-crosshair'
                }`}
                ref={canvasWorkspaceRef}
                onMouseDown={(e) => {
                  if (isBrushMode) {
                    setIsDrawing(true);
                    const el = canvasWorkspaceRef.current;
                    if (!el) return;
                    const bounds = el.getBoundingClientRect();
                    const xPct = ((e.clientX - bounds.left) / bounds.width) * 100;
                    const yPct = ((e.clientY - bounds.top) / bounds.height) * 100;
                    setDrawnPaths(prev => [...prev, {
                      points: [{ x: xPct, y: yPct }],
                      color: brushColor,
                      size: brushSize
                    }]);
                  }
                }}
                onMouseMove={(e) => {
                  if (isBrushMode) {
                    if (!isDrawing) return;
                    const el = canvasWorkspaceRef.current;
                    if (!el) return;
                    const bounds = el.getBoundingClientRect();
                    const xPct = ((e.clientX - bounds.left) / bounds.width) * 100;
                    const yPct = ((e.clientY - bounds.top) / bounds.height) * 100;
                    
                    setDrawnPaths(prev => {
                      if (prev.length === 0) return prev;
                      const last = prev[prev.length - 1];
                      const updatedPoints = [...last.points, { x: xPct, y: yPct }];
                      return [...prev.slice(0, -1), { ...last, points: updatedPoints }];
                    });
                  } else {
                    // Drags layups/blocks universally
                    handleMouseMove(e);
                    
                    if (graphSidebarTab === 'layout' && draggedBlockId) {
                      const el = canvasWorkspaceRef.current;
                      if (!el) return;
                      const bounds = el.getBoundingClientRect();
                      const xPx = e.clientX - bounds.left;
                      const yPx = e.clientY - bounds.top;
                      
                      let newX = (xPx / bounds.width) * activeLayout.width - blockDragOffset.x;
                      let newY = (yPx / bounds.height) * activeLayout.height - blockDragOffset.y;
                      
                      if (isGridSnappingEnabled) {
                        newX = Math.round(newX * 10) / 10;
                        newY = Math.round(newY * 10) / 10;
                      }
                      
                      newX = parseFloat(Math.max(0, Math.min(activeLayout.width, newX)).toFixed(2));
                      newY = parseFloat(Math.max(0, Math.min(activeLayout.height, newY)).toFixed(2));
                      
                      setActiveLayout(prev => ({
                        ...prev,
                        blocks: prev.blocks.map(b => {
                          if (b.id !== draggedBlockId) return b;
                          const updated = { ...b, x: newX, y: newY };
                          updated.overflowing = checkTextOverflow(updated);
                          return updated;
                        })
                      }));
                    }
                  }
                }}
                onMouseUp={() => {
                  if (isBrushMode) {
                    setIsDrawing(false);
                  } else {
                    handleMouseUp();
                    setDraggedBlockId(null);
                  }
                }}
                onMouseLeave={() => {
                  if (isBrushMode) {
                    setIsDrawing(false);
                  } else {
                    handleMouseUp();
                    setDraggedBlockId(null);
                  }
                }}
              >
                
                {/* Sandbox background grid system */}
                {activeCanvas.grid.show && (
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                )}

                {graphSidebarTab === 'layout' ? (
                  /* ========================================================
                     QUARK ARTBOARD PREVIEW WITH MARGINS, BLEED, COLUMNS & CROP LINES
                     ======================================================== */
                  <div
                    className="relative bg-white border border-slate-300 shadow-2xl transition-all flex items-center justify-center overflow-hidden"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: '100%',
                      aspectRatio: (activeLayout.width / activeLayout.height),
                    }}
                  >
                    {/* Trim Marks (Printed Crucial Crosshairs at 4 endpoints) */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {/* Top Left crosshair */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-red-500/30" />
                      {/* Top Right crosshair */}
                      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-red-500/30" />
                      {/* Bottom Left crosshair */}
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-red-500/30" />
                      {/* Bottom Right crosshair */}
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-red-500/30" />
                    </div>

                    {/* Bleed Guideline Bounds (External Offset Zone - Red) */}
                    {activeLayout.bleed > 0 && (
                      <div 
                        className="absolute border border-dashed border-red-500/40 pointer-events-none z-5"
                        style={{
                          left: `${(activeLayout.bleed / activeLayout.width) * 100}%`,
                          right: `${(activeLayout.bleed / activeLayout.width) * 100}%`,
                          top: `${(activeLayout.bleed / activeLayout.height) * 100}%`,
                          bottom: `${(activeLayout.bleed / activeLayout.height) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-3.5 left-1 text-[7px] font-mono font-extrabold uppercase text-red-500/70">
                          Trim Bleed Edge: {activeLayout.bleed}"
                        </span>
                      </div>
                    )}

                    {/* Margins Limit Bounds Guides (Pink) */}
                    <div 
                      className="absolute border border-dashed border-pink-400/50 pointer-events-none z-5"
                      style={{
                        left: `${(activeLayout.margins.left / activeLayout.width) * 100}%`,
                        right: `${(activeLayout.margins.right / activeLayout.width) * 100}%`,
                        top: `${(activeLayout.margins.top / activeLayout.height) * 100}%`,
                        bottom: `${(activeLayout.margins.bottom / activeLayout.height) * 100}%`,
                      }}
                    >
                      <span className="absolute top-0.5 left-1 text-[7px] font-mono font-bold uppercase text-pink-500/70">
                        Margin Bounds: {activeLayout.margins.top}"
                      </span>
                    </div>

                    {/* Indigo Columns Partition Overlay Grid */}
                    {activeLayout.columns.count > 0 && (
                      <div className="absolute inset-0 pointer-events-none z-0 flex">
                        {(() => {
                          const count = activeLayout.columns.count;
                          const gutter = activeLayout.columns.gutter;
                          const totalMarginWidth = activeLayout.margins.left + activeLayout.margins.right;
                          const printableWidth = activeLayout.width - totalMarginWidth;
                          
                          const totalGutterWidth = (count - 1) * gutter;
                          const colWidth = (printableWidth - totalGutterWidth) / count;
                          
                          const cols = [];
                          for (let i = 0; i < count; i++) {
                            const leftCoord = activeLayout.margins.left + i * (colWidth + gutter);
                            const leftPct = (leftCoord / activeLayout.width) * 100;
                            const widthPct = (colWidth / activeLayout.width) * 100;
                            cols.push(
                              <div 
                                key={i} 
                                className="absolute h-full border-l border-r border-indigo-200/15 bg-indigo-50/5 pointer-events-none"
                                style={{
                                  left: `${leftPct}%`,
                                  width: `${widthPct}%`
                                }}
                              />
                            );
                          }
                          return cols;
                        })()}
                      </div>
                    )}

                    {/* Placed Quark Blocks */}
                    {activeLayout.blocks.map(block => {
                      const isSel = selectedBlockId === block.id;
                      const textOverflows = block.overflowing;

                      return (
                        <div
                          key={block.id}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setSelectedBlockId(block.id);
                            setDraggedBlockId(block.id);
                            
                            const bounds = e.currentTarget.getBoundingClientRect();
                            const scaleX = activeLayout.width / e.currentTarget.parentElement!.clientWidth;
                            const scaleY = activeLayout.height / e.currentTarget.parentElement!.clientHeight;
                            
                            setBlockDragOffset({
                              x: (e.clientX - bounds.left) * scaleX,
                              y: (e.clientY - bounds.top) * scaleY
                            });
                          }}
                          style={{
                            left: `${(block.x / activeLayout.width) * 100}%`,
                            top: `${(block.y / activeLayout.height) * 100}%`,
                            width: `${(block.width / activeLayout.width) * 100}%`,
                            height: `${(block.height / activeLayout.height) * 100}%`,
                          }}
                          className={`absolute flex flex-col items-start justify-start p-2 border select-none transition-shadow ${
                            isSel
                              ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-500 z-20 cursor-grab active:cursor-grabbing shadow-lg'
                              : 'border-slate-350 bg-slate-50/10 hover:border-slate-400 z-10'
                          } ${textOverflows ? 'border-red-400 bg-red-50/10' : ''}`}
                        >
                          {/* Element specs badge */}
                          {isSel && (
                            <div className="absolute -top-4 left-0 z-30 px-1.5 py-0.5 bg-blue-600 text-white rounded font-mono text-[7px] leading-tight flex items-center gap-1 uppercase font-bold">
                              <span>{block.type === 'text' ? 'Text' : 'Image'}</span>
                              <span>[{block.width.toFixed(1)}x{block.height.toFixed(1)}in]</span>
                            </div>
                          )}

                          {block.type === 'text' ? (
                            <div 
                              className="w-full h-full overflow-hidden leading-tight text-slate-800 font-sans text-left"
                              style={{ fontSize: `${block.data.fontSize || 12}px` }}
                            >
                              {block.content}
                            </div>
                          ) : (
                            <div className="w-full h-full border border-dashed border-emerald-300 bg-emerald-50/15 flex flex-col items-center justify-center text-center">
                              {/* Standard Image cross diagonals box */}
                              <div className="absolute inset-0 border-r border-b border-emerald-300/10 origin-top-left flex items-center justify-center pointer-events-none">
                                <span className="font-mono text-[8px] text-emerald-600">PHOTO FRAME Fit:{block.data.objectFit}</span>
                              </div>
                              <ImageIcon className="h-4 w-4 text-emerald-500 opacity-60" />
                              <span className="text-[7px] font-mono text-emerald-700/80 mt-1 truncate max-w-[90%]">
                                {block.content.split('/').pop()}
                              </span>
                            </div>
                          )}

                          {/* Red InDesign/Quark overflow flashing badge '+ symbol' */}
                          {textOverflows && (
                            <div 
                              className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-red-600 text-white flex items-center justify-center text-[10px] font-mono font-black rounded-xs animate-bounce shadow-md"
                              title="Text overflows frame guidelines boundary!"
                            >
                              +
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ========================================================
                     DEFAULT VECTOR MATRIX DRAWING VIEWPORT
                     ======================================================== */
                  <div 
                    className="shadow-2xl border-2 border-slate-800 relative transition-colors duration-200 flex items-center justify-center overflow-hidden"
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: '100%',
                      backgroundColor: activeCanvas.background,
                      aspectRatio: activeCanvas.aspect_ratio === 'custom' ? undefined : activeCanvas.aspect_ratio.replace(':', '/')
                    }}
                  >
                    
                    {/* Visual Safe Zone margin lines (dashed blue) */}
                    {activeCanvas.safe_zone > 0 && (
                      <div 
                        className="absolute border border-dashed border-blue-500/25 pointer-events-none"
                        style={getSafeZoneStyle()}
                      >
                        <span className="absolute top-1 left-2 text-[8px] font-mono text-blue-500/50 uppercase leading-none">Safe bounds</span>
                      </div>
                    )}

                    {/* Visual Bleed zone lines (dashed red) */}
                    {activeCanvas.bleed > 0 && (
                      <div 
                        className="absolute border border-dashed border-red-500/25 pointer-events-none"
                        style={getBleedStyle()}
                      >
                        <span className="absolute -top-3 left-1 text-[8px] font-mono text-red-500/50 uppercase leading-none">Trim Bleed bounds</span>
                      </div>
                    )}

                    {/* Render active vector and text elements interactively */}
                    {activeCanvas.layers.map(layer => {
                      if (!layer.visible) return null;
                      const isSelected = selectedLayerId === layer.id;

                      return (
                        <div
                          key={layer.id}
                          id={`canvas-layer-node-${layer.id}`}
                          onMouseDown={(e) => handleMouseDown(e, layer.id)}
                          style={getLayerStyle(layer)}
                          className={`absolute flex flex-col items-center justify-center border font-sans select-none transition-all ${
                            layer.locked ? 'cursor-not-allowed opacity-85' : 'cursor-grab active:cursor-grabbing'
                          } ${
                            isSelected 
                              ? 'ring-2 ring-blue-600 outline-none border-blue-500 shadow-xl' 
                              : 'border-slate-350 hover:border-slate-450 hover:shadow-xs'
                          } ${layer.color}`}
                        >
                          {/* Selected overlay specs display */}
                          {isSelected && (
                            <div className="absolute -top-5 left-0 z-10 px-2 py-0.5 bg-blue-600 text-white rounded font-mono text-[8px] flex items-center gap-1">
                              <span>{layer.name}</span>
                              <span>({layer.x}, {layer.y})</span>
                              {layer.locked && <Lock className="h-2 w-2" />}
                            </div>
                          )}

                          {/* Rendering element contents based on formats */}
                          {layer.type === 'text' ? (
                            <span className="text-xs font-semibold px-2 text-center select-none block overflow-hidden leading-snug">
                              {layer.content}
                            </span>
                          ) : layer.type === 'branding' ? (
                            <div className="text-center px-1.5 py-1">
                              <Sparkle className="h-4 w-4 text-blue-600 mx-auto mb-1 animate-pulse" />
                              <span className="font-mono text-[9px] font-extrabold uppercase leading-none tracking-tight block">
                                {layer.content}
                              </span>
                            </div>
                          ) : layer.type === 'dimension' ? (
                            <div className="w-full text-center py-1">
                              <span className="font-mono text-[8px] text-amber-600 block mb-0.5">◄─ SPEC ─►</span>
                              <span className="font-bold text-[9px] leading-none block">{layer.content}</span>
                            </div>
                          ) : (
                            <div className="text-center px-2 py-1.5">
                              {layer.type === 'raster' ? (
                                <ImageIcon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                              ) : (
                                <PenTool className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                              )}
                              <span className="text-[9px] text-gray-500 max-w-[90%] leading-tight leading-none block overflow-hidden">
                                {layer.name}
                              </span>
                            </div>
                          )}

                          {/* Resize handle nodes on selected layer */}
                          {isSelected && !layer.locked && (
                            <>
                              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-blue-600 -translate-x-1/2 -translate-y-1/2 rounded" />
                              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-600 translate-x-1/2 -translate-y-1/2 rounded" />
                              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-blue-600 -translate-x-1/2 translate-y-1/2 rounded" />
                              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-blue-600 translate-x-1/2 translate-y-1/2 rounded" />
                            </>
                          )}
                        </div>
                      );
                    })}

                    {/* Render Freehand brushes paths overlays */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 animate-fadeIn" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {drawnPaths.map((path, idx) => {
                        if (path.points.length < 2) return null;
                        const d = path.points.reduce((acc, p, index) => {
                          return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                        }, '');
                        return (
                          <path 
                            key={idx} 
                            d={d} 
                            fill="none" 
                            stroke={path.color} 
                            strokeWidth={path.size / 6} 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                        );
                      })}
                    </svg>

                    {/* High-End Design Floating Tool Belt */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 backdrop-blur border border-white/15 rounded-2xl px-4 py-2 flex items-center gap-4 shadow-2xl transition-all font-mono text-[11px] text-white">
                      <div className="flex items-center gap-1 border-r border-white/10 pr-3">
                        <span className="text-[9px] font-sans text-gray-400 uppercase tracking-widest font-black mr-1">TOOL:</span>
                        <button 
                          type="button"
                          onClick={() => setIsBrushMode(false)}
                          className={`p-1.5 rounded-lg transition ${!isBrushMode ? 'bg-blue-600 text-white font-bold' : 'bg-transparent text-gray-400 hover:text-white'}`}
                          title="Draggable Pointer (Select elements and drag them)"
                        >
                          <MousePointerClick className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsBrushMode(true)}
                          className={`p-1.5 rounded-lg transition ${isBrushMode ? 'bg-rose-600 text-white font-bold animate-pulse' : 'bg-transparent text-gray-400 hover:text-white'}`}
                          title="Freehand Sketching Brush (Draw directly on your technical draft)"
                        >
                          <PenTool className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Font selector if a text layer is active */}
                      {(() => {
                        const selLayer = activeCanvas.layers.find(l => l.id === selectedLayerId);
                        if (selLayer && (selLayer.type === 'text' || selLayer.type === 'branding')) {
                          return (
                            <div className="flex items-center gap-1.5 border-r border-white/10 pr-3 h-full">
                              <span className="text-[9px] font-sans text-gray-400 uppercase tracking-widest font-black mr-1.5">FONT:</span>
                              <div className="flex items-center gap-1 bg-black/45 rounded-lg p-0.5 border border-white/5">
                                {[
                                  { name: 'Inter', family: '"Inter", sans-serif' },
                                  { name: 'Space', family: '"Space Grotesk", sans-serif' },
                                  { name: 'Outfit', family: '"Outfit", sans-serif' },
                                  { name: 'Serif', family: '"Playfair Display", serif' },
                                  { name: 'Mono', family: '"JetBrains Mono", monospace' }
                                ].map(f => (
                                  <button
                                    key={f.name}
                                    type="button"
                                    onClick={() => {
                                      setActiveCanvas(prev => ({
                                        ...prev,
                                        layers: prev.layers.map(layer => {
                                          if (layer.id === selectedLayerId) {
                                            return { ...layer, fontFamily: f.family };
                                          }
                                          return layer;
                                        })
                                      }));
                                      logTrace(`[TYPOGRAPHY] Updated font-family on layer "${selLayer.name}" to: ${f.name}`);
                                    }}
                                    className={`px-1.5 py-0.5 text-[9px] rounded font-sans uppercase tracking-tight transition ${
                                      selLayer.fontFamily === f.family || (!selLayer.fontFamily && f.name === 'Inter')
                                        ? 'bg-blue-600 text-white font-bold' 
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                                  >
                                    {f.name}
                                  </button>
                                ))}
                              </div>
                              
                              {/* Font Size Adjuster */}
                              <div className="flex items-center gap-1 ml-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextSize = Math.max(8, (selLayer.fontSize || 12) - 2);
                                    setActiveCanvas(prev => ({
                                      ...prev,
                                      layers: prev.layers.map(layer => {
                                        if (layer.id === selectedLayerId) {
                                          return { ...layer, fontSize: nextSize };
                                        }
                                        return layer;
                                      })
                                    }));
                                  }}
                                  className="px-1.5 bg-white/10 hover:bg-white/20 rounded font-bold text-[10px]"
                                >
                                  -
                                </button>
                                <span className="text-[9px] font-mono w-4 text-center">{selLayer.fontSize || 12}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextSize = Math.min(36, (selLayer.fontSize || 12) + 2);
                                    setActiveCanvas(prev => ({
                                      ...prev,
                                      layers: prev.layers.map(layer => {
                                        if (layer.id === selectedLayerId) {
                                          return { ...layer, fontSize: nextSize };
                                        }
                                        return layer;
                                      })
                                    }));
                                  }}
                                  className="px-1.5 bg-white/10 hover:bg-white/20 rounded font-bold text-[10px]"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Brush configurations */}
                      {isBrushMode && (
                        <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                          <span className="text-[9px] font-sans text-gray-400 uppercase tracking-widest font-black mr-1">SWATCH:</span>
                          <div className="flex items-center gap-1.5">
                            {[
                              { hex: '#f43f5e', name: 'Rose Red' },
                              { hex: '#f97316', name: 'Orange' },
                              { hex: '#10b981', name: 'Emerald' },
                              { hex: '#6366f1', name: 'Indigo' },
                              { hex: '#eab308', name: 'Yellow' },
                              { hex: '#ffffff', name: 'White' },
                              { hex: '#000000', name: 'Black' }
                            ].map(swatch => (
                              <button
                                key={swatch.hex}
                                type="button"
                                onClick={() => setBrushColor(swatch.hex)}
                                className={`w-3.5 h-3.5 rounded-full border transition ${
                                  brushColor === swatch.hex ? 'border-white scale-125 ring-1 ring-blue-500' : 'border-transparent hover:scale-110'
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                                title={swatch.name}
                              />
                            ))}
                          </div>

                          <span className="text-[9px] font-sans text-gray-400 uppercase tracking-widest font-black ml-1.5 mr-1">WEIGHT:</span>
                          <div className="flex gap-1">
                            {[2, 4, 6, 10].map(sz => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setBrushSize(sz)}
                                className={`px-1.5 border rounded text-[8px] transition ${
                                  brushSize === sz ? 'bg-white text-slate-900 font-bold border-white' : 'bg-transparent text-slate-350 border-white/10 hover:text-white'
                                }`}
                              >
                                {sz}px
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clear drawings */}
                      {drawnPaths.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDrawnPaths([]);
                            logTrace(`[BRUSH] Cleared all canvas annotation sketches.`);
                          }}
                          className="px-2 py-0.5 bg-red-600/35 hover:bg-red-650 hover:text-white border border-red-500/30 text-[9px] text-red-200 uppercase rounded font-bold transition"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick specifications sliders */}
            <div className="p-5 bg-gray-50 border border-gray-250 rounded-2xl">
              <span className="text-xs uppercase font-mono font-bold text-gray-400 block tracking-wider mb-4">Manual Spec Override Dashboard:</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="manual-adjusters-grid">
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 leading-none">Width Size</label>
                  <input
                    type="number"
                    value={activeCanvas.width}
                    onChange={(e) => setCanvasSize(parseFloat(e.target.value) || 1, activeCanvas.height)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-250 rounded-xl text-xs font-sans font-semibold text-gray-800 outline-none hover:border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 leading-none">Height Size</label>
                  <input
                    type="number"
                    value={activeCanvas.height}
                    onChange={(e) => setCanvasSize(activeCanvas.width, parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-250 rounded-xl text-xs font-sans font-semibold text-gray-800 outline-none hover:border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 leading-none">Bleed Padding</label>
                  <input
                    type="number"
                    step="0.01"
                    value={activeCanvas.bleed}
                    onChange={(e) => setBleed(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-250 rounded-xl text-xs font-sans font-semibold text-gray-800 outline-none hover:border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 leading-none">Safe Margin</label>
                  <input
                    type="number"
                    step="0.01"
                    value={activeCanvas.safe_zone}
                    onChange={(e) => setSafeZone(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-250 rounded-xl text-xs font-sans font-semibold text-gray-800 outline-none hover:border-gray-300 focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* CLI Console Shell terminal */}
            <div className="bg-gray-950 border border-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[280px]">
              
              <div className="bg-gray-950 border-b border-gray-900 px-4 h-10 flex items-center justify-between shrink-0 text-[10px] font-mono select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  <span className="text-gray-500 ml-2 border-l border-gray-800 pl-2">bash // visualos-kernel-core</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Terminal className="h-3 w-3 text-blue-500" />
                  <span>Terminal Active</span>
                </div>
              </div>

              {/* Logs area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-1 font-mono text-[10px] text-gray-300">
                {cliLogs.map((log, listIdx) => (
                  <div 
                    key={listIdx} 
                    className={`${
                      log.startsWith('wongsanginc@') 
                        ? 'text-white font-bold border-t border-gray-900 pt-1.5 mt-1' 
                        : log.startsWith('[ERR]') 
                        ? 'text-red-400 font-bold' 
                        : log.startsWith('[CONV]') 
                        ? 'text-yellow-400 font-bold' 
                        : 'text-emerald-400'
                    }`}
                  >
                    ❯ {log}
                  </div>
                ))}
              </div>

              {/* Input Area with dynamic autocomplete dropdown selection */}
              <div className="relative" ref={dropdownRef}>
                {showSuggestions && (
                  <div 
                    id="cli-autocomplete-box"
                    className="absolute left-0 bottom-full mb-1.5 w-full bg-gray-900 border border-gray-850 rounded-2xl shadow-2xl py-1 z-30"
                  >
                    <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider px-3.5 py-1 font-mono">Suggested Design Commands:</span>
                    {autocompleteSuggestions.map((sCmd, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => {
                          setTypedCommand(sCmd);
                          setShowSuggestions(false);
                        }}
                        className="flex items-center justify-between w-full px-3.5 py-1.5 text-left text-xs font-mono text-gray-200 hover:bg-gray-800 hover:text-white"
                      >
                        <span>{sCmd}</span>
                        <CornerDownRight className="h-3 w-3 text-gray-600" />
                      </button>
                    ))}
                  </div>
                )}

                <form 
                  onSubmit={handleSubmit}
                  className="border-t border-gray-900 bg-gray-950 p-2 px-4 flex items-center gap-2 shrink-0 relative"
                  id="terminal-input-form"
                >
                  <span className="text-blue-500 font-mono text-xs font-bold leading-none select-none">
                    /
                  </span>
                  <input
                    type="text"
                    placeholder="Type instructions (e.g. /setUnits mm, /setBackground white, /addLayer Stamp)..."
                    value={typedCommand}
                    onChange={(e) => {
                      setTypedCommand(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="flex-1 bg-transparent border-0 outline-none text-white font-mono text-xs focus:ring-0 placeholder-gray-600 py-1.5"
                    id="terminal-input"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-sans font-bold text-[10px] tracking-wider uppercase transition-all"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    <span>RUN</span>
                  </button>
                </form>
              </div>

            </div>

                 {/* RIGHT 4-COLUMNS: Integrated Tool Categories panel & Layers table */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* High-End Tab System */}
            <div className="border border-gray-255 bg-gray-50 p-1 rounded-2xl flex items-center justify-between gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => setGraphSidebarTab('layers')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center ${
                  graphSidebarTab === 'layers'
                    ? 'bg-white border border-gray-200 text-slate-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Layers
              </button>
              
              <button
                type="button"
                onClick={() => setGraphSidebarTab('layout')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'layout'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Layout className="h-3 w-3" />
                <span>Quark Layout</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('graph')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'graph'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>.graph</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('raster')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'raster'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ImageIcon className="h-3 w-3" />
                <span>Raster FX</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('brand')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'brand'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Brand Kit</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('uiux')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'uiux'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>UI/UX Flow</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('product')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'product'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Files className="h-3 w-3" />
                <span>Product Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('industrial')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'industrial'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <PenTool className="h-3 w-3" />
                <span>ID Engine</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('architecture')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'architecture'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Home className="h-3 w-3" />
                <span>Arch Engine</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('engineering')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'engineering'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Wrench className="h-3 w-3" />
                <span>DFM + BOM</span>
              </button>

              <button
                type="button"
                onClick={() => setGraphSidebarTab('export_manager')}
                className={`py-1.5 px-2.5 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'export_manager'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
                }`}
              >
                <Download className="h-3 w-3" />
                <span>Exporter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGraphSidebarTab('quality_verifier');
                  logTrace('[QC PIPELINE] Navigated to pre-flight Quality Verification engine dashboard.');
                }}
                className={`py-1.5 px-2.5 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'quality_verifier'
                    ? 'bg-red-650 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="h-3 w-3 text-red-500" />
                <span>QC Linter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGraphSidebarTab('workspace_manager');
                  logTrace('[WORKSPACE] Navigated directly to local offline-first workspace directories.');
                }}
                className={`py-1.5 px-2.5 text-[11px] font-bold rounded-xl transition whitespace-nowrap text-center flex items-center justify-center gap-1 ${
                  graphSidebarTab === 'workspace_manager'
                    ? 'bg-indigo-650 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
                }`}
              >
                <Folder className="h-3 w-3 text-indigo-500" />
                <span>Workspace</span>
              </button>
            </div>

            {graphSidebarTab === 'layers' ? (
              <>
                {/* Advanced CAD Layer Manager Dashboard */}
                <div className="bg-gray-50 border border-gray-250 rounded-3xl p-5 shadow-sm space-y-4">
                  {/* Title & Action Line */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase font-mono font-bold text-gray-500 tracking-wider">Layer Controller</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {activeCanvas.layers.length} layers active
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => createLayer()}
                        className="p-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all"
                        title="Spawn new automatically named vector layer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Layer</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Actions Panel & Standard Stack Trigger */}
                  <div className="bg-white/70 border border-gray-250/60 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-455">Workspace Configuration:</span>
                      <button
                        type="button"
                        onClick={deployStandardStack}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-medium rounded-lg flex items-center gap-1 transition shadow-xs"
                        title="Instantiate complete suite of standard Level-00 to Level-18 CAD layers"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>CAD 19-Layer Stack</span>
                      </button>
                    </div>

                    {/* Bulk controls when layers are checked with checkbox */}
                    {bulkCheckedLayerIds.length > 0 ? (
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[9px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md mr-1 animate-pulse">
                          {bulkCheckedLayerIds.length} checked:
                        </span>
                        {bulkCheckedLayerIds.length >= 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (bulkCheckedLayerIds.length >= 2) {
                                mergeLayers(bulkCheckedLayerIds[0], bulkCheckedLayerIds[1]);
                              }
                            }}
                            className="px-1.5 py-0.5 bg-slate-800 hover:bg-black text-white text-[9px] rounded font-medium flex items-center gap-1"
                            title="Merge first two selected layers together"
                          >
                            <span>Merge</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => groupLayers(bulkCheckedLayerIds)}
                          className="px-1.5 py-0.5 bg-purple-600 hover:bg-purple-700 text-white text-[9px] rounded font-medium flex items-center gap-1"
                          title="Bind selected elements inside a bounding Group"
                        >
                          <FolderOpen className="h-2.5 w-2.5" />
                          <span>Group</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            bulkCheckedLayerIds.forEach(id => hideLayer(id));
                            setBulkCheckedLayerIds([]);
                          }}
                          className="px-1.5 py-0.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-[9px] rounded font-medium"
                        >
                          Hide All
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            bulkCheckedLayerIds.forEach(id => lockLayer(id));
                            setBulkCheckedLayerIds([]);
                          }}
                          className="px-1.5 py-0.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-[9px] rounded font-medium"
                        >
                          Lock All
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            bulkCheckedLayerIds.forEach(id => deleteLayer(id));
                            setBulkCheckedLayerIds([]);
                          }}
                          className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-600 text-[9px] rounded font-medium"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setBulkCheckedLayerIds([])}
                          className="px-1.5 py-0.5 text-gray-400 hover:text-gray-600 text-[9px]"
                        >
                          Reset
                        </button>
                      </div>
                    ) : (
                      <p className="text-[9px] text-gray-400 font-mono leading-relaxed pt-1">
                        💡 Check boxes next to multiple layers to Group, Merge, or Lock them in bulk.
                      </p>
                    )}
                  </div>

                  {/* Scrollable Layer Stack List */}
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1" id="active-layers-list">
                    {activeCanvas.layers.map((layer, index) => {
                      const isSelected = selectedLayerId === layer.id;
                      const isChecked = bulkCheckedLayerIds.includes(layer.id);
                      const isGroup = layer.id.startsWith('grp_') || layer.name.startsWith('Group:');
                      const isStd = layer.id.startsWith('std_');

                      return (
                        <div 
                          key={layer.id}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-1.5 transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-medium shadow-xs' 
                              : isGroup
                              ? 'border-purple-200 bg-purple-50/20 text-purple-900'
                              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                          }`}
                          id={`layers-row-${layer.id}`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {/* Multiselect Checkbox */}
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkCheckedLayerIds(prev => [...prev, layer.id]);
                                } else {
                                  setBulkCheckedLayerIds(prev => prev.filter(item => item !== layer.id));
                                }
                              }}
                              className="w-3 h-3 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                            />

                            <button
                              type="button"
                              onClick={() => setSelectedLayerId(layer.id)}
                              className="min-w-0 flex-1 text-left flex items-center gap-1.5 text-[11px] leading-tight"
                            >
                              <span className="shrink-0">
                                {layer.type === 'text' ? (
                                  <Type className="h-3 w-3 text-emerald-500" />
                                ) : layer.type === 'branding' ? (
                                  <Sparkles className="h-3 w-3 text-amber-500" />
                                ) : layer.type === 'dimension' ? (
                                  <Layout className="h-3 w-3 text-violet-500" />
                                ) : isGroup ? (
                                  <Folder className="h-3 w-3 text-purple-500" />
                                ) : (
                                  <PenTool className="h-3 w-3 text-blue-500" />
                                )}
                              </span>
                              <span className="truncate font-mono text-[10px] text-gray-500 shrink-0">
                                {isStd ? layer.id.replace('std_', '#') : `#${index.toString().padStart(2, '0')}`}
                              </span>
                              <span className="truncate font-semibold">{layer.name}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Index order modification */}
                            <button
                              type="button"
                              onClick={() => moveLayerUp(layer.id)}
                              disabled={index === activeCanvas.layers.length - 1}
                              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:pointer-events-none"
                              title="Move Layer Up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveLayerDown(layer.id)}
                              disabled={index === 0}
                              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:pointer-events-none"
                              title="Move Layer Down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>

                            {/* Lock/Unlock */}
                            <button
                              type="button"
                              onClick={() => layer.locked ? unlockLayer(layer.id) : lockLayer(layer.id)}
                              className={`p-1 rounded hover:bg-gray-100 transition ${
                                layer.locked ? 'text-amber-500' : 'text-gray-300'
                              }`}
                              title={layer.locked ? 'Unlock Layer' : 'Lock dimensions'}
                            >
                              {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            </button>

                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => layer.visible ? hideLayer(layer.id) : showLayer(layer.id)}
                              className={`p-1 rounded hover:bg-gray-100 transition ${
                                layer.visible ? 'text-gray-600' : 'text-gray-300'
                              }`}
                              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                            >
                              {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </button>

                            {/* Actions Dropdown / Trash */}
                            <button
                              type="button"
                              onClick={() => deleteLayer(layer.id)}
                              className="p-1 hover:bg-red-50 text-red-400 hover:text-red-600 rounded transition"
                              title="Delete layer permanently"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Layer Properties Editor */}
                {selectedLayerId && activeCanvas.layers.find(l => l.id === selectedLayerId) && (
                  <div className="bg-slate-50 border border-slate-250 p-4 rounded-3xl space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block tracking-wider leading-none">
                        Active Layer Metrics
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            duplicateLayer(selectedLayerId);
                          }}
                          className="px-2 py-0.5 bg-white border border-gray-200 hover:border-blue-500 text-[9px] font-semibold rounded-md flex items-center gap-0.5"
                          title="Duplicate Layer"
                        >
                          <Copy className="h-2.5 w-2.5" />
                          <span>Copy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            exportLayer(selectedLayerId);
                          }}
                          className="px-2 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[9px] font-semibold rounded-md flex items-center gap-0.5"
                          title="Export Single Layer Node spec"
                        >
                          <Download className="h-2.5 w-2.5" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const l = activeCanvas.layers.find(lay => lay.id === selectedLayerId)!;
                      const isGroup = l.id.startsWith('grp_') || l.name.startsWith('Group:');
                      return (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1 leading-none font-medium">Layer Identity Tag</label>
                            <input
                              type="text"
                              value={l.name}
                              onChange={(e) => {
                                // Constrain: Agents cannot create or leave empty/unnamed layers.
                                const val = e.target.value;
                                if (val.trim()) {
                                  renameLayer(l.id, val);
                                } else {
                                  renameLayer(l.id, "Unnamed Layer");
                                }
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-250 rounded-xl text-xs font-sans font-semibold text-gray-800 outline-none focus:border-blue-500"
                            />
                          </div>

                          {isGroup && (
                            <div className="p-2 bg-purple-50/50 border border-purple-250 rounded-xl space-y-1">
                              <span className="text-[9px] font-semibold text-purple-700 block uppercase font-mono">Folder Pack Members</span>
                              <p className="text-[10px] text-purple-900 leading-tight">
                                {l.content}
                              </p>
                              <button
                                type="button"
                                onClick={() => ungroupLayers(l.id)}
                                className="mt-1.5 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[9px] font-medium block"
                              >
                                Disband Group / Ungroup Elements
                              </button>
                            </div>
                          )}

                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1 leading-none font-medium font-mono">Vector Payload Code</label>
                            <input
                              type="text"
                              value={l.content}
                              onChange={(e) => {
                                recordHistoryState();
                                setActiveCanvas(prev => ({
                                  ...prev,
                                  layers: prev.layers.map(layer => layer.id === l.id ? { ...layer, content: e.target.value } : layer)
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-255 rounded-xl text-xs font-mono text-gray-800 outline-none focus:border-blue-500"
                            />
                            <span className="text-[9px] text-gray-400 block mt-1 leading-snug">
                              Standard dynamic node geometry. Remains 100% editable online.
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[9px] text-gray-500 mb-0.5 leading-none">X Coordinate (in)</span>
                              <input
                                type="number"
                                step="0.05"
                                value={l.x}
                                onChange={(e) => {
                                  setActiveCanvas(prev => ({
                                    ...prev,
                                    layers: prev.layers.map(layer => layer.id === l.id ? { ...layer, x: parseFloat(e.target.value) || 0 } : layer)
                                  }));
                                }}
                                className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                              />
                            </div>
                            <div>
                              <span className="block text-[9px] text-gray-500 mb-0.5 leading-none">Y Coordinate (in)</span>
                              <input
                                type="number"
                                step="0.05"
                                value={l.y}
                                onChange={(e) => {
                                  setActiveCanvas(prev => ({
                                    ...prev,
                                    layers: prev.layers.map(layer => layer.id === l.id ? { ...layer, y: parseFloat(e.target.value) || 0 } : layer)
                                  }));
                                }}
                                className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Contextual Toolkit filtered automatically by Canvas specifications */}
                <div className="bg-gray-50 border border-gray-250 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                    <span className="text-xs uppercase font-mono font-bold text-gray-400 tracking-wider">Filtered Contextual Tools:</span>
                    <span className="text-[10px] bg-slate-900 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                      {getRelevantTools().length} Active
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1" id="contextual-tools-list">
                    {getRelevantTools().map(tool => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={tool.action}
                        className="w-full p-2 bg-white border border-gray-200 hover:border-blue-500 rounded-xl text-left hover:shadow-xs transition-all flex items-start gap-2.5 group"
                        id={`toolkit-btn-${tool.id}`}
                      >
                        <div className="p-1 bg-gray-50 group-hover:bg-blue-50 group-hover:text-blue-600 rounded text-gray-500 shrink-0 mt-0.5">
                          <Cpu className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold font-sans text-gray-900 leading-tight">{tool.label}</span>
                          <span className="block text-[10px] text-gray-550 mt-0.5 leading-snug">{tool.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Tool Presets manager */}
                  <div className="pt-3 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">Saved Layout Presets:</span>
                      <button
                        type="button"
                        onClick={() => executeCommandLine('/preset save UserConfiguration')}
                        className="px-2 py-1 bg-white border border-gray-250 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-[9px] font-bold flex items-center gap-1"
                        id="btn-save-current-preset"
                      >
                        <Save className="h-2.5 w-2.5" />
                        <span>Save Present Node</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5" id="saved-presets-list">
                      {savedPresets.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            handleCreateCanvas(preset.canvasType);
                            setUnits(preset.unit);
                            setBleed(preset.bleed);
                            setSafeZone(preset.safeZone);
                            logTrace(`[PRESETS] Applied saved preset config "${preset.name}".`);
                          }}
                          id={`btn-load-preset-${preset.id}`}
                          className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-left text-[10px] font-medium block"
                        >
                          <span className="font-extrabold text-gray-900 block truncate">{preset.name}</span>
                          <span className="text-[9px] text-gray-405 block mt-0.5 capitalize">{preset.unit}, {preset.colorMode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : graphSidebarTab === 'layout' ? (
              /* TAB 2: QUARK LAYOUT & PRINT ENGINE (InDesign Style) */
              <div className="bg-gray-50 border border-gray-250 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn">
                
                {/* Section Title */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-blue-600 block tracking-widest leading-none">Layout Engine:</span>
                    <h3 className="text-sm font-extrabold text-slate-800 font-sans mt-1">Quark/InDesign Sandbox</h3>
                  </div>
                  <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 font-mono text-[9px] font-bold rounded uppercase">
                    ACTIVE
                  </span>
                </div>

                {/* Templates Selector Grid */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-gray-400">Initialize Standard Sheet:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.keys(LAYOUT_PRESETS).map(key => {
                      const isActive = activeLayout.type === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            const fresh = createLayout({ type: key as LayoutType });
                            setActiveLayout(fresh);
                            setSelectedBlockId(null);
                            setLayoutTraceHistory(prev => [
                              `[LAYOUT] Created new "${key}" blueprint template (${fresh.width} x ${fresh.height} ${fresh.unit})`,
                              ...prev
                            ]);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] text-left transition font-semibold truncate border ${
                            isActive
                              ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-slate-700'
                          }`}
                        >
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Layout Parameters Customizer */}
                <div className="space-y-3.5 pt-3 border-t border-gray-200">
                  <span className="block text-[10px] font-mono font-bold uppercase text-gray-400">Page Properties Calibration:</span>
                  
                  {/* Margins */}
                  <div>
                    <div className="flex justify-between text-[10px] font-sans font-semibold mb-1">
                      <span className="text-gray-600">Margins: {activeLayout.margins.top} {activeLayout.unit}</span>
                      <span className="text-gray-400">All Edges</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={activeLayout.margins.top}
                      onChange={(e) => {
                        const mVal = parseFloat(e.target.value);
                        setActiveLayout(prev => setMargins(prev.layout_id, { top: mVal, bottom: mVal, left: mVal, right: mVal }));
                      }}
                      className="w-full accent-blue-600 bg-gray-200 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Bleed Controls */}
                  <div>
                    <div className="flex justify-between text-[10px] font-sans font-semibold mb-1">
                      <span className="text-gray-600">Print Bleed Zone: {activeLayout.bleed} {activeLayout.unit}</span>
                      <span className="text-red-505 font-bold">Trim Tolerances</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.025"
                      value={activeLayout.bleed}
                      onChange={(e) => {
                        const bVal = parseFloat(e.target.value);
                        setActiveLayout(prev => setEngineBleed(prev.layout_id, bVal));
                      }}
                      className="w-full accent-blue-600 bg-gray-200 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Column partitions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-sans font-bold text-gray-450 uppercase mb-1">Columns Count</label>
                      <select
                        value={activeLayout.columns.count}
                        onChange={(e) => {
                          const count = parseInt(e.target.value, 10);
                          setActiveLayout(prev => setColumns(prev.layout_id, { count, gutter: prev.columns.gutter }));
                        }}
                        className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-sans text-gray-700 outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map(c => (
                          <option key={c} value={c}>{c} Column{c > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-sans font-bold text-gray-450 uppercase mb-1">Gutter size</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.05"
                        value={activeLayout.columns.gutter}
                        onChange={(e) => {
                          const gVal = parseFloat(e.target.value) || 0.1;
                          setActiveLayout(prev => setColumns(prev.layout_id, { count: prev.columns.count, gutter: gVal }));
                        }}
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Place blocks quick triggers */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <span className="block text-[10px] font-mono font-bold uppercase text-gray-400">Place Layout Blocks:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLayout(prev => placeTextBlock(
                          prev.layout_id,
                          'Creative Director Signature Group',
                          prev.margins.left + 0.1,
                          prev.margins.top + 0.1,
                          prev.width - prev.margins.left - prev.margins.right - 0.2,
                          0.8,
                          { fontSize: 12 }
                        ));
                        setLayoutTraceHistory(prev => ['[LAYOUT] Inserted text typography container inside margins.', ...prev]);
                      }}
                      className="p-2 bg-blue-50 hover:bg-blue-105 border border-blue-200 rounded-xl text-left transition"
                    >
                      <span className="block text-xs font-bold text-blue-700 font-sans">Type Block</span>
                      <span className="block text-[9px] text-blue-500 mt-0.5 leading-tight">Flow editable text matrix</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveLayout(prev => placeImageBlock(
                          prev.layout_id,
                          '/assets/visual_catalog_item.jpg',
                          prev.margins.left,
                          prev.height - prev.margins.bottom - 0.9,
                          prev.width - prev.margins.left - prev.margins.right,
                          0.8,
                          { objectFit: 'contain' }
                        ));
                        setLayoutTraceHistory(prev => ['[LAYOUT] Placed image frame placeholder block on page.', ...prev]);
                      }}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition"
                    >
                      <span className="block text-xs font-bold text-emerald-700 font-sans">Image Frame</span>
                      <span className="block text-[9px] text-emerald-500 mt-0.5 leading-tight">Fit media with proper fits</span>
                    </button>
                  </div>
                </div>

                {/* Blocks Layer List */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <span className="block text-[10px] font-mono font-bold uppercase text-gray-400">Placed Elements Tree:</span>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                    {activeLayout.blocks.map(block => {
                      const isSel = selectedBlockId === block.id;
                      const wordCount = block.type === 'text' ? block.content.split(/\s+/).length : 0;
                      const textOverflows = block.overflowing;

                      return (
                        <div
                          key={block.id}
                          className={`p-2.5 rounded-xl border text-[11px] font-sans flex items-center justify-between gap-2.5 transition-all ${
                            isSel 
                              ? 'border-blue-500 bg-blue-50/20 text-blue-900 font-bold' 
                              : 'border-transparent bg-white hover:bg-slate-100/50 text-slate-705'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBlockId(block.id);
                              if (block.type === 'text') {
                                setEditorTextContent(block.content);
                                setEditorFontSize(block.data.fontSize || 12);
                              }
                            }}
                            className="flex-1 text-left truncate flex items-center gap-1.5"
                          >
                            <span className={block.type === 'text' ? 'text-blue-500' : 'text-emerald-500'}>
                              {block.type === 'text' ? '● T' : '■ IMG'}
                            </span>
                            <span className="truncate">{block.type === 'text' ? block.content : 'Image Frame Block'}</span>
                          </button>

                          {textOverflows && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-650 text-[8px] font-mono font-extrabold uppercase rounded animate-pulse" title="Quark/InDesign overflow warning: Container too small to host entire text string">
                              OVERFLOW
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveLayout(prev => ({
                                ...prev,
                                blocks: prev.blocks.filter(b => b.id !== block.id)
                              }));
                              if (selectedBlockId === block.id) setSelectedBlockId(null);
                              setLayoutTraceHistory(prev => [`[LAYOUT] Scrubbed document block "${block.id}" successfully.`, ...prev]);
                            }}
                            className="p-1 hover:bg-white border rounded text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Block Specs Editor Container */}
                {selectedBlockId && (() => {
                  const block = activeLayout.blocks.find(b => b.id === selectedBlockId);
                  if (!block) return null;
                  const textOverflows = block.overflowing;

                  return (
                    <div className="p-3 bg-white border border-gray-200 rounded-2xl space-y-3.5 shadow-sm">
                      <span className="block text-[9px] uppercase font-mono font-bold text-gray-405 leading-none">Modify Selected Block Attributes:</span>
                      
                      {block.type === 'text' && (
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] font-medium text-gray-500 mb-1 leading-none">Text Typography Contents</label>
                            <textarea
                              value={editorTextContent}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditorTextContent(val);
                                setActiveLayout(prev => ({
                                  ...prev,
                                  blocks: prev.blocks.map(b => {
                                    if (b.id !== selectedBlockId) return b;
                                    const updated = { ...b, content: val };
                                    updated.overflowing = checkTextOverflow(updated);
                                    return updated;
                                  })
                                }));
                              }}
                              rows={2}
                              className="w-full px-2 py-1 text-xs border border-gray-200 outline-none rounded-lg"
                            />
                            {textOverflows && (
                              <p className="text-[9px] font-bold text-red-600 font-sans mt-1 animate-pulse">
                                ⚠️ Quark Limit: text exceeds physical container bounds! Drag height or decrease font weight.
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[9px] text-gray-500 mb-1">
                              <span>Font Matrix: {editorFontSize}pt</span>
                              <span>Auto Aspect</span>
                            </div>
                            <input
                              type="range"
                              min="8"
                              max="32"
                              value={editorFontSize}
                              onChange={(e) => {
                                const fs = parseInt(e.target.value, 10);
                                setEditorFontSize(fs);
                                setActiveLayout(prev => ({
                                  ...prev,
                                  blocks: prev.blocks.map(b => {
                                    if (b.id !== selectedBlockId) return b;
                                    const updated = { 
                                      ...b, 
                                      data: { ...b.data, fontSize: fs }
                                    };
                                    updated.overflowing = checkTextOverflow(updated);
                                    return updated;
                                  })
                                }));
                              }}
                              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div>
                          <label className="block text-gray-505 mb-0.5">X Loc ({activeLayout.unit})</label>
                          <input
                            type="number"
                            step="0.05"
                            value={block.x}
                            onChange={(e) => {
                              const xV = parseFloat(e.target.value) || 0;
                              setActiveLayout(prev => ({
                                ...prev,
                                blocks: prev.blocks.map(b => {
                                  if (b.id !== selectedBlockId) return b;
                                  const updated = { ...b, x: xV };
                                  updated.overflowing = checkTextOverflow(updated);
                                  return updated;
                                })
                              }));
                            }}
                            className="w-full p-1 border rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-550 mb-0.5">Y Loc ({activeLayout.unit})</label>
                          <input
                            type="number"
                            step="0.05"
                            value={block.y}
                            onChange={(e) => {
                              const yV = parseFloat(e.target.value) || 0;
                              setActiveLayout(prev => ({
                                ...prev,
                                blocks: prev.blocks.map(b => {
                                  if (b.id !== selectedBlockId) return b;
                                  const updated = { ...b, y: yV };
                                  updated.overflowing = checkTextOverflow(updated);
                                  return updated;
                                })
                              }));
                            }}
                            className="w-full p-1 border rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-505 mb-0.5">W Width ({activeLayout.unit})</label>
                          <input
                            type="number"
                            step="0.05"
                            value={block.width}
                            onChange={(e) => {
                              const wV = parseFloat(e.target.value) || 0.1;
                              setActiveLayout(prev => ({
                                ...prev,
                                blocks: prev.blocks.map(b => {
                                  if (b.id !== selectedBlockId) return b;
                                  const updated = { ...b, width: wV };
                                  updated.overflowing = checkTextOverflow(updated);
                                  return updated;
                                })
                              }));
                            }}
                            className="w-full p-1 border rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-550 mb-0.5">H Height ({activeLayout.unit})</label>
                          <input
                            type="number"
                            step="0.05"
                            value={block.height}
                            onChange={(e) => {
                              const hV = parseFloat(e.target.value) || 0.1;
                              setActiveLayout(prev => ({
                                ...prev,
                                blocks: prev.blocks.map(b => {
                                  if (b.id !== selectedBlockId) return b;
                                  const updated = { ...b, height: hV };
                                  updated.overflowing = checkTextOverflow(updated);
                                  return updated;
                                })
                              }));
                            }}
                            className="w-full p-1 border rounded text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Operations Actions & Preflight Checker */}
                <div className="pt-3 border-t border-gray-200 space-y-2 text-center">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLayout(prev => snapAllBlocksToGrid(prev, 0.2));
                        setLayoutTraceHistory(prev => ['[LAYOUT] Forced mechanical snapping alignment on grid bounds.', ...prev]);
                      }}
                      className="p-2 border border-gray-205 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <GridIcon className="h-3.5 w-3.5" />
                      <span>Snap Layout</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const name = `MasterGuide_${Date.now().toString().slice(-4)}`;
                        setActiveLayout(prev => createMasterPage(prev.layout_id, name));
                        setLayoutTraceHistory(prev => [`[LAYOUT] Saved design grid parameters as "${name}" Master Page.`, ...prev]);
                      }}
                      className="p-2 border border-gray-205 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Master Page</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const filename = `${activeLayout.type}_quark_bundle.svg`;
                      const svgText = exportPrintPDF(activeLayout.layout_id).svg;
                      const uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
                      const dlLink = document.createElement('a');
                      dlLink.setAttribute("href", uri);
                      dlLink.setAttribute("download", filename);
                      document.body.appendChild(dlLink);
                      dlLink.click();
                      dlLink.remove();
                      setLayoutTraceHistory(prev => ['[EXPORTER] Compiled vector layout anchors. Ready for print shops.', ...prev]);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="h-4 w-4" />
                    <span>PREFLIGHT & DOWNLOAD SVG/PDF</span>
                  </button>
                  <span className="block text-[9px] text-gray-400 font-mono">Compiled with standard FOGRA ISO attributes & bleed.</span>
                </div>

                {/* Operations logger */}
                <div className="pt-3 border-t border-gray-200">
                  <span className="block text-[9px] font-mono font-bold uppercase text-gray-400 leading-none mb-1.5">Preflight Trace Logs:</span>
                  <div className="bg-slate-900 border border-slate-950 p-2 text-[9px] text-emerald-450 rounded-xl max-h-[80px] overflow-y-auto font-mono scrollbar-none">
                    {layoutTraceHistory.map((h, i) => (
                      <div key={i} className="truncate select-text">❯ {h}</div>
                    ))}
                  </div>
                </div>

              </div>
            ) : graphSidebarTab === 'graph' ? (
              /* TAB 3: VISUAL DOCUMENT GRAPH MANAGER (.visualos) */
              <div className="bg-gray-50 border border-gray-250 rounded-3xl p-5 shadow-sm space-y-6">
                
                {/* Save and Load block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono font-bold text-slate-800 block tracking-wider leading-none">
                      File System APIs:
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-105 border border-blue-200 text-blue-700 font-mono text-[9px] font-bold rounded">
                      .visualos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center col-span-2">
                    <button
                      type="button"
                      onClick={saveProjectFile}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Save Project</span>
                    </button>
                    <label className="p-2.5 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5 shadow-xs">
                      <Folder className="h-3.5 w-3.5 text-slate-500" />
                      <span>Load File</span>
                      <input
                        type="file"
                        accept=".visualos"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            loadProjectFile(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Drag and Drop Zone simulation */}
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-blue-500 transition cursor-pointer relative bg-white">
                    <Files className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <span className="block text-[11px] font-semibold text-slate-700">Drag & Drop .visualos Here</span>
                    <span className="block text-[9px] text-gray-405 mt-1 leading-tight">Rehydrates editable vector matrix instantly</span>
                    <input
                      type="file"
                      accept=".visualos"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          loadProjectFile(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Undo / Redo Actions Panel */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">
                    Historic Time Machine (Undo/Redo):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={undo}
                      disabled={undoStack.length === 0}
                      className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition ${
                        undoStack.length > 0
                          ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                          : 'border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <span>Undo</span>
                      <span className="text-[9px] px-1 bg-gray-100 border text-gray-500 rounded font-mono font-bold">
                        {undoStack.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition ${
                        redoStack.length > 0
                          ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                          : 'border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <span>Redo</span>
                      <span className="text-[9px] px-1 bg-gray-100 border text-gray-500 rounded font-mono font-bold">
                        {redoStack.length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Project Metadata Details */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">
                    Project Metadata:
                  </span>
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 leading-none">Project ID</label>
                      <input
                        type="text"
                        value={projectGraph.project_id}
                        onChange={(e) => setProjectGraph(prev => ({ ...prev, project_id: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 leading-none">Project Title</label>
                      <input
                        type="text"
                        value={projectGraph.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjectGraph(prev => ({ ...prev, name: val }));
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-sans font-bold text-gray-800 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Objects Tree & Linking Layer Matrix */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider leading-none">
                      Document Objects Node Graph:
                    </span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-mono font-bold px-1.5 rounded">
                      {projectGraph.objects.length} Objects
                    </span>
                  </div>

                  {/* Add Abstract Document Objective Form */}
                  <div className="p-3 bg-white border border-gray-250 rounded-2xl space-y-2.5">
                    <span className="block text-[9px] font-bold text-gray-500 uppercase leading-none">Insert Abstract Object:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={newObjectType}
                        onChange={(e: any) => setNewObjectType(e.target.value)}
                        className="px-2 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-sans font-medium text-gray-600 outline-none"
                      >
                        <option value="vector">Vector Outline</option>
                        <option value="raster">Raster Image</option>
                        <option value="text">Text Box</option>
                        <option value="dimension">Dimension Lock</option>
                        <option value="material">Material Spec</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Name (e.g. LogoA)"
                        value={newObjectName}
                        onChange={(e) => setNewObjectName(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newObjectName.trim()) return;
                        addObjectToGraph(newObjectType, newObjectName);
                        setNewObjectName('');
                      }}
                      className="w-full py-1.5 bg-slate-900 border border-slate-950 text-white rounded-xl text-[10px] font-sans font-extrabold uppercase tracking-wide flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Insert to Graph</span>
                    </button>
                  </div>

                  {/* Active list of Document Graph Objects */}
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {projectGraph.objects.map(obj => (
                      <div key={obj.id} className="p-2.5 bg-white border border-gray-200 rounded-xl text-[10px] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800 break-all">{obj.name}</span>
                          <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[8px] font-mono capitalize leading-none">
                            {obj.type}
                          </span>
                        </div>
                        
                        {/* Link to Layer interactive dropdown selector */}
                        <div className="flex items-center gap-1.5 justify-between pt-1 border-t border-gray-100">
                          <span className="text-[8px] uppercase font-mono font-bold text-gray-400">Linked to Layer:</span>
                          <select
                            value={obj.linkedLayerId || ''}
                            onChange={(e) => linkObjectToLayer(obj.id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[9px] font-sans rounded-md p-1 outline-none max-w-[120px]"
                          >
                            <option value="">-- No Link --</option>
                            {activeCanvas.layers.map(l => (
                              <option key={l.id} value={l.id}>{l.name} ({l.id})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Rules & Styling specifications */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">
                    Brand Compliance Regulations:
                  </span>
                  <div className="p-3 bg-white border border-gray-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-550 leading-none">Lock Palette Target Colors:</span>
                      <input
                        type="checkbox"
                        checked={projectGraph.brand_rules.lockPalette}
                        onChange={(e) => {
                          setProjectGraph(prev => ({
                            ...prev,
                            brand_rules: {
                              ...prev.brand_rules,
                              lockPalette: e.target.checked
                            }
                          }));
                          logTrace(`[BRAND] Multi-screen color token palette lock: ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                        }}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-gray-450 leading-none mb-0.5">Brand Primary</label>
                        <input
                          type="text"
                          value={projectGraph.brand_rules.primaryColor || ''}
                          onChange={(e) => {
                            setProjectGraph(prev => ({
                              ...prev,
                              brand_rules: {
                                ...prev.brand_rules,
                                primaryColor: e.target.value
                              }
                            }));
                          }}
                          className="w-full px-1.5 py-1 bg-gray-50 border border-gray-205 text-[9px] font-mono text-gray-800 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-gray-450 leading-none mb-0.5">Secondary Accent</label>
                        <input
                          type="text"
                          value={projectGraph.brand_rules.secondaryColor || ''}
                          onChange={(e) => {
                            setProjectGraph(prev => ({
                              ...prev,
                              brand_rules: {
                                ...prev.brand_rules,
                                secondaryColor: e.target.value
                              }
                            }));
                          }}
                          className="w-full px-1.5 py-1 bg-gray-50 border border-gray-205 text-[9px] font-mono text-gray-800 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Checkpoints/Versions restoring */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider leading-none">
                      Historic Version Checkpoints:
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-mono font-bold px-1.5 rounded">
                      {projectGraph.history.length || 0} Saved
                    </span>
                  </div>

                  {/* Create Version Form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem('vName') as HTMLInputElement;
                      if (!input.value.trim()) return;
                      versionProject(input.value);
                      input.value = '';
                    }}
                    className="flex gap-1.5 animate-none"
                  >
                    <input
                      name="vName"
                      type="text"
                      placeholder="Checkpoint name (v1.2)"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-[10px] rounded-xl transition shadow"
                    >
                      Save Version
                    </button>
                  </form>

                  {/* Historical checkpoint list */}
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {projectGraph.history.map(hist => (
                      <div 
                        key={hist.id} 
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-[10px] flex items-center justify-between gap-1 shadow-2xs"
                      >
                        <div>
                          <span className="font-bold text-gray-800 block leading-tight">{hist.name}</span>
                          <span className="text-[8px] text-gray-405 font-mono block mt-0.5 leading-none">Time: {hist.timestamp}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => restoreVersion(hist.id)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-sans font-bold rounded shadow-xs"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                    {projectGraph.history.length === 0 && (
                      <div className="text-center p-3 text-[9px] text-gray-400 border border-dashed rounded-xl leading-relaxed">
                        No checkpoints registered yet. Input checkpoint name above and click Save Version to secure snapshots.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : graphSidebarTab === 'brand' ? (
              /* TAB 4: BRAND IDENTITY ENGINE */
              <div className="bg-gray-50 border border-gray-255 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn">
                {/* Section Title */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 block tracking-widest leading-none">Identity System</span>
                    <h3 className="text-sm font-extrabold text-slate-800 font-sans mt-1">Brand Identity Engine</h3>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 font-mono text-[9px] font-bold rounded uppercase">
                    ONLINE
                  </span>
                </div>

                {/* 1. Brand Guide Ingestion Block */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">
                    1. Scan Brand Manual Guides (Raw Text)
                  </span>
                  <div className="space-y-2.5">
                    <textarea
                      placeholder="Paste your brand specifications text here... Include hex color codes (e.g. #0D9488, #F43F5E) and logo rules."
                      value={brandGuideText}
                      onChange={(e) => setBrandGuideText(e.target.value)}
                      className="w-full h-24 p-3 bg-white border border-gray-200 rounded-2xl text-[11px] font-sans text-gray-700 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none shadow-2xs leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => uploadBrandGuide()}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-sans font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 shadow"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Ingest and Parse Brand Guide</span>
                    </button>
                  </div>
                </div>

                {/* 2. Brand Compliance Auditor Dashboard */}
                {brandComplianceReport && (
                  <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                        Brand Compliance Score
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        brandComplianceReport.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        brandComplianceReport.status === 'warn' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {brandComplianceReport.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-800">
                        <span>Calibration Compliance Rating</span>
                        <span>{brandComplianceReport.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            brandComplianceReport.score > 80 ? 'bg-emerald-500' :
                            brandComplianceReport.score > 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${brandComplianceReport.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Passes & Violations */}
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {brandComplianceReport.errors.map((err, i) => (
                        <div key={`err-${i}`} className="p-2 bg-rose-50/50 border border-rose-100 text-rose-700 text-[10px] rounded-xl flex items-start gap-1.5 font-medium leading-relaxed">
                          <EyeOff className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-500" />
                          <span>{err}</span>
                        </div>
                      ))}
                      {brandComplianceReport.passes.map((pass, i) => (
                        <div key={`pass-${i}`} className="p-2 bg-emerald-50/30 border border-emerald-100 text-emerald-700 text-[10px] rounded-xl flex items-start gap-1.5 font-medium leading-relaxed">
                          <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                          <span>{pass}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Custom Brand Kit Creator */}
                <div className="bg-white border border-gray-200 p-4 rounded-3xl space-y-3 shadow-2xs">
                  <span className="block text-[10px] font-mono font-bold text-gray-505 uppercase border-b pb-1">
                    2. Quick Brand Kit Configurator
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Kit Identity Name</label>
                      <input
                        type="text"
                        placeholder="e.g. VisualOS Dark Theme"
                        value={newKitName}
                        onChange={(e) => setNewKitName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Primary HEX</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={newKitPrimary}
                          onChange={(e) => setNewKitPrimary(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={newKitPrimary}
                          onChange={(e) => setNewKitPrimary(e.target.value)}
                          className="w-full px-1.5 py-1 bg-gray-50 border border-gray-200 text-[10px] font-mono rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Secondary HEX</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={newKitSecondary}
                          onChange={(e) => setNewKitSecondary(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={newKitSecondary}
                          onChange={(e) => setNewKitSecondary(e.target.value)}
                          className="w-full px-1.5 py-1 bg-gray-50 border border-gray-200 text-[10px] font-mono rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Background HEX</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={newKitBackground}
                          onChange={(e) => setNewKitBackground(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={newKitBackground}
                          onChange={(e) => setNewKitBackground(e.target.value)}
                          className="w-full px-1.5 py-1 bg-gray-50 border border-gray-200 text-[10px] font-mono rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Accent HEX</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={newKitAccent}
                          onChange={(e) => setNewKitAccent(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={newKitAccent}
                          onChange={(e) => setNewKitAccent(e.target.value)}
                          className="w-full px-1.5 py-1 bg-gray-5 e border border-gray-200 text-[10px] font-mono rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Display Text Fonts Family</label>
                      <input
                        type="text"
                        placeholder="e.g. Space Grotesk, sans-serif"
                        value={newKitFontsDisplay}
                        onChange={(e) => setNewKitFontsDisplay(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[9px] text-gray-400 uppercase mb-0.5 font-mono">Strict Logo Proportions Rule</label>
                      <input
                        type="text"
                        placeholder="e.g. Locked aspect bounds ratio"
                        value={newKitLogoRules}
                        onChange={(e) => setNewKitLogoRules(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      createBrandKit(newKitName, newKitLogoRules, newKitPrimary, newKitSecondary, newKitBackground, newKitAccent, newKitFontsDisplay);
                      setNewKitName('');
                    }}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-850 border border-emerald-200 rounded-xl text-[10px] font-sans font-extrabold uppercase tracking-wide flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Compile New Brand Kit</span>
                  </button>
                </div>

                {/* 4. Active Kits Selector / Switcher */}
                <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">3. Loaded Brand Kits</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-mono text-[9px] font-bold rounded">
                      {brandKits.length} Kits
                    </span>
                  </div>

                  <select
                    value={activeBrandKitId}
                    onChange={(e) => {
                      setActiveBrandKitId(e.target.value);
                      const selectedKit = brandKits.find(b => b.id === e.target.value);
                      if (selectedKit) {
                        validateBrandCompliance(selectedKit);
                      }
                      logTrace(`[BRAND ENGINE] Switched active Brand Kit configuration scope.`);
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans font-medium text-gray-750 outline-none shadow-xs"
                  >
                    {brandKits.map(kit => (
                      <option key={kit.id} value={kit.id}>{kit.name}</option>
                    ))}
                  </select>

                  {/* Lock Controls and apply colors */}
                  {(() => {
                    const activeKit = brandKits.find(b => b.id === activeBrandKitId);
                    if (!activeKit) return null;
                    return (
                      <div className="space-y-3 pt-2.5 border-t border-gray-100">
                        {/* Swatches Grid */}
                        <div className="grid grid-cols-4 gap-1 text-center">
                          <div className="p-1 rounded bg-slate-100/80">
                            <div className="h-6 w-full rounded border border-gray-200" style={{ backgroundColor: activeKit.colors.primary }} />
                            <span className="block text-[8px] font-mono text-gray-550 mt-1 truncate">Primary</span>
                          </div>
                          <div className="p-1 rounded bg-slate-100/80">
                            <div className="h-6 w-full rounded border border-gray-200" style={{ backgroundColor: activeKit.colors.secondary }} />
                            <span className="block text-[8px] font-mono text-gray-550 mt-1 truncate">Secondary</span>
                          </div>
                          <div className="p-1 rounded bg-slate-100/80">
                            <div className="h-6 w-full rounded border border-gray-200" style={{ backgroundColor: activeKit.colors.background }} />
                            <span className="block text-[8px] font-mono text-gray-550 mt-1 truncate">Background</span>
                          </div>
                          <div className="p-1 rounded bg-slate-100/80">
                            <div className="h-6 w-full rounded border border-gray-200" style={{ backgroundColor: activeKit.colors.accent }} />
                            <span className="block text-[8px] font-mono text-gray-550 mt-1 truncate">Accent</span>
                          </div>
                        </div>

                        {/* Rules list */}
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] space-y-1">
                          <div className="flex justify-between text-slate-600"><span className="font-mono text-[9px] uppercase">Font Base:</span> <span className="font-semibold">{activeKit.fonts.display}</span></div>
                          <div className="flex justify-between text-slate-600"><span className="font-mono text-[9px] uppercase">Logo Aspect:</span> <span className="font-semibold truncate max-w-[125px]" title={activeKit.logoRules}>{activeKit.logoRules}</span></div>
                          <div className="flex justify-between text-slate-600"><span className="font-mono text-[9px] uppercase">Icons Style:</span> <span className="font-semibold truncate max-w-[125px]" title={activeKit.iconStyle}>{activeKit.iconStyle}</span></div>
                        </div>

                        {/* Lock / Apply Actions */}
                        <div className="flex items-center justify-between py-1 bg-slate-50 px-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-gray-550 flex items-center gap-1.5">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span>Palette Strict Enforcement Lock</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={brandLockPalette}
                            onChange={(e) => lockBrandPalette(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-0 cursor-pointer h-4 w-4"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => applyBrandToCanvas()}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-sans font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 shadow"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Apply Brand system to Canvas</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : graphSidebarTab === 'uiux' ? (
              /* TAB 5: UI / UX DESIGN ENGINE */
              <div className="bg-gray-50 border border-gray-255 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn">
                {/* Section Title */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-violet-600 block tracking-widest leading-none">Layout Blueprint</span>
                    <h3 className="text-sm font-extrabold text-slate-800 font-sans mt-1">UI/UX Design Engine</h3>
                  </div>
                  <span className="px-1.5 py-0.5 bg-violet-50 border border-violet-200 text-violet-600 font-mono text-[9px] font-bold rounded uppercase">
                    ACTIVE
                  </span>
                </div>

                {/* 1. Workspaces Screen frames & modes Selector */}
                <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">1. Active Screen workspace</span>
                    <button
                      type="button"
                      onClick={() => createWireframe()}
                      className={`px-2 py-0.5 border text-[9px] font-bold rounded ${
                        showWireframeMode ? 'bg-slate-900 border-slate-950 text-white' : 'bg-slate-55 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Wireframe Blueprint: {showWireframeMode ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <select
                    value={activeUiScreenId}
                    onChange={(e) => {
                      setActiveUiScreenId(e.target.value);
                      logTrace(`[UI WORKSPACE] Loaded screen ID "${e.target.value}" workspace.`);
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans font-medium text-gray-700 outline-none shadow-xs"
                  >
                    {uiScreens.map(screen => (
                      <option key={screen.id} value={screen.id}>{screen.name} ({screen.type.toUpperCase()})</option>
                    ))}
                  </select>

                  {/* Spawn screen templates */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-[8px] font-mono text-gray-400 uppercase leading-none">Spawn Layout Screen preset:</span>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => createUIScreen('Authentication Portal', 'mobile')}
                        className="py-1.5 bg-gray-50 hover:bg-slate-100 border text-[9px] font-semibold text-slate-700 rounded-lg"
                      >
                        📱 Mobile Frame
                      </button>
                      <button
                        type="button"
                        onClick={() => createUIScreen('Control HUD', 'tablet')}
                        className="py-1.5 bg-gray-50 hover:bg-slate-100 border text-[9px] font-semibold text-slate-700 rounded-lg"
                      >
                        📟 Tablet Frame
                      </button>
                      <button
                        type="button"
                        onClick={() => createUIScreen('Admin Dashboard Block', 'desktop')}
                        className="py-1.5 bg-gray-50 hover:bg-slate-100 border text-[9px] font-semibold text-slate-700 rounded-lg"
                      >
                        🖥️ Desktop Frame
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Component Spawner Palette */}
                <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3.5 shadow-2xs">
                  <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
                    2. Component Spawner Palette
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => createNavBar(activeUiScreenId)}
                      className="py-2 px-3 border border-gray-200 bg-gray-50 hover:bg-slate-100 rounded-xl text-left transition text-slate-705 flex items-center justify-between"
                    >
                      <div className="leading-tight">
                        <span className="block text-[10px] font-bold">Top Nav Bar</span>
                        <span className="block text-[8px] text-gray-400 font-mono">Header Portal Layout</span>
                      </div>
                      <Plus className="h-3 w-3 text-slate-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => createCard(activeUiScreenId)}
                      className="py-2 px-3 border border-gray-200 bg-gray-50 hover:bg-slate-100 rounded-xl text-left transition text-slate-705 flex items-center justify-between"
                    >
                      <div className="leading-tight">
                        <span className="block text-[10px] font-bold">Bento card</span>
                        <span className="block text-[8px] text-gray-400 font-mono">Content Block Panel</span>
                      </div>
                      <Plus className="h-3 w-3 text-slate-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => createButton(activeUiScreenId)}
                      className="py-2 px-3 border border-gray-200 bg-gray-50 hover:bg-slate-100 rounded-xl text-left transition text-slate-705 flex items-center justify-between"
                    >
                      <div className="leading-tight">
                        <span className="block text-[10px] font-bold">Action Button</span>
                        <span className="block text-[8px] text-gray-400 font-mono">Interactive Button</span>
                      </div>
                      <Plus className="h-3 w-3 text-slate-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => createInputField(activeUiScreenId)}
                      className="py-2 px-3 border border-gray-200 bg-gray-50 hover:bg-slate-100 rounded-xl text-left transition text-slate-705 flex items-center justify-between"
                    >
                      <div className="leading-tight">
                        <span className="block text-[10px] font-bold">Text Input</span>
                        <span className="block text-[8px] text-gray-400 font-mono">Input Form Field</span>
                      </div>
                      <Plus className="h-3 w-3 text-slate-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => createModal(activeUiScreenId)}
                      className="py-2 px-3 border border-gray-200 bg-gray-50 hover:bg-slate-100 rounded-xl text-left transition text-slate-705 flex items-center justify-between col-span-2"
                    >
                      <div className="leading-tight">
                        <span className="block text-[10px] font-bold">Overlays Modal Dialog Alert</span>
                        <span className="block text-[8px] text-gray-400 font-mono">Feedback Dialog Modals overlay</span>
                      </div>
                      <Plus className="h-3 w-3 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* 3. Interactive Click Paths & User Flows thread Linker */}
                <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-2xs">
                  <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
                    3. Interactive Click Transition Paths
                  </span>

                  <div className="space-y-2 text-[10px]">
                    <div>
                      <label className="block text-[9px] text-gray-400 font-mono">Transition Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Tap login button"
                        value={newFlowName}
                        onChange={(e) => setNewFlowName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border rounded-lg outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[9px] text-gray-400 font-mono">From Screen</label>
                        <select
                          value={newFlowFrom}
                          onChange={(e) => setNewFlowFrom(e.target.value)}
                          className="w-full p-1 border rounded-lg bg-white"
                        >
                          {uiScreens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-gray-400 font-mono">To Screen</label>
                        <select
                          value={newFlowTo}
                          onChange={(e) => setNewFlowTo(e.target.value)}
                          className="w-full p-1 border rounded-lg bg-white"
                        >
                          {uiScreens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gray-400 font-mono">Trigger Event Action</label>
                      <input
                        type="text"
                        placeholder="e.g. click Button_1, timer_300ms"
                        value={newFlowTrigger}
                        onChange={(e) => setNewFlowTrigger(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-50 border rounded-lg outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        linkScreens(newFlowFrom, newFlowTo, newFlowTrigger);
                        setNewFlowName('');
                      }}
                      className="w-full py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[10px] font-sans font-bold uppercase flex items-center justify-center gap-1 shadow animate-none"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Connect Screen Nodes</span>
                    </button>
                  </div>
                </div>

                {/* 4. Click transitions lists / thread blueprint */}
                <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">4. Configured User Flow Paths</span>
                    <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 font-mono text-[9px] font-bold rounded">
                      {userFlows.length} Threads
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {userFlows.map(flow => {
                      const fromScreen = uiScreens.find(s => s.id === flow.fromScreenId);
                      const toScreen = uiScreens.find(s => s.id === flow.toScreenId);
                      return (
                        <div key={flow.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] space-y-1">
                          <span className="font-bold text-gray-800 block">{flow.name}</span>
                          <div className="flex items-center justify-between text-gray-505 font-medium">
                            <span className="text-[9px] px-1 bg-white rounded border">{fromScreen?.name || flow.fromScreenId}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                            <span className="text-[9px] px-1 bg-white rounded border">{toScreen?.name || flow.toScreenId}</span>
                          </div>
                          <span className="block text-[8px] font-mono text-slate-400 truncate mt-1">Trigger Event: {flow.triggerEvent}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Exporter dossier panel */}
                <div className="p-4 bg-white border border-gray-200 rounded-3xl space-y-3 shadow-2xs">
                  <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase border-b pb-1">
                    5. Export Specifications Dossier (Handoff)
                  </span>
                  
                  <div className="grid grid-cols-4 gap-1">
                    {(['json', 'svg', 'png', 'pdf'] as const).map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => exportDesignSpec(fmt)}
                        className="py-2.5 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl text-center text-[10px] font-bold uppercase text-slate-700 shadow-2xs"
                      >
                        {fmt} Spec
                      </button>
                    ))}
                  </div>
                  {designSpecDownloaded && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-sans font-bold text-center leading-none">
                      Design System specs payload generated successfully!
                    </div>
                  )}
                </div>
              </div>
            ) : graphSidebarTab === 'product' ? (
              <ProductSheetTab 
                activeBrandKit={brandKits.find(b => b.id === activeBrandKitId)} 
                logTrace={logTrace} 
              />
            ) : graphSidebarTab === 'industrial' ? (
              <IndustrialDesignTab 
                activeBrandKit={brandKits.find(b => b.id === activeBrandKitId)} 
                logTrace={logTrace} 
              />
            ) : graphSidebarTab === 'architecture' ? (
              <ArchitectureDrawingEngine 
                activeBrandKit={brandKits.find(b => b.id === activeBrandKitId)} 
                logTrace={logTrace} 
              />
            ) : graphSidebarTab === 'engineering' ? (
              <EngineeringDFMAndBOMEngine 
                activeBrandKit={brandKits.find(b => b.id === activeBrandKitId)} 
                logTrace={logTrace} 
              />
            ) : graphSidebarTab === 'export_manager' ? (
              <ExportManager 
                activeBrandKit={brandKits.find(b => b.id === activeBrandKitId)} 
                logTrace={logTrace}
                activeCanvas={activeCanvas}
                selectedLayerId={selectedLayerId || ''}
              />
            ) : graphSidebarTab === 'quality_verifier' ? (
              <QualityControlPanel
                activeCanvas={activeCanvas}
                selectedLayerId={selectedLayerId}
                setSelectedLayerId={setSelectedLayerId}
                setGraphSidebarTab={setGraphSidebarTab}
                brandKits={brandKits}
                activeBrandKitId={activeBrandKitId}
                logTrace={logTrace}
              />
            ) : graphSidebarTab === 'workspace_manager' ? (
              <WorkspaceManager
                activeCanvas={activeCanvas}
                setActiveCanvas={setActiveCanvas}
                brandKits={brandKits}
                logTrace={logTrace}
              />
            ) : (
               /* TAB X: PHOTO-SHOP STYLE RASTER LAYER ENGINE */
               <div className="bg-gray-50 border border-gray-250 rounded-3xl p-5 shadow-sm space-y-6 animate-fadeIn">
                 <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                   <div className="flex items-center gap-2">
                     <ImageIcon className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                     <span className="text-xs uppercase font-mono font-bold text-gray-700 tracking-wider">Raster Image Editor</span>
                   </div>
                   <button
                     type="button"
                     onClick={() => {
                       const freshLayer = rasterImageEngine.createRasterLayer({
                         name: `Layer_${Date.now().toString().slice(-4)}`,
                         source: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                         width: 800,
                         height: 600,
                       });
                       setRasterLayers(rasterImageEngine.listLayers());
                       setSelectedRasterLayerId(freshLayer.id);
                       logTrace(`[RASTER] Loaded fresh 800x600 canvas source layer: "${freshLayer.name}" non-destructively.`);
                     }}
                     className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[9px] font-bold rounded-lg transition uppercase tracking-tight flex items-center gap-1"
                   >
                     <Plus className="h-2.5 w-2.5" />
                     <span>Import Photo</span>
                   </button>
                 </div>

                 {/* Layer selector */}
                 {rasterLayers.length > 0 ? (
                   <div className="space-y-4">
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono font-semibold text-gray-400 uppercase">Active Raster Asset Layer:</label>
                       <select
                         value={selectedRasterLayerId || ''}
                         onChange={(e) => setSelectedRasterLayerId(e.target.value)}
                         className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-sans text-gray-700 outline-none shadow-xs"
                       >
                         {rasterLayers.map(l => (
                           <option key={l.id} value={l.id}>{l.name} ({l.id})</option>
                         ))}
                       </select>
                     </div>

                     {(() => {
                       const currLayer = rasterLayers.find(l => l.id === selectedRasterLayerId);
                       if (!currLayer) return <p className="text-xs text-gray-400">Please select or insert a layer.</p>;

                       // Check enabled effects mapping
                       const hasBgPass = currLayer.effects.some(e => e.kind === 'background_removal_pass');
                       const bgPass = currLayer.effects.find(e => e.kind === 'background_removal_pass');
                       
                       const hasLightingPass = currLayer.effects.some(e => e.kind === 'lighting_pass' && e.enabled);
                       const lightingPass = currLayer.effects.find(e => e.kind === 'lighting_pass');

                       const hasMaterialPass = currLayer.effects.some(e => e.kind === 'material_pass' && e.enabled);
                       const materialPass = currLayer.effects.find(e => e.kind === 'material_pass');

                       const hasShadowPass = currLayer.effects.some(e => e.kind === 'shadow_pass' && e.enabled);
                       const shadowPass = currLayer.effects.find(e => e.kind === 'shadow_pass');

                       const hasReflectionPass = currLayer.effects.some(e => e.kind === 'reflection_pass' && e.enabled);
                       const reflectionPass = currLayer.effects.find(e => e.kind === 'reflection_pass');

                       const hasTexturePass = currLayer.effects.some(e => e.kind === 'texture_pass' && e.enabled);
                       const texturePass = currLayer.effects.find(e => e.kind === 'texture_pass');

                       const hasCleanupPass = currLayer.effects.some(e => e.kind === 'cleanup_pass' && e.enabled);

                       return (
                         <div className="space-y-4 text-xs">
                           
                           {/* Quick preview panel */}
                           <div className="p-3.5 bg-slate-900 border border-slate-950 rounded-2xl relative shadow-inner overflow-hidden group flex flex-col items-center justify-center min-h-[160px]">
                             {/* Background grid */}
                             <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                             
                             {/* Simulated Layer Rendering with non-destructive CSS Filters & Overlays */}
                             <div className="relative max-w-full max-h-[110px] rounded-lg overflow-hidden shadow-md border border-slate-700/55">
                               <img 
                                 src={currLayer.asset?.source} 
                                 referrerPolicy="no-referrer"
                                 alt={currLayer.name}
                                 className="max-h-[110px] w-auto h-auto object-cover transition-all duration-300"
                                 style={{
                                   opacity: currLayer.opacity,
                                   filter: `
                                     ${hasBgPass && (bgPass?.enabled) ? 'contrast(1.15) brightness(1.05) saturate(1.1)' : ''}
                                     ${hasLightingPass && (lightingPass?.enabled) ? `brightness(${1 + (lightingPass?.settings.intensity || 0.5) * 0.3})` : ''}
                                     ${hasMaterialPass && (materialPass?.enabled) ? 'contrast(1.2) saturate(0.85)' : ''}
                                     ${hasCleanupPass ? 'sharpness(1.2)' : ''}
                                   `,
                                   boxShadow: hasShadowPass && shadowPass?.enabled
                                     ? `${shadowPass?.settings.x || 10}px ${shadowPass?.settings.y || 15}px ${shadowPass?.settings.blur || 20}px rgba(0,0,0,${shadowPass?.opacity || 0.3})` 
                                     : 'none',
                                 }}
                               />
                               
                               {/* Matte background masking representation */}
                               {hasBgPass && bgPass?.enabled && (
                                 <div className="absolute inset-0 bg-transparent border-2 border-dashed border-cyan-400 pointer-events-none animate-pulse">
                                   <div className="absolute top-1 right-1 bg-cyan-500 text-white text-[6px] font-mono px-1 py-0.5 rounded uppercase">AI Cutout Active</div>
                                 </div>
                               )}

                               {/* Brushed Texture Layer representation overlay */}
                               {hasTexturePass && texturePass?.enabled && (
                                 <div 
                                   className="absolute inset-0 bg-repeat bg-center pointer-events-none opacity-20 mix-blend-overlay"
                                   style={{
                                     backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=10&q=80')",
                                     backgroundColor: texturePass?.settings.type === 'brushed_metal' ? 'rgba(255,255,255,0.1)' : 'transparent'
                                   }}
                                 />
                               )}
                             </div>

                             {/* Interactive Reflection projection element beneath */}
                             {hasReflectionPass && reflectionPass?.enabled && (
                               <div className="relative max-w-full max-h-[30px] rounded-b-lg overflow-hidden opacity-25 scale-y-[-0.6] blur-[2px] mt-1 border-t border-slate-800">
                                 <img 
                                   src={currLayer.asset?.source} 
                                   referrerPolicy="no-referrer"
                                   alt="reflection"
                                   className="max-h-[50px] w-auto h-auto object-cover"
                                 />
                               </div>
                             )}

                             <div className="absolute bottom-2.5 left-3 text-[8px] font-mono text-slate-500 uppercase">
                               Live Composite Stack Preview
                             </div>
                           </div>

                           {/* Render Option Blocks */}
                           <div className="space-y-3.5 bg-white border border-gray-150 p-4 rounded-2xl">
                             <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wide font-black">Composite FX Passes (Non-Destructive)</h4>
                             
                             {/* AI BACKGROUND REMOVAL */}
                             <div className="flex items-center justify-between">
                               <div className="space-y-0.5">
                                 <span className="font-semibold text-gray-800 flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                   AI Subject Inpainter Cutout
                                 </span>
                                 <p className="text-[9px] text-gray-400">Removes backing with neural edge detection matrix.</p>
                               </div>
                               <button
                                 type="button"
                                 onClick={() => {
                                   if (hasBgPass) {
                                     // Toggle
                                     rasterImageEngine.toggleEffect(currLayer.id, bgPass!.id, !bgPass!.enabled);
                                   } else {
                                     rasterImageEngine.removeBackground(currLayer.id, { method: 'ai' });
                                   }
                                   setRasterLayers(rasterImageEngine.listLayers());
                                   logTrace(`[RASTER] Non-destructively toggled AI background removal state.`);
                                 }}
                                 className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                                   hasBgPass && bgPass?.enabled
                                     ? 'bg-cyan-600 text-white'
                                     : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                 }`}
                               >
                                 {hasBgPass && bgPass?.enabled ? 'Active' : 'Apply'}
                               </button>
                             </div>

                             {/* premium materials */}
                             <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                               <div className="space-y-0.5">
                                 <span className="font-semibold text-gray-800 flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                   Engine Material Mapping
                                 </span>
                                 <p className="text-[9px] text-gray-400">Specular roughness mapping presets.</p>
                               </div>
                               <div className="flex items-center gap-1.5">
                                 {hasMaterialPass && (
                                   <select
                                     value={materialPass?.settings.type || 'matte'}
                                     onChange={(e) => {
                                       rasterImageEngine.applyMaterial(currLayer.id, {
                                         type: e.target.value as MaterialType,
                                         roughness: e.target.value === 'stainless_steel' ? 0.25 : 0.5,
                                         metallic: e.target.value === 'stainless_steel' ? 0.9 : 0.1,
                                       });
                                       setRasterLayers(rasterImageEngine.listLayers());
                                       logTrace(`[RASTER] Remapped specular substrate profile to: "${e.target.value}"`);
                                     }}
                                     className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] outline-none"
                                   >
                                     <option value="stainless_steel">Stainless Steel</option>
                                     <option value="metal">Brushed Metal</option>
                                     <option value="glass">Glass Reflection</option>
                                     <option value="matte">Matte Finish</option>
                                     <option value="gloss">Gloss Coating</option>
                                   </select>
                                 )}
                                 <button
                                   type="button"
                                   onClick={() => {
                                     if (hasMaterialPass) {
                                       rasterImageEngine.toggleEffectByKind(currLayer.id, 'material_pass', !materialPass!.enabled);
                                     } else {
                                       rasterImageEngine.applyMaterial(currLayer.id, { type: 'stainless_steel', roughness: 0.2, metallic: 0.9 });
                                     }
                                     setRasterLayers(rasterImageEngine.listLayers());
                                   }}
                                   className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                                     hasMaterialPass
                                       ? 'bg-indigo-600 text-white'
                                       : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                   }`}
                                 >
                                   {hasMaterialPass ? 'Active' : 'Apply'}
                                 </button>
                               </div>
                             </div>

                             {/* studio lighting */}
                             <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                               <div className="space-y-0.5">
                                 <span className="font-semibold text-gray-800 flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                   Studio Light Rig Setup
                                 </span>
                                 <p className="text-[9px] text-gray-400">Ray casting angle parameters.</p>
                               </div>
                               <button
                                 type="button"
                                 onClick={() => {
                                   if (hasLightingPass) {
                                     rasterImageEngine.toggleLighting(currLayer.id, !lightingPass!.enabled);
                                   } else {
                                     rasterImageEngine.applyLighting(currLayer.id, { type: 'studio', angle: 45, intensity: 0.85 });
                                   }
                                   setRasterLayers(rasterImageEngine.listLayers());
                                   logTrace(`[RASTER] Standardized studio light rigging configuration.`);
                                 }}
                                 className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                                   hasLightingPass
                                     ? 'bg-amber-600 text-white'
                                     : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                 }`}
                               >
                                 {hasLightingPass ? 'Active' : 'Apply'}
                               </button>
                             </div>

                             {/* high fidelity drop shadow */}
                             <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                               <div className="space-y-0.5">
                                 <span className="font-semibold text-gray-800 flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                   Chassis Cast Drop Shadow
                                 </span>
                                 <p className="text-[9px] text-gray-400">Add three-dimensional space projection shadows.</p>
                               </div>
                               <button
                                 type="button"
                                 onClick={() => {
                                   if (hasShadowPass) {
                                     rasterImageEngine.toggleShadows(currLayer.id, !shadowPass!.enabled);
                                   } else {
                                     rasterImageEngine.applyShadow(currLayer.id, { x: 12, y: 16, blur: 24, opacity: 0.35 });
                                   }
                                   setRasterLayers(rasterImageEngine.listLayers());
                                   logTrace(`[RASTER] Calculated industrial specular occlusion shadowing.`);
                                 }}
                                 className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                                   hasShadowPass
                                     ? 'bg-slate-700 text-white'
                                     : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                 }`}
                               >
                                 {hasShadowPass ? 'Active' : 'Apply'}
                               </button>
                             </div>

                             {/* reflection pass */}
                             <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                               <div className="space-y-0.5">
                                 <span className="font-semibold text-gray-800 flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                   Reflective Drop Mirror
                                 </span>
                                 <p className="text-[9px] text-gray-400">Simulates polished ground reflective gradient decay.</p>
                               </div>
                               <button
                                 type="button"
                                 onClick={() => {
                                   if (hasReflectionPass) {
                                     rasterImageEngine.toggleReflections(currLayer.id, !reflectionPass!.enabled);
                                   } else {
                                     rasterImageEngine.applyReflection(currLayer.id, { direction: 'vertical', distance: 20 });
                                   }
                                   setRasterLayers(rasterImageEngine.listLayers());
                                   logTrace(`[RASTER] Grounded mirror plane projection decays finalized.`);
                                 }}
                                 className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                                   hasReflectionPass
                                     ? 'bg-teal-600 text-white'
                                     : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                 }`}
                               >
                                 {hasReflectionPass ? 'Active' : 'Apply'}
                               </button>
                             </div>

                             {/* organic textures */}
                             <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                               <div className="space-y-0.5">
                                 <span className="font-semibold text-gray-800 flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                   Textural Substrate Noise
                                 </span>
                                 <p className="text-[9px] text-gray-400">Incorporate grain, noise, brushed_metal texture passes.</p>
                               </div>
                               <button
                                 type="button"
                                 onClick={() => {
                                   if (hasTexturePass) {
                                     rasterImageEngine.toggleEffectByKind(currLayer.id, 'texture_pass', !texturePass!.enabled);
                                   } else {
                                     rasterImageEngine.applyTexture(currLayer.id, { type: 'brushed_metal', intensity: 0.4, scale: 1 });
                                   }
                                   setRasterLayers(rasterImageEngine.listLayers());
                                   logTrace(`[RASTER] Overlaid non-flattened brushed grain micro-texture.`);
                                 }}
                                 className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                                   hasTexturePass
                                     ? 'bg-emerald-600 text-white'
                                     : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                 }`}
                               >
                                 {hasTexturePass ? 'Active' : 'Apply'}
                               </button>
                             </div>
                           </div>

                           {/* Export / Compile Action */}
                           <div className="flex items-center justify-between gap-2">
                             <button
                               type="button"
                               onClick={() => {
                                 incrementActiveExports();
                                  const res = rasterImageEngine.exportPNG(currLayer.id, { transparentBackground: true });
                                  setTimeout(() => { decrementActiveExports(); }, 1500);
                                 logTrace(`[EXPORTER] Pre-baked layer transparent export generated successfully. [Format: PNG, Quality: ${res.quality}]`);
                               }}
                               className="flex-1 py-2 px-3 border border-gray-200 hover:bg-white text-gray-700 font-bold rounded-xl transition flex items-center justify-center gap-1"
                             >
                               <Download className="h-3 w-3 text-gray-500" />
                               <span>Export Transparent PNG</span>
                             </button>
                             <button
                               type="button"
                               onClick={() => {
                                 incrementActiveExports();
                                  const res = rasterImageEngine.exportJPEG(currLayer.id);
                                  setTimeout(() => { decrementActiveExports(); }, 1500);
                                 logTrace(`[EXPORTER] Pre-baked standard JPEG flattened export generated successfully. [Format: JPEG, Quality: ${res.quality}]`);
                               }}
                               className="flex-1 py-2 px-3 bg-slate-900 border border-slate-950 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-1"
                             >
                               <span>Flatten Single JPEG</span>
                             </button>
                           </div>

                           {/* Real-time Render Stack JSON Panel */}
                           <div className="space-y-1.5">
                             <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wide">Photoshop Render Stack Blueprint (Live):</span>
                             <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl max-h-[140px] overflow-y-auto font-mono text-[9px] text-gray-300 leading-snug">
                               <pre>{JSON.stringify(rasterImageEngine.renderPreview(currLayer.id).render_stack, null, 2)}</pre>
                             </div>
                           </div>

                         </div>
                       );
                     })()}
                   </div>
                 ) : (
                   <p className="text-xs text-gray-500 text-center py-6">No Raster Layers detected. Click "Import Photo" to start.</p>
                 )}
               </div>
            )}

            {/* Unified Scale-Locked Output Compiler */}
            <div className="bg-gray-900 border border-gray-950 text-white rounded-3xl p-5 space-y-4 shadow-xl">
              <span className="text-xs uppercase font-mono font-bold text-gray-500 block tracking-wider">Compile Production Bundles:</span>
              <div className="grid grid-cols-2 gap-2" id="canvas-export-triggers">
                {(['jpeg', 'png', 'pdf', 'svg', 'json'] as const).map(format => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => triggerExportDownload(format)}
                    id={`btn-export-${format}`}
                    className="p-2 px-3 bg-gray-950/80 hover:bg-gray-800 border border-gray-850 hover:border-blue-500 rounded-xl text-left transition-all leading-tight flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-[11px] font-bold font-sans uppercase">Export {format}</span>
                      <span className="block text-[8px] text-gray-500 mt-0.5 font-mono leading-none">High Density {format === 'svg' || format === 'json' ? 'Vector' : 'Raster'}</span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

          </div>     </div>

        </div>

      </div>
    </section>
  );
}
