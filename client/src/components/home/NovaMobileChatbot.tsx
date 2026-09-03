import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  Zap,
  UserCheck,
  HelpCircle,
  Radio
} from 'lucide-react';
import { soundFx } from '../../utils/audioFx';
import { useUIStore } from '../../store/uiStore';

interface NovaMobileChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

type StepType = 'intercept' | 'inquiry' | 'explain' | 'extraction' | 'register_info';

interface ChatMessage {
  id: string;
  sender: 'nova' | 'user';
  text: string;
  tag?: string;
}

export const NovaMobileChatbot: React.FC<NovaMobileChatbotProps> = ({
  isOpen: propIsOpen,
  onToggle: propOnToggle,
  onClose: propOnClose,
}) => {
  const navigate = useNavigate();
  const { 
    isMobileCompanionOpen: storeIsOpen, 
    toggleMobileCompanion: storeToggle, 
    closeMobileCompanion: storeClose 
  } = useUIStore();

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onToggle = propOnToggle || storeToggle;
  const onClose = propOnClose || storeClose;

  const [step, setStep] = useState<StepType>('intercept');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted());
  const [isScrolledPastHero, setIsScrolledPastHero] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>("Tap for Secret Mission!");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection: Spider-Man appears from navbar after scrolling past Hero Section
  useEffect(() => {
    const handleScroll = () => {
      const threshold = Math.min(window.innerHeight * 0.35, 200);
      setIsScrolledPastHero(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle speech bubble hints
  useEffect(() => {
    const hints = [
      "Tap for Secret Mission!",
      "Unlock The Extraction!",
      "NØVA-26 Signal Detected",
      "Need event briefing?",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % hints.length;
      setSpeechBubbleText(hints[idx]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    soundFx.initMuteState();
    setIsMuted(soundFx.isMuted());
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'nova',
          text: "You don't look like the others. Before you enter LOGIN 2K26, I need to know something.",
          tag: '// UNIDENTIFIED SIGNAL DETECTED',
        },
      ]);
    }
  }, []);

  const pushNovaMessage = (text: string, tag: string) => {
    setIsTyping(true);
    soundFx.ping();

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'nova',
          text,
          tag,
        },
      ]);
      setIsTyping(false);
      soundFx.type();
    }, 300);
  };

  const handleAdvance = () => {
    soundFx.click();

    if (step === 'intercept') {
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'user', text: 'CONTINUE' },
      ]);
      setStep('inquiry');
      setTimeout(() => {
        pushNovaMessage(
          'Select your directive below to calibrate your LOGIN 2K26 experience:',
          '// SYSTEM TELEMETRY & GUIDANCE'
        );
      }, 200);
    } else if (step === 'explain') {
      onClose();
      navigate('/events');
    } else if (step === 'extraction') {
      soundFx.reveal();
      onClose();
      navigate('/events/the-extraction');
    } else if (step === 'register_info') {
      onClose();
      navigate('/register');
    }
  };

  const handleSelectOption = (nextStep: StepType, label: string) => {
    soundFx.click();
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: label },
    ]);
    setStep(nextStep);

    if (nextStep === 'explain') {
      setTimeout(() => {
        pushNovaMessage(
          'LOGIN 2K26 is PSG Tech’s 35th Edition National Technical Symposium on September 18 & 19, 2026. Featuring 11 technical & non-technical arenas with over ₹50,000 in bounties.',
          '// SYMPOSIUM BRIEFING ARCHITECTURE'
        );
      }, 200);
    } else if (nextStep === 'extraction') {
      setTimeout(() => {
        soundFx.reveal();
        pushNovaMessage(
          'ANOMALY CONFIRMED: High-Value Survivor. Security clearance Level-5 authorized.\n\n"Everyone came here to compete. You came here to be extracted."',
          '// CLASSIFIED OVERRIDE: THE EXTRACTION'
        );
      }, 200);
    } else if (nextStep === 'register_info') {
      setTimeout(() => {
        pushNovaMessage(
          'Registrations are active for solo and squad participants across colleges nationwide. Secure your slot to compete for symposium glory.',
          '// ENLISTMENT PROTOCOL READY'
        );
      }, 200);
    }
  };

  const handleReset = () => {
    soundFx.click();
    setStep('intercept');
    setMessages([
      {
        id: Math.random().toString(),
        sender: 'nova',
        text: "You don't look like the others. Before you enter LOGIN 2K26, I need to know something.",
        tag: '// UNIDENTIFIED SIGNAL DETECTED',
      },
    ]);
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* ── SPIDER-MAN HANGING FROM TOP-LEFT NAVBAR (Mobile Only, Appears on Scroll) ── */}
      <AnimatePresence>
        {isScrolledPastHero && !isOpen && (
          <motion.div
            initial={{ y: -220, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { 
                type: 'spring', 
                damping: 14, 
                stiffness: 110,
                mass: 0.8
              } 
            }}
            exit={{ 
              y: -240, 
              opacity: 0,
              transition: { duration: 0.25, ease: 'easeIn' }
            }}
            className="fixed top-12 sm:top-14 left-2 sm:left-4 z-40 xl:hidden select-none pointer-events-auto flex items-start gap-2"
          >
            {/* Hanging Spider-Man with Pendulum Web Swing */}
            <motion.div
              onClick={() => {
                soundFx.click();
                onToggle();
              }}
              whileTap={{ scale: 0.9, y: 8 }}
              animate={{ 
                rotate: [-2, 2, -2],
                transition: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
              style={{ transformOrigin: 'top center' }}
              className="cursor-pointer relative group flex flex-col items-center"
              title="Click to open NØVA-26 Companion"
            >
              {/* Glowing Spider-Sense Ambient Flare */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[radial-gradient(circle,_rgba(224,27,34,0.45)_0%,_transparent_70%)] pointer-events-none animate-pulse" />

              {/* Spider-Man Asset */}
              <img 
                src="/assets/spiderman.webp"
                alt="Spider-Man Companion Trigger" 
                className="w-14 sm:w-16 h-auto object-contain filter drop-shadow-[0_4px_16px_rgba(224,27,34,0.85)]"
                loading="eager"
              />

              {/* Red Radar Beacon Pulse at Spider-Man's head */}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E01B22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2A2A] shadow-[0_0_8px_#FF2A2A]"></span>
              </span>
            </motion.div>

            {/* Interactive Speech Bubble Prompt */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                soundFx.click();
                onToggle();
              }}
              className="cursor-pointer mt-12 bg-[#14070A]/95 border border-[#E01B22]/70 rounded-[4px] px-2.5 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1.5 max-w-[155px]"
            >
              <Radio className="w-3 h-3 text-[#FF2A2A] animate-pulse shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[7.5px] font-black text-[#FF5555] tracking-wider uppercase leading-none">
                  NØVA-26
                </span>
                <span className="font-mono text-[9.5px] font-bold text-[#F7F2F2] leading-tight mt-0.5">
                  {speechBubbleText}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANDABLE COMPANION DRAWER MODAL ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          
          {/* Backdrop Tap to close */}
          <div className="flex-1" onClick={onClose} />

          {/* Container */}
          <div className="w-full max-h-[85vh] h-[520px] bg-[#0E0608] border-t-2 border-[#E01B22] rounded-t-xl flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Top Header */}
            <div className="px-4 py-3 bg-[#16080B] border-b border-[#2A1A1D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-black border border-[#E01B22]/70 p-0.5 flex items-center justify-center overflow-hidden">
                  <img src="/assets/spiderman.webp" alt="Spider-Man" className="w-7 h-auto object-contain" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-[#F7F2F2] tracking-wider uppercase">
                    NØVA-26
                  </div>
                  <div className="font-mono text-[8px] text-[#A79798] tracking-widest uppercase">
                    SYSTEM COMPANION
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleSound}
                  className="p-1.5 text-[#A79798] hover:text-white bg-[#2A1A1D]/60 rounded"
                  aria-label="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#E01B22]" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-[#A79798] hover:text-white bg-[#2A1A1D]/60 rounded"
                  aria-label="Restart Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#A79798] hover:text-white bg-[#2A1A1D]/60 rounded"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.sender === 'nova' && msg.tag && (
                    <span className="font-mono text-[8.5px] text-[#FF2A2A] font-bold tracking-wider mb-1">
                      {msg.tag}
                    </span>
                  )}

                  <div
                    className={`
                      max-w-[88%] rounded-[2px] p-3 font-mono text-xs leading-relaxed
                      ${msg.sender === 'user'
                        ? 'bg-[#E01B22] text-[#F7F2F2] font-semibold'
                        : 'bg-[#180E10] border border-[#2A1A1D] text-[#ECE7E7]'
                      }
                    `}
                  >
                    <span className="whitespace-pre-line">{msg.text}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-[#E01B22] font-mono py-1">
                  <span className="text-[10px] text-[#A79798]">NØVA-26 analyzing...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Interactive Directive Control Area */}
            <div className="p-3.5 bg-[#120709] border-t border-[#2A1A1D] space-y-2">
              {step === 'inquiry' ? (
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="text-[9px] text-[#FF2A2A] font-bold tracking-wider mb-1">
                    &gt; SELECT DIRECTIVE:
                  </div>

                  <button
                    onClick={() => handleSelectOption('extraction', 'Unlock Classified Operation (The Extraction)')}
                    className="w-full py-2.5 px-3 bg-[#240C10] border border-[#FF2A2A]/80 rounded-[2px] text-left text-white flex items-center justify-between shadow-[0_0_15px_rgba(255,42,42,0.3)]"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span className="text-[11px] font-bold text-[#FF5555]">Unlock The Extraction (Flagship CTF)</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </button>

                  <button
                    onClick={() => handleSelectOption('explain', 'How does LOGIN 2K26 work?')}
                    className="w-full py-2 px-3 bg-[#1A0D10] border border-[#E01B22]/40 rounded-[2px] text-left text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#E01B22]" />
                      <span className="text-[11px]">How does LOGIN 2K26 work?</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#A79798]" />
                  </button>

                  <button
                    onClick={() => handleSelectOption('register_info', 'Registration & Squad Enlistment')}
                    className="w-full py-2 px-3 bg-[#1A0D10] border border-[#E01B22]/40 rounded-[2px] text-left text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span className="text-[11px]">Registration Guidance</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#A79798]" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={handleAdvance}
                    disabled={isTyping}
                    className={`
                      w-full py-3 px-4 rounded-[2px] font-mono text-xs font-bold uppercase tracking-wider transition-all
                      flex items-center justify-center gap-2
                      ${step === 'extraction'
                        ? 'bg-[#FF2A2A] text-white shadow-[0_0_20px_rgba(255,42,42,0.6)]'
                        : 'bg-[#7A1216] hover:bg-[#9E171D] text-[#F7F2F2]'
                      }
                      ${isTyping ? 'opacity-50 pointer-events-none' : ''}
                    `}
                  >
                    <span>
                      {step === 'intercept'
                        ? 'CONTINUE'
                        : step === 'explain'
                        ? 'EXPLORE ALL 11 ARENAS'
                        : step === 'extraction'
                        ? 'ENTER THE EXTRACTION'
                        : 'OPEN REGISTRATION PORTAL'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {step !== 'intercept' && (
                    <button
                      onClick={() => setStep('inquiry')}
                      className="w-full py-1 text-center text-[#A79798] hover:text-white font-mono text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3 text-[#E01B22]" />
                      <span>Ask Another Directive</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default NovaMobileChatbot;
