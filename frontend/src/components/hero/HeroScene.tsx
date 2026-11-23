"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";

interface SquadMemberConfig {
  id: "squad1" | "squad2" | "squad3" | "squad4";
  name: string;
  shortName: string;
  role: string;
  file: string;
  index: number;
  scaleMultiplier: number;
}

const SQUAD_MEMBERS: SquadMemberConfig[] = [
  {
    id: "squad1",
    name: "Vanguard Operative",
    shortName: "Vanguard",
    role: "Assault Leader",
    file: "squad1-production.glb",
    index: 0,
    scaleMultiplier: 1.06,
  },
  {
    id: "squad2",
    name: "Apex Phantom",
    shortName: "Apex",
    role: "Tactical Flanker",
    file: "squad2-production.glb",
    index: 1,
    scaleMultiplier: 1.0,
  },
  {
    id: "squad3",
    name: "Cyber Sentinel",
    shortName: "Cyber",
    role: "Support Gunner",
    file: "squad3-production.glb",
    index: 2,
    scaleMultiplier: 1.0,
  },
  {
    id: "squad4",
    name: "Shadow Recon",
    shortName: "Shadow",
    role: "Overwatch Sniper",
    file: "squad4-production.glb",
    index: 3,
    scaleMultiplier: 0.96,
  },
];

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (!mat) return;
        Object.values(mat).forEach((val) => {
          if (val instanceof THREE.Texture) val.dispose();
        });
        mat.dispose();
      });
    }
  });
}

interface HeroSceneProps {
  onLoadingProgress?: (progress: number, statusText: string) => void;
  onFirstModelLoaded?: () => void;
  onError?: (errorMsg: string) => void;
  isMobile?: boolean;
}

// Carousel circle constants
const RADIUS_X = 1.35; // Focused horizontal spread keeping all squad members in center stage
const RADIUS_Z = 0.75; // Depth spread of carousel
const CENTER_Z = -0.75; // Midpoint Z of circle (front is at z=0, rear at z=-1.5)
const PEDESTAL_Y = -0.92; // Base floor level (calibrated so whole model fits comfortably)

