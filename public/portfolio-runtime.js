import * as THREE from "./assets/three.module.min.js";

function bootPortfolioRuntime() {
const root = document.documentElement;
const canvas = document.getElementById("magic-canvas");
if (!canvas || canvas.dataset.runtimeActive === "true") return;
canvas.dataset.runtimeActive = "true";
const stage = document.getElementById("sigil-anchor");
const languageToggle = document.getElementById("language-toggle");
const languageLabel = languageToggle?.querySelector("[data-language-label]");
const themeToggle = document.getElementById("theme-toggle");
const reveals = document.querySelectorAll("[data-reveal]");
const chapterLinks = document.querySelectorAll("[data-section-target]");
const sectionNodes = [...document.querySelectorAll("[data-section]")];
const magneticItems = document.querySelectorAll(".magnetic");
const runtimeController = new AbortController();
const runtimeSignal = runtimeController.signal;
const languageGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*+";
let languageScrambleToken = 0;
let textScrambleToken = 0;
let revealObserver = null;
let animationFrame = 0;
let animationTimer = 0;
let scrollUpdateFrame = 0;
let resizeFrame = 0;
let themeTransitionTimer = 0;
let disposed = false;
let visualsPaused = document.hidden || root.classList.contains("is-route-transitioning");
const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");

function hasMajorGraphicsCaveat() {
  const probe = document.createElement("canvas");
  try {
    const contextOptions = { failIfMajorPerformanceCaveat: true };
    const context = probe.getContext("webgl2", contextOptions) || probe.getContext("webgl", contextOptions);
    if (!context) return true;
    const debugInfo = context.getExtension("WEBGL_debug_renderer_info");
    const rendererName = debugInfo
      ? context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : context.getParameter(context.RENDERER);
    const softwareRenderer = /swiftshader|llvmpipe|softpipe|software|microsoft basic render|mesa offscreen/i.test(String(rendererName));
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return softwareRenderer;
  } catch {
    return true;
  }
}

const resourceLimited = Boolean(navigator.connection?.saveData);
let visualQuality = hasMajorGraphicsCaveat() ? "software" : resourceLimited ? "balanced" : "full";

const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (from, to, alpha) => from + (to - from) * alpha;
const smoothstep = (edge0, edge1, value) => {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

const copy = {
  pt: {
    "nav.hero": "Início",
    "nav.services": "Fluxo",
    "nav.cases": "Casos",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "header.cta": "Falar sobre projeto",
    "hero.kicker": "Rickson de Oliveira · Desenvolvedor de software",
    "hero.title": "Sistemas sob medida.",
    "hero.body": "Feitos para simplificar o trabalho, organizar informações e reduzir tarefas manuais.",
    "hero.primary": "Ver projetos",
    "hero.secondary": "Conversar sobre um sistema",
    "hero.scroll": "Role para explorar",
    "services.label": "// 02. Fluxo",
    "services.title": "Meu fluxo de trabalho.",
    "services.body": "Trabalho em etapas simples: entendo o problema, organizo o fluxo, construo uma primeira versão e ajusto com feedback até a solução ficar clara, funcional e pronta para uso.",
    "services.one.title": "Entendo o desafio",
    "services.one.body": "Conheço seu cenário, sua rotina e o problema que realmente precisa ser resolvido.",
    "services.two.title": "Entendo como tudo funciona",
    "services.two.body": "Analiso como o trabalho acontece hoje e identifico o que pode funcionar melhor.",
    "services.three.title": "Defino o primeiro passo",
    "services.three.body": "Organizo as prioridades e defino com você o que faz sentido construir primeiro.",
    "services.four.title": "Construo a primeira versão",
    "services.four.body": "Desenvolvo o essencial, conecto as partes principais e entrego algo funcional para você testar.",
    "services.five.title": "Refino e entrego",
    "services.five.body": "Ajusto a experiência com base no feedback e preparo o sistema para uso no dia a dia.",
    "cases.label": "// 03. Projetos",
    "cases.title": "Projetos pensados para funcionar no mundo real.",
    "cases.body": "Cada projeto parte de um desafio diferente, mas segue a mesma ideia: entender bem o problema e construir algo que faça sentido no dia a dia.",
    "cases.cta": "Vamos falar sobre seu projeto",
    "cases.one.client": "Projeto para a Silver3",
    "cases.one.title": "Gestão de chamados",
    "cases.one.body": "Plataforma de gestão de chamados de TI criada para centralizar solicitações, responsáveis, SLAs, histórico e comunicação.",
    "cases.one.cta": "Ver estudo de caso",
    "cases.two.title": "Tifuns",
    "cases.two.body": "Projeto autoral de um portal sobre games, animes e e-sports, criado para explorar identidade visual, organização de conteúdo e uma experiência responsiva de leitura.",
    "cases.two.meta": "Projeto autoral · Em desenvolvimento",
    "cases.two.cta": "Visitar projeto",
    "cases.three.title": "Em breve",
    "cases.three.body": "Prepare um café e relaxe. O próximo projeto ainda está sendo preparado — e eu prefiro não servir nada pela metade.",
    "cases.three.meta": "Próximo da fila",
    "cases.three.break": "Pausa para o café · 03",
    "about.label": "// 04. Sobre",
    "about.title": "Olá, sou o Rickson, desenvolvedor de software.",
    "about.body": "Crio sistemas web sob medida para ajudar empresas e profissionais a organizarem melhor seus processos, centralizarem informações e reduzirem tarefas manuais no dia a dia.",
    "about.detail": "Gosto de entender de perto a rotina de cada cliente antes de desenvolver qualquer solução. Assim, consigo transformar problemas reais em ferramentas simples, funcionais e fáceis de usar.",
    "about.close": "Meu trabalho é transformar rotinas confusas em sistemas que as pessoas realmente conseguem usar no dia a dia.",
    "contact.label": "// 05. Contato",
    "contact.title": "Vamos tirar sua ideia do papel?",
    "contact.body": "Se você tem algum projeto em mente, um processo lento ou uma rotina manual, posso te ajudar a transformar isso numa solução clara e funcional.",
    "contact.schedule": "Agendar uma conversa",
    "contact.schedule.note": "Escolha um horário de 30 minutos para falarmos sobre seu projeto.",
    "contact.email": "Falar por e-mail",
    "contact.linkedin": "Me chamar no LinkedIn",
  },
  en: {
    "nav.hero": "Home",
    "nav.services": "Workflow",
    "nav.cases": "Cases",
    "nav.about": "About",
    "nav.contact": "Contact",
    "header.cta": "Discuss a project",
    "hero.kicker": "Rickson de Oliveira · Software Developer",
    "hero.title": "Custom-built systems.",
    "hero.body": "Built to simplify work, organize information, and reduce manual tasks.",
    "hero.primary": "See projects",
    "hero.secondary": "Talk about a system",
    "hero.scroll": "Scroll to explore",
    "services.label": "// 02. Workflow",
    "services.title": "My work process.",
    "services.body": "I work in simple stages: understand the problem, organize the flow, build a first version, and adjust with feedback until the solution is clear, functional, and ready to use.",
    "services.one.title": "I understand the challenge",
    "services.one.body": "I get to know your situation, your routine, and the problem that really needs to be solved.",
    "services.two.title": "I understand how it all works",
    "services.two.body": "I analyze how the work is done today and identify what could work better.",
    "services.three.title": "I define the first step",
    "services.three.body": "I organize the priorities and decide with you what makes sense to build first.",
    "services.four.title": "I build the first version",
    "services.four.body": "I develop the essentials, connect the main pieces, and deliver something functional for you to test.",
    "services.five.title": "I refine and deliver",
    "services.five.body": "I adjust the experience based on feedback and prepare the system for daily use.",
    "cases.label": "// 03. Projects",
    "cases.title": "Projects designed to work in the real world.",
    "cases.body": "Each project starts from a different challenge, but follows the same idea: understand the problem well and build something that makes sense in everyday use.",
    "cases.cta": "Let's talk about your project",
    "cases.one.client": "Project for Silver3",
    "cases.one.title": "Ticket management",
    "cases.one.body": "An IT ticket management platform built to centralize requests, ownership, SLAs, history, and communication.",
    "cases.one.cta": "View case study",
    "cases.two.title": "Tifuns",
    "cases.two.body": "An independent portal project about games, anime, and e-sports, created to explore visual identity, content organization, and a responsive reading experience.",
    "cases.two.meta": "Independent project · In development",
    "cases.two.cta": "Visit project",
    "cases.three.title": "Coming soon",
    "cases.three.body": "Make yourself a coffee and relax. The next project is still brewing — and I'd rather not serve anything half-finished.",
    "cases.three.meta": "Next in line",
    "cases.three.break": "Coffee break · 03",
    "about.label": "// 04. About",
    "about.title": "Hi, I'm Rickson, a software developer.",
    "about.body": "I create custom web systems to help companies and professionals better organize their processes, centralize information, and reduce manual tasks in their daily work.",
    "about.detail": "I like to understand each client's routine up close before developing any solution. That way, I can turn real problems into simple, functional, and easy-to-use tools.",
    "about.close": "My work is to turn confusing routines into systems people can actually use every day.",
    "contact.label": "// 05. Contact",
    "contact.title": "Ready to bring your idea to life?",
    "contact.body": "If you have a project in mind, a slow process, or a manual routine, I can help turn it into a clear and functional solution.",
    "contact.schedule": "Schedule a conversation",
    "contact.schedule.note": "Choose a 30-minute time slot to talk about your project.",
    "contact.email": "Email me",
    "contact.linkedin": "Message me on LinkedIn",
  },
};

const moodPresets = {
  dark: {
    hero: ["#EEBB46", "#384A55", "#D1A13A", 1],
    method: ["#384A55", "#EEBB46", "#2B383F", 0.86],
    projects: ["#2B383F", "#EEBB46", "#384A55", 0.92],
    about: ["#D1A13A", "#384A55", "#EEBB46", 0.82],
    contact: ["#EEBB46", "#2B383F", "#D1A13A", 1],
  },
  light: {
    hero: ["#2B383F", "#384A55", "#EEBB46", 0.6],
    method: ["#384A55", "#2B383F", "#D1A13A", 0.56],
    projects: ["#2B383F", "#1D2F3B", "#384A55", 0.58],
    about: ["#384A55", "#D1A13A", "#2B383F", 0.54],
    contact: ["#1D2F3B", "#384A55", "#EEBB46", 0.6],
  },
};

const sectionEffects = {
  hero: { x: 72, y: 46, angle: 116, gap: 118, spot: 0.21, line: 0.048, opacity: 0.8, scale: 1.04 },
  method: { x: 63, y: 43, angle: 90, gap: 150, spot: 0.16, line: 0.05, opacity: 0.72, scale: 0.98 },
  projects: { x: 60, y: 45, angle: 0, gap: 104, spot: 0.17, line: 0.052, opacity: 0.74, scale: 1.06 },
  about: { x: 58, y: 50, angle: 90, gap: 132, spot: 0.15, line: 0.045, opacity: 0.68, scale: 0.94 },
  contact: { x: 74, y: 53, angle: 136, gap: 124, spot: 0.19, line: 0.046, opacity: 0.78, scale: 1.08 },
};

const presetColorA = new THREE.Color();
const presetColorB = new THREE.Color();

const scrollState = {
  y: window.scrollY || 0,
  progress: 0,
  heroExit: 0,
  active: "hero",
  fxFrom: "hero",
  fxTo: "hero",
  fxMix: 0,
};

const navigationMotion = {
  active: false,
  frame: 0,
  fromSection: "hero",
  toSection: "hero",
  startY: 0,
  targetY: 0,
  startedAt: 0,
  duration: 0,
  hash: "",
};

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
const viewport = { width: 1, height: 1 };
const dummy = new THREE.Object3D();
const vector = new THREE.Vector3();
const stageTarget = new THREE.Vector3();
const colorA = new THREE.Color();
const colorB = new THREE.Color();
const currentMoodCache = {
  primary: new THREE.Color("#EEBB46"),
  secondary: new THREE.Color("#384A55"),
  tertiary: new THREE.Color("#D1A13A"),
  energy: 1,
  theme: "dark",
};
let lastFxSignature = "";

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: visualQuality === "full",
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, visualQuality === "software" ? 0.85 : visualQuality === "balanced" ? 1 : 1.25));
renderer.setClearColor(0x000000, 0);
if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
const motionProfile = {
  particleStep: 1,
  emberStep: 1,
  shardStep: 1,
  particleOpacity: 1,
  emberOpacity: 1,
  shardOpacity: 1,
  trailOpacity: 1,
  ringOpacity: 1,
  sigilOpacity: 1,
  pointer: 1,
  wobble: 1,
  speed: 1,
  scale: 1,
  pixelRatioCap: 1.25,
};

