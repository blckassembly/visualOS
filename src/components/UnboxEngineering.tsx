import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Boxes, 
  GitFork, 
  Cpu, 
  Settings, 
  ChevronRight,
  ShieldAlert,
  Dna,
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
  Anchor,
  HelpCircle
} from 'lucide-react';

/* ============================================================
   TYPINGS (FROM SCHEMAS IN USER REQUEST)
   ============================================================ */

export type UnboxType =
  | "product"
  | "vehicle"
  | "ev"
  | "laptop"
  | "appliance"
  | "furniture"
  | "fashion_garment"
  | "architecture_component"
  | "building"
  | "data_center"
  | "space_station"
  | "ship"
  | "drone"
  | "robotics_system"
  | "electronics"
  | "chip_package"
  | "biomanufacturing";

export type EngineeringDomain =
  | "mechanical"
  | "electrical"
  | "electronics"
  | "aerospace"
  | "marine"
  | "automotive"
  | "product"
  | "construction"
  | "civil"
  | "architectural"
  | "chip"
  | "manufacturing"
  | "biomedical"
  | "biological";

export type InterfaceType =
  | "mechanical"
  | "structural"
  | "electrical"
  | "data"
  | "fluid"
  | "thermal"
  | "software"
  | "pressure"
  | "human_access";

export type ExportType =
  | "png"
  | "pdf"
  | "svg"
  | "layered_pdf"
  | "visualos"
  | "json_manifest"
  | "bom_csv"
  | "mes_routing_json"
  | "dfm_report_pdf";

export type ReviewSeverity = "info" | "warning" | "critical";

export interface ProductPartInput {
  part_id?: string;
  name: string;
  function?: string;
  material?: string;
  manufacturing_process?: string;
  zone?: string;
  electrical?: boolean;
  fluid?: boolean;
  thermal?: boolean;
  structural?: boolean;
  safety_critical?: boolean;
  quantity?: number;
}

export interface ProductInput {
  project_id: string;
  name: string;
  object_type: string;
  unbox_mode: UnboxType;
  engineering_domain: EngineeringDomain;
  prompt?: string;
  parts?: ProductPartInput[];
  constraints?: {
    max_visible_parts_per_module?: number;
    shipping_envelope?: string;
    installation_environment?: string;
    target_station_count?: number;
    human_review_override?: boolean;
  };
}

export interface ModulePart {
  part_id: string;
  name: string;
  function: string;
  material: string;
  manufacturing_process: string;
  quantity: number;
  visible_detail_level: "module_level" | "subassembly" | "part_level";
}

export interface ModuleInterface {
  interface_id: string;
  name: string;
  type: InterfaceType;
  connects_to_module_id: string;
  description: string;
  qc_check: string;
}

export interface BuildableModule {
  module_id: string;
  name: string;
  function: string;
  grouping_reason: string[];
  parts: ModulePart[];
  materials: string[];
  manufacturing_process: string[];
  interfaces: ModuleInterface[];
  assembly_station: string;
  qc_checks: string[];
  human_review_required: boolean;
  safety_notes: string[];
  service_access: string;
  shipping_notes: string;
}

export interface ModuleTreeNode {
  module_id: string;
  name: string;
  children: {
    part_id: string;
    name: string;
    quantity: number;
    detail_level: ModulePart["visible_detail_level"];
  }[];
}

export interface AssemblyStep {
  step_id: string;
  order: number;
  name: string;
  module_ids: string[];
  action: string;
  dependencies: string[];
  station_id: string;
  tools: string[];
  qc_gate: string;
  human_review_required: boolean;
}

export interface ManufacturingStation {
  station_id: string;
  name: string;
  purpose: string;
  module_ids: string[];
  inputs: string[];
  outputs: string[];
  equipment: string[];
  qc_gate: string;
}

export interface WorkOrder {
  work_order_id: string;
  station_id: string;
  title: string;
  module_ids: string[];
  operation_summary: string;
  required_inputs: string[];
  expected_outputs: string[];
  qc_checks: string[];
  human_review_required: boolean;
}

export interface MESOperation {
  route_id: string;
  operation_number: number;
  station_id: string;
  operation_name: string;
  module_ids: string[];
  predecessors: string[];
  quality_hold_required: boolean;
  signoff_role: string;
}

export interface BOMItem {
  bom_item_id: string;
  scope: "module" | "assembly";
  module_id?: string;
  name: string;
  material: string;
  process: string;
  quantity: number;
  notes: string;
}

export interface ExplodedModuleView {
  view_id: string;
  title: string;
  strategy: "module_only" | "subassembly" | "part_level";
  modules: {
    module_id: string;
    name: string;
    offset: { x: number; y: number; z: number };
    callouts: string[];
  }[];
  notes: string[];
}

export interface CanvasLayer {
  layer_index: number;
  name: string;
  locked: boolean;
  visible: boolean;
  payload_ref: string;
}

export interface UnboxCanvas {
  canvas_id: string;
  sections: {
    product_hero_view: string;
    module_tree: string;
    exploded_module_view: string;
    interface_map: string;
    assembly_sequence: string;
    manufacturing_line: string;
    bom_summary: string;
    qc_review_flags: string;
  };
  layers: CanvasLayer[];
}

export interface PackagingPlan {
  package_id: string;
  module_id: string;
  crate_type: string;
  protection_notes: string;
  handling_notes: string;
  staging_zone: string;
}

export interface ShippingPlan {
  shipment_id: string;
  package_ids: string[];
  sequence: number;
  notes: string;
}

export interface InstallationStep {
  install_step_id: string;
  order: number;
  action: string;
  module_ids: string[];
  prerequisites: string[];
  qc_gate: string;
}

export interface ReviewFlag {
  flag_id: string;
  severity: ReviewSeverity;
  module_id?: string;
  message: string;
  required_reviewer: string;
}

export interface ExportManifest {
  exports: {
    type: ExportType;
    filename: string;
    status: "planned" | "generated";
  }[];
}

export interface UnboxResult {
  unbox_id: string;
  project_id: string;
  object_type: string;
  unbox_mode: UnboxType;
  canvas: UnboxCanvas;
  modules: BuildableModule[];
  module_tree: ModuleTreeNode[];
  interfaces: ModuleInterface[];
  assembly_sequence: AssemblyStep[];
  manufacturing_line: ManufacturingStation[];
  work_orders: WorkOrder[];
  mes_routing: MESOperation[];
  exploded_module_view: ExplodedModuleView;
  module_bom: BOMItem[];
  assembly_bom: BOMItem[];
  packaging_plan: PackagingPlan[];
  shipping_plan: ShippingPlan[];
  installation_plan: InstallationStep[];
  dfm_notes: string[];
  material_notes: string[];
  qc_review_flags: ReviewFlag[];
  human_review_required: boolean;
  exports: ExportManifest;
}

/* ============================================================
   PRESET SCHEMAS & HELPERS (FROM USER REQUEST)
   ============================================================ */

export interface ModuleTemplate {
  key: string;
  name: string;
  function: string;
  grouping_reason: string[];
  keywords: string[];
  base_parts: {
    name: string;
    function: string;
    material: string;
    manufacturing_process: string;
    quantity: number;
  }[];
  materials: string[];
  processes: string[];
  qc_checks: string[];
  service_access: string;
  shipping_notes: string;
}

export interface AssemblyTemplate {
  name: string;
  module_keys: string[];
  action: string;
  tools: string[];
  qc_gate: string;
}

export interface Preset {
  mode: UnboxType;
  modules: ModuleTemplate[];
  assembly: AssemblyTemplate[];
}

function moduleTemplate(
  key: string,
  name: string,
  func: string,
  grouping_reason: string[],
  keywords: string[],
  base_parts_names: string[],
  materials: string[],
  processes: string[],
  qc_checks: string[]
): ModuleTemplate {
  return {
    key,
    name,
    function: func,
    grouping_reason,
    keywords,
    base_parts: base_parts_names.map(partName => ({
      name: partName,
      function: `Structural supporting subpart for the ${name}`,
      material: materials[0] || 'Steel Alloy',
      manufacturing_process: processes[0] || 'Fabrication',
      quantity: 1
    })),
    materials,
    processes: processes,
    qc_checks,
    service_access: "Standard ground-level technician utility door",
    shipping_notes: "Crate flat inside clean shock-resistant environmental packaging envelope."
  };
}

