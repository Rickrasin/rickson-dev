import * as THREE from "./assets/three.module.js";

function bootSilver3Runtime() {
const canvas = document.getElementById("silver3-case-canvas");

if (canvas && canvas.dataset.runtimeActive !== "true") {
  canvas.dataset.runtimeActive = "true";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
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
    shell.scale.setScalar(large ? 1.27 : 1.18);
    nodes.push(fill);
    nodeShells.push(shell);
    runePivot.add(fill, shell);
  }

  const edgePairs = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 6], [1, 2], [2, 3], [3, 1]];
  const linePositions = new Float32Array(edgePairs.length * 6);
  const connectionGeometry = new THREE.BufferGeometry();
  connectionGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const connections = new THREE.LineSegments(connectionGeometry, cyanLine);
  runePivot.add(connections);

  const pulseGeometry = new THREE.SphereGeometry(0.032, 8, 8);
  const pulses = Array.from({ length: 18 }, (_, index) => {
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.userData.edge = index % edgePairs.length;
    pulse.userData.offset = index / 18;
    pulse.userData.speed = 0.075 + (index % 4) * 0.013;
    runePivot.add(pulse);
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
    runePivot.add(orbiter);
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
  let frameId = 0;
  let disposed = false;

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

  function updateThemeColors(delta) {
    const light = root.dataset.theme === "light";
    const emphasis = targetSection === "case-intro" ? 0.24 : 0.18;
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
      material.opacity = material.userData.baseOpacity * emphasis * lightFactor;
    });
    dustMaterial.color.copy(light ? ink : cyan);
    dustMaterial.opacity = dustMaterial.userData.baseOpacity * emphasis * (light ? 0.45 : 1);
  }

  function updateRune(time, delta) {
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

    const fractured = targetSection === "case-problem" ? 0.3 : 0;
    triangleGroup.rotation.z = THREE.MathUtils.damp(triangleGroup.rotation.z, fractured, 2.7, delta);
    rings.rotation.z += delta * (targetSection === "case-problem" ? -0.075 : 0.035);
    ticks.rotation.z -= delta * 0.025;
    innerRing.rotation.z += delta * 0.08;
    core.rotation.x += delta * 0.18;
    core.rotation.y -= delta * 0.25;
    coreWire.rotation.x -= delta * 0.12;
    coreWire.rotation.y += delta * 0.21;
    dust.rotation.z += delta * 0.006;
  }

  function animate(now) {
    if (!canvas.isConnected || disposed) {
      dispose();
      return;
    }
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const motionDelta = reducedMotion ? Math.min(delta, 0.008) : delta;
    updateThemeColors(delta);
    updateRune(now / 1000, motionDelta);
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
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
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", updateActiveSection);
    window.removeEventListener("pointermove", onPointerMove);
    revealObserver.disconnect();
    magneticCleanups.forEach((cleanup) => cleanup());
    scene.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose?.();
    });
    renderer.dispose();
    root.classList.remove("is-case-runtime-ready");
  }

  root.classList.add("is-case-runtime-ready");
  resize();
  setSection("case-intro");
  updateActiveSection();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  frameId = requestAnimationFrame(animate);
}
}

window.addEventListener("silver3-runtime-mount", bootSilver3Runtime);
bootSilver3Runtime();