function updateMotionProfile() {
  const compact = window.innerWidth <= 760;
  const reduced = Boolean(reducedMotionQuery?.matches);
  const next = compact
    ? {
        particleStep: 2,
        emberStep: 3,
        shardStep: 2,
        particleOpacity: 0.72,
        emberOpacity: 0.54,
        shardOpacity: 0.62,
        trailOpacity: 0.56,
        ringOpacity: 0.58,
        sigilOpacity: 0.84,
        pointer: 0.38,
        wobble: 0.58,
        speed: 0.72,
        scale: 0.88,
        pixelRatioCap: 1,
      }
    : {
        particleStep: 1,
        emberStep: 1,
        shardStep: 1,
        particleOpacity: 1,
        emberOpacity: 1,
        shardOpacity: 1,
        trailOpacity: 1,
        ringOpacity: 1,
        sigilOpacity: 1,
        pointer: 1,
        wobble: 1,
        speed: 1,
        scale: 1,
        pixelRatioCap: 1.25,
      };

  if (reduced) {
    next.particleStep = Math.max(next.particleStep, 3);
    next.emberStep = Math.max(next.emberStep, 4);
    next.shardStep = Math.max(next.shardStep, 3);
    next.particleOpacity *= 0.62;
    next.emberOpacity *= 0.44;
    next.shardOpacity *= 0.44;
    next.trailOpacity *= 0.35;
    next.ringOpacity *= 0.38;
    next.sigilOpacity *= 0.72;
    next.pointer *= 0.2;
    next.wobble *= 0.24;
    next.speed *= 0.35;
    next.scale *= 0.82;
    next.pixelRatioCap = visualQuality === "software" ? 0.85 : 1;
  } else if (visualQuality === "software") {
    next.particleStep = Math.max(next.particleStep, 3);
    next.emberStep = Math.max(next.emberStep, 4);
    next.shardStep = Math.max(next.shardStep, 3);
    next.particleOpacity *= 0.68;
    next.emberOpacity *= 0.5;
    next.shardOpacity *= 0.54;
    next.trailOpacity *= 0.44;
    next.ringOpacity *= 0.52;
    next.pointer *= 0.34;
    next.wobble *= 0.48;
    next.speed *= 0.62;
    next.scale *= 0.88;
    next.pixelRatioCap = 0.85;
  } else if (visualQuality === "balanced") {
    next.particleStep = Math.max(next.particleStep, 2);
    next.emberStep = Math.max(next.emberStep, 2);
    next.shardStep = Math.max(next.shardStep, 2);
    next.particleOpacity *= 0.82;
    next.emberOpacity *= 0.72;
    next.shardOpacity *= 0.76;
    next.trailOpacity *= 0.72;
    next.ringOpacity *= 0.78;
    next.pointer *= 0.62;
    next.wobble *= 0.72;
    next.speed *= 0.82;
    next.pixelRatioCap = 1;
  }

  Object.assign(motionProfile, next);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, motionProfile.pixelRatioCap));
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.z = 7.4;

