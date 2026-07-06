"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Box3, Vector3 } from "three";
import type { Group } from "three";

/** Offset from scene center for the look-at target, as fractions of the model's max dimension. Default [0, -0.12, -0.12] = slightly down and back. */
export type GlbTargetOffset = [number, number, number];
/** Which side of the model the camera starts on (camera is placed along that axis from center). */
export type GlbCameraSide = "front" | "back" | "left" | "right" | "top" | "bottom";

export type GlbViewerProps = {
  url: string;
  className?: string;
  /** Override where the camera looks (target). Fractions of model max dimension. e.g. [0, 0.1, -0.05] = up a bit, back a bit. */
  targetOffset?: GlbTargetOffset;
  /** Which side of the model the camera starts on. Default "left" (view from -X). */
  cameraSide?: GlbCameraSide;
  /** Multiplier for default camera distance (1 = current, 1.2 = farther, 0.8 = closer). */
  distanceMultiplier?: number;
};

const GlbLoadFallback = ({ className }: { className?: string }) => (
  <div className={className}>
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded border border-amber-200 bg-amber-50/80 p-4 text-center text-sm text-amber-800">
      <p className="font-medium">3D model could not be loaded.</p>
      <p className="text-amber-700">The file may be missing, corrupted, or in an unsupported format. Try re-exporting the .glb from your 3D tool.</p>
    </div>
  </div>
);

const CAMERA_SIDE_DIR: Record<GlbCameraSide, [number, number, number]> = {
  left: [-1, 0, 0],
  right: [1, 0, 0],
  front: [0, 0, -1],
  back: [0, 0, 1],
  top: [0, 1, 0],
  bottom: [0, -1, 0],
};

const DEFAULT_TARGET_OFFSET: GlbTargetOffset = [0, -0.12, -0.12];

type FitCameraProps = {
  scene: Group;
  targetOffset?: GlbTargetOffset;
  cameraSide?: GlbCameraSide;
  distanceMultiplier?: number;
};

// Fit camera to model; re-run when view overrides change. Run after controls exist (makeDefault registers in useEffect).
function FitCamera({ scene, targetOffset = DEFAULT_TARGET_OFFSET, cameraSide = "left", distanceMultiplier = 1 }: FitCameraProps) {
  const { camera } = useThree();
  const getControls = useThree((s) => () => s.controls);
  const lastApplied = useRef<string>("");
  const box = useRef(new Box3());
  const center = useRef(new Vector3());
  const size = useRef(new Vector3());

  useFrame(() => {
    const controls = getControls();
    const key = `${targetOffset[0]},${targetOffset[1]},${targetOffset[2]}-${cameraSide}-${distanceMultiplier}`;
    if (lastApplied.current === key) return;
    // Wait until OrbitControls has registered (makeDefault) so we can set its target
    if (!controls || !("target" in controls)) return;

    lastApplied.current = key;

    scene.updateMatrixWorld(true);
    box.current.setFromObject(scene);
    if (box.current.isEmpty()) return;
    box.current.getCenter(center.current);
    box.current.getSize(size.current);
    const maxDim = Math.max(size.current.x, size.current.y, size.current.z);
    let distance = Math.max(maxDim * 1.5, 10) * distanceMultiplier;
    const [dx, dy, dz] = CAMERA_SIDE_DIR[cameraSide];
    camera.position.set(
      center.current.x + dx * distance,
      center.current.y + dy * distance,
      center.current.z + dz * distance
    );
    const target = center.current.clone().add(
      new Vector3(
        targetOffset[0] * maxDim,
        targetOffset[1] * maxDim,
        targetOffset[2] * maxDim
      )
    );
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    (controls as { target: Vector3 }).target.copy(target);
    (controls as { update?: () => void }).update?.();
  });

  return null;
}

type RenderedSceneProps = {
  scene: Group;
  targetOffset?: GlbTargetOffset;
  cameraSide?: GlbCameraSide;
  distanceMultiplier?: number;
};

function RenderedScene({ scene, targetOffset, cameraSide, distanceMultiplier }: RenderedSceneProps) {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <primitive object={scene} />
      <FitCamera
        scene={scene}
        targetOffset={targetOffset}
        cameraSide={cameraSide}
        distanceMultiplier={distanceMultiplier}
      />
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minDistance={1}
        maxDistance={900}
      />
    </>
  );
}

function GlbViewerInner({ url, className, targetOffset, cameraSide, distanceMultiplier }: GlbViewerProps) {
  const [scene, setScene] = useState<Group | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setLoadError(false);
    setLoading(true);
    setScene(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((data) => {
        if (cancelledRef.current) return;
        return new Promise<Group>((resolve, reject) => {
          const loader = new GLTFLoader();
          loader.parse(
            data,
            url,
            (gltf) => resolve(gltf.scene),
            (err) => reject(err)
          );
        });
      })
      .then((parsedScene) => {
        if (!cancelledRef.current) {
          // Rotate 270° around Y (90° + 180°) so the profile faces the camera the right way
          parsedScene.rotation.y = (Math.PI / 2) + Math.PI;
          setScene(parsedScene);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelledRef.current) {
          setLoadError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelledRef.current = true;
    };
  }, [url]);

  if (loadError) {
    return <GlbLoadFallback className={className} />;
  }

  if (loading || !scene) {
    return (
      <div className={className}>
        <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-neutral-500">
          Loading 3D…
        </div>
      </div>
    );
  }

  const viewKey =
    targetOffset != null
      ? `${url}-${targetOffset.join(",")}-${cameraSide ?? "left"}-${distanceMultiplier ?? 1}`
      : url;

  return (
    <div className={className} style={{ minHeight: 0 }}>
      <Canvas
        key={viewKey}
        camera={{ position: [2, 2, 2], fov: 45, near: 0.01, far: 10000 }}
        gl={{ antialias: true }}
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <RenderedScene
          scene={scene}
          targetOffset={targetOffset}
          cameraSide={cameraSide}
          distanceMultiplier={distanceMultiplier}
        />
      </Canvas>
    </div>
  );
}

export const GlbViewer = dynamic(() => Promise.resolve(GlbViewerInner), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-neutral-500">
      Loading 3D…
    </div>
  ),
});
