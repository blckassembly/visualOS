/* ============================================================
   VisualOS Raster / Image Engine
   Module Name: Raster Image Engine
   Purpose: Create Photoshop-style image layers without flattening.
   ============================================================ */

export type RasterExportFormat = "jpeg" | "png";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft_light"
  | "hard_light"
  | "color_dodge"
  | "color_burn"
  | "darken"
  | "lighten"
  | "difference"
  | "luminosity";

export type RasterLayerKind =
  | "image"
  | "mask"
  | "selection"
  | "material_pass"
  | "lighting_pass"
  | "shadow_pass"
  | "reflection_pass"
  | "texture_pass"
  | "cleanup_pass"
  | "background_removal_pass";

export type MaskMode = "reveal" | "hide" | "alpha";
export type SelectionMode = "replace" | "add" | "subtract" | "intersect";
export type MaterialType =
  | "matte"
  | "gloss"
  | "metal"
  | "glass"
  | "plastic"
  | "fabric"
  | "rubber"
  | "carbon_fiber"
  | "stainless_steel"
  | "custom";

export type TextureType =
  | "noise"
  | "grain"
  | "paper"
  | "fabric"
  | "brushed_metal"
  | "carbon_fiber"
  | "concrete"
  | "wood"
  | "custom";

export interface RasterBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RasterTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  skewX: number;
  skewY: number;
}

export interface RasterAsset {
  asset_id: string;
  source: string;
  width: number;
  height: number;
  mime_type: string;
  dpi?: number;
  color_profile?: string;
}

export interface RasterMask {
  id: string;
  name: string;
  mode: MaskMode;
  enabled: boolean;
  opacity: number;
  feather: number;
  invert: boolean;
  bounds?: RasterBounds;
  data?: Record<string, any>;
}

export interface RasterSelection {
  id: string;
  name: string;
  enabled: boolean;
  mode: SelectionMode;
  feather: number;
  bounds: RasterBounds;
  data?: Record<string, any>;
}

export interface RasterEffectPass {
  id: string;
  name: string;
  kind: RasterLayerKind;
  enabled: boolean;
  opacity: number;
  blend_mode: BlendMode;
  locked: boolean;
  settings: Record<string, any>;
}

