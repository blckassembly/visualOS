/* ============================================================
   VisualOS Canvas System
   Module Name: Canvas System
   Purpose: Create the working surface for every VisualOS project.
   ============================================================ */

export type CanvasUnit = "pixels" | "inches" | "millimeters";
export type ColorMode = "RGB" | "CMYK";
export type CanvasType =
  | "blank"
  | "business_card"
  | "letterhead"
  | "poster"
  | "presentation_slide"
  | "product_sheet"
  | "brand_board"
  | "ui_screen"
  | "ux_flow_board"
  | "fashion_tech_pack"
  | "industrial_design_board"
  | "architecture_sheet"
  | "dfm_sheet"
  | "cad_reference_sheet";

export type ExportFormat = "jpeg" | "png" | "pdf" | "svg" | "json";

export type AspectRatio =
  | "custom"
  | "1:1"
  | "4:3"
  | "16:9"
  | "9:16"
  | "3:2"
  | "2:3"
  | "A4"
  | "letter";

export interface GridSettings {
  enabled: boolean;
  size: number;
  color: string;
  opacity: number;
  snap: boolean;
}

export interface Guide {
  id: string;
  axis: "x" | "y";
  position: number;
  locked: boolean;
  color?: string;
}

export interface CanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  data: Record<string, any>;
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  objects: CanvasObject[];
}

export interface CanvasModel {
  canvas_id: string;
  name: string;
  type: CanvasType;
  width: number;
  height: number;
  unit: CanvasUnit;
  dpi: number;
  color_mode: ColorMode;
  aspect_ratio: AspectRatio;
  bleed: number;
  safe_zone: number;
  background: string;
  grid: GridSettings;
  guides: Guide[];
  layers: CanvasLayer[];
  created_at: string;
  updated_at: string;
}

export interface CreateCanvasInput {
  name?: string;
  type?: CanvasType;
  width?: number;
  height?: number;
  unit?: CanvasUnit;
  dpi?: number;
  color_mode?: ColorMode;
  aspect_ratio?: AspectRatio;
  bleed?: number;
  safe_zone?: number;
  background?: string;
}

export interface ResizeOptions {
  preserveObjects?: boolean;
  scaleObjects?: boolean;
  anchor?: "center" | "top_left";
}

export interface CanvasPreset {
  name: string;
  type: CanvasType;
  width: number;
  height: number;
  unit: CanvasUnit;
  dpi: number;
  color_mode: ColorMode;
  aspect_ratio: AspectRatio;
  bleed: number;
  safe_zone: number;
  background: string;
}

/* ============================================================
   Presets
   ============================================================ */

