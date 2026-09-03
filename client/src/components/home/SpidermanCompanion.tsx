import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '../../utils/audioFx';
import { useUIStore } from '../../store/uiStore';

type ConvoState = 'initial' | 'challenge' | 'unlocked';

export const SpidermanCompanion: React.FC = () => {
  const navigate = useNavigate();
  const { isCompanionOpen, toggleCompanion, closeCompanion } = useUIStore();

  const [convoState, setConvoState] = useState<ConvoState>('initial');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted());
  const [isScrolledPastHero, setIsScrolledPastHero] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>("Think you can survive?");

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection across all screens
  useEffect(() => {
    const handleScroll = () => {
      const threshold = Math.min(window.innerHeight * 0.35, 200);
      setIsScrolledPastHero(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle provocative speech hints
  useEffect(() => {
    const hints = [
      "Think you can survive?",
      "94% of teams will fail.",
      "Are you fast enough?",
      "Unlock classified arena",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % hints.length;
      setSpeechBubbleText(hints[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    soundFx.initMuteState();
    setIsMuted(soundFx.isMuted());
  }, []);

  const handleSelectOption = (nextState: ConvoState) => {
    soundFx.click();
    setConvoState(nextState);
  };

  const handleRoute = (route: string) => {
    soundFx.reveal();
    closeCompanion();
    navigate(route);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.click();
    setConvoState('initial');
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          01. ON-SCROLL HANGING TRIGGER
          - Desktop (>= md): spiderman1.png
          - Mobile (< md): spiderman.png
         ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isScrolledPastHero && !isCompanionOpen && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { 
                type: 'spring', 
                damping: 15, 
                stiffness: 100,
                mass: 0.9
              } 
            }}
            exit={{ 
              y: -320, 
              opacity: 0,
              transition: { duration: 0.2, ease: 'easeIn' }
            }}
            className="fixed top-12 sm:top-14 left-2 sm:left-6 z-40 select-none pointer-events-auto flex items-start gap-2.5"
          >
            {/* Hanging Figure with Pendulum Swing */}
            <motion.div
              onClick={() => {
                soundFx.click();
                toggleCompanion();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94, y: 8 }}
              animate={{ 
                rotate: [-2, 2, -2],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
              style={{ transformOrigin: 'top center' }}
              className="cursor-pointer relative group flex flex-col items-center"
              title="Click to open Transmission"
            >
              {/* Flare */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-[radial-gradient(circle,_rgba(224,27,34,0.45)_0%,_transparent_70%)] pointer-events-none animate-pulse" />

              {/* Desktop Asset (Larger Medium-Large Scaling) */}
              <img 
                src="/assets/spiderman1.png" 
                alt="Transmission" 
                className="hidden md:block w-32 lg:w-40 xl:w-44 h-auto object-contain filter drop-shadow-[0_6px_22px_rgba(224,27,34,0.9)] group-hover:brightness-115 transition-all"
                loading="eager"
              />

              {/* Mobile Asset */}
              <img 
                src="/assets/spiderman.png" 
                alt="Transmission" 
                className="block md:hidden w-14 sm:w-16 h-auto object-contain filter drop-shadow-[0_4px_14px_rgba(224,27,34,0.85)] group-hover:brightness-110 transition-all"
                loading="eager"
              />

              {/* Status Dot */}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E01B22] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2A2A] shadow-[0_0_8px_#FF2A2A]"></span>
              </span>
            </motion.div>

            {/* Attached Speech Bubble Prompt */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, x: -8 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                soundFx.click();
                toggleCompanion();
              }}
              className="cursor-pointer mt-16 sm:mt-24 bg-[#120507]/95 hover:bg-[#1E090D] border border-[#E01B22]/70 hover:border-[#FF2A2A] rounded-[2px] px-3.5 py-2 shadow-xl backdrop-blur-md flex flex-col text-left max-w-[190px] transition-all"
            >
              <span className="font-mono text-[8px] font-black text-[#FF5555] tracking-widest uppercase leading-none">
                TRANSMISSION
              </span>
              <span className="font-mono text-[11px] font-bold text-[#F7F2F2] leading-tight mt-1">
                {speechBubbleText}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          02. COMPACT, HIGH-ENGAGEMENT TRANSMISSION HUD
          - Choice-Driven Rage Bait / Hook Flow to The Extraction
          - Uses Profile Image Only (No Icons, No Emojis, No Clutter)
          - Compact & Elegant (Non-blocking)
         ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCompanionOpen && (
          <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed bottom-3 left-2 right-2 sm:bottom-auto sm:right-auto sm:top-20 sm:left-6 lg:left-10 z-50 w-auto sm:w-[350px] lg:w-[370px] bg-[#0E0507]/95 border-2 border-[#E01B22] rounded-[4px] shadow-[0_0_35px_rgba(224,27,34,0.45)] backdrop-blur-xl overflow-hidden font-mono select-none"
          >
            {/* Top Header Bar */}
            <div className="px-4 py-3 bg-[#17080B] border-b border-[#2A1A1D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Profile Image */}
                <div className="relative w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FF2A2A] to-[#2A060A] shadow-[0_0_10px_rgba(224,27,34,0.6)] shrink-0">
                  <img 
                    src="/assets/spiderman_profile.jpg" 
                    alt="Transmission Avatar" 
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#0E0507]" />
                </div>

                <div>
                  <div className="text-xs font-black text-white tracking-wider uppercase">
                    SYSTEM OVERRIDE
                  </div>
                  <div className="text-[8px] text-[#FF5555] font-bold tracking-widest uppercase">
                    LOGIN 2K26 PROTOCOL
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={toggleSound}
                  className="px-2 py-1 text-[#A79798] hover:text-white bg-[#1E0B0F] hover:bg-[#2A1116] rounded border border-[#2A1A1D] text-[10px] font-bold"
                >
                  {isMuted ? 'UNMUTE' : 'MUTE'}
                </button>
                {convoState !== 'initial' && (
                  <button
                    onClick={handleReset}
                    className="px-2 py-1 text-[#A79798] hover:text-white bg-[#1E0B0F] hover:bg-[#2A1116] rounded border border-[#2A1A1D] text-[10px] font-bold"
                  >
                    RESET
                  </button>
                )}
                <button
                  onClick={closeCompanion}
                  className="px-2 py-1 text-[#A79798] hover:text-white bg-[#1E0B0F] hover:bg-[#E01B22] rounded border border-[#2A1A1D] text-[10px] font-bold"
                >
                  CLOSE
                </button>
              </div>
            </div>

            {/* ── INTERACTIVE CONVERSATION BODY ── */}
            <div className="p-4 sm:p-5 space-y-4 bg-[#0A0305]">
              
              {/* State 1: The Provocation */}
              {convoState === 'initial' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-[#15070A] border-l-2 border-[#FF2A2A] text-xs text-[#E5E0E0] leading-relaxed">
                    <span className="block text-[8.5px] text-[#FF5555] font-black uppercase tracking-wider mb-1">
                      // DIRECT TRANSMISSION
                    </span>
                    "Most people who register for LOGIN 2K26 can barely solve standard challenges. You probably can't either."
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-[8.5px] text-[#A79798] font-bold tracking-wider uppercase">
                      CHOOSE YOUR RESPONSE:
                    </div>

                    <button
                      onClick={() => handleSelectOption('challenge')}
                      className="w-full py-2.5 px-3 bg-[#240A0F] hover:bg-[#340F16] border border-[#FF2A2A] hover:border-[#FF4444] rounded-[2px] text-left text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(255,42,42,0.25)] flex items-center justify-between"
                    >
                      <span>You think I can't? Try me.</span>
                      <span className="text-[#FF5555]">&rarr;</span>
                    </button>

                    <button
                      onClick={() => handleSelectOption('challenge')}
                      className="w-full py-2.5 px-3 bg-[#140709] hover:bg-[#1F0B0E] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-left text-[#C8C2C2] hover:text-white text-xs font-medium transition-all flex items-center justify-between"
                    >
                      <span>What is this even about?</span>
                      <span className="text-[#8C8283]">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* State 2: The Challenge / Rage Bait */}
              {convoState === 'challenge' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-[#1E080D] border-l-2 border-[#FF2A2A] text-xs text-[#F0EBEB] leading-relaxed space-y-1.5">
                    <span className="block text-[8.5px] text-[#FF5555] font-black uppercase tracking-wider">
                      // CLASSIFIED CTF OVERRIDE
                    </span>
                    <p>
                      "The Extraction CTF has a <strong className="text-[#FFD700]">₹13,000+ bounty</strong> with cryptographic bypasses and forensic payloads. 94% of teams will fail in the first 30 minutes."
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-[8.5px] text-[#FF5555] font-bold tracking-wider uppercase">
                      PROVE YOUR CLEARANCE:
                    </div>

                    {/* Primary Rage Bait Route Button */}
                    <button
                      onClick={() => handleRoute('/events/the-extraction')}
                      className="w-full py-3 px-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-white text-xs font-black uppercase tracking-wider rounded-[2px] shadow-[0_0_20px_rgba(224,27,34,0.7)] transition-all flex items-center justify-between"
                    >
                      <span>TAKE THE ₹13,000 BOUNTY (ENTER CTF)</span>
                      <span className="text-white font-bold">&rarr;</span>
                    </button>

                    <button
                      onClick={() => handleRoute('/events')}
                      className="w-full py-2.5 px-3 bg-[#140709] hover:bg-[#200B0F] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-left text-[#C8C2C2] hover:text-white text-xs font-semibold transition-all flex items-center justify-between"
                    >
                      <span>Explore other symposium arenas</span>
                      <span className="text-[#8C8283]">&rarr;</span>
                    </button>

                    <button
                      onClick={() => handleRoute('/register')}
                      className="w-full py-2.5 px-3 bg-[#140709] hover:bg-[#200B0F] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-left text-[#C8C2C2] hover:text-white text-xs font-semibold transition-all flex items-center justify-between"
                    >
                      <span>Register squad pass (₹100)</span>
                      <span className="text-[#8C8283]">&rarr;</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Telemetry */}
            <div className="px-4 py-2.5 bg-[#120608] border-t border-[#2A1A1D] flex items-center justify-between text-[8.5px] text-[#8C8283]">
              <span>PSG TECH // CAT LAB</span>
              <span className="text-[#E01B22] font-bold">SEPT 18 & 19, 2026</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpidermanCompanion;