export interface RasterLayer {
  id: string;
  name: string;
  kind: RasterLayerKind;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blend_mode: BlendMode;
  bounds: RasterBounds;
  transform: RasterTransform;
  asset?: RasterAsset;
  masks: RasterMask[];
  selections: RasterSelection[];
  effects: RasterEffectPass[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RenderPreviewOptions {
  width?: number;
  height?: number;
  includeHidden?: boolean;
  background?: string;
  quality?: number;
}

export interface RasterExportOptions {
  format: RasterExportFormat;
  quality?: number;
  scale?: number;
  transparentBackground?: boolean;
  includeVectorLayers?: boolean;
  includeTextLayers?: boolean;
}

export interface CreateRasterLayerInput {
  name?: string;
  source: string;
  width: number;
  height: number;
  mime_type?: string;
  x?: number;
  y?: number;
  opacity?: number;
  blend_mode?: BlendMode;
  dpi?: number;
  color_profile?: string;
}

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

function defaultTransform(x = 0, y = 0): RasterTransform {
  return {
    x,
    y,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    skewX: 0,
    skewY: 0,
  };
}

function createEffectPass(
  kind: RasterLayerKind,
  name: string,
  settings: Record<string, any>,
  blendMode: BlendMode = "normal",
  opacity = 1
): RasterEffectPass {
  return {
    id: createId("effect"),
    name,
    kind,
    enabled: true,
    opacity,
    blend_mode: blendMode,
    locked: false,
    settings,
  };
}

/* ============================================================
   Raster Image Engine
   ============================================================ */

export class RasterImageEngine {
  private layers: Map<string, RasterLayer>;

  constructor() {
    this.layers = new Map();
  }

  createRasterLayer(input: CreateRasterLayerInput): RasterLayer {
    const layer: RasterLayer = {
      id: createId("raster"),
      name: input.name ?? "Raster Layer",
      kind: "image",
      visible: true,
      locked: false,
      opacity: input.opacity ?? 1,
      blend_mode: input.blend_mode ?? "normal",
      bounds: {
        x: input.x ?? 0,
        y: input.y ?? 0,
        width: input.width,
        height: input.height,
      },
      transform: defaultTransform(input.x ?? 0, input.y ?? 0),
      asset: {
        asset_id: createId("asset"),
        source: input.source,
        width: input.width,
        height: input.height,
        mime_type: input.mime_type ?? "image/png",
        dpi: input.dpi,
        color_profile: input.color_profile,
      },
      masks: [],
      selections: [],
      effects: [],
      metadata: {
        non_destructive: true,
        flattened: false,
      },
      created_at: now(),
      updated_at: now(),
    };

    this.layers.set(layer.id, layer);
    return clone(layer);
  }

  getRasterLayer(layerId: string): RasterLayer {
    const layer = this.layers.get(layerId);
    if (!layer) throw new Error(`Raster layer not found: ${layerId}`);
    return clone(layer);
  }

  updateRasterLayer(
    layerId: string,
    updates: Partial<RasterLayer>
  ): RasterLayer {
    const layer = this.layers.get(layerId);
    if (!layer) throw new Error(`Raster layer not found: ${layerId}`);
    if (layer.locked) throw new Error(`Raster layer is locked: ${layerId}`);

    const updated: RasterLayer = {
      ...layer,
      ...updates,
      id: layer.id,
      created_at: layer.created_at,
      updated_at: now(),
    };

    this.layers.set(layerId, updated);
    return clone(updated);
  }

  applyMask(
    layerId: string,
    options: {
      name?: string;
      mode?: MaskMode;
      opacity?: number;
      feather?: number;
      invert?: boolean;
      bounds?: RasterBounds;
      data?: Record<string, any>;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const mask: RasterMask = {
      id: createId("mask"),
      name: options.name ?? "Layer Mask",
      mode: options.mode ?? "alpha",
      enabled: true,
      opacity: options.opacity ?? 1,
      feather: options.feather ?? 0,
      invert: options.invert ?? false,
      bounds: options.bounds,
      data: options.data ?? {},
    };

    return this.updateRasterLayer(layerId, {
      masks: [...layer.masks, mask],
    });
  }

  createSelection(
    layerId: string,
    bounds: RasterBounds,
    options: {
      name?: string;
      mode?: SelectionMode;
      feather?: number;
      data?: Record<string, any>;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const selection: RasterSelection = {
      id: createId("selection"),
      name: options.name ?? "Selection",
      enabled: true,
      mode: options.mode ?? "replace",
      feather: options.feather ?? 0,
      bounds,
      data: options.data ?? {},
    };

    return this.updateRasterLayer(layerId, {
      selections: [...layer.selections, selection],
    });
  }

  removeBackground(
    layerId: string,
    options: {
      method?: "ai" | "chroma_key" | "luma_key" | "manual_mask";
      tolerance?: number;
      feather?: number;
      preserveHair?: boolean;
      preserveEdges?: boolean;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "background_removal_pass",
      "Background Removal Pass",
      {
        method: options.method ?? "ai",
        tolerance: options.tolerance ?? 0.45,
        feather: options.feather ?? 1,
        preserveHair: options.preserveHair ?? true,
        preserveEdges: options.preserveEdges ?? true,
        destructive: false,
      },
      "normal",
      1
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  applyMaterial(
    layerId: string,
    material: {
      type: MaterialType;
      color?: string;
      roughness?: number;
      metallic?: number;
      opacity?: number;
      intensity?: number;
      customMap?: string;
    }
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "material_pass",
      "Material Pass",
      {
        type: material.type,
        color: material.color ?? "#ffffff",
        roughness: material.roughness ?? 0.5,
        metallic: material.metallic ?? 0,
        intensity: material.intensity ?? 1,
        customMap: material.customMap,
        destructive: false,
      },
      "overlay",
      material.opacity ?? 1
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  applyShadow(
    layerId: string,
    shadow: {
      x?: number;
      y?: number;
      blur?: number;
      spread?: number;
      color?: string;
      opacity?: number;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "shadow_pass",
      "Shadow Pass",
      {
        x: shadow.x ?? 12,
        y: shadow.y ?? 18,
        blur: shadow.blur ?? 24,
        spread: shadow.spread ?? 0,
        color: shadow.color ?? "#000000",
        destructive: false,
      },
      "multiply",
      shadow.opacity ?? 0.35
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  applyReflection(
    layerId: string,
    reflection: {
      direction?: "vertical" | "horizontal";
      distance?: number;
      blur?: number;
      fade?: number;
      opacity?: number;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "reflection_pass",
      "Reflection Pass",
      {
        direction: reflection.direction ?? "vertical",
        distance: reflection.distance ?? 24,
        blur: reflection.blur ?? 12,
        fade: reflection.fade ?? 0.65,
        destructive: false,
      },
      "screen",
      reflection.opacity ?? 0.25
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  applyLighting(
    layerId: string,
    lighting: {
      type?: "softbox" | "spotlight" | "ambient" | "rim_light" | "studio";
      angle?: number;
      intensity?: number;
      color?: string;
      softness?: number;
      opacity?: number;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "lighting_pass",
      "Lighting Pass",
      {
        type: lighting.type ?? "studio",
        angle: lighting.angle ?? 45,
        intensity: lighting.intensity ?? 0.75,
        color: lighting.color ?? "#ffffff",
        softness: lighting.softness ?? 0.8,
        destructive: false,
      },
      "soft_light",
      lighting.opacity ?? 0.8
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  applyTexture(
    layerId: string,
    texture: {
      type: TextureType;
      source?: string;
      scale?: number;
      intensity?: number;
      opacity?: number;
      blend_mode?: BlendMode;
    }
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "texture_pass",
      "Texture Pass",
      {
        type: texture.type,
        source: texture.source,
        scale: texture.scale ?? 1,
        intensity: texture.intensity ?? 0.5,
        destructive: false,
      },
      texture.blend_mode ?? "overlay",
      texture.opacity ?? 0.5
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  applyCleanup(
    layerId: string,
    cleanup: {
      dustRemoval?: boolean;
      scratchRemoval?: boolean;
      sharpen?: number;
      denoise?: number;
      colorBalance?: boolean;
    } = {}
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const pass = createEffectPass(
      "cleanup_pass",
      "Image Cleanup Pass",
      {
        dustRemoval: cleanup.dustRemoval ?? false,
        scratchRemoval: cleanup.scratchRemoval ?? false,
        sharpen: cleanup.sharpen ?? 0,
        denoise: cleanup.denoise ?? 0,
        colorBalance: cleanup.colorBalance ?? false,
        destructive: false,
      },
      "normal",
      1
    );

    return this.updateRasterLayer(layerId, {
      effects: [...layer.effects, pass],
    });
  }

  toggleEffect(
    layerId: string,
    effectId: string,
    enabled: boolean
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const effects = layer.effects.map((effect) =>
      effect.id === effectId ? { ...effect, enabled } : effect
    );

    return this.updateRasterLayer(layerId, { effects });
  }

  toggleEffectByKind(
    layerId: string,
    kind: RasterLayerKind,
    enabled: boolean
  ): RasterLayer {
    const layer = this.getRasterLayer(layerId);

    const mapFn = (effect: RasterEffectPass): RasterEffectPass =>
      effect.kind === kind ? { ...effect, enabled } : effect;

    const effects = layer.effects.map(mapFn);

    return this.updateRasterLayer(layerId, { effects });
  }

  toggleLighting(layerId: string, enabled: boolean): RasterLayer {
    return this.toggleEffectByKind(layerId, "lighting_pass", enabled);
  }

  toggleShadows(layerId: string, enabled: boolean): RasterLayer {
    return this.toggleEffectByKind(layerId, "shadow_pass", enabled);
  }

  toggleReflections(layerId: string, enabled: boolean): RasterLayer {
    return this.toggleEffectByKind(layerId, "reflection_pass", enabled);
  }

  renderPreview(
    layerId: string,
    options: RenderPreviewOptions = {}
  ): Record<string, any> {
    const layer = this.getRasterLayer(layerId);

    const activeEffects = layer.effects.filter(
      (effect) => effect.enabled || options.includeHidden
    );

    return {
      preview_id: createId("preview"),
      layer_id: layer.id,
      width: options.width ?? layer.bounds.width,
      height: options.height ?? layer.bounds.height,
      background: options.background ?? "transparent",
      quality: options.quality ?? 0.92,
      flattened: false,
      preserves_vector_layers: true,
      preserves_text_layers: true,
      render_stack: {
        base_image: layer.asset,
        masks: layer.masks.filter((mask) => mask.enabled),
        selections: layer.selections.filter((selection) => selection.enabled),
        effects: activeEffects,
      },
      message:
        "Preview render is non-destructive. A browser canvas, WebGL, WASM, Skia, or server renderer should consume this render stack.",
    };
  }

  exportJPEG(layerId: string, options: Omit<RasterExportOptions, "format"> = {}) {
    return this.exportRaster(layerId, {
      ...options,
      format: "jpeg",
      transparentBackground: false,
    });
  }

  exportPNG(layerId: string, options: Omit<RasterExportOptions, "format"> = {}) {
    return this.exportRaster(layerId, {
      ...options,
      format: "png",
      transparentBackground: options.transparentBackground ?? true,
    });
  }

  exportRaster(layerId: string, options: RasterExportOptions): Record<string, any> {
    const layer = this.getRasterLayer(layerId);
    const preview = this.renderPreview(layerId, {
      quality: options.quality,
    });

    return {
      export_id: createId("export"),
      layer_id: layer.id,
      format: options.format,
      quality: options.quality ?? 0.92,
      scale: options.scale ?? 1,
      transparentBackground:
        options.format === "png" ? options.transparentBackground ?? true : false,
      includeVectorLayers: options.includeVectorLayers ?? true,
      includeTextLayers: options.includeTextLayers ?? true,
      flattened_project: false,
      destructive: false,
      render_preview: preview,
      message:
        "Export package prepared. Final JPEG/PNG encoding should run through the active render adapter.",
    };
  }

  serializeLayer(layerId: string): string {
    const layer = this.getRasterLayer(layerId);
    return JSON.stringify(layer, null, 2);
  }

  listLayers(): RasterLayer[] {
    return Array.from(this.layers.values()).map((layer) => clone(layer));
  }

  deleteLayer(layerId: string): boolean {
    if (!this.layers.has(layerId)) return false;
    this.layers.delete(layerId);
    return true;
  }
}

/* ============================================================
   Singleton Command API
   ============================================================ */

export const rasterImageEngine = new RasterImageEngine();

export function createRasterLayer(input: CreateRasterLayerInput): RasterLayer {
  return rasterImageEngine.createRasterLayer(input);
}

export function applyMask(
  layerId: string,
  options?: {
    name?: string;
    mode?: MaskMode;
    opacity?: number;
    feather?: number;
    invert?: boolean;
    bounds?: RasterBounds;
    data?: Record<string, any>;
  }
): RasterLayer {
  return rasterImageEngine.applyMask(layerId, options);
}

export function removeBackground(
  layerId: string,
  options?: {
    method?: "ai" | "chroma_key" | "luma_key" | "manual_mask";
    tolerance?: number;
    feather?: number;
    preserveHair?: boolean;
    preserveEdges?: boolean;
  }
): RasterLayer {
  return rasterImageEngine.removeBackground(layerId, options);
}

export function applyMaterial(
  layerId: string,
  material: {
    type: MaterialType;
    color?: string;
    roughness?: number;
    metallic?: number;
    opacity?: number;
    intensity?: number;
    customMap?: string;
  }
): RasterLayer {
  return rasterImageEngine.applyMaterial(layerId, material);
}

export function applyShadow(
  layerId: string,
  shadow?: {
    x?: number;
    y?: number;
    blur?: number;
    spread?: number;
    color?: string;
    opacity?: number;
  }
): RasterLayer {
  return rasterImageEngine.applyShadow(layerId, shadow);
}

export function applyReflection(
  layerId: string,
  reflection?: {
    direction?: "vertical" | "horizontal";
    distance?: number;
    blur?: number;
    fade?: number;
    opacity?: number;
  }
): RasterLayer {
  return rasterImageEngine.applyReflection(layerId, reflection);
}

export function applyLighting(
  layerId: string,
  lighting?: {
    type?: "softbox" | "spotlight" | "ambient" | "rim_light" | "studio";
    angle?: number;
    intensity?: number;
    color?: string;
    softness?: number;
    opacity?: number;
  }
): RasterLayer {
  return rasterImageEngine.applyLighting(layerId, lighting);
}

export function applyTexture(
  layerId: string,
  texture: {
    type: TextureType;
    source?: string;
    scale?: number;
    intensity?: number;
    opacity?: number;
    blend_mode?: BlendMode;
  }
): RasterLayer {
  return rasterImageEngine.applyTexture(layerId, texture);
}

export function renderPreview(
  layerId: string,
  options?: RenderPreviewOptions
): Record<string, any> {
  return rasterImageEngine.renderPreview(layerId, options);
}

export function exportJPEG(
  layerId: string,
  options?: Omit<RasterExportOptions, "format">
): Record<string, any> {
  return rasterImageEngine.exportJPEG(layerId, options);
}

export function exportPNG(
  layerId: string,
  options?: Omit<RasterExportOptions, "format">
): Record<string, any> {
  return rasterImageEngine.exportPNG(layerId, options);
}