export const CANVAS_PRESETS: Record<CanvasType, CanvasPreset> = {
  blank: {
    name: "Blank Canvas",
    type: "blank",
    width: 1920,
    height: 1080,
    unit: "pixels",
    dpi: 72,
    color_mode: "RGB",
    aspect_ratio: "16:9",
    bleed: 0,
    safe_zone: 0,
    background: "white",
  },

  business_card: {
    name: "Business Card Canvas",
    type: "business_card",
    width: 3.5,
    height: 2,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "custom",
    bleed: 0.125,
    safe_zone: 0.125,
    background: "white",
  },

  letterhead: {
    name: "Letterhead Canvas",
    type: "letterhead",
    width: 8.5,
    height: 11,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "letter",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },

  poster: {
    name: "Poster Canvas",
    type: "poster",
    width: 24,
    height: 36,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "2:3",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },

  presentation_slide: {
    name: "Presentation Slide Canvas",
    type: "presentation_slide",
    width: 1920,
    height: 1080,
    unit: "pixels",
    dpi: 144,
    color_mode: "RGB",
    aspect_ratio: "16:9",
    bleed: 0,
    safe_zone: 64,
    background: "white",
  },

  product_sheet: {
    name: "Product Sheet Canvas",
    type: "product_sheet",
    width: 8.5,
    height: 11,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "letter",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },

  brand_board: {
    name: "Brand Board Canvas",
    type: "brand_board",
    width: 1920,
    height: 1080,
    unit: "pixels",
    dpi: 144,
    color_mode: "RGB",
    aspect_ratio: "16:9",
    bleed: 0,
    safe_zone: 80,
    background: "white",
  },

  ui_screen: {
    name: "UI Screen Canvas",
    type: "ui_screen",
    width: 1440,
    height: 1024,
    unit: "pixels",
    dpi: 72,
    color_mode: "RGB",
    aspect_ratio: "custom",
    bleed: 0,
    safe_zone: 24,
    background: "white",
  },

  ux_flow_board: {
    name: "UX Flow Board Canvas",
    type: "ux_flow_board",
    width: 3000,
    height: 2000,
    unit: "pixels",
    dpi: 72,
    color_mode: "RGB",
    aspect_ratio: "3:2",
    bleed: 0,
    safe_zone: 64,
    background: "#f8f8f8",
  },

  fashion_tech_pack: {
    name: "Fashion Tech Pack Canvas",
    type: "fashion_tech_pack",
    width: 11,
    height: 17,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "custom",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },

  industrial_design_board: {
    name: "Industrial Design Board Canvas",
    type: "industrial_design_board",
    width: 1920,
    height: 1080,
    unit: "pixels",
    dpi: 144,
    color_mode: "RGB",
    aspect_ratio: "16:9",
    bleed: 0,
    safe_zone: 80,
    background: "white",
  },

  architecture_sheet: {
    name: "Architecture Sheet Canvas",
    type: "architecture_sheet",
    width: 24,
    height: 36,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "2:3",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },

  dfm_sheet: {
    name: "DFM Sheet Canvas",
    type: "dfm_sheet",
    width: 17,
    height: 11,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "custom",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },

  cad_reference_sheet: {
    name: "CAD Reference Sheet Canvas",
    type: "cad_reference_sheet",
    width: 24,
    height: 18,
    unit: "inches",
    dpi: 300,
    color_mode: "CMYK",
    aspect_ratio: "4:3",
    bleed: 0.125,
    safe_zone: 0.25,
    background: "white",
  },
};

/* ============================================================
   Helpers
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

function defaultGrid(): GridSettings {
  return {
    enabled: false,
    size: 10,
    color: "#cccccc",
    opacity: 0.35,
    snap: false,
  };
}

function defaultLayer(): CanvasLayer {
  return {
    id: createId("layer"),
    name: "Layer 1",
    visible: true,
    locked: false,
    opacity: 1,
    objects: [],
  };
}

function getAspectRatioSize(
  ratio: AspectRatio,
  baseWidth: number,
  unit: CanvasUnit
): { width: number; height: number } {
  switch (ratio) {
    case "1:1":
      return { width: baseWidth, height: baseWidth };
    case "4:3":
      return { width: baseWidth, height: baseWidth * 0.75 };
    case "16:9":
      return { width: baseWidth, height: baseWidth * (9 / 16) };
    case "9:16":
      return { width: baseWidth, height: baseWidth * (16 / 9) };
    case "3:2":
      return { width: baseWidth, height: baseWidth * (2 / 3) };
    case "2:3":
      return { width: baseWidth, height: baseWidth * 1.5 };
    case "A4":
      return unit === "millimeters"
        ? { width: 210, height: 297 }
        : { width: 8.27, height: 11.69 };
    case "letter":
      return unit === "millimeters"
        ? { width: 215.9, height: 279.4 }
        : { width: 8.5, height: 11 };
    default:
      return { width: baseWidth, height: baseWidth };
  }
}

function convertUnitValue(
  value: number,
  from: CanvasUnit,
  to: CanvasUnit,
  dpi: number
): number {
  if (from === to) return value;

  let inches: number;

  if (from === "pixels") inches = value / dpi;
  else if (from === "millimeters") inches = value / 25.4;
  else inches = value;

  if (to === "pixels") return inches * dpi;
  if (to === "millimeters") return inches * 25.4;
  return inches;
}

/* ============================================================
   Canvas System Class
   ============================================================ */

export class CanvasSystem {
  private canvases: Map<string, CanvasModel>;

  constructor() {
    this.canvases = new Map();
  }

