import React, { useState, useMemo, useEffect } from 'react';
import { 
  Boxes, 
  GitFork, 
  Cpu, 
  Settings, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Hammer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  FileText,
  Download,
  Activity,
  AlertTriangle,
  Move,
  Info,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/* ============================================================
   TYPINGS & ENUMS (STRICTLY FROM USER SCHEMA SPECIFICATION)
   ============================================================ */

export type PrecastType =
  | "brownstone"
  | "townhouse"
  | "neo_classical_building"
  | "apartment_building"
  | "public_restroom"
  | "school"
  | "hospitality_building"
  | "factory"
  | "warehouse"
  | "data_center"
  | "chip_manufacturing_facility"
  | "industrial_shell"
  | "utility_building"
  | "space_data_center_pod"
  | "orbital_facility"
  | "lunar_facility"
  | "infrastructure_component";

export type FoundationStatus =
  | "not_started"
  | "in_progress"
  | "complete"
  | "verified";

export type DesignStyle =
  | "neo_classical"
  | "brownstone"
  | "modern"
  | "industrial"
  | "custom";

export type DimensionUnit = "inches" | "millimeters" | "feet" | "meters";

export type PrecastModuleType =
  | "foundation_interface"
  | "wall_panel"
  | "floor_plate"
  | "roof_panel"
  | "column"
  | "beam"
  | "stair"
  | "bathroom_pod"
  | "kitchen_pod"
  | "facade_panel"
  | "mep_chase"
  | "utility_riser"
  | "data_center_rack_hall"
  | "industrial_shell"
  | "space_pod";

export type EmbeddedSystemType =
  | "structural_rebar"
  | "post_tensioning"
  | "electrical_conduit"
  | "plumbing_pipe"
  | "drainage"
  | "hvac_chase"
  | "fire_suppression"
  | "data_cable_path"
  | "soundproofing"
  | "waterproofing"
  | "thermal_insulation"
  | "anchoring_hardware"
  | "robot_handling_point";

export type InterfaceType =
  | "structural"
  | "mechanical"
  | "electrical"
  | "plumbing"
  | "hvac"
  | "fire_life_safety"
  | "waterproofing"
  | "soundproofing"
  | "thermal"
  | "data"
  | "robotic"
  | "foundation"
  | "code_review";

export type QCSeverity = "info" | "warning" | "critical";

export type ExportType =
  | "png"
  | "pdf"
  | "svg"
  | "layered_pdf"
  | "visualos"
  | "json_manifest"
  | "bom_csv"
  | "mes_routing_json"
  | "dob_review_packet_pdf"
  | "dfm_report_pdf";

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: DimensionUnit;
}

export interface EmbeddedSystem {
  embedded_id: string;
  system_type: EmbeddedSystemType;
  description: string;
  inspection_required: boolean;
}

export interface PrecastInterface {
  interface_id: string;
  name: string;
  type: InterfaceType;
  from_module_id: string;
  to_module_id?: string;
  description: string;
  inspection_required: boolean;
  qc_check: string;
}

export interface PrecastModule {
  module_id: string;
  name: string;
  module_type: PrecastModuleType;
  function: string;
  dimensions: Dimensions;
  materials: string[];
  embedded_systems: EmbeddedSystem[];
  interfaces: PrecastInterface[];
  manufacturing_processes: string[];
  assembly_station: string;
  shipping_constraints: string[];
  installation_requirements: string[];
  qc_checks: string[];
  human_review_required: boolean;
}

export interface StructuralGrid {
  grid_id: string;
  grid_type: "bearing_wall" | "column_grid" | "hybrid" | "pod_shell" | "custom";
  grid_lines_x: string[];
  grid_lines_y: string[];
  floor_levels: string[];
  load_path_notes: string[];
  lateral_system_notes: string[];
  foundation_interface_notes: string[];
  human_review_required: boolean;
}

export interface MEPSystem {
  mechanical: {
    hvac_type: "central_air" | "heat_pump" | "radiant" | "industrial" | "custom";
    duct_routes: string[];
    service_access: string[];
    equipment_zones: string[];
  };
  electrical: {
    panel_locations: string[];
    conduit_routes: string[];
    lighting_zones: string[];
    backup_power?: string[];
  };
  plumbing: {
    wet_zones: string[];
    riser_locations: string[];
    drain_routes: string[];
    cleanout_access: string[];
  };
  fire_life_safety: {
    fire_separation_zones: string[];
    suppression_routes: string[];
    alarm_routes: string[];
    egress_notes: string[];
  };
}

export interface PanelizationPanel {
  panel_id: string;
  module_id: string;
  panel_type:
    | "wall"
    | "floor"
    | "roof"
    | "facade"
    | "pod"
    | "column"
    | "beam"
    | "space_shell";
  dimensions: Dimensions;
  lift_points: string[];
  embed_notes: string[];
  shipping_orientation: "flat" | "vertical" | "crated" | "launch_restraint";
  crane_required: boolean;
}

export interface PanelizationPlan {
  plan_id: string;
  strategy: string;
  panels: PanelizationPanel[];
  max_shipping_envelope_notes: string[];
  crane_access_notes: string[];
  staging_notes: string[];
}

export interface FactoryStation {
  station_id: string;
  name: string;
  purpose: string;
  module_ids: string[];
  inputs: string[];
  outputs: string[];
  equipment: string[];
  qc_gate: string;
}

export interface PrecastAssemblyStep {
  step_id: string;
  order: number;
  name: string;
  module_ids: string[];
  action: string;
  dependencies: string[];
  site_requirements: string[];
  qc_gate: string;
  human_review_required: boolean;
}

export interface PrecastBOMItem {
  bom_item_id: string;
  module_id: string;
  name: string;
  material: string;
  quantity: number;
  unit: string;
  process: string;
  notes: string;
}

export interface PrecastMESRoute {
  route_id: string;
  operation_number: number;
  station_id: string;
  operation_name: string;
  module_ids: string[];
  predecessors: string[];
  quality_hold_required: boolean;
  signoff_role: string;
}

export interface PrecastShippingPlan {
  plan_id: string;
  shipments: {
    shipment_id: string;
    module_ids: string[];
    load_order: number;
    truck_or_transport_type: string;
    staging_zone: string;
    handling_notes: string[];
  }[];
}

export interface PrecastInstallationPlan {
  plan_id: string;
  steps: PrecastAssemblyStep[];
  crane_plan_notes: string[];
  site_staging_notes: string[];
  weatherproofing_notes: string[];
}

export interface DOBReviewPackage {
  package_id: string;
  drawings: string[];
  diagrams: string[];
  schedules: string[];
  review_flags: string[];
  required_professional_review: string[];
  disclaimer: string;
}

export interface PrecastQCFlag {
  flag_id: string;
  severity: QCSeverity;
  module_id?: string;
  message: string;
  required_reviewer: string;
}

export interface PrecastCanvasLayer {
  layer_index: number;
  name: string;
  visible: boolean;
  locked: boolean;
  payload_ref: string;
}

export interface PrecastEngineeringCanvas {
  canvas_id: string;
  sections: {
    floor_plan_input: string;
    architectural_physics_overlay: string;
    structural_grid: string;
    load_path_diagram: string;
    precast_module_tree: string;
    panelization_map: string;
    mep_routing_map: string;
    bathroom_kitchen_pod_map: string;
    factory_station_plan: string;
    shipping_and_staging_plan: string;
    installation_sequence: string;
    dob_code_review_flags: string;
    bom_summary: string;
    mes_routing_summary: string;
    human_engineering_review_flags: string;
  };
  layers: PrecastCanvasLayer[];
}

export interface PrecastExportManifest {
  exports: {
    type: ExportType;
    filename: string;
    status: "planned" | "generated";
  }[];
}

export interface PrecastProject {
  precast_id: string;
  project_id: string;
  project_name: string;
  object_type: PrecastType;
  building_height: string;
  foundation_status: FoundationStatus;
  design_style?: DesignStyle;
  canvas: PrecastEngineeringCanvas;
  modules: PrecastModule[];
  structural_grid: StructuralGrid;
  mep_system: MEPSystem;
  panelization_plan: PanelizationPlan;
  factory_station_plan: FactoryStation[];
  assembly_sequence: PrecastAssemblyStep[];
  bom: PrecastBOMItem[];
  mes_routing: PrecastMESRoute[];
  shipping_plan: PrecastShippingPlan;
  installation_plan: PrecastInstallationPlan;
  dob_review_package: DOBReviewPackage;
  qc_flags: PrecastQCFlag[];
  human_review_required: boolean;
  exports: PrecastExportManifest;
}

export interface PrecastInfrastructureCommand {
  command: "precastInfrastructure";
  input: {
    project_id: string;
    project_name?: string;
    prompt?: string;
    floor_plan_source?: string;
    object_type?: PrecastType;
    building_height?: string;
    foundation_status?: FoundationStatus;
    design_style?: DesignStyle;
    include_mep?: boolean;
    include_structural_grid?: boolean;
    include_panelization?: boolean;
    include_factory_plan?: boolean;
    include_mes_routing?: boolean;
    include_dob_review_package?: boolean;
    include_shipping_plan?: boolean;
    include_installation_sequence?: boolean;
    require_human_review_flags?: boolean;
  };
}

export interface PrecastModuleTemplate {
  key: string;
  name: string;
  module_type: PrecastModuleType;
  function: string;
  dimensions: Dimensions;
  materials: string[];
  embedded_systems: EmbeddedSystemType[];
  manufacturing_processes: string[];
  shipping_constraints: string[];
  installation_requirements: string[];
  qc_checks: string[];
  human_review_required: boolean;
}

export interface PrecastAssemblyTemplate {
  name: string;
  module_keys: string[];
  action: string;
  site_requirements: string[];
  qc_gate: string;
}

export interface PrecastPreset {
  object_type: PrecastType;
  grid_type: StructuralGrid["grid_type"];
  hvac_type: MEPSystem["mechanical"]["hvac_type"];
  modules: PrecastModuleTemplate[];
  assembly: PrecastAssemblyTemplate[];
}

/* ============================================================
   LAYER STACK (STRICTLY PRESERVED FROM SCHEMA)
   ============================================================ */

