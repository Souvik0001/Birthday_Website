import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Vector3, MathUtils } from 'three';
import { Sparkles, Cylinder, Sphere, Box, SpotLight, Outlines, Cone, Circle, Float, Text, Torus, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ROMANTIC_LYRICS } from '../constants';

// --- MATERIALS ---
// Simple Toon/Standard materials for the cute look
const ToonMaterial = ({ color, emissive = false, transparent = false, opacity = 1 }: { color: string, emissive?: boolean, transparent?: boolean, opacity?: number }) => (
    <meshStandardMaterial 
        color={color} 
        roughness={0.4} 
        metalness={0.1} 
        emissive={emissive ? color : undefined}
        emissiveIntensity={emissive ? 0.2 : 0}
        transparent={transparent}
        opacity={opacity}
    />
);

const GlassMaterial = ({ color = "#88ccff", opacity = 0.3 }) => (
    <meshPhysicalMaterial 
        color={color} 
        transmission={0.6} 
        roughness={0.1} 
        metalness={0.1} 
        thickness={0.5} 
        transparent 
        opacity={opacity} 
    />
);

const GoldMaterial = () => (
    <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={1.0} />
);

// --- ENVIRONMENTS ---

export const IndoorRoom = ({ color }: { color: string }) => (
    <group position={[0, 0, 0]}>
        {/* Floor - Wood texture feel - INCREASED SIZE */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} /> 
            <meshStandardMaterial color="#3d2b1f" roughness={0.5} />
        </mesh>
        {/* Walls - INCREASED WIDTH FOR LANDSCAPE SAFETY */}
        <mesh position={[0, 5, -10]} receiveShadow>
            <planeGeometry args={[50, 20]} />
            <meshStandardMaterial color={color} roughness={0.2} />
        </mesh>
        <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[50, 20]} />
            <meshStandardMaterial color={color} roughness={0.2} />
        </mesh>
         <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[50, 20]} />
            <meshStandardMaterial color={color} roughness={0.2} />
        </mesh>
    </group>
);

export const SakuraTree = ({ position, scale = 1 }: any) => (
    <group position={position} scale={scale}>
        {/* Trunk */}
        <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.35, 2.5, 8]} />
            <meshStandardMaterial color="#4a3b32" roughness={1} />
        </mesh>
        {/* Pink Foliage - Cloud like shapes */}
        <group position={[0, 2.5, 0]}>
             <mesh position={[0, 0.2, 0]}>
                 <dodecahedronGeometry args={[1.3, 0]} />
                 <meshStandardMaterial color="#ffc8dd" roughness={0.8} />
             </mesh>
             <mesh position={[0.8, 0.5, 0.4]}>
                 <dodecahedronGeometry args={[1.0, 0]} />
                 <meshStandardMaterial color="#ffb7b2" roughness={0.8} />
             </mesh>
             <mesh position={[-0.8, 0.4, -0.4]}>
                 <dodecahedronGeometry args={[1.1, 0]} />
                 <meshStandardMaterial color="#ffafcc" roughness={0.8} />
             </mesh>
             <mesh position={[0, 1.3, 0]}>
                 <dodecahedronGeometry args={[0.9, 0]} />
                 <meshStandardMaterial color="#ff9ebb" roughness={0.8} />
             </mesh>
        </group>
    </group>
);

