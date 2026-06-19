/* ============================================================
   VisualOS Layout and Print Engine
   Module Name: Layout Engine
   Purpose: Handle Quark/InDesign-style layout for print, presentation, or documents.
   ============================================================ */

export type LayoutUnit = "pixels" | "inches" | "millimeters";
export type LayoutColorMode = "RGB" | "CMYK";
export type LayoutType =
  | "business_card"
  | "letterhead"
  | "one_page_flyer"
  | "poster"
  | "brand_board"
  | "product_sheet"
  | "pitch_deck_slide"
  | "tech_pack_page"
  | "architecture_sheet"
  | "dfm_sheet";

export interface LayoutMarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface LayoutColumnSettings {
  count: number;
  gutter: number;
}

export interface LayoutGridSettings {
  enabled: boolean;
  size: number;
  snap: boolean;
}

export interface LayoutBlock {
  id: string;
  type: "text" | "image" | "vector";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string; // Holds actual text, image source, or shape path
  overflowing?: boolean; // True if content exceeds the block bounds
  data: Record<string, any>; // Padding, font size, margins, line height etc.
}

export interface LayoutModel {
  layout_id: string;
  name: string;
  type: LayoutType;
  width: number;
  height: number;
  unit: LayoutUnit;
  dpi: number;
  color_mode: LayoutColorMode;
  bleed: number;
  safe_zone: number;
  margins: LayoutMarginSettings;
  columns: LayoutColumnSettings;
  trim_marks: boolean;
  grid: LayoutGridSettings;
  master_page_id: string | null;
  blocks: LayoutBlock[];
  created_at: string;
  updated_at: string;
}

export interface CreateLayoutInput {
  name?: string;
  type?: LayoutType;
  width?: number;
  height?: number;
  unit?: LayoutUnit;
  dpi?: number;
  color_mode?: LayoutColorMode;
  bleed?: number;
  safe_zone?: number;
  background?: string;
}

export interface LayoutPreset {
  name: string;
  type: LayoutType;
  width: number;
  height: number;
  unit: LayoutUnit;
  dpi: number;
  color_mode: LayoutColorMode;
  bleed: number;
  safe_zone: number;
  margins: LayoutMarginSettings;
  columns: LayoutColumnSettings;
}

/* ============================================================
   Presets Registry (Quark/InDesign Standards)
   ============================================================ */

export const LAYOUT_PRESETS: Record<LayoutType, LayoutPreset> = {
  business_card: {
    name: "Standard US Business Card",
    type: "business_card",
    width: 3.5,
    height: 2.0,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.125,
    safe_zone: 0.125,
    margins: { top: 0.125, bottom: 0.125, left: 0.125, right: 0.125 },
    columns: { count: 1, gutter: 0 },
  },
  letterhead: {
    name: "Corporate Letterhead Standard",
    type: "letterhead",
    width: 8.5,
    height: 11.0,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.125,
    safe_zone: 0.25,
    margins: { top: 0.75, bottom: 0.75, left: 0.75, right: 0.75 },
    columns: { count: 1, gutter: 0 },
  },
  one_page_flyer: {
    name: "Standard Marketing Flyer",
    type: "one_page_flyer",
    width: 8.5,
    height: 11.0,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.125,
    safe_zone: 0.25,
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    columns: { count: 2, gutter: 0.25 },
  },
  poster: {
    name: "Medium Cinematic Poster",
    type: "poster",
    width: 18.0,
    height: 24.0,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.25,
    safe_zone: 0.5,
    margins: { top: 1.0, bottom: 1.0, left: 1.0, right: 1.0 },
    columns: { count: 3, gutter: 0.5 },
  },
  brand_board: {
    name: "Landscape Brand Identity Board",
    type: "brand_board",
    width: 1920,
    height: 1080,
    unit: "pixels",
    dpi: 150,
    color_mode: "RGB",
    bleed: 0,
    safe_zone: 40,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    columns: { count: 4, gutter: 24 },
  },
  product_sheet: {
    name: "Technical Product Specification Sheet",
    type: "product_sheet",
    width: 8.5,
    height: 11.0,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.125,
    safe_zone: 0.25,
    margins: { top: 0.6, bottom: 0.6, left: 0.6, right: 0.6 },
    columns: { count: 3, gutter: 0.2 },
  },
  pitch_deck_slide: {
    name: "Corporate Presentation Slide",
    type: "pitch_deck_slide",
    width: 1920,
    height: 1080,
    unit: "pixels",
    dpi: 150,
    color_mode: "RGB",
    bleed: 0,
    safe_zone: 64,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    columns: { count: 3, gutter: 32 },
  },
  tech_pack_page: {
    name: "Fashion Manufacturing Tech Pack Page",
    type: "tech_pack_page",
    width: 11.0,
    height: 8.5,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.125,
    safe_zone: 0.375,
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    columns: { count: 4, gutter: 0.25 },
  },
  architecture_sheet: {
    name: "Scaled Architect Blueprint Layout",
    type: "architecture_sheet",
    width: 36.0,
    height: 24.0,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.5,
    safe_zone: 1.0,
    margins: { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 },
    columns: { count: 5, gutter: 0.5 },
  },
  dfm_sheet: {
    name: "Design for Manufacturing Audit sheet",
    type: "dfm_sheet",
    width: 11.0,
    height: 8.5,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    bleed: 0.125,
    safe_zone: 0.375,
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    columns: { count: 3, gutter: 0.3 },
  },
};