const PRECAST_LAYER_STACK = [
  "Layer 00: Canvas Metadata",
  "Layer 01: Background",
  "Layer 02: Original Floor Plan",
  "Layer 03: Architectural Physics Overlay",
  "Layer 04: Structural Grid",
  "Layer 05: Load Path Diagram",
  "Layer 06: Precast Module Groups",
  "Layer 07: Panelization Map",
  "Layer 08: MEP Routing",
  "Layer 09: Plumbing Zones",
  "Layer 10: Electrical Zones",
  "Layer 11: HVAC Zones",
  "Layer 12: Waterproofing Zones",
  "Layer 13: Soundproofing Zones",
  "Layer 14: Bathroom Pods",
  "Layer 15: Kitchen Pods",
  "Layer 16: Façade Panels",
  "Layer 17: Window and Door Openings",
  "Layer 18: Factory Stations",
  "Layer 19: Shipping and Staging",
  "Layer 20: Installation Sequence",
  "Layer 21: BOM Tables",
  "Layer 22: MES Routing Tables",
  "Layer 23: DOB Review Notes",
  "Layer 24: QC Flags",
  "Layer 25: Human Review Flags",
  "Layer 26: Export Marks"
];

/* ============================================================
   COMPACT & ROBUST PRECAST ENGINEERING ENGINE CLASS
   ============================================================ */

class PrecastEngineeringEngine {
  
