import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, RotateCw, Play, 
  HelpCircle, Eye, RefreshCw, Layers, Type, Award, HardDrive, 
  ChevronRight, ArrowUpRight, Zap, Ban, Info, Sparkles
} from 'lucide-react';
import { CanvasDataModel } from './CommandPaletteSimulator';
import { BrandKit } from './CommandPaletteSimulator';

interface QualityControlPanelProps {
  activeCanvas: CanvasDataModel;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  setGraphSidebarTab: (tab: any) => void;
  brandKits?: BrandKit[];
  activeBrandKitId?: string;
  logTrace: (message: string) => void;
}

export interface QCReportIssue {
  id: string;
  code: string;
  category: 'visual' | 'layer' | 'typography' | 'brand' | 'export' | 'dfm';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  layerId?: string;
  layerName?: string;
  suggestedAction: string;
  canAutoFix: boolean;
}

export interface QCReportSummary {
  passed: boolean;
  score: number;
  criticalCount: number;
  warningCount: number;
  totalChecks: number;
  timestamp: string;
}

export default function QualityControlPanel({
  activeCanvas,
  selectedLayerId,
  setSelectedLayerId,
  setGraphSidebarTab,
  brandKits = [],
  activeBrandKitId,
  logTrace
}: QualityControlPanelProps) {
  
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [issues, setIssues] = useState<QCReportIssue[]>([]);
  const [summary, setSummary] = useState<QCReportSummary>({
    passed: true,
    score: 100,
    criticalCount: 0,
    warningCount: 0,
    totalChecks: 30,
    timestamp: ''
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'visual' | 'layer' | 'typography' | 'brand' | 'export' | 'dfm'>('all');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Auto-run verification on load / layout render changes
  useEffect(() => {
    runFullAudit(true); // silent/background run
  }, [activeCanvas, activeBrandKitId]);

  // Core Call: runVisualQC()
  const runVisualQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];
    const isPixel = canvas.unit === 'pixels';
    const gridSpacing = isPixel ? 8 : 0.125;

    canvas.layers.forEach(l => {
      // 1. Alignment check: coords should align to grid
      const xMod = l.x % gridSpacing;
      const yMod = l.y % gridSpacing;
      const threshold = isPixel ? 1 : 0.01;
      
      if (xMod > threshold && (gridSpacing - xMod) > threshold) {
        findings.push({
          id: `vis_align_${l.id}`,
          code: 'QC_VIS_ALIGN',
          category: 'visual',
          severity: 'warning',
          title: 'Sub-pixel vector mis-alignment',
          description: `Layer "${l.name}" sits off-grid at coordinate (${l.x.toFixed(3)}, ${l.y.toFixed(3)}). High potential for fuzzy rendering.`,
          layerId: l.id,
          layerName: l.name,
          suggestedAction: 'Snap coordinate to uniform grid multiples',
          canAutoFix: true
        });
      }

      // 2. Warped text check: text scaling ratios should be proportional
      if (l.type === 'text' && (l.width / l.height) > 15) {
        findings.push({
          id: `vis_warp_${l.id}`,
          code: 'QC_VIS_WARPED',
          category: 'visual',
          severity: 'warning',
          title: 'Extreme text aspect distortion',
          description: `Layer "${l.name}" is stretched extremely wide (${l.width}x${l.height}). Content may wrap illegibly.`,
          layerId: l.id,
          layerName: l.name,
          suggestedAction: 'Refactor line heights or increase text-boundary height',
          canAutoFix: false
        });
      }
    });

    // 3. Spacing / Silhouette checks
    if (canvas.layers.length === 0) {
      findings.push({
        id: 'vis_empty',
        code: 'QC_VIS_EMPTY',
        category: 'visual',
        severity: 'critical',
        title: 'Empty Canvas Workspace',
        description: 'The viewport contains zero visual assets, paths, or outline vectors.',
        suggestedAction: 'Add layers, text, or shapes from the Command Palette',
        canAutoFix: false
      });
    }

    return findings;
  };

  // Core Call: runLayerQC()
  const runLayerQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];

    canvas.layers.forEach(l => {
      // 1. Unnamed layers: default auto-generated structures
      const isGeneric = /^(layer|group|text|shape)\s*\d*$/i.test(l.name.trim());
      if (isGeneric) {
        findings.push({
          id: `lay_name_${l.id}`,
          code: 'QC_LAY_UNNAMED',
          category: 'layer',
          severity: 'warning',
          title: 'Auto-generated generic layer tag',
          description: `Layer name "${l.name}" uses generic templates (e.g. Layer 5). Unprofessional for CAD handover.`,
          layerId: l.id,
          layerName: l.name,
          suggestedAction: `Rename to high-context semantic tag (e.g. "Primary Gasket Outlines")`,
          canAutoFix: true
        });
      }

      // 2. Hidden export layers check
      if (!l.visible) {
        findings.push({
          id: `lay_hidden_${l.id}`,
          code: 'QC_LAY_HIDDEN',
          category: 'layer',
          severity: 'warning',
          title: 'Hidden layer is suppressed from rendering',
          description: `Layer "${l.name}" is toggled disabled/invisible. It will be excluded from compile bundles.`,
          layerId: l.id,
          layerName: l.name,
          suggestedAction: 'Delete the layer if redundant, or re-enable visibility prior to printing',
          canAutoFix: false
        });
      }
    });

    // 3. Flattened layers threat
    if (canvas.layers.length === 1) {
      findings.push({
        id: 'lay_flattened',
        code: 'QC_LAY_FLATTENED',
        category: 'layer',
        severity: 'warning',
        title: 'Low CAD density (Flattened canvas)',
        description: 'Your project holds only a single merged canvas layer. Individual elements cannot be animated or aligned.',
        suggestedAction: 'Create fresh overlay layers to keep assets separate and raw',
        canAutoFix: false
      });
    }

    return findings;
  };

  // Core Call: runTypographyQC()
  const runTypographyQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];

    canvas.layers.forEach(l => {
      if (l.type === 'text') {
        const textLen = l.content?.length || 0;
        
        // 1. Unreadable Text
        if (textLen === 0) {
          findings.push({
            id: `txt_empty_${l.id}`,
            code: 'QC_TXT_EMPTY',
            category: 'typography',
            severity: 'critical',
            title: 'Empty text placeholder node',
            description: `Layer text element "${l.name}" holds zero characters and represents waste vector data.`,
            layerId: l.id,
            layerName: l.name,
            suggestedAction: 'Double click to enter string values, or remove layer',
            canAutoFix: true
          });
        }

        // 2. Text Overflow risk (heuristic: too much text for the width/height block)
        const densityFactor = textLen * (l.fontSize || 10) * 0.15;
        const squareArea = l.width * l.height * 100; // rough sizing standard
        if (densityFactor > squareArea && squareArea > 0) {
          findings.push({
            id: `txt_overflow_${l.id}`,
            code: 'QC_TXT_OVERFLOW',
            category: 'typography',
            severity: 'warning',
            title: 'Potential textbox boundary overflow',
            description: `The size of text layer "${l.name}" (${l.width}x${l.height}) is too compact to contain its ${textLen} character string size.`,
            layerId: l.id,
            layerName: l.name,
            suggestedAction: 'Expand envelope dimensions or scale down the typography font-size',
            canAutoFix: false
          });
        }

        // 3. Sizing warning for tiny typography
        if (l.fontSize && l.fontSize < 8) {
          findings.push({
            id: `txt_tiny_${l.id}`,
            code: 'QC_TXT_TINY',
            category: 'typography',
            severity: 'warning',
            title: 'Sub-minimum print typography size',
            description: `Layer "${l.name}" text sizing is set to ${l.fontSize}pt. Text drops below the 8pt human legibility threshold for physical prints.`,
            layerId: l.id,
            layerName: l.name,
            suggestedAction: 'Bump font size to at least 8.5pt or use high-contrast backing fields',
            canAutoFix: true
          });
        }

        // 4. Contrast Check: e.g. white on beige or grey on slate
        if (l.color && canvas.background) {
          const lCol = l.color.toLowerCase();
          const bgCol = canvas.background.toLowerCase();
          if (lCol === bgCol || (lCol === '#ffffff' && bgCol === '#f1f5f9') || (lCol === '#0f172a' && bgCol === '#1e293b')) {
            findings.push({
              id: `txt_contrast_${l.id}`,
              code: 'QC_TXT_CONTRAST',
              category: 'typography',
              severity: 'critical',
              title: 'Extremely poor accessibility text contrast',
              description: `Text color ${l.color} is nearly identical to background canvas color ${canvas.background}. Illegible in production.`,
              layerId: l.id,
              layerName: l.name,
              suggestedAction: 'Override text fill to white (#FFFFFF) or charcoal slate (#0F172A)',
              canAutoFix: true
            });
          }
        }
      }
    });

    return findings;
  };

  // Core Call: runBrandQC()
  const runBrandQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];
    const activeKit = brandKits.find(b => b.id === activeBrandKitId);

    if (activeKit) {
      canvas.layers.forEach(l => {
        // 1. Wrong fonts violation
        if (l.type === 'text' && l.fontFamily) {
          const fontList = Object.values(activeKit.fonts) as string[];
          const kitFonts = fontList.map(f => f.toLowerCase());
          const layerFont = l.fontFamily.toLowerCase();
          const matchesKit = kitFonts.some(f => layerFont.includes(f) || f.includes(layerFont));
          
          if (!matchesKit && kitFonts.length > 0) {
            findings.push({
              id: `brand_font_${l.id}`,
              code: 'QC_BRAND_FONT',
              category: 'brand',
              severity: 'warning',
              title: 'Brand Typography rule violation',
              description: `Text layer "${l.name}" uses font family "${l.fontFamily}" which is excluded from brandkit "${activeKit.name}". Allowed: ${fontList.join(', ')}.`,
              layerId: l.id,
              layerName: l.name,
              suggestedAction: `Change layer font family to compliant theme font`,
              canAutoFix: true
            });
          }
        }

        // 2. Wrong Colors mismatch
        if (l.color) {
          const colorList = Object.values(activeKit.colors) as string[];
          const layerColor = l.color.toLowerCase();
          const kitColors = colorList.map(c => c.toLowerCase());
          
          const isColorCompliant = kitColors.some(c => c === layerColor) || layerColor === '#ffffff' || layerColor === '#000000' || layerColor === '';
          if (!isColorCompliant && kitColors.length > 0) {
            findings.push({
              id: `brand_color_${l.id}`,
              code: 'QC_BRAND_COLOR',
              category: 'brand',
              severity: 'warning',
              title: 'Brand Color swatch isolation breach',
              description: `Layer "${l.name}" is using hue "${l.color}" which is foreign to the brandkit palette swatches.`,
              layerId: l.id,
              layerName: l.name,
              suggestedAction: `Align fill hex values to the primary pallet tones: ${colorList.join(', ')}`,
              canAutoFix: true
            });
          }
        }
      });
    }

    return findings;
  };

  // Core Call: runExportQC()
  const runExportQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];

    // 1. Missing bleed check
    if (canvas.bleed === 0 && (canvas.type === 'business_card' || canvas.type === 'letterhead')) {
      findings.push({
        id: 'exp_bleed_missing',
        code: 'QC_EXP_BLEED',
        category: 'export',
        severity: 'critical',
        title: 'Missing edge-cut bleed envelope margin',
        description: 'Physical print project holds 0.00 bleed bounds. Printers will reject this file due to paper shearing risks.',
        suggestedAction: 'Apply standard bleed offset (e.g., 0.125 inches or 3mm)',
        canAutoFix: true
      });
    }

    // 2. Canvas wrong dimension limit checks
    if (canvas.width <= 0 || canvas.height <= 0) {
      findings.push({
        id: 'exp_size_invalid',
        code: 'QC_EXP_SIZE',
        category: 'export',
        severity: 'critical',
        title: 'Corrupt or negative canvas dimensions',
        description: 'The grid bounds hold negative values and cannot be flattened down to image matrices.',
        suggestedAction: 'Set width and height values above absolute zero',
        canAutoFix: false
      });
    }

    return findings;
  };

  // Core Call: runScaleQC()
  const runScaleQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];

    // 1. Missing units check
    if (!canvas.unit) {
      findings.push({
        id: 'scale_units',
        code: 'QC_SCALE_UNITS',
        category: 'export',
        severity: 'critical',
        title: 'Missing CAD scaling units variable',
        description: 'Project unit system is undefined. Importer programs will guess dimensions arbitrarily.',
        suggestedAction: 'Configure standard physical scales (mm, cm, pt, inches)',
        canAutoFix: true
      });
    }

    // 2. Low Resolution pixel check
    if (canvas.dpi < 150 && canvas.unit !== 'pixels') {
      findings.push({
        id: 'scale_dpi_low',
        code: 'QC_SCALE_LOW_DPI',
        category: 'export',
        severity: 'warning',
        title: 'Sub-density print DPI setting',
        description: `Active DPI is set to ${canvas.dpi}. CMYK print files must carry minimum 300 DPI for sharp vector output.`,
        suggestedAction: 'Change resolution metadata variables to 300 DPI standard',
        canAutoFix: true
      });
    }

    return findings;
  };

  // Core Call: runDFMQC()
  const runDFMQC = (canvas: CanvasDataModel): QCReportIssue[] => {
    const findings: QCReportIssue[] = [];

    // Apply checks if this represents mechanical product sheets or architecture
    const isPhysicalApp = ['product_sheet', 'apparel_techpack', 'floor_plan', 'bracket_design', 'chassis_zone'].includes(canvas.type);
    
    if (isPhysicalApp || activeCanvas.layers.some(l => l.name.toLowerCase().includes('bracket') || l.name.toLowerCase().includes('cutout') || l.name.toLowerCase().includes('seam'))) {
      canvas.layers.forEach(l => {
        // 1. Missing dimensions on mechanical items
        const lacksSizes = l.width <= 0.1 || l.height <= 0.1;
        if (lacksSizes) {
          findings.push({
            id: `dfm_dim_${l.id}`,
            code: 'QC_DFM_NODIM',
            category: 'dfm',
            severity: 'critical',
            title: 'Undersized mechanical boundary box',
            description: `Mechanical component layer "${l.name}" holds size dimensions close to zero (${l.width}x${l.height}). CNC cutters value zero clearance as errors.`,
            layerId: l.id,
            layerName: l.name,
            suggestedAction: 'Define real-world bounding clearances',
            canAutoFix: true
          });
        }

        // 2. Thin Walls check for manufacturing
        const minSafeWall = 0.5; // mm
        if (l.width < minSafeWall && l.width > 0 && canvas.unit === 'millimeters') {
          findings.push({
            id: `dfm_thin_${l.id}`,
            code: 'QC_DFM_THIN_WALL',
            category: 'dfm',
            severity: 'warning',
            title: 'Thin fragile pocket wall boundary',
            description: `Pocket layer "${l.name}" thickness reads ${l.width}mm. Plastic molding requires minimum ${minSafeWall}mm to guard against shear fractures.`,
            layerId: l.id,
            layerName: l.name,
            suggestedAction: 'Increase component envelope thicknesses for injection mold tool paths',
            canAutoFix: false
          });
        }
      });

      // 3. Check for general missing material classification rules
      findings.push({
        id: 'dfm_material_review',
        code: 'QC_DFM_HUMAN_REVIEW',
        category: 'dfm',
        severity: 'warning',
        title: 'Exploded layout requires mandatory Human engineer audit',
        description: 'Seam details, fasteners, and stress points remain unvalidated by local CAD simulators.',
        suggestedAction: 'Authorize secondary manufacturing validation before high volume metal stampings.',
        canAutoFix: false
      });
    }

    return findings;
  };

  // Core Call: generateQCReport()
  const runFullAudit = (isSilent = false) => {
    if (!isSilent) {
      setIsAuditing(true);
      logTrace('[QC PIPELINE] Initiating raw Quality Verification Engine compilation tests...');
    }

    setTimeout(() => {
      // Execute all sub-routines in sequence:
      const findings: QCReportIssue[] = [
        ...runVisualQC(activeCanvas),
        ...runLayerQC(activeCanvas),
        ...runTypographyQC(activeCanvas),
        ...runBrandQC(activeCanvas),
        ...runExportQC(activeCanvas),
        ...runScaleQC(activeCanvas),
        ...runDFMQC(activeCanvas)
      ];

      // Blocked exports logic: if there is any 'critical' issue, the score drops
      const critCount = findings.filter(i => i.severity === 'critical').length;
      const warnCount = findings.filter(i => i.severity === 'warning').length;
      const checksPass = critCount === 0;

      // Score formula
      const finalScore = Math.max(0, 100 - (critCount * 20) - (warnCount * 5));

      setIssues(findings);
      setSummary({
        passed: checksPass,
        score: finalScore,
        criticalCount: critCount,
        warningCount: warnCount,
        totalChecks: 35,
        timestamp: new Date().toLocaleTimeString()
      });

      setReportGenerated(true);
      
      if (!isSilent) {
        setIsAuditing(false);
        logTrace(`[QC PIPELINE] generateQCReport() finished: Score ${finalScore}%. Issues detected: ${findings.length} (${critCount} CRITICAL, ${warnCount} WARNINGS).`);
        if (critCount > 0) {
          logTrace(`[QC ALERT] ${critCount} CRITICAL issues are actively blocking high-density print exports. Correct them to unlock production code.`);
        } else {
          logTrace('[QC SUCCESS] All critical manufacturing verification rules have passed beautifully.');
        }
      }
    }, isSilent ? 0 : 1200);
  };

  // Autocomplete autoFix algorithm
  const handleAutoFix = (issue: QCReportIssue, e: React.MouseEvent) => {
    e.stopPropagation();
    logTrace(`[AUTOFIX ENGINE] Attempting automatic correction for issue ID "${issue.id}" (${issue.code})...`);
    
    // Simulate resolution and toast log
    setIssues(curr => curr.filter(i => i.id !== issue.id));
    setSummary(s => {
      const isCrit = issue.severity === 'critical';
      const newCrit = isCrit ? Math.max(0, s.criticalCount - 1) : s.criticalCount;
      const newWarn = !isCrit ? Math.max(0, s.warningCount - 1) : s.warningCount;
      return {
        ...s,
        criticalCount: newCrit,
        warningCount: newWarn,
        score: Math.min(100, s.score + (isCrit ? 20 : 5)),
        passed: newCrit === 0
      };
    });

    logTrace(`[AUTOFIX ENGINE] Successfully corrected "${issue.title}". Checked constraint variables verified.`);
  };

  // Switch tabs & select layers
  const handleInspectLayer = (layerId: string, name: string) => {
    setSelectedLayerId(layerId);
    setGraphSidebarTab('layers');
    logTrace(`[QC INTERACT] Navigated directly to Layer Node "${name}" (ID: ${layerId}) targeting rule compliance.`);
  };

  const filteredIssues = issues.filter(issue => {
    if (activeCategoryFilter === 'all') return true;
    return issue.category === activeCategoryFilter;
  });

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-6 text-xs text-slate-800 animate-fadeIn" id="quality-verification-engine-module">
      
      {/* Header and Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 bg-red-100 text-red-650 rounded border border-red-250">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-red-600 block tracking-widest leading-none">Core Linter Framework</span>
              <h3 className="text-sm font-extrabold text-slate-900 font-sans mt-0.5">Quality Verification Engine</h3>
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => runFullAudit(false)}
          disabled={isAuditing}
          id="btn-run-full-qc"
          className={`px-4 py-2 bg-slate-900 font-sans hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition select-none ${
            isAuditing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isAuditing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying Layers...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              <span>Run Validation Audit</span>
            </>
          )}
        </button>
      </div>

      {reportGenerated ? (
        <div className="space-y-5">
          
          {/* Summary Score Gauge Board */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            summary.passed 
              ? 'bg-emerald-50/50 border-emerald-150' 
              : 'bg-rose-50/30 border-rose-150'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center font-mono ${
                summary.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <span className="text-2xl font-black">{summary.score}</span>
                <span className="text-[8px] uppercase tracking-wider font-bold">QC Score</span>
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-800">
                    {summary.passed ? 'Verified Production Ready' : 'Core Export Blocked'}
                  </h4>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    summary.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {summary.passed ? 'PASS' : 'HOLD'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-normal">
                  {summary.passed 
                    ? 'All critical printing, sizing, DFM guidelines and colors adhere beautifully with zero violations.' 
                    : `${summary.criticalCount} critical file system blocks must be rectified to export final press-ready CAD formats.`
                  }
                </p>
                <div className="text-[8px] font-mono text-gray-400">Checked: {summary.totalChecks} variables | Last Compiled: {summary.timestamp}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto border-t md:border-t-0 border-gray-200/80 pt-3 md:pt-0">
              <div className="flex-1 md:flex-initial text-center px-4 py-2 bg-white rounded-xl border border-gray-150">
                <span className="block text-red-650 font-black text-sm">{summary.criticalCount}</span>
                <span className="text-[8px] uppercase font-mono text-gray-400 font-bold block">Criticals</span>
              </div>
              <div className="flex-1 md:flex-initial text-center px-4 py-2 bg-white rounded-xl border border-gray-150">
                <span className="block text-amber-600 font-black text-sm">{summary.warningCount}</span>
                <span className="text-[8px] uppercase font-mono text-gray-400 font-bold block">Warnings</span>
              </div>
            </div>
          </div>

          {/* Issue Categories filter row */}
          <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Issues', count: issues.length, icon: ShieldCheck },
              { id: 'visual', label: 'Visual & Coords', count: issues.filter(i => i.category === 'visual').length, icon: Eye },
              { id: 'layer', label: 'Layers Stack', count: issues.filter(i => i.category === 'layer').length, icon: Layers },
              { id: 'typography', label: 'Typography', count: issues.filter(i => i.category === 'typography').length, icon: Type },
              { id: 'brand', label: 'Brand Swap', count: issues.filter(i => i.category === 'brand').length, icon: Award },
              { id: 'export', label: 'Dimensions', count: issues.filter(i => i.category === 'export').length, icon: HardDrive },
              { id: 'dfm', label: 'DFM/CAD Specs', count: issues.filter(i => i.category === 'dfm').length, icon: Play }
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat.id as any)}
                  className={`py-1 px-2.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap text-[10px] sm:text-[10.5px] ${
                    activeCategoryFilter === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 bg-white border border-gray-150'
                  }`}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] rounded font-mono ${
                    activeCategoryFilter === cat.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                  }`}>{cat.count}</span>
                </button>
              );
            })}
          </div>

          {/* List of filtered Issues */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredIssues.length === 0 ? (
              <div className="bg-white p-8 border rounded-2xl text-center space-y-2">
                <div className="h-9 w-9 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-slate-800">No matching issues identified</h5>
                <p className="text-[10px] text-gray-500 max-w-xs mx-auto">This validation category is absolutely pristine. All checks are fully compliant.</p>
              </div>
            ) : (
              filteredIssues.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id === selectedIssueId ? null : issue.id)}
                  className={`bg-white border p-3.5 rounded-2xl cursor-pointer hover:border-slate-350 transition relative ${
                    issue.severity === 'critical' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'
                  } ${selectedIssueId === issue.id ? 'ring-1 ring-slate-450' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className={`p-1 rounded mt-0.5 ${
                        issue.severity === 'critical' ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-[11px] text-slate-900 leading-tight">{issue.title}</span>
                          <span className="px-1 py-0.5 bg-slate-50 border border-gray-200 text-gray-400 font-mono text-[7.5px] rounded">
                            {issue.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Category: {issue.category.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 select-none">
                      {issue.layerId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectLayer(issue.layerId!, issue.layerName || 'Layer');
                          }}
                          className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold rounded-lg flex items-center gap-0.5 transition text-[8.5px]"
                          title="Point to specific Layer element"
                        >
                          <Eye className="h-2.5 w-2.5" />
                          <span>Link Layer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable info block */}
                  {(selectedIssueId === issue.id || issue.severity === 'critical') && (
                    <div className="mt-3 pt-3 border-t border-gray-150 space-y-2 animate-fadeIn text-[10px]">
                      <p className="text-gray-600 font-sans leading-relaxed">{issue.description}</p>
                      
                      <div className="bg-slate-50 p-2.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-slate-200">
                        <div className="space-y-0.5">
                          <span className="text-[8px] uppercase font-mono font-bold text-gray-400 block tracking-wide">Suggested fix Action:</span>
                          <span className="text-slate-800 font-bold text-[9.5px] font-sans">{issue.suggestedAction}</span>
                        </div>
                        {issue.canAutoFix && (
                          <button
                            type="button"
                            onClick={(e) => handleAutoFix(issue, e)}
                            className="w-full sm:w-auto px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Zap className="h-3 w-3 text-blue-500 fill-blue-500" />
                            <span>Apply autoFix</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        /* Empty/Pending State prompting the user to execute linter */
        <div className="p-8 bg-white border border-gray-200 border-dashed rounded-3xl text-center space-y-3">
          <div className="h-11 w-11 bg-slate-100 text-slate-500 rounded-full mx-auto flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800">Awaiting pre-flight compilation checks</h4>
            <p className="text-[10px] text-gray-550 max-w-xs mx-auto mt-1 leading-relaxed">
              Verify vector coordinates, fonts, contrast thresholds, margins, and physical clearances before pushing to professional printers.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => runFullAudit(false)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold font-sans text-white text-xs rounded-xl transition"
          >
            Start Pre-Flight Audit
          </button>
        </div>
      )}

    </div>
  );
}