export const OutdoorPark = ({ color }: { color: string }) => (
    <group position={[0, -0.1, 0]}>
        {/* Smooth Grass Floor - Immediate surroundings - INCREASED SIZE */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <circleGeometry args={[50, 64]} />
            <meshStandardMaterial color="#143621" roughness={1} />
        </mesh>

        {/* Anime Style Background - Pushed far back to avoid clipping */}
        <group position={[0, 0, 0]}>
             {/* Giant Moon - High and far back */}
             <mesh position={[6, 12, -35]}>
                 <circleGeometry args={[7, 64]} />
                 <meshBasicMaterial color="#fffbe6" toneMapped={false} /> 
                 <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
                    <Sparkles count={15} scale={12} size={8} color="#fff" speed={0.2} opacity={0.5} />
                 </Float>
             </mesh>
             {/* Moon Glow Halo */}
             <mesh position={[6, 12, -36]}>
                 <circleGeometry args={[10, 64]} />
                 <meshBasicMaterial color="#fffbe6" transparent opacity={0.15} toneMapped={false} />
             </mesh>
             
             {/* Rolling Hills (Spheres) - Horizon Line */}
             {/* Left Hill - Far back */}
             <mesh position={[-25, -15, -40]}>
                 <sphereGeometry args={[35, 64, 32]} />
                 <meshStandardMaterial color="#051f12" roughness={1} />
             </mesh>
             {/* Right Hill - Far back */}
             <mesh position={[25, -18, -45]}>
                 <sphereGeometry args={[40, 64, 32]} />
                 <meshStandardMaterial color="#02140b" roughness={1} />
             </mesh>
             {/* Center Distant Hill - The gap filler */}
             <mesh position={[0, -22, -50]}>
                 <sphereGeometry args={[45, 64, 32]} />
                 <meshStandardMaterial color="#010f08" roughness={1} />
             </mesh>

             {/* Sakura Trees - Framing the scene in the distance */}
             <group position={[0, 0, -8]}>
                 <SakuraTree position={[-5, 0, 0]} scale={1.5} />
                 <SakuraTree position={[6, 0, -1]} scale={1.8} />
                 <SakuraTree position={[-8, 0, -4]} scale={2.5} />
                 <SakuraTree position={[9, 0, -5]} scale={2.2} />
             </group>
             
             {/* Fireflies / Magic Particles */}
             <Sparkles 
                count={150} 
                scale={[30, 15, 20]} 
                position={[0, 5, -5]} 
                color="#ffffba" // Light yellow firefly color
                size={3} 
                speed={0.4} 
                opacity={0.6} 
             />
        </group>
    </group>
);

// Improved Tree Component
export const Tree = ({ position, scale = 1 }: any) => {
    return (
    <group position={position} scale={scale}>
        {/* Trunk */}
        <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#5c4033" roughness={1} />
        </mesh>
        {/* Foliage Clumps - Softer and Rounder */}
        <group position={[0, 2.5, 0]}>
             <mesh position={[0, 0, 0]}>
                 <dodecahedronGeometry args={[1.2, 0]} />
                 <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
             </mesh>
             <mesh position={[0.6, 0.6, 0.3]}>
                 <dodecahedronGeometry args={[0.9, 0]} />
                 <meshStandardMaterial color="#40916c" roughness={0.8} />
             </mesh>
             <mesh position={[-0.6, 0.5, -0.3]}>
                 <dodecahedronGeometry args={[1.0, 0]} />
                 <meshStandardMaterial color="#1b4332" roughness={0.8} />
             </mesh>
             <mesh position={[0, 1.2, 0]}>
                 <dodecahedronGeometry args={[0.8, 0]} />
                 <meshStandardMaterial color="#52b788" roughness={0.8} />
             </mesh>
        </group>
    </group>
)};

export const CampusEnvironment = () => (
    <group position={[0, -0.1, 0]}>
        {/* INCREASED FLOOR SIZE */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color="#2d4a3e" roughness={1} />
        </mesh>
        
        <group position={[0, 0.02, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[6, 80]} />
                <meshStandardMaterial color="#8a3324" roughness={0.9} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.1, 0.01, 0]}>
                <planeGeometry args={[0.2, 80]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.1, 0.01, 0]}>
                <planeGeometry args={[0.2, 80]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
        </group>

        {[...Array(5)].map((_, i) => (
             <group key={i}>
                <Tree position={[-5, 0, -12 + i * 8]} scale={1.5 + Math.random() * 0.5} />
                <Tree position={[5, 0, -12 + i * 8]} scale={1.5 + Math.random() * 0.5} />
                <LampPost position={[-3.5, 0, -8 + i * 8]} />
                <LampPost position={[3.5, 0, -8 + i * 8]} />
             </group>
        ))}

        {[...Array(8)].map((_, i) => (
            <mesh key={`bush-${i}`} position={[i % 2 === 0 ? -10 : 10, 0.5, -10 + i * 5]}>
                <dodecahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial color="#1a4d2e" />
            </mesh>
        ))}
    </group>
);


// --- CHARACTER COMPONENT ---
export const Character = ({ 
  position, 
  color, 
  pose, 
  isHer = false, 
  isFemale = false,
  isElder = false
}: { 
  position: [number, number, number], 
  color: string, 
  pose: string, 
  isHer?: boolean,
  isFemale?: boolean,
  isElder?: boolean
}) => {
  const group = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const leftArm = useRef<Mesh>(null);
  const rightArm = useRef<Mesh>(null);
  const leftLeg = useRef<Mesh>(null);
  const rightLeg = useRef<Mesh>(null);

  const isGirl = isHer || isFemale;
  const hairColor = isElder ? "#999999" : (isGirl ? (isHer ? "#5e4228" : "#d88c9a") : "#222");

  useFrame((state) => {
    if (!group.current || !bodyRef.current || !headRef.current) return;
    const t = state.clock.getElapsedTime();
    
    const lerpRot = (obj: THREE.Object3D, x: number, y: number, z: number, speed = 0.1) => {
        obj.rotation.x = MathUtils.lerp(obj.rotation.x, x, speed);
        obj.rotation.y = MathUtils.lerp(obj.rotation.y, y, speed);
        obj.rotation.z = MathUtils.lerp(obj.rotation.z, z, speed);
    };

    const lerpPos = (obj: THREE.Object3D, x: number, y: number, z: number, speed = 0.1) => {
        obj.position.x = MathUtils.lerp(obj.position.x, x, speed);
        obj.position.y = MathUtils.lerp(obj.position.y, y, speed);
        obj.position.z = MathUtils.lerp(obj.position.z, z, speed);
    };

    if (pose === 'dance') {
        const beat = 8;
        const stepX = Math.sin(t * beat / 2) * 0.25;
        const bounce = Math.abs(Math.sin(t * beat)) * 0.08;
        lerpPos(group.current, position[0] + stepX, position[1] + bounce, position[2]);
        lerpRot(bodyRef.current, 0, stepX * 0.5, -stepX * 0.3);

        const armL = Math.sin(t * beat);
        const armR = Math.cos(t * beat);
        
        if(leftArm.current) lerpRot(leftArm.current, 0, 0, 2.5 + armL * 0.6); 
        if(rightArm.current) lerpRot(rightArm.current, 0, 0, -2.5 + armR * 0.6); 
        lerpRot(headRef.current, Math.abs(Math.sin(t * beat)) * 0.15, 0, 0);
        
        const legWalk = Math.sin(t * beat);
        if(leftLeg.current) lerpRot(leftLeg.current, legWalk * 0.4, 0, 0);
        if(rightLeg.current) lerpRot(rightLeg.current, -legWalk * 0.4, 0, 0);

    } else if (pose === 'walk') {
        const beat = 8; 
        const tVal = t * beat;
        const bounce = Math.abs(Math.sin(tVal)) * 0.03;
        lerpPos(group.current, position[0], position[1] + bounce, position[2]);
        const sway = Math.sin(tVal * 0.5) * 0.03;
        lerpRot(bodyRef.current, 0, 0, sway);

        if(leftLeg.current) lerpRot(leftLeg.current, Math.sin(tVal) * 0.5, 0, 0);
        if(rightLeg.current) lerpRot(rightLeg.current, Math.sin(tVal + Math.PI) * 0.5, 0, 0);
        
        const tilt = isHer ? 0.35 : -0.35;
        lerpRot(headRef.current, 0.1, 0, tilt);

        if (isHer) {
             if (leftArm.current) {
                 leftArm.current.rotation.z = MathUtils.lerp(leftArm.current.rotation.z, 0.6, 0.1); 
                 leftArm.current.rotation.x = MathUtils.lerp(leftArm.current.rotation.x, -0.3, 0.1); 
             }
             if (rightArm.current) lerpRot(rightArm.current, Math.sin(tVal + Math.PI) * 0.3, 0, -0.2);
        } else {
             if (rightArm.current) {
                  rightArm.current.rotation.z = MathUtils.lerp(rightArm.current.rotation.z, -0.6, 0.1); 
                  rightArm.current.rotation.x = MathUtils.lerp(rightArm.current.rotation.x, -0.3, 0.1);
             }
             if (leftArm.current) lerpRot(leftArm.current, Math.sin(tVal + Math.PI) * 0.3, 0, 0.2);
        }

    } else if (pose === 'meet') {
        lerpPos(group.current, position[0], position[1], position[2]);
        const lookDir = isHer ? -0.5 : 0.5;
        lerpRot(headRef.current, 0, lookDir, 0);
        lerpRot(bodyRef.current, 0, lookDir * 0.5, 0);
        if(leftArm.current) lerpRot(leftArm.current, 0, 0, 0.3);
        if(rightArm.current) lerpRot(rightArm.current, 0, 0, -0.3);

    } else if (pose === 'scare' || pose === 'sick') {
         if (isHer && pose === 'sick') {
            lerpRot(group.current, -1.6, 0, 0);
            lerpPos(group.current, position[0], position[1] + 0.3, position[2]);
         } else {
             lerpPos(group.current, position[0], position[1], position[2]);
             lerpRot(headRef.current, 0.5, 0, 0); 
             lerpRot(bodyRef.current, 0.2, 0, 0);
             if(leftArm.current) lerpRot(leftArm.current, -0.5, 0.5, 0.2); 
             if(rightArm.current) lerpRot(rightArm.current, -0.5, -0.5, -0.2);
         }

    } else if (pose === 'love') {
        lerpPos(group.current, position[0], position[1], position[2]);
        const sway = Math.sin(t * 1.5) * 0.1;
        lerpRot(bodyRef.current, 0, 0, sway);
        lerpRot(headRef.current, -0.1, isHer ? -0.2 : 0.2, sway * 0.5);
        if (isHer) {
            if(leftArm.current) lerpRot(leftArm.current, 0, 0, 0.8);
            if(rightArm.current) lerpRot(rightArm.current, 0, 0, -0.2);
        } else {
            if(rightArm.current) lerpRot(rightArm.current, 0, 0, -0.8);
            if(leftArm.current) lerpRot(leftArm.current, 0, 0, 0.2);
        }
    } else if (pose === 'party') {
         lerpPos(group.current, position[0], position[1], position[2]);
         
         // NO ARM ANIMATION. Just simple presence.
         // EVERYONE LOOKS AT HER (The birthday girl).
         // Her position is [0.6, 0, 0] in the birthday scene.
         
         if (isHer) {
             // Birthday girl just looks happy, maybe slightly forward/left
             lerpRot(group.current, 0, -0.3, 0);
             lerpRot(headRef.current, 0.1, 0, 0); // Chin up
         } else {
             // Everyone else looks at HER at [0.6, 0, 0]
             const targetX = 0.6;
             const targetZ = 0.0;
             const dx = targetX - position[0];
             const dz = targetZ - position[2];
             
             const angle = Math.atan2(dx, dz);
             lerpRot(group.current, 0, angle, 0);
             lerpRot(headRef.current, 0.1, 0, 0); // Look slightly up/alert
             lerpRot(bodyRef.current, 0, 0, 0); // No body sway
         }
         
         // Static Arms (Relaxed)
         if(leftArm.current) lerpRot(leftArm.current, 0, 0, 0.2);
         if(rightArm.current) lerpRot(rightArm.current, 0, 0, -0.2);

    } else if (pose === 'kneel') {
        if (!isHer) {
            lerpPos(group.current, position[0], position[1] - 0.15, position[2]);
            // Make him turn to face her (Right)
            lerpRot(group.current, 0, 1.2, 0);

            if(leftLeg.current) lerpRot(leftLeg.current, 1.5, 0, 0); 
            if(rightLeg.current) lerpRot(rightLeg.current, 1.5, 0, 0); 
            lerpRot(bodyRef.current, 0.2, 0, 0);
            if(rightArm.current) lerpRot(rightArm.current, -1.2, 0, 0); 
        } else {
             lerpPos(group.current, position[0], position[1], position[2]);
             // Make her turn to face him (Left)
             lerpRot(group.current, 0, -1.2, 0);

             lerpRot(headRef.current, -0.2, -0.3, 0);
             if(leftArm.current) lerpRot(leftArm.current, -1.5, 0.2, 0); 
             if(rightArm.current) lerpRot(rightArm.current, -1.5, -0.2, 0);
        }
    } else if (pose === 'sit') {
        lerpPos(group.current, position[0], position[1] - 0.2, position[2]);
        if(leftLeg.current) lerpRot(leftLeg.current, -1.5, 0.2, 0); 
        if(rightLeg.current) lerpRot(rightLeg.current, -1.5, -0.2, 0);
        lerpRot(bodyRef.current, 0, -0.2, 0); 
        if(leftArm.current) lerpRot(leftArm.current, -1.2, 0, 0); 
        if(rightArm.current) lerpRot(rightArm.current, -1.2, 0, 0);
        lerpRot(headRef.current, -0.2, 0, 0); 
    }
  });

  return (
    <group ref={group} position={position}>
      <group position={[0, 0.55, 0]}>
          <group ref={bodyRef}>
               {isGirl ? (
                   <mesh position={[0, 0.1, 0]}>
                       <coneGeometry args={[0.25, 0.5, 32]} />
                       <ToonMaterial color={color} />
                   </mesh>
               ) : (
                   <mesh position={[0, 0.15, 0]}>
                       <cylinderGeometry args={[0.2, 0.18, 0.45, 32]} />
                       <ToonMaterial color={color} />
                   </mesh>
               )}
               <group position={[-0.1, -0.1, 0]}>
                   <mesh ref={leftLeg} position={[0, -0.15, 0]}>
                       <capsuleGeometry args={[0.06, 0.3]} />
                       <ToonMaterial color="#222" />
                   </mesh>
               </group>
               <group position={[0.1, -0.1, 0]}>
                   <mesh ref={rightLeg} position={[0, -0.15, 0]}>
                       <capsuleGeometry args={[0.06, 0.3]} />
                       <ToonMaterial color="#222" />
                   </mesh>
               </group>
          </group>
          <group position={[0, 0.4, 0]}>
              <group ref={headRef} position={[0, 0.15, 0]}>
                  <mesh>
                      <sphereGeometry args={[0.28, 32, 32]} />
                      <ToonMaterial color="#ffe8d6" />
                  </mesh>
                  {isGirl ? (
                      <group>
                          <mesh position={[0, 0.05, -0.05]}>
                              <sphereGeometry args={[0.3, 32, 32]} />
                              <ToonMaterial color={hairColor} />
                          </mesh>
                          <mesh position={[0, -0.2, -0.2]}>
                               <boxGeometry args={[0.5, 0.6, 0.2]} />
                               <ToonMaterial color={hairColor} />
                          </mesh>
                          
                          {/* --- PRINCESS CROWN - ONLY IF isHer --- */}
                          {isHer && (
                            <group position={[0, 0.35, 0]} rotation={[-0.1, 0, 0]} scale={0.9}>
                                    <mesh>
                                        <torusGeometry args={[0.12, 0.015, 16, 32]} />
                                        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
                                    </mesh>
                                    <group position={[0, 0.12, 0.1]}>
                                        <mesh scale={[1, 1, 0.5]}>
                                            <sphereGeometry args={[0.04]} />
                                            <meshStandardMaterial color="#ff0066" emissive="#ff0066" emissiveIntensity={0.6} />
                                        </mesh>
                                    </group>
                                    <mesh position={[0, 0.06, 0.11]} rotation={[-0.2, 0, 0]}>
                                        <coneGeometry args={[0.03, 0.12, 4]} />
                                        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
                                    </mesh>
                                    <mesh position={[-0.1, 0.04, 0.09]} rotation={[-0.2, 0, 0.3]}>
                                        <coneGeometry args={[0.025, 0.09, 4]} />
                                        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
                                    </mesh>
                                    <mesh position={[0.1, 0.04, 0.09]} rotation={[-0.2, 0, -0.3]}>
                                        <coneGeometry args={[0.025, 0.09, 4]} />
                                        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
                                    </mesh>
                            </group>
                          )}
                      </group>
                  ) : (
                       <group>
                          <mesh position={[0, 0.1, -0.02]}>
                              <sphereGeometry args={[0.3, 32, 32]} />
                              <ToonMaterial color={hairColor} />
                          </mesh>
                          <mesh position={[0, 0.3, 0]} rotation={[0.2,0,0]}>
                               <coneGeometry args={[0.15, 0.2, 5]} />
                               <ToonMaterial color={hairColor} />
                          </mesh>
                       </group>
                  )}
                  <group position={[0, 0, 0.24]}>
                      {/* EYES */}
                      <mesh position={[-0.08, 0.02, 0]}>
                           <capsuleGeometry args={[0.03, 0.06, 4, 8]} />
                           <meshBasicMaterial color="#222" />
                      </mesh>
                      <mesh position={[0.08, 0.02, 0]}>
                           <capsuleGeometry args={[0.03, 0.06, 4, 8]} />
                           <meshBasicMaterial color="#222" />
                      </mesh>
                      {/* BLUSH */}
                      <mesh position={[-0.12, -0.05, -0.01]}>
                           <circleGeometry args={[0.04]} />
                           <meshBasicMaterial color="#ffaaaa" transparent opacity={0.5} />
                      </mesh>
                      <mesh position={[0.12, -0.05, -0.01]}>
                           <circleGeometry args={[0.04]} />
                           <meshBasicMaterial color="#ffaaaa" transparent opacity={0.5} />
                      </mesh>
                      {/* ELDER GLASSES - FIXED COLOR WARNING */}
                      {isElder && (
                        <group position={[0, 0.02, 0.05]}>
                             <mesh position={[-0.08, 0, 0]}>
                                 <torusGeometry args={[0.05, 0.005, 8, 16]} />
                                 <meshStandardMaterial color="gold" metalness={1} />
                             </mesh>
                             <mesh position={[0.08, 0, 0]}>
                                 <torusGeometry args={[0.05, 0.005, 8, 16]} />
                                 <meshStandardMaterial color="gold" metalness={1} />
                             </mesh>
                             <mesh position={[0, 0, 0]}>
                                 <boxGeometry args={[0.06, 0.005, 0.005]} />
                                 <meshStandardMaterial color="gold" metalness={1} />
                             </mesh>
                        </group>
                      )}
                  </group>
              </group>
          </group>
          <group position={[0, 0.3, 0]}>
              <group position={[-0.22, 0, 0]}>
                  <mesh ref={leftArm} position={[0, -0.15, 0]}>
                      <capsuleGeometry args={[0.06, 0.35]} />
                      <ToonMaterial color={color} />
                  </mesh>
              </group>
              <group position={[0.22, 0, 0]}>
                   <mesh ref={rightArm} position={[0, -0.15, 0]}>
                      <capsuleGeometry args={[0.06, 0.35]} />
                      <ToonMaterial color={color} />
                  </mesh>
              </group>
          </group>
      </group>
    </group>
  );
};


// --- SCENE PROPS (IMPROVED) ---

export const FloatingLyrics = () => {
    const [index, setIndex] = useState(0);
    useFrame((state) => {
        const i = Math.floor(state.clock.elapsedTime / 4) % ROMANTIC_LYRICS.length;
        if (i !== index) setIndex(i);
    });
    return (
        <group>
             <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                 <Text
                    position={[0, 3, -2]}
                    fontSize={0.3}
                    color="#ffccff" 
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={4}
                    textAlign="center"
                 >
                    {ROMANTIC_LYRICS[index]}
                 </Text>
             </Float>
        </group>
    )
}

export const FloatingHeart = ({ position, scale = 1, delay = 0 }: any) => {
    const ref = useRef<Group>(null);
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.elapsedTime + delay;
            ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.2;
            ref.current.rotation.y = t * 0.5;
            ref.current.scale.setScalar(scale + Math.sin(t * 3) * 0.1);
        }
    });
    return (
        <group ref={ref} position={position}>
             <mesh rotation={[Math.PI, 0, 0]}>
                 <torusKnotGeometry args={[0.4, 0.15, 100, 16, 2, 3]} />
                 <meshPhysicalMaterial 
                    color="#ff0044" 
                    emissive="#ff0044" 
                    emissiveIntensity={0.5} 
                    clearcoat={1} 
                    clearcoatRoughness={0.1} 
                 />
             </mesh>
             <Sparkles count={15} color="#ffaaaa" scale={1.5} />
        </group>
    );
};

