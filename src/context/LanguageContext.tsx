/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav Items
    'nav.product': 'Product',
    'nav.modules': 'Modules',
    'nav.usecases': 'Use Cases',
    'nav.commands': 'Command System',
    'nav.exports': 'Exports',
    'nav.unboxing': 'Unboxing',
    'nav.quality': 'Quality Control',
    'nav.start': 'Start Building',

    // Hero
    'hero.badge': 'Interactive Production Platform',
    'hero.title1': 'The AI-First Canvas OS for',
    'hero.title2': 'Prompt-to-Product Creation',
    'hero.subtitle': 'Upload an image, describe a product, or start from a blank canvas. VisualOS builds editable layers, vector objects, UI screens, brand systems, product sheets, tech packs, DFM reports, BOMs, and manufacturing-ready export packages.',
    'hero.cta.start': 'Start with a Canvas',
    'hero.cta.workflow': 'Explore Pipeline',
    'hero.editor.title': 'Active Canvas Workspace',
    'hero.editor.preset': 'Preset',
    'hero.editor.promptLabel': 'Dynamic prompt to generate vector layers & parts',
    'hero.editor.generate': 'Generate Layer Package',
    'hero.editor.generating': 'Compiling design layers...',
    'hero.editor.layers': 'Active Layer Tree',
    'hero.editor.dimensions': 'Layout Coordinate Metadata',

    // Problem Section
    'problem.badge': 'The AI Design Bottleneck',
    'problem.title': 'AI images are not enough.',
    'problem.desc': 'Most AI tools create flat images. VisualOS creates structured design files. Every object, layer, vector, text block, dimension, and export setting stays completely editable. No more locked bitmaps — just raw vector production assets.',
    'problem.card1.title': 'Flat AI images break professional workflows',
    'problem.card1.desc': 'Generative tools spit out final pixel grids that can’t be engineered, edited, or imported into CAD/Figma. If one letter is off, you have to prompt from scratch.',
    'problem.card2.title': 'Designers need layers, vectors, and brand guidelines',
    'problem.card2.desc': 'You cannot scale a brand or layout without explicit bezier controls, precise pixel alignments, separate text bounding boxes, and consistent typography tables.',
    'problem.card3.title': 'Product teams need DFM, BOM, and micro-dimensions',
    'problem.card3.desc': 'An image of a sneaker or a watch contains no scale or material metadata. VisualOS outputs actual thickness details, bill of materials, and manufacturing tolerances.',
    'problem.card4.title': 'Manufacturers need cleaner inputs before starting prototypes',
    'problem.card4.desc': 'Factories reject moodboards. VisualOS compiles industrial schemas, manufacturing line assignments, and structured PDFs that shorten quoting cycles from weeks to hours.',

    // Workflow Section
    'workflow.badge': 'Absolute CAD Pipeline',
    'workflow.title': 'From prompt to canvas to prototype package.',
    'workflow.desc': 'A continuous automated flow that converts simple textual guidelines and images into robust, multi-layer vector packets.',
    'workflow.details.title': 'Live Rendering Output',
    'workflow.details.status': 'Active Pipeline Status',
    
    // Modules Section
    'modules.badge': 'Engine Core Architecture',
    'modules.title': 'Integrated CAD & Layout Engines',
    'modules.desc': 'A comprehensive, multi-module framework designed for absolute design accuracy in vector paths, mechanical specs, and retail planning.',

    // Use cases
    'usecases.badge': 'Industry Use Cases',
    'usecases.title': 'One kernel, infinite industries.',
    'usecases.desc': 'VisualOS maps across graphics, industrial, apparel, and interior categories. Click any application below to load active structures.',
    
    // Commands Section
    'commands.badge': 'System Terminal',
    'commands.title': 'Operate at command-line speed.',
    'commands.desc': 'An elegant prompt terminal. Instantly construct, scale, or transform elements without heavy nesting menus.',
    'commands.placeholder': 'Type commands (e.g. /create canvas, /unbox EV, /export)',
    'commands.output': 'Simulated Kernel Output Log',

    // Exports Section
    'exports.badge': 'Multi-Format Compiler',
    'exports.title': 'Universal scale-locked export packages.',
    'exports.desc': 'Download high-fidelity design bundles, manufacturing STEP guides, or comprehensive size sheets. Ready for factories.',

    // Unboxing Section
    'unboxing.badge': 'Modularity Decomposition',
    'unboxing.title': 'Modular product unboxing engineering.',
    'unboxing.desc': 'Inspect complex assemblies side-by-side. Isolate constituent sub-modules, run stress simulations, and calculate live BOM properties.',

    // Quality Section
    'quality.badge': 'Design Linter',
    'quality.title': 'Deterministic Quality Control Board',
    'quality.desc': 'Our background linting kernel audits every outline edge, overlap vector, typography alignment, and material classification in real-time.',
    'quality.btn.run': 'Run Active Audit Scan',
    'quality.btn.running': 'Running Audit...',
    'quality.btn.resolved': 'All Issues Resolved (100% CAD Compliant)',
    'quality.resolvedBadge': '100% Compliant',

    // Footer
    'footer.cta': 'Ready to experience the AI Canvas Kernel?',
    'footer.ctadesc': 'Join engineering, product, and apparel teams worldwide building pixel-accurate physical concepts.',
    'footer.links.product': 'Product',
    'footer.links.features': 'Features',
    'footer.links.api': 'API Reference',
    'footer.links.docs': 'Documentation',
    'footer.links.security': 'Security',
    'footer.copyright': '© 2026 VisualOS Inc. All rights reserved. Parallel coordinate systems operating under Apache-2.0.'
  },
  es: {
    // Nav Items
    'nav.product': 'Producto',
    'nav.modules': 'Módulos',
    'nav.usecases': 'Casos de Uso',
    'nav.commands': 'Comandos',
    'nav.exports': 'Exportaciones',
    'nav.unboxing': 'Unboxing',
    'nav.quality': 'Control de Calidad',
    'nav.start': 'Empezar a Construir',

    // Hero
    'hero.badge': 'Plataforma de Producción Interactiva',
    'hero.title1': 'El OS de Lienzo Primero para IA para o',
    'hero.title2': 'Creación de Prompt a Producto',
    'hero.subtitle': 'Sube una imagen, describe un producto o empieza desde un lienzo en blanco. VisualOS genera capas editables, objetos vectoriales, pantallas de interfaz, sistemas de marca, fichas de producto, paquetes técnicos, informes DFM, listas de materiales y paquetes de exportación listos para producción.',
    'hero.cta.start': 'Iniciar con un Lienzo',
    'hero.cta.workflow': 'Explorar Proceso',
    'hero.editor.title': 'Espacio de Trabajo del Lienzo Activo',
    'hero.editor.preset': 'Ajuste',
    'hero.editor.promptLabel': 'Indicación dinámica para generar capas vectoriales y piezas',
    'hero.editor.generate': 'Generar Paquete de Capas',
    'hero.editor.generating': 'Compilando capas de diseño...',
    'hero.editor.layers': 'Árbol de Capas Activas',
    'hero.editor.dimensions': 'Metadatos de Coordenadas de Diseño',

    // Problem Section
    'problem.badge': 'El Cuello de Botella del Diseño de IA',
    'problem.title': 'Las imágenes de IA no son suficientes.',
    'problem.desc': 'La mayoría de las herramientas de IA crean imágenes planas. VisualOS crea archivos de diseño estructurados. Cada objeto, capa, vector, bloque de texto, dimensión y configuración de exportación sigue siendo totalmente editable. No más mapas de bits bloqueados: solo activos de producción vectoriales limpios.',
    'problem.card1.title': 'Imágenes planas de IA rompen los flujos profesionales',
    'problem.card1.desc': 'Las herramientas generativas devuelven cuadrículas de píxeles finales que no se pueden modificar ni importar en CAD/Figma. Si una letra está mal, debes escribir el prompt desde cero.',
    'problem.card2.title': 'Diseñadores necesitan capas, vectores y pautas de marca',
    'problem.card2.desc': 'No puedes escalar una marca sin controles bezier explícitos, alineaciones de píxeles precisas, cuadros de texto separados y tablas tipográficas consistentes.',
    'problem.card3.title': 'Equipos de producto necesitan DFM, BOM y microdimensiones',
    'problem.card3.desc': 'Una imagen de una zapatilla o un reloj no tiene escala ni metadatos de material. VisualOS ofrece detalles de espesor real, lista de materiales y tolerancias de manufactura.',
    'problem.card4.title': 'Fabricantes necesitan entradas limpias antes de prototipar',
    'problem.card4.desc': 'Las fábricas rechazan los moodboards. VisualOS compila esquemas industriales, asignaciones de línea de fabricación y PDFs estructurados que acortan el proceso de cotización.',

    // Workflow Section
    'workflow.badge': 'Canalización CAD Absoluta',
    'workflow.title': 'Del prompt al lienzo, al paquete de prototipo.',
    'workflow.desc': 'Un flujo automatizado continuo que convierte pautas de texto simples e imágenes en paquetes vectoriales robustos de múltiples capas.',
    'workflow.details.title': 'Salida del Render en Vivo',
    'workflow.details.status': 'Estado de la Canalización Activa',

    // Modules Section
    'modules.badge': 'Arquitectura del Núcleo del Motor',
    'modules.title': 'Motores CAD y Diseño Integrados',
    'modules.desc': 'Un marco integral de múltiples módulos diseñado para una precisión absoluta en rutas vectoriales, especificaciones mecánicas y planificación comercial.',

    // Use cases
    'usecases.badge': 'Casos de Uso por Industria',
    'usecases.title': 'Un núcleo, industrias infinitas.',
    'usecases.desc': 'VisualOS sirve para diseño gráfico, industrial, de indumentaria y de interiores. Haz clic en cualquier aplicación para cargar su estructura activa.',

    // Commands Section
    'commands.badge': 'Terminal del Sistema',
    'commands.title': 'Opera a la velocidad del comando.',
    'commands.desc': 'Un terminal elegante. Construye, escala o transforma elementos instantáneamente sin menús pesados.',
    'commands.placeholder': 'Escribe comandos (ej. /create canvas, /unbox EV, /export)',
    'commands.output': 'Registro de Salida del Núcleo Simulado',

    // Exports Section
    'exports.badge': 'Compilador Multiformato',
    'exports.title': 'Paquetes de exportación universales a escala.',
    'exports.desc': 'Descarga carpetas de diseño de alta fidelidad, guías STEP para manufactura o fichas de tallas completas listos para fábrica.',

    // Unboxing Section
    'unboxing.badge': 'Descomposición Modular',
    'unboxing.title': 'Ingeniería modular de desembalaje de productos.',
    'unboxing.desc': 'Inspecciona ensamblajes complejos uno al lado del otro. Aísla submódulos constituyentes, simula tensiones y calcula propiedades de BOM en vivo.',

    // Quality Section
    'quality.badge': 'Linter de Diseño',
    'quality.title': 'Tablero Determinista de Control de Calidad',
    'quality.desc': 'Nuestro software de control de calidad audita cada contorno, vector, alineación de texto y clasificación de material en tiempo real.',
    'quality.btn.run': 'Ejecutar Análisis de Auditoría',
    'quality.btn.running': 'Analizando diseño...',
    'quality.btn.resolved': 'Todos los Problemas Resueltos (100% Conforme a CAD)',
    'quality.resolvedBadge': '100% Conforme',

    // Footer
    'footer.cta': '¿Listo para experimentar el Núcleo del Lienzo de IA?',
    'footer.ctadesc': 'Únete a los equipos de ingeniería, producto y diseño de indumentaria de todo el mundo que ya construyen conceptos físicos con precisión de píxeles.',
    'footer.links.product': 'Producto',
    'footer.links.features': 'Funcionalidades',
    'footer.links.api': 'Referencia API',
    'footer.links.docs': 'Documentación',
    'footer.links.security': 'Seguridad',
    'footer.copyright': '© 2026 VisualOS Inc. Todos los derechos reservados. Sistemas de coordenadas paralelos operando bajo Apache-2.0.'
  },
  fr: {
    // Nav Items
    'nav.product': 'Produit',
    'nav.modules': 'Modules',
    'nav.usecases': 'Cas d\'Usage',
    'nav.commands': 'Commandes',
    'nav.exports': 'Exportations',
    'nav.unboxing': 'Déballage',
    'nav.quality': 'Contrôle Qualité',
    'nav.start': 'Commencer',

    // Hero
    'hero.badge': 'Plateforme de Production Interactive',
    'hero.title1': 'Le système de canevas IA pour la',
    'hero.title2': 'Création de Prompt à Produit',
    'hero.subtitle': 'Téléchargez une image, décrivez un produit, ou commencez sur un canevas vierge. VisualOS génère des calques modifiables, objets vectoriels, maquettes d’interface, chartes graphiques, fiches produit, plans techniques, rapports DFM et listes de composants.',
    'hero.cta.start': 'Démarrer avec un Canevas',
    'hero.cta.workflow': 'Découvrir le Pipeline',
    'hero.editor.title': 'Espace de Travail Actif',
    'hero.editor.preset': 'Ajustement',
    'hero.editor.promptLabel': 'Expression pour créer des éléments vectoriels et composants',
    'hero.editor.generate': 'Générer le Pack de Calques',
    'hero.editor.generating': 'Compilation en cours...',
    'hero.editor.layers': 'Arbre des Calques Actifs',
    'hero.editor.dimensions': 'Métadonnées de Coordonnées',

    // Problem Section
    'problem.badge': 'Le goulot d\'étranglement de l\'IA',
    'problem.title': 'Les images de l\'IA ne suffisent pas.',
    'problem.desc': 'La plupart des outils d\'IA créent des images plates. VisualOS crée des fichiers de conception structurés. Chaque calque, vecteur, bloc de texte, dimension et paramètre d\'export reste éditable.',
    'problem.card1.title': 'Les images plates bloquent les flux professionnels',
    'problem.card1.desc': 'Les outils génératifs produisent des grilles de pixels figées qui ne peuvent pas être modifiées ou intégrées dans CAD ou Figma.',
    'problem.card2.title': 'Les designers ont besoin de calques et de vecteurs',
    'problem.card2.desc': 'Impossible de décliner une identité visuelle sans vecteurs précis, boîtes de texte distinctes et repères typographiques.',
    'problem.card3.title': 'Les équipes produit exigent BOM et dimensions',
    'problem.card3.desc': 'Une image de montre ou de basket ne contient aucune proportion. VisualOS intègre dimensions fines, matières et arbres de composants.',
    'problem.card4.title': 'Les usines veulent des maquettes claires',
    'problem.card4.desc': 'Les ateliers refusent de travailler sur des planches de tendances. VisualOS génère des schémas structurés prêts pour la fabrication.',

    // Workflow Section
    'workflow.badge': 'Pipeline CAO Absolu',
    'workflow.title': 'Du prompt au canevas, jusqu\'au dossier technique.',
    'workflow.desc': 'Un flux automatisé continu transformant des lignes de texte ou images en ensembles vectoriels multicouches.',
    'workflow.details.title': 'Rendu Technique en Direct',
    'workflow.details.status': 'État du Pipeline Actif',

    // Modules Section
    'modules.badge': 'Moteur d\'Architecture Core',
    'modules.title': 'Moteurs de Plan et Dessin Intégrés',
    'modules.desc': 'Un écosystème complet conçu pour une rigueur mathématique sur les tracés vectoriels, les tolérances et les nomenclatures.',

    // Use cases
    'usecases.badge': 'Cas d\'Usage Industriels',
    'usecases.title': 'Un noyau, des applications infinies.',
    'usecases.desc': 'VisualOS répond aux exigences graphiques, industrielles, textiles et d\'architecture intérieure.',

    // Commands Section
    'commands.badge': 'Console Système',
    'commands.title': 'Exécutez à la vitesse d\'un terminal.',
    'commands.desc': 'Prenez le contrôle avec une boîte de prompt. Créez et redimensionnez vos blocs sans passer par des menus fastidieux.',
    'commands.placeholder': 'Entrez une commande (ex: /create canvas, /unbox EV, /export)',
    'commands.output': 'Journal du Noyau de Calcul',

    // Exports Section
    'exports.badge': 'Compilateur Multi-Format',
    'exports.title': 'Packs d\'exportation calibrés pour les usines.',
    'exports.desc': 'Téléchargez des dossiers d\'export de haute fidélité, des fichiers de fabrication STEP ou des chartes de tailles complètes.',

    // Unboxing Section
    'unboxing.badge': 'Décomposition Modulaire',
    'unboxing.title': 'Ingénierie de démontage modulaire.',
    'unboxing.desc': 'Examinez des structures de produits complexes, simulez les contraintes mécaniques et calculez les nomenclatures BOM.',

    // Quality Section
    'quality.badge': 'Linter de Conception',
    'quality.title': 'Contrôle des Règles Géométriques',
    'quality.desc': 'Notre moteur de contrôle valide instantanément les alignements de texte, les contours ouverts et la conformité matérielle.',
    'quality.btn.run': 'Lancer l\'Inspection de Conception',
    'quality.btn.running': 'Scan en cours...',
    'quality.btn.resolved': 'Tous les Problèmes Corrigés (100% Conforme CAO)',
    'quality.resolvedBadge': '100% Conforme',

    // Footer
    'footer.cta': 'Prêt à tester le Noyau de Canevas d\'IA ?',
    'footer.ctadesc': 'Reignez sur les fichiers de fabrication. Rejoignez les équipes d\'ingénierie et de conception qui conçoivent au pixel près.',
    'footer.links.product': 'Produit',
    'footer.links.features': 'Fonctionnalités',
    'footer.links.api': 'Référence API',
    'footer.links.docs': 'Documentation',
    'footer.links.security': 'Sécurité',
    'footer.copyright': '© 2026 VisualOS Inc. Tous droits réservés. Fonctionne sous licence Apache-2.0.'
  },
  de: {
    // Nav Items
    'nav.product': 'Produkt',
    'nav.modules': 'Module',
    'nav.usecases': 'Anwendungsfälle',
    'nav.commands': 'Befehlssystem',
    'nav.exports': 'Exporte',
    'nav.unboxing': 'Zerlegen',
    'nav.quality': 'Qualitätskontrolle',
    'nav.start': 'Jetzt Starten',

    // Hero
    'hero.badge': 'Interaktive Produktionsplattform',
    'hero.title1': 'Das KI-erste Canvas-OS für die',
    'hero.title2': 'Prompt-zu-Produkt-Erstellung',
    'hero.subtitle': 'Laden Sie ein Bild hoch, beschreiben Sie ein Produkt oder starten Sie auf einem leeren Canvas. VisualOS erstellt editierbare Ebenen, Vektorobjekte, UI-Layouts, Markenguides, DFM-Berichte, Stücklisten und exportfertige Datenpakete.',
    'hero.cta.start': 'Mit Canvas starten',
    'hero.cta.workflow': 'Workflow ansehen',
    'hero.editor.title': 'Aktueller Arbeitsbereich',
    'hero.editor.preset': 'Vorlage',
    'hero.editor.promptLabel': 'Dynamischer Prompt zur Generierung von Vektorebenen',
    'hero.editor.generate': 'Ebenen-Paket generieren',
    'hero.editor.generating': 'Ebenen werden kompiliert...',
    'hero.editor.layers': 'Aktive Ebenenstruktur',
    'hero.editor.dimensions': 'Koordinaten-Metadaten',

    // Problem Section
    'problem.badge': 'Die KI-Design-Hürde',
    'problem.title': 'KI-Bilder reichen nicht aus.',
    'problem.desc': 'Die meisten KI-Tools liefern nur flache Bilder. VisualOS erstellt strukturierte Konstruktionsdateien. Jedes Objekt, jede Ebene, jeder Pfad und jede Abmessung bleibt vollständig anpassbar.',
    'problem.card1.title': 'Flache KI-Bilder bremsen Profis aus',
    'problem.card1.desc': 'Generatoren liefern unflexible Pixelraster. Bei kleinsten Fehlern muss die Vektorgrafik komplett neu erstellt werden.',
    'problem.card2.title': 'Designer brauchen Ebenen, Vektoren und Brandbooks',
    'problem.card2.desc': 'Ohne echte Kurvenkontrolle, Pixel-Symmetrie und separate Textfelder ist keine saubere Markeninszenierung möglich.',
    'problem.card3.title': 'Produktteams fordern DFM, Stücklisten und Maße',
    'problem.card3.desc': 'Bilder von Uhren oder Schuhen enthalten keine Maße. VisualOS liefert präzise Materialstärken, Stücklisten und Fertigungstoleranzen.',
    'problem.card4.title': 'Hersteller benötigen saubere Daten vor dem Prototyping',
    'problem.card4.desc': 'Fabriken weisen Moodboards ab. VisualOS liefert CAD-konforme Dokumente, um Angebotsprozesse von Wochen auf Stunden zu verkürzen.',

    // Workflow Section
    'workflow.badge': 'Komplette CAD-Pipeline',
    'workflow.title': 'Vom Prompt über den Canvas zum fertigen Paket.',
    'workflow.desc': 'Ein nahtloser, automatisierter Datenfluss, der Text- und Bilddaten in strukturierte, mehrlagige Vektorpakete überführt.',
    'workflow.details.title': 'Live-Vorschau Ausgabe',
    'workflow.details.status': 'Status der CAD-Pipeline',

    // Modules Section
    'modules.badge': 'Kernarchitektur der Engine',
    'modules.title': 'Integrierte CAD- & Layout-Engines',
    'modules.desc': 'Ein umfassendes Multi-Modul-System für absolute Genauigkeit bei Vektorbahnen, technischen Details und Maßstabsprüfungen.',

    // Use cases
    'usecases.badge': 'Industrie-Beispiele',
    'usecases.title': 'Ein Kernel, unendlich viele Branchen.',
    'usecases.desc': 'VisualOS dehnt sich von Grafik, Industriedesign und Kleidung bis hin zu Raumplänen aus.',

    // Commands Section
    'commands.badge': 'System-Terminal',
    'commands.title': 'Steuerung auf Kommandozeilenebene.',
    'commands.desc': 'Einfaches Prompt-Terminal. Skalieren und zeichnen Sie Komponenten blitzschnell ohne tief verschachtelte Klickmenüs.',
    'commands.placeholder': 'Befehl eingeben (z.B. /create canvas, /unbox EV, /export)',
    'commands.output': 'Konsolenprotokoll der Kernel-Engine',

    // Exports Section
    'exports.badge': 'Multi-Format-Compiler',
    'exports.title': 'Universelle, maßstabsgetreue Exportpakete.',
    'exports.desc': 'Laden Sie originalgetreue Vektorpakete, CAD-freundliche STEP-Dateien oder Textilspezifikationen direkt herunter.',

    // Unboxing Section
    'unboxing.badge': 'Modulare Zerlegung',
    'unboxing.title': 'Produktunboxing auf Systemebene.',
    'unboxing.desc': 'Untersuchen Sie Baugruppen im Detail. Isolieren Sie Kernmodule, simulieren Sie Kräfteverläufe und berechnen Sie Live-Stücklisten.',

    // Quality Section
    'quality.badge': 'Design Linter',
    'quality.title': 'Konsistente Qualitätskontrolle',
    'quality.desc': 'Unser Hintergrundprozess überwacht jede Objektgrenze, Textüberlauf, Farbrechte und Materialangaben in Echtzeit.',
    'quality.btn.run': 'Qualitätsprüfung starten',
    'quality.btn.running': 'Prüfung läuft...',
    'quality.btn.resolved': 'Alle Fehler behoben (100% CAD-konform)',
    'quality.resolvedBadge': '100% Konform',

    // Footer
    'footer.cta': 'Bereit für den KI-Arbeitsbereich von VisualOS?',
    'footer.ctadesc': 'Schließen Sie sich Teams weltweit an, die physische Entwürfe fehlerfrei planen und an Werkstätten übergeben.',
    'footer.links.product': 'Produkt',
    'footer.links.features': 'Funktionen',
    'footer.links.api': 'API-Schnittstelle',
    'footer.links.docs': 'Dokumentation',
    'footer.links.security': 'Sicherheit',
    'footer.copyright': '© 2026 VisualOS Inc. Alle Rechte vorbehalten. Lizenziert unter Apache-2.0.'
  },
  zh: {
    // Nav Items
    'nav.product': '产品',
    'nav.modules': '核心模块',
    'nav.usecases': '应用场景',
    'nav.commands': '指令终端',
    'nav.exports': '数据导出',
    'nav.unboxing': '模块拆解',
    'nav.quality': '质量检测',
    'nav.start': '开始设计',

    // Hero
    'hero.badge': '交互式数字化智造平台',
    'hero.title1': '首个面向 AI 驱动的',
    'hero.title2': '“从提示词到实体产品”画布操作系统',
    'hero.subtitle': '上传草图、描述想法，或直接在画布创作。VisualOS 构建可编辑图层、矢量锚点、品牌字重、DFM 规范及支持直接生产的工业级导出包。',
    'hero.cta.start': '初始化系统画布',
    'hero.cta.workflow': '查看数据管线',
    'hero.editor.title': '参数化工作空间',
    'hero.editor.preset': '经典预设',
    'hero.editor.promptLabel': '驱动生成矢量图层与实体配件的提示语',
    'hero.editor.generate': '生成矢量图层包',
    'hero.editor.generating': '图层包编译中...',
    'hero.editor.layers': '活动图树体系',
    'hero.editor.dimensions': '绝对物理坐标系统元数据',

    // Problem Section
    'problem.badge': 'AI 生成设计的行业瓶颈',
    'problem.title': '简单的扁平 AI 图像，无法支撑工业制造。',
    'problem.desc': '多数 AI 工具仅输出不能编辑的像素图块。VisualOS 生成高度结构化的 CAD 级图层与规范文件，每个尺寸锚点均可追溯编辑。',
    'problem.card1.title': '扁平像素背景锁死设计工作流',
    'problem.card1.desc': '传统生成软件产生的图像缺乏矢量贝塞尔锚点，一旦需要微调版式或文字，就必须反复重新生成。',
    'problem.card2.title': '现代设计依赖矢量图层与标准的品牌手册规范',
    'problem.card2.desc': '没有像素级对齐控制和网格定义系统，复杂的品牌排版和外形结构便无法按比例缩放。',
    'problem.card3.title': '工程研发需要 DFM、物料清单 (BOM) 与微观尺寸',
    'problem.card3.desc': '产品的图片并不包含物理尺寸与材质密度。VisualOS 直接将三维壁厚、螺纹公差和原材料成本打包化。',
    'problem.card4.title': '实体工厂需要高完整度的工程图文包',
    'problem.card4.desc': '工厂无法为平面效果图报价。VisualOS 整合零件分配、制造路线和 PDF 数据，大幅缩短询价周期。',

    // Workflow Section
    'workflow.badge': '绝对高保真数字化管线',
    'workflow.title': '从构想，到画布编辑，直至下发工程包裹。',
    'workflow.desc': '自动化流水线，完成从概念意图到高精准度工业矢量包的解耦升级。',
    'workflow.details.title': '数字化工程实时渲染',
    'workflow.details.status': '数据流水线运行状态',

    // Modules Section
    'modules.badge': '算力引擎核心架构',
    'modules.title': '深度集成的 CAD 与版面算法引擎',
    'modules.desc': '涵盖矢量路径追踪、工件公差演算、以及建筑开孔规划的全功能图形内核支撑。',

    // Use cases
    'usecases.badge': '多行业落地方案',
    'usecases.title': '单一画布内核，贯穿多重产业。',
    'usecases.desc': '全面适配平面视觉、工业结构、服装工艺表包、及室内空间设计。点击下方预设加载活动包。',

    // Commands Section
    'commands.badge': '内核交互终端',
    'commands.title': '体验指令级别的设计吞吐速度。',
    'commands.desc': '通过极简 prompt 终端。告别繁琐的层叠菜单，通过几行代码完成模块重构与多端下发。',
    'commands.placeholder': '输入动作指令 (例如 /create canvas, /unbox EV, /export)',
    'commands.output': 'Simulated 虚拟内核仿真日志',

    // Exports Section
    'exports.badge': '多格式编译器',
    'exports.title': '完全锁比例的通用导出封装。',
    'exports.desc': '支持将成果瞬间打包至高分辨率设计原片、标准 STEP 文件或服饰精密规格书。',

    // Unboxing Section
    'unboxing.badge': '高解耦分工模式',
    'unboxing.title': '复杂的机械与实体装配剥离。',
    'unboxing.desc': '拆碎复杂机器设备进行单独检视。分离不同的承载子模块，模拟外力冲击并更新核心构成属性。',

    // Quality Section
    'quality.badge': '平面与机械代码 Linter',
    'quality.title': '百分之百 CAD 级检测看板',
    'quality.desc': '由静态分析算法实时监控边缘闭合性、像素重叠误差、品牌违规用色等异常隐患。',
    'quality.btn.run': '执行动态代码检测',
    'quality.btn.running': '深度比对排查中...',
    'quality.btn.resolved': '审核结束 (未检出任何非合规图形异常)',
    'quality.resolvedBadge': '100% 深度合规',

    // Footer
    'footer.cta': '准备好进入新一代 AI 数据核了吗？',
    'footer.ctadesc': '与来自全球的结构师、板型专家一同体验像素和公差完全可控的高品质流程。',
    'footer.links.product': '核心产品',
    'footer.links.features': '底层技术',
    'footer.links.api': 'API 物理接口',
    'footer.links.docs': '研发文档',
    'footer.links.security': '安全协议',
    'footer.copyright': '© 2026 VisualOS 版权所有。多维网格算法由 Apache-2.0 开源协议提供保障。'
  },
  ja: {
    // Nav Items
    'nav.product': '製品',
    'nav.modules': 'モジュール',
    'nav.usecases': 'ユースケース',
    'nav.commands': 'コマンドライン',
    'nav.exports': 'エクスポート',
    'nav.unboxing': '分解構造',
    'nav.quality': '品質監査',
    'nav.start': 'ビルド開始',

    // Hero
    'hero.badge': '次世代ものづくり生産プラットフォーム',
    'hero.title1': 'AIファーストのキャンバスOSで実現する',
    'hero.title2': 'プロンプトからプロダクトへの創作',
    'hero.subtitle': '画像をアップロードするか、プロンプトを入力するだけで、VisualOSは編集可能なレイヤー、ベクトルアンカー、製品仕様書、テックパック、DFM分析、BOMリスト、製造対応パッケージを自動作成します。',
    'hero.cta.start': 'キャンバスから起動',
    'hero.cta.workflow': '設計パイプラインを詳しくみる',
    'hero.editor.title': '動的 CAD ワークスペース',
    'hero.editor.preset': 'システムプリセット',
    'hero.editor.promptLabel': 'ベクトルレイヤーと構成部品を構築するプロンプト',
    'hero.editor.generate': '編集可能なレイヤーを出力',
    'hero.editor.generating': '設計データをコンパイル中...',
    'hero.editor.layers': 'アクティブレイヤーツリー',
    'hero.editor.dimensions': '絶対座標システムメタデータ',

    // Problem Section
    'problem.badge': 'AIデザインのボトルネック',
    'problem.title': '平坦なAIイメージだけでは不十分です。',
    'problem.desc': '従来のAIツールは編集不可能な2D画像を書き出すのみでした。VisualOSは、構造化された本格的なデザインパッケージを出力。全てのレイヤー、直線・曲線アンカー、寸法指定、説明用テキストを自由自在に変更可能にします。',
    'problem.card1.title': '平坦なAI画像が本プロ仕様の流れを遮断',
    'problem.card1.desc': 'ビッドマップ画像をCADやFigmaに持ち込んで直接加工することはできません。テキスト一文字の修正でも完全に作り直しを強いられます。',
    'problem.card2.title': 'パーツごとに分かれたベクターと一貫したブランドガイド',
    'problem.card2.desc': 'なめらかなベジェ曲線、厳格なテキスト枠、カラー配色セットの定義データがなければ、デザインを正確にスケールアップできません。',
    'problem.card3.title': '製造要件に合わせた材料、製造考慮(DFM)、BOMリスト',
    'problem.card3.desc': 'スニーカーや腕時計の写真からは本来の寸法を計測することはできません。VisualOSは厚みパラメータ、数量仕様書、公差基準を算出して提供します。',
    'problem.card4.title': '見積り時間を大幅削減する仕様書一括自動処理',
    'problem.card4.desc': '工場はイメージボード（ムードボード）のみの持ち込みを断ります。VisualOSは工業基準の部品表、組立て工程を構築し、迅速に見積り依頼を出せる環境を準備します。',

    // Workflow Section
    'workflow.badge': '自動化 CAD パイプライン',
    'workflow.title': 'プロンプト記述から実物製造パックが作られるまで。',
    'workflow.desc': 'シンプルなテキストプロンプトや手書きアイデアが瞬時に高精度な多層ベクター設計にアップデートされる工程。',
    'workflow.details.title': 'テクニカル分析レンダリング出力',
    'workflow.details.status': 'パイプライン処理ステータス',

    // Modules Section
    'modules.badge': 'システム内部コア',
    'modules.title': '統合された CAD 仕様 & 自動設計レイアウトエンジン',
    'modules.desc': 'なめらかなベジェ制御、物理応力許容計算、およびスペースレイアウト計画に適合する高生産性エンジン群。',

    // Use cases
    'usecases.badge': '産業別実装ケース',
    'usecases.title': '１つのカーネル、無限の適用事例。',
    'usecases.desc': 'グラフィックス、工業部品、製縫アパレル、空間の設計等に完全対応。クリックでアクティブプレビューが起動。',

    // Commands Section
    'commands.badge': 'システムターミナル',
    'commands.title': 'コマンドライン速度で設計作業を自動処理。',
    'commands.desc': '画期的なプロンプトコマンド。重なり合う複雑なツールバーメニューを行き来せず、文字列のみで自在に制御。',
    'commands.placeholder': 'コマンドを入力 (例: /create canvas, /unbox EV, /export)',
    'commands.output': 'シミュレーション稼働ログシステム',

    // Exports Section
    'exports.badge': 'マルチフォーマットコンパイラ',
    'exports.title': '物理スケールを完全に維持した普遍的な書き出しパック。',
    'exports.desc': '高精度ベクターパッケージやCAD連携に適したSTEPデータ、製品サイズテーブルまで即座にダウンロード可能。',

    // Unboxing Section
    'unboxing.badge': 'モジュール組み立て状態の分離',
    'unboxing.title': '部品単位に分解するアンボックステック。',
    'unboxing.desc': '複雑な構造部分を並べて精査します。指定箇所をクローズアップして応力計算、重量推定や構成データを評価。',

    // Quality Section
    'quality.badge': '自動化デザイン整合チェック(Linter)',
    'quality.title': 'リアルタイム自動エラー監査システム',
    'quality.desc': '重なりエラー、未設定の色成分、仕様外の厚さ、位置不整合などの幾何学的エラーがないかをバックグラウンドで検査。',
    'quality.btn.run': '全自動スキャン監査を実行する',
    'quality.btn.running': '幾何エラー走査中...',
    'quality.btn.resolved': 'すべての不具合を解消（CAD規格100％適合）',
    'quality.resolvedBadge': '100% 規格適合',

    // Footer
    'footer.cta': 'AI キャンバスカーネルの体験を始めましょう',
    'footer.ctadesc': '世界中のメカニカルエンジニア、製品デザイナー、パターンメーカーが信頼する完全な公差設定フローへ参加してください。',
    'footer.links.product': '製品コア',
    'footer.links.features': '搭載技術',
    'footer.links.api': 'API定義',
    'footer.links.docs': '開発者ドキュメント',
    'footer.links.security': 'セキュリティ',
    'footer.copyright': '© 2026 VisualOS Inc. All rights reserved. 多重座標演算ライセンス：Apache-2.0。'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('visualos-lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('visualos-lang', lang);
  };

  const t = (key: string): string => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
