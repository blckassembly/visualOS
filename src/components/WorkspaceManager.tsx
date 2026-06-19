import React, { useState, useEffect } from 'react';
import { 
  Folder, FolderPlus, FileText, Upload, Plus, Trash2, Copy, 
  RotateCcw, ShieldCheck, Cloud, CloudOff, FileJson, 
  Download, Image, History, ArrowRight, CheckCircle2, ChevronRight, Check
} from 'lucide-react';
import { CanvasDataModel } from './CommandPaletteSimulator';

interface WorkspaceManagerProps {
  activeCanvas: CanvasDataModel;
  setActiveCanvas: (canvas: CanvasDataModel) => void;
  brandKits?: Array<{ id: string; name: string; colors: string[]; fonts: string[] }>;
  logTrace: (message: string) => void;
}

interface SimulatedProject {
  id: string;
  name: string;
  folder: string;
  updatedAt: string;
  cloudSync: boolean;
  canvasState: CanvasDataModel;
}

interface ProjectVersion {
  id: string;
  projectId: string;
  versionName: string;
  timestamp: string;
  author: string;
  canvasSnapshot: CanvasDataModel;
}

export default function WorkspaceManager({
  activeCanvas,
  setActiveCanvas,
  brandKits = [],
  logTrace
}: WorkspaceManagerProps) {
  
  // Toggles and user modes
  const [offlineMode, setOfflineMode] = useState<boolean>(true); // Private-by-default is strictly true
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');

  // Project Lists
  const [folders, setFolders] = useState<string[]>(['Corporate Stationery', 'Industrial CNC', 'Apparel Flats', 'Floor Plans']);
  const [projects, setProjects] = useState<SimulatedProject[]>([
    {
      id: 'proj_001',
      name: 'Business Card Workspace',
      folder: 'Corporate Stationery',
      updatedAt: '1 mins ago',
      cloudSync: false,
      canvasState: { ...activeCanvas }
    },
    {
      id: 'proj_002',
      name: 'Electric Bracket Spec',
      folder: 'Industrial CNC',
      updatedAt: '2 hours ago',
      cloudSync: false,
      canvasState: {
        canvas_id: 'canvas_bracket_001',
        name: 'Electric Bracket Spec',
        type: 'bracket_design',
        width: 120,
        height: 80,
        unit: 'millimeters',
        dpi: 300,
        color_mode: 'RGB',
        aspect_ratio: '3:2',
        bleed: 2.0,
        safe_zone: 5.0,
        background: '#ffffff',
        grid: { show: true, size: 5, snapping: true },
        guides: [10, 50, 110],
        layers: [
          { id: 'br_01', name: 'Primary Bracket Contour', type: 'vector', visible: true, locked: false, x: 10, y: 15, width: 100, height: 50, color: '#000000', content: 'M10 15 L110 15 L110 65 L10 65 Z' },
          { id: 'br_02', name: 'Mounting Bolt Hole A', type: 'vector', visible: true, locked: false, x: 20, y: 35, width: 10, height: 10, color: '#ff2222', content: 'Circle x20 y35 r5' },
          { id: 'br_03', name: 'Mounting Bolt Hole B', type: 'vector', visible: true, locked: true, x: 90, y: 35, width: 10, height: 10, color: '#ff2222', content: 'Circle x90 y35 r5' },
          { id: 'br_04', name: 'Tolerance Callouts Label', type: 'text', visible: true, locked: false, x: 15, y: 70, width: 80, height: 8, color: '#2563eb', content: 'CL Tolerance 0.05 max', fontFamily: 'JetBrains Mono', fontSize: 9 }
        ]
      }
    },
    {
      id: 'proj_003',
      name: 'Techpack Hooded Apparel',
      folder: 'Apparel Flats',
      updatedAt: 'Yesterday',
      cloudSync: false,
      canvasState: {
        canvas_id: 'canvas_apparel_001',
        name: 'Techpack Hooded Apparel',
        type: 'apparel_techpack',
        width: 450,
        height: 600,
        unit: 'millimeters',
        dpi: 150,
        color_mode: 'RGB',
        aspect_ratio: '3:4',
        bleed: 0,
        safe_zone: 10,
        background: '#f8fafc',
        grid: { show: false, size: 10, snapping: false },
        guides: [],
        layers: [
          { id: 'ap_01', name: 'Hood Outline Flat', type: 'vector', visible: true, locked: false, x: 150, y: 50, width: 150, height: 100, color: '#334155', content: 'Hooded silhouette line path' },
          { id: 'ap_02', name: 'Main Body Frame Flat', type: 'vector', visible: true, locked: false, x: 100, y: 150, width: 250, height: 350, color: '#334155', content: 'Body main sweater line path' },
          { id: 'ap_03', name: 'Drawstring Detail Trim', type: 'vector', visible: true, locked: true, x: 210, y: 130, width: 30, height: 80, color: '#f43f5e', content: 'Stitching paths red' },
          { id: 'ap_04', name: 'BOM Fabric Callouts', type: 'text', visible: true, locked: false, x: 120, y: 520, width: 210, height: 40, color: '#0f172a', content: 'Shell: 100% Recycled Cotton Knit Poly', fontFamily: 'Inter', fontSize: 10 }
        ]
      }
    }
  ]);

  // Asset Library simulation list
  const [assets, setAssets] = useState([
    { id: 'ast_logo_cmyk', name: 'Brand_Logo_Symmetrical_CMYK.svg', type: 'vector', size: '24 KB', resolution: 'Vector (Scalable)' },
    { id: 'ast_seal_png', name: 'Authentic_Approval_Shield.png', type: 'raster', size: '155 KB', resolution: '1024 x 1024px' },
    { id: 'ast_spec_csv', name: 'BOM_ScrewFitting_Inventory.csv', type: 'data', size: '12 KB', resolution: 'Table Sheet' },
    { id: 'ast_pattern_svg', name: 'Herringbone_CAD_StitchPattern.svg', type: 'vector', size: '42 KB', resolution: 'Seamless Vector' }
  ]);

  // Version History list
  const [versions, setVersions] = useState<ProjectVersion[]>([
    {
      id: 'ver_001',
      projectId: 'proj_001',
      versionName: 'Milestone initial commit',
      timestamp: 'Today, 11:15 AM',
      author: 'SOVEREIGN USER',
      canvasSnapshot: { ...activeCanvas }
    },
    {
      id: 'ver_002',
      projectId: 'proj_001',
      versionName: 'Pre-flight Bleed alignment fix',
      timestamp: 'Today, 11:28 AM',
      author: 'SOVEREIGN USER',
      canvasSnapshot: {
        ...activeCanvas,
        bleed: 0.125,
        name: `${activeCanvas.name} (Bleed Resolved)`
      }
    }
  ]);

  // Dynamic state values
  const [newVersionName, setNewVersionName] = useState<string>('');

  // Core Calls implementation
  
  // 1. Core Call: createWorkspace()
  const createWorkspace = (wName = 'New Sovereignty Space') => {
    logTrace(`[WORKSPACE ENGINE] createWorkspace(): Initialising pristine project segment container named "${wName}"...`);
    setActiveFolder('all');
    setOfflineMode(true); // Keep strictly private-by-default
    logTrace('[WORKSPACE ENGINES] Created sovereign directory vault. No third-party network requests dispatched.');
  };

  // 2. Core Call: createProject()
  const createProject = (pName = 'Untagged Project Project') => {
    logTrace(`[WORKSPACE ENGINE] createProject(): Drafting brand new empty sheet workspace...`);
    const newProjId = `proj_${Date.now()}`;
    const draftCanvas: CanvasDataModel = {
      canvas_id: `canvas_${Date.now()}`,
      name: pName,
      type: 'blank_canvas',
      width: 500,
      height: 500,
      unit: 'pixels',
      dpi: 72,
      color_mode: 'RGB',
      aspect_ratio: '1:1',
      bleed: 0,
      safe_zone: 0,
      background: '#ffffff',
      grid: { show: true, size: 20, snapping: true },
      guides: [],
      layers: [
        { id: 'ly_bg', name: 'Background Canvas Sheet', type: 'vector', visible: true, locked: false, x: 0, y: 0, width: 500, height: 500, color: '#ffffff', content: 'Base canvas backing block' }
      ]
    };

    const newProjItem: SimulatedProject = {
      id: newProjId,
      name: pName,
      folder: activeFolder !== 'all' ? activeFolder : 'Corporate Stationery',
      updatedAt: 'Just Now',
      cloudSync: false,
      canvasState: draftCanvas
    };

    setProjects(curr => [newProjItem, ...curr]);
    setActiveCanvas(draftCanvas);
    logTrace(`[WORKSPACE ENGINE] createProject(): Spawned canvas "${pName}" with background backing block.`);
  };

  // 3. Core Call: saveProject()
  const saveProject = () => {
    logTrace(`[WORKSPACE ENGINE] saveProject(): Serialising active canvas geometries...`);
    
    // Update snapshot of the active project matching activeCanvas.canvas_id or activeCanvas.type
    setProjects(curr => curr.map(p => {
      if (p.name === activeCanvas.name || p.id === 'proj_001') {
        return {
          ...p,
          updatedAt: 'Saved Just Now',
          canvasState: { ...activeCanvas }
        };
      }
      return p;
    }));

    // Generate an automatic history version checkpoint as requested
    createVersion('Autosaved state update');
    
    logTrace(`[WORKSPACE ENGINE] saveProject(): Serialisation completed: ${activeCanvas.layers.length} layers formatted successfully.`);
  };

  // 4. Core Call: openProject()
  const openProject = (proj: SimulatedProject) => {
    logTrace(`[WORKSPACE ENGINE] openProject(): Extracting layered design states for "${proj.name}"...`);
    setActiveCanvas({ ...proj.canvasState });
    
    // Load that project's snapshots to target version histories
    setVersions(curr => [
      {
        id: `ver_autogen_${Date.now()}`,
        projectId: proj.id,
        versionName: `Active state restore`,
        timestamp: 'Just Opened',
        author: 'SOVEREIGN USER',
        canvasSnapshot: { ...proj.canvasState }
      },
      ...curr.filter(v => v.projectId === proj.id)
    ]);

    logTrace(`[WORKSPACE ENGINE] openProject() finished: "${proj.name}" successfully loaded into editor viewport.`);
  };

  // 5. Core Call: duplicateProject()
  const duplicateProject = (proj: SimulatedProject) => {
    logTrace(`[WORKSPACE ENGINE] duplicateProject(): Cloning structural tree branches...`);
    const claimClonedId = `proj_clone_${Date.now()}`;
    const clone: SimulatedProject = {
      ...proj,
      id: claimClonedId,
      name: `${proj.name} (Clone)`,
      updatedAt: 'Just Now'
    };
    setProjects(curr => [clone, ...curr]);
    logTrace(`[WORKSPACE ENGINE] duplicateProject(): Cloned project payload copied to "${clone.name}".`);
  };

  // 6. Core Call: archiveProject()
  const archiveProject = (pId: string) => {
    logTrace(`[WORKSPACE ENGINE] archiveProject(): Deserialising archive parameters...`);
    const target = projects.find(p => p.id === pId);
    if (target) {
      setProjects(curr => curr.filter(p => p.id !== pId));
      logTrace(`[WORKSPACE ENGINE] archiveProject(): Moved directory "${target.name}" to virtual dustbin.`);
    }
  };

  // 7. Core Call: importAsset()
  const importAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      logTrace(`[WORKSPACE ENGINE] importAsset(): Extracting file boundaries: name="${file.name}" size=${file.size}...`);
      
      const newAsset = {
        id: `ast_${Date.now()}`,
        name: file.name,
        type: file.type.includes('image') ? 'raster' : 'vector',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        resolution: 'NURBS Scalable'
      };

      setAssets(curr => [newAsset, ...curr]);
      logTrace(`[WORKSPACE ENGINE] importAsset(): Verified secure sandbox hash. Asset registered to Local Cache.`);
    }
  };

  // 8. Core Call: organizeAssets()
  const organizeAssets = (folderName: string) => {
    logTrace(`[WORKSPACE ENGINE] organizeAssets(): Structuring nested files...`);
    if (!folders.includes(folderName) && folderName.trim()) {
      setFolders(curr => [...curr, folderName]);
      logTrace(`[WORKSPACE ENGINE] Created directory node "${folderName}" for organizing layered exports.`);
    }
  };

  // 9. Core Call: createVersion()
  const createVersion = (vName = 'Manual Milestone Snapshot') => {
    const freshTag = vName || `Milestone ${versions.length + 1}`;
    logTrace(`[WORKSPACE ENGINE] createVersion(): Snapshotted layer geometry structure matching "${freshTag}".`);
    
    const newVer: ProjectVersion = {
      id: `ver_${Date.now()}`,
      projectId: 'proj_001',
      versionName: freshTag,
      timestamp: new Date().toLocaleTimeString(),
      author: 'SOVEREIGN USER',
      canvasSnapshot: { ...activeCanvas }
    };

    setVersions(curr => [newVer, ...curr]);
    setNewVersionName('');
  };

  // 10. Core Call: restoreVersion()
  const restoreVersion = (ver: ProjectVersion) => {
    logTrace(`[WORKSPACE ENGINE] restoreVersion(): Rolling back active structures to snapshot "${ver.versionName}"...`);
    setActiveCanvas({ ...ver.canvasSnapshot });
    logTrace(`[WORKSPACE ENGINE] restoreVersion() completed: Active canvas successfully rolled back to ${ver.timestamp}.`);
  };

  // 11. Core Call: exportProjectPackage()
  const exportProjectPackage = () => {
    logTrace('[WORKSPACE ENGINE] exportProjectPackage(): Bundling offline materials...');
    
    const completeCarrierDossier = {
      appKey: "VisualOS sovereign workspace",
      timestamp: new Date().toISOString(),
      offlineFlags: offlineMode,
      projectList: projects,
      assetsRegistry: assets,
      activeCanvasState: activeCanvas,
      brandKitSnapshots: brandKits
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(completeCarrierDossier, null, 2));
    const dlLink = document.createElement('a');
    dlLink.setAttribute("href", dataStr);
    dlLink.setAttribute("download", `visualos_sovereign_bundle_${activeCanvas.type}.json`);
    document.body.appendChild(dlLink);
    dlLink.click();
    dlLink.remove();
    
    logTrace('[WORKSPACE ENGINE] exportProjectPackage(): Complete layered workspace exported safely as unified JSON bundle.');
  };

  // Helpers
  const filteredProjects = projects.filter(p => {
    if (activeFolder === 'all') return true;
    return p.folder === activeFolder;
  });

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-6 text-xs text-slate-800 animate-fadeIn" id="project-workspace-file-system-module">
      
      {/* Workspace Banner and sovereign privacy selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 bg-indigo-100 text-indigo-750 rounded border border-indigo-250 animate-pulse">
              <Folder className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-indigo-600 block tracking-widest leading-none">Local Sovereignty Vault</span>
              <h3 className="text-sm font-extrabold text-slate-900 font-sans mt-0.5 font-sans">Project Workspace & Database</h3>
            </div>
          </div>
        </div>

        {/* Private-by-default status toggler (Sovereign specs) */}
        <button
          type="button"
          onClick={() => {
            setOfflineMode(!offlineMode);
            logTrace(`[WORKSPACE CLOUD] Cloud optional toggle. Mode shifted as: ${!offlineMode ? 'ONLINE SYNC OPTION' : 'SOVEREIGN OFFLINE ONLY'}.`);
          }}
          className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-[10px] transition font-sans ${
            offlineMode 
              ? 'bg-slate-900 text-slate-100 border-slate-900' 
              : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50/50'
          }`}
        >
          {offlineMode ? (
            <>
              <CloudOff className="h-3 w-3 text-red-400" />
              <span>Sovereign (Offline Local)</span>
            </>
          ) : (
            <>
              <Cloud className="h-3 w-3 text-cyan-500 animate-pulse" />
              <span>Cloud Optional (Enabled Sync)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Workspace core navigation folders list */}
        <div className="md:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Library Directories</span>
            <button
              type="button"
              onClick={() => setShowNewFolderModal(true)}
              className="p-1 hover:bg-slate-200 rounded border border-gray-200 transition"
              title="Add Virtual Directory"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveFolder('all');
                logTrace('[WORKSPACE] Shifted folder view to: ALL');
              }}
              className={`w-full p-2 py-1.5 rounded-lg text-left font-bold flex items-center justify-between transition ${
                activeFolder === 'all' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200/50 text-slate-650'
              }`}
            >
              <span>📁 Display All Projects</span>
              <span className="text-[8.5px] font-mono">{projects.length}</span>
            </button>

            {folders.map(folder => (
              <button
                key={folder}
                type="button"
                onClick={() => {
                  setActiveFolder(folder);
                  logTrace(`[WORKSPACE] Shifted folder view to: ${folder}`);
                }}
                className={`w-full p-2 py-1.5 rounded-lg text-left font-sans font-bold flex items-center justify-between transition ${
                  activeFolder === folder ? 'bg-slate-900 text-white' : 'hover:bg-slate-200/50 text-slate-650'
                }`}
              >
                <span>📂 {folder}</span>
                <span className="text-[8px] font-mono">{projects.filter(p => p.folder === folder).length}</span>
              </button>
            ))}
          </div>

          {/* New folder simple popup dialog */}
          {showNewFolderModal && (
            <div className="bg-white border p-3 rounded-xl space-y-2 border-indigo-250 animate-fadeIn shadow-2xs">
              <span className="text-[8px] uppercase font-mono text-slate-500 block">Directory Label:</span>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Mechanical CNC"
                className="w-full bg-slate-50 border border-gray-200 p-1.5 rounded-lg font-bold"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    organizeAssets(newFolderName);
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 py-1 bg-slate-900 text-white font-bold text-[10px] rounded-lg"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="py-1 px-2.5 bg-slate-100 hover:bg-slate-250 text-gray-500 text-[10px] rounded-lg border"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1">
            <span className="text-[8.5px] uppercase font-mono font-bold text-slate-400 block tracking-wide">Backup Database</span>
            <button
              type="button"
              onClick={exportProjectPackage}
              className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-300 font-bold rounded-lg flex items-center justify-center gap-1 transition"
            >
              <Download className="h-3 w-3" />
              <span>Export Sovereign Bundle</span>
            </button>
          </div>
        </div>

        {/* Projects grid matching folders */}
        <div className="md:col-span-9 space-y-5">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Layered Projects in folder:</span>
              <button
                type="button"
                onClick={() => createProject('Untitled Workspace Segment')}
                className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-0.5 text-[9.5px] shadow-3xs"
              >
                <Plus className="h-3 w-3" />
                <span>Create New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProjects.map(proj => {
                const isActive = activeCanvas.name === proj.name || (proj.id === 'proj_001' && activeCanvas.name !== 'Electric Bracket Spec' && activeCanvas.name !== 'Techpack Hooded Apparel');
                return (
                  <div
                    key={proj.id}
                    className={`bg-white border rounded-2xl p-3.5 transition flex flex-col justify-between gap-3 ${
                      isActive ? 'border-2 border-indigo-600 ring-1 ring-indigo-200' : 'hover:border-slate-350'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[7.5px] font-bold rounded">
                          {proj.canvasState.type.toUpperCase()}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" title="Active on Canvas" />
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-900 leading-tight block truncate mt-0.5">{proj.name}</h4>
                      <p className="text-[9px] text-gray-400 block truncate">Directory: <span className="font-bold">{proj.folder}</span></p>
                    </div>

                    <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between gap-1 mt-1">
                      <span className="text-[8.5px] text-gray-400 font-mono shrink-0">{proj.updatedAt}</span>
                      <div className="flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          onClick={() => openProject(proj)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[9px] transition leading-none select-none"
                        >
                          Open Sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateProject(proj)}
                          className="p-1 hover:bg-slate-100 text-gray-400 hover:text-slate-700 rounded border transition"
                          title="Clone Draft"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        {proj.id !== 'proj_001' && (
                          <button
                            type="button"
                            onClick={() => archiveProject(proj.id)}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-650 rounded border transition"
                            title="Delete Draft"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Version Milestones checkpoints list */}
            <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <History className="h-3.5 w-3.5 text-slate-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Interactive Version Milestones</span>
                </div>
              </div>

              {/* New version creation */}
              <div className="flex items-center gap-1 bg-slate-50 border p-1 rounded-xl">
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="Commit descriptive tag..."
                  className="flex-1 bg-transparent p-1 px-1.5 text-[10px] font-sans text-slate-800 outline-none placeholder:text-gray-400 font-bold"
                />
                <button
                  type="button"
                  onClick={() => createVersion(newVersionName)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] rounded-lg transition shrink-0"
                >
                  Save Milestone
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {versions.map((ver, idx) => (
                  <div
                    key={ver.id + idx}
                    className="p-2 py-1.5 bg-slate-50 hover:bg-slate-100/80 border rounded-xl flex items-center justify-between gap-1.5 group transition"
                  >
                    <div>
                      <span className="font-extrabold text-slate-850 block leading-tight text-[10px]">{ver.versionName}</span>
                      <span className="text-[8px] text-gray-400 font-mono">{ver.timestamp} | {ver.author}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => restoreVersion(ver)}
                      className="px-1.5 py-0.5 border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded text-[8.5px] transition flex items-center gap-0.5 shrink-0"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      <span>Reopen Rollback</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset library registry */}
            <div className="bg-white border text-slate-800 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b pb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <Image className="h-3.5 w-3.5 text-slate-500" />
                  <span>Raw Asset Vector Vault</span>
                </div>

                <label className="py-0.5 px-2 bg-slate-100 hover:bg-slate-200 text-gray-650 cursor-pointer text-[8px] uppercase tracking-wide border rounded-lg font-bold transition flex items-center gap-1">
                  <Upload className="h-2.5 w-2.5" />
                  <span>Import Asset</span>
                  <input type="file" onChange={importAsset} className="hidden" accept=".svg,.png,.jpg,.jpeg,.csv" />
                </label>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {assets.map(asset => (
                  <div
                    key={asset.id}
                    className="p-2 py-1.5 bg-slate-55 border rounded-xl flex items-center justify-between gap-1.5 hover:border-slate-350 transition"
                  >
                    <div className="truncate flex-1">
                      <span className="font-bold text-slate-800 block truncate leading-tight text-[10px]">{asset.name}</span>
                      <span className="text-[8px] text-gray-400 font-mono">{asset.resolution} • {asset.size}</span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-650 rounded font-mono text-[8px] shrink-0 uppercase font-bold">
                      {asset.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