export const Speaker = ({ position, rotation }: any) => (
    <group position={position} rotation={rotation}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 1.4, 0.6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
            <Outlines color="gray" thickness={0.01} />
        </mesh>
        {/* Cones */}
        <mesh position={[0, 0.3, 0.31]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial color="#050505" />
        </mesh>
        <mesh position={[0, -0.3, 0.31]}>
            <circleGeometry args={[0.35, 32]} />
            <meshStandardMaterial color="#050505" />
        </mesh>
        {/* Animated cone */}
        <Float speed={15} rotationIntensity={0} floatIntensity={0.05}>
            <mesh position={[0, -0.3, 0.32]}>
                <circleGeometry args={[0.15, 32]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
            </mesh>
        </Float>
    </group>
)

export const LampPost = ({ position }: any) => (
    <group position={position}>
        <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 5]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.6} />
        </mesh>
        <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.35]} />
            <meshBasicMaterial color="#ffbd59" />
        </mesh>
        <pointLight position={[0, 4.8, 0]} color="#ffbd59" distance={8} intensity={2} decay={2} />
        <Cone args={[1.5, 5, 32]} position={[0, 2.5, 0]}>
            <meshBasicMaterial color="#ffbd59" transparent opacity={0.05} depthWrite={false} />
        </Cone>
    </group>
);