  createCanvas(input: CreateCanvasInput = {}): CanvasModel {
    const type = input.type ?? "blank";
    const preset = CANVAS_PRESETS[type];

    const canvas: CanvasModel = {
      canvas_id: createId("canvas"),
      name: input.name ?? preset.name,
      type,
      width: input.width ?? preset.width,
      height: input.height ?? preset.height,
      unit: input.unit ?? preset.unit,
      dpi: input.dpi ?? preset.dpi,
      color_mode: input.color_mode ?? preset.color_mode,
      aspect_ratio: input.aspect_ratio ?? preset.aspect_ratio,
      bleed: input.bleed ?? preset.bleed,
      safe_zone: input.safe_zone ?? preset.safe_zone,
      background: input.background ?? preset.background,
      grid: defaultGrid(),
      guides: [],
      layers: [defaultLayer()],
      created_at: now(),
      updated_at: now(),
    };

    this.canvases.set(canvas.canvas_id, canvas);
    return clone(canvas);
  }

  getCanvas(canvasId: string): CanvasModel {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) throw new Error(`Canvas not found: ${canvasId}`);
    return clone(canvas);
  }

  updateCanvas(canvasId: string, updates: Partial<CanvasModel>): CanvasModel {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) throw new Error(`Canvas not found: ${canvasId}`);

    const updated: CanvasModel = {
      ...canvas,
      ...updates,
      canvas_id: canvas.canvas_id,
      layers: updates.layers ?? canvas.layers,
      updated_at: now(),
    };

    this.canvases.set(canvasId, updated);
    return clone(updated);
  }

  setCanvasSize(canvasId: string, width: number, height: number): CanvasModel {
    return this.updateCanvas(canvasId, {
      width,
      height,
      aspect_ratio: "custom",
    });
  }

  setAspectRatio(
    canvasId: string,
    aspectRatio: AspectRatio,
    baseWidth?: number
  ): CanvasModel {
    const canvas = this.getCanvas(canvasId);
    const width = baseWidth ?? canvas.width;
    const size = getAspectRatioSize(aspectRatio, width, canvas.unit);

    return this.updateCanvas(canvasId, {
      width: size.width,
      height: size.height,
      aspect_ratio: aspectRatio,
    });
  }

  setUnits(canvasId: string, unit: CanvasUnit): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    const width = convertUnitValue(canvas.width, canvas.unit, unit, canvas.dpi);
    const height = convertUnitValue(canvas.height, canvas.unit, unit, canvas.dpi);
    const bleed = convertUnitValue(canvas.bleed, canvas.unit, unit, canvas.dpi);
    const safeZone = convertUnitValue(
      canvas.safe_zone,
      canvas.unit,
      unit,
      canvas.dpi
    );

    const layers = canvas.layers.map((layer) => ({
      ...layer,
      objects: layer.objects.map((object) => ({
        ...object,
        x: convertUnitValue(object.x, canvas.unit, unit, canvas.dpi),
        y: convertUnitValue(object.y, canvas.unit, unit, canvas.dpi),
        width: convertUnitValue(object.width, canvas.unit, unit, canvas.dpi),
        height: convertUnitValue(object.height, canvas.unit, unit, canvas.dpi),
      })),
    }));

    const guides = canvas.guides.map((guide) => ({
      ...guide,
      position: convertUnitValue(guide.position, canvas.unit, unit, canvas.dpi),
    }));

    return this.updateCanvas(canvasId, {
      width,
      height,
      bleed,
      safe_zone: safeZone,
      unit,
      layers,
      guides,
    });
  }

  setDPI(canvasId: string, dpi: number): CanvasModel {
    if (dpi <= 0) throw new Error("DPI must be greater than 0.");
    return this.updateCanvas(canvasId, { dpi });
  }

  setColorMode(canvasId: string, colorMode: ColorMode): CanvasModel {
    return this.updateCanvas(canvasId, { color_mode: colorMode });
  }

  setBleed(canvasId: string, bleed: number): CanvasModel {
    if (bleed < 0) throw new Error("Bleed cannot be negative.");
    return this.updateCanvas(canvasId, { bleed });
  }

  setSafeZone(canvasId: string, safeZone: number): CanvasModel {
    if (safeZone < 0) throw new Error("Safe zone cannot be negative.");
    return this.updateCanvas(canvasId, { safe_zone: safeZone });
  }

  setGrid(canvasId: string, grid: Partial<GridSettings>): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    return this.updateCanvas(canvasId, {
      grid: {
        ...canvas.grid,
        ...grid,
      },
    });
  }

  setGuides(canvasId: string, guides: Guide[]): CanvasModel {
    return this.updateCanvas(canvasId, {
      guides,
    });
  }

  addGuide(
    canvasId: string,
    axis: "x" | "y",
    position: number,
    locked = false
  ): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    const guide: Guide = {
      id: createId("guide"),
      axis,
      position,
      locked,
      color: "#00aaff",
    };

    return this.updateCanvas(canvasId, {
      guides: [...canvas.guides, guide],
    });
  }

  setBackground(canvasId: string, background: string): CanvasModel {
    return this.updateCanvas(canvasId, { background });
  }

  resizeCanvas(
    canvasId: string,
    width: number,
    height: number,
    options: ResizeOptions = {}
  ): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    const preserveObjects = options.preserveObjects ?? true;
    const scaleObjects = options.scaleObjects ?? false;
    const anchor = options.anchor ?? "center";

    let layers = canvas.layers;

    if (preserveObjects && scaleObjects) {
      const scaleX = width / canvas.width;
      const scaleY = height / canvas.height;

      layers = canvas.layers.map((layer) => ({
        ...layer,
        objects: layer.objects.map((object) => ({
          ...object,
          x: object.x * scaleX,
          y: object.y * scaleY,
          width: object.width * scaleX,
          height: object.height * scaleY,
        })),
      }));
    }

    if (preserveObjects && !scaleObjects && anchor === "center") {
      const offsetX = (width - canvas.width) / 2;
      const offsetY = (height - canvas.height) / 2;

      layers = canvas.layers.map((layer) => ({
        ...layer,
        objects: layer.objects.map((object) => ({
          ...object,
          x: object.x + offsetX,
          y: object.y + offsetY,
        })),
      }));
    }

    return this.updateCanvas(canvasId, {
      width,
      height,
      aspect_ratio: "custom",
      layers,
    });
  }

  duplicateCanvas(canvasId: string, name?: string): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    const duplicate: CanvasModel = {
      ...clone(canvas),
      canvas_id: createId("canvas"),
      name: name ?? `${canvas.name} Copy`,
      created_at: now(),
      updated_at: now(),
      layers: canvas.layers.map((layer) => ({
        ...layer,
        id: createId("layer"),
        objects: layer.objects.map((object) => ({
          ...object,
          id: createId("object"),
        })),
      })),
      guides: canvas.guides.map((guide) => ({
        ...guide,
        id: createId("guide"),
      })),
    };

    this.canvases.set(duplicate.canvas_id, duplicate);
    return clone(duplicate);
  }

  addLayer(canvasId: string, name = "New Layer"): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    const layer: CanvasLayer = {
      id: createId("layer"),
      name,
      visible: true,
      locked: false,
      opacity: 1,
      objects: [],
    };

    return this.updateCanvas(canvasId, {
      layers: [...canvas.layers, layer],
    });
  }

  addObject(
    canvasId: string,
    layerId: string,
    object: Omit<CanvasObject, "id">
  ): CanvasModel {
    const canvas = this.getCanvas(canvasId);

    const layers = canvas.layers.map((layer) => {
      if (layer.id !== layerId) return layer;
      if (layer.locked) throw new Error(`Layer is locked: ${layerId}`);

      return {
        ...layer,
        objects: [
          ...layer.objects,
          {
            ...object,
            id: createId("object"),
          },
        ],
      };
    });

    return this.updateCanvas(canvasId, { layers });
  }

  exportCanvasPreview(canvasId: string, format: ExportFormat): string {
    const canvas = this.getCanvas(canvasId);

    switch (format) {
      case "json":
        return JSON.stringify(canvas, null, 2);

      case "svg":
        return this.exportSVG(canvas);

      case "png":
        return this.exportRasterPlaceholder(canvas, "png");

      case "jpeg":
        return this.exportRasterPlaceholder(canvas, "jpeg");

      case "pdf":
        return this.exportPDFPlaceholder(canvas);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportSVG(canvas: CanvasModel): string {
    const visibleObjects = canvas.layers
      .filter((layer) => layer.visible)
      .flatMap((layer) => layer.objects.filter((object) => object.visible));

    const objectMarkup = visibleObjects
      .map((object) => {
        if (object.type === "rect") {
          return `<rect x="${object.x}" y="${object.y}" width="${object.width}" height="${object.height}" opacity="${object.opacity}" fill="${
            object.data.fill ?? "#000000"
          }" />`;
        }

        if (object.type === "text") {
          return `<text x="${object.x}" y="${object.y}" opacity="${object.opacity}" font-size="${
            object.data.fontSize ?? 16
          }" fill="${object.data.fill ?? "#000000"}">${
            object.data.text ?? ""
          }</text>`;
        }

        return `<!-- Unsupported object type: ${object.type} -->`;
      })
      .join("\n");

    return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${canvas.width}"
     height="${canvas.height}"
     viewBox="0 0 ${canvas.width} ${canvas.height}">
  <rect width="100%" height="100%" fill="${canvas.background}" />
  ${objectMarkup}
</svg>
`.trim();
  }

  private exportRasterPlaceholder(
    canvas: CanvasModel,
    format: "png" | "jpeg"
  ): string {
    return JSON.stringify(
      {
        message: `${format.toUpperCase()} export requires a browser canvas renderer or server renderer.`,
        canvas_id: canvas.canvas_id,
        suggested_renderer: "HTMLCanvasElement, OffscreenCanvas, Sharp, or Skia Canvas",
      },
      null,
      2
    );
  }

  private exportPDFPlaceholder(canvas: CanvasModel): string {
    return JSON.stringify(
      {
        message: "PDF export requires a PDF renderer.",
        canvas_id: canvas.canvas_id,
        suggested_renderer: "PDFKit, jsPDF, React PDF, or browser print pipeline",
      },
      null,
      2
    );
  }
}

/* ============================================================
   Command API
   ============================================================ */

export const canvasSystem = new CanvasSystem();

export function createCanvas(input?: CreateCanvasInput): CanvasModel {
  return canvasSystem.createCanvas(input);
}

export function setCanvasSize(
  canvasId: string,
  width: number,
  height: number
): CanvasModel {
  return canvasSystem.setCanvasSize(canvasId, width, height);
}

export function setAspectRatio(
  canvasId: string,
  aspectRatio: AspectRatio,
  baseWidth?: number
): CanvasModel {
  return canvasSystem.setAspectRatio(canvasId, aspectRatio, baseWidth);
}

export function setUnits(canvasId: string, unit: CanvasUnit): CanvasModel {
  return canvasSystem.setUnits(canvasId, unit);
}

export function setDPI(canvasId: string, dpi: number): CanvasModel {
  return canvasSystem.setDPI(canvasId, dpi);
}

export function setColorMode(
  canvasId: string,
  colorMode: ColorMode
): CanvasModel {
  return canvasSystem.setColorMode(canvasId, colorMode);
}

export function setBleed(canvasId: string, bleed: number): CanvasModel {
  return canvasSystem.setBleed(canvasId, bleed);
}

export function setSafeZone(canvasId: string, safeZone: number): CanvasModel {
  return canvasSystem.setSafeZone(canvasId, safeZone);
}

export function setGrid(
  canvasId: string,
  grid: Partial<GridSettings>
): CanvasModel {
  return canvasSystem.setGrid(canvasId, grid);
}

export function setGuides(canvasId: string, guides: Guide[]): CanvasModel {
  return canvasSystem.setGuides(canvasId, guides);
}

export function setBackground(
  canvasId: string,
  background: string
): CanvasModel {
  return canvasSystem.setBackground(canvasId, background);
}

export function resizeCanvas(
  canvasId: string,
  width: number,
  height: number,
  options?: ResizeOptions
): CanvasModel {
  return canvasSystem.resizeCanvas(canvasId, width, height, options);
}

export function duplicateCanvas(
  canvasId: string,
  name?: string
): CanvasModel {
  return canvasSystem.duplicateCanvas(canvasId, name);
}

export function exportCanvasPreview(
  canvasId: string,
  format: ExportFormat
): string {
  return canvasSystem.exportCanvasPreview(canvasId, format);
}