/* ============================================================
   Helper Functions
   ============================================================ */

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Advanced text overflow analysis
 * Estimates overflow based on line-wrapping math:
 * - Char limit per line is ~ (width of block - padding) / (fontSize * characterAspectRatio)
 * - Maximum lines supported = height of block / lineHeight
 * - Returns true if actual lines required exceeds maximum lines supported
 */
export function checkTextOverflow(block: LayoutBlock): boolean {
  if (block.type !== "text") return false;

  const text = block.content || "";
  const fontSize = block.data.fontSize || 12; // in pt
  const lineHeight = block.data.lineHeight || fontSize * 1.25;
  const padding = block.data.padding || 8; 

  const usableWidth = Math.max(10, block.width - padding * 2);
  const usableHeight = Math.max(10, block.height - padding * 2);

  // Approximate character width in pixels/points: usually ~0.55 of fontSize for regular fonts
  const averageCharWidth = fontSize * 0.52;
  const maxCharsPerLine = Math.floor(usableWidth / averageCharWidth);

  // Dynamic wrapping logic splitting on words
  const words = text.split(" ");
  let currentLineLength = 0;
  let estimatedLinesCount = 1;

  for (const word of words) {
    if (word.length > maxCharsPerLine) {
      estimatedLinesCount += Math.ceil(word.length / maxCharsPerLine);
      currentLineLength = 0;
    } else if (currentLineLength + word.length + (currentLineLength > 0 ? 1 : 0) > maxCharsPerLine) {
      estimatedLinesCount++;
      currentLineLength = word.length;
    } else {
      currentLineLength += word.length + (currentLineLength > 0 ? 1 : 0);
    }
  }

  const maxAllowedLines = Math.floor(usableHeight / lineHeight);
  return estimatedLinesCount > maxAllowedLines;
}

/* ============================================================
   Layout and Print Engine Class
   ============================================================ */

export class LayoutEngine {
  private layouts: Map<string, LayoutModel>;
  private masterPages: Map<string, LayoutBlock[]>; // Stores templates by masterPageId

  constructor() {
    this.layouts = new Map();
    this.masterPages = new Map();
    this.initDefaultMasterPages();
  }

  private initDefaultMasterPages() {
    // Instantiate some cool master pages templates (Header, Footer pagination, stamp frames)
    this.masterPages.set("print_standard", [
      {
        id: "master_header",
        type: "text",
        x: 0,
        y: 0,
        width: 100, // percentage or scaled
        height: 40,
        content: "VISUALOS DIGITAL SYSTEM RECORD // VERIFIED INGRESS MASTER PANEL",
        data: { fontSize: 8, fill: "#94a3b8", fontStyle: "italic" },
      },
      {
        id: "master_footer",
        type: "text",
        x: 0,
        y: 95,
        width: 100,
        height: 20,
        content: "Page 1 of 1 // CLASSIFICATION: CONFIDENTIAL DESIGN DRAFT",
        data: { fontSize: 8, fill: "#94a3b8", align: "center" },
      },
    ]);
  }

