import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Zap,
  Clock,
  MapPin,
  Users,
  Ticket,
  Phone,
  MessageSquare,
  Radio,
  Key,
  Globe,
  Play,
  Pause,
  Terminal,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { soundFx, bgMusic } from '../utils/audioFx';

import type { Variants } from 'framer-motion';

// Smooth, non-distracting motion variants adhering to HCI guidelines
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const cardFade: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const TheExtractionPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number>(0);

  // Live Decryption Mini-Game State
  const [simInput, setSimInput] = useState<string>('');
  const [simSuccess, setSimSuccess] = useState<boolean>(false);
  const [simFeedback, setSimFeedback] = useState<string>('');

  const targetEncoded = "RUFTVElPTg==";
  const targetDecoded = "EXTRACTION";

  useEffect(() => {
    soundFx.reveal();
    setIsAudioPlaying(bgMusic.isPlaying());
  }, []);

  const handleActionClick = () => {
    soundFx.click();
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/dashboard/events');
    }
  };

  const toggleSoundtrack = () => {
    const isPlaying = bgMusic.toggle();
    setIsAudioPlaying(isPlaying);
    soundFx.click();
  };

  const handleSimulateDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = simInput.trim().toUpperCase();
    if (clean === targetDecoded) {
      soundFx.reveal();
      setSimSuccess(true);
      setSimFeedback("CLEARANCE VERIFIED // BYPASS ACCEPTED: LEVEL-5 ACCESS GRANTED!");
    } else {
      soundFx.glitch();
      setSimFeedback("ACCESS DENIED // INCORRECT DECRYPTED PAYLOAD. TRY AGAIN.");
    }
  };

  const characters = [
    {
      id: 'veera',
      name: 'VEERA RAGHAVAN',
      role: 'Former RAW Field Agent',
      status: 'Inside East Coast Mall',
      image: '/characters/veera_determined.webp',
      quote: "I've taken out the perimeter guards, but Saif locked the entire mall grid with triple-layer ciphers and biometric vaults. If you don't breach their network from CAT Lab, the hostages won't make it out. Move fast. I don't like waiting.",
      tag: 'ALPHA OPERATIVE',
    },
    {
      id: 'althaf',
      name: 'DEPUTY NSA ALTHAF HUSSAIN',
      role: 'Crisis Command Lead',
      status: 'Joint Operations Command Center',
      image: '/characters/althaf_commanding.webp',
      quote: "Listen up, Operatives! The government cannot launch a frontal assault without mass casualties. Veera is our lone wolf on the inside. You are CERT-In's finest cyber strike unit. Crack Saif's JWT tokens, expose the traitorous Home Minister, and feed Veera live bypass codes!",
      tag: 'CRISIS COMMAND',
    },
    {
      id: 'umar',
      name: 'UMAR SAIF',
      role: 'Terror Cell Mastermind',
      status: 'Atrium Command Post // Armed Sleeper Cells',
      image: '/characters/umar_threatening.webp',
      quote: "Listen to me carefully. We have wired every corner of East Coast Mall with C4. Release my brother Umar Farooq immediately, or the logic bomb triggers. You think your little cyber team can bypass my killswitch? Try it.",
      tag: 'HOSTILE THREAT',
    },
    {
      id: 'preethi',
      name: 'PREETHI',
      role: 'Tactical Relay Agency',
      status: 'Comms Relay Coordinator',
      image: '/characters/preethi_hopeful.webp',
      quote: "Veera is fighting on the frontlines while we patch your terminal directly into the mall's maintenance network. We have 9 encrypted security checkpoints. Unlock them one by one!",
      tag: 'COMMS RELAY',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070204] text-[#F7F2F2] font-mono selection:bg-[#E01B22] selection:text-white pb-24 overflow-x-hidden">

      {/* ── BACKGROUND AMBIENCE & CYBER GRID ── */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(224,27,34,0.22),rgba(0,0,0,0))] z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#14070a_1px,transparent_1px),linear-gradient(to_bottom,#14070a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none z-0" />

      {/* ── FIXED TOP NAVIGATION & SOUNDTRACK CONTROLLER ── */}
      <nav aria-label="Breadcrumb Navigation" className="sticky top-0 z-40 bg-[#0E0407]/92 backdrop-blur-md border-b border-[#2A1A1D] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={() => {
              soundFx.click();
              navigate('/');
            }}
            className="inline-flex items-center gap-2 text-[#A79798] hover:text-[#FF2A2A] font-bold uppercase transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF2A2A]"
            aria-label="Return to Headquarters"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">RETURN TO HQ</span>
            <span className="sm:hidden">HQ</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Audio Soundtrack Toggle Button */}
            <button
              onClick={toggleSoundtrack}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] border text-xs font-bold transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-[#FF2A2A] ${isAudioPlaying
                  ? 'bg-[#26090E] border-[#FF2A2A] text-[#FF5555] shadow-[0_0_15px_rgba(255,42,42,0.4)]'
                  : 'bg-[#140608] border-[#2A1A1D] text-[#A79798] hover:text-white'
                }`}
              title="Toggle Background Soundtrack"
              aria-label={isAudioPlaying ? 'Pause background soundtrack' : 'Play background soundtrack'}
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FF2A2A]" />
                  <span className="text-[10px] hidden sm:inline">SOUNDTRACK ON</span>
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#FF2A2A] h-full animate-pulse" />
                    <span className="w-0.5 bg-[#FF2A2A] h-2" />
                    <span className="w-0.5 bg-[#FF2A2A] h-3 animate-pulse" />
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#E01B22]" />
                  <span className="text-[10px] hidden sm:inline">PLAY SOUNDTRACK</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs">
              <Link to="/events" className="text-[#8C8283] hover:text-white uppercase transition-colors hidden sm:inline">
                EVENTS
              </Link>
              <span className="text-[#E01B22] hidden sm:inline">/</span>
              <span className="text-[#FF5555] font-black tracking-wider uppercase">
                THE EXTRACTION
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16 relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════
            01. HERO SECTION: BALANCED 50/50 HCI LAYOUT
            - Left: Big, Impactful Extraction Poster Showcase
            - Right: "LEANER. MEANER. STRONGER." Hook, Telemetry & ₹13,000 Bounty
           ═══════════════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch"
        >
          {/* Left Column: Big Extraction Poster Graphic */}
          <div className="flex flex-col justify-between relative group h-full">
            <div className="relative rounded-[4px] overflow-hidden border-2 border-[#E01B22] shadow-[0_0_50px_rgba(224,27,34,0.5)] bg-[#120507] flex-1 flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]">
              <img
                src="/assets/events/extraction_hero.webp"
                alt="Operation: The Extraction Poster"
                className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                loading="eager"
              />
              {/* Cyber Corner Accents */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FF2A2A]" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FF2A2A]" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FF2A2A]" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FF2A2A]" />
            </div>

            {/* Sub-poster Status Bar */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-[#8C8283] px-1 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-[#E5DCDC]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                FLAGSHIP CTF ARENA
              </span>
              <span className="text-[#FF5555] font-black uppercase tracking-wider">
                SECTOR 7 SIEGE // CAT LAB
              </span>
            </div>
          </div>

          {/* Right Column: Narrative, Bounties, Telemetry & CTA */}
          <div className="flex flex-col justify-between space-y-5 text-left h-full">

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-[#22070B] border border-[#FF2A2A] text-[#FF5555] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,42,42,0.35)] w-fit">
              <Radio className="w-3.5 h-3.5 text-[#FF2A2A]" />
              <span>LIVE CRISIS TRANSMISSION // SECTOR 7 LOCKDOWN</span>
            </div>

            {/* Blockbuster Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFFFFF] to-[#FF5555] tracking-tight uppercase leading-tight">
                "HE IS LEANER. MEANER. STRONGER. BUT HE NEEDS YOUR KEYSTROKES TO SURVIVE."
              </h1>
              <p className="text-xs sm:text-sm text-[#D8CECE] font-sans leading-relaxed">
                East Coast Mall is under siege. 1,200 hostages. 15 armed sleeper cells. One former RAW agent trapped inside. <strong className="text-white font-bold">Veera Raghavan</strong> doesn't take prisoners — he extracts them. But he is blind without cyber backup. Will your squad crack the system, or will Chennai burn?
              </p>
            </div>

            {/* ── TOTAL BOUNTY POOL (Exact 2 Prizes: ₹8,000 & ₹5,000) ── */}
            <div className="p-4 bg-gradient-to-r from-[#200A0F] via-[#140608] to-[#200A0F] border-2 border-[#FFD700] rounded-[2px] shadow-[0_0_20px_rgba(255,215,0,0.15)]">
              <div className="text-[9.5px] sm:text-[10.5px] text-[#FFD700] font-black uppercase tracking-widest mb-2">
                TOTAL EVENT BOUNTY POOL: ₹13,000
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-[#18080C] border border-[#FFD700]/60 rounded-[2px]">
                  <span className="text-[8.5px] px-2 py-0.5 bg-[#FFD700] text-black font-black uppercase rounded-[1px]">
                    1ST PRIZE &bull; CHAMPION
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[#FFD700] mt-1">
                    ₹8,000
                  </div>
                  <div className="text-[10px] text-[#E5D8D8] mt-0.5 font-semibold">
                    Cash Bounty + Trophy
                  </div>
                </div>

                <div className="p-3 bg-[#18080C] border border-[#C0C0C0]/60 rounded-[2px]">
                  <span className="text-[8.5px] px-2 py-0.5 bg-[#C0C0C0] text-black font-black uppercase rounded-[1px]">
                    2ND PRIZE &bull; RUNNER-UP
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[#C0C0C0] mt-1">
                    ₹5,000
                  </div>
                  <div className="text-[10px] text-[#E5D8D8] mt-0.5 font-semibold">
                    Cash Bounty + Shield
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <div className="p-2.5 bg-[#130609] border border-[#2A1A1D] rounded-[2px]">
                <div className="text-[8.5px] text-[#8C8283] uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#FF2A2A]" /> SQUAD
                </div>
                <div className="text-xs font-bold text-white mt-0.5">1–2 Operatives</div>
              </div>

              <div className="p-2.5 bg-[#130609] border border-[#2A1A1D] rounded-[2px]">
                <div className="text-[8.5px] text-[#8C8283] uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF2A2A]" /> VENUE
                </div>
                <div className="text-xs font-bold text-white mt-0.5">CAT Lab (Campus)</div>
              </div>

              <div className="p-2.5 bg-[#130609] border border-[#2A1A1D] rounded-[2px]">
                <div className="text-[8.5px] text-[#8C8283] uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF2A2A]" /> TIMING
                </div>
                <div className="text-xs font-bold text-white mt-0.5">09:30 AM (Sept 19)</div>
              </div>

              <div className="p-2.5 bg-[#130609] border border-[#2A1A1D] rounded-[2px]">
                <div className="text-[8.5px] text-[#8C8283] uppercase flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-[#10B981]" /> PASS ENTRY
                </div>
                <div className="text-xs font-bold text-[#10B981] mt-0.5">INCLUDED (₹100)</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleActionClick}
                className="shimmer-btn w-full px-8 py-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-white text-xs font-black uppercase tracking-wider rounded-[2px] shadow-[0_0_25px_rgba(224,27,34,0.7)] inline-flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF2A2A]"
              >
                <Zap className="w-4 h-4" />
                <span>ENLIST SQUAD // BECOME VEERA'S CYBER UNIT &rarr;</span>
              </button>
            </div>

          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════════
            02. SECTION: CHARACTER TRANSMISSIONS & RADIO DISPATCH
           ═══════════════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="space-y-4"
        >
          <div className="border-b border-[#2A1A1D] pb-2 flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#FF2A2A]" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              INTERCEPTED RADIO COMMS & CHARACTER DOSSIER
            </h2>
          </div>

          {/* Character Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {characters.map((char, index) => (
              <button
                key={char.id}
                onClick={() => {
                  soundFx.click();
                  setSelectedCharacter(index);
                }}
                className={`p-3 border rounded-[2px] flex items-center gap-3 transition-all text-left focus:outline-none focus:ring-1 focus:ring-[#FF2A2A] ${selectedCharacter === index
                    ? 'bg-[#26090F] border-[#FF2A2A] shadow-[0_0_15px_rgba(255,42,42,0.35)]'
                    : 'bg-[#100507] border-[#2A1A1D] hover:border-[#E01B22]/50'
                  }`}
                aria-pressed={selectedCharacter === index}
              >
                <div className="w-10 h-10 rounded-full bg-black border border-[#2A1A1D] overflow-hidden shrink-0">
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate">{char.name}</div>
                  <div className="text-[9px] text-[#A79798] truncate">{char.tag}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Character Bio Card with Framer Motion AnimatePresence */}
          <AnimatePresence mode="wait">
            {(() => {
              const char = characters[selectedCharacter];
              return (
                <motion.div
                  key={char.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardFade}
                  className="p-6 bg-[#110508] border-2 border-[#FF2A2A] rounded-[2px] shadow-xl flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-black border-4 border-[#FF2A2A] overflow-hidden shrink-0 shadow-[0_0_25px_rgba(255,42,42,0.5)]">
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
                  </div>

                  <div className="flex-1 space-y-3 text-left">
                    <div>
                      <span className="px-2 py-0.5 bg-[#FF2A2A] text-white text-[9px] font-black uppercase tracking-wider rounded-[1px]">
                        {char.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider mt-1">
                        {char.name}
                      </h3>
                      <div className="text-xs text-[#FFD700] font-bold mt-0.5">
                        {char.role} &bull; <span className="text-[#A79798]">{char.status}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#080204] border-l-4 border-[#FF2A2A] rounded-[2px] shadow-inner">
                      <div className="text-[8.5px] text-[#FF5555] font-black tracking-widest uppercase">
                        // INTERCEPTED RADIO TRANSMISSION
                      </div>
                      <p className="text-xs sm:text-sm text-[#F0EBEB] italic font-sans leading-relaxed mt-0.5">
                        "{char.quote}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════════
            03. SECTION: 3-ACT MISSION BLUEPRINT (9 TACTICAL LEVELS)
           ═══════════════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="space-y-4"
        >
          <div className="border-b border-[#2A1A1D] pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF2A2A]" />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                3-ACT MISSION BLUEPRINT & LEVEL ARCHITECTURE
              </h2>
            </div>
            <span className="text-[10px] text-[#A79798] font-mono">9 LEVELS &bull; 1 MASTER VAULT</span>
          </div>

          <div className="space-y-4">
            {/* ACT 1 */}
            <div className="p-5 bg-[#140609] border-l-4 border-[#FF2A2A] border-y border-r border-[#2A1A1D] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#FF5555] uppercase tracking-wider">
                  ACT 1: BREACH DISCOVERY (Levels 1.1 – 1.3)
                </span>
                <span className="text-[9.5px] text-[#FFD700] font-bold">EAST COAST MALL SIEGE</span>
              </div>
              <p className="text-xs text-[#C8C2C2] font-sans">
                Saif's sleeper cells hijack the mall, trapping 1,200 civilians. Bypass biometric firedoors to allow Veera inside.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 font-sans text-xs">
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#FF5555]">Level 1.1: Intercepted CCTV Comms</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Decode Base64, ROT13, and string reversal to pinpoint terrorist locations.</span>
                </div>
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#FF5555]">Level 1.2: Fragmented Server Map</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Decode Decimal ASCII, Octal & Atbash to unlock firedoors.</span>
                </div>
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#FF5555]">Level 1.3: Time-Locked Vault</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Crack biometric auth with unique MD5 cryptographic signatures.</span>
                </div>
              </div>
            </div>

            {/* ACT 2 */}
            <div className="p-5 bg-[#140609] border-l-4 border-[#E01B22] border-y border-r border-[#2A1A1D] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#E01B22] uppercase tracking-wider">
                  ACT 2: INFILTRATION & MINISTERIAL TREASON (Levels 2.1 – 2.3)
                </span>
                <span className="text-[9.5px] text-[#3B82F6] font-bold">NEWS FEED HIJACK</span>
              </div>
              <p className="text-xs text-[#C8C2C2] font-sans">
                The corrupt Home Minister colludes with Saif and stages an execution on live TV. Expose the treason.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 font-sans text-xs">
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#E01B22]">Level 2.1: Corrupted Hash Trail</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Crack MD5, SHA-1, SHA-256 hashes to expose Swiss bank transfers.</span>
                </div>
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#E01B22]">Level 2.2: JWT Inception</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Reverse-engineer hex-encoded JWT tokens to hijack the live broadcast.</span>
                </div>
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#E01B22]">Level 2.3: Pattern Lock</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Calculate SHA-256 pattern locks to pose as militant negotiators.</span>
                </div>
              </div>
            </div>

            {/* ACT 3 */}
            <div className="p-5 bg-[#1A080C] border-l-4 border-[#FFD700] border-y border-r border-[#FFD700]/50 rounded-[2px] space-y-2 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#FFD700] uppercase tracking-wider">
                  ACT 3: THE FINAL STRIKE & PAKISTAN MASTER VAULT (Levels 3.1 – 3.3)
                </span>
                <span className="text-[9.5px] text-[#FF2A2A] font-bold">FINAL BOSS BATTLE</span>
              </div>
              <p className="text-xs text-[#C8C2C2] font-sans">
                Saif triggers a fail-deadly logic bomb. Veera chases Umar Farooq across the border into Pakistan!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 font-sans text-xs">
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#FFD700]">Level 3.1: Payload Quarantine</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Decode Binary + Hex + Base64 + ROT13 to open emergency exits.</span>
                </div>
                <div className="p-2.5 bg-[#0B0305] border border-[#2A1A1D] rounded">
                  <strong className="text-white block font-mono text-xs text-[#FFD700]">Level 3.2: Logic Bomb Defusal</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Disarm Saif's 5-layer nested logic bomb pipeline before detonation.</span>
                </div>
                <div className="p-2.5 bg-[#1C0A0E] border-2 border-[#FFD700] rounded">
                  <strong className="text-white block font-mono text-xs text-[#FFD700]">Level 3.3: PAKISTAN MASTER VAULT</strong>
                  <span className="text-[#A79798] text-[11px] block mt-0.5">Multi-stage gauntlet (Hex ➔ JWT ➔ ROT13 ➔ Coordinates ➔ 6-digit Key).</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════════
            04. SECTION: LIVE SECTOR BREACH TERMINAL (INTERACTIVE MINI-CHALLENGE)
           ═══════════════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="p-6 bg-[#0A0305] border-2 border-[#FF2A2A] rounded-[2px] space-y-5 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#2A1A1D] pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#FF2A2A]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                LIVE SECTOR BREACH TERMINAL // TEST YOUR READINESS
              </h2>
            </div>
            <span className="text-[9px] px-2 py-0.5 bg-[#FF2A2A] text-white font-bold rounded-[1px]">
              SANDBOX DEMO
            </span>
          </div>

          <div className="p-4 bg-[#140608] border border-[#2A1A1D] rounded space-y-1.5">
            <div className="text-[10px] text-[#FF5555] font-bold uppercase">
              &gt; INCOMING CIPHER PAYLOAD:
            </div>
            <div className="p-3 bg-black/80 border border-[#FF2A2A]/40 rounded text-center text-sm sm:text-base font-black text-[#FFD700] tracking-widest">
              {targetEncoded}
            </div>
            <div className="text-[11px] text-[#A79798] font-sans">
              Hint: Intercepted Base64 encoding. Decode the string above to prove your cipher clearance.
            </div>
          </div>

          <form onSubmit={handleSimulateDecrypt} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                placeholder="Enter decrypted plaintext (e.g. EXTRACTION)..."
                className="flex-1 px-4 py-3 bg-[#16080B] border border-[#2A1A1D] focus:border-[#FF2A2A] rounded-[2px] text-xs sm:text-sm text-white focus:outline-none uppercase font-mono tracking-wider"
                aria-label="Decrypted Plaintext Input"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-black text-xs uppercase tracking-wider rounded-[2px] transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF2A2A]"
              >
                SUBMIT BYPASS
              </button>
            </div>

            {simFeedback && (
              <div className={`p-3 rounded text-xs font-bold flex items-center gap-2 ${simSuccess
                  ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981]'
                  : 'bg-[#FF2A2A]/20 border border-[#FF2A2A] text-[#FF5555]'
                }`}>
                {simSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{simFeedback}</span>
              </div>
            )}
          </form>

          <div className="p-3.5 bg-[#120608] border border-[#2A1A1D] rounded space-y-1">
            <div className="text-xs font-bold text-[#FFD700] uppercase flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> OFFICIAL FLAG SYNTAX:
            </div>
            <code className="text-xs text-[#10B981] bg-black/70 px-2.5 py-1 rounded block mt-0.5">
              Format: LOGIN&#123;flag_string_here&#125;
            </code>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════════
            05. SECTION: EVENT COORDINATORS & SQUAD ENLISTMENT HUB
           ═══════════════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="space-y-4"
        >
          <div className="border-b border-[#2A1A1D] pb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FF2A2A]" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              EVENT COORDINATORS & DIRECT COMMS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Lead Coordinator: Tino Britty J */}
            <div className="p-6 bg-[#14080B] border-2 border-[#FF2A2A]/70 hover:border-[#FF2A2A] rounded-[2px] transition-all space-y-4 shadow-xl">
              <div>
                <div className="text-[10px] text-[#FF2A2A] font-bold uppercase tracking-widest">
                  EVENT LEAD COORDINATOR
                </div>
                <h3 className="text-2xl font-display font-black text-white mt-1">
                  Tino Britty J
                </h3>
                <p className="text-xs text-[#A79798] mt-0.5">
                  Lead Organizer // The Extraction CTF Quest
                </p>
              </div>

              {/* Direct Phone & WhatsApp */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:+919786350537"
                  className="px-3.5 py-2 bg-[#1C0D11] hover:bg-[#E01B22] text-white border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF2A2A]"
                  aria-label="Call Tino Britty J"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 97863 50537</span>
                </a>

                <a
                  href="https://wa.me/919786350537"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-black border border-[#10B981]/40 rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                  aria-label="WhatsApp Tino Britty J"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Direct Social & Portfolio Profiles */}
              <div className="pt-3 border-t border-[#2A1A1D] space-y-2">
                <div className="text-[10px] text-[#8C8283] font-bold uppercase tracking-wider">
                  DIRECT PROFILES:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="https://instagram.com/brittytino"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#1C080D] hover:bg-[#E1306C] text-[#E5DCDC] hover:text-white border border-[#2A1A1D] rounded flex items-center gap-1.5 transition-colors font-semibold"
                    aria-label="Tino Britty Instagram Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>brittytino</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/brittytino"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#1C080D] hover:bg-[#0077B5] text-[#E5DCDC] hover:text-white border border-[#2A1A1D] rounded flex items-center gap-1.5 transition-colors font-semibold"
                    aria-label="Tino Britty LinkedIn Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>brittytino</span>
                  </a>

                  <a
                    href="https://tinobritty.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#1C080D] hover:bg-[#10B981] text-[#E5DCDC] hover:text-black border border-[#2A1A1D] rounded flex items-center gap-1.5 transition-colors font-semibold"
                    aria-label="Tino Britty Personal Portfolio"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>tinobritty.me</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Coordinator 2: Srinithi J */}
            <div className="p-6 bg-[#14080B] border-2 border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] transition-all space-y-4 shadow-xl">
              <div>
                <div className="text-[10px] text-[#E01B22] font-bold uppercase tracking-widest">
                  EVENT COORDINATOR
                </div>
                <h3 className="text-2xl font-display font-black text-white mt-1">
                  Srinithi J
                </h3>
                <p className="text-xs text-[#A79798] mt-0.5">
                  Co-Organizer // The Extraction CTF Quest
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:+916369227481"
                  className="px-3.5 py-2 bg-[#1C0D11] hover:bg-[#E01B22] text-white border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF2A2A]"
                  aria-label="Call Srinithi J"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 63692 27481</span>
                </a>

                <a
                  href="https://wa.me/916369227481"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-black border border-[#10B981]/40 rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                  aria-label="WhatsApp Srinithi J"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="pt-4 border-t border-[#2A1A1D] text-xs text-[#8C8283] font-sans">
                Reach out for event schedule clarifications, team registration assistance, and venue access guidelines.
              </div>
            </div>

          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════════════════════════
            06. FINAL CALL TO ACTION: SQUAD ENLISTMENT
           ═══════════════════════════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionVariants}
          className="p-8 sm:p-10 bg-gradient-to-r from-[#240A0F] via-[#150608] to-[#240A0F] border-2 border-[#FF2A2A] rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(224,27,34,0.4)]"
        >
          <div className="text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider">
              READY TO ENTER THE EXTRACTION?
            </h2>
            <p className="text-xs text-[#C8B8B8] font-sans">
              ₹100 All-Inclusive Symposium Pass &bull; Solo or Duo Teams &bull; ₹13,000 Total Prize Pool (1st: ₹8,000 | 2nd: ₹5,000)
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleActionClick}
              className="px-8 py-4 bg-[#FF2A2A] hover:bg-[#FF4545] text-white text-xs font-black uppercase tracking-wider rounded-[2px] transition-all shadow-[0_0_25px_rgba(255,42,42,0.8)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FF2A2A]"
            >
              REGISTER SQUAD NOW &rarr;
            </button>
          </div>
        </motion.section>

      </main>

    </div>
  );
};

export default TheExtractionPage;