export default function HeroScene({
  onLoadingProgress,
  onFirstModelLoaded,
  onError,
  isMobile = false,
}: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const squadNodesRef = useRef<Map<string, THREE.Group>>(new Map());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Carousel angles
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const autoRotateRef = useRef(true);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const activeIndexRef = useRef(0);

  // Parallax mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Store callbacks in refs to avoid re-renders resetting Three.js
  const onLoadingProgressRef = useRef(onLoadingProgress);
  onLoadingProgressRef.current = onLoadingProgress;
  const onFirstModelLoadedRef = useRef(onFirstModelLoaded);
  onFirstModelLoadedRef.current = onFirstModelLoaded;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const [activeFrontIndex, setActiveFrontIndex] = useState<number>(0);
  const [squadLoadedCount, setSquadLoadedCount] = useState<number>(0);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(true);

  // Navigate to specific character on the circle
  const goToCharacter = useCallback((targetIndex: number) => {
    const targetForK = -targetIndex * (Math.PI / 2);
    // Find shortest angular path
    const diff = (targetForK - currentAngleRef.current) % (2 * Math.PI);
    let normalizedDiff = diff;
    if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
    if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;
    targetAngleRef.current = currentAngleRef.current + normalizedDiff;
    lastStepTimeRef.current = performance.now();
  }, []);

  const handleNext = useCallback(() => {
    targetAngleRef.current -= Math.PI / 2;
    lastStepTimeRef.current = performance.now();
  }, []);

  const handlePrev = useCallback(() => {
    targetAngleRef.current += Math.PI / 2;
    lastStepTimeRef.current = performance.now();
  }, []);

  const toggleAutoCycle = useCallback(() => {
    setIsAutoCycle((prev) => {
      const next = !prev;
      autoRotateRef.current = next;
      lastStepTimeRef.current = performance.now();
      return next;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect WebGL
    try {
      const testCanvas = document.createElement("canvas");
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
      );
      if (!hasWebGL) {
        onErrorRef.current?.("WebGL is not supported on this browser or device.");
        return;
      }
    } catch {
      onErrorRef.current?.("Failed to initialize WebGL context.");
      return;
    }

    let isDisposed = false;
    let animationFrameId = 0;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080B11");
    scene.fog = new THREE.FogExp2("#080B11", 0.045);

    // Camera setup - framed directly on the center empty stage (whole character visible)
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 44 : 35,
      container.clientWidth / container.clientHeight,
      0.05,
      100
    );
    const initialCamPos = new THREE.Vector3(
      0,
      isMobile ? 0.2 : 0.16,
      isMobile ? 4.6 : 4.15
    );
    camera.position.copy(initialCamPos);
    camera.lookAt(0, 0.05, -0.6);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight("#182132", 1.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight("#e4efff", "#1e162b", 2.4);
    scene.add(hemiLight);

    // Warm Gold Key Light (Front Right) - illuminates front-facing characters
    const keyLight = new THREE.DirectionalLight("#fff4db", 4.5);
    keyLight.position.set(3.5, 5.5, 3.5);
    scene.add(keyLight);

    // Cool Violet Fill Light (Front Left)
    const fillLight = new THREE.DirectionalLight("#a692eb", 2.6);
    fillLight.position.set(-3.5, 3.5, 2.5);
    scene.add(fillLight);

    // Front Center Soft Light (Crisp details on front character)
    const frontFill = new THREE.DirectionalLight("#ffffff", 1.4);
    frontFill.position.set(0, 2.0, 3.5);
    scene.add(frontFill);

    // Overhead Light over carousel center
    const topLight = new THREE.DirectionalLight("#ffffff", 1.8);
    topLight.position.set(0, 7.5, CENTER_Z);
    scene.add(topLight);

    // Gold Rim Light (Back Right)
    const goldRim = new THREE.PointLight("#d6a83f", 60, 25);
    goldRim.position.set(3.2, 2.5, -2.5);
    scene.add(goldRim);

    // Violet Rim Light (Back Left)
    const violetRim = new THREE.PointLight("#9b87d5", 65, 25);
    violetRim.position.set(-3.2, 2.5, -2.5);
    scene.add(violetRim);

    // Center Golden Stage Pedestal under the carousel circle
    const stageGeo = new THREE.CylinderGeometry(2.15, 2.35, 0.14, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: "#0d131f",
      roughness: 0.5,
      metalness: 0.55,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, -1.0, CENTER_Z);
    scene.add(stage);

    // Outer Glowing Golden Energy Ring around carousel track
    const ringGeo = new THREE.RingGeometry(2.1, 2.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#d6a83f",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, -0.925, CENTER_Z);
    scene.add(ring);

    // Front Spotlight Halo Ring (under the active front character at z=0)
    const spotRingGeo = new THREE.RingGeometry(0.56, 0.64, 48);
    const spotRingMat = new THREE.MeshBasicMaterial({
      color: "#f5d47a",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const spotRing = new THREE.Mesh(spotRingGeo, spotRingMat);
    spotRing.rotation.x = -Math.PI / 2;
    spotRing.position.set(0, -0.915, 0);
    scene.add(spotRing);

    // Atmospheric ember particles
    const particleCount = isMobile ? 35 : 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = Math.random() * 4 - 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      particleSpeeds[i] = 0.003 + Math.random() * 0.005;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: "#f5d47a",
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // KTX2 & Meshopt GLTF Loader setup
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("/basis/");
    ktx2Loader.detectSupport(renderer);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setKTX2Loader(ktx2Loader);
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);

    const squadNodes = new Map<string, THREE.Group>();
    squadNodesRef.current = squadNodes;

    let loadedCount = 0;
    const totalToLoad = SQUAD_MEMBERS.length;

    const loadMember = (index: number) => {
      if (isDisposed || index >= totalToLoad) return;
      const config = SQUAD_MEMBERS[index];

      onLoadingProgressRef.current?.(
        Math.round((loadedCount / totalToLoad) * 100),
        `Streaming ${config.name}...`
      );

      gltfLoader.load(
        `/models/characters/${config.file}`,
        (gltf) => {
          if (isDisposed) {
            disposeObject(gltf.scene);
            return;
          }

          const rawModel = gltf.scene;

          // Compute raw dimensions
          rawModel.updateMatrixWorld(true);
          const rawBox = new THREE.Box3().setFromObject(rawModel);
          const rawSize = rawBox.getSize(new THREE.Vector3());

          // Scale uniformly to comfortable viewing height (~1.72 units so whole model fits)
          const targetHeight = 1.72;
          const scale = (targetHeight / Math.max(rawSize.y, 0.01)) * config.scaleMultiplier;
          rawModel.scale.setScalar(scale);

          // Update after scale to find exact feet and horizontal center
          rawModel.updateMatrixWorld(true);
          const scaledBox = new THREE.Box3().setFromObject(rawModel);
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

          // Center raw model inside wrapper group (feet grounded at wrapper y = 0)
          rawModel.position.x = -scaledCenter.x;
          rawModel.position.y = -scaledBox.min.y;
          rawModel.position.z = -scaledCenter.z;

          // Dedicated wrapper group for placement & carousel motion
          const wrapper = new THREE.Group();

          // EVERY CHARACTER FACES FRONT (rotation = 0, 0, 0)
          wrapper.rotation.set(0, 0, 0);
          wrapper.add(rawModel);

          // Initial placement based on index angle
          const initialAngle = index * (Math.PI / 2);
          const x = RADIUS_X * Math.sin(initialAngle);
          const z = CENTER_Z + RADIUS_Z * Math.cos(initialAngle);
          wrapper.position.set(x, PEDESTAL_Y, z);

          wrapper.userData = {
            index,
            config,
            phaseOffset: index * 1.2,
          };

          scene.add(wrapper);
          squadNodes.set(config.id, wrapper);

          loadedCount++;
          setSquadLoadedCount(loadedCount);

          if (loadedCount === 1) {
            onFirstModelLoadedRef.current?.();
          }

          onLoadingProgressRef.current?.(
            Math.round((loadedCount / totalToLoad) * 100),
            loadedCount === totalToLoad ? "Squad Ready" : `Deploying Squad (${loadedCount}/${totalToLoad})`
          );

          // Stream next operative sequentially
          loadMember(index + 1);
        },
        undefined,
        (err) => {
          console.warn(`Could not load ${config.file}:`, err);
          loadedCount++;
          loadMember(index + 1);
        }
      );
    };

    // Begin streaming Vanguard Operative immediately
    loadMember(0);
    lastStepTimeRef.current = performance.now();

    // Mouse parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.2;
      mouseRef.current.targetY = y * 0.12;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || isDisposed) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    });
    resizeObserver.observe(container);

    // Render loop
    const startTime = performance.now();

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      // Auto-step carousel character-by-character every 4.2 seconds
      if (autoRotateRef.current && !isDraggingRef.current) {
        if (now - lastStepTimeRef.current > 4200) {
          targetAngleRef.current -= Math.PI / 2;
          lastStepTimeRef.current = now;
        }
      }

      // Smooth spring lerp for carousel rotation
      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.07;

      // Camera parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      camera.position.x = initialCamPos.x + mouseRef.current.x;
      camera.position.y = initialCamPos.y + mouseRef.current.y;
      camera.lookAt(0, 0.05, -0.6);

      // Revolve characters along the circle, EVERY CHARACTER FACING FRONT
      squadNodes.forEach((wrapper) => {
        const { index, phaseOffset } = wrapper.userData;
        if (index === undefined) return;

        // Angle on the circle for this operative
        const theta = index * (Math.PI / 2) + currentAngleRef.current;

        // Circular coordinates
        const x = RADIUS_X * Math.sin(theta);
        const z = CENTER_Z + RADIUS_Z * Math.cos(theta);

        // Depth factor (0 at back, 1 at front)
        const depthFactor = THREE.MathUtils.clamp((z - (CENTER_Z - RADIUS_Z)) / (2 * RADIUS_Z), 0, 1);

        // Rear operatives slightly elevated so their heads remain visible
        const elevation = (1 - depthFactor) * 0.12;

        // Subtle idle breathing motion
        const breathing = Math.sin(elapsed * 1.6 + phaseOffset) * 0.012;

        wrapper.position.x = x;
        wrapper.position.y = PEDESTAL_Y + elevation + breathing;
        wrapper.position.z = z;

        // Depth scale: prominent when in front (1.05x), slightly smaller in back (0.92x)
        const depthScale = 0.92 + depthFactor * 0.13;
        wrapper.scale.setScalar(depthScale);

        // CRITICAL REQUIREMENT: EVERY CHARACTER ALWAYS FACES FRONT TOWARDS THE VIEWER
        wrapper.rotation.set(0, 0, 0);
      });

      // Compute which character is currently at the front
      const rawIndex = Math.round(-targetAngleRef.current / (Math.PI / 2));
      const frontIdx = ((rawIndex % 4) + 4) % 4;
      if (frontIdx !== activeIndexRef.current) {
        activeIndexRef.current = frontIdx;
        setActiveFrontIndex(frontIdx);
      }

      // Drift ember particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3 + 1] = -1;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Glow pulses
      ringMat.opacity = 0.65 + Math.sin(elapsed * 2.0) * 0.15;
      spotRingMat.opacity = 0.75 + Math.sin(elapsed * 2.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      resizeObserver.disconnect();

      squadNodes.forEach((wrapper) => {
        scene.remove(wrapper);
        disposeObject(wrapper);
      });
      squadNodes.clear();

      scene.remove(stage);
      stageGeo.dispose();
      stageMat.dispose();

      scene.remove(ring);
      ringGeo.dispose();
      ringMat.dispose();

      scene.remove(spotRing);
      spotRingGeo.dispose();
      spotRingMat.dispose();

      scene.remove(particles);
      particleGeo.dispose();
      particleMat.dispose();

      ktx2Loader.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  // Pointer drag to manually spin carousel
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = targetAngleRef.current;
    lastStepTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Drag sensitivity: dragging right advances carousel
    const sensitivity = 0.005;
    targetAngleRef.current = dragStartAngleRef.current - deltaX * sensitivity;
    lastStepTimeRef.current = performance.now();
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    // Snap to nearest 90-degree character position
    const step = Math.PI / 2;
    targetAngleRef.current = Math.round(targetAngleRef.current / step) * step;
    lastStepTimeRef.current = performance.now();
  };

  const currentOperative = SQUAD_MEMBERS[activeFrontIndex];

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[700px] select-none">
      {/* 3D Canvas with drag-to-spin interaction */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Floating Carousel Controller & Active Character Spotlight Badge */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 max-w-xl w-full px-3 sm:px-4 pointer-events-auto">
        {/* Active Character Hero Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D121C]/90 border border-[#D6A83F]/40 backdrop-blur-md shadow-[0_0_20px_rgba(214,168,63,0.2)]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6A83F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6A83F]"></span>
          </span>
          <span className="text-[#F5D47A] font-bold text-xs tracking-wider uppercase">
            {currentOperative.name}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[#929BAA] text-[11px] font-medium">
            {currentOperative.role}
          </span>
        </div>

        {/* Carousel Navigation Toolbar */}
        <div className="flex items-center gap-1.5 bg-[#0D121C]/90 border border-white/10 rounded-full p-1.5 backdrop-blur-md shadow-2xl">
          {/* Previous Character Arrow */}
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#929BAA] hover:text-white hover:bg-white/10 transition"
            title="Previous Operative"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Quick Character Selectors */}
          {SQUAD_MEMBERS.map((member) => (
            <button
              key={member.id}
              onClick={() => goToCharacter(member.index)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeFrontIndex === member.index
                  ? "bg-[#D6A83F] text-black shadow-[0_0_12px_rgba(214,168,63,0.5)]"
                  : "text-[#929BAA] hover:text-white hover:bg-white/5"
              }`}
            >
              {member.shortName}
            </button>
          ))}

          {/* Next Character Arrow */}
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#929BAA] hover:text-white hover:bg-white/10 transition"
            title="Next Operative"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-white/15 mx-0.5" />

          {/* Auto-Cycle Play / Pause Toggle */}
          <button
            onClick={toggleAutoCycle}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              isAutoCycle
                ? "text-[#9B87D5] hover:text-white"
                : "text-amber-400 bg-amber-400/10 border border-amber-400/20"
            }`}
            title="Toggle automatic character revolving"
          >
            {isAutoCycle ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="hidden sm:inline">Auto</span>
              </>
            )}
          </button>

          {/* Reset to Vanguard */}
          <button
            onClick={() => goToCharacter(0)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#929BAA] hover:text-white hover:bg-white/10 transition"
            title="Reset to Vanguard"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