const portalGroup = new THREE.Group();
const sigilGroup = new THREE.Group();
const ringGroup = new THREE.Group();
const trailGroup = new THREE.Group();
scene.add(ringGroup, portalGroup, trailGroup, sigilGroup);

let particleMesh;
let emberMesh;
let shardMesh;
let sigilMaterials = [];
let trails = [];
let rings = [];

function seeded(index) {
  const x = Math.sin(index * 91.345 + 12.17) * 43758.5453;
  return x - Math.floor(x);
}

function createGlowTexture() {
  const size = 128;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = size;
  textureCanvas.height = size;
  const context = textureCanvas.getContext("2d");
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, "rgba(242,238,216,0.72)");
  gradient.addColorStop(0.46, "rgba(126,223,255,0.24)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(textureCanvas);
}

const glowTexture = createGlowTexture();

function createParticleData(count, offset) {
  return Array.from({ length: count }, (_, index) => ({
    angle: seeded(index + offset) * TAU,
    radius: 0.18 + seeded(index + offset + 21) * 0.92,
    lane: Math.floor(seeded(index + offset + 64) * 5),
    row: Math.floor(seeded(index + offset + 109) * 3),
    tone: seeded(index + offset + 183),
    depth: seeded(index + offset + 241),
    seed: seeded(index + offset + 312) * 100,
    speed: 0.15 + seeded(index + offset + 431) * 0.66,
    size: 0.018 + seeded(index + offset + 512) * 0.072,
  }));
}

const compactAtBoot = window.innerWidth <= 760;
const particleBudget = visualQuality === "software"
  ? (compactAtBoot ? [64, 16, 8] : [96, 24, 12])
  : visualQuality === "balanced"
    ? (compactAtBoot ? [96, 24, 12] : [180, 48, 20])
    : (compactAtBoot ? [128, 34, 16] : [320, 96, 40]);
const particleData = createParticleData(particleBudget[0], 4);
const emberData = createParticleData(particleBudget[1], 800);
const shardData = createParticleData(particleBudget[2], 1300);

function createInstancedPlanes(count, opacity, scale = 1) {
  const geometry = new THREE.PlaneGeometry(scale, scale);
  const material = new THREE.MeshBasicMaterial({
    map: glowTexture,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  portalGroup.add(mesh);
  return mesh;
}

function createTriangleFillGeometry(width = 2.04, height = 1.82) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height / 2);
  shape.lineTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(0, height / 2);
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.computeVertexNormals();
  return geometry;
}