export const Bed = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[1.6, 0.5, 2.4]} />
            <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        <mesh position={[0, 0.6, -0.9]} rotation={[0.1, 0, 0]} castShadow>
             <boxGeometry args={[1.0, 0.2, 0.5]} />
             <meshStandardMaterial color="#e0fbfc" />
        </mesh>
        <mesh position={[0, 0.6, 0.3]} castShadow>
            <boxGeometry args={[1.65, 0.1, 1.8]} />
            <meshStandardMaterial color="#90e0ef" roughness={0.9} />
        </mesh>
        <mesh position={[-0.7, 0.15, -1.1]}>
             <cylinderGeometry args={[0.04, 0.04, 0.3]} />
             <meshStandardMaterial color="#888" metalness={0.8} />
        </mesh>
         <mesh position={[0.7, 0.15, -1.1]}>
             <cylinderGeometry args={[0.04, 0.04, 0.3]} />
             <meshStandardMaterial color="#888" metalness={0.8} />
        </mesh>
         <mesh position={[-0.7, 0.15, 1.1]}>
             <cylinderGeometry args={[0.04, 0.04, 0.3]} />
             <meshStandardMaterial color="#888" metalness={0.8} />
        </mesh>
         <mesh position={[0.7, 0.15, 1.1]}>
             <cylinderGeometry args={[0.04, 0.04, 0.3]} />
             <meshStandardMaterial color="#888" metalness={0.8} />
        </mesh>
    </group>
);