  createLayout(input: CreateLayoutInput = {}): LayoutModel {
    const type = input.type ?? "blank" as any;
    const preset = LAYOUT_PRESETS[type as LayoutType] ?? LAYOUT_PRESETS.one_page_flyer;

    const layout: LayoutModel = {
      layout_id: createId("layout"),
      name: input.name ?? `Layout: ${preset.name}`,
      type: preset.type,
      width: input.width ?? preset.width,
      height: input.height ?? preset.height,
      unit: input.unit ?? preset.unit,
      dpi: input.dpi ?? preset.dpi,
      color_mode: input.color_mode ?? preset.color_mode,
      bleed: input.bleed ?? preset.bleed,
      safe_zone: input.safe_zone ?? preset.safe_zone,
      margins: preset.margins,
      columns: preset.columns,
      trim_marks: true,
      grid: {
        enabled: true,
        size: preset.unit === "pixels" ? 20 : 0.25,
        snap: true,
      },
      master_page_id: null,
      blocks: [],
      created_at: now(),
      updated_at: now(),
    };

    this.layouts.set(layout.layout_id, layout);
    return clone(layout);
  }

  getLayout(layoutId: string): LayoutModel {
    const layout = this.layouts.get(layoutId);
    if (!layout) {
      throw new Error(`Layout with ID ${layoutId} not found.`);
    }
    return clone(layout);
  }

  updateLayout(layoutId: string, updates: Partial<LayoutModel>): LayoutModel {
    const layout = this.layouts.get(layoutId);
    if (!layout) throw new Error(`Layout with ID ${layoutId} not found.`);

    const updated: LayoutModel = {
      ...layout,
      ...updates,
      layout_id: layout.layout_id,
      updated_at: now(),
    };

    this.layouts.set(layoutId, updated);
    return clone(updated);
  }

  setMargins(layoutId: string, margins: LayoutMarginSettings): LayoutModel {
    return this.updateLayout(layoutId, { margins });
  }

  setColumns(layoutId: string, columns: LayoutColumnSettings): LayoutModel {
    return this.updateLayout(layoutId, { columns });
  }

  setBleed(layoutId: string, bleed: number): LayoutModel {
    if (bleed < 0) throw new Error("Bleed cannot be a negative value.");
    return this.updateLayout(layoutId, { bleed });
  }

  setTrimMarks(layoutId: string, show: boolean): LayoutModel {
    return this.updateLayout(layoutId, { trim_marks: show });
  }

  placeTextBlock(
    layoutId: string,
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    extraData: Record<string, any> = {}
  ): LayoutModel {
    const layout = this.getLayout(layoutId);
    const fontSize = extraData.fontSize || 12;

    const block: LayoutBlock = {
      id: createId("block_txt"),
      type: "text",
      x,
      y,
      width,
      height,
      content: text,
      data: {
        fontSize,
        lineHeight: extraData.lineHeight || fontSize * 1.25,
        padding: extraData.padding || 8,
        fill: extraData.fill || "#1e293b",
        fontFamily: extraData.fontFamily || "Inter",
        align: extraData.align || "left",
      },
    };

    block.overflowing = checkTextOverflow(block);

    return this.updateLayout(layoutId, {
      blocks: [...layout.blocks, block],
    });
  }

  placeImageBlock(
    layoutId: string,
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
    extraData: Record<string, any> = {}
  ): LayoutModel {
    const layout = this.getLayout(layoutId);

    const block: LayoutBlock = {
      id: createId("block_img"),
      type: "image",
      x,
      y,
      width,
      height,
      content: src,
      data: {
        objectFit: extraData.objectFit || "cover",
        opacity: extraData.opacity ?? 1,
        caption: extraData.caption || "",
        aspectRatioLock: extraData.aspectRatioLock ?? true,
      },
    };

    return this.updateLayout(layoutId, {
      blocks: [...layout.blocks, block],
    });
  }

  alignToGrid(layoutId: string, blockId: string): LayoutModel {
    const layout = this.getLayout(layoutId);
    const gridSize = layout.grid.size;

    const blocks = layout.blocks.map((block) => {
      if (block.id !== blockId) return block;

      const snappedX = Math.round(block.x / gridSize) * gridSize;
      const snappedY = Math.round(block.y / gridSize) * gridSize;
      const snappedW = Math.round(block.width / gridSize) * gridSize;
      const snappedH = Math.round(block.height / gridSize) * gridSize;

      const updated = {
        ...block,
        x: snappedX,
        y: snappedY,
        width: snappedW > 0 ? snappedW : gridSize,
        height: snappedH > 0 ? snappedH : gridSize,
      };

      updated.overflowing = checkTextOverflow(updated);
      return updated;
    });

    return this.updateLayout(layoutId, { blocks });
  }

