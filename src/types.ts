/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PresetCanvas {
  id: string;
  name: string;
  category: string;
  promptExample: string;
  layers: string[];
  dimensions: string;
  bomItems: string[];
  dfmChecks: { label: string; pass: boolean }[];
  elements: CanvasElement[];
}

export type ElementType = 'vector' | 'raster' | 'text' | 'dimension' | 'palette';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color?: string;
  text?: string;
  details?: string;
}

export interface ProblemCard {
  id: string;
  title: string;
  description: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  badge: string;
}

export interface ModuleItem {
  name: string;
  tag: string;
  description: string;
  iconName: string;
}

export interface UseCaseItem {
  title: string;
  category: 'graphics' | 'industrial' | 'apparel' | 'architecture';
  description: string;
  outputs: string[];
  visualType: string;
}

export interface CommandExample {
  command: string;
  description: string;
  actionLabel: string;
  simulatedOutput: string;
  outputType: 'vector' | 'list' | 'sheet' | 'unboxed';
}

export interface ExportCategory {
  title: string;
  badge: string;
  formats: string[];
  highlight: string;
}

export interface QCEntry {
  name: string;
  status: 'clean' | 'warning' | 'critical';
  details: string;
  category: 'CAD' | 'Aesthetics' | 'Handoff';
}