export const Ring = ({ position }: { position: [number, number, number] }) => (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={position} rotation={[0, Math.PI / 6, 0]}>
            {/* Ring Band - Vertical */}
            <mesh>
                <torusGeometry args={[0.22, 0.03, 16, 64]} /> 
                <meshStandardMaterial 
                    color="#FFD700" 
                    metalness={1.0} 
                    roughness={0.15} 
                    envMapIntensity={1}
                />
            </mesh>
            
            {/* Diamond Setting */}
            <group position={[0, 0.22, 0]}>
                 {/* Diamond Gemstone */}
                 <group>
                     {/* Upper Crown */}
                     <mesh position={[0, 0.06, 0]}>
                         <cylinderGeometry args={[0.06, 0.1, 0.05, 7]} />
                         <meshPhysicalMaterial 
                            color="white" 
                            transmission={0.98} 
                            opacity={1} 
                            metalness={0.1} 
                            roughness={0} 
                            ior={2.4} 
                            thickness={0.5}
                            clearcoat={1}
                         />
                     </mesh>
                     {/* Lower Pavilion */}
                     <mesh position={[0, -0.015, 0]}>
                         <coneGeometry args={[0.1, 0.15, 7]} />
                         <meshPhysicalMaterial 
                            color="white" 
                            transmission={0.98} 
                            opacity={1} 
                            metalness={0.1} 
                            roughness={0} 
                            ior={2.4} 
                            thickness={0.5}
                            clearcoat={1}
                         />
                     </mesh>
                 </group>

                 {/* Gold Prongs */}
                 {[45, 135, 225, 315].map((angle) => {
                     const rad = angle * (Math.PI / 180);
                     const x = Math.cos(rad) * 0.07;
                     const z = Math.sin(rad) * 0.07;
                     return (
                         <mesh key={angle} position={[x, 0.02, z]} rotation={[0.2, -rad, 0]}>
                             <cylinderGeometry args={[0.015, 0.015, 0.15]} />
                             <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
                         </mesh>
                     )
                 })}
            </group>
            
            <Sparkles count={20} scale={0.6} position={[0, 0.25, 0]} color="white" size={4} speed={1} opacity={1} />
        </group>
    </Float>
);