function station(
  name: string, 
  module_keys: string[], 
  action: string, 
  tools: string[], 
  qc_gate: string
): AssemblyTemplate {
  return { name, module_keys, action, tools, qc_gate };
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

/* ---------------- PRESET CONFIGURATIONS (LITERAL FROM PORTION DEFINITIONS) ---------------- */

const EV_MODULES: ModuleTemplate[] = [
  moduleTemplate(
    "body_in_white",
    "Body-in-White Module",
    "Forms the upper vehicle shell and closure mounting envelope.",
    ["structural load path", "body process", "assembly marriage"],
    ["body", "shell", "frame", "roof", "pillar", "biw"],
    ["stamped side structure", "roof rail assembly"],
    ["steel", "aluminum", "structural adhesive"],
    ["stamping", "robotic welding", "adhesive bonding", "e-coat"],
    ["body datum scan", "weld integrity check", "mounting boss location check"]
  ),
  moduleTemplate(
    "skateboard_chassis",
    "Skateboard Chassis Module",
    "Supports battery, suspension, drive units, and body mounting.",
    ["structural load path", "assembly order", "shipping envelope"],
    ["chassis", "skateboard", "subframe", "frame", "crossmember"],
    ["front structural rail", "rear structural rail"],
    ["aluminum", "steel inserts", "fasteners"],
    ["extrusion", "casting", "friction-stir welding", "robotic fastening"],
    ["chassis flatness scan", "mounting torque audit", "datum alignment check"]
  ),
  moduleTemplate(
    "battery_pack",
    "Battery Pack Module",
    "Stores propulsion energy and integrates enclosure, cells, busbars, sensors, and safety disconnects.",
    ["safety risk", "electrical routing", "thermal routing", "shipping constraints"],
    ["battery", "cell", "pack", "module", "busbar", "bms"],
    ["battery enclosure", "cell module group"],
    ["aluminum", "copper", "polymer isolators", "lithium-ion cells"],
    ["cell placement", "laser welding", "sealant dispense", "end-of-line electrical test"],
    ["isolation resistance test", "leak test", "BMS communication check", "thermal sensor check"]
  ),
  moduleTemplate(
    "front_suspension",
    "Front Suspension Module",
    "Controls front wheel motion, steering geometry, and road loads.",
    ["function", "service access", "assembly station"],
    ["front suspension", "steering", "control arm", "knuckle", "damper"],
    ["front control arm set", "front damper assembly"],
    ["aluminum", "steel", "rubber bushings"],
    ["forging", "machining", "press fit", "torque fastening"],
    ["torque audit", "steering angle check", "bushing press depth check"]
  ),
  moduleTemplate(
    "rear_suspension",
    "Rear Suspension Module",
    "Controls rear wheel motion and rear load transfer.",
    ["function", "service access", "assembly station"],
    ["rear suspension", "trailing arm", "multi-link", "rear knuckle"],
    ["rear link set", "rear damper assembly"],
    ["aluminum", "steel", "rubber bushings"],
    ["forging", "machining", "press fit", "torque fastening"],
    ["torque audit", "alignment pre-check", "bushing press depth check"]
  ),
  moduleTemplate(
    "drive_unit",
    "Motor / Drive Unit Module",
    "Converts battery energy into propulsion torque.",
    ["electrical routing", "thermal routing", "service zone"],
    ["motor", "inverter", "drive", "gearbox", "e-axle"],
    ["electric motor", "inverter"],
    ["copper", "electrical steel", "aluminum", "power electronics"],
    ["motor winding", "inverter assembly", "gear mesh setup", "dyno test"],
    ["insulation test", "inverter communication check", "dyno spin test", "coolant leak check"]
  ),
  moduleTemplate(
    "cooling_system",
    "Cooling System Module",
    "Moves heat away from battery, drive units, electronics, and cabin loops.",
    ["fluid routing", "thermal routing", "assembly order"],
    ["cooling", "radiator", "pump", "chiller", "coolant", "thermal"],
    ["coolant pump set", "thermal manifold"],
    ["aluminum", "polymer hoses", "seals", "coolant"],
    ["hose routing", "manifold assembly", "pressure test", "fill and bleed"],
    ["pressure decay test", "flow test", "sensor check"]
  ),
  moduleTemplate(
    "interior_tub",
    "Interior Tub Module",
    "Combines seats, floor trim, consoles, controls, and occupant touch zones.",
    ["assembly order", "service zones", "material"],
    ["seat", "interior", "console", "dashboard", "carpet", "trim"],
    ["seat set", "instrument panel carrier"],
    ["polymer", "foam", "fabric", "metal brackets"],
    ["trim assembly", "seat assembly", "robotic assist install"],
    ["fit and finish check", "seat bolt torque audit", "airbag connector check"]
  ),
  moduleTemplate(
    "door_module",
    "Door Module",
    "Provides closure, crash protection, glass lift, latch, speakers, and weather sealing.",
    ["function", "service access", "parallel assembly"],
    ["door", "latch", "window regulator", "speaker"],
    ["door shell", "latch and regulator set"],
    ["steel", "aluminum", "glass", "rubber seals"],
    ["hemming", "seal install", "latch install", "closure test"],
    ["water leak check", "gap and flush check", "latch close effort check"]
  ),
  moduleTemplate(
    "glass_module",
    "Glass Module",
    "Provides windshield, side glass, roof glass, and rear glass zones.",
    ["material", "adhesive process", "assembly order"],
    ["glass", "windshield", "window", "roof glass"],
    ["windshield", "rear glass"],
    ["laminated glass", "tempered glass", "urethane adhesive"],
    ["surface prep", "robotic urethane dispense", "glass set"],
    ["adhesive bead inspection", "water leak test", "optical distortion check"]
  ),
  moduleTemplate(
    "wiring_harness",
    "Wiring Harness Module",
    "Routes low-voltage, signal, sensor, and power distribution through the vehicle.",
    ["electrical routing", "assembly order", "service zones"],
    ["wiring", "harness", "connector", "lv", "power distribution"],
    ["main body harness", "underbody harness"],
    ["copper", "polymer insulation", "connectors", "clips"],
    ["cut/strip/crimp", "harness board assembly", "continuity test"],
    ["continuity test", "connector lock check", "routing clip audit"]
  ),
  moduleTemplate(
    "electronics_ecu",
    "Electronics / ECU Module",
    "Controls vehicle software, sensors, compute, power distribution, and diagnostics.",
    ["software", "electrical routing", "QC risk"],
    ["ecu", "compute", "electronics", "sensor", "gateway", "controller"],
    ["vehicle compute unit", "power distribution unit"],
    ["PCB", "aluminum housing", "connectors", "thermal pads"],
    ["SMT", "conformal coat", "enclosure assembly", "software flash"],
    ["software flash verification", "network communication check", "thermal interface check"]
  ),
  moduleTemplate(
    "exterior_trim",
    "Exterior Trim Module",
    "Provides exterior finish, aero covers, lighting bezels, and serviceable finish parts.",
    ["final assembly", "surface finish", "service access"],
    ["trim", "fascia", "bumper", "cladding", "badge", "lighting"],
    ["front fascia", "rear fascia"],
    ["painted polymer", "clips", "fasteners"],
    ["injection molding", "paint", "clip install"],
    ["gap and flush check", "paint defect check", "clip retention check"]
  )
];

const EV_ASSEMBLY: AssemblyTemplate[] = [
  station("Chassis frame assembly", ["skateboard_chassis"], "Build the skateboard chassis on a rolling datum fixture.", ["datum fixture", "torque tools", "scan cell"], "Chassis geometry released."),
  station("Battery enclosure assembly", ["battery_pack"], "Assemble, seal, and test the battery pack.", ["HV-safe tools", "leak tester", "EOL electrical tester"], "Pack isolation, seal, and BMS checks passed."),
  station("Battery pack installation", ["skateboard_chassis", "battery_pack"], "Install battery pack into chassis with controlled torque and HV lockout.", ["lift table", "torque tools", "HV PPE"], "Pack mounted and HV safety hold cleared."),
  station("Suspension installation", ["front_suspension", "rear_suspension"], "Install front and rear suspension modules.", ["suspension lift", "torque tools"], "Suspension torque and alignment pre-check passed."),
  station("Drive unit installation", ["drive_unit"], "Install drive unit and connect mechanical, electrical, and cooling interfaces.", ["lift assist", "HV-safe tools"], "Drive unit interface check passed."),
  station("Cooling loop installation", ["cooling_system"], "Route coolant loops and pressure-test the thermal system.", ["hose tooling", "pressure tester", "fill cart"], "Cooling loop leak and flow checks passed."),
  station("Body shell marriage", ["body_in_white", "skateboard_chassis"], "Lower body-in-white onto chassis and secure structural mounts.", ["body marriage lift", "torque tools", "vision alignment"], "Body/chassis datum alignment passed."),
  station("Wiring harness install", ["wiring_harness", "electronics_ecu"], "Install main harnesses and electronics modules.", ["ESD tools", "diagnostic tester"], "Continuity, network, and software pre-flash checks passed."),
  station("Interior install", ["interior_tub"], "Install interior tub, seats, trim, and occupant interfaces.", ["trim tools", "seat lift", "torque tools"], "Interior fit and seat torque checks passed."),
  station("Doors / glass / trim", ["door_module", "glass_module", "exterior_trim"], "Install doors, glass, seals, and exterior trim.", ["glass robot", "closure rig", "trim tools"], "Water leak, closure, and fit-and-finish checks passed."),
  station("Software flash", ["electronics_ecu"], "Load signed software, calibrate sensors, and run diagnostics.", ["secure flashing station", "diagnostic rig"], "Software version, calibration, and network checks passed."),
  station("QC and test", ["body_in_white", "skateboard_chassis", "battery_pack", "drive_unit", "cooling_system", "electronics_ecu"], "Run final inspection, dynamic test, leak test, and release checks.", ["EOL dyno", "water booth", "scan tunnel"], "Final release requires human engineering signoff.")
];

const SPACE_STATION_MODULES: ModuleTemplate[] = [
  moduleTemplate("pressure_core", "Pressure Core Module", "Provides the primary habitable pressure volume and structural backbone.", ["pressure boundary", "safety risk", "launch packaging"], ["pressure", "habitat", "core", "shell"], ["pressure shell", "internal rack rails"], ["aluminum-lithium", "composite insulation", "seals"], ["pressure-shell fabrication", "NDE", "cleanroom integration", "pressure test"], ["proof pressure test", "leak test", "NDE review"]),
  moduleTemplate("docking_node", "Docking Node Module", "Adds berthing, docking, hatch transfer, and visiting-vehicle interfaces.", ["interface concentration", "pressure boundary", "orbital assembly"], ["dock", "node", "berthing", "hatch"], ["docking ring", "hatch assembly"], ["aluminum", "titanium", "pressure seals"], ["precision machining", "seal integration", "functional test"], ["seal compression check", "docking latch test", "pressure leak test"]),
  moduleTemplate("truss_spine", "Truss Spine Module", "Carries solar, radiator, robotics, payload, and cable routing loads.", ["structural load path", "deployment order", "external routing"], ["truss", "spine", "beam", "mast"], ["deployable <NAME> truss", "structural track rails"], ["aluminum", "composite tubes", "fasteners"], ["truss assembly", "deployment test", "vibration test"], ["deployment test", "alignment check", "launch lock release check"]),
  moduleTemplate("solar_array", "Solar Array Wing Module", "Generates station power and deploys from compact launch packaging.", ["electrical routing", "deployment", "launch packaging"], ["solar", "array", "wing", "panel", "power"], ["solar blanket set", "deployment hinge"], ["solar cells", "composite substrate", "harnesses"], ["cell layup", "deployment mechanism assembly", "power test"], ["power output test", "deployment test", "insulation check"]),
  moduleTemplate("radiator_module", "Radiator Module", "Rejects heat from internal systems and power electronics.", ["thermal routing", "deployment", "external assembly"], ["radiator", "thermal", "heat", "cooling"], ["radiator panel", "thermal fluid manifold"], ["aluminum", "thermal coatings", "fluid tubing"], ["brazing", "coating", "leak test", "deployment test"], ["leak test", "thermal flow test", "coating inspection"]),
  moduleTemplate("life_support", "Life-Support Module", "Maintains atmosphere, water recovery, air scrubbing, and crew survival systems.", ["safety risk", "fluid routing", "maintenance zone"], ["life support", "eclss", "oxygen", "water", "scrubber"], ["atmosphere processing rack", "water recovery rack"], ["stainless steel", "filters", "electronics", "hoses"], ["rack integration", "cleanliness test", "functional test"], ["ECLSS functional test", "fluid leak test", "sensor calibration"]),
  moduleTemplate("cargo_module", "Cargo Module", "Adds pressurized storage, spares, food, tools, and payload capacity.", ["function", "staging", "service access"], ["cargo", "storage", "payload", "rack"], ["cargo rack set"], ["aluminum", "soft goods", "restraints"], ["rack assembly", "stowage verification"], ["restraint check", "mass properties check"]),
  moduleTemplate("robotics_arm", "Robotics Arm Module", "Handles external assembly, inspection, payload transfer, and maintenance support.", ["external assembly", "software", "safety risk"], ["robot", "arm", "manipulator", "grapple"], ["manipulator arm", "end effector"], ["aluminum", "composite", "motors", "sensors"], ["precision assembly", "joint calibration", "software integration"], ["joint calibration", "force/torque sensor check", "software safety test"]),
  moduleTemplate("propulsion_module", "Propulsion Module", "Provides attitude control, reboost, docking support, and propellant interfaces.", ["safety risk", "fluid routing", "orbital assembly"], ["propulsion", "thruster", "propellant", "rcs"], ["thruster cluster", "propellant tank set"], ["titanium", "high-temp alloy", "valves", "propellant lines"], ["pressure vessel fabrication", "tube routing", "leak test", "hot-fire acceptance"], ["proof pressure test", "leak test", "valve functional test"]),
  moduleTemplate("avionics_module", "Avionics Module", "Controls command, data handling, comms, navigation, power management, and fault response.", ["electrical routing", "software", "safety risk"], ["avionics", "compute", "comms", "navigation", "power"], ["flight computer rack", "comms unit"], ["PCB", "aluminum chassis", "harnesses", "RF components"], ["SMT", "rack integration", "software load", "EMI test"], ["software verification", "network check", "EMI/EMC check"]),
  moduleTemplate("airlock_module", "Airlock Module", "Provides pressure isolation and external access.", ["pressure boundary", "human access", "safety risk"], ["airlock", "eva", "hatch", "suit"], ["airlock shell", "outer hatch"], ["aluminum-lithium", "seals", "valves"], ["pressure-shell fabrication", "seal integration", "pressure test"], ["leak test", "hatch cycle test", "pressure equalization test"]),
  moduleTemplate("crew_module", "Crew Module", "Adds crew sleep, hygiene, human factors, and emergency support volume.", ["human factors", "maintenance zone", "assembly order"], ["crew", "sleep", "galley", "hygiene"], ["crew quarter set", "human factors panel set"], ["soft goods", "aluminum", "polymer", "electronics"], ["interior rack integration", "human factors checkout"], ["crew interface check", "airflow check", "lighting check"])
];

const SPACE_STATION_ASSEMBLY: AssemblyTemplate[] = [
  station("Launch pressure core", ["pressure_core"], "Launch and activate the pressure core.", ["launch adapter", "checkout software"], "Pressure, power, and telemetry checks passed."),
  station("Attach docking node", ["docking_node", "pressure_core"], "Attach docking node to pressure core.", ["robotic arm", "capture latches"], "Docking latch and pressure seal checks passed."),
  station("Deploy truss spine", ["truss_spine"], "Deploy or attach external truss spine.", ["robotic arm", "deployment locks"], "Truss deployment and alignment checks passed."),
  station("Attach solar arrays", ["solar_array", "truss_spine"], "Attach and deploy solar array wings.", ["robotic arm", "power checkout"], "Power output and deployment checks passed."),
  station("Attach radiators", ["radiator_module", "truss_spine"], "Attach radiator modules and connect thermal loops.", ["robotic arm", "fluid quick-disconnect tooling"], "Thermal leak and flow checks passed."),
  station("Connect life-support module", ["life_support", "pressure_core"], "Install and activate life-support racks.", ["rack handling tools", "sensor checkout"], "ECLSS function and sensor checks passed."),
  station("Add cargo and crew modules", ["cargo_module", "crew_module"], "Attach cargo and crew support modules.", ["robotic arm", "berthing tools"], "Mass properties and pressure checks passed."),
  station("Install robotics arm", ["robotics_arm", "truss_spine"], "Install robotics arm for future assembly and inspection.", ["robotic grapple", "joint calibration tools"], "Joint calibration and safing checks passed."),
  station("Add propulsion and avionics", ["propulsion_module", "avionics_module"], "Install propulsion and avionics modules.", ["fluid checkout", "software verification"], "Integrated propulsion and avionics checks passed."),
  station("Install airlock", ["airlock_module"], "Attach airlock and run hatch, seal, and pressure cycling tests.", ["berthing tools", "pressure test kit"], "Airlock leak and hatch cycle checks passed.")
];

const BUILDING_MODULES: ModuleTemplate[] = [
  moduleTemplate("foundation", "Foundation Module", "Transfers building loads into the ground system.", ["structural load path", "construction order", "safety risk"], ["foundation", "pile", "footing", "slab"], ["foundation grid"], ["reinforced concrete", "rebar", "anchor bolts"], ["excavation", "formwork", "rebar placement", "concrete pour"], ["geotech review", "rebar inspection", "concrete strength test"]),
  moduleTemplate("core", "Core Module", "Provides lateral stability, elevators, stairs, services, and vertical circulation.", ["structural load path", "MEP routing", "construction sequence"], ["core", "shear wall", "elevator", "stair"], ["core wall system"], ["reinforced concrete", "steel embeds", "fireproofing"], ["jump-form", "rebar placement", "embed installation"], ["verticality survey", "embed inspection", "concrete strength test"]),
  moduleTemplate("floor_plate", "Floor Plate Module", "Creates repeatable usable floor areas.", ["repeatable module", "assembly order", "structural grid"], ["floor", "deck", "plate", "slab"], ["floor deck bay"], ["steel deck", "concrete", "fireproofing"], ["steel erection", "deck placement", "concrete pour"], ["deck fastening inspection", "slab levelness check"]),
  moduleTemplate("column_grid", "Column Grid Module", "Provides vertical gravity load path and structural bay rhythm.", ["structural load path", "repeatable grid", "assembly order"], ["column", "grid", "beam", "steel"], ["column bay set"], ["structural steel", "bolts", "fireproofing"], ["fabrication", "erection", "bolt tensioning"], ["bolt torque check", "weld inspection", "plumbness survey"]),
  moduleTemplate("mechanical_shaft", "Mechanical Shaft Module", "Routes ventilation, exhaust, risers, and service access vertically.", ["MEP routing", "maintenance zone", "fire/life safety"], ["shaft", "mechanical", "riser", "duct"], ["mechanical shaft liner"], ["rated wall panels", "steel studs", "firestop"], ["prefab wall assembly", "duct install", "firestop"], ["firestop inspection", "shaft pressure check"]),
  moduleTemplate("facade_panel", "Façade Panel Module", "Closes the building envelope and manages weather, thermal, and visual performance.", ["shipping envelope", "repeatable module", "assembly order"], ["facade", "curtain wall", "panel", "window"], ["curtain wall panel"], ["glass", "aluminum mullions", "gaskets", "anchors"], ["unitized fabrication", "glazing", "crane install"], ["water infiltration test", "anchor check", "glass inspection"]),
  moduleTemplate("elevator", "Elevator Module", "Provides vertical transport, hoistway equipment, and control systems.", ["function", "safety risk", "commissioning"], ["elevator", "lift", "hoist", "cab"], ["elevator cab and rail kit"], ["steel rails", "cab panels", "motors", "controls"], ["rail install", "cab install", "controller setup"], ["code inspection", "brake test", "door interlock test"]),
  moduleTemplate("stair", "Stair Module", "Provides emergency egress and vertical circulation.", ["life safety", "repeatable module", "construction order"], ["stair", "egress", "landing"], ["prefabricated stair flight"], ["steel", "concrete", "rails"], ["prefabrication", "crane set", "weld/bolt connection"], ["egress width check", "handrail inspection", "fire rating check"]),
  moduleTemplate("roof_crown", "Roof / Crown Module", "Completes the top enclosure, equipment support, and architectural identity.", ["final structure", "weather enclosure", "shipping sequence"], ["roof", "crown", "spire", "top"], ["roof equipment platform"], ["steel", "roof membrane", "insulation", "anchors"], ["roof framing", "membrane install", "equipment setting"], ["waterproofing test", "anchor inspection", "fall protection check"]),
  moduleTemplate("electrical_distribution", "Electrical Distribution Module", "Routes power from service entry to floors, equipment, lighting, and emergency systems.", ["electrical routing", "commissioning", "safety risk"], ["electrical", "switchgear", "busway", "panel", "power"], ["electrical riser kit"], ["copper", "conduit", "switchgear", "panels"], ["prefab electrical", "termination", "megger test"], ["continuity test", "insulation resistance test", "panel labeling check"]),
  moduleTemplate("plumbing_riser", "Plumbing Riser Module", "Routes domestic water, waste, vent, and specialty fluids vertically.", ["fluid routing", "maintenance zone", "construction order"], ["plumbing", "water", "waste", "riser"], ["plumbing riser kit"], ["copper", "PEX", "cast iron", "valves"], ["prefab piping", "pressure test", "flush"], ["pressure test", "slope check", "valve access check"]),
  moduleTemplate("hvac", "HVAC Module", "Provides heating, cooling, ventilation, air distribution, and controls.", ["thermal routing", "MEP routing", "commissioning"], ["hvac", "air", "duct", "ahu", "ventilation"], ["air handling kit"], ["galvanized steel", "insulation", "controls", "filters"], ["duct fabrication", "equipment setting", "balancing"], ["air balance test", "filter access check", "controls verification"])
];

const BUILDING_ASSEMBLY: AssemblyTemplate[] = [
  station("Build foundation", ["foundation"], "Build foundation, install embeds, and release survey datums.", ["survey tools", "rebar inspection", "concrete testing"], "Geotech, rebar, concrete, and datum checks passed."),
  station("Install core", ["core"], "Build the central core and vertical stability system.", ["jump form", "survey tools"], "Core verticality and concrete strength released."),
  station("Stack structural floor modules", ["column_grid", "floor_plate"], "Erect columns and floor plates in repeatable structural zones.", ["crane", "bolt tools", "survey tools"], "Structural inspection per zone passed."),
  station("Attach façade panels", ["facade_panel"], "Attach unitized façade panels after structural zones release.", ["crane", "façade rig"], "Envelope anchor and water checks passed."),
  station("Route MEP risers", ["mechanical_shaft", "electrical_distribution", "plumbing_riser", "hvac"], "Install vertical MEP risers and main services.", ["prefab racks", "commissioning tools"], "MEP pressure, continuity, firestop, and access checks passed."),
  station("Install vertical circulation", ["elevator", "stair"], "Install elevator and stair life-safety systems.", ["elevator tools", "stair setting rig"], "Elevator, stair, and egress inspections passed."),
  station("Complete roof/crown module", ["roof_crown"], "Finish top enclosure, roof equipment, waterproofing, and crown elements.", ["crane", "waterproofing test tools"], "Roof and crown inspection passed."),
  station("Inspection and commissioning", ["foundation", "core", "floor_plate", "column_grid", "facade_panel", "electrical_distribution", "plumbing_riser", "hvac"], "Run final commissioning, code inspections, and owner turnover checks.", ["commissioning tools", "inspection checklist"], "Final commissioning requires licensed professional signoff.")
];

/* ============================================================
   ENGINE IMPLEMENTATION WITH HIGH FIDELITY
   ============================================================ */

class UnboxEngineeringEngine {
  private getPreset(mode: UnboxType): Preset {
    if (mode === "space_station") {
      return { mode, modules: SPACE_STATION_MODULES, assembly: SPACE_STATION_ASSEMBLY };
    }
    if (mode === "building" || mode === "architecture_component") {
      return { mode, modules: BUILDING_MODULES, assembly: BUILDING_ASSEMBLY };
    }
    // Default / EV
    return { mode: "ev", modules: EV_MODULES, assembly: EV_ASSEMBLY };
  }

  public unboxProduct(input: ProductInput): UnboxResult {
    const preset = this.getPreset(input.unbox_mode);
    const unbox_id = makeId("unbox");

    const modules = this.groupPartsIntoModules(input, preset);
    const interfaces = this.defineModuleInterfaces(modules, preset);
    const modulesWithInterfaces = modules.map((module) => ({
      ...module,
      interfaces: interfaces.filter((i) => i.interface_id.startsWith(`${module.module_id}__`))
    }));

    const assembly_sequence = this.createAssemblySequence(modulesWithInterfaces, preset);
    const manufacturing_line = this.createManufacturingLine(assembly_sequence, modulesWithInterfaces);

    return {
      unbox_id,
      project_id: input.project_id,
      object_type: input.object_type,
      unbox_mode: input.unbox_mode,
      canvas: this.createUnboxCanvas(unbox_id),
      modules: modulesWithInterfaces,
      module_tree: this.createModuleTree(modulesWithInterfaces),
      interfaces,
      assembly_sequence,
      manufacturing_line,
      work_orders: this.createWorkOrders(manufacturing_line, modulesWithInterfaces),
      mes_routing: this.createMESRouting(assembly_sequence),
      exploded_module_view: this.createExplodedModuleView(modulesWithInterfaces),
      module_bom: this.createModuleBOM(modulesWithInterfaces),
      assembly_bom: this.createAssemblyBOM(modulesWithInterfaces),
      packaging_plan: this.createPackagingPlan(modulesWithInterfaces),
      shipping_plan: this.createShippingPlan(modulesWithInterfaces),
      installation_plan: this.createInstallationPlan(assembly_sequence),
      dfm_notes: this.createDFMNotes(input),
      material_notes: modulesWithInterfaces.map((m) => `${m.name}: ${m.materials.join(", ")}`),
      qc_review_flags: this.runUnboxQC(input, modulesWithInterfaces, assembly_sequence, interfaces),
      human_review_required: this.requiresHumanReview(input),
      exports: this.createExportManifest(unbox_id, input.unbox_mode)
    };
  }

  private createModuleTree(modules: BuildableModule[]): ModuleTreeNode[] {
    return modules.map((module) => ({
      module_id: module.module_id,
      name: module.name,
      children: module.parts.map((part) => ({
        part_id: part.part_id,
        name: part.name,
        quantity: part.quantity,
        detail_level: part.visible_detail_level
      }))
    }));
  }

  private groupPartsIntoModules(input: ProductInput, preset: Preset): BuildableModule[] {
    const limit = input.constraints?.max_visible_parts_per_module ?? 12;
    const buckets = new Map<string, ProductPartInput[]>();

    for (const template of preset.modules) {
      buckets.set(template.key, []);
    }

    for (const part of input.parts ?? []) {
      const key = this.bestTemplateKey(part, preset.modules);
      buckets.get(key)?.push(part);
    }

    return preset.modules.map((template, index) => {
      const matched = buckets.get(template.key) ?? [];
      const parts =
        matched.length > 0
          ? this.convertInputParts(matched, template, limit)
          : this.convertTemplateParts(template);

      const human_review_required =
        this.requiresHumanReview(input) ||
        template.grouping_reason.some((r) => r.includes("safety")) ||
        template.name.toLowerCase().includes("battery") ||
        template.name.toLowerCase().includes("pressure") ||
        template.name.toLowerCase().includes("foundation");

      return {
        module_id: `module_${String(index + 1).padStart(3, "0")}__${template.key}`,
        name: template.name,
        function: template.function,
        grouping_reason: template.grouping_reason,
        parts,
        materials: unique([...template.materials, ...parts.map((p) => p.material)]),
        manufacturing_process: unique([
          ...template.processes,
          ...parts.map((p) => p.manufacturing_process)
        ]),
        interfaces: [],
        assembly_station: `Station ${String(index + 1).padStart(2, "0")}`,
        qc_checks: template.qc_checks,
        human_review_required,
        safety_notes: human_review_required
          ? [
              "Regulated module bounds. Controlled handling and certified professional review mandated prior to tooling release."
            ]
          : [],
        service_access: template.service_access,
        shipping_notes: input.constraints?.shipping_envelope
          ? `${template.shipping_notes} Outer envelope limit: ${input.constraints.shipping_envelope}.`
          : template.shipping_notes
      };
    });
  }

  private convertInputParts(matched: ProductPartInput[], template: ModuleTemplate, limit: number): ModulePart[] {
    return matched.slice(0, limit).map((p, idx) => ({
      part_id: p.part_id || `part_${template.key}_${String(idx + 1).padStart(2, "0")}`,
      name: p.name,
      function: p.function || `Provides matching hardware supports on the ${template.name}`,
      material: p.material || template.materials[0] || "Steel Alloy",
      manufacturing_process: p.manufacturing_process || template.processes[0] || "Stamping",
      quantity: p.quantity || 1,
      visible_detail_level: "part_level"
    }));
  }

  private convertTemplateParts(template: ModuleTemplate): ModulePart[] {
    return template.base_parts.map((bp, idx) => ({
      part_id: `part_${template.key}_template_${String(idx + 1).padStart(2, "0")}`,
      name: bp.name,
      function: bp.function,
      material: bp.material,
      manufacturing_process: bp.manufacturing_process,
      quantity: bp.quantity,
      visible_detail_level: "module_level"
    }));
  }

  private bestTemplateKey(part: ProductPartInput, templates: ModuleTemplate[]): string {
    const partNameLC = part.name.toLowerCase();
    const partFuncLC = (part.function || '').toLowerCase();
    const partZoneLC = (part.zone || '').toLowerCase();

    let bestKey = templates[0]?.key || '';
    let maxOverlap = -1;

    for (const template of templates) {
      let score = 0;
      for (const kw of template.keywords) {
        if (partNameLC.includes(kw)) score += 3;
        if (partFuncLC.includes(kw)) score += 1;
        if (partZoneLC.includes(kw)) score += 1;
      }
      if (score > maxOverlap && score > 0) {
        maxOverlap = score;
        bestKey = template.key;
      }
    }

    return bestKey;
  }

  private keyFromModuleId(id: string): string {
    return id.split("__")[1] || id;
  }

  private defineModuleInterfaces(modules: BuildableModule[], preset: Preset): ModuleInterface[] {
    const byKey = new Map(modules.map((m) => [this.keyFromModuleId(m.module_id), m]));
    const interfaces: ModuleInterface[] = [];

    const connect = (
      fromKey: string,
      toKey: string,
      name: string,
      type: InterfaceType,
      description: string,
      qc_check: string
    ) => {
      const from = byKey.get(fromKey);
      const to = byKey.get(toKey);
      if (!from || !to) return;

      interfaces.push({
        interface_id: `${from.module_id}__${to.module_id}__${slug(name)}`,
        name,
        type,
        connects_to_module_id: to.module_id,
        description,
        qc_check
      });
    };

    if (preset.mode === "ev" || preset.mode === "vehicle") {
      connect("skateboard_chassis", "battery_pack", "Pack-to-chassis structural alignment", "structural", "Battery pack bolts directly into skateboard core.", "Datum alignment check.");
      connect("battery_pack", "drive_unit", "High-voltage propulsion link", "electrical", "Supplies high voltage to inverter assemblies.", "HV isolation resistance test.");
      connect("cooling_system", "battery_pack", "Battery coolant loop manifold", "thermal", "Liquid loops manage cell thermal expansion.", "Pressure decay leakage check.");
      connect("cooling_system", "drive_unit", "Drive unit cooling loop", "thermal", "Pumps flow to inverter and drive stator.", "Internal fluid flow check.");
      connect("body_in_white", "skateboard_chassis", "Structural marriage path", "structural", "Weld and mount parameters for chassis connection.", "Shear torque audit.");
      connect("wiring_harness", "electronics_ecu", "LV diagnostic bridge", "data", "Routes signals from cabin to compute modules.", "Low-voltage continuity check.");
      connect("door_module", "body_in_white", "Hinges and latches interface", "mechanical", "Enclosure clearance limits for smooth closure.", "Gap and flush validation check.");
    }

    if (preset.mode === "space_station") {
      connect("pressure_core", "docking_node", "Universal berthing ring seal", "pressure", "Secures gas-tight passage with docking vehicle.", "Seal pre-load vacuum check.");
      connect("pressure_core", "life_support", "ECLSS atmospheric manifold", "fluid", "Gas valves connect filters to habitable cores.", "Oxygen leak detection test.");
      connect("truss_spine", "solar_array", "Structural power articulation hinge", "electrical", "Rotates array panels to sun angle.", "Slip-ring circuit continuity verification.");
      connect("truss_spine", "radiator_module", "Radiator heat exachanger link", "thermal", "Liquid ammonia lines reject computer heat.", "Manifold vacuum seal validation.");
      connect("truss_spine", "robotics_arm", "Grapple point base plate", "mechanical", "High shear base structure for robotic motion.", "Anchor bolts tension check.");
    }

    if (preset.mode === "building" || preset.mode === "architecture_component") {
      connect("foundation", "core", "Shear-wall concrete embedments", "structural", "Transfers vertical core elevator loads directly to bedrock.", "Core survey plumbness scan.");
      connect("foundation", "column_grid", "Structural base mounting slots", "structural", "Bolt brackets anchor steel grid pillars.", "Sleeve torque validation.");
      connect("column_grid", "floor_plate", "Floor deck beam supports", "structural", "Poured concrete over corrugated deck frames.", "Deck deflection inspection.");
      connect("floor_plate", "facade_panel", "Curtain wall structural anchors", "mechanical", "Façade mounts along horizontal floor edges.", "Water leak infiltration test.");
    }

    return interfaces;
  }

  private createAssemblySequence(modules: BuildableModule[], preset: Preset): AssemblyStep[] {
    const byKey = new Map(modules.map((m) => [this.keyFromModuleId(m.module_id), m]));

    return preset.assembly.map((template, index) => {
      const stepModules = template.module_keys
        .map((key) => byKey.get(key))
        .filter(Boolean) as BuildableModule[];

      return {
        step_id: `step_${String(index + 1).padStart(3, "0")}`,
        order: index + 1,
        name: template.name,
        module_ids: stepModules.map((m) => m.module_id),
        action: template.action,
        dependencies: index === 0 ? [] : [`step_${String(index).padStart(3, "0")}`],
        station_id: `station_${String(index + 1).padStart(2, "0")}`,
        tools: template.tools,
        qc_gate: template.qc_gate,
        human_review_required: stepModules.some((m) => m.human_review_required)
      };
    });
  }

  private createManufacturingLine(
    assembly: AssemblyStep[],
    modules: BuildableModule[]
  ): ManufacturingStation[] {
    const byId = new Map(modules.map((m) => [m.module_id, m]));

    return assembly.map((step) => {
      const stationModules = step.module_ids
        .map((id) => byId.get(id))
        .filter(Boolean) as BuildableModule[];

      return {
        station_id: step.station_id,
        name: `Station ${step.station_id.split('_')[1]}: ${step.name}`,
        purpose: step.action,
        module_ids: step.module_ids,
        inputs: stationModules.map((m) => m.name),
        outputs: stationModules.map((m) => `${m.name} released from ${step.station_id}`),
        equipment: step.tools,
        qc_gate: step.qc_gate
      };
    });
  }

  private createWorkOrders(
    line: ManufacturingStation[],
    modules: BuildableModule[]
  ): WorkOrder[] {
    const byId = new Map(modules.map((m) => [m.module_id, m]));

    return line.map((station, index) => {
      const stationModules = station.module_ids
        .map((id) => byId.get(id))
        .filter(Boolean) as BuildableModule[];

      return {
        work_order_id: `wo_${String(index + 1).padStart(3, "0")}`,
        station_id: station.station_id,
        title: `${station.name} Work Order`,
        module_ids: station.module_ids,
        operation_summary: station.purpose,
        required_inputs: station.inputs,
        expected_outputs: station.outputs,
        qc_checks: unique(stationModules.flatMap((m) => m.qc_checks).concat(station.qc_gate)),
        human_review_required: stationModules.some((m) => m.human_review_required)
      };
    });
  }

  private createMESRouting(assembly: AssemblyStep[]): MESOperation[] {
    return assembly.map((step) => ({
      route_id: `mes_${step.step_id}`,
      operation_number: step.order * 10,
      station_id: step.station_id,
      operation_name: step.name,
      module_ids: step.module_ids,
      predecessors: step.dependencies,
      quality_hold_required: step.human_review_required,
      signoff_role: step.human_review_required
        ? "Lead Structural Systems Reviewer"
        : "Automated Line Check Officer"
    }));
  }

  private createExplodedModuleView(modules: BuildableModule[]): ExplodedModuleView {
    return {
      view_id: "exploded_module_view_010",
      title: "Clean Exploded Module View Setup",
      strategy: "module_only",
      modules: modules.map((module, index) => ({
        module_id: module.module_id,
        name: module.name,
        offset: {
          x: 100 + (index % 4) * 200,
          y: 80 + Math.floor(index / 4) * 160,
          z: index * 20
        },
        callouts: [
          module.function,
          `Assembly: ${module.assembly_station}`,
          module.human_review_required ? "Certified review" : "Standard QC"
        ]
      })),
      notes: [
        "Unboxing models target assembly boundaries, avoiding minor fastener clutter.",
        "Interactive SVG schematic layers show directional load offsets."
      ]
    };
  }

  private createModuleBOM(modules: BuildableModule[]): BOMItem[] {
    const items: BOMItem[] = [];

    for (const module of modules) {
      for (const part of module.parts) {
        items.push({
          bom_item_id: `bom_module_${items.length + 1}`,
          scope: "module",
          module_id: module.module_id,
          name: part.name,
          material: part.material,
          process: part.manufacturing_process,
          quantity: part.quantity,
          notes: `${module.name}: ${part.function}`
        });
      }
    }

    return items;
  }

  private createAssemblyBOM(modules: BuildableModule[]): BOMItem[] {
    return modules.map((module, index) => ({
      bom_item_id: `bom_assembly_${index + 1}`,
      scope: "assembly",
      module_id: module.module_id,
      name: module.name,
      material: module.materials.join("; "),
      process: module.manufacturing_process.join("; "),
      quantity: 1,
      notes: module.function
    }));
  }

  private createPackagingPlan(modules: BuildableModule[]): PackagingPlan[] {
    return modules.map((module, index) => ({
      package_id: `pkg_${String(index + 1).padStart(3, "0")}`,
      module_id: module.module_id,
      crate_type: module.human_review_required
        ? "high-durability hermetic lockbox"
        : "standard wooden cargo panel board",
      protection_notes: module.shipping_notes,
      handling_notes: module.human_review_required
        ? "Shock sensors and lock verification trace codes are required."
        : "Support external frame points only.",
      staging_zone: `Stage Zone ${String(index + 1).padStart(2, "0")}`
    }));
  }

  private createShippingPlan(modules: BuildableModule[]): ShippingPlan[] {
    return modules.map((module, index) => ({
      shipment_id: `ship_${String(index + 1).padStart(3, "0")}`,
      package_ids: [`pkg_${String(index + 1).padStart(3, "0")}`],
      sequence: index + 1,
      notes: `Unload at line station entrance of ${module.assembly_station}.`
    }));
  }

  private createInstallationPlan(assembly: AssemblyStep[]): InstallationStep[] {
    return assembly.map((step) => ({
      install_step_id: `install_${String(step.order).padStart(3, "0")}`,
      order: step.order,
      action: step.action,
      module_ids: step.module_ids,
      prerequisites: step.dependencies,
      qc_gate: step.qc_gate
    }));
  }

  private createDFMNotes(input: ProductInput): string[] {
    return [
      `Active unbox mode configured to: [${input.unbox_mode.toUpperCase()}]`,
      `Target manufacturing line assembly constraints mapped inside ${input.engineering_domain} domain matrices.`,
      "Enclosure thickness profiles must satisfy nominal draw limits.",
      "Verify structural keep-out boundaries for subassemblies."
    ];
  }

  private runUnboxQC(
    input: ProductInput,
    modules: BuildableModule[],
    assembly: AssemblyStep[],
    interfaces: ModuleInterface[]
  ): ReviewFlag[] {
    const flags: ReviewFlag[] = [];

    if (this.requiresHumanReview(input)) {
      flags.push({
        flag_id: "flag_global_human_review",
        severity: "critical",
        message: "Human engineering review is required. High-complexity system parameters demand physical blueprint signoff.",
        required_reviewer: "Principal Structural Engineer"
      });
    }

    for (const m of modules) {
      if (m.human_review_required) {
        flags.push({
          flag_id: `flag_${m.module_id}_critical_bounds`,
          severity: "warning",
          module_id: m.module_id,
          message: `Safety-critical checks configured for: "${m.name}". Requires hardware QA check of internal joints.`,
          required_reviewer: "Safety Systems Specialist"
        });
      }
    }

    if (interfaces.length === 0) {
      flags.push({
        flag_id: "flag_no_connections",
        severity: "critical",
        message: "Unboxed module map displays zero physical connections or data routing paths.",
        required_reviewer: "Systems Integration Architect"
      });
    }

    return flags;
  }

  private requiresHumanReview(input: ProductInput): boolean {
    if (input.constraints?.human_review_override) return true;
    const extremeModes = ["space_station", "biomanufacturing", "chip_package", "data_center", "ev"];
    return extremeModes.includes(input.unbox_mode);
  }

  private createExportManifest(unbox_id: string, unbox_mode: UnboxType): ExportManifest {
    return {
      exports: [
        { type: "png", filename: `unbox_${unbox_id}_ortho.png`, status: "planned" },
        { type: "svg", filename: `unbox_${unbox_id}_schematic.svg`, status: "planned" },
        { type: "pdf", filename: `unbox_${unbox_id}_spec_sheet.pdf`, status: "planned" },
        { type: "layered_pdf", filename: `unbox_${unbox_id}_drawing_layers.pdf`, status: "planned" },
        { type: "visualos", filename: `unbox_${unbox_id}_document.vos`, status: "planned" },
        { type: "json_manifest", filename: `unbox_${unbox_id}_manifest.json`, status: "planned" },
        { type: "bom_csv", filename: `unbox_${unbox_id}_bom.csv`, status: "planned" },
        { type: "mes_routing_json", filename: `unbox_${unbox_id}_mes_route.json`, status: "planned" },
        { type: "dfm_report_pdf", filename: `unbox_${unbox_id}_dfm_log.pdf`, status: "planned" }
      ]
    };
  }

  private createUnboxCanvas(unbox_id: string): UnboxCanvas {
    return {
      canvas_id: `canvas_${unbox_id}`,
      sections: {
        product_hero_view: "Canvas center orthographic orthocentric bounding boxes.",
        module_tree: "Deep hierarchic parts list.",
        exploded_module_view: "Dismantled spacing positions.",
        interface_map: "Friction line, fluid pipe, high-voltage copper connectors.",
        assembly_sequence: "Line step flow checklist.",
        manufacturing_line: "Sequential physical station grid.",
        bom_summary: "Aggregated schedules.",
        qc_review_flags: "Heuristics and tolerances linter alerts."
      },
      layers: [
        { layer_index: 1, name: "Modules Outline Bounds", locked: true, visible: true, payload_ref: "modules" },
        { layer_index: 2, name: "Connection Lines", locked: false, visible: true, payload_ref: "interfaces" },
        { layer_index: 3, name: "Annotation Labels & Dimensions", locked: false, visible: true, payload_ref: "callouts" }
      ]
    };
  }
}

/* ============================================================
   MAIN REACT INTERACTIVE WORKBENCH RENDERING
   ============================================================ */

const engine = new UnboxEngineeringEngine();

export default function UnboxEngineering() {
  const { t } = useLanguage();
  
  // Workspace selection state
  const [unboxMode, setUnboxMode] = useState<UnboxType>("ev");
  const [engineeringDomain, setEngineeringDomain] = useState<EngineeringDomain>("automotive");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [maxPartsLimit, setMaxPartsLimit] = useState<number>(8);
  const [shippingCrateLimit, setShippingCrateLimit] = useState<string>("Standard ISO Containers");
  const [humanOverride, setHumanOverride] = useState<boolean>(true);

  // Custom User Inputs list for parts (to let them modify on the fly!)
  const [customParts, setCustomParts] = useState<ProductPartInput[]>([]);
  
  // Quick Part Add temporary state
  const [newPartName, setNewPartName] = useState("");
  const [newPartQty, setNewPartQty] = useState(1);
  const [newPartMaterial, setNewPartMaterial] = useState("Aluminum Al-6061");
  const [newPartProcess, setNewPartProcess] = useState("CNC Milling");
  const [newPartIsSafety, setNewPartIsSafety] = useState(false);

  // Trace compiler output log state
  const [logs, setLogs] = useState<string[]>([
    "Initialized Unbox Engineering Engine... Standard schemas parsed.",
    "Awaiting vector compiler trigger..."
  ]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 40)]);
  };

  // Compile / Run Unbox Engine
  const unboxResult: UnboxResult = useMemo(() => {
    addLog(`Dismantling product target architecture under model type: [${unboxMode.toUpperCase()}]`);
    
    // Set domain appropriately based on mode
    let targetDomain = engineeringDomain;
    if (unboxMode === "space_station") targetDomain = "aerospace";
    if (unboxMode === "building") targetDomain = "construction";

    const productInput: ProductInput = {
      project_id: "prj_visualos_sandbox",
      name: `VisualOS Engineered ${unboxMode.replace('_', ' ')}`,
      object_type: `${unboxMode.toUpperCase()} Compound Structure`,
      unbox_mode: unboxMode,
      engineering_domain: targetDomain,
      prompt: customPrompt || `Modular breakdown model compilation flow of compound ${unboxMode}`,
      parts: customParts.length > 0 ? customParts : undefined,
      constraints: {
        max_visible_parts_per_module: maxPartsLimit,
        shipping_envelope: shippingCrateLimit,
        human_review_override: humanOverride
      }
    };

    const res = engine.unboxProduct(productInput);
    addLog(`Unboxed ${res.modules.length} modules, ${res.interfaces.length} interface pipelines, and ${res.assembly_sequence.length} physical line steps.`);
    return res;
  }, [unboxMode, engineeringDomain, customPrompt, maxPartsLimit, shippingCrateLimit, humanOverride, customParts]);

  // UI Active tabs
  const [activeTab, setActiveTab] = useState<'canvas' | 'tree' | 'assembly' | 'manufacturing' | 'bom' | 'qc' | 'exports'>('canvas');
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  // Set default selected module when unboxResult changes
  useEffect(() => {
    if (unboxResult.modules.length > 0) {
      setSelectedModuleId(unboxResult.modules[0].module_id);
    }
  }, [unboxResult]);

  // Assembly simulation playback state
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimRunning) {
      timer = setInterval(() => {
        setSimStep(prev => {
          if (prev >= unboxResult.assembly_sequence.length - 1) {
            setIsSimRunning(false);
            addLog("Assembly sequence simulation runs complete. Final quality holding locks certified.");
            return prev;
          }
          const next = prev + 1;
          addLog(`Mating stage step: ${unboxResult.assembly_sequence[next]?.name || ''}`);
          return next;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isSimRunning, unboxResult]);

  // Handling custom part creation
  const handleAddPart = () => {
    if (!newPartName) return;
    const item: ProductPartInput = {
      part_id: `usr_part_${makeId('u')}`,
      name: newPartName,
      quantity: newPartQty,
      material: newPartMaterial,
      manufacturing_process: newPartProcess,
      safety_critical: newPartIsSafety,
      zone: "Primary custom module deck"
    };

    setCustomParts(prev => [...prev, item]);
    setNewPartName("");
    setNewPartQty(1);
    addLog(`Registered custom user component blueprint row: "${item.name}"`);
  };

  const handleClearParts = () => {
    setCustomParts([]);
    addLog("Purged custom overrides. Refilling defaults from core preset templates.");
  };

  // Exporters download simulators
  const handleExportFile = (type: string, filename: string) => {
    addLog(`Compiling binary payload buffer pack for: ${filename} (${type.toUpperCase()})`);
    
    let content = "";
    if (type === "csv" || type === "bom_csv") {
      content = "BOM_ITEM_ID,SCOPE,MODULE_NAME,PART_NAME,MATERIAL,PROCESS,QUANTITY,NOTES\n" +
        unboxResult.module_bom.map(p => `"${p.bom_item_id}","${p.scope}","${p.module_id || ''}","${p.name}","${p.material}","${p.process}",${p.quantity},"${p.notes}"`).join("\n");
    } else {
      content = JSON.stringify(unboxResult, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    addLog(`Successfully printed high-contrast output files to browser downloads folder: ${filename}`);
  };

  const selectedModule = unboxResult.modules.find(m => m.module_id === selectedModuleId);

  return (
    <section id="unboxing" className="py-12 bg-white relative overflow-hidden text-black font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 pb-8 border-b border-black/10">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 text-black font-mono text-[9px] uppercase tracking-[0.18em] rounded-[2px] border border-black/10">
              {t('unboxing.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black font-display uppercase">
              {t('unboxing.title')}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-8">
            <p className="text-sm text-neutral-500 leading-relaxed font-sans font-light">
              {t('unboxing.desc')}
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------------
           CONTROL PANEL GRID (PRESET SELECTION & CUSTOM PART OVERRIDES)
           ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Preset Selector */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2.5">
              <Boxes className="h-5 w-5 text-indigo-600" />
              <span className="font-bold text-xs uppercase tracking-wide text-gray-800">1. Select Machine Preset</span>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-gray-400 uppercase font-bold">Unbox Mode Target:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: "ev", label: "GEN3 EV", desc: "Skateboard Layout", color: "indigo" },
                  { key: "space_station", label: "ORBIT LAB", desc: "Pressurized Core", color: "blue" },
                  { key: "building", label: "MODULAR TIMBER", desc: "Timber Pavilion", color: "amber" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setUnboxMode(item.key as UnboxType);
                      setCustomParts([]); // Clear custom parts to reveal defaults
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      unboxMode === item.key
                        ? 'bg-indigo-650 border-indigo-600 text-white font-bold shadow-md'
                        : 'bg-white border-gray-200 hover:bg-white text-gray-700'
                    }`}
                  >
                    <span className="block text-xs uppercase font-mono tracking-tight">{item.label}</span>
                    <span className={`block text-[8px] mt-1 ${unboxMode === item.key ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Constraints Sliders */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-gray-400 uppercase font-bold">Max Parts per Module:</span>
                <span className="font-bold text-gray-900 font-mono bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">
                  {maxPartsLimit} parts
                </span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="20" 
                value={maxPartsLimit}
                onChange={(e) => setMaxPartsLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-gray-400 uppercase font-bold">Shipping Envelope Base:</label>
                <select 
                  value={shippingCrateLimit}
                  onChange={(e) => setShippingCrateLimit(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-gray-200 rounded-xl"
                >
                  <option value="Aircraft ISO Containers">ISO Cleanroom Air Payload</option>
                  <option value="Flatbed Semi-Trucks">Oversized Flatbed Logistics</option>
                  <option value="Modular Shipping Crates">Compact Container Box</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Force Expert Quality Seal:</span>
                <input 
                  type="checkbox"
                  checked={humanOverride}
                  onChange={(e) => setHumanOverride(e.target.checked)}
                  className="h-4.5 w-4.5 text-indigo-600 border-gray-200 rounded focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Interactive Custom Parts Creator */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-500" />
                <span className="font-bold text-xs uppercase tracking-wide text-gray-800">2. Real-Time Parts List Override (Inject Custom Architecture)</span>
              </div>
              {customParts.length > 0 && (
                <button
                  onClick={handleClearParts}
                  className="text-[10px] font-mono font-bold text-red-500 hover:text-red-600 flex items-center gap-1 bg-white border border-red-200 px-2 py-0.5 rounded-lg transition"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Restore Defaults</span>
                </button>
              )}
            </div>

            {/* Quick adding form */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-gray-400 uppercase">Part Name:</span>
                <input 
                  type="text" 
                  placeholder="e.g. Center Ring Mount" 
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-gray-400 uppercase">Material Spec:</span>
                <input 
                  type="text" 
                  placeholder="e.g. Graphene Fabric" 
                  value={newPartMaterial}
                  onChange={(e) => setNewPartMaterial(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] font-mono text-gray-400 uppercase">Process:</span>
                <input 
                  type="text" 
                  placeholder="e.g. Vacuum Brazing" 
                  value={newPartProcess}
                  onChange={(e) => setNewPartProcess(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1 flex items-end">
                <button
                  onClick={handleAddPart}
                  disabled={!newPartName}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition duration-150"
                >
                  Register Component
                </button>
              </div>
            </div>

            {/* Active custom parts rows */}
            <div className="bg-white border rounded-2xl p-3.5 max-h-[140px] overflow-y-auto">
              {customParts.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 font-sans leading-relaxed">
                  No active overrides. Showing preset core assemblies.<br/>
                  <strong className="text-gray-500">Add custom parts above to trigger the dynamic clustering neural filter.</strong>
                </div>
              ) : (
                <div className="space-y-1.5 font-mono text-[9.5px]">
                  {customParts.map((part, i) => (
                    <div key={part.part_id} className="flex justify-between items-center bg-gray-50 p-2 border border-gray-150 rounded-xl text-gray-650">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 font-bold bg-indigo-50 px-1 py-0.5 rounded text-[8px]">USER_CP</span>
                        <strong className="text-gray-800">{part.name}</strong>
                        <span className="text-gray-400">| Mat: {part.material}</span>
                        <span className="text-gray-400">| Proc: {part.manufacturing_process}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setCustomParts(prev => prev.filter((_, idx) => idx !== i));
                          addLog(`Removed custom part row details of index: ${i}`);
                        }}
                        className="text-red-500 hover:text-red-650 transition p-1 bg-white hover:bg-red-50 border rounded-lg"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* -------------------------------------------------------------
           ACTIVE INTERACTIVE WORKSPACE LEDGER CONTAINER
           ------------------------------------------------------------- */}
        <div className="bg-gray-50 border border-gray-250 rounded-3xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 shadow-inner relative">
          
          {/* TOP BANNER */}
          <div className="lg:col-span-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                Active Decomposition Kernel Map Preview
              </span>
              <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">
                {unboxResult.object_type}
              </h3>
            </div>

            {/* Metrics pills */}
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2 py-1 bg-white border text-gray-700 rounded-xl font-bold flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-indigo-500" />
                <span>{unboxResult.modules.length} Modules</span>
              </span>
              <span className="px-2 py-1 bg-white border text-gray-700 rounded-xl font-bold flex items-center gap-1.5">
                <GitFork className="h-3.5 w-3.5 text-blue-500" />
                <span>{unboxResult.interfaces.length} Interfaces</span>
              </span>
              <span className="px-2 py-1 bg-amber-50 text-amber-800 border-amber-200 border rounded-xl font-bold flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                <span>{unboxResult.qc_review_flags.filter(f => f.severity === 'critical').length} Holds Locked</span>
              </span>
            </div>
          </div>

          {/* LEFT COLUMN PANEL: TAB LIST SELECTORS */}
          <div className="lg:col-span-3 space-y-1.5" id="unboxer-tabs-container">
            {[
              { id: "canvas", label: "2.5D Canvas Map", desc: "Layered visual graph", icon: Layers, count: unboxResult.canvas.layers.length },
              { id: "tree", label: "Constituents Tree", desc: "Clustered hierarchy tree", icon: Dna, count: unboxResult.module_tree.length },
              { id: "assembly", label: "Assembly Sequence", desc: "Timeline marriage sequence", icon: Hammer, count: unboxResult.assembly_sequence.length },
              { id: "manufacturing", label: "MES Station Grid", desc: "Work station plans", icon: Cpu, count: unboxResult.manufacturing_line.length },
              { id: "bom", label: "BOM Ledgers", desc: "Spreadsheet database", icon: FileText, count: unboxResult.module_bom.length },
              { id: "qc", label: "DFM & Linter Flags", desc: "Compliance safety audits", icon: ShieldAlert, count: unboxResult.qc_review_flags.length },
              { id: "exports", label: "Download Spec Package", desc: "CAD handoff assets form", icon: Download, count: unboxResult.exports.exports.length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    addLog(`Swapped active unboxer panel lookback to: [${tab.label.toUpperCase()}]`);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isActive 
                      ? 'border-indigo-600 bg-white text-indigo-750 font-bold shadow-md' 
                      : 'border-gray-200 bg-white/50 hover:bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-150 text-gray-400'}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-xs tracking-tight leading-snug">{tab.label}</span>
                      <span className={`text-[8px] font-sans h-3 block mt-0.5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`}>
                        {tab.desc}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 bg-gray-100 rounded text-gray-400">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* MAIN DYNAMIC CONTENT INTERFACES VIEW DISPLAY */}
          <div className="lg:col-span-9 bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs min-h-[460px] relative overflow-hidden">
            
            {/* Decors */}
            <div className="absolute top-2.5 right-3 text-[9px] font-mono text-gray-300 pointer-events-none">
              [ COMPILER VIEWNODE SCHEMA: {activeTab.toUpperCase()} ]
            </div>

            {/* TAB CONTENT: 2.5D CANVAS SCHEMATIC GRAPH */}
            {activeTab === 'canvas' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between animate-fadeIn">
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Dynamic Orthographic Canvas Map</h4>
                    <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                      Physical schematic bounding box offsets plotted relative to coordinate system matrices.
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 font-mono text-[8.5px] bg-indigo-50 border border-indigo-150 text-indigo-600 font-bold rounded">
                    GRID SNAP ACTIVE (5px)
                  </span>
                </div>

                {/* SVG Visual graph representation */}
                <div className="bg-gray-950 border rounded-2xl p-4 min-h-[290px] relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  
                  {/* Grid canvas stage */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="font-mono text-[70px] text-white">VisualOS</span>
                  </div>

                  <svg className="w-full h-full min-h-[200px] absolute inset-0 z-10 select-none">
                    {/* Draw schematic line connectors representing Module Interfaces! */}
                    {unboxResult.interfaces.map((int, i) => {
                      const fromMod = unboxResult.modules.find(m => m.module_id === int.interface_id.split("__")[0]);
                      const toMod = unboxResult.modules.find(m => m.module_id === int.interface_id.split("__")[1]);
                      
                      if (!fromMod || !toMod) return null;
                      const fromIndex = unboxResult.modules.indexOf(fromMod);
                      const toIndex = unboxResult.modules.indexOf(toMod);

                      // Calculate simple offsets
                      const fx = 75 + (fromIndex % 4) * 160 + (fromIndex * 2);
                      const fy = 60 + Math.floor(fromIndex / 4) * 80 + (fromIndex * 2);
                      const tx = 75 + (toIndex % 4) * 160 + (toIndex * 2);
                      const ty = 60 + Math.floor(toIndex / 4) * 80 + (toIndex * 2);

                      return (
                        <g key={int.interface_id}>
                          <path 
                            d={`M ${fx} ${fy} Q ${(fx + tx) / 2} ${(fy + ty) / 2 - 25}, ${tx} ${ty}`} 
                            fill="none" 
                            stroke={int.type === 'electrical' ? '#fbbf24' : int.type === 'structural' ? '#818cf8' : '#38bdf8'} 
                            strokeWidth="1.5" 
                            strokeDasharray="4 4"
                            className="animate-pulse"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Positioning modules */}
                  <div className="relative z-20 grid grid-cols-4 gap-3">
                    {unboxResult.modules.map((module, idx) => {
                      const isSelected = selectedModuleId === module.module_id;
                      return (
                        <div
                          key={module.module_id}
                          onClick={() => {
                            setSelectedModuleId(module.module_id);
                            addLog(`Focused canvas looking glass to details of: "${module.name}"`);
                          }}
                          className={`cursor-pointer rounded-xl p-2.5 border text-left transition ${
                            isSelected
                              ? 'bg-indigo-950 border-indigo-500 text-indigo-200 scale-105 shadow-md flex-col justify-between'
                              : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-650'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-[7.5px] font-mono text-slate-500 leading-none">[ INDEX {idx + 1} ]</span>
                            {module.human_review_required && <span className="h-2 w-2 rounded-full bg-amber-500 block" title="Requires certification check"/>}
                          </div>
                          
                          <strong className="block text-[10.5px] font-sans truncate font-medium text-slate-250 leading-snug mt-1">
                            {module.name.replace(" Module", "")}
                          </strong>

                          <div className="flex justify-between items-center text-[7.5px] font-mono tracking-tight mt-2 text-slate-500">
                            <span>GRID X:{idx * 15} Y:{idx * 10}</span>
                            <span className="truncate">{module.assembly_station.toUpperCase()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active selected node feedback card overlay */}
                  {selectedModule && (
                    <div className="relative z-20 bg-slate-900 border border-slate-750 rounded-2xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mt-4 text-xs font-mono select-none text-slate-350">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-xs">{selectedModule.name}</strong>
                          <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-cyan-400 font-bold rounded text-[8.5px]">
                            {selectedModule.assembly_station}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-xl font-sans">{selectedModule.function}</p>
                      </div>

                      <div className="flex flex-col text-right text-[9px] border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4 space-y-1 text-slate-500">
                        <span>LOCKED LAYER 1: VECTORS</span>
                        <span>MATS: {selectedModule.materials.join(", ")}</span>
                        <span>PROCESS: {selectedModule.manufacturing_process.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB CONTENT: PRODUCT TREE AND CONSTITUENTS */}
            {activeTab === 'tree' && (
              <div className="space-y-4 flex-1 animate-fadeIn">
                <div className="border-b pb-2">
                  <h4 className="text-xs font-bold text-gray-800">Clustered Component Parts Tree</h4>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Sub-tier elements aggregated automatically by neural spatial grouping rules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sidebar list of modules */}
                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                    {unboxResult.modules.map(m => (
                      <button
                        key={m.module_id}
                        onClick={() => setSelectedModuleId(m.module_id)}
                        className={`w-full p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                          selectedModuleId === m.module_id
                            ? 'bg-indigo-50 border-indigo-350 text-indigo-900 font-bold'
                            : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-650'
                        }`}
                      >
                        <span className="text-xs truncate font-medium">{m.name}</span>
                        <ChevronRight className="h-4.5 w-4.5 text-gray-400" />
                      </button>
                    ))}
                  </div>

                  {/* Expanded parts details list */}
                  {selectedModule && (
                    <div className="bg-gray-50 border rounded-2xl p-4 space-y-3 max-h-[300px] overflow-y-auto">
                      <div className="border-b pb-1">
                        <span className="text-[8.5px] font-mono text-gray-400 uppercase font-bold">Constituent subparts:</span>
                        <h5 className="font-bold text-xs text-gray-800">{selectedModule.name}</h5>
                      </div>

                      <div className="space-y-2">
                        {selectedModule.parts.map(p => (
                          <div key={p.part_id} className="p-2.5 bg-white border border-gray-200 rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-gray-800">{p.name}</span>
                              <span className="font-mono text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                x{p.quantity} units
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-normal font-sans">{p.function}</p>
                            
                            <div className="flex gap-2 text-[8px] font-mono font-bold text-indigo-600 pt-1">
                              <span>MAT: {p.material || 'Fiberglass'}</span>
                              <span>•</span>
                              <span>PROC: {p.manufacturing_process}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: TIMELINE ASSEMBLY SEQUENCE METHOD */}
            {activeTab === 'assembly' && (
              <div className="space-y-4 flex-1 animate-fadeIn flex flex-col justify-between">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Dynamic Station Sequence Timeline</h4>
                    <p className="text-[10px] text-gray-400 font-sans">
                      Tracks consecutive module marriage steps and holding constraints.
                    </p>
                  </div>
                  
                  {/* Simulation controls */}
                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
                    <button
                      onClick={() => {
                        setIsSimRunning(!isSimRunning);
                        addLog(`${isSimRunning ? 'Stopped' : 'Started'} micro-timeline sequential step assembler tracker.`);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center gap-1 transition"
                    >
                      {isSimRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      <span>{isSimRunning ? "Pause" : "Play Sim"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSimStep(0);
                        setIsSimRunning(false);
                        addLog("Reset sequencer tracker timeline gauge.");
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 border rounded flex items-center gap-1 transition"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Timeline row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {unboxResult.assembly_sequence.map((step, idx) => {
                    const isPassed = idx < simStep;
                    const isActive = idx === simStep;
                    return (
                      <div 
                        key={step.step_id}
                        className={`p-3 border rounded-2xl flex flex-col justify-between text-left transition ${
                          isActive 
                            ? 'bg-indigo-650 border-indigo-600 text-white shadow-md' 
                            : isPassed 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800' 
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className={`font-mono text-[8px] uppercase tracking-wider block ${isActive ? 'text-indigo-200' : 'text-gray-450'}`}>
                            Stage {step.order}
                          </span>
                          <strong className="block text-[11px] font-sans leading-tight font-medium truncate">
                            {step.name}
                          </strong>
                          <p className={`text-[9.5px] leading-normal font-sans line-clamp-2 mt-1 ${isActive ? 'text-indigo-150' : 'text-gray-400'}`}>
                            {step.action}
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-[7.5px] font-mono font-bold mt-3">
                          <span className="truncate">{step.station_id.toUpperCase()}</span>
                          {isActive && <span className="px-1 bg-indigo-500 text-white rounded animate-pulse">ACTIVE</span>}
                          {isPassed && <span className="text-emerald-600 uppercase">SIGN_OFF</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated tool drawer logs feedback */}
                {unboxResult.assembly_sequence[simStep] && (
                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2 text-xs font-mono text-gray-750">
                    <div className="space-y-1">
                      <strong className="text-indigo-950 font-bold flex items-center gap-1 block">
                        <Clock className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
                        <span>Active Stage Rig Tools ({unboxResult.assembly_sequence[simStep].station_id.toUpperCase()})</span>
                      </strong>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {unboxResult.assembly_sequence[simStep].tools.map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600 text-[8.5px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right text-[9.5px]">
                      <span className="block text-gray-400">QC GATE EXPECTATION:</span>
                      <strong className="block text-indigo-900 uppercase font-black">
                        {unboxResult.assembly_sequence[simStep].qc_gate}
                      </strong>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: MES FACTORY STATION LAYOUT */}
            {activeTab === 'manufacturing' && (
              <div className="space-y-4 flex-1 animate-fadeIn">
                <div className="border-b pb-2">
                  <h4 className="text-xs font-bold text-gray-800">MES Factory Line Plan & Station Rigs</h4>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Physical layout routing definitions and active robotic assembly work orders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-1">
                  {unboxResult.manufacturing_line.slice(0, 6).map((station, i) => (
                    <div key={station.station_id} className="p-3.5 bg-gray-50 border rounded-2xl flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span className="text-indigo-600 font-bold bg-indigo-50 px-1 py-0.2 rounded uppercase">
                            {station.station_id}
                          </span>
                          <span className="text-gray-400">BAY LOG 3.{i + 1}</span>
                        </div>
                        <h5 className="font-bold text-[11.5px] text-gray-800 leading-tight">
                          {station.name.split(':')[1]?.trim() || station.name}
                        </h5>
                        <p className="text-[9.5px] text-gray-400 leading-relaxed font-sans">{station.purpose}</p>
                      </div>

                      <div className="space-y-2 pt-3 border-t mt-3 text-[9px] font-mono leading-normal">
                        <div className="text-gray-500">
                          <span className="text-gray-400 block font-bold text-[8px] uppercase">Rigs / Tooling:</span>
                          <span className="font-bold text-gray-800">{station.equipment.slice(0, 2).join("; ")}</span>
                        </div>
                        <div className="text-gray-505">
                          <span className="text-gray-400 block font-bold text-[8px] uppercase">Verification Gateway:</span>
                          <span className="font-bold text-indigo-650 truncate block">{station.qc_gate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: MATERIAL & BILL OF MATERIALS (BOM) */}
            {activeTab === 'bom' && (
              <div className="space-y-4 flex-1 animate-fadeIn flex flex-col justify-between">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Dynamic Aggregated Bill of Materials Ledger</h4>
                    <p className="text-[10px] text-gray-400 font-sans">
                      Complete materials takeoff schedule with physical dimension references.
                    </p>
                  </div>
                  
                  {/* Download spreadsheet buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportFile("csv", `${unboxResult.object_type.toLowerCase()}_bom.csv`)}
                      className="px-2.5 py-1 text-[9.5px] font-mono font-bold bg-slate-900 text-white hover:bg-slate-800 rounded flex items-center gap-1.5 transition"
                    >
                      <Download className="h-3 w-3 text-cyan-400" />
                      <span>Download BOM CSV</span>
                    </button>
                  </div>
                </div>

                {/* Table scheduling container */}
                <div className="border border-gray-150 rounded-2xl overflow-hidden max-h-[260px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[9.5px] font-mono">
                    <thead className="bg-gray-100/80 text-gray-400 uppercase font-black tracking-wider text-[8px]">
                      <tr>
                        <th className="p-2 border-b">BOM Item ID</th>
                        <th className="p-2 border-b">Constituent Part</th>
                        <th className="p-2 border-b">Material Spec</th>
                        <th className="p-2 border-b">Quantity</th>
                        <th className="p-2 border-b text-right">Process Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-gray-650">
                      {unboxResult.module_bom.map((item) => (
                        <tr key={item.bom_item_id} className="hover:bg-slate-50 transition">
                          <td className="p-2 font-bold text-indigo-600">{item.bom_item_id}</td>
                          <td className="p-2 truncate max-w-[150px] font-sans font-medium text-gray-850">{item.name}</td>
                          <td className="p-2 text-gray-500 font-sans">{item.material}</td>
                          <td className="p-2 text-gray-850 font-bold">{item.quantity}</td>
                          <td className="p-2 text-right text-gray-400 font-medium">{item.process}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick aggregates notes */}
                <div className="bg-gray-50 border p-2.5 rounded-xl text-[9px] font-mono flex justify-between items-center text-gray-450 mt-1">
                  <span>UNBOX BOM METRICS: MULTI-LEVEL ASSEMBLY MATRIX</span>
                  <span className="font-bold text-gray-700">TOTAL LINE ROWS: {unboxResult.module_bom.length} PARTS</span>
                </div>

              </div>
            )}

            {/* TAB CONTENT: QUALITY REVIEW LINTER ALERTS */}
            {activeTab === 'qc' && (
              <div className="space-y-4 flex-1 animate-fadeIn">
                <div className="border-b pb-2">
                  <h4 className="text-xs font-bold text-gray-800">Unbox Engineering Q/C Verification Linter</h4>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Deterministic checks targeting mechanical tolerances, structural keepouts, and safety certification guidelines.
                  </p>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {unboxResult.qc_review_flags.map(flag => (
                    <div 
                      key={flag.flag_id}
                      className={`p-3 border rounded-2xl flex items-start gap-3 transition-all ${
                        flag.severity === 'critical' 
                          ? 'bg-red-500/5 border-red-500/20 text-red-800' 
                          : 'bg-amber-500/5 border-amber-500/20 text-amber-800'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        <ShieldAlert className="h-4 w-4" />
                      </div>

                      <div className="flex-1 space-y-0.5 text-left">
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          <span>Security review ID: {flag.flag_id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${flag.severity === 'critical' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            {flag.severity} RISK
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 leading-tight font-sans pt-0.5">{flag.message}</p>
                        <p className="text-[9.5px] text-gray-500 font-mono pt-1">
                          Required certifier role: <strong className="text-slate-700 underline">{flag.required_reviewer}</strong>
                        </p>
                      </div>
                    </div>
                  ))}

                  {unboxResult.qc_review_flags.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 border rounded-2xl flex flex-col items-center justify-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                      <strong className="text-xs text-gray-700">All Systems Passed CAD Linter Checks!</strong>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-sans max-w-sm">
                        Decomposition structural parameters represent steady hold stress standards. No warning flags raised.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: TECHNICAL EXPORT FILES MANAGER */}
            {activeTab === 'exports' && (
              <div className="space-y-4 flex-1 animate-fadeIn flex flex-col justify-between">
                <div className="border-b pb-2">
                  <h4 className="text-xs font-bold text-gray-800">VisualOS Technical Spec Exporter Drawer</h4>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Generate, compile, and download formal manufacturing technical plans and line files.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                  {unboxResult.exports.exports.map((exp) => (
                    <div key={exp.type} className="p-3 bg-gray-50 border rounded-2xl flex items-center justify-between">
                      <div className="space-y-1 text-left">
                        <strong className="font-mono text-xs text-gray-850 uppercase flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-indigo-500" />
                          <span>{exp.type.replace('_', ' ')} Handoff Package</span>
                        </strong>
                        <span className="block font-mono text-[9.5px] text-gray-400 mt-1">
                          File: {exp.filename}
                        </span>
                      </div>

                      <button
                        onClick={() => handleExportFile(exp.type, exp.filename)}
                        className="p-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs rounded-xl shadow-xs transition duration-150 flex items-center gap-1 font-bold"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Build File</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 text-[10px] space-y-1 text-slate-705 leading-relaxed font-sans">
                  <span className="font-bold text-yellow-800 flex items-center gap-1 text-[10.5px]">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" /> Automated Engineering Signoff Required
                  </span>
                  <p>
                    Manufacturing handoff files are generated automatically using first-pass AI CAD structural templates. Review values in local physical tests before cutting steel or casting foundation beds.
                  </p>
                </div>

              </div>
            )}

            {/* DYNAMIC LOGS FOOTER SECTION */}
            <div className="mt-6 pt-4 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-gray-400 select-none">
              <span className="font-bold flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                <span>UNBOX COMPILER FEED LOG:</span>
              </span>
              <div className="bg-gray-100 border text-gray-600 px-3.5 py-1 rounded-xl max-h-[22px] overflow-hidden truncate max-w-lg leading-normal font-medium">
                {logs[0] || 'Idle... ready to compile.'}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
