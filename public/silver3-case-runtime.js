import * as THREE from "./assets/three.module.min.js";

function bootSilver3Runtime() {
const canvas = document.getElementById("silver3-case-canvas");

if (canvas && canvas.dataset.runtimeActive !== "true") {
  canvas.dataset.runtimeActive = "true";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const pixelRatioCap = () => visualQuality === "software" ? 0.85 : visualQuality === "balanced" ? 1 : window.innerWidth < 760 ? 1 : 1.25;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: visualQuality === "full",
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap()));
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
  camera.position.z = 9;

  const gold = new THREE.Color("#eebb46");
  const cyan = new THREE.Color("#6ea6b8");
  const green = new THREE.Color("#5f9c88");
  const white = new THREE.Color("#f7f7f1");
  const ink = new THREE.Color("#25333a");
  const colorTarget = new THREE.Color();

  const rune = new THREE.Group();
  const runePivot = new THREE.Group();
  rune.add(runePivot);
  scene.add(rune);

  const materials = [];
  function lineMaterial(color, opacity) {
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    material.userData.baseOpacity = opacity;
    materials.push(material);
    return material;
  }

  function meshMaterial(color, opacity, wireframe = false) {
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, wireframe });
    material.userData.baseOpacity = opacity;
    materials.push(material);
    return material;
  }

  const goldLine = lineMaterial(gold, 0.82);
  const cyanLine = lineMaterial(cyan, 0.58);
  const faintLine = lineMaterial(white, 0.24);
  const pulseMaterial = meshMaterial(gold, 0.95);
  const coreFillMaterial = meshMaterial(gold, 0.13);
  const coreWireMaterial = meshMaterial(gold, 0.94, true);

  function createLineLoop(points, material) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const loop = new THREE.LineLoop(geometry, material);
    runePivot.add(loop);
    return loop;
  }

  function createCircle(radius, material, segments = 128, start = 0, length = Math.PI * 2) {
    const points = [];
    const count = Math.max(8, Math.round(segments * length / (Math.PI * 2)));
    for (let index = 0; index <= count; index += 1) {
      const angle = start + length * index / count;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    runePivot.add(line);
    return line;
  }

  const rings = new THREE.Group();
  runePivot.add(rings);
  const outerRing = createCircle(2.78, goldLine, 160);
  const brokenRingA = createCircle(2.36, cyanLine, 120, 0.18, Math.PI * 0.82);
  const brokenRingB = createCircle(2.36, cyanLine, 120, Math.PI * 1.18, Math.PI * 0.64);
  const innerRing = createCircle(1.04, faintLine, 96);
  rings.add(outerRing, brokenRingA, brokenRingB, innerRing);

  const triangleGroup = new THREE.Group();
  runePivot.add(triangleGroup);
  [2.42, 1.82, 1.2].forEach((size, index) => {
    const y = -0.08;
    const triangle = createLineLoop([
      new THREE.Vector3(0, y + size * 0.78, index * -0.025),
      new THREE.Vector3(-size * 0.72, y - size * 0.5, index * -0.025),
      new THREE.Vector3(size * 0.72, y - size * 0.5, index * -0.025)
    ], index === 1 ? cyanLine : index === 2 ? faintLine : goldLine);
    triangleGroup.add(triangle);
  });

  const tickPositions = [];
  for (let index = 0; index < 24; index += 1) {
    const angle = index / 24 * Math.PI * 2;
    const inner = index % 3 === 0 ? 2.87 : 2.93;
    const outer = index % 3 === 0 ? 3.08 : 3.02;
    tickPositions.push(
      Math.cos(angle) * inner, Math.sin(angle) * inner, 0,
      Math.cos(angle) * outer, Math.sin(angle) * outer, 0
    );
  }
  const tickGeometry = new THREE.BufferGeometry();
  tickGeometry.setAttribute("position", new THREE.Float32BufferAttribute(tickPositions, 3));
  const ticks = new THREE.LineSegments(tickGeometry, faintLine);
  runePivot.add(ticks);

  const axisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -2.18, 0), new THREE.Vector3(0, 2.18, 0),
    new THREE.Vector3(-1.92, -1.18, 0), new THREE.Vector3(1.92, -1.18, 0),
    new THREE.Vector3(-1.52, 0.72, 0), new THREE.Vector3(1.52, 0.72, 0)
  ]);
  const axes = new THREE.LineSegments(axisGeometry, faintLine);
  runePivot.add(axes);

  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), coreFillMaterial);
  const coreWire = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), coreWireMaterial);
  core.scale.y = 1.35;
  coreWire.scale.y = 1.35;
  runePivot.add(core, coreWire);

  const networkGroup = new THREE.Group();
  runePivot.add(networkGroup);
  networkGroup.add(ticks, axes);

  const nodeColors = [cyan, gold, green, cyan, green, gold];
  const nodes = [];
  const nodeShells = [];
  for (let index = 0; index < 6; index += 1) {
    const large = index < 3;
    const geometry = large
      ? new THREE.OctahedronGeometry(0.23, 0)
      : new THREE.TetrahedronGeometry(0.13, 0);
    const fill = new THREE.Mesh(geometry, meshMaterial(nodeColors[index], large ? 0.12 : 0.08));
    const shell = new THREE.Mesh(geometry, meshMaterial(nodeColors[index], large ? 0.9 : 0.62, true));
    fill.userData.baseScale = 1;
    shell.userData.baseScale = large ? 1.27 : 1.18;
    shell.scale.setScalar(shell.userData.baseScale);
    nodes.push(fill);
    nodeShells.push(shell);
    networkGroup.add(fill, shell);
  }

  const edgePairs = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 6], [1, 2], [2, 3], [3, 1]];
  const linePositions = new Float32Array(edgePairs.length * 6);
  const connectionGeometry = new THREE.BufferGeometry();
  connectionGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const connections = new THREE.LineSegments(connectionGeometry, cyanLine);
  networkGroup.add(connections);

  const pulseGeometry = new THREE.SphereGeometry(0.032, 8, 8);
  const pulses = Array.from({ length: 18 }, (_, index) => {
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.userData.edge = index % edgePairs.length;
    pulse.userData.offset = index / 18;
    pulse.userData.speed = 0.075 + (index % 4) * 0.013;
    networkGroup.add(pulse);
    return pulse;
  });

  const orbiters = [];
  [1.33, 1.62, 1.94].forEach((radius, index) => {
    const orbiter = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.045 + index * 0.007, 0),
      meshMaterial(index === 1 ? cyan : gold, 0.8)
    );
    orbiter.userData.radius = radius;
    orbiter.userData.speed = (index % 2 ? -1 : 1) * (0.16 + index * 0.045);
    orbiter.userData.phase = index * 2.1;
    networkGroup.add(orbiter);
    orbiters.push(orbiter);
  });

  const dustCount = window.innerWidth < 760 ? 80 : 170;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let index = 0; index < dustCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.3 + Math.random() * 3.3;
    dustPositions[index * 3] = Math.cos(angle) * radius;
    dustPositions[index * 3 + 1] = Math.sin(angle) * radius;
    dustPositions[index * 3 + 2] = (Math.random() - 0.5) * 1.6 - 0.4;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({
    color: cyan,
    size: 0.021,
    transparent: true,
    opacity: 0.25,
    sizeAttenuation: true
  });
  dustMaterial.userData.baseOpacity = 0.25;
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  runePivot.add(dust);

  const modes = {
    "case-intro": [
      [-1.52, 0.82, 0.08], [1.52, 0.82, -0.06], [0, -1.67, 0.08],
      [-2.3, -0.12, -0.1], [2.3, -0.12, 0.1], [0, 2.35, 0]
    ],
    "case-problem": [
      [-2.45, 1.55, 0.38], [2.55, 1.28, -0.42], [-1.05, -2.25, 0.34],
      [-3.15, -0.5, -0.3], [3.15, -0.72, 0.28], [0.55, 2.75, -0.18]
    ],
    "case-delivery": [
      [-2.05, 0, 0], [0, 0, 0.12], [2.05, 0, 0],
      [-2.05, 1.35, -0.12], [0, 1.35, 0.12], [2.05, 1.35, -0.12]
    ],
    "case-workflow": [
      [-2.45, 0.95, 0], [-0.82, -0.95, 0.12], [0.9, 0.95, -0.08],
      [2.48, -0.95, 0.1], [3.05, 0.82, -0.1], [-2.98, -0.72, 0.1]
    ],
    "case-engineering": [
      [-1.5, 0.86, 0.08], [1.5, 0.86, -0.08], [0, -1.62, 0.08],
      [-2.18, -0.22, -0.12], [2.18, -0.22, 0.12], [0, 2.2, 0]
    ],
    "case-result": [
      [-1.4, 0.75, 0.06], [1.4, 0.75, -0.06], [0, -1.5, 0.06],
      [-2.02, -0.16, -0.08], [2.02, -0.16, 0.08], [0, 2.04, 0]
    ]
  };

  const positions = modes["case-intro"].map((value) => new THREE.Vector3(...value));
  const sectionIds = Object.keys(modes);
  let targetSection = "";
  let pointerX = 0;
  let pointerY = 0;
  let lastTime = performance.now();
  let lastRenderedAt = 0;
  let frameId = 0;
  let animationTimer = 0;
  let scrollFrame = 0;
  let resizeFrame = 0;
  let disposed = false;
  let visualsPaused = document.hidden;
  let averageFrameCost = 0;
  let slowFrameStreak = 0;
  let triangleBaseRotation = 0;
  let qualityAssessmentStartedAt = performance.now() + 3000;
  const routeMotion = {
    phase: root.dataset.routeTransitionPhase || "idle",
    direction: root.dataset.routeTransitionDirection || "forward",
    startedAt: Number(root.dataset.routeTransitionStartedAt) || performance.now(),
    energy: 0
  };
  const routeDurations = { leaving: 1550, arriving: 1250, settling: 1180 };

  const sectionPalette = {
    "case-intro": ["238 187 70", "95 143 160", "79 140 121"],
    "case-problem": ["79 140 121", "43 56 63", "238 187 70"],
    "case-delivery": ["95 143 160", "56 74 85", "238 187 70"],
    "case-workflow": ["238 187 70", "95 143 160", "43 56 63"],
    "case-engineering": ["79 140 121", "56 74 85", "238 187 70"],
    "case-result": ["238 187 70", "79 140 121", "95 143 160"]
  };

  function setSection(nextSection) {
    if (!modes[nextSection] || targetSection === nextSection) return;
    targetSection = nextSection;
    root.dataset.section = nextSection;
    document.querySelectorAll("[data-case-nav]").forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.dataset.caseNav === nextSection ||
          (nextSection === "case-workflow" && link.dataset.caseNav === "case-delivery")
      );
    });
    const palette = sectionPalette[nextSection];
    root.style.setProperty("--fx-primary", palette[0]);
    root.style.setProperty("--fx-secondary", palette[1]);
    root.style.setProperty("--fx-tertiary", palette[2]);
    root.style.setProperty("--fx-x", nextSection === "case-workflow" ? "50%" : "70%");
    root.style.setProperty("--fx-y", "48%");
    root.style.setProperty("--fx-spot", root.dataset.theme === "light" ? "0.07" : "0.14");
    root.style.setProperty("--fx-line", "0.035");
    root.style.setProperty("--fx-opacity", "0.72");
    root.style.setProperty("--fx-scale", "1");
    root.style.setProperty("--fx-angle", nextSection === "case-problem" ? "132deg" : "116deg");
    root.style.setProperty("--fx-gap", "112px");
    root.style.setProperty("--fx-gap2", "224px");
  }

  function updateActiveSection() {
    const viewportCenter = window.innerHeight * 0.48;
    let closest = sectionIds[0];
    let closestDistance = Infinity;
    document.querySelectorAll("[data-case-section]").forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 80 || rect.top >= window.innerHeight - 80) return;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const center = rect.top < 0 && rect.bottom > window.innerHeight
        ? viewportCenter
        : (visibleTop + visibleBottom) * 0.5;
      const distance = Math.abs(center - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = section.dataset.caseSection;
      }
    });
    setSection(closest);
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap()));
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }

  function targetPlacement() {
    if (targetSection === "case-intro") {
      if (window.innerWidth < 760) return { x: 0.8, y: 0.85, scale: 0.66 };
      if (window.innerWidth < 1120) return { x: 1.45, y: 0.3, scale: 0.82 };
      return { x: 2.45, y: -0.02, scale: 0.94 };
    }
    if (window.innerWidth < 760) return { x: 0, y: 0.3, scale: 0.54 };
    const x = targetSection === "case-workflow" ? 0 : targetSection === "case-problem" ? 3.15 : 3.35;
    return { x, y: 0.05, scale: targetSection === "case-workflow" ? 0.7 : 0.73 };
  }

  function smootherstep01(value) {
    const t = THREE.MathUtils.clamp(value, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function updateThemeColors(delta) {
    const light = root.dataset.theme === "light";
    const routeActive = routeMotion.phase === "leaving" || routeMotion.phase === "arriving";
    const settling = routeMotion.phase === "settling";
    const settleRaw = settling
      ? THREE.MathUtils.clamp((performance.now() - routeMotion.startedAt) / routeDurations.settling, 0, 1)
      : 1;
    const glowSettle = smootherstep01(settleRaw / 0.72);
    const structureSettle = smootherstep01((settleRaw - 0.08) / 0.92);
    const dustReveal = settling ? smootherstep01((settleRaw - 0.18) / 0.82) : 1;
    const routeEmphasis = 3.25 + routeMotion.energy * 1.35;
    const baseEmphasis = targetSection === "case-intro" ? 0.24 : 0.18;
    const accent = targetSection === "case-problem" || targetSection === "case-engineering"
      ? green
      : targetSection === "case-delivery"
        ? cyan
        : gold;
    colorTarget.copy(accent);
    coreWireMaterial.color.lerp(colorTarget, delta * 2.2);
    coreFillMaterial.color.copy(coreWireMaterial.color);
    pulseMaterial.color.copy(coreWireMaterial.color);
    goldLine.color.lerp(colorTarget, delta * 1.7);
    cyanLine.color.lerp(light ? ink : cyan, delta * 1.5);
    faintLine.color.lerp(light ? ink : white, delta * 1.5);

    materials.forEach((material) => {
      const lightFactor = light ? 0.68 : 1;
      const isGlowLayer = material === coreFillMaterial || material === pulseMaterial;
      const settleMix = isGlowLayer ? glowSettle : structureSettle;
      const emphasisMultiplier = routeActive
        ? routeEmphasis
        : settling
          ? THREE.MathUtils.lerp(3.25, 1, settleMix)
          : 1;
      material.opacity = material.userData.baseOpacity * baseEmphasis * emphasisMultiplier * lightFactor;
    });
    dustMaterial.color.copy(light ? ink : cyan);
    dustMaterial.opacity = routeActive
      ? 0
      : dustMaterial.userData.baseOpacity * baseEmphasis * (light ? 0.45 : 1) * dustReveal;
  }

  function updateRune(time, delta, now) {
    const targetMode = modes[targetSection];
    positions.forEach((position, index) => {
      const target = targetMode[index];
      position.x = THREE.MathUtils.damp(position.x, target[0], 3.1, delta);
      position.y = THREE.MathUtils.damp(position.y, target[1], 3.1, delta);
      position.z = THREE.MathUtils.damp(position.z, target[2], 3.1, delta);
      nodes[index].position.copy(position);
      nodeShells[index].position.copy(position);
      nodes[index].rotation.x += delta * (0.16 + index * 0.03);
      nodes[index].rotation.y += delta * (0.24 + index * 0.02);
      nodeShells[index].rotation.copy(nodes[index].rotation);
    });

    edgePairs.forEach(([from, to], edgeIndex) => {
      const a = from === 0 ? core.position : positions[from - 1];
      const b = to === 0 ? core.position : positions[to - 1];
      const offset = edgeIndex * 6;
      linePositions[offset] = a.x;
      linePositions[offset + 1] = a.y;
      linePositions[offset + 2] = a.z;
      linePositions[offset + 3] = b.x;
      linePositions[offset + 4] = b.y;
      linePositions[offset + 5] = b.z;
    });
    connectionGeometry.attributes.position.needsUpdate = true;

    pulses.forEach((pulse) => {
      const [from, to] = edgePairs[pulse.userData.edge];
      const a = from === 0 ? core.position : positions[from - 1];
      const b = to === 0 ? core.position : positions[to - 1];
      const raw = (time * pulse.userData.speed + pulse.userData.offset) % 1;
      const t = raw * raw * (3 - 2 * raw);
      pulse.position.lerpVectors(a, b, t);
      pulse.scale.setScalar(0.65 + Math.sin(raw * Math.PI) * 0.75);
    });

    orbiters.forEach((orbiter) => {
      const angle = time * orbiter.userData.speed + orbiter.userData.phase;
      orbiter.position.set(
        Math.cos(angle) * orbiter.userData.radius,
        Math.sin(angle) * orbiter.userData.radius,
        Math.sin(angle * 1.7) * 0.16
      );
    });

    const placement = targetPlacement();
    rune.position.x = THREE.MathUtils.damp(rune.position.x, placement.x + pointerX * 0.12, 3, delta);
    rune.position.y = THREE.MathUtils.damp(rune.position.y, placement.y + pointerY * 0.09, 3, delta);
    rune.scale.setScalar(THREE.MathUtils.damp(rune.scale.x, placement.scale, 3, delta));
    rune.rotation.x = THREE.MathUtils.damp(rune.rotation.x, pointerY * 0.07, 2.2, delta);
    rune.rotation.y = THREE.MathUtils.damp(rune.rotation.y, pointerX * 0.1, 2.2, delta);
    rune.rotation.z = THREE.MathUtils.damp(rune.rotation.z, 0, 3.2, delta);

    const fractured = targetSection === "case-problem" ? 0.3 : 0;
    triangleBaseRotation = THREE.MathUtils.damp(triangleBaseRotation, fractured, 2.7, delta);
    triangleGroup.rotation.z = triangleBaseRotation;
    rings.rotation.z += delta * (targetSection === "case-problem" ? -0.075 : 0.035);
    ticks.rotation.z -= delta * 0.025;
    innerRing.rotation.z += delta * 0.08;
    core.rotation.x += delta * 0.18;
    core.rotation.y -= delta * 0.25;
    coreWire.rotation.x -= delta * 0.12;
    coreWire.rotation.y += delta * 0.21;
    dust.rotation.z += delta * 0.006;

    if (
      routeMotion.phase === "settling"
      && now - routeMotion.startedAt >= routeDurations.settling
    ) {
      routeMotion.phase = "idle";
      routeMotion.energy = 0;
      root.classList.remove("is-route-transition-settling");
    }
    const routeActive = routeMotion.phase === "leaving" || routeMotion.phase === "arriving";
    dust.visible = !routeActive;
    if (!routeActive) {
      routeMotion.energy = 0;
      rings.scale.setScalar(1);
      triangleGroup.scale.setScalar(1);
      triangleGroup.children.forEach((triangle) => {
        triangle.rotation.z = 0;
        triangle.position.z = 0;
        triangle.scale.setScalar(1);
      });
      brokenRingA.rotation.z = 0;
      brokenRingB.rotation.z = 0;
      networkGroup.scale.setScalar(1);
      networkGroup.rotation.set(0, 0, 0);
      core.scale.set(1, 1.35, 1);
      coreWire.scale.set(1, 1.35, 1);
      nodes.forEach((node) => node.scale.setScalar(node.userData.baseScale));
      nodeShells.forEach((shell) => shell.scale.setScalar(shell.userData.baseScale));
      orbiters.forEach((orbiter) => orbiter.scale.setScalar(1));
      return;
    }

    const duration = routeDurations[routeMotion.phase];
    const rawProgress = THREE.MathUtils.clamp((now - routeMotion.startedAt) / duration, 0, 1);
    const focus = routeMotion.phase === "leaving"
      ? THREE.MathUtils.smoothstep(rawProgress, 0.14, 0.76)
      : 1 - THREE.MathUtils.smoothstep(rawProgress, 0.18, 0.9);
    const technicalReveal = routeMotion.phase === "leaving"
      ? 1 - THREE.MathUtils.smoothstep(rawProgress, 0.2, 0.84)
      : THREE.MathUtils.smoothstep(rawProgress, 0.1, 0.78);
    const flourishProgress = THREE.MathUtils.smoothstep(rawProgress, 0.08, 0.92);
    const flourish = Math.sin(flourishProgress * Math.PI);
    routeMotion.energy = flourish;

    rune.position.x = THREE.MathUtils.lerp(placement.x, 0, focus);
    rune.position.y = THREE.MathUtils.lerp(placement.y, 0, focus);
    rune.position.z = THREE.MathUtils.lerp(0, 0.95, focus);
    rune.scale.setScalar(THREE.MathUtils.lerp(placement.scale, 1.02, focus));
    rune.rotation.x = THREE.MathUtils.lerp(pointerY * 0.07, 0, focus);
    rune.rotation.y = THREE.MathUtils.lerp(pointerX * 0.1, 0, focus);
    rune.rotation.z = 0;

    rings.scale.setScalar(THREE.MathUtils.lerp(0.34, 1, technicalReveal) + flourish * 0.045);
    brokenRingA.rotation.z = 0;
    brokenRingB.rotation.z = 0;

    triangleGroup.scale.setScalar(1 + focus * 0.08 + flourish * 0.06);
    triangleGroup.rotation.z = triangleBaseRotation;
    const convergenceScales = [0.752, 1, 1.517];
    triangleGroup.children.forEach((triangle, index) => {
      triangle.rotation.z = 0;
      triangle.position.z = flourish * (1 - index) * 0.16;
      const convergedScale = convergenceScales[index] || 1;
      triangle.scale.setScalar(
        THREE.MathUtils.lerp(convergedScale, 1, technicalReveal) * (1 + flourish * 0.045)
      );
    });

    networkGroup.scale.setScalar(THREE.MathUtils.lerp(0.04, 1, technicalReveal));
    networkGroup.rotation.z = 0;
    const corePulse = 1 + flourish * 0.28 + (1 - technicalReveal) * 0.14;
    const wireBoost = 1 + flourish * 0.08 + (1 - technicalReveal) * 0.08;
    core.scale.set(corePulse, corePulse * 1.35, corePulse);
    coreWire.scale.set(
      corePulse * wireBoost,
      corePulse * wireBoost * 1.35,
      corePulse * wireBoost
    );
  }

  function animate(now) {
    if (!canvas.isConnected || disposed) {
      dispose();
      return;
    }
    if (visualsPaused || document.hidden) return;

    const targetFps = 60;
    if (!reducedMotion && now - lastRenderedAt < 1000 / targetFps) {
      frameId = requestAnimationFrame(animate);
      return;
    }

    const frameGap = lastRenderedAt ? now - lastRenderedAt : 1000 / targetFps;
    const frameStartedAt = performance.now();
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    lastRenderedAt = now - (frameGap % (1000 / targetFps));
    const motionDelta = reducedMotion ? Math.min(delta, 0.008) : delta;
    updateThemeColors(delta);
    updateRune(now / 1000, motionDelta, now);
    renderer.render(scene, camera);
    if (visualQuality !== "software" && !reducedMotion && now >= qualityAssessmentStartedAt) {
      const frameCost = performance.now() - frameStartedAt;
      averageFrameCost = averageFrameCost ? THREE.MathUtils.lerp(averageFrameCost, frameCost, 0.08) : frameCost;
      const missedFrame = frameGap > 1000 / targetFps * 1.8;
      slowFrameStreak = averageFrameCost > 15 || missedFrame
        ? slowFrameStreak + 1
        : Math.max(0, slowFrameStreak - 1);
      if (slowFrameStreak >= 8) {
        visualQuality = visualQuality === "full" ? "balanced" : "software";
        root.dataset.visualQuality = visualQuality;
        averageFrameCost = 0;
        slowFrameStreak = 0;
        qualityAssessmentStartedAt = performance.now() + 1500;
        resize();
      }
    }
    if (reducedMotion) {
      animationTimer = window.setTimeout(() => {
        if (!visualsPaused && !document.hidden && !disposed) {
          frameId = requestAnimationFrame(animate);
        }
      }, 250);
    } else {
      frameId = requestAnimationFrame(animate);
    }
  }

  function scheduleActiveSectionUpdate() {
    if (scrollFrame || disposed) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateActiveSection();
    });
  }

  function scheduleResize() {
    if (resizeFrame || disposed) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      resize();
    });
  }

  function handleRouteTransition(event) {
    const detail = event.detail || {};
    root.classList.remove("is-route-transition-settling");
    routeMotion.phase = detail.phase || root.dataset.routeTransitionPhase || "idle";
    routeMotion.direction = detail.direction || root.dataset.routeTransitionDirection || "forward";
    routeMotion.startedAt = Number(detail.startedAt || root.dataset.routeTransitionStartedAt) || performance.now();
    if (visualsPaused && !document.hidden) resumeVisuals();
  }

  function finishRouteTransition() {
    const shouldSettle = routeMotion.phase === "arriving";
    routeMotion.phase = shouldSettle ? "settling" : "idle";
    routeMotion.startedAt = performance.now();
    routeMotion.energy = 0;
    root.classList.toggle("is-route-transition-settling", shouldSettle);
  }

  function pauseVisuals() {
    visualsPaused = true;
    cancelAnimationFrame(frameId);
    window.clearTimeout(animationTimer);
    frameId = 0;
    animationTimer = 0;
  }

  function resumeVisuals() {
    if (disposed || !visualsPaused || document.hidden) return;
    visualsPaused = false;
    lastTime = performance.now();
    lastRenderedAt = 0;
    frameId = requestAnimationFrame(animate);
  }

  function handleVisibilityChange() {
    if (document.hidden) pauseVisuals();
    else resumeVisuals();
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

  const magneticCleanups = [];
  document.querySelectorAll(".magnetic").forEach((element) => {
    const move = (event) => {
      if (window.innerWidth < 760 || reducedMotion) return;
      const rect = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.06}px, ${(event.clientY - rect.top - rect.height / 2) * 0.08}px)`;
    };
    const leave = () => { element.style.transform = ""; };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    magneticCleanups.push(() => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    });
  });

  function onPointerMove(event) {
    pointerX = event.clientX / window.innerWidth * 2 - 1;
    pointerY = -(event.clientY / window.innerHeight * 2 - 1);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    cancelAnimationFrame(scrollFrame);
    cancelAnimationFrame(resizeFrame);
    window.clearTimeout(animationTimer);
    window.removeEventListener("resize", scheduleResize);
    window.removeEventListener("scroll", scheduleActiveSectionUpdate);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("portfolio-visuals-pause", pauseVisuals);
    window.removeEventListener("portfolio-visuals-resume", resumeVisuals);
    window.removeEventListener("portfolio-route-transition", handleRouteTransition);
    window.removeEventListener("portfolio-route-transition-end", finishRouteTransition);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    revealObserver.disconnect();
    magneticCleanups.forEach((cleanup) => cleanup());
    scene.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose?.();
    });
    renderer.dispose();
    root.classList.remove("is-case-runtime-ready");
    root.classList.remove("is-route-transition-settling");
  }

  root.classList.add("is-case-runtime-ready");
  root.dataset.visualQuality = visualQuality;
  resize();
  setSection("case-intro");
  updateActiveSection();
  window.addEventListener("resize", scheduleResize, { passive: true });
  window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("portfolio-visuals-pause", pauseVisuals);
  window.addEventListener("portfolio-visuals-resume", resumeVisuals);
  window.addEventListener("portfolio-route-transition", handleRouteTransition);
  window.addEventListener("portfolio-route-transition-end", finishRouteTransition);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  if (!visualsPaused) frameId = requestAnimationFrame(animate);
}
}

window.addEventListener("silver3-runtime-mount", bootSilver3Runtime);
bootSilver3Runtime();