export const Cake = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        {/* Plate */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
             <cylinderGeometry args={[0.8, 0.7, 0.1, 64]} />
             <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Cake Base */}
        <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.6, 64]} />
            <meshStandardMaterial color="#fff0f3" />
        </mesh>
        {/* Icing Drips */}
        <mesh position={[0, 0.7, 0]}>
             <cylinderGeometry args={[0.62, 0.62, 0.1, 64]} />
             <meshStandardMaterial color="#ff99bb" roughness={0.3} />
        </mesh>
        
        {/* Candle */}
        <mesh position={[0, 0.9, 0]}>
             <cylinderGeometry args={[0.03, 0.03, 0.4]} />
             <meshStandardMaterial color="#88ccff" />
        </mesh>
        {/* Flame */}
        <pointLight position={[0, 1.2, 0]} color="#ffaa00" intensity={1.5} distance={3} />
        <mesh position={[0, 1.15, 0]}>
            <sphereGeometry args={[0.06]} />
            <meshBasicMaterial color="#ffaa00" />
        </mesh>
        <Sparkles count={10} position={[0, 1.2, 0]} scale={0.2} color="orange" speed={2} />
    </group>
);

export const SimpleCloud = ({ position, color = "#ffffff", opacity = 0.5, scale = 1, speed = 0.1 }: any) => {
    const group = useRef<Group>(null);
    useFrame((state) => {
        if(group.current) {
            group.current.position.x += Math.sin(state.clock.elapsedTime * speed * 2) * 0.002;
        }
    });
    return (
        <group ref={group} position={position} scale={scale}>
             <mesh position={[0, 0, 0]}>
                <dodecahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.9} flatShading />
            </mesh>
             <mesh position={[-1.2, -0.3, 0]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.9} flatShading />
            </mesh>
             <mesh position={[1.2, -0.2, 0]}>
                <dodecahedronGeometry args={[1.1, 0]} />
                <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.9} flatShading />
            </mesh>
        </group>
    )
}

