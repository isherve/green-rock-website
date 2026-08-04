"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

const PRIMARY = "#0a5c45";
const SECONDARY = "#c9a227";
const GLASS = "#10b981";

function BuildingTower({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[position[0], position[1] + size[1] / 2 + 0.08, position[2]]}>
        <boxGeometry args={[size[0] * 0.85, 0.12, size[2] * 0.85]} />
        <meshStandardMaterial color={SECONDARY} emissive={SECONDARY} emissiveIntensity={0.25} />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          distort={0.35}
          speed={1.5}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function SceneContent() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.25,
      0.04
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.08,
      0.04
    );
  });

  const towers = useMemo(
    () => [
      { position: [-2.8, 0.6, -1] as [number, number, number], size: [0.9, 1.8, 0.9] as [number, number, number], color: PRIMARY },
      { position: [-1.2, 0.4, 0.5] as [number, number, number], size: [0.7, 1.2, 0.7] as [number, number, number], color: GLASS },
      { position: [0.5, 0.8, -0.5] as [number, number, number], size: [1.1, 2.4, 1.1] as [number, number, number], color: PRIMARY },
      { position: [2.2, 0.5, 0.2] as [number, number, number], size: [0.8, 1.5, 0.8] as [number, number, number], color: "#0d7a5a" },
      { position: [3.5, 0.3, -1.2] as [number, number, number], size: [0.6, 1, 0.6] as [number, number, number], color: GLASS },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 3, 2]} intensity={0.8} color={SECONDARY} />
      <pointLight position={[4, 2, -2]} intensity={0.5} color={GLASS} />

      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.6} />

      <group ref={group}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
          <planeGeometry args={[20, 20, 32, 32]} />
          <meshStandardMaterial color="#061018" wireframe opacity={0.12} transparent />
        </mesh>

        {towers.map((t) => (
          <BuildingTower key={t.position.join("-")} {...t} />
        ))}

        <FloatingSphere position={[-3.5, 2.2, 1]} scale={0.35} color={SECONDARY} />
        <FloatingSphere position={[3.8, 1.8, 0.5]} scale={0.28} color={GLASS} />
        <FloatingSphere position={[0, 2.5, 1.5]} scale={0.22} color={SECONDARY} />
      </group>
    </>
  );
}

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0c1829", 8, 22]} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