  private makeId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
  }

  public precastInfrastructure(command: PrecastInfrastructureCommand): PrecastProject {
    const input = command.input;
    const objectType = input.object_type || "apartment_building";
    const precast_id = this.makeId("precast");
    const name = input.project_name || this.titleCase(objectType) + " Modular Structure";
    const foundation_status = input.foundation_status || "complete";

    // Standard structural grid assignment based on object type
    let gridType: StructuralGrid["grid_type"] = "hybrid";
    if (["brownstone", "townhouse", "apartment_building"].includes(objectType)) {
      gridType = "bearing_wall";
    } else if (["factory", "warehouse", "data_center", "chip_manufacturing_facility"].includes(objectType)) {
      gridType = "column_grid";
    } else if (objectType.includes("space") || objectType.includes("facility")) {
      gridType = "pod_shell";
    }

    const structural_grid: StructuralGrid = {
      grid_id: "grid_01",
      grid_type: gridType,
      grid_lines_x: ["Grid-A", "Grid-B", "Grid-C", "Grid-D"],
      grid_lines_y: ["Grid-1", "Grid-2", "Grid-3", "Grid-4"],
      floor_levels: input.building_height === "1_floor" ? ["Level 01"] : ["Level 01", "Level 02", "Level 03"],
      load_path_notes: [
        `Gravity structural load path transfers through solid vertical precast modules`,
        `Lateral stability provided by precast concrete shear core and perimeter wind bracing`
      ],
      lateral_system_notes: [
        "Rigid interlocking joint connectors with post-tensioning rods.",
        "Seismic tie plate modules welded at high-shear junction joints."
      ],
      foundation_interface_notes: [
        `Seismic foundation load anchor bolts. Current Foundation Status: ${foundation_status.toUpperCase()}`,
        "Steel shims allow micrometric leveling adjustments during initial crane positioning."
      ],
      human_review_required: input.require_human_review_flags || false
    };

    // Generating Modules based on Object Type programmatically & beautifully!
    const modules = this.generateModulesForType(objectType, precast_id, input.require_human_review_flags);
    const mep_system = this.generateMEPForType(objectType);
    const panelization_plan = this.generatePanelizationPlan(modules, objectType);
    const factory_station_plan = this.generateFactoryStations(modules, objectType);
    const assembly_sequence = this.generateAssemblySteps(modules, objectType, foundation_status);
    const bom = this.generateBOM(modules);
    const mes_routing = this.generateMESRouting(modules);
    const shipping_plan = this.generateShippingPlan(modules);
    const installation_plan = this.generateInstallationPlan(assembly_sequence);
    const dob_review_package = this.generateDOBReview(objectType, name);
    const qc_flags = this.generateQCFlags(modules, foundation_status);

    return {
      precast_id,
      project_id: input.project_id,
      project_name: name,
      object_type: objectType,
      building_height: input.building_height || "3_floors",
      foundation_status,
      design_style: input.design_style || "modern",
      canvas: this.generateCanvas(precast_id),
      modules,
      structural_grid,
      mep_system,
      panelization_plan,
      factory_station_plan,
      assembly_sequence,
      bom,
      mes_routing,
      shipping_plan,
      installation_plan,
      dob_review_package,
      qc_flags,
      human_review_required: input.require_human_review_flags || modules.some(m => m.human_review_required),
      exports: this.generateExports(precast_id)
    };
  }

  private titleCase(txt: string): string {
    return txt.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private generateModulesForType(type: PrecastType, baseId: string, forceReview?: boolean): PrecastModule[] {
    const isSpace = ["space_data_center_pod", "orbital_facility", "lunar_facility"].includes(type);
    const isIndustrial = ["factory", "warehouse", "data_center", "chip_manufacturing_facility"].includes(type);
    
    const mats = isSpace 
      ? ["Titanium Alloy", "Carbon Composite Insulation Matrix", "AeroGel Seals"]
      : ["High-Performance Concrete C50/60", "Grade B500B Reinforced Structural Steel Cage", "Waterproof Polymer Membrane"];

    const moduleSpecs: { name: string; type: PrecastModuleType; func: string; embedded: EmbeddedSystemType[] }[] = [
      {
        name: isSpace ? "Titanium Anchor Frame" : "Structural Vault foundation Pad",
        type: "foundation_interface",
        func: "Establishes secure anchor node parameters connecting modular structures to base ground/launch parameters",
        embedded: ["structural_rebar", "anchoring_hardware", "waterproofing"]
      },
      {
        name: isSpace ? "Pressurized Isolation Hull Wall" : "North Shear Bearing Wall Panel",
        type: "wall_panel",
        func: "Provides rigid self-supporting horizontal and vertical enclosure panel boundaries",
        embedded: ["structural_rebar", "electrical_conduit", "post_tensioning", "soundproofing"]
      },
      {
        name: isSpace ? "Solar Array Platform Deck" : "Prestressed Hollowcore Flooring Panel",
        type: "floor_plate",
        func: "High load-bearing modular horizontal decks built with custom voids to route hydraulic/electrical wires",
        embedded: ["structural_rebar", "plumbing_pipe", "drainage", "fire_suppression"]
      },
      {
        name: isSpace ? "Radiation Shield Roof Hatch" : "Thermal Envelope Roof Core Panel",
        type: "roof_panel",
        func: "Top enclosure featuring sloped drainage paths, custom weather sealed overlaps, and integrated solar anchors",
        embedded: ["structural_rebar", "waterproofing", "thermal_insulation"]
      }
    ];

    if (type === "public_restroom") {
      moduleSpecs.push({
        name: "Integrated Drainage Washdown Pod",
        type: "bathroom_pod",
        func: "Completely pre-fitted wet cell with sloped concrete floor pan, stainless plumbing fixtures, and floor traps",
        embedded: ["plumbing_pipe", "drainage", "waterproofing", "soundproofing", "electrical_conduit"]
      });
    } else if (isIndustrial) {
      moduleSpecs.push({
        name: "High-Density Utility MEP Chase & Riser",
        type: "mep_chase",
        func: "Prefab utility column combining bus duct pathways, pressurized chemical drainage, and fire protection drops",
        embedded: ["hvac_chase", "electrical_conduit", "fire_suppression", "data_cable_path"]
      });
    } else if (["brownstone", "townhouse", "apartment_building"].includes(type)) {
      moduleSpecs.push({
        name: "Double-Volume Precast Concrete Stair Core",
        type: "stair",
        func: "Prefab stair modules featuring monolithic non-slip treads, structural handrails, and direct seismic expansion mounts",
        embedded: ["structural_rebar", "anchoring_hardware"]
      });
      moduleSpecs.push({
        name: "Acoustic Double Wet Kitchen Pod",
        type: "kitchen_pod",
        func: "Fully compiled kitchen unit containing integrated wastewater lines, direct venting hood chases, and shockproof anchors",
        embedded: ["plumbing_pipe", "drainage", "electrical_conduit", "soundproofing"]
      });
    }

    return moduleSpecs.map((spec, i) => {
      const module_id = `mod_${baseId}_${i+1}_${spec.type}`;
      return {
        module_id,
        name: spec.name,
        module_type: spec.type,
        function: spec.func,
        dimensions: {
          width: isSpace ? 120 : 288,
          height: isSpace ? 96 : 120,
          depth: isSpace ? 96 : 8,
          unit: isSpace ? "inches" : "inches"
        },
        materials: mats,
        embedded_systems: spec.embedded.map((embType, embIdx) => ({
          embedded_id: `${module_id}_emb_${embIdx+1}`,
          system_type: embType,
          description: `Industrial heavy-duty ${embType.replace('_', ' ')} structurally embedded directly in casting mold.`,
          inspection_required: true
        })),
        interfaces: [],
        manufacturing_processes: [
          "Steel Reinforcement Cage Bending",
          "Secondary Embed Systems Integration Routing",
          "Controlled Hydration Concrete Dispensing (50MPa)",
          "Steam Curing Chamber Exposure (12 Hours)",
          "Lifting Lug Point Integrity Stress Load Check"
        ],
        assembly_station: `Assembly Bay 0${i+1}`,
        shipping_constraints: [
          "Oversized width permit required (Over 8.5ft width).",
          "Low-vibration specialized transport flatbed with custom supportive frames.",
          "Moisture-proof wrapping mandatory for sensitive contact terminals."
        ],
        installation_requirements: [
          "Require 120-Tonne crane capacity with four-point certified pick system.",
          "Torque connection bolts to 320Nm target threshold.",
          "Pump structural non-shrink cementitious grout into socket joints."
        ],
        qc_checks: [
          "Casing dimension tolerances verification (< 3mm offset).",
          "Integrated electrical conduits continuity trace.",
          "Surface finish aesthetics review for micro-fractures or structural voids."
        ],
        human_review_required: forceReview || spec.type === "foundation_interface" || spec.type === "bathroom_pod"
      };
    });
  }

  private generateMEPForType(type: PrecastType): MEPSystem {
    const isSpace = ["space_data_center_pod", "orbital_facility", "lunar_facility"].includes(type);
    return {
      mechanical: {
        hvac_type: isSpace ? "industrial" : "heat_pump",
        duct_routes: ["Main Fresh Air Shaft (Core)", "Kitchen Ventilation Exhaust", "Integrated Ceiling Air Distribution Plenum"],
        service_access: ["Access Door Core Panel Section B", "Bathroom Pod Ceiling Hatch Panel"],
        equipment_zones: ["Building Roof Utility Platform", "Basement General HVAC Mechanical Station"]
      },
      electrical: {
        panel_locations: ["Emergency Power Room 101", "Level 1 Corridor Main Panel"],
        conduit_routes: ["Ceiling light slab power routing", "Baseboard perimeter electrical conduit socket bank"],
        lighting_zones: ["Main Egress Route Stairway", "Slab integrated decorative linear profile LEDs"],
        backup_power: ["120kW emergency generator automatic transfer hub"]
      },
      plumbing: {
        wet_zones: ["Bathroom Pod G-01", "Kitchen Utility Wall Section A"],
        riser_locations: ["Core Mechanical Shaft Wet Column"],
        drain_routes: ["Shower tray waste connection line", "Floor emergency washdown gulley drain"],
        cleanout_access: ["Behind-mirror utility closet accessibility hatch", "Main vertical column base access port"]
      },
      fire_life_safety: {
        fire_separation_zones: ["Corridor Precast Egress Fire Walls", "Stairwell Core 120min Certified Divider Panel"],
        suppression_routes: ["Dry rise water pillar along stairs", "Multi-nozzle automatic suppression tubes inside mechanical chase"],
        alarm_routes: ["Interconnected smoke warning red loop conduits"],
        egress_notes: ["Dual egress paths through stairwell modular nodes.", "Tactile photo-luminescent wayfinding floor panels."]
      }
    };
  }

  private generatePanelizationPlan(modules: PrecastModule[], type: PrecastType): PanelizationPlan {
    const isSpace = ["space_data_center_pod", "orbital_facility", "lunar_facility"].includes(type);
    
    const panels: PanelizationPanel[] = modules.map((m, idx) => ({
      panel_id: `panel_item_${idx+1}`,
      module_id: m.module_id,
      panel_type: m.module_type === "wall_panel" ? "wall" : m.module_type === "floor_plate" ? "floor" : m.module_type === "roof_panel" ? "roof" : "pod",
      dimensions: m.dimensions,
      lift_points: ["Front Lug Joint A", "Rear Lug Joint B", "Upper Stabilizer Hook Point C", "Balance Alignment Slot D"],
      embed_notes: m.embedded_systems.map(e => `${e.system_type.toUpperCase()}: ${e.description}`),
      shipping_orientation: isSpace ? "launch_restraint" : (m.module_type === "wall_panel" ? "vertical" : "flat"),
      crane_required: true
    }));

    return {
      plan_id: "pp_plan_alpha",
      strategy: "Interlocking vertical shear panels with interlocking grooved joint details to completely eradicate manual brickwork on site.",
      panels,
      max_shipping_envelope_notes: [
        "Ensure transport clearance along Highway 101 Overpasses (max height 14ft 6in).",
        "Truck drivers must conduct pre-route sweeps and obtain heavy trailer oversize permits."
      ],
      crane_access_notes: [
        "Position crane at outrigger coordinate set P1-A on solid gravel pad.",
        "Verify 120-Tonne load chart capacity limits based on active wind velocities (< 20 miles per hour)."
      ],
      staging_notes: [
        "Place panels in visual sequence with the highest numbering placed on ground level racks.",
        "Store sensitive pod modules under weatherproof high-density PVC covers."
      ]
    };
  }

  private generateFactoryStations(modules: PrecastModule[], type: PrecastType): FactoryStation[] {
    return [
      {
        station_id: "fs_prep",
        name: "Visual Steel Mould Preparation",
        purpose: "Clean heavy-duty steel molding matrices, grease forms with release agent, and set layout lasers.",
        module_ids: modules.map(m => m.module_id),
        inputs: ["Digital Vector Panel Drawings", "Mould Shell Geometry Sheet"],
        outputs: ["Cleaned Lubricated Form Shells Ready for Placement"],
        equipment: ["Laser Calibration Projectors", "Automated Release Solvent Injectors"],
        qc_gate: "Mould dimension review must meet zero tolerance offset limits."
      },
      {
        station_id: "fs_rebar",
        name: "Rebar Clamping & Embed Positioning",
        purpose: "Anchor reinforcing structural cages, locate electrical boxes, secure conduit paths, and mount lifting loops.",
        module_ids: modules.map(m => m.module_id),
        inputs: ["Steel reinforcing raw bars", "Flipped junction boxes and copper piping networks"],
        outputs: ["Armed structural cage ready for pouring stage"],
        equipment: ["Pneumatic tie wires gun chargers", "Laser alignment projection grids"],
        qc_gate: "Rebar depth cover thickness check (> 30mm concrete margins verified)."
      },
      {
        station_id: "fs_pour",
        name: "Cast Concrete Dispensation & Vibro-Compaction",
        purpose: "Dispense customized 50MPa concrete fluid evenly with continuous high-frequency hydraulic table vibration.",
        module_ids: modules.map(m => m.module_id),
        inputs: ["Certified Concrete Compound batch", "Hydraulic core extraction mandrels"],
        outputs: ["Consolidated concrete wet panels stored inside curing slots"],
        equipment: ["Vibrating steel table chassis", "Acoustic density sound scanning probes"],
        qc_gate: "Slump and humidity fluid inspection test passed successfully."
      },
      {
        station_id: "fs_cure",
        name: "Thermal Steam Curing & Gantry demoulding",
        purpose: "Expose product to steam inside enclosure slots to immediately reach stripping strength limits under 12 hours.",
        module_ids: modules.map(m => m.module_id),
        inputs: ["Active steam valves fuel", "Magnetic lifting gantry controllers"],
        outputs: ["Stripped solid concrete precast visual components ready for final tests"],
        equipment: ["High-pressure boiler system", "Overhead heavy load gantry cranes"],
        qc_gate: "Schmidt Hammer compression check (> 35MPa demould threshold achieved)."
      }
    ];
  }

  private generateAssemblySteps(modules: PrecastModule[], type: PrecastType, fStatus: FoundationStatus): PrecastAssemblyStep[] {
    return [
      {
        step_id: "step_01_foundations",
        order: 1,
        name: "Establish Foundation Interfaces & Leveling Shims",
        module_ids: modules.filter(m => m.module_type === "foundation_interface").map(m => m.module_id),
        action: "Drill foundation anchor bolt holes, secure steel aligning shim packs, and apply damp-proof coatings.",
        dependencies: [],
        site_requirements: [
          `Verify that overall building foundation is fully [${fStatus.toUpperCase()}] and structurally sound.`,
          "Perform geological survey mapping to clear soil settlement warning indicators."
        ],
        qc_gate: "Anchor bolts spacing coordinates checked down to 1mm tolerance limits.",
        human_review_required: true
      },
      {
        step_id: "step_02_verticals",
        order: 2,
        name: "Crane Placement of Load Bearing Wall Panels",
        module_ids: modules.filter(m => m.module_type === "wall_panel" || m.module_type === "facade_panel").map(m => m.module_id),
        action: "Hoist panel using spreader rig, carefully lower joints onto vertical anchor dowels, and place support braces.",
        dependencies: ["step_01_foundations"],
        site_requirements: [
          "Minimum 120-Tonne crane capacity initialized with certified rigging tags.",
          "Wind velocity gauges tracking continuous speed metrics below threshold limits."
        ],
        qc_gate: "Panel verticality plumb alignment surveyed using dual laser sight instrumentation.",
        human_review_required: true
      },
      {
        step_id: "step_03_floors",
        order: 3,
        name: "Install Flooring Plates & MEP Connections",
        module_ids: modules.filter(m => m.module_type === "floor_plate" || m.module_type === "bathroom_pod" || m.module_type === "kitchen_pod").map(m => m.module_id),
        action: "Lay prestressed hollowcore horizontal slabs over wall corbels, connect embedded PVC lines, and torque joints.",
        dependencies: ["step_02_verticals"],
        site_requirements: [
          "Secure temporary fall prevention safety nets below floor boundaries.",
          "Plumbing systems certified pressure kit calibrated appropriately on site."
        ],
        qc_gate: "Wastewater plumbing lines pressure decay leak verification checked clean under 3 bars.",
        human_review_required: false
      }
    ];
  }

  private generateBOM(modules: PrecastModule[]): PrecastBOMItem[] {
    const bom: PrecastBOMItem[] = [];
    modules.forEach((m, idx) => {
      bom.push({
        bom_item_id: `bom_conc_${idx+1}`,
        module_id: m.module_id,
        name: `${m.name} - Concrete Compound`,
        material: "Portland Cement (CEM I 52.5N) / Aggregates / Mineral Voids Filler Blend",
        quantity: m.dimensions.width === 120 ? 4.8 : 12.5,
        unit: "Cubic Yards",
        process: "Continuous Batch mixing & automated hydraulic pouring cycle.",
        notes: `Structural monolithic framing with built-in curing optimization channels.`
      });
      bom.push({
        bom_item_id: `bom_steel_${idx+1}`,
        module_id: m.module_id,
        name: `${m.name} - Steel Reinforcing Mesh`,
        material: "High-Tensile Carbon Steel Reinforcement Ribbed Mesh Cage",
        quantity: 340,
        unit: "Pounds",
        process: "Hydraulic wire bending and spot robotically welded mesh integration.",
        notes: "Provides elastic tensile integrity resisting dynamic structural shear loads."
      });
    });
    return bom;
  }

  private generateMESRouting(modules: PrecastModule[]): PrecastMESRoute[] {
    return modules.map((m, idx) => ({
      route_id: `mes_route_id_${idx+1}`,
      operation_number: (idx + 1) * 10,
      station_id: `fs_rebar`,
      operation_name: `Embed Placement Sequence For ${m.name}`,
      module_ids: [m.module_id],
      predecessors: idx === 0 ? [] : [`mes_route_id_${idx}`],
      quality_hold_required: m.human_review_required,
      signoff_role: m.human_review_required ? "Licensed Structural Structural Engineer" : "Factory QC Automation Operator"
    }));
  }

  private generateShippingPlan(modules: PrecastModule[]): PrecastShippingPlan {
    return {
      plan_id: "ship_plan_omega",
      shipments: [
        {
          shipment_id: "shipment_01",
          module_ids: modules.slice(0, 2).map(m => m.module_id),
          load_order: 1,
          truck_or_transport_type: "Specialized Triple-Axle Extendable Low-Boy Trailer",
          staging_zone: "Heavy Structural Panels Yard Area A",
          handling_notes: [
            "Always secure wood spacer blocks between stacked panels to protect pre-finished architectural concrete faces.",
            "Drivers must coordinate wide-load flashing escort pilot vehicles before transport."
          ]
        },
        {
          shipment_id: "shipment_02",
          module_ids: modules.slice(2).map(m => m.module_id),
          load_order: 2,
          truck_or_transport_type: "Standard Hydraulic flatbed Trailer with custom horizontal stabilizers",
          staging_zone: "Sensitive Component Protected Area B",
          handling_notes: [
            "Cover wet bathroom or kitchen pod modules with watertight vinyl structural tarps during stormy transit weather.",
            "Verify heavy ratchet straps anchor points are connected strictly to designated trailer tie-down bars."
          ]
        }
      ]
    };
  }

  private generateInstallationPlan(steps: PrecastAssemblyStep[]): PrecastInstallationPlan {
    return {
      plan_id: "inst_plan_alpha",
      steps,
      crane_plan_notes: [
        "Position crane strictly at coordinates 40.7128° N, 74.0060° W over verified load plates.",
        "Riggers must use certified four-leg wire rope slings with safety latch cargo hooks of 1.5 Safety factor."
      ],
      site_staging_notes: [
        "Create truck offloading buffer zones allowing 3 trailers to queue simultaneously on site.",
        "Maintain access corridors entirely unobstructed for emergency vehicle ingress and egress."
      ],
      weatherproofing_notes: [
        "Inject heavy-duty two-part elastic polyurethane sealant compound directly into exterior panel joint grooves.",
        "Verify window/door openings flashing boundaries are sealed with fire-rated expanding waterproofing sealant."
      ]
    };
  }

  private generateDOBReview(type: PrecastType, name: string): DOBReviewPackage {
    return {
      package_id: "dob_packet_01",
      drawings: [
        "Sheet A-101: Modular Floor Plan Architectural Overviews",
        "Sheet S-101: Structural Bearing Grid Lines & load Paths Diagram",
        "Sheet S-102: Precast Panels Subdivision Layout Elevation Sheets",
        "Sheet M-101: Embedded MEP Conduits & Wastewater Riser Routes Diagram"
      ],
      diagrams: [
        "Figure 1: Wall-to-Wall dowel shear interlocking socket connection details",
        "Figure 2: Leveling shim plates anchoring & non-shrink structural grout seal"
      ],
      schedules: [
        "Precast Panel Fabrication Casting Log Schedule",
        "Critical Lift Plan Safety Rigging Calculations Matrix"
      ],
      review_flags: [
        `Submit architectural blueprints packet under ${type.toUpperCase()} classification.`,
        "Precast concrete load-bearing structural calculations must be certified and signed by a licensed Structural Engineer (SE).",
        "Establish fire rating compartmentalization compliance checklist for common stair hubs."
      ],
      required_professional_review: [
        "Licensed Structural Engineer (S.E. Registration Mandatory)",
        "Master Licensed Plumbing Designer (M.P.E.)",
        "Department of Buildings (DOB) Certified Code Compliance Officer"
      ],
      disclaimer: `The ${name} DOB Review Packet contains simulated visual engineering artifacts complying with industry-standard design templates. Licensed professional approval is required on site prior to local building authority submission.`
    };
  }

  private generateQCFlags(modules: PrecastModule[], fStatus: FoundationStatus): PrecastQCFlag[] {
    const flags: PrecastQCFlag[] = [];
    
    flags.push({
      flag_id: "qc_dob_stamp_missing",
      severity: "critical",
      message: "No official stamp discovered. Precast drawings cannot proceed directly to fabrication without professional certification.",
      required_reviewer: "Licensed PE / SE Examiner"
    });

    if (fStatus !== "verified") {
      flags.push({
        flag_id: "qc_foundation_status_warn",
        severity: "warning",
        message: `Base Building Foundation Status is currently listed as [${fStatus.toUpperCase()}]. Ground survey must be locked & verified prior to deploying cranes.`,
        required_reviewer: "Civil Site Superintendent"
      });
    }

    modules.forEach(m => {
      if (m.human_review_required) {
        flags.push({
          flag_id: `qc_mod_${m.module_type}_check`,
          severity: "info",
          module_id: m.module_id,
          message: `${m.name} incorporates critical load-bearing vertical structures or sensitive high-voltage/pressure embedded ducts. Dedicated inspection signs required.`,
          required_reviewer: "Licensed QA Officer"
        });
      }
    });

    return flags;
  }

  private generateCanvas(baseId: string): PrecastEngineeringCanvas {
    const layers: PrecastCanvasLayer[] = PRECAST_LAYER_STACK.map((layerName, i) => ({
      layer_index: i,
      name: layerName,
      visible: i === 0 || i === 1 || i === 2 || i === 4 || i === 6 || i === 7 || i === 8 || i === 16 || i === 24 || i === 25,
      locked: i === 0 || i === 1,
      payload_ref: `layer_${baseId}_ref_${i}`
    }));

    return {
      canvas_id: `canvas_${baseId}`,
      sections: {
        floor_plan_input: "Interactive Vector Floor Plan Drafting Interface",
        architectural_physics_overlay: "Forces, Load Path Nodes, and Envelope Shear Boundaries Map",
        structural_grid: "A-B-C-D Longitudinal / 1-2-3-4 Transversal Survey Grid",
        load_path_diagram: "Gravity downward vectors & Lateral wind deflection paths routing",
        precast_module_tree: "Interconnected Modules nested hierarchical item tree",
        panelization_map: "Subdivided Precast Panels mapping configuration dashboard",
        mep_routing_map: "Plumbing, Electrical, and Ducts embedded routings visualization",
        bathroom_kitchen_pod_map: "Prefabricated Pod wet units dimensions and accessories coordinates",
        factory_station_plan: "Manufacturing sequence scheduling map",
        shipping_and_staging_plan: "Trailer Loading sequence checklist",
        installation_sequence: "Crane hoisting alignment timetable",
        dob_code_review_flags: "Official Department of Buildings verification warnings",
        bom_summary: "Casting raw materials volume metrics tables",
        mes_routing_summary: "Shop floor manufacturing routing queues",
        human_engineering_review_flags: "Critical certified check holds"
      },
      layers
    };
  }

  private generateExports(baseId: string): PrecastExportManifest {
    return {
      exports: [
        { type: "dob_review_packet_pdf", filename: `dob_packet_${baseId}_precast.pdf`, status: "planned" },
        { type: "dfm_report_pdf", filename: `dfm_report_${baseId}_precast.pdf`, status: "planned" },
        { type: "bom_csv", filename: `material_bom_${baseId}_precast.csv`, status: "planned" },
        { type: "mes_routing_json", filename: `mes_routing_${baseId}_shop_floor.json`, status: "planned" },
        { type: "layered_pdf", filename: `layered_canvas_${baseId}_layout.pdf`, status: "planned" },
        { type: "svg", filename: `vector_panel_grid_${baseId}.svg`, status: "planned" }
      ]
    };
  }
}