  createMasterPage(layoutId: string, masterPageId: string): LayoutModel {
    // Registers a layout templates state and updates the active canvas binding key
    const layout = this.getLayout(layoutId);

    // Grab blocks of the layout to act as master elements
    this.masterPages.set(masterPageId, clone(layout.blocks));

    return this.updateLayout(layoutId, {
      master_page_id: masterPageId,
    });
  }

  exportPrintPDF(layoutId: string): { svg: string; properties: any; base64Json: string } {
    const layout = this.getLayout(layoutId);

    // Draw printable layout view mirroring Quark/InDesign outputs:
    // This draws:
    // - Physical bounding box with active scale parameters
    // - High contrast bleed outlines (red)
    // - Content limit safe-zone bounds (blue)
    // - Mechanical Trim Marks on corner edges (standard print setup)
    // - Page margins limits
    // - Multicolumn partition guide grids
    // - Visual warning banners if text blocks overflows!

    const bleedOffset = layout.bleed;
    const canvasW = layout.width;
    const canvasH = layout.height;
    
    // Scale representation to pixels for reasonable web display (using 96 DPI representation)
    const factor = layout.unit === "inches" ? 120 : layout.unit === "millimeters" ? 120 / 25.4 : 0.5;
    
    const svgW = (canvasW + bleedOffset * 2) * factor;
    const svgH = (canvasH + bleedOffset * 2) * factor;
    const bleedPx = bleedOffset * factor;

    // Build crop trim marks path representations (8 marks matching traditional printer lines)
    const trimLinesLength = 30;
    const trimOffset = 8;
    const trimStroke = `#bfdbfe`;

    const cropMarksMarkup = layout.trim_marks
      ? `
    <!-- Quark/InDesign Style Trim/Crop Marks -->
    <!-- Top-Left Vertical Mark -->
    <line x1="${bleedPx - trimOffset}" y1="${bleedPx - trimLinesLength}" x2="${bleedPx - trimOffset}" y2="${bleedPx}" stroke="${trimStroke}" stroke-width="1.5" />
    <!-- Top-Left Horizontal Mark -->
    <line x1="${bleedPx - trimLinesLength}" y1="${bleedPx - trimOffset}" x2="${bleedPx}" y2="${bleedPx - trimOffset}" stroke="${trimStroke}" stroke-width="1.5" />
    
    <!-- Top-Right Vertical Mark -->
    <line x1="${svgW - bleedPx + trimOffset}" y1="${bleedPx - trimLinesLength}" x2="${svgW - bleedPx + trimOffset}" y2="${bleedPx}" stroke="${trimStroke}" stroke-width="1.5" />
    <!-- Top-Right Horizontal Mark -->
    <line x1="${svgW - bleedPx}" y1="${bleedPx - trimOffset}" x2="${svgW - bleedPx + trimLinesLength}" y2="${bleedPx - trimOffset}" stroke="${trimStroke}" stroke-width="1.5" />
    
    <!-- Bottom-Left Vertical Mark -->
    <line x1="${bleedPx - trimOffset}" y1="${svgH - bleedPx}" x2="${bleedPx - trimOffset}" y2="${svgH - bleedPx + trimLinesLength}" stroke="${trimStroke}" stroke-width="1.5" />
    <!-- Bottom-Left Horizontal Mark -->
    <line x1="${bleedPx - trimLinesLength}" y1="${svgH - bleedPx + trimOffset}" x2="${bleedPx}" y2="${svgH - bleedPx + trimOffset}" stroke="${trimStroke}" stroke-width="1.5" />
    
    <!-- Bottom-Right Vertical Mark -->
    <line x1="${svgW - bleedPx + trimOffset}" y1="${svgH - bleedPx}" x2="${svgW - bleedPx + trimOffset}" y2="${svgH - bleedPx + trimLinesLength}" stroke="${trimStroke}" stroke-width="1.5" />
    <!-- Bottom-Right Horizontal Mark -->
    <line x1="${svgW - bleedPx}" y1="${svgH - bleedPx + trimOffset}" x2="${svgW - bleedPx + trimLinesLength}" y2="${svgH - bleedPx + trimOffset}" stroke="${trimStroke}" stroke-width="1.5" />
    `
      : "";

    // Columns grids XML representation
    let columnsGuidesMarkup = "";
    if (layout.columns.count > 1) {
      const liveWidth = canvasW - layout.margins.left - layout.margins.right;
      const totalGuttersWidth = (layout.columns.count - 1) * layout.columns.gutter;
      const singleColWidth = (liveWidth - totalGuttersWidth) / layout.columns.count;

      for (let i = 0; i < layout.columns.count - 1; i++) {
        const xOffset =
          layout.margins.left + (i + 1) * singleColWidth + i * layout.columns.gutter;
        const screenX = bleedPx + xOffset * factor;
        const screenGutterW = layout.columns.gutter * factor;

        columnsGuidesMarkup += `
        <!-- Column guide slot ${i+1} -->
        <rect x="${screenX}" y="${bleedPx + layout.margins.top * factor}" width="${screenGutterW}" height="${(canvasH - layout.margins.top - layout.margins.bottom) * factor}" fill="#f1f5f9" opacity="0.65" stroke="#cbd5e1" stroke-dasharray="2 2" />
        `;
      }
    }

    // Render placing blocks (checking for text overflows)
    const blocksMarkup = layout.blocks
      .map((block) => {
        const x = bleedPx + block.x * factor;
        const y = bleedPx + block.y * factor;
        const w = block.width * factor;
        const h = block.height * factor;

        if (block.type === "image") {
          return `
        <!-- Image block id: ${block.id} -->
        <g>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f8fafc" stroke="#3b82f6" stroke-width="1" />
          <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="#bfdbfe" stroke-width="1" />
          <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y}" stroke="#bfdbfe" stroke-width="1" />
          <text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-size="9" fill="#1e3a8a">[IMAGE BLOCK: ${block.content.slice(0, 20)}]</text>
        </g>
        `;
        }

        if (block.type === "text") {
          const fontSize = (block.data.fontSize || 12) * (factor / 15);
          const isOverflow = checkTextOverflow(block);
          const blockBorderColor = isOverflow ? "#ef4444" : "#e2e8f0";
          const blockBg = isOverflow ? "#fef2f2" : "#ffffff";

          return `
        <!-- Text Block id: ${block.id}, overflow: ${isOverflow} -->
        <g>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${blockBg}" stroke="${blockBorderColor}" stroke-width="${isOverflow ? "1.5" : "1"}" />
          <text x="${x + 6}" y="${y + fontSize + 6}" font-family="${block.data.fontFamily || "sans-serif"}" font-size="${fontSize}" fill="${block.data.fill || "#1e293b"}" width="${w - 12}">
            ${block.content}
          </text>
          ${
            isOverflow
              ? `
          <rect x="${x + w - 16}" y="${y + h - 16}" width="12" height="12" fill="#ef4444" rx="2" />
          <text x="${x + w - 10}" y="${y + h - 7}" text-anchor="middle" font-family="monospace" font-size="9" fill="#ffffff" font-weight="bold">+</text>
          <text x="${x}" y="${y - 4}" font-family="sans-serif" font-size="8" fill="#ef4444" font-weight="bold">[OVERFLOW WARNING]</text>
          `
              : ""
          }
        </g>
        `;
        }

        return "";
      })
      .join("\n");

    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="background-color: #f1f5f9;">
  <!-- Print Sheet Backing -->
  <rect x="0" y="0" width="${svgW}" height="${svgH}" fill="#e2e8f0" />
  
  <!-- Outer Bleed Limit Sheet -->
  <rect x="${bleedPx - layout.bleed * factor}" y="${bleedPx - layout.bleed * factor}" width="${canvasW * factor + layout.bleed * 2 * factor}" height="${canvasH * factor + layout.bleed * 2 * factor}" fill="#ffffff" stroke="#ef4444" stroke-width="1" stroke-dasharray="2 2" />
  <text x="${bleedPx}" y="${bleedPx - 20}" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">🟥 BLEED LINE (LIMIT FOR GRAPHICS CUTS: ${layout.bleed} ${layout.unit})</text>

  <!-- True Trim Canvas Borders -->
  <rect x="${bleedPx}" y="${bleedPx}" width="${canvasW * factor}" height="${canvasH * factor}" fill="#ffffff" stroke="#000000" stroke-width="2" />
  <text x="${bleedPx}" y="${bleedPx + canvasH * factor + 15}" font-family="monospace" font-size="9" fill="#000000">⬛ PRINT TRIM CONTAINER (${canvasW} x ${canvasH} ${layout.unit}, Open DPI: ${layout.dpi})</text>

  <!-- Safe Zone Border Bounds -->
  <rect x="${bleedPx + layout.safe_zone * factor}" y="${bleedPx + layout.safe_zone * factor}" width="${(canvasW - layout.safe_zone * 2) * factor}" height="${(canvasH - layout.safe_zone * 2) * factor}" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4 2" />
  <text x="${bleedPx + layout.safe_zone * factor + 8}" y="${bleedPx + layout.safe_zone * factor + 12}" font-family="monospace" font-size="8" fill="#22c55e">🟩 SAFE ZONE: PLACE CRITICAL COPY INSIDE</text>

  <!-- Margins Inset Guides -->
  <rect x="${bleedPx + layout.margins.left * factor}" y="${bleedPx + layout.margins.top * factor}" width="${(canvasW - layout.margins.left - layout.margins.right) * factor}" height="${(canvasH - layout.margins.top - layout.margins.bottom) * factor}" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="1 1" />
  
  <!-- Multi-column systems partition overlays -->
  ${columnsGuidesMarkup}
  
  <!-- Active Layout Layer Blocks -->
  ${blocksMarkup}

  <!-- Trim & Crop markings registration -->
  ${cropMarksMarkup}
</svg>
    `.trim();

    const outputProperties = {
      layout_id: layout.layout_id,
      name: layout.name,
      width: canvasW + layout.bleed * 2,
      height: canvasH + layout.bleed * 2,
      unit: layout.unit,
      dpi: layout.dpi,
      color_profile: layout.color_mode === "CMYK" ? "U.S. Web Coated (SWOP) v2" : "sRGB IEC61966-2.1",
      pdf_version: "PDF/X-1a:2001 (Print-Ready Compliance Standard)",
      blocks_rendered: layout.blocks.length,
      has_overflow_error: layout.blocks.some((b) => b.overflowing),
    };

    return {
      svg: svgString,
      properties: outputProperties,
      base64Json: btoa(JSON.stringify(outputProperties)),
    };
  }
}

/* ============================================================
   Singleton Core API Commands Mapping
   ============================================================ */

export const layoutEngine = new LayoutEngine();

export function createLayout(input?: CreateLayoutInput): LayoutModel {
  return layoutEngine.createLayout(input);
}

export function setMargins(layoutId: string, margins: LayoutMarginSettings): LayoutModel {
  return layoutEngine.setMargins(layoutId, margins);
}

export function setColumns(layoutId: string, columns: LayoutColumnSettings): LayoutModel {
  return layoutEngine.setColumns(layoutId, columns);
}

export function setBleed(layoutId: string, bleed: number): LayoutModel {
  return layoutEngine.setBleed(layoutId, bleed);
}

export function setTrimMarks(layoutId: string, show: boolean): LayoutModel {
  return layoutEngine.setTrimMarks(layoutId, show);
}

export function placeTextBlock(
  layoutId: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  extraData?: Record<string, any>
): LayoutModel {
  return layoutEngine.placeTextBlock(layoutId, text, x, y, width, height, extraData);
}

export function placeImageBlock(
  layoutId: string,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
  extraData?: Record<string, any>
): LayoutModel {
  return layoutEngine.placeImageBlock(layoutId, src, x, y, width, height, extraData);
}

export function alignToGrid(layoutId: string, blockId: string): LayoutModel {
  return layoutEngine.alignToGrid(layoutId, blockId);
}

export function createMasterPage(layoutId: string, masterPageId: string): LayoutModel {
  return layoutEngine.createMasterPage(layoutId, masterPageId);
}

export function exportPrintPDF(layoutId: string) {
  return layoutEngine.exportPrintPDF(layoutId);
}