function createTriangleLineGeometry(width = 2.04, height = 1.82, z = 0.04) {
  const vertices = new Float32Array([
    0, height / 2, z,
    -width / 2, -height / 2, z,
    width / 2, -height / 2, z,
    0, height / 2, z,
  ]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  return geometry;
}

function buildSigil() {
  const fillMaterial = new THREE.MeshBasicMaterial({
    color: "#111111",
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const outerMaterial = new THREE.LineBasicMaterial({
    color: "#EEBB46",
    transparent: true,
    opacity: 0.96,
    blending: THREE.AdditiveBlending,
  });
  const auraMaterial = new THREE.MeshBasicMaterial({
    color: "#D1A13A",
    map: glowTexture,
    transparent: true,
    opacity: 0.13,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const fill = new THREE.Mesh(createTriangleFillGeometry(), fillMaterial);
  const outer = new THREE.Line(createTriangleLineGeometry(), outerMaterial);
  const aura = new THREE.Mesh(new THREE.PlaneGeometry(3.55, 3.55), auraMaterial);
  aura.position.z = -0.32;

  sigilGroup.add(aura, fill, outer);
  sigilMaterials = [fillMaterial, outerMaterial, auraMaterial];
}

function createCircleLine(radius, segments = 150) {
  const points = [];
  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * TAU;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function buildRings() {
  const ringCount = visualQuality === "software" ? 3 : visualQuality === "balanced" ? 4 : compactAtBoot ? 5 : 6;
  rings = Array.from({ length: ringCount }, (_, index) => {
    const material = new THREE.LineBasicMaterial({
      color: index % 2 ? "#384A55" : "#EEBB46",
      transparent: true,
      opacity: 0.054 + index * 0.012,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Line(createCircleLine(0.78 + index * 0.31), material);
    ring.userData = {
      baseOpacity: material.opacity,
      speed: 0.022 + index * 0.006,
      eccentricity: 0.55 + index * 0.03,
    };
    ring.scale.y = ring.userData.eccentricity;
    ringGroup.add(ring);
    return ring;
  });
}

function buildTrails() {
  const trailCount = visualQuality === "software" ? 4 : visualQuality === "balanced" ? 7 : compactAtBoot ? 8 : 12;
  trails = Array.from({ length: trailCount }, (_, index) => {
    const radius = 0.9 + seeded(index + 60) * 1.65;
    const arc = 0.18 + seeded(index + 81) * 0.44;
    const start = seeded(index + 102) * TAU;
    const points = [];
    for (let step = 0; step <= 64; step += 1) {
      const t = step / 64;
      const angle = start + arc * TAU * t;
      const lift = Math.sin(t * Math.PI) * (0.16 + seeded(index + 130) * 0.38);
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.64 + lift, 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: index % 2 ? "#384A55" : "#EEBB46",
      transparent: true,
      opacity: 0.12 + seeded(index + 180) * 0.18,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = {
      baseOpacity: material.opacity,
      speed: 0.025 + seeded(index + 270) * 0.08,
      offset: seeded(index + 280) * TAU,
    };
    trailGroup.add(line);
    return line;
  });
}

function buildParticles() {
  particleMesh = createInstancedPlanes(particleData.length, 0.82, 1);
  emberMesh = createInstancedPlanes(emberData.length, 0.66, 1.2);
  const shardGeometry = new THREE.TetrahedronGeometry(0.072, 0);
  const shardMaterial = new THREE.MeshBasicMaterial({
    color: "#EEBB46",
    transparent: true,
    opacity: 0.52,
    wireframe: true,
    blending: THREE.AdditiveBlending,
  });
  shardMesh = new THREE.InstancedMesh(shardGeometry, shardMaterial, shardData.length);
  shardMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  portalGroup.add(shardMesh);
}

function updateViewport() {
  const distance = camera.position.z;
  viewport.height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
  viewport.width = viewport.height * camera.aspect;
}

function screenToWorld(x, y, z = 0, target = stageTarget) {
  vector.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
  vector.unproject(camera);
  const direction = vector.sub(camera.position).normalize();
  const distance = (z - camera.position.z) / direction.z;
  return target.copy(camera.position).add(direction.multiplyScalar(distance));
}

function updateStageTarget() {
  const rect = stage?.getBoundingClientRect();
  const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth * 0.62;
  const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.45;
  screenToWorld(clamp(centerX, 0, window.innerWidth), clamp(centerY, 0, window.innerHeight), 0.18, stageTarget);
}

function themeName() {
  return root.dataset.theme === "light" ? "light" : "dark";
}

function getMood() {
  const theme = themeName();
  const fromPreset = moodPresets[theme][scrollState.fxFrom] || moodPresets[theme].hero;
  const toPreset = moodPresets[theme][scrollState.fxTo] || moodPresets[theme].hero;
  const mix = smoothstep(0, 1, scrollState.fxMix);

  currentMoodCache.primary.lerpColors(presetColorA.set(fromPreset[0]), presetColorB.set(toPreset[0]), mix);
  currentMoodCache.secondary.lerpColors(presetColorA.set(fromPreset[1]), presetColorB.set(toPreset[1]), mix);
  currentMoodCache.tertiary.lerpColors(presetColorA.set(fromPreset[2]), presetColorB.set(toPreset[2]), mix);
  currentMoodCache.energy = lerp(fromPreset[3], toPreset[3], mix);
  currentMoodCache.theme = theme;
  return currentMoodCache;
}

function rgbTriplet(color) {
  const toSrgb = (value) => {
    const srgb = value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    return Math.round(Math.min(Math.max(srgb, 0), 1) * 255);
  };
  return `${toSrgb(color.r)} ${toSrgb(color.g)} ${toSrgb(color.b)}`;
}

function applyThemeBlending(material, theme) {
  const next = theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending;
  if (material.blending !== next) {
    material.blending = next;
    material.needsUpdate = true;
  }
}
function updateFxVariables(force = false) {
  const from = sectionEffects[scrollState.fxFrom] || sectionEffects.hero;
  const to = sectionEffects[scrollState.fxTo] || sectionEffects.hero;
  const rawT = smoothstep(0, 1, scrollState.fxMix);
  const t = Math.round(rawT * 64) / 64;
  const signature = `${scrollState.fxFrom}:${scrollState.fxTo}:${t}:${themeName()}`;
  if (!force && signature === lastFxSignature) return;
  lastFxSignature = signature;
  const mood = getMood();
  const light = mood.theme === "light";
  const lightSpot = light ? 0.55 : 1;
  const lightLine = light ? 0.78 : 1;
  const lightOpacity = light ? 0.74 : 1;

  root.style.setProperty("--fx-primary", rgbTriplet(mood.primary));
  root.style.setProperty("--fx-secondary", rgbTriplet(mood.secondary));
  root.style.setProperty("--fx-tertiary", rgbTriplet(mood.tertiary));
  root.style.setProperty("--fx-x", `${lerp(from.x, to.x, t).toFixed(2)}%`);
  root.style.setProperty("--fx-y", `${lerp(from.y, to.y, t).toFixed(2)}%`);
  root.style.setProperty("--fx-angle", `${lerp(from.angle, to.angle, t).toFixed(2)}deg`);
  const gap = lerp(from.gap, to.gap, t);
  root.style.setProperty("--fx-gap", `${gap.toFixed(2)}px`);
  root.style.setProperty("--fx-gap2", `${(gap * 2).toFixed(2)}px`);
  root.style.setProperty("--fx-spot", (lerp(from.spot, to.spot, t) * lightSpot).toFixed(4));
  root.style.setProperty("--fx-line", (lerp(from.line, to.line, t) * lightLine).toFixed(4));
  root.style.setProperty("--fx-opacity", (lerp(from.opacity, to.opacity, t) * lightOpacity).toFixed(4));
  root.style.setProperty("--fx-scale", lerp(from.scale, to.scale, t).toFixed(4));
}

const positionHero = { x: 0, y: 0, z: 0 };
const positionSectionA = { x: 0, y: 0, z: 0 };
const positionSectionB = { x: 0, y: 0, z: 0 };

function shapePosition(particle, time, sectionName, intensity = 1, target = positionHero) {
  const halfW = viewport.width * 0.5;
  const halfH = viewport.height * 0.5;
  const angle = particle.angle + time * (0.08 + particle.speed * 0.08) + scrollState.progress * TAU * 0.22;
  const wobble = Math.sin(time * particle.speed * 2.1 * motionProfile.speed + particle.seed) * 0.04 * motionProfile.wobble;
  const heroRadius = 0.36 + particle.radius * 0.54;
  const heroX = Math.cos(angle) * halfW * heroRadius + pointer.x * 0.12 * motionProfile.pointer;
  const heroY = Math.sin(angle) * halfH * heroRadius * 0.86 + pointer.y * 0.08 * motionProfile.pointer;
  const heroZ = (particle.depth - 0.5) * 0.8;

  if (sectionName === "method") {
    const lane = particle.lane / 4;
    target.x = lerp(-halfW * 0.48, halfW * 0.48, lane) + wobble;
    target.y = Math.sin(angle * 1.4) * halfH * 0.38;
    target.z = heroZ * 0.72;
    return target;
  }

  if (sectionName === "projects") {
    const row = particle.row - 1;
    target.x = Math.sin(angle + particle.seed) * halfW * 0.64;
    target.y = row * halfH * 0.24 + wobble;
    target.z = heroZ;
    return target;
  }

  if (sectionName === "about") {
    const step = particle.lane / 4;
    target.x = lerp(-halfW * 0.62, halfW * 0.62, step);
    target.y = Math.sin(angle * 2.2) * halfH * 0.16 + wobble;
    target.z = heroZ * 0.5;
    return target;
  }

  if (sectionName === "contact") {
    const localRadius = 0.14 + particle.radius * 0.35;
    target.x = Math.cos(angle) * halfW * localRadius + halfW * 0.12;
    target.y = Math.sin(angle * 1.2) * halfH * localRadius + wobble;
    target.z = heroZ * 0.34;
    return target;
  }

  target.x = heroX * intensity;
  target.y = heroY * intensity;
  target.z = heroZ;
  return target;
}

function hideInstance(mesh, index) {
  dummy.position.set(0, 0, 0);
  dummy.rotation.set(0, 0, 0);
  dummy.scale.setScalar(0);
  dummy.updateMatrix();
  mesh.setMatrixAt(index, dummy.matrix);
}

function updateInstanced(mesh, data, time, sizeBoost = 1) {
  const mood = getMood();
  const fragment = smoothstep(0.05, 0.82, scrollState.heroExit);
  const themeOpacity = mood.theme === "light" ? 0.44 : 1.02;
  const densityStep = mesh === particleMesh ? motionProfile.particleStep : motionProfile.emberStep;
  const opacityFactor = mesh === particleMesh ? motionProfile.particleOpacity : motionProfile.emberOpacity;

  data.forEach((particle, index) => {
    if (densityStep > 1 && index % densityStep !== 0) {
      hideInstance(mesh, index);
      return;
    }

    const hero = shapePosition(particle, time, "hero", 1.1, positionHero);
    const sectionA = shapePosition(particle, time, scrollState.fxFrom, mood.energy, positionSectionA);
    const sectionB = shapePosition(particle, time, scrollState.fxTo, mood.energy, positionSectionB);
    const sectionMix = smoothstep(0, 1, scrollState.fxMix);
    const toX = lerp(sectionA.x, sectionB.x, sectionMix);
    const toY = lerp(sectionA.y, sectionB.y, sectionMix);
    const toZ = lerp(sectionA.z, sectionB.z, sectionMix);
    const twinkle = 0.54 + Math.sin(time * 3 + particle.seed) * 0.34 + Math.sin(time * 0.9 + particle.seed * 0.37) * 0.12;
    const scale = particle.size * sizeBoost * motionProfile.scale * (0.78 + twinkle * 0.96) * (mood.theme === "light" ? 0.78 : 1.16);

    dummy.position.set(
      lerp(hero.x, toX, fragment),
      lerp(hero.y, toY, fragment),
      lerp(hero.z, toZ, fragment) + Math.sin(time * (0.24 + particle.speed * 0.08) * motionProfile.speed + particle.seed) * 0.035 * motionProfile.wobble,
    );
    dummy.rotation.z = particle.angle + time * 0.16 * motionProfile.speed;
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);

    colorA.lerpColors(mood.primary, mood.secondary, particle.tone);
    colorB.lerpColors(colorA, mood.tertiary, twinkle * 0.28);
    mesh.setColorAt(index, colorB);
  });

  applyThemeBlending(mesh.material, mood.theme);
  mesh.material.opacity = (mesh === particleMesh ? 0.86 * themeOpacity : 0.68 * themeOpacity) * opacityFactor;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

function updateShards(time) {
  const mood = getMood();
  const fragment = smoothstep(0.12, 0.72, scrollState.heroExit);

  shardData.forEach((particle, index) => {
    if (motionProfile.shardStep > 1 && index % motionProfile.shardStep !== 0) {
      hideInstance(shardMesh, index);
      return;
    }

    const hero = shapePosition(particle, time, "hero", 0.58, positionHero);
    const sectionA = shapePosition(particle, time, scrollState.fxFrom, 0.9, positionSectionA);
    const sectionB = shapePosition(particle, time, scrollState.fxTo, 0.9, positionSectionB);
    const sectionMix = smoothstep(0, 1, scrollState.fxMix);
    const toX = lerp(sectionA.x, sectionB.x, sectionMix);
    const toY = lerp(sectionA.y, sectionB.y, sectionMix);
    const toZ = lerp(sectionA.z, sectionB.z, sectionMix);
    dummy.position.set(
      lerp(hero.x, toX, fragment),
      lerp(hero.y, toY, fragment),
      lerp(hero.z, toZ, fragment) + 0.08,
    );
    dummy.rotation.set(
      time * (0.2 + particle.speed) * motionProfile.speed + particle.seed,
      time * 0.44 * motionProfile.speed + particle.angle,
      time * 0.32 * motionProfile.speed + particle.seed * 0.2,
    );
    dummy.scale.setScalar((0.34 + particle.size * 4.6 + fragment * 0.16) * motionProfile.scale);
    dummy.updateMatrix();
    shardMesh.setMatrixAt(index, dummy.matrix);
  });

  shardMesh.material.color.copy(mood.primary);
  applyThemeBlending(shardMesh.material, mood.theme);
  shardMesh.material.opacity = lerp(mood.theme === "light" ? 0.07 : 0.16, mood.theme === "light" ? 0.22 : 0.42, fragment) * motionProfile.shardOpacity;
  shardMesh.instanceMatrix.needsUpdate = true;
}

function updateTrails(time) {
  const mood = getMood();
  const fragment = smoothstep(0.02, 0.9, scrollState.heroExit);
  trailGroup.rotation.z = time * 0.018 * motionProfile.speed + pointer.x * 0.024 * motionProfile.pointer;
  trailGroup.rotation.x = pointer.y * 0.035 * motionProfile.pointer;
  trailGroup.scale.setScalar(lerp(0.82, 1.08, fragment));

  trails.forEach((trail, index) => {
    trail.rotation.z = time * trail.userData.speed * motionProfile.speed + trail.userData.offset;
    trail.rotation.y = Math.sin(time * 0.13 * motionProfile.speed + index) * 0.15 * motionProfile.wobble;
    applyThemeBlending(trail.material, mood.theme);
    trail.material.opacity = trail.userData.baseOpacity * (0.84 + fragment * 1.02) * (mood.theme === "light" ? 1.12 : 1.04) * motionProfile.trailOpacity;
    trail.material.color.copy(index % 3 === 0 ? mood.primary : index % 3 === 1 ? mood.secondary : mood.tertiary);
  });
}

function updateRings(time) {
  const mood = getMood();
  const fragment = smoothstep(0.02, 0.88, scrollState.heroExit);
  ringGroup.rotation.z = time * 0.035 * motionProfile.speed + scrollState.progress * TAU * 0.15;
  ringGroup.rotation.x = pointer.y * 0.045 * motionProfile.pointer;
  ringGroup.rotation.y = pointer.x * 0.06 * motionProfile.pointer;
  ringGroup.scale.setScalar(lerp(0.92, 1.18, fragment));

  rings.forEach((ring, index) => {
    ring.rotation.z = time * ring.userData.speed * motionProfile.speed * (index % 2 ? -1 : 1);
    ring.rotation.x = Math.sin(time * 0.15 * motionProfile.speed + index) * 0.08 * motionProfile.wobble;
    applyThemeBlending(ring.material, mood.theme);
    ring.material.opacity = ring.userData.baseOpacity * (mood.theme === "light" ? 1.62 : 1.12) * (0.7 + fragment * 0.98) * motionProfile.ringOpacity;
    ring.material.color.copy(index % 3 === 0 ? mood.primary : index % 3 === 1 ? mood.secondary : mood.tertiary);
  });
}

function updateSigil(time) {
  const exit = smoothstep(0.08, 0.78, scrollState.heroExit);
  const mood = getMood();

  sigilGroup.position.lerp(stageTarget, 0.1);
  ringGroup.position.lerp(stageTarget, 0.08);
  trailGroup.position.lerp(stageTarget, 0.06);
  sigilGroup.rotation.x = pointer.y * 0.1 * motionProfile.pointer + Math.sin(time * 0.32 * motionProfile.speed) * 0.032 * motionProfile.wobble;
  sigilGroup.rotation.y = pointer.x * 0.12 * motionProfile.pointer + Math.sin(time * 0.19 * motionProfile.speed) * 0.08 * motionProfile.wobble;
  sigilGroup.rotation.z = Math.sin(time * 0.22 * motionProfile.speed) * 0.04 * motionProfile.wobble + exit * 0.36;
  sigilGroup.scale.setScalar(lerp(0.88, 0.42, exit));

  sigilMaterials.forEach((material) => applyThemeBlending(material, mood.theme));
  sigilMaterials[0].color.set(mood.theme === "light" ? "#ffffff" : "#070707");
  sigilMaterials[0].opacity = (mood.theme === "light" ? 0.04 : 0.24) * lerp(1, 0.08, exit) * motionProfile.sigilOpacity;
  sigilMaterials[1].color.copy(mood.primary);
  sigilMaterials[1].opacity = (mood.theme === "light" ? 0.95 : 0.88) * lerp(1, 0.08, exit) * motionProfile.sigilOpacity;
  sigilMaterials[2].color.copy(mood.tertiary);
  sigilMaterials[2].opacity = (mood.theme === "light" ? 0.1 : 0.14) * lerp(1, 0.1, exit) * motionProfile.sigilOpacity;
}

function updateActiveSection() {
  const centers = sectionNodes.map((section) => {
    const rect = section.getBoundingClientRect();
    return {
      id: section.dataset.section,
      center: rect.top + scrollState.y + rect.height * 0.48,
    };
  });

  const scrollCenter = scrollState.y + window.innerHeight * 0.5;
  let from = centers[0] || { id: "hero", center: 0 };
  let to = from;
  let rawMix = 0;

  if (centers.length > 1) {
    if (scrollCenter <= centers[0].center) {
      from = centers[0];
      to = centers[1];
      rawMix = 0;
    } else if (scrollCenter >= centers[centers.length - 1].center) {
      from = centers[centers.length - 1];
      to = from;
      rawMix = 0;
    } else {
      for (let index = 0; index < centers.length - 1; index += 1) {
        const current = centers[index];
        const next = centers[index + 1];
        if (scrollCenter >= current.center && scrollCenter <= next.center) {
          from = current;
          to = next;
          rawMix = clamp((scrollCenter - current.center) / Math.max(next.center - current.center, 1));
          break;
        }
      }
    }
  }

  const mix = smoothstep(0.08, 0.92, rawMix);
  const active = mix < 0.5 ? from.id : to.id;

  const previousActive = scrollState.active;
  scrollState.fxFrom = from.id;
  scrollState.fxTo = to.id;
  scrollState.fxMix = mix;
  scrollState.active = active;
  if (root.dataset.section !== active) root.dataset.section = active;
  updateFxVariables();

  if (previousActive !== active) updateChapterLinks(active);
}

function updateChapterLinks(activeSection) {
  chapterLinks.forEach((link) => {
    const isActive = link.dataset.sectionTarget === activeSection;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function forceSectionState(sectionId) {
  if (!sectionId || !sectionEffects[sectionId]) return;
  scrollState.active = sectionId;
  scrollState.fxFrom = sectionId;
  scrollState.fxTo = sectionId;
  scrollState.fxMix = 0;
  root.dataset.section = sectionId;
  updateFxVariables();
  updateChapterLinks(sectionId);
}

function getCurrentSectionId() {
  return scrollState.active || root.dataset.section || "hero";
}

function setDirectedSectionState(fromSection, toSection, mix) {
  const target = toSection || fromSection || "hero";
  if (!sectionEffects[target]) return;

  scrollState.active = target;
  scrollState.fxFrom = sectionEffects[fromSection] ? fromSection : target;
  scrollState.fxTo = target;
  scrollState.fxMix = clamp(mix);
  root.dataset.section = target;
  updateFxVariables();
  updateChapterLinks(target);
}

function stopNavigationMotion({ sync = true } = {}) {
  if (navigationMotion.frame) {
    cancelAnimationFrame(navigationMotion.frame);
  }

  navigationMotion.active = false;
  navigationMotion.frame = 0;
  root.classList.remove("is-section-travelling");

  if (sync) updateScroll();
}

const easeInOutCubic = (value) => {
  const x = clamp(value);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

function jumpToAnchor(hash) {
  if (!hash || hash === "#") return false;
  const target = document.querySelector(hash);
  if (!target) return false;

  const targetSection = target.matches("[data-section]") ? target : target.closest("[data-section]");
  const sectionId = targetSection?.dataset.section || target.id;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const top = clamp(target.getBoundingClientRect().top + window.scrollY, 0, maxScroll);
  const startY = window.scrollY || 0;
  const distance = Math.abs(top - startY);

  stopNavigationMotion({ sync: false });

  if (distance < 4) {
    forceSectionState(sectionId);
    if (window.location.hash !== hash) history.pushState(null, "", hash);
    return true;
  }

  navigationMotion.active = true;
  navigationMotion.fromSection = getCurrentSectionId();
  navigationMotion.toSection = sectionId;
  navigationMotion.startY = startY;
  navigationMotion.targetY = top;
  navigationMotion.startedAt = performance.now();
  navigationMotion.duration = clamp(520 + distance * 0.18, 680, 1150);
  navigationMotion.hash = hash;
  root.classList.add("is-section-travelling");
  setDirectedSectionState(navigationMotion.fromSection, navigationMotion.toSection, 0);

  const step = (now) => {
    const rawProgress = clamp((now - navigationMotion.startedAt) / navigationMotion.duration);
    const easedProgress = easeInOutCubic(rawProgress);

    window.scrollTo({
      top: lerp(navigationMotion.startY, navigationMotion.targetY, easedProgress),
      left: 0,
      behavior: "auto",
    });
    setDirectedSectionState(
      navigationMotion.fromSection,
      navigationMotion.toSection,
      smoothstep(0, 1, rawProgress),
    );

    if (rawProgress < 1) {
      navigationMotion.frame = requestAnimationFrame(step);
      return;
    }

    navigationMotion.active = false;
    navigationMotion.frame = 0;
    root.classList.remove("is-section-travelling");
    window.scrollTo({ top: navigationMotion.targetY, left: 0, behavior: "auto" });
    forceSectionState(navigationMotion.toSection);
    if (window.location.hash !== navigationMotion.hash) history.pushState(null, "", navigationMotion.hash);
    requestAnimationFrame(updateScroll);
  };

  navigationMotion.frame = requestAnimationFrame(step);

  return true;
}
function updateScroll() {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  scrollState.y = window.scrollY || 0;
  scrollState.progress = clamp(scrollState.y / maxScroll);
  scrollState.heroExit = clamp(scrollState.y / Math.max(window.innerHeight * 0.92, 1));
  updateStageTarget();
  if (!navigationMotion.active) updateActiveSection();
}

function scrambleLanguageLabel(targetText) {
  if (!languageToggle || !languageLabel) return;

  const token = ++languageScrambleToken;
  const duration = 820;
  const startedAt = performance.now();
  languageToggle.classList.add("is-scrambling");

  const tick = (now) => {
    if (token !== languageScrambleToken) return;
    const progress = clamp((now - startedAt) / duration);
    const reveal = Math.floor(progress * (targetText.length + 1));
    languageLabel.textContent = targetText
      .split("")
      .map((letter, index) => {
        if (index < reveal) return letter;
        const glyphIndex = Math.floor((now * 0.028 + index * 9 + token * 7) % languageGlyphs.length);
        return languageGlyphs[glyphIndex];
      })
      .join("");

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    languageLabel.textContent = targetText;
    languageToggle.classList.remove("is-scrambling");
  };

  requestAnimationFrame(tick);
}

function updateLanguageControl(lang, animate = false) {
  if (!languageToggle || !languageLabel) return;

  const nextLang = lang === "en" ? "pt" : "en";
  const targetText = lang.toUpperCase();
  languageToggle.dataset.activeLang = lang;
  languageToggle.dataset.nextLang = nextLang;
  languageToggle.setAttribute("aria-label", lang === "en" ? "Switch language to Portuguese" : "Trocar idioma para inglês");

  if (animate) {
    scrambleLanguageLabel(targetText);
  } else {
    languageScrambleToken += 1;
    languageLabel.textContent = targetText;
    languageToggle.classList.remove("is-scrambling");
  }
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function unlockTextMorphBox(element) {
  const lock = element.__textMorphLock;
  if (!lock) return;
  element.style.display = lock.display;
  element.style.width = lock.width;
  element.style.minWidth = lock.minWidth;
  element.style.minHeight = lock.minHeight;
  element.__textMorphLock = null;
}

function lockTextMorphBox(element, targetText) {
  unlockTextMorphBox(element);

  const originalText = element.textContent || "";
  const computed = getComputedStyle(element);
  const currentRect = element.getBoundingClientRect();

  element.textContent = targetText;
  const targetRect = element.getBoundingClientRect();
  element.textContent = originalText;

  const width = Math.ceil(Math.max(currentRect.width, targetRect.width));
  const height = Math.ceil(Math.max(currentRect.height, targetRect.height));
  const display = computed.display;
  const shouldLockWidth =
    display === "inline" ||
    display === "inline-block" ||
    Boolean(element.closest(".header-cta, .button, .inline-action, .contact-line, .scroll-cue, .rail-nav"));

  element.__textMorphLock = {
    display: element.style.display,
    width: element.style.width,
    minWidth: element.style.minWidth,
    minHeight: element.style.minHeight,
  };

  if (shouldLockWidth && width > 0) {
    if (display === "inline") element.style.display = "inline-block";
    element.style.width = `${width}px`;
  }

  if (height > 0) element.style.minHeight = `${height}px`;
}

function scrambleTextElement(element, targetText, token, delay = 0) {
  lockTextMorphBox(element, targetText);
  const originalText = element.textContent || "";
  const originalLength = originalText.length;
  const targetLength = targetText.length;
  const maxLength = Math.max(originalLength, targetLength, 1);
  const duration = Math.min(1180, 760 + targetText.length * 6);
  const startedAt = performance.now() + delay;
  element.classList.add("is-text-morphing");

  const glyphAt = (now, index) => {
    const glyphIndex = Math.floor((now * 0.024 + index * 13 + token * 3 + originalText.length) % languageGlyphs.length);
    return languageGlyphs[glyphIndex];
  };

  const tick = (now) => {
    if (token !== textScrambleToken) return;
    const progress = clamp((now - startedAt) / duration);

    if (progress <= 0) {
      requestAnimationFrame(tick);
      return;
    }

    const lengthProgress = smoothstep(0.12, 0.84, progress);
    const visibleLength = Math.max(1, Math.round(lerp(originalLength || targetLength, targetLength, lengthProgress)));
    const band = Math.max(3, Math.round(maxLength * 0.2));
    const wave = progress * (maxLength + band * 1.1);
    const glyphStart = wave - band;
    const glyphEnd = wave;
    const isScrambling = progress > 0.035;

    element.textContent = Array.from({ length: visibleLength }, (_, index) => {
      const targetCharacter = targetText[index] || "";
      const originalCharacter = originalText[index] || "";
      const characterForSpacing = targetCharacter || originalCharacter;
      const isResolved = progress > 0.98 || index < glyphStart;
      const isInWave = index <= glyphEnd;

      if (!isScrambling && originalCharacter) return originalCharacter;
      if (!targetCharacter) {
        if (isResolved) return "";
        return isInWave ? glyphAt(now, index) : originalCharacter;
      }
      if (/\s/.test(characterForSpacing)) return isResolved ? targetCharacter : " ";
      if (/[.,:;!?()·]/.test(characterForSpacing)) return isResolved ? targetCharacter : glyphAt(now, index);
      if (isResolved) return targetCharacter;
      return isInWave ? glyphAt(now, index) : originalCharacter || glyphAt(now, index);
    }).join("");

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    element.textContent = targetText;
    element.classList.remove("is-text-morphing");
    window.setTimeout(() => unlockTextMorphBox(element), 180);
  };

  requestAnimationFrame(tick);
}

function applyLanguageText(dictionary, animate = false) {
  const elements = [...document.querySelectorAll("[data-i18n]")];
  const shouldAnimate = animate && !prefersReducedMotion();

  textScrambleToken += 1;
  elements.forEach((element) => {
    element.classList.remove("is-text-morphing");
    unlockTextMorphBox(element);
  });

  if (!shouldAnimate) {
    root.classList.remove("is-language-morphing");
    elements.forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    return;
  }

  const token = textScrambleToken;
  root.classList.add("is-language-morphing");
  elements.forEach((element, index) => {
    const value = dictionary[element.dataset.i18n];
    if (!value) return;
    const isChrome = element.closest(".side-rail, .topbar");
    const delay = isChrome ? index * 14 : Math.min(260, index * 24);
    scrambleTextElement(element, value, token, delay);
  });

  window.setTimeout(() => {
    if (token === textScrambleToken) root.classList.remove("is-language-morphing");
  }, 1600);
}

function setLanguage(lang, options = {}) {
  const dictionary = copy[lang] || copy.pt;
  root.lang = lang === "en" ? "en" : "pt-BR";
  applyLanguageText(dictionary, options.scramble);
  updateLanguageControl(lang, options.scramble);
  localStorage.setItem("rickson-portfolio-lang", lang);
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.dataset.theme = theme;
    themeToggle.setAttribute("aria-checked", String(theme === "light"));
    themeToggle.setAttribute("aria-label", theme === "light" ? "Usar tema escuro" : "Usar tema claro");
  }
  localStorage.setItem("rickson-portfolio-theme", theme);
  updateFxVariables(true);
}

function playThemeTransitionSigil(originX, originY, theme) {
  document.querySelector(".theme-transition-sigil")?.remove();
  const sigil = document.createElement("span");
  sigil.className = "theme-transition-sigil";
  sigil.dataset.theme = theme;
  sigil.setAttribute("aria-hidden", "true");
  sigil.style.setProperty("--theme-transition-x", `${originX}px`);
  sigil.style.setProperty("--theme-transition-y", `${originY}px`);
  document.body.append(sigil);
  sigil.addEventListener("animationend", () => sigil.remove(), { once: true });
}

function setTheme(theme, options = {}) {
  const shouldAnimate = options.animate
    && root.dataset.theme !== theme
    && !reducedMotionQuery?.matches;

  if (!shouldAnimate) {
    applyTheme(theme);
    return;
  }

  const toggleBounds = themeToggle?.getBoundingClientRect();
  const originX = toggleBounds ? toggleBounds.left + toggleBounds.width / 2 : window.innerWidth / 2;
  const originY = toggleBounds ? toggleBounds.top + toggleBounds.height / 2 : window.innerHeight / 2;

  if (typeof document.startViewTransition !== "function") {
    window.clearTimeout(themeTransitionTimer);
    playThemeTransitionSigil(originX, originY, theme);
    root.classList.add("is-theme-transitioning");
    requestAnimationFrame(() => {
      applyTheme(theme);
      themeTransitionTimer = window.setTimeout(() => {
        root.classList.remove("is-theme-transitioning");
        themeTransitionTimer = 0;
      }, 820);
    });
    return;
  }

  const revealRadius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY),
  );

  root.style.setProperty("--theme-transition-x", `${originX}px`);
  root.style.setProperty("--theme-transition-y", `${originY}px`);
  root.style.setProperty("--theme-transition-radius", `${revealRadius}px`);

  const clearTransitionProperties = () => {
    root.style.removeProperty("--theme-transition-x");
    root.style.removeProperty("--theme-transition-y");
    root.style.removeProperty("--theme-transition-radius");
  };

  try {
    const transition = document.startViewTransition(() => applyTheme(theme));
    transition.finished.then(clearTransitionProperties, clearTransitionProperties);
  } catch {
    clearTransitionProperties();
    applyTheme(theme);
  }
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -12% 0px" },
  );

  reveals.forEach((element) => revealObserver.observe(element));
}

function setupMagneticMotion() {
  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    }, { signal: runtimeSignal });
    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    }, { signal: runtimeSignal });
  });
}

function scheduleScrollUpdate() {
  if (scrollUpdateFrame || disposed) return;
  scrollUpdateFrame = requestAnimationFrame(() => {
    scrollUpdateFrame = 0;
    updateScroll();
  });
}

function scheduleResize() {
  if (resizeFrame || disposed) return;
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = 0;
    resize();
  });
}

function pauseVisuals() {
  visualsPaused = true;
  cancelAnimationFrame(animationFrame);
  window.clearTimeout(animationTimer);
  window.clearTimeout(themeTransitionTimer);
  document.querySelector(".theme-transition-sigil")?.remove();
  root.classList.remove("is-theme-transitioning");
  animationFrame = 0;
  animationTimer = 0;
  themeTransitionTimer = 0;
}

function resumeVisuals() {
  if (disposed || !visualsPaused || document.hidden) return;
  visualsPaused = false;
  lastAnimationFrame = 0;
  animationFrame = requestAnimationFrame(animate);
}

function handleVisibilityChange() {
  if (document.hidden) pauseVisuals();
  else resumeVisuals();
}

function setupEvents() {
  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true, signal: runtimeSignal });
  window.addEventListener("resize", scheduleResize, { passive: true, signal: runtimeSignal });
  window.addEventListener("wheel", () => {
    if (navigationMotion.active) stopNavigationMotion();
  }, { passive: true, signal: runtimeSignal });
  window.addEventListener("touchstart", () => {
    if (navigationMotion.active) stopNavigationMotion();
  }, { passive: true, signal: runtimeSignal });
  window.addEventListener("keydown", (event) => {
    const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
    if (navigationMotion.active && scrollKeys.includes(event.key)) stopNavigationMotion();
  }, { signal: runtimeSignal });
  window.addEventListener("pointermove", (event) => {
    pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = -(event.clientY / window.innerHeight - 0.5) * 2;
  }, { signal: runtimeSignal });
  document.addEventListener("visibilitychange", handleVisibilityChange, { signal: runtimeSignal });
  window.addEventListener("portfolio-visuals-pause", pauseVisuals, { signal: runtimeSignal });
  window.addEventListener("portfolio-visuals-resume", resumeVisuals, { signal: runtimeSignal });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute("href");
      if (jumpToAnchor(hash)) event.preventDefault();
    }, { signal: runtimeSignal });
  });

  languageToggle?.addEventListener("click", () => {
    setLanguage(languageToggle.dataset.activeLang === "en" ? "pt" : "en", { scramble: true });
  }, { signal: runtimeSignal });

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "light" ? "dark" : "light", { animate: true });
  }, { signal: runtimeSignal });

  reducedMotionQuery?.addEventListener?.("change", () => {
    updateMotionProfile();
    resize();
  }, { signal: runtimeSignal });
}

