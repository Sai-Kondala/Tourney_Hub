
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const CHARACTERS = [
    { id: "squad1", name: "Squad 01", file: "squad1-production.glb", size: "1.30 MB" },
    { id: "squad2", name: "Squad 02", file: "squad2-production.glb", size: "14.48 MB" },
    { id: "squad3", name: "Squad 03", file: "squad3-production.glb", size: "15.04 MB" },
    { id: "squad4", name: "Squad 04", file: "squad4-production.glb", size: "13.64 MB" },
] as const;

type CharacterId = (typeof CHARACTERS)[number]["id"];

function disposeModel(root: THREE.Object3D) {
    root.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;

        mesh.geometry.dispose();

        const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

        materials.forEach((material) => {
            Object.values(material).forEach((value) => {
                if (value instanceof THREE.Texture) value.dispose();
            });
            material.dispose();
        });
    });
}

export default function ModelViewer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const loaderRef = useRef<GLTFLoader | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const fitCameraRef = useRef<(() => void) | null>(null);

    const [selected, setSelected] = useState<CharacterId>("squad1");
    const [wireframe, setWireframe] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [status, setStatus] = useState("Initializing viewer...");
    const [loadTime, setLoadTime] = useState<number | null>(null);
    const [error, setError] = useState("");

    const wireframeRef = useRef(wireframe);
    useEffect(() => {
        wireframeRef.current = wireframe;
    }, [wireframe]);

    // Initialize Three.js once.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#090d14");

        const camera = new THREE.PerspectiveCamera(
            38,
            container.clientWidth / container.clientHeight,
            0.01,
            1000
        );
        camera.position.set(0, 1.2, 4);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        container.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight("#dceaff", "#25202a", 2));

        const keyLight = new THREE.DirectionalLight("#fff0d7", 3.5);
        keyLight.position.set(4, 7, 5);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight("#9cbbff", 1.5);
        fillLight.position.set(-5, 3, -3);
        scene.add(fillLight);

        const rimLight = new THREE.PointLight("#a58cff", 45, 20);
        rimLight.position.set(0, 3, -4);
        scene.add(rimLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.minDistance = 0.5;
        controls.maxDistance = 15;
        controls.target.set(0, 0, 0);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;

        const ktx2Loader = new KTX2Loader();
        ktx2Loader.setTranscoderPath("/basis/");
        ktx2Loader.detectSupport(renderer);

        const loader = new GLTFLoader();
        loader.setKTX2Loader(ktx2Loader);
        loader.setMeshoptDecoder(MeshoptDecoder);

        sceneRef.current = scene;
        cameraRef.current = camera;
        controlsRef.current = controls;
        loaderRef.current = loader;

        const resizeObserver = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        });

        resizeObserver.observe(container);

        let animationFrame = 0;

        const animate = () => {
            animationFrame = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        setStatus("Viewer ready");

        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();

            if (modelRef.current) {
                scene.remove(modelRef.current);
                disposeModel(modelRef.current);
                modelRef.current = null;
            }

            controls.dispose();
            ktx2Loader.dispose();
            renderer.dispose();

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            sceneRef.current = null;
            cameraRef.current = null;
            controlsRef.current = null;
            loaderRef.current = null;
        };
    }, []);

    // Load the selected character.
    useEffect(() => {
        const scene = sceneRef.current;
        const loader = loaderRef.current;
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        if (!scene || !loader || !camera || !controls) return;

        const character = CHARACTERS.find((item) => item.id === selected);
        if (!character) return;

        let active = true;

        if (modelRef.current) {
            scene.remove(modelRef.current);
            disposeModel(modelRef.current);
            modelRef.current = null;
        }

        setTimeout(() => {
            if (!active) return;
            setError("");
            setLoadTime(null);
            setStatus(`Loading ${character.name}...`);
        }, 0);

        const startTime = performance.now();

        loader.load(
            `/models/characters/${character.file}`,
            (gltf) => {
                if (!active) {
                    disposeModel(gltf.scene);
                    return;
                }

                const model = gltf.scene;

                const bounds = new THREE.Box3().setFromObject(model);
                const center = bounds.getCenter(new THREE.Vector3());
                const size = bounds.getSize(new THREE.Vector3());

                model.position.sub(center);
                scene.add(model);
                modelRef.current = model;

                const radius = Math.max(size.length() * 0.5, 0.1);
                const distance =
                    radius / Math.sin(THREE.MathUtils.degToRad(camera.fov * 0.5));

                const fitCamera = () => {
                    camera.position.set(0, size.y * 0.08, distance * 1.2);
                    camera.near = Math.max(distance / 100, 0.01);
                    camera.far = Math.max(distance * 100, 100);
                    camera.updateProjectionMatrix();

                    controls.target.set(0, 0, 0);
                    controls.update();
                };

                fitCameraRef.current = fitCamera;
                fitCamera();

                model.traverse((object) => {
                    const mesh = object as THREE.Mesh;
                    if (!mesh.isMesh) return;

                    const materials = Array.isArray(mesh.material)
                        ? mesh.material
                        : [mesh.material];

                    materials.forEach((material) => {
                        (material as THREE.MeshStandardMaterial).wireframe = wireframeRef.current;
                    });
                });

                setLoadTime(performance.now() - startTime);
                setStatus("Model loaded successfully");
            },
            (event) => {
                if (!active) return;

                if (event.total > 0) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setStatus(`Loading model: ${percent}%`);
                }
            },
            (loadError) => {
                if (!active) return;

                console.error("GLB loading error:", loadError);
                setStatus("Model loading failed");
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Check the browser console for details."
                );
            }
        );

        return () => {
            active = false;
        };
    }, [selected]);

    // Update model wireframe without reloading it.
    useEffect(() => {
        if (!modelRef.current) return;

        modelRef.current.traverse((object) => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;

            const materials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];

            materials.forEach((material) => {
                (material as THREE.MeshStandardMaterial).wireframe = wireframe;
            });
        });
    }, [wireframe]);

    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotate = autoRotate;
        }
    }, [autoRotate]);

    const activeCharacter = CHARACTERS.find(
        (character) => character.id === selected
    )!;

    return (
        <main className="min-h-screen bg-[#080b11] text-white">
            <header className="border-b border-white/10 px-5 py-5 md:px-10">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.3em] text-amber-400">
                            TOURNEY HUB / DEVELOPMENT
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight">
                            Character inspection
                        </h1>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400">
                        3D TEST ENVIRONMENT
                    </span>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-5 p-4 md:grid-cols-[1fr_280px] md:p-8">
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c111b]">
                    <div
                        ref={containerRef}
                        className="h-[520px] w-full touch-none md:h-[680px]"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium">{activeCharacter.name}</p>
                            <p className="text-xs text-gray-500">{activeCharacter.file}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setAutoRotate((value) => !value)}
                                className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10"
                            >
                                {autoRotate ? "Pause rotation" : "Auto rotate"}
                            </button>

                            <button
                                onClick={() => fitCameraRef.current?.()}
                                className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10"
                            >
                                Reset camera
                            </button>
                        </div>
                    </div>
                </section>

                <aside className="space-y-5">
                    <section className="rounded-2xl border border-white/10 bg-[#0c111b] p-4">
                        <h2 className="mb-3 text-sm font-semibold">Select character</h2>

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                            {CHARACTERS.map((character) => (
                                <button
                                    key={character.id}
                                    onClick={() => setSelected(character.id)}
                                    className={`rounded-xl border p-3 text-left transition ${selected === character.id
                                        ? "border-amber-400 bg-amber-400/10"
                                        : "border-white/10 hover:bg-white/5"
                                        }`}
                                >
                                    <span className="block text-sm font-semibold">
                                        {character.name}
                                    </span>
                                    <span className="mt-1 block text-xs text-gray-500">
                                        {character.size}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-[#0c111b] p-4">
                        <h2 className="mb-4 text-sm font-semibold">Inspection settings</h2>

                        <label className="flex cursor-pointer items-center justify-between text-sm">
                            Wireframe mode
                            <input
                                type="checkbox"
                                checked={wireframe}
                                onChange={(event) => setWireframe(event.target.checked)}
                                className="accent-amber-400"
                            />
                        </label>

                        <p className="mt-3 text-xs leading-5 text-gray-500">
                            Drag to rotate. Scroll or pinch to zoom. Right-click and drag
                            to pan.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-[#0c111b] p-4">
                        <h2 className="mb-3 text-sm font-semibold">Loading diagnostics</h2>

                        <p className="text-xs leading-5 text-gray-400">{status}</p>

                        {loadTime !== null && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500">Load duration</p>
                                <p className="text-xl font-semibold text-emerald-400">
                                    {(loadTime / 1000).toFixed(2)}s
                                </p>
                            </div>
                        )}

                        {error && (
                            <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-lg bg-red-950/40 p-3 text-xs text-red-300">
                                {error}
                            </pre>
                        )}
                    </section>
                </aside>
            </div>

            <footer className="px-5 pb-8 text-center text-xs text-gray-600">
                Tourney Hub · Internal 3D asset testing
            </footer>
        </main>
    );
}
