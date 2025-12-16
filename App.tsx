import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Stars, Sparkles, SpotLight, ContactShadows, Float, Loader } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart as HeartIcon, Volume2, VolumeX, Music, AlertCircle, Upload, Play } from 'lucide-react';
import * as THREE from 'three';

import { STORY_CHAPTERS } from './constants';
import { Character, Bed, FloatingHeart, Ring, Cake, Tree, LampPost, Speaker, SakuraParticles, IndoorRoom, OutdoorPark, Stage, Crowd, CampusEnvironment, SimpleCloud, Balloon } from './components/SceneElements';

const Experience = ({ currentChapter }: { currentChapter: number }) => {
    const { camera, scene, size } = useThree();
    const scroll = useScroll();
    
    // --- RESPONSIVE LOGIC ---
    const { width, height } = size;
    const aspect = width / height;
    const isPortrait = aspect < 1;
    const isMobile = width < 768;

    useFrame((state, delta) => {
        const total = STORY_CHAPTERS.length - 1;
        const scrollOffset = scroll.offset * total; 
        const targetIndex = Math.min(Math.round(scrollOffset), total);
        
        // Smooth Color Transitions
        const targetColor = new THREE.Color(STORY_CHAPTERS[targetIndex].colorTheme);
        state.scene.background = (state.scene.background as THREE.Color).lerp(targetColor, delta * 2);
        if(state.scene.fog) (state.scene.fog as THREE.FogExp2).color.lerp(targetColor, delta * 2);

        // --- CINEMATIC CAMERA MOVEMENT ---
        const rawPos = STORY_CHAPTERS[targetIndex].cameraPosition;
        
        // Calculate dynamic offsets based on screen shape
        let zOffsetAdd = 0;
        let yOffsetAdd = 0;
        let lookAtY = 0.8;

        if (isPortrait) {
            // PORTRAIT MODE (Phones)
            // 1. Pull camera back significantly (Z+) so horizontal scene elements (chars side-by-side) don't get cut off.
            // 2. Shift camera UP (Y+) and Look Target UP. This pushes the 3D content to the TOP HALF of the screen.
            //    This is crucial so the HTML text overlay at the bottom doesn't cover the characters.
            zOffsetAdd = 7.5; 
            yOffsetAdd = 1.2;
            lookAtY = 2.0; 
        } else if (isMobile) {
            // LANDSCAPE MOBILE
            // Moderate pull back
            zOffsetAdd = 2.5;
            yOffsetAdd = 0.5;
            lookAtY = 1.0;
        }

        const targetPos = new THREE.Vector3(
            rawPos[0], 
            rawPos[1] + yOffsetAdd, 
            rawPos[2] + zOffsetAdd
        );
        
        camera.position.lerp(targetPos, delta * 1.5);
        
        // Smooth lookAt transition
        const currentLookAt = new THREE.Vector3(0, 0, 0);
        camera.getWorldDirection(currentLookAt);
        // We approximate the current lookAt point by projecting somewhat in front
        // But for simplicity in this loop, we just lerp the camera orientation implicitly by updating position and calling lookAt each frame
        // To make lookAt smooth, we could use controls, but hard setting lookAt per frame with lerped position is usually smooth enough for scroll.
        camera.lookAt(0, lookAtY, 0);
    });

    return (
        <group>
            {/* --- LIGHTING --- */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
            <Environment preset="city" blur={0.8} background={false} />
            <ContactShadows opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
            
            <SakuraParticles />

            {/* --- SCENES --- */}
            {/* strict conditional rendering with ternary to null to avoid R3F warnings */}
            
            {currentChapter === 0 ? ( // INTRO
                 <group>
                     <OutdoorPark color="#050505" />
                     <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                     <Character position={[-0.8, 0, 0]} color="#48cae4" pose="meet" />
                     <Character position={[0.8, 0, 0]} color="#f72585" pose="meet" isHer />
                     <Sparkles scale={10} count={100} color="#fff" size={2} opacity={0.5} />
                 </group>
            ) : null}

            {currentChapter === 1 ? ( // DANCE
                <group>
                    <IndoorRoom color="#240046" />
                    
                    {/* Stage & Props */}
                    <Stage position={[0, 0, -3]} />
                    <Speaker position={[-3.5, 1.5, -4]} rotation={[0, 0.3, 0]} />
                    <Speaker position={[3.5, 1.5, -4]} rotation={[0, -0.3, 0]} />
                    
                    {/* Characters */}
                    {/* ME: On stage, dancing */}
                    <Character position={[0, 1.1, -3]} color="#4cc9f0" pose="dance" />
                    
                    {/* HER: In audience, sitting */}
                    <Character position={[1.5, 0.2, 2.5]} color="#f72585" pose="sit" isHer />
                    
                    {/* Audience Crowd */}
                    <Crowd />

                    {/* Spotlights */}
                    {/* Light on ME */}
                    <SpotLight 
                        position={[0, 6, -1]} 
                        target-position={[0, 1, -3]} 
                        angle={0.3} 
                        penumbra={0.5} 
                        color="cyan" 
                        intensity={8} 
                        castShadow 
                    />
                    {/* Light on HER */}
                    <SpotLight 
                        position={[1.5, 5, 2.5]} 
                        target-position={[1.5, 0, 2.5]} 
                        angle={0.4} 
                        penumbra={0.4} 
                        color="#f72585" 
                        intensity={5} 
                        castShadow 
                    />
                </group>
            ) : null}

            {currentChapter === 2 ? ( // THE SPARK - VIT CAMPUS WALK (REPLACED BUILDING WITH TREES)
                <group>
                    <CampusEnvironment />
                    
                    {/* Characters Walking Side by Side holding hands */}
                    {/* They need to be close: -0.3 and 0.3 */}
                    <Character position={[-0.35, 0, 1]} color="#48cae4" pose="walk" />
                    <Character position={[0.35, 0, 1]} color="#f72585" pose="walk" isHer />
                    
                    <SimpleCloud position={[0, 6, -5]} opacity={0.4} speed={0.2} color="#fff" scale={0.8} />
                    <SimpleCloud position={[3, 5, -8]} opacity={0.3} speed={0.15} color="#fff" scale={0.6} />
                </group>
            ) : null}

            {currentChapter === 3 ? ( // HOSPITAL
                <group>
                    <IndoorRoom color="#caf0f8" />
                    <Bed position={[0, 0, 0]} />
                    <Character position={[0, 0.3, 0]} color="#f72585" pose="sick" isHer />
                    <Character position={[-1.2, 0, 0.5]} color="#48cae4" pose="scare" />

                    {/* Mom - Right side, worried - Wearing dress but no crown */}
                    <Character position={[1.2, 0, 0.5]} color="#d88c9a" pose="scare" isFemale isElder /> 
                    
                    {/* Dad - Right side, behind mom, worried */}
                    <Character position={[1.8, 0, 0.8]} color="#6c757d" pose="scare" isElder />

                    <pointLight position={[0, 4, 0]} color="#a2d2ff" intensity={0.5} />
                </group>
            ) : null}

            {currentChapter === 4 ? ( // LOVE - FIXED FLOATING HEART POSITION
                <group>
                    <OutdoorPark color="#590d22" />
                    {/* Moved Heart UP to y=3.5 and pushed back to z=-2 to avoid clipping characters */}
                    <FloatingHeart position={[0, 3.5, -2]} scale={2} />
                    <Character position={[-0.5, 0, 0]} color="#48cae4" pose="love" />
                    <Character position={[0.5, 0, 0]} color="#f72585" pose="love" isHer />
                    <Sparkles count={150} color="#ff0055" scale={8} size={4} speed={0.5} />
                </group>
            ) : null}

            {currentChapter === 5 ? ( // PROPOSAL
                <group>
                    <OutdoorPark color="#2b2d42" />
                    <LampPost position={[-2, 0, 0]} />
                    <Ring position={[0, 1.2, 0]} />
                    <Character position={[-0.8, 0, 0]} color="#48cae4" pose="kneel" />
                    <Character position={[0.8, 0, 0]} color="#f72585" pose="kneel" isHer />
                    <Stars count={1000} fade />
                </group>
            ) : null}

            {currentChapter === 6 ? ( // BIRTHDAY - MAGICAL + PARENTS CLAPPING
                <group>
                    <IndoorRoom color="#3a0ca3" />
                    <Cake position={[0, 0, 1]} />
                    
                    {/* Couple in Center - Reverted to Party Pose */}
                    <Character position={[-0.6, 0, 0]} color="#48cae4" pose="party" />
                    <Character position={[0.6, 0, 0]} color="#f72585" pose="party" isHer />

                    {/* MY PARENTS (Left Side) - Grey/Pink Theme */}
                    <Character position={[-2.2, 0, -0.5]} color="#6c757d" pose="party" isElder />
                    <Character position={[-3.0, 0, 0]} color="#d88c9a" pose="party" isFemale isElder />

                    {/* HER PARENTS (Right Side) - NEW COLORS (Burnt Orange / Dark Blue Theme) */}
                    <Character position={[2.2, 0, -0.5]} color="#e76f51" pose="party" isFemale isElder />
                    <Character position={[3.0, 0, 0]} color="#264653" pose="party" isElder />

                    {/* Magic Effects */}
                    <Sparkles count={400} color="#ff006e" scale={12} size={6} speed={0.8} />
                    <Float speed={3} rotationIntensity={0} floatIntensity={1.5}>
                         {/* Balloons */}
                         <Balloon position={[-3, 3, -2]} color="cyan" />
                         <Balloon position={[3, 3.5, -2]} color="hotpink" />
                         <Balloon position={[-1.5, 4, -3]} color="gold" />
                         <Balloon position={[1.5, 4.2, -3]} color="purple" />
                    </Float>
                    
                    {/* Confetti-like sparkles */}
                    <Sparkles count={200} color="gold" scale={10} size={3} speed={2} position={[0, 4, 0]} />

                    <Float speed={5} rotationIntensity={0} floatIntensity={2}>
                        <SimpleCloud position={[0, 5, -5]} color="#ffc8dd" opacity={0.6} scale={0.8} />
                    </Float>
                </group>
            ) : null}
        </group>
    );
};

const ScrollListener = ({ setIndex }: { setIndex: (i: number) => void }) => {
    const scroll = useScroll();
    const lastIndex = useRef(-1);
    
    useFrame(() => {
        const total = STORY_CHAPTERS.length - 1;
        const idx = Math.min(Math.round(scroll.offset * total), total);
        if (lastIndex.current !== idx) {
            lastIndex.current = idx;
            setIndex(idx);
        }
    });
    return null;
}

const StoryOverlay = () => {
    const scroll = useScroll();
    const [opacity, setOpacity] = useState(1);
    
    useFrame(() => {
        const total = STORY_CHAPTERS.length - 1;
        const currentPos = scroll.offset * total;
        const fraction = currentPos % 1;
        
        let op = 1;
        if (fraction < 0.2) {
            op = fraction / 0.2; // Fade in
        } else if (fraction > 0.8) {
            op = (1 - fraction) / 0.2; // Fade out
        } else {
            op = 1; // Stay visible
        }

        // Fix: Keep text visible at the very end of the scroll
        if (currentPos > total - 0.5) {
            op = 1;
        }
        
        setOpacity(op);
    });

    return (
        <div className="w-full relative">
            {STORY_CHAPTERS.map((chapter) => (
                <section key={chapter.id} className="h-screen w-full flex pointer-events-none">
                    <div className="w-full h-full flex flex-col justify-end items-center pb-8 md:pb-16 px-4">
                        <motion.div 
                            style={{ opacity }}
                            className="bg-black/60 backdrop-blur-md p-6 md:p-12 rounded-3xl max-w-4xl text-center border border-white/10 shadow-2xl pointer-events-auto max-h-[40vh] md:max-h-[60vh] overflow-y-auto mb-8 md:mb-0"
                        >
                            <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 font-serif text-shadow-lg sticky top-0">
                                {chapter.title}
                            </h2>
                            <p className="text-sm md:text-xl text-pink-100 font-light leading-relaxed">
                                {chapter.text}
                            </p>
                        </motion.div>
                    </div>
                </section>
            ))}
        </div>
    );
};

const FloatingHeartsBackground = () => {
  // Create an array of hearts with random positions and delays
  const hearts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    delay: `${Math.random() * 5}s`,
    scale: Math.random() * 0.5 + 0.5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-500/20"
          initial={{ y: "110vh", x: 0, opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            x: [0, 50, -50, 0], // sway
            opacity: [0, 1, 0] 
          }}
          transition={{ 
            duration: parseFloat(heart.animationDuration), 
            repeat: Infinity, 
            delay: parseFloat(heart.delay),
            ease: "linear"
          }}
          style={{ 
            left: heart.left, 
            fontSize: `${heart.scale * 3}rem` 
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

const StartScreen = ({ onStart }: { onStart: () => void }) => {
     return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
             {/* Rich Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4a044e_0%,_#000_80%)]" />
            
            <FloatingHeartsBackground />
            
            <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
                
                {/* Decorative Line Top */}
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: "100px" }} transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mb-8"
                />

                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ duration: 1, type: "spring" }}
                    className="mb-6 relative"
                >
                     {/* Glowing Heart Container */}
                     <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20 animate-pulse" />
                     <HeartIcon className="w-24 h-24 md:w-32 md:h-32 text-pink-500 fill-pink-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]" />
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl md:text-8xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-pink-200 via-purple-200 to-pink-400 drop-shadow-lg"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    Happy Birthday
                </motion.h1>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-2xl md:text-4xl font-light text-pink-100/80 mb-10 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    My Love
                </motion.h2>

                <motion.button 
                    onClick={onStart}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(236, 72, 153, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="group relative px-10 py-4 md:px-14 md:py-5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-xl md:text-2xl text-white font-serif overflow-hidden transition-all duration-300"
                >
                    <span className="relative z-10 group-hover:text-pink-200 transition-colors">Open The Gift</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 ring-1 ring-white/30 rounded-full group-hover:ring-pink-400/50 transition-all" />
                </motion.button>
                
                 {/* Decorative Line Bottom */}
                 <motion.div 
                    initial={{ width: 0 }} animate={{ width: "200px" }} transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-12"
                />
            </div>
        </div>
     );
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [userAudioSrc, setUserAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ---------------------------------------------------------
  // 🎵 CUSTOM MUSIC SETUP 🎵
  // I have automatically added the link from your screenshot!
  const PASTE_YOUR_GITHUB_LINK_HERE = "https://raw.githubusercontent.com/Souvik0001/birthday-assets/main/music.mp3"; 
  // ---------------------------------------------------------

  const defaultAudioSrc = PASTE_YOUR_GITHUB_LINK_HERE || "https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3";

//   useEffect(() => {
//     // Attempt playback if audio ref is available and we have started
//     if (audioRef.current && started && !muted) {
//         audioRef.current.play().catch(e => {
//             console.warn("Playback failed:", e);
//         });
//     }
//   }, [started, userAudioSrc, muted]);
  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  audio.muted = muted;

  if (started && !muted) {
    audio.play().catch(() => {
      // autoplay blocked – expected on first load
    });
  }
}, [started, userAudioSrc, muted]);

  const handleStart = async () => {
    setStarted(true);
    if (audioRef.current) {
        try {
            await audioRef.current.play();
            setAudioError(false);
        } catch (e) {
            console.log("Start click autoplay failed:", e);
        }
    }
  };

  const handleManualFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const url = URL.createObjectURL(file);
        setUserAudioSrc(url);
        setAudioError(false);
        // Force play immediately after upload, wait for react to update the DOM
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(err => console.error("Manual upload play error:", err));
            }
        }, 100);
    }
  };

  const toggleMute = () => {
      setMuted(!muted);
      if(audioRef.current) {
          audioRef.current.muted = !muted;
      }
  };

  return (
    <div className="w-full h-screen bg-black relative">
      <audio 
        // KEY PROP IS CRITICAL: Forces React to replace the element when source changes
        // This clears any internal error state in the browser's media player
        key={userAudioSrc || defaultAudioSrc}
        ref={audioRef} 
        loop
        preload="auto"
        src={userAudioSrc || defaultAudioSrc}
        onError={(e) => {
             console.log("Audio load error.");
             setAudioError(true);
        }}
      />
      
      {!started && <StartScreen onStart={handleStart} />}
      
      {started && (
          <>
            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col gap-2 items-end pointer-events-auto">
                <div className="flex items-center gap-2">
                    {/* Always visible 'Change Music' button */}
                    <label className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20 cursor-pointer relative group">
                        <Music size={18} className="md:w-5 md:h-5" />
                        <input 
                            type="file" 
                            accept="audio/*" 
                            className="hidden" 
                            onChange={handleManualFileUpload}
                        />
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                            Change Music
                        </span>
                    </label>

                    <button 
                        onClick={toggleMute} 
                        className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20"
                    >
                        {muted ? <VolumeX size={18} className="md:w-5 md:h-5" /> : <Volume2 size={18} className="md:w-5 md:h-5" />}
                    </button>
                </div>
                
                {/* Fallback Warning Message */}
                {audioError && !userAudioSrc && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                    >
                         <div className="bg-red-500/80 backdrop-blur-md text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold shadow-xl border border-white/20 text-center animate-pulse">
                           <p>Music failed. Click icon to upload.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 45 }} gl={{ antialias: false }}>
                <color attach="background" args={['#050505']} />
                <fogExp2 attach="fog" args={['#050505', 0.03]} />
                
                <Suspense fallback={null}>
                    <ScrollControls pages={STORY_CHAPTERS.length} damping={0.4} distance={1}>
                        <Experience currentChapter={chapterIndex} />
                        <ScrollListener setIndex={setChapterIndex} />
                        <Scroll html>
                            <StoryOverlay />
                        </Scroll>
                    </ScrollControls>
                    
                    {/* --- POST PROCESSING --- */}
                    <EffectComposer enableNormalPass={false}>
                        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.2} radius={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={1.0} />
                        <Noise opacity={0.05} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
            <Loader 
               containerStyles={{ background: 'black' }}
               innerStyles={{ background: '#333', width: '200px', height: '10px' }}
               barStyles={{ background: '#ff0055', height: '10px' }}
               dataStyles={{ color: '#ff0055', fontSize: '14px', fontFamily: 'serif' }} 
               dataInterpolation={(p) => `Loading Memory ${p.toFixed(0)}%`} 
            />
          </>
      )}
    </div>
  );
}