function resize() {
  const width = Math.max(window.innerWidth, 1);
  const height = Math.max(window.innerHeight, 1);
  updateMotionProfile();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  updateViewport();
  updateScroll();
}

let lastAnimationFrame = 0;
let averageFrameCost = 0;
let slowFrameStreak = 0;
let qualityAssessmentStartedAt = performance.now() + 3000;
let renderedFrameCount = 0;

function lowerVisualQuality() {
  if (visualQuality === "software") return;
  visualQuality = visualQuality === "full" ? "balanced" : "software";
  root.dataset.visualQuality = visualQuality;
  averageFrameCost = 0;
  slowFrameStreak = 0;
  qualityAssessmentStartedAt = performance.now() + 1500;
  updateMotionProfile();
  renderer.setSize(Math.max(window.innerWidth, 1), Math.max(window.innerHeight, 1), false);
}

function animate(now = 0) {
  if (!canvas.isConnected || disposed) {
    dispose();
    return;
  }
  if (visualsPaused || document.hidden) return;

  const reducedMotion = Boolean(reducedMotionQuery?.matches);
  const targetFps = 60;
  const targetFrameInterval = 1000 / targetFps;

  if (!reducedMotion && now - lastAnimationFrame < targetFrameInterval) {
    animationFrame = requestAnimationFrame(animate);
    return;
  }

  const frameGap = lastAnimationFrame ? now - lastAnimationFrame : targetFrameInterval;
  lastAnimationFrame = now - (frameGap % targetFrameInterval);
  const frameStartedAt = performance.now();
  const time = reducedMotion ? 0 : now * 0.001;
  renderedFrameCount += 1;
  pointer.x = lerp(pointer.x, pointer.tx, 0.075);
  pointer.y = lerp(pointer.y, pointer.ty, 0.075);

  const particleUpdateStride = window.innerWidth <= 760
    ? 3
    : visualQuality === "software"
      ? 3
      : visualQuality === "balanced"
        ? 2
        : 1;
  if (renderedFrameCount === 1 || renderedFrameCount % particleUpdateStride === 0) {
    updateInstanced(particleMesh, particleData, time, 1);
    updateInstanced(emberMesh, emberData, time * 1.12 + 3, 1.55);
    updateShards(time);
  }
  const secondaryUpdateStride = window.innerWidth <= 760
    ? 2
    : visualQuality === "full"
      ? 1
      : 2;
  if (renderedFrameCount === 1 || renderedFrameCount % secondaryUpdateStride === 0) {
    updateTrails(time);
    updateRings(time);
  }
  updateSigil(time);
  renderer.render(scene, camera);
  if (visualQuality !== "software" && !reducedMotion && now >= qualityAssessmentStartedAt) {
    const frameCost = performance.now() - frameStartedAt;
    averageFrameCost = averageFrameCost ? lerp(averageFrameCost, frameCost, 0.08) : frameCost;
    const missedFrame = frameGap > targetFrameInterval * 1.8;
    slowFrameStreak = averageFrameCost > 15 || missedFrame
      ? slowFrameStreak + 1
      : Math.max(0, slowFrameStreak - 1);
    if (slowFrameStreak >= 8) lowerVisualQuality();
  }
  if (reducedMotion) {
    animationTimer = window.setTimeout(() => {
      if (!visualsPaused && !document.hidden && !disposed) {
        animationFrame = requestAnimationFrame(animate);
      }
    }, 250);
  } else {
    animationFrame = requestAnimationFrame(animate);
  }
}