export const Balloon = ({ position, color, speed = 1 }: any) => {
    const ref = useRef<Group>(null);
    useFrame((state) => {
        if(ref.current) {
            ref.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
            ref.current.rotation.y += 0.01;
        }
    });
    return (
        <group ref={ref} position={position}>
            <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshPhysicalMaterial color={color} roughness={0.1} clearcoat={1} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
                <coneGeometry args={[0.05, 0.1, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* String */}
            <mesh position={[0, -0.3, 0]}>
                 <cylinderGeometry args={[0.005, 0.005, 0.8]} />
                 <meshBasicMaterial color="#eee" />
            </mesh>
        </group>
    )
}

// --- NEW COMPONENTS ---
export const SakuraParticles = ({ count = 200, color = "#ffc8dd" }) => (
  <group position={[0, 5, 0]}>
    <Sparkles 
      count={count} 
      scale={[20, 10, 20]} 
      size={4} 
      speed={0.4} 
      opacity={0.7} 
      color={color} 
    />
  </group>
);

export const Stage = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        <mesh position={[0, 0.5, 0]} receiveShadow>
            <boxGeometry args={[10, 1, 6]} />
            <meshStandardMaterial color="#111" roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.25, 3.5]} receiveShadow>
            <boxGeometry args={[4, 0.5, 1]} />
            <meshStandardMaterial color="#000" />
        </mesh>
        {/* Backdrop Structure - INCREASED WIDTH */}
        <mesh position={[0, 3.5, -2.8]}>
             <boxGeometry args={[14, 7, 0.2]} />
             <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        
        {/* Stage Lights Truss */}
        <mesh position={[0, 6.5, 0]}>
            <boxGeometry args={[12, 0.2, 0.2]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        
        {/* Dedicated Light for the Banner Text */}
        <SpotLight 
            position={[0, 6, 2]} 
            target-position={[0, 4, -3]} 
            angle={0.8} 
            penumbra={0.5} 
            intensity={2} 
            color="#ffffff" 
            distance={10} 
        />
        
        {/* Event Text */}
        <Text 
            position={[0, 4.5, -2.4]} 
            fontSize={0.6} 
            color="#ffffff" 
            anchorX="center" 
            anchorY="middle"
            maxWidth={8}
            textAlign="center"
        >
            Literary Week
        </Text>
        <Text 
            position={[0, 3.9, -2.4]} 
            fontSize={0.25} 
            color="#aaaaaa" 
            anchorX="center" 
            anchorY="middle"
        >
            organized by
        </Text>
        <Text 
            position={[0, 3.4, -2.4]} 
            fontSize={0.35} 
            color="#ff99cc" 
            anchorX="center" 
            anchorY="middle"
        >
            Bengali Literary Association
        </Text>
    </group>
);