const engine = new PrecastEngineeringEngine();

/* ============================================================
   REACT COMPONENT INTERACTIVE VISUALIZER
   ============================================================ */

export default function PrecastEngineering() {
  const { t } = useLanguage();

  // Inputs state
  const [projectId, setProjectId] = useState("prj_precast_sandbox");
  const [projectName, setProjectName] = useState("");
  const [objectType, setObjectType] = useState<PrecastType>("apartment_building");
  const [buildingHeight, setBuildingHeight] = useState<string>("3_floors");
  const [foundationStatus, setFoundationStatus] = useState<FoundationStatus>("complete");
  const [designStyle, setDesignStyle] = useState<DesignStyle>("modern");
  const [customPrompt, setCustomPrompt] = useState("");
  const [requireReview, setRequireReview] = useState(true);

  // Layout active toggles
  const [includeMEP, setIncludeMEP] = useState(true);
  const [includeGrid, setIncludeGrid] = useState(true);
  const [includePanelization, setIncludePanelization] = useState(true);

  const [activeTab, setActiveTab] = useState<'canvas' | 'tree' | 'mep' | 'factory' | 'assembly' | 'dob' | 'bom'>('canvas');
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([
    "Initialized Precast One-Box Compiler kernel... standard structural schemas loaded.",
    "Hover or click modules to analyze embedded systems on the canvas."
  ]);

  const [mepPulse, setMepPulse] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<Record<string, 'idle' | 'testing' | 'passed'>>({});

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 30)]);
  };

  // Compile Engine
  const project: PrecastProject = useMemo(() => {
    addLog(`Compiling structural preset geometry under type: [${objectType.toUpperCase()}]`);
    
    const cmd: PrecastInfrastructureCommand = {
      command: "precastInfrastructure",
      input: {
        project_id: projectId,
        project_name: projectName || undefined,
        prompt: customPrompt || `Automatic layout rendering draft for modular ${objectType.replace('_', ' ')} structural panels`,
        object_type: objectType,
        building_height: buildingHeight,
        foundation_status: foundationStatus,
        design_style: designStyle,
        include_mep: includeMEP,
        include_structural_grid: includeGrid,
        include_panelization: includePanelization,
        require_human_review_flags: requireReview
      }
    };

    const res = engine.precastInfrastructure(cmd);
    addLog(`Vector compiler parsed: ${res.modules.length} panel groups, ${res.bom.length} BOM raw materials, and ${res.assembly_sequence.length} structural lifting checklist anchors.`);
    return res;
  }, [projectId, projectName, objectType, buildingHeight, foundationStatus, designStyle, customPrompt, includeMEP, includeGrid, includePanelization, requireReview]);

  // Set default selected module
  useEffect(() => {
    if (project.modules.length > 0) {
      setSelectedModuleId(project.modules[0].module_id);
    }
  }, [project]);

  // Handle Layer toggling
  const [visibleLayers, setVisibleLayers] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    const initialLayers: Record<number, boolean> = {};
    project.canvas.layers.forEach(layer => {
      initialLayers[layer.layer_index] = layer.visible;
    });
    setVisibleLayers(initialLayers);
  }, [project]);

  const toggleLayer = (idx: number) => {
    setVisibleLayers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
    addLog(`Toggled visibility overlay for: ${PRECAST_LAYER_STACK[idx]}`);
  };

  // Run mock MEP continuity test
  const handleTestMEP = (type: string) => {
    setVerifyStatus(prev => ({ ...prev, [type]: 'testing' }));
    addLog(`Injecting high-frequency network pulse down precast ${type.toUpperCase()} conduits...`);
    setMepPulse(true);
    setTimeout(() => {
      setVerifyStatus(prev => ({ ...prev, [type]: 'passed' }));
      setMepPulse(false);
      addLog(`Verification complete: ${type.toUpperCase()} channels registered 100% loop-back feedback. Zero wire degradation detected.`);
    }, 1500);
  };

  // Run mock export downloads
  const handleExport = (expType: ExportType, filename: string) => {
    addLog(`Generating export stream of format: [${expType.toUpperCase()}] -> ${filename}`);
    alert(`VisualOS Export Service Anchor Triggered:\nFormat: ${expType.toUpperCase()}\nTarget File: ${filename}\n\nSuccessfully downloaded standard Vector CAD/MES layout sheet to client filesystem.`);
  };

  // Find currently selected module
  const activeModule = useMemo(() => {
    return project.modules.find(m => m.module_id === selectedModuleId) || project.modules[0];
  }, [project, selectedModuleId]);

  return (
    <div id="precast-sandbox-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 font-sans text-black bg-white">
      
      {/* SECTION BANNER BRANDING */}
      <div className="mb-8 border-b border-black/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 text-black font-mono text-[9px] uppercase tracking-[0.18em] rounded-[2px] border border-black/10">
              <Boxes className="h-3.5 w-3.5 text-black" />
              Structural Compilation Module
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-black font-display uppercase">
              CONCRETE OS / PRECAST ATELIER
            </h2>
            <p className="text-xs text-neutral-500 max-w-2xl font-light leading-relaxed">
              Compile raw text parameters, geology data, and floor plan drafts directly into interlocking high-strength concrete panel configurations. Zero field mason work required.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-50 border border-black/10 rounded-[2px]">
            <span className="h-1.5 w-1.5 bg-black rounded-full animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-600">STATE: SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTROL AND PARAMETERS CONFIGURATION PANEL */}
        <div className="lg:col-span-4 bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              Compiler Directives
            </h3>
            <Settings className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            
            {/* Project ID & Custom Human Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Project Workspace ID
                </label>
                <input 
                  type="text" 
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Structure Label
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Brooklyn Quad"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Object Type Precast Category Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Object precast Classification
              </label>
              <select 
                value={objectType}
                onChange={(e) => setObjectType(e.target.value as PrecastType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
              >
                <optgroup label="Residential & Public Buildings">
                  <option value="apartment_building">Apartment Building (Precast Shear Walls)</option>
                  <option value="brownstone">Classic Brownstone (Brick Veneer Interlocks)</option>
                  <option value="townhouse">Modern Townhouse Row (Plumbing Wet Risers)</option>
                  <option value="neo_classical_building">Neo-Classical Hall (Heavy Ornamental Panels)</option>
                  <option value="school">Educational Academy Complex</option>
                  <option value="hospitality_building">Hospitality Resort Hotel Pods</option>
                  <option value="public_restroom">Public Restroom Lavatory Pod</option>
                </optgroup>
                <optgroup label="High-Density Industrial Infrastructure">
                  <option value="data_center">Multi-Tier Data Center Rack Hall</option>
                  <option value="chip_manufacturing_facility">High-Grade Cleanroom Semi-Conductor Fab</option>
                  <option value="factory">Generic Manufacturing Factory Floor</option>
                  <option value="warehouse">Logistics Heavy Duty Warehouse Shell</option>
                  <option value="utility_building">Utility Power Generator Plant</option>
                  <option value="infrastructure_component">Pillar/Abutment Highway Bridge Girders</option>
                </optgroup>
                <optgroup label="Extraterrestrial Outer Space Habitats">
                  <option value="space_data_center_pod">Hermetic Orbital Space Cluster Pod</option>
                  <option value="orbital_facility">Atmospheric Pressure Seal Space Station Node</option>
                  <option value="lunar_facility">Lunar Base Regolith Surface Habitants</option>
                </optgroup>
              </select>
            </div>

            {/* Heights & Styles Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Building Height
                </label>
                <select
                  value={buildingHeight}
                  onChange={(e) => setBuildingHeight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                >
                  <option value="1_floor">Single Ground Floor</option>
                  <option value="3_floors">3-Floors Low Rise</option>
                  <option value="5_floors">5-Floors Medium Apartment</option>
                  <option value="12_floors">12-Floors Super Core Tower</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Aesthetic Style
                </label>
                <select
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value as DesignStyle)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white"
                >
                  <option value="modern">Industrial Brutalist Concrete</option>
                  <option value="brownstone">Traditional Clay Brick Veneer</option>
                  <option value="neo_classical">Doric Classical Cornices Plaster</option>
                  <option value="industrial">High utility steel frame overlaps</option>
                  <option value="custom">Extreme low-temperature space composite</option>
                </select>
              </div>
            </div>

            {/* Foundation Status & Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Site Foundation Readiness
                </label>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {foundationStatus}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(["not_started", "in_progress", "complete", "verified"] as FoundationStatus[]).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFoundationStatus(status)}
                    className={`py-1 text-[9px] font-mono font-bold rounded border uppercase transition ${
                      foundationStatus === status 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout inclusion toggles */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
              <span className="block text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                System Overlays inclusions
              </span>
              
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={includeMEP}
                  onChange={(e) => setIncludeMEP(e.target.checked)}
                  className="rounded text-blue-600 outline-none w-3.5 h-3.5"
                />
                <span className="font-semibold leading-none">Embedded MEP ducts and risers</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={includeGrid}
                  onChange={(e) => setIncludeGrid(e.target.checked)}
                  className="rounded text-blue-600 outline-none w-3.5 h-3.5"
                />
                <span className="font-semibold leading-none">A-B-C structural axes alignment grid</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={includePanelization}
                  onChange={(e) => setIncludePanelization(e.target.checked)}
                  className="rounded text-blue-600 outline-none w-3.5 h-3.5"
                />
                <span className="font-semibold leading-none">Precast subdivision joint splits</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={requireReview}
                  onChange={(e) => setRequireReview(e.target.checked)}
                  className="rounded text-blue-600 outline-none w-3.5 h-3.5"
                />
                <span className="font-semibold leading-none text-rose-600">Enforce licensed human structural reviewer gate</span>
              </label>
            </div>

            {/* Prompt custom additions */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Custom structural Constraints Prompt
              </label>
              <textarea
                placeholder="e.g., Run sewage drainage along the central utility node. Reinforce corner panel plates for high wind uplift thresholds..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Compiler Trigger status logs */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400 space-y-1">
              <span className="text-gray-400 font-bold block mb-1">Active Vector Compiler State Logs:</span>
              <div className="h-28 overflow-y-auto leading-relaxed space-y-1 pr-1 border-r border-slate-900">
                {logs.map((log, i) => (
                  <div key={i} className="text-emerald-300 opacity-90 transition-all hover:opacity-100">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: MAIN INTERACTIVE DISPLAY PORTAL WITH MULTI TAB CONFIGS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* INTERACTIVE COMPRESSED CANVAS VIEWER WITH TOGGLABLE LAYERS */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-blue-600 font-mono text-[9px] font-bold rounded uppercase tracking-wider">
                    Layer Viewport
                  </span>
                  <h4 className="text-xs font-bold font-mono text-slate-100">
                    3D Precast panel Subdivision Map
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400">
                  Layers 00-26 dynamic vector projection. Choose layers to overlap architectural, structural and plumbing paths.
                </p>
              </div>
              
              {/* Dynamic Coordinate readouts */}
              <div className="flex items-center gap-3 bg-black/45 px-3 py-1.5 rounded-lg border border-white/5 font-mono text-[10px] text-blue-400">
                <span>ZOOM: 100%</span>
                <span className="text-slate-700">|</span>
                <span>COORD: S G2-04</span>
                <span className="text-slate-700">|</span>
                <span className="text-emerald-400">DFM OK</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-150">
              
              {/* LAYERS CHECKLIST BAR PANEL */}
              <div className="md:w-56 p-4 bg-slate-50/50 space-y-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Dynamic Layer Layers Stack
                  </span>
                </div>
                <div className="h-96 overflow-y-auto space-y-1.5 pr-2">
                  {project.canvas.layers.map((layer) => {
                    const isChecked = visibleLayers[layer.layer_index] ?? false;
                    return (
                      <button
                        key={layer.layer_index}
                        type="button"
                        onClick={() => toggleLayer(layer.layer_index)}
                        className={`w-full text-left px-2.5 py-1.5 text-[10px] font-mono rounded flex items-center justify-between border transition ${
                          isChecked 
                            ? 'bg-slate-900 border-slate-900 text-slate-100 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{layer.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Swapped by button press
                          className="w-3 h-3 rounded text-blue-600 pointer-events-none"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LIVE VECTOR SVG ENGINE VISUALIZATION AREA */}
              <div className="flex-1 p-5 bg-slate-950 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
                
                {/* SVG RENDERING LOOP */}
                <div className="relative w-full aspect-[4/3] max-w-full bg-[#0a0f1d] border border-slate-800 rounded-xl overflow-hidden shadow-inner p-4 flex flex-col items-center justify-center">
                  
                  {/* Subtle Grid background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

                  {/* SVG Canvas drawing precast structures */}
                  <svg viewBox="0 0 600 450" className="w-full h-full relative z-10 select-none">
                    
                    {/* Grid axes A-B-C-D / 1-2-3-4 */}
                    {includeGrid && (visibleLayers[4] || visibleLayers[5]) && (
                      <g stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3">
                        {/* Horizontal grid lines */}
                        <line x1="40" y1="80" x2="560" y2="80" />
                        <line x1="40" y1="180" x2="560" y2="180" />
                        <line x1="40" y1="280" x2="560" y2="280" />
                        <line x1="40" y1="380" x2="560" y2="380" />
                        {/* Vertical grid lines */}
                        <line x1="80" y1="40" x2="80" y2="410" />
                        <line x1="220" y1="40" x2="220" y2="410" />
                        <line x1="380" y1="40" x2="380" y2="410" />
                        <line x1="520" y1="40" x2="520" y2="410" />
                        
                        {/* Text labels for axes */}
                        <g fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          <text x="545" y="83">AX-Y1</text>
                          <text x="545" y="183">AX-Y2</text>
                          <text x="545" y="283">AX-Y3</text>
                          <text x="545" y="383">AX-Y4</text>
                          <text x="75" y="425">AX-X1</text>
                          <text x="215" y="425">AX-X2</text>
                          <text x="375" y="425">AX-X3</text>
                          <text x="515" y="425">AX-X4</text>
                        </g>
                      </g>
                    )}

                    {/* Precast Solid foundation Pad Base drawing (Layer 1) */}
                    {(visibleLayers[1] || visibleLayers[6]) && (
                      <g opacity="0.9">
                        <rect x="70" y="70" width="460" height="320" fill="none" stroke="#475569" strokeWidth="4" rx="8" />
                        <rect x="65" y="65" width="470" height="330" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />
                        <text x="80" y="60" fill="#22d3ee" fontSize="10" fontFamily="monospace" opacity="0.8">FOUNDATION BOUNDARY LIMIT</text>
                      </g>
                    )}

                    {/* Precast interlocked panels outline drawing (Layer 6 & 7) */}
                    {(visibleLayers[6] || visibleLayers[7] || visibleLayers[16]) && (
                      <g>
                        {project.modules.map((m, idx) => {
                          const isSel = m.module_id === selectedModuleId;
                          let rectX = 100 + (idx * 110);
                          let rectY = 120 + (idx * 30);
                          let rectW = 92;
                          let rectH = 140;

                          if (m.module_type === "foundation_interface") {
                            rectX = 80; rectY = 80; rectW = 440; rectH = 50;
                          } else if (m.module_type === "wall_panel") {
                            rectX = 100; rectY = 150; rectW = 120; rectH = 200;
                          } else if (m.module_type === "floor_plate") {
                            rectX = 240; rectY = 150; rectW = 130; rectH = 200;
                          } else if (m.module_type === "roof_panel") {
                            rectX = 390; rectY = 150; rectW = 120; rectH = 200;
                          }

                          return (
                            <g 
                              key={m.module_id} 
                              className="cursor-pointer transition-all duration-200"
                              onClick={() => {
                                setSelectedModuleId(m.module_id);
                                addLog(`Selected precast module from viewport click: [${m.name}]`);
                              }}
                            >
                              {/* Central concrete fill */}
                              <rect 
                                x={rectX} 
                                y={rectY} 
                                width={rectW} 
                                height={rectH} 
                                fill={isSel ? "#1e293b" : "#0f172a"} 
                                stroke={isSel ? "#3b82f6" : "#475569"} 
                                strokeWidth={isSel ? 3.5 : 2} 
                                rx="4"
                              />

                              {/* Concrete aggregates pattern */}
                              <g fill="#475569" opacity="0.3">
                                <circle cx={rectX + 20} cy={rectY + 30} r="2" />
                                <circle cx={rectX + 45} cy={rectY + 85} r="3" />
                                <circle cx={rectX + 80} cy={rectY + 40} r="1.5" />
                                <circle cx={rectX + 60} cy={rectY + 110} r="2.5" />
                              </g>

                              {/* Lift anchors rings (Layer 19 shipping highlights) */}
                              {(visibleLayers[7] || visibleLayers[19]) && (
                                <g fill="none" stroke="#e2e8f0" strokeWidth="1.5">
                                  <circle cx={rectX + 15} cy={rectY + 15} r="5" stroke="#f59e0b" />
                                  <circle cx={rectX + rectW - 15} cy={rectY + 15} r="5" stroke="#f59e0b" />
                                  <line x1={rectX + 15} y1={rectY + 15} x2={rectX + 15} y2={rectY + 25} stroke="#f59e0b" />
                                  <line x1={rectX + rectW - 15} y1={rectY + 15} x2={rectX + rectW - 15} y2={rectY + 25} stroke="#f59e0b" />
                                </g>
                              )}

                              {/* Text label in nodes */}
                              <text 
                                x={rectX + 10} 
                                y={rectY + rectH - 12} 
                                fill={isSel ? "#60a5fa" : "#94a3b8"} 
                                fontSize="8.5" 
                                fontFamily="monospace"
                              >
                                {m.module_type.substring(0, 14).toUpperCase()}
                              </text>
                              
                              {/* Selected glowing outline border */}
                              {isSel && (
                                <rect 
                                  x={rectX - 4} 
                                  y={rectY - 4} 
                                  width={rectW + 8} 
                                  height={rectH + 8} 
                                  fill="none" 
                                  stroke="#3b82f6" 
                                  strokeWidth="1" 
                                  strokeDasharray="4,4" 
                                  rx="8" 
                                />
                              )}
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Embedded MEP utility routes mapping overlays (Layer 8, 9, 10, 11) */}
                    {(includeMEP && (visibleLayers[8] || visibleLayers[9] || visibleLayers[10] || visibleLayers[11])) && (
                      <g>
                        {/* 1. Mechanical Ducts (Layer 11) HVAC Chase */}
                        {(visibleLayers[8] || visibleLayers[11]) && (
                          <g fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" opacity="0.8 animate-pulse">
                            <line x1="140" y1="160" x2="480" y2="160" />
                            <line x1="480" y1="160" x2="480" y2="340" />
                            {/* Direction vectors */}
                            <path d="M150,160 L160,157 M150,160 L160,163" stroke="#0f172a" strokeWidth="2" />
                            <circle cx="140" cy="160" r="5" fill="#22d3ee" stroke="#0a0f1d" strokeWidth="1.5" />
                            <text x="160" y="152" fill="#22d3ee" fontSize="8" fontFamily="monospace">HIGH LEVEL MECHANICAL DUCT</text>
                          </g>
                        )}

                        {/* 2. Plumbing Water pipelines (Layer 9) */}
                        {(visibleLayers[8] || visibleLayers[9]) && (
                          <g fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.9">
                            <path d="M 120 180 L 120 320 L 260 320" />
                            <circle cx="260" cy="320" r="4" fill="#3b82f6" />
                            <text x="130" y="315" fill="#3b82f6" fontSize="8" fontFamily="monospace">WET CONDUIT WATER INLET</text>
                            
                            {/* Flow Animation effect */}
                            <circle cx={mepPulse ? 200 : 120} cy={mepPulse ? 320 : 200} r="3" fill="#ffffff" />
                          </g>
                        )}

                        {/* 3. High voltage Conduits (Layer 10) */}
                        {(visibleLayers[8] || visibleLayers[10]) && (
                          <g fill="none" stroke="#eab308" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4,2" opacity="0.95">
                            <path d="M 430 180 L 430 280 L 320 280 L 320 320" />
                            <circle cx="430" cy="180" r="3.5" fill="#eab308" />
                            <text x="330" y="275" fill="#eab308" fontSize="8" fontFamily="monospace">120V ELECTRICAL CONDUIT</text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* Visual force vectors overlapping load pathways (Layer 5) */}
                    {visibleLayers[5] && (
                      <g stroke="#ef4444" strokeWidth="2.5" markerStart="url(#arrow)" fill="none">
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                          </marker>
                        </defs>
                        
                        {/* Downward Gravity loads */}
                        <line x1="160" y1="120" x2="160" y2="80" markerStart="url(#arrow)" />
                        <line x1="300" y1="120" x2="300" y2="80" markerStart="url(#arrow)" />
                        <line x1="450" y1="120" x2="450" y2="80" markerStart="url(#arrow)" />
                        
                        <text x="170" y="100" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">GRAVITY VECTORS (340kN/m)</text>
                      </g>
                    )}

                    {/* Department of Building Egress Check Flags Layer (Layer 24 & 25) */}
                    {(visibleLayers[24] || visibleLayers[25]) && (
                      <g fill="none">
                        <rect x="420" y="325" width="90" height="20" fill="#f87171" rx="3" opacity="0.25" />
                        <text x="425" y="338" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold">⚠️ DOB REVIEW FLAG</text>
                        <circle cx="410" cy="335" r="5" fill="#ef4444 animate-ping" />
                        <circle cx="410" cy="335" r="3.5" fill="#ef4444" />
                      </g>
                    )}

                  </svg>

                  {/* SVG UI Bottom Coordinates overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 px-2 py-1 rounded text-[9px] text-slate-400 font-mono flex items-center gap-2 border border-slate-850">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                    <span>SCHEMA: DIN ISO 128-20 COMPLIANT</span>
                  </div>

                </div>

                {/* VISUAL QUICK CONTROLS OR SHORT DETAILS CARD FOR THE ACTIVE VIEWPORT */}
                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-mono text-[10px]">SELECTED PRECAST MODULE SPEC:</span>
                    <div className="font-semibold text-slate-200">
                      {activeModule ? `${activeModule.name} (${activeModule.dimensions.width}" × ${activeModule.dimensions.height}" × ${activeModule.dimensions.depth}")` : "No module selected"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pr-1.5 font-mono text-[10px]">
                    <span className="text-slate-500">HUMAN GATE:</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      activeModule?.human_review_required 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {activeModule?.human_review_required ? "REVIEWS REQUIRED" : "AUTOMATED OK"}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* LOWER INTERACTIVE SPECIFICATION SCHEDULING MODULE DECK */}
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-2.5 border-b border-slate-150 flex flex-wrap gap-1.5">
              
              <button
                type="button"
                onClick={() => { setActiveTab('canvas'); addLog("Swapped specs dashboard to Live Floor Plan Configurator"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'canvas' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                1. Vector Overviews
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('tree'); addLog("Swapped specs dashboard to Precast Hierarchical Module Tree List"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'tree' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                2. Module Hierarchies
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('mep'); addLog("Swapped specs dashboard to Embedded Utilities Continuity Verification Terminal"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'mep' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                3. MEP Integrations
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('factory'); addLog("Swapped specs dashboard to Factory Casting Stations"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'factory' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                4. Factory Stations
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('assembly'); addLog("Swapped specs dashboard to Site Assembly hoists and Rigging steps"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'assembly' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                5. Rigging Steps
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('dob'); addLog("Swapped specs dashboard to Department of Buildings Engineering Filings"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'dob' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                6. DOB Submissions
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('bom'); addLog("Swapped specs data deck to Concrete, Water and Steel reinforcement BOM"); }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg border transition ${
                  activeTab === 'bom' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-100'
                }`}
              >
                7. BOM Materials
              </button>

            </div>

            <div className="p-6">
              
              {/* TAB 1: CANVAS OVERVIEWS (Active project details cards) */}
              {activeTab === 'canvas' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">PROJECT ID SERIAL</span>
                      <div className="font-mono text-xs font-bold text-slate-900">{project.precast_id}</div>
                      <p className="text-[10px] text-slate-500">Unique modular compound identifier registered under global vector hash.</p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">OBJECT CATEGORY</span>
                      <div className="text-xs font-bold text-slate-900">{this.titleCase(project.object_type)}</div>
                      <p className="text-[10px] text-slate-500">Loads calculations adjusted dynamically using specialized layout modules.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1 font-mono">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block text-blue-600">STRUCTURE METRIC</span>
                      <div className="text-xs font-bold text-emerald-600">ZERO CARBON RATIO CHECK: PASS</div>
                      <p className="text-[10px] text-slate-500">Steam cured chambers maximize concrete hydration parameters securely on site.</p>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-100 bg-blue-50/40 rounded-xl text-xs flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-blue-800">Dynamic One-Box Structural Joint logic Strategy</div>
                      <p className="text-blue-700 leading-relaxed text-[11px]">
                        The compiled design divides walls into unitized solid pre-cast modules with built-in channels. Horizontal joint interfaces are lined with high-density chemical barriers and steel dowels to prevent moisture infiltration and absorb structural loads.
                      </p>
                    </div>
                  </div>

                  {/* Active Precast Exports */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide">
                      Available certified Vector Engineering Exports
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {project.exports.exports.map((exp, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleExport(exp.type, exp.filename)}
                          className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-150 text-left flex items-center justify-between group"
                        >
                          <div className="space-y-0.5 truncate">
                            <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                              {exp.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <div className="text-[10.5px] font-medium text-slate-700 truncate group-hover:text-slate-900 font-mono">
                              {exp.filename}
                            </div>
                          </div>
                          <Download className="h-4 w-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MODULE HIERARCHIES (Precast tree and embedded checklists) */}
              {activeTab === 'tree' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Modules list */}
                  <div className="md:col-span-5 space-y-2">
                    <h5 className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wide mb-3">
                      Compiled pre-fitted Concrete Module items 
                    </h5>
                    {project.modules.map((m) => {
                      const isSel = m.module_id === selectedModuleId;
                      return (
                        <button
                          key={m.module_id}
                          type="button"
                          onClick={() => setSelectedModuleId(m.module_id)}
                          className={`w-full p-3 text-left rounded-xl border transition-all flex items-start gap-3 ${
                            isSel 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Boxes className={`h-5 w-5 shrink-0 mt-0.5 ${isSel ? 'text-blue-400' : 'text-slate-400'}`} />
                          <div className="space-y-1 text-xs truncate">
                            <div className="font-bold truncate">{m.name}</div>
                            <div className={`font-mono text-[9px] uppercase ${isSel ? 'text-slate-400' : 'text-slate-500'}`}>
                              {m.module_type.replace('_', ' ')}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Embedded details inspector of active module */}
                  <div className="md:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
                    {activeModule ? (
                      <div className="space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                          <span className="font-mono text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                            {activeModule.module_type.toUpperCase()} SPECIFICATION SHEET
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-base mt-1">
                            {activeModule.name}
                          </h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                            {activeModule.function}
                          </p>
                        </div>

                        {/* Geometric Boundaries */}
                        <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-150 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">WIDTH</span>
                            <span className="font-extrabold text-slate-800">{activeModule.dimensions.width} {activeModule.dimensions.unit}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">HEIGHT</span>
                            <span className="font-extrabold text-slate-800">{activeModule.dimensions.height} {activeModule.dimensions.unit}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">THICKNESS</span>
                            <span className="font-extrabold text-slate-800">{activeModule.dimensions.depth} {activeModule.dimensions.unit}</span>
                          </div>
                        </div>

                        {/* Materials breakdown */}
                        <div className="space-y-1.5 text-xs">
                          <span className="font-mono text-[10px] font-bold text-slate-400 block">RAW SUBSTANCE MATRIX:</span>
                          <div className="flex flex-wrap gap-1">
                            {activeModule.materials.map((mat, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10.5px] font-medium text-slate-700">
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Embedded System hardware checklist */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400 block">INTERNAL EMBEDDED CHANNELS:</span>
                          <div className="space-y-1.5">
                            {activeModule.embedded_systems.map((emb) => (
                              <div key={emb.embedded_id} className="bg-white px-3 py-2.5 rounded-xl border border-slate-150 flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-slate-800 uppercase text-[10px]">{emb.system_type.replace('_', ' ')}</span>
                                    <p className="text-[9px] text-slate-500 font-sans leading-none">{emb.description}</p>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  PRECAST OK
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs text-center py-12">
                        Select a module to examine structural boundaries.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 3: MEP COUPLINGS PLUMBING CONTINUITY VERIFIER */}
              {activeTab === 'mep' && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-mono">
                        <Cpu className="h-4 w-4" />
                        <span>INTEGRATED UTILITY LOOP-BACK INSPECTOR</span>
                      </div>
                      <h4 className="text-sm font-extrabold">Embedded Services Continuity Testing</h4>
                      <p className="text-[10px] text-slate-400 max-w-2xl">
                        Verify precast embedded conduits have survived high-vibration steam casting process before hoisting on site. Inject digital telemetry waves down plumbing, ventilation, and data loops.
                      </p>
                    </div>
                    <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400">
                      TELEMETRY STATUS: WAITING INPUT
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Mechanical Loop */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cyan-100 text-cyan-800 font-mono text-[9px] font-bold rounded uppercase">
                        Mechanical HVAC Chase
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Evaluates vertical smoke extraction manifolds and double fire dampers within wall boundaries.
                      </p>
                      <button
                        type="button"
                        disabled={verifyStatus['hvac'] === 'testing'}
                        onClick={() => handleTestMEP('hvac')}
                        className={`w-full py-2 font-mono text-[10px] font-bold uppercase rounded-lg border transition ${
                          verifyStatus['hvac'] === 'passed'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {verifyStatus['hvac'] === 'testing' ? 'TRACKING CYCLES...' : (verifyStatus['hvac'] === 'passed' ? 'VERIFIED PASSED' : 'TRIGGER CONDUIT PULSE')}
                      </button>
                    </div>

                    {/* Electrical Loop */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-100 text-yellow-800 font-mono text-[9px] font-bold rounded uppercase">
                        Electrical Conduit
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Traces continuous metallic loop paths inside the reinforced structural steel grid borders.
                      </p>
                      <button
                        type="button"
                        disabled={verifyStatus['electrical'] === 'testing'}
                        onClick={() => handleTestMEP('electrical')}
                        className={`w-full py-2 font-mono text-[10px] font-bold uppercase rounded-lg border transition ${
                          verifyStatus['electrical'] === 'passed'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {verifyStatus['electrical'] === 'testing' ? 'TRACKING CYCLES...' : (verifyStatus['electrical'] === 'passed' ? 'VERIFIED PASSED' : 'TRIGGER CONDUIT PULSE')}
                      </button>
                    </div>

                    {/* Plumbing Drainage Loop */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-[9px] font-bold rounded uppercase">
                        Plumbing Drainage
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Monitors airlock pressure drop along wastewater risers and sloped wet-wall pod floor pans.
                      </p>
                      <button
                        type="button"
                        disabled={verifyStatus['plumbing'] === 'testing'}
                        onClick={() => handleTestMEP('plumbing')}
                        className={`w-full py-2 font-mono text-[10px] font-bold uppercase rounded-lg border transition ${
                          verifyStatus['plumbing'] === 'passed'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {verifyStatus['plumbing'] === 'testing' ? 'TRACKING CYCLES...' : (verifyStatus['plumbing'] === 'passed' ? 'VERIFIED PASSED' : 'TRIGGER CONDUIT PULSE')}
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: FACTORY CASTING WORKCENTERS SCHEDULE */}
              {activeTab === 'factory' && (
                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wide mb-3 text-left">
                    Factory Casting workstations scheduling routing
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {project.factory_station_plan.map((station, idx) => (
                      <div key={station.station_id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative overflow-hidden">
                        
                        {/* Upper tracking index */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-150">
                            STATION 0{idx+1}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                            ACTIVE READY
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-slate-900">{station.name}</div>
                          <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">{station.purpose}</p>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-150 text-[10px] font-mono space-y-1">
                          <div>
                            <span className="text-slate-400 font-bold block uppercase text-[8.5px]">STATION EQ:</span>
                            <span className="truncate text-slate-700 font-bold block">{station.equipment[0] || "Standard Form"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block uppercase text-[8.5px]">QC GATE CRITERIA:</span>
                            <span className="text-slate-600 leading-relaxed block text-[9.5px]">{station.qc_gate}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SITE ASSEMBLY RIGGING AND Timetables */}
              {activeTab === 'assembly' && (
                <div className="space-y-5">
                  <div className="p-4 border border-indigo-100 bg-indigo-50/20 rounded-xl text-xs flex items-start gap-3">
                    <Activity className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="space-y-0.5 leading-relaxed">
                      <span className="font-bold text-indigo-900">Rigging Heavy Liftdraft checklist Constraints</span>
                      <p className="text-indigo-800 text-[11px]">
                        Precast panels must be hoisted horizontally or vertically according to designated cast points. Do not lift module items if active wind gusts exceed 20mph. Double taglines are required on both boundaries.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide font-mono">
                      Sequential Site Assembly Timetables Checklist:
                    </span>
                    <div className="space-y-2">
                      {project.assembly_sequence.map((step) => (
                        <div key={step.step_id} className="bg-slate-50 border border-slate-250 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-slate-900 text-white font-mono font-bold w-7 h-7 rounded flex items-center justify-center shrink-0">
                              0{step.order}
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="font-bold text-slate-900 font-sans">{step.name}</div>
                              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">{step.action}</p>
                              <div className="text-[9.5px] text-slate-400 flex flex-wrap gap-2 pt-1 font-mono">
                                <span>QC GATE: {step.qc_gate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span className="text-slate-400">STATUS:</span>
                            <span className="px-2 py-0.5 rounded font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              AWAITING CRANE SETUP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DOB BLUEPRINT FILINGS CODE SEALS SHEET */}
              {activeTab === 'dob' && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-red-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide">
                        City Department of Buildings DOB Code review package
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left list: Drawings schedules */}
                      <div className="bg-white p-3 rounded-lg border border-slate-150 space-y-2 text-xs">
                        <span className="font-mono text-[9.5px] font-bold text-slate-400 block uppercase">BLUEPRINT SHEETS COMPILING LIST:</span>
                        <ul className="space-y-1 list-disc list-inside text-slate-600">
                          {project.dob_review_package.drawings.slice(0, 5).map((dwg, i) => (
                            <li key={i}>{dwg}</li>
                          ))}
                          <li className="text-slate-400 italic">plus 9 secondary connection blueprint detail sheets...</li>
                        </ul>
                      </div>

                      {/* Right list: Professional approvals gates required */}
                      <div className="bg-white p-3 rounded-lg border border-slate-150 space-y-2 text-xs">
                        <span className="font-mono text-[9.5px] font-bold text-slate-400 block uppercase text-rose-600">MANDATORY SEAL SIGN-OFF ROLES:</span>
                        <ul className="space-y-1.5 font-mono text-[10.5px] text-slate-700 font-bold">
                          {project.dob_review_package.required_professional_review.map((rev, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              <span>{rev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Disclaimer text */}
                    <p className="text-[10px] text-slate-400 font-sans italic border-t border-slate-200 pt-3 leading-relaxed">
                      {project.dob_review_package.disclaimer}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 7: BOM RAW MATERIALS DATA TABLES */}
              {activeTab === 'bom' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden font-mono text-xs">
                    
                    {/* Headers */}
                    <div className="bg-slate-900 text-slate-300 px-4 py-2.5 grid grid-cols-12 font-bold text-[10px]">
                      <div className="col-span-3">MATERIAL COMPONENT</div>
                      <div className="col-span-4">Raw Matrix compound</div>
                      <div className="col-span-1.5 text-center">QUANTITY</div>
                      <div className="col-span-3.5 pl-4">FABRIC PROCESS CHANNELS</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-150">
                      {project.bom.map((bomItem) => (
                        <div key={bomItem.bom_item_id} className="px-4 py-2.5 grid grid-cols-12 text-[10.5px] text-slate-700 bg-white items-center">
                          <div className="col-span-3 font-bold text-slate-900 truncate pr-2">{bomItem.name}</div>
                          <div className="col-span-4 text-slate-500 truncate pr-2">{bomItem.material}</div>
                          <div className="col-span-1.5 text-center font-bold text-slate-900">{bomItem.quantity} {bomItem.unit.substring(0,6)}</div>
                          <div className="col-span-3.5 pl-4 truncate font-sans text-slate-500 text-[10.5px]">{bomItem.process}</div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ACTIVE REGULATORY COMPLIANCE AND SAFETY ALERTS */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <h4 className="text-xs font-bold text-rose-950 uppercase font-mono tracking-wider">
                ConcreteOS compliance & quality checks flags ({project.qc_flags.length})
              </h4>
            </div>

            <div className="space-y-2">
              {project.qc_flags.map((flag) => (
                <div key={flag.flag_id} className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-start justify-between gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                        flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {flag.severity} RISK
                      </span>
                      <span className="text-[9.5px] text-slate-400">{flag.flag_id}</span>
                    </div>
                    <p className="text-slate-800 font-sans text-[11.5px] leading-relaxed">
                      {flag.message}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] text-slate-400 block uppercase">REQUIRED INVESTIGATOR:</span>
                    <span className="font-bold text-slate-800 text-[10px] block">{flag.required_reviewer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   PORTION DEFINITION COMPACT PRESETS DATABASE
   ============================================================ */

function csvEscape(text: string): string {
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function brownstonePreset(type: PrecastType): PrecastPreset {
  return {
    object_type: type,
    grid_type: "bearing_wall",
    hvac_type: "heat_pump",
    modules: [
      moduleTemplateSpec("foundation_interface", "Heavy Granite Rubble Foundation Base Panel", 240, 12, 12, ["structural_rebar", "anchoring_hardware"]),
      moduleTemplateSpec("wall_panel", "Decorative Clay Brick-Veneer party Wall", 288, 120, 10, ["structural_rebar", "soundproofing", "electrical_conduit"]),
      moduleTemplateSpec("floor_plate", "Rustic Wood Infill Flooring Deck Plate", 180, 240, 6, ["structural_rebar"]),
      moduleTemplateSpec("roof_panel", "Slated Mansard Core Roof Panel", 188, 188, 8, ["waterproofing", "thermal_insulation"])
    ],
    assembly: [
      assemblyStepSpec("Granite leveling foundation", ["foundation_interface"], "Build thick solid block foundation interface."),
      assemblyStepSpec("Align party-walls split panel", ["wall_panel"], "Hoist central clay-veneer separation boundary."),
      assemblyStepSpec("Lock Horizontal composite floors", ["floor_plate"], "Lay down hollow flooring panels over perimeter brackets.")
    ]
  };
}

function neoClassicalPreset(): PrecastPreset {
  return {
    object_type: "neo_classical_building",
    grid_type: "hybrid",
    hvac_type: "radiant",
    modules: [
      moduleTemplateSpec("foundation_interface", "Monolithic Heavy Column Base support", 300, 16, 16, ["structural_rebar", "post_tensioning"]),
      moduleTemplateSpec("column", "Monolithic Doric Fluted pillar Column", 24, 180, 24, ["structural_rebar", "post_tensioning"]),
      moduleTemplateSpec("facade_panel", "Baroque Sculpted Pediment Cornice Panel", 320, 48, 12, ["anchoring_hardware"]),
      moduleTemplateSpec("floor_plate", "Poured Deck over Corrugated steel pan", 240, 240, 8, ["structural_rebar", "drainage"])
    ],
    assembly: [
      assemblyStepSpec("Rig heavy pillar foundations", ["foundation_interface"], "Cure column slots parameters."),
      assemblyStepSpec("Raise columns vertically", ["column"], "Lock vertical fluted derrick supports."),
      assemblyStepSpec("Overlap pediment ornaments", ["facade_panel"], "Bolt heavy visual pediment cornice boundaries.")
    ]
  };
}

function publicRestroomPreset(): PrecastPreset {
  return {
    object_type: "public_restroom",
    grid_type: "pod_shell",
    hvac_type: "central_air",
    modules: [
      moduleTemplateSpec("foundation_interface", "Waterproof Floor Pan Sump Trench block", 144, 8, 8, ["structural_rebar", "drainage", "waterproofing"]),
      moduleTemplateSpec("bathroom_pod", "Full washdown Composite toilet Pod Item", 120, 96, 96, ["plumbing_pipe", "drainage", "waterproofing", "electrical_conduit"])
    ],
    assembly: [
      assemblyStepSpec("Set floor pan trenches", ["foundation_interface"], "Cast slope base trench system."),
      assemblyStepSpec("Hoist pre-fitted washdown pods", ["bathroom_pod"], "Connect high load sewer output nodes directly.")
    ]
  };
}

function dataCenterPreset(): PrecastPreset {
  return {
    object_type: "data_center",
    grid_type: "column_grid",
    hvac_type: "industrial",
    modules: [
      moduleTemplateSpec("foundation_interface", "Seismic Anchor Foundation Pier Pad", 340, 14, 14, ["structural_rebar", "anchoring_hardware"]),
      moduleTemplateSpec("data_center_rack_hall", "Prefabricated Server Module corridor Pod", 288, 120, 120, ["electrical_conduit", "data_cable_path", "fire_suppression"])
    ],
    assembly: [
      assemblyStepSpec("Anchor seismic grid piers", ["foundation_interface"], "Lock anti-vibration heavy mount blocks."),
      assemblyStepSpec("Slide server rack pod cells", ["data_center_rack_hall"], "Set central core server rows alignment coordinates.")
    ]
  };
}

function chipFacilityPreset(): PrecastPreset {
  return {
    object_type: "chip_manufacturing_facility",
    grid_type: "column_grid",
    hvac_type: "industrial",
    modules: [
      moduleTemplateSpec("foundation_interface", "Deep bedrock pile pad load interface", 400, 24, 24, ["structural_rebar", "post_tensioning"]),
      moduleTemplateSpec("mep_chase", "Vertical cleanroom gaseous extraction Shaft", 180, 240, 12, ["hvac_chase", "waterproofing"])
    ],
    assembly: [
      assemblyStepSpec("Verify soil pile depth", ["foundation_interface"], "Survey pile tolerances coefficients."),
      assemblyStepSpec("Lift gaseous shafts core", ["mep_chase"], "Set central pressure balanced extraction ducts.")
    ]
  };
}

function spacePodPreset(type: PrecastType): PrecastPreset {
  return {
    object_type: type,
    grid_type: "pod_shell",
    hvac_type: "industrial",
    modules: [
      moduleTemplateSpec("foundation_interface", "Titanium capsule coupler base ring", 144, 6, 6, ["anchoring_hardware", "robot_handling_point"]),
      moduleTemplateSpec("space_pod", "Atmospheric hermetic cabin compartment", 120, 120, 120, ["waterproofing", "thermal_insulation", "robot_handling_point"])
    ],
    assembly: [
      assemblyStepSpec("Seal docking launch rings", ["foundation_interface"], "Expose joints vacuum pressure locks."),
      assemblyStepSpec("Connect isolated pod cabin", ["space_pod"], "Align automated arm capture latches coordinates.")
    ]
  };
}

function industrialPreset(type: PrecastType): PrecastPreset {
  return {
    object_type: type,
    grid_type: "column_grid",
    hvac_type: "central_air",
    modules: [
      moduleTemplateSpec("foundation_interface", "Heavy Slab Base load distributor plate", 300, 10, 10, ["post_tensioning", "drainage"]),
      moduleTemplateSpec("industrial_shell", "Modular insulated envelope siding panel", 320, 120, 8, ["thermal_insulation", "fire_suppression"])
    ],
    assembly: [
      assemblyStepSpec("Pour solid industrial base grid", ["foundation_interface"], "Cure concrete screed floor areas."),
      assemblyStepSpec("Lock outer thermal panels cladding", ["industrial_shell"], "Anchor insulated envelope segments vertically.")
    ]
  };
}

function apartmentPreset(type: PrecastType): PrecastPreset {
  return {
    object_type: type,
    grid_type: "bearing_wall",
    hvac_type: "heat_pump",
    modules: [
      moduleTemplateSpec("foundation_interface", "Solid foundation Dowel socket Pad", 288, 12, 12, ["structural_rebar", "anchoring_hardware"]),
      moduleTemplateSpec("wall_panel", "Primary load-bearing inner wall Panel", 240, 120, 8, ["structural_rebar", "electrical_conduit"])
    ],
    assembly: [
      assemblyStepSpec("Prepare ground pile slots", ["foundation_interface"], "Level shims coordinate parameters."),
      assemblyStepSpec("Raise central apartment dividing walls", ["wall_panel"], "Hoist shear panels vertical joints.")
    ]
  };
}

/* ---------------- PRESET CONVERTERS HELPERS ---------------- */

function moduleTemplateSpec(
  key: string, name: string, w: number, h: number, d: number, embedded: EmbeddedSystemType[]
): PrecastModuleTemplate {
  return {
    key,
    name,
    module_type: key as PrecastModuleType,
    function: `Provides structurally unitized bounds for the ${name}.`,
    dimensions: { width: w, height: h, depth: d, unit: "inches" },
    materials: ["C50/60 Precast Mix Compound", "Reinforced high-grade internal steel bars"],
    embedded_systems: embedded,
    manufacturing_processes: ["Steel assembly cage mapping", "Mould alignment", "Concrete distribution and curing"],
    shipping_constraints: ["Flat-bed protective shipment constraint bounds."],
    installation_requirements: ["Requires spreader bar crane lift rig hoist."],
    qc_checks: ["Acoustics checks", "Dimensions integrity tolerances scan Check"],
    human_review_required: key.includes("foundation") || key.includes("pod")
  };
}

function assemblyStepSpec(name: string, keys: string[], action: string): PrecastAssemblyTemplate {
  return {
    name,
    module_keys: keys,
    action,
    site_requirements: ["Clear hoist exclusion zone", "Calibrate weather wind gauges"],
    qc_gate: "Review horizontal coordinate offset toleration levels (<3mm)."
  };
}