function dispose() {
  if (disposed) return;
  disposed = true;
  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(navigationMotion.frame);
  cancelAnimationFrame(scrollUpdateFrame);
  cancelAnimationFrame(resizeFrame);
  window.clearTimeout(animationTimer);
  window.clearTimeout(themeTransitionTimer);
  runtimeController.abort();
  revealObserver?.disconnect();
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
    else object.material?.dispose?.();
  });
  renderer.dispose();
  document.querySelector(".theme-transition-sigil")?.remove();
  root.classList.remove("is-runtime-ready", "is-language-morphing", "is-theme-transitioning");
}

function boot() {
  buildSigil();
  buildRings();
  buildTrails();
  buildParticles();
  root.dataset.visualQuality = visualQuality;
  root.classList.add("is-runtime-ready");
  setupEvents();
  setupRevealObserver();
  setupMagneticMotion();

  const params = new URLSearchParams(window.location.search);
  const forcedTheme = params.get("theme");
  const forcedLanguage = params.get("lang");
  const storedTheme = localStorage.getItem("rickson-portfolio-theme");
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  setTheme(forcedTheme === "light" || forcedTheme === "dark" ? forcedTheme : storedTheme || (prefersLight ? "light" : "dark"));

  setLanguage(forcedLanguage === "en" || forcedLanguage === "pt" ? forcedLanguage : localStorage.getItem("rickson-portfolio-lang") || "pt");
  resize();
  if (!visualsPaused) animationFrame = requestAnimationFrame(animate);
}

boot();
}

window.addEventListener("portfolio-runtime-mount", bootPortfolioRuntime);
bootPortfolioRuntime();






