// --- CROWD MEMBER COMPONENT FOR INDIVIDUAL ANIMATION ---
const CrowdMember = ({ x, z, color, scale, speed, offset, hasGlowStick, isFemale }: any) => {
    const group = useRef<Group>(null);
    const leftArm = useRef<Mesh>(null);
    const rightArm = useRef<Mesh>(null);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        // Bobbing/Jumping to the music
        // Use different sine frequencies for variety
        const jump = Math.abs(Math.sin(t * speed + offset));
        group.current.position.y = jump * 0.2; // Jump height reduced for realism
        
        // Slight sway
        group.current.rotation.z = Math.sin(t * speed * 0.5 + offset) * 0.05;
        group.current.rotation.y = Math.sin(t * 0.5 + offset) * 0.1;

        // Arm animation
         if (hasGlowStick) {
             if(rightArm.current) rightArm.current.rotation.x = -2.5 + Math.sin(t * 10 + offset) * 0.5;
             if(leftArm.current) leftArm.current.rotation.x = -2.5 + Math.cos(t * 10 + offset) * 0.5;
        } else {
             // Relaxed but happy
             if(rightArm.current) rightArm.current.rotation.z = -0.2;
             if(leftArm.current) leftArm.current.rotation.z = 0.2;
        }
    });

    const hairColor = useMemo(() => Math.random() > 0.5 ? "#222" : (Math.random() > 0.5 ? "#5e4228" : "#d88c9a"), []);

    return (
        <group ref={group} position={[x, 0, z]} scale={scale}>
             {/* Body */}
            {isFemale ? (
                 <mesh position={[0, 0.25, 0]}>
                     <coneGeometry args={[0.25, 0.55, 16]} />
                     <meshStandardMaterial color={color} roughness={0.6} />
                 </mesh>
            ) : (
                 <mesh position={[0, 0.3, 0]}>
                     <cylinderGeometry args={[0.2, 0.18, 0.5, 16]} />
                     <meshStandardMaterial color={color} roughness={0.6} />
                 </mesh>
            )}

            {/* Head */}
            <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial color="#ffe8d6" roughness={0.5} />
            </mesh>
            
            {/* Hair */}
            <mesh position={[0, 0.7, -0.05]}>
                <sphereGeometry args={[0.23, 16, 16]} />
                <meshStandardMaterial color={hairColor} />
            </mesh>

            {/* Arms with Ref */}
             <group position={[-0.22, 0.45, 0]}>
                  <mesh ref={leftArm} position={[0, -0.12, 0]}>
                      <capsuleGeometry args={[0.05, 0.3]} />
                      <meshStandardMaterial color={color} />
                  </mesh>
             </group>
             
             <group position={[0.22, 0.45, 0]}>
                 <group ref={rightArm}>
                     <mesh position={[0, -0.12, 0]}>
                        <capsuleGeometry args={[0.05, 0.3]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                     {/* Glowstick Child */}
                    {hasGlowStick && (
                         <group position={[0, -0.3, 0.1]} rotation={[1.5,0,0]}>
                            <mesh>
                                <cylinderGeometry args={[0.015, 0.015, 0.3]} />
                                <meshBasicMaterial color="cyan" toneMapped={false} />
                            </mesh>
                            <pointLight distance={1} intensity={1} color="cyan" />
                         </group>
                    )}
                 </group>
             </group>
        </group>
    )
}

export const Crowd = () => {
    const crowdData = useMemo(() => {
        const temp = [];
        for(let i=0; i<30; i++) { // Increased count slightly
             let x = (Math.random() - 0.5) * 14;
             let z = 2.5 + Math.random() * 6;
             
             // --- CRITICAL VISIBILITY LOGIC ---
             // Keep the view clear for the main character ("Her")
             const distToHer = Math.sqrt(Math.pow(x - 1.5, 2) + Math.pow(z - 2.5, 2));
             if (distToHer < 1.8) continue;
             if (x > 0.5 && x < 2.5 && z > 2.5) continue;

             temp.push({
                x,
                z,
                scale: 0.8 + Math.random() * 0.4,
                color: Math.random() > 0.5 ? "#301e33" : "#1a0b1a",
                speed: 8 + Math.random() * 4, // Random dance speeds
                offset: Math.random() * 10,
                hasGlowStick: Math.random() > 0.7, // 30% have glowsticks
                isFemale: Math.random() > 0.5
             });
        }
        return temp;
    }, []);

    return (
        <group>
            {crowdData.map((data, i) => (
                 <CrowdMember key={i} {...data} />
            ))}
        </group>
    )
}