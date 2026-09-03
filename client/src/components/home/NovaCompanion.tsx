import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight,
  HelpCircle,
  Zap,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { soundFx } from '../../utils/audioFx';

interface NovaCompanionProps {
  className?: string;
}

type StepType = 'intercept' | 'inquiry' | 'explain' | 'extraction' | 'register_info';

export const NovaCompanion: React.FC<NovaCompanionProps> = ({ 
  className = '' 
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepType>('intercept');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted());

  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    soundFx.initMuteState();
    setIsMuted(soundFx.isMuted());
  }, []);

  const getStepContent = (currentStep: StepType) => {
    switch (currentStep) {
      case 'intercept':
        return {
          tag: '// UNIDENTIFIED SIGNAL DETECTED',
          message: "You don't look like the others. Before you enter LOGIN 2K26, I need to know something.",
          prompt: '> CONTINUE?',
          buttonText: 'CONTINUE',
        };
      case 'inquiry':
        return {
          tag: '// COMPANION GUIDANCE DIRECTIVE',
          message: 'Welcome, operative. Select a directive below to guide your experience in LOGIN 2K26:',
          prompt: '> CHOOSE YOUR DIRECTIVE:',
          buttonText: '',
        };
      case 'explain':
        return {
          tag: '// SYMPOSIUM BRIEFING ARCHITECTURE',
          message: 'LOGIN 2K26 is PSG Tech’s 35th Edition National Technical Symposium on September 18 & 19, 2026. Featuring 11 technical & non-technical arenas with over ₹50,000 in bounties.',
          prompt: '> ACTION DIRECTIVE:',
          buttonText: 'EXPLORE ALL 11 ARENAS',
        };
      case 'extraction':
        return {
          tag: '// CLASSIFIED OVERRIDE: THE EXTRACTION',
          message: 'ANOMALY CONFIRMED: High-Value Survivor. Security clearance Level-5 authorized.\n\n"Everyone came here to compete. You came here to be extracted."',
          prompt: '> INITIATE CLASSIFIED ARENA:',
          buttonText: 'ENTER THE EXTRACTION',
        };
      case 'register_info':
        return {
          tag: '// ENLISTMENT PROTOCOL READY',
          message: 'Registrations are active for solo and squad participants across colleges nationwide. Secure your slot to compete for symposium glory.',
          prompt: '> PROCEED TO PORTAL:',
          buttonText: 'OPEN REGISTRATION PORTAL',
        };
    }
  };

  const currentContent = getStepContent(step);

  // Typewriter effect (smooth and steady, no jitter)
  useEffect(() => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const fullText = currentContent.message;

    soundFx.ping();

    const typeNextChar = () => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        if (i % 4 === 0) {
          soundFx.type();
        }
        i++;
        typewriterTimeoutRef.current = setTimeout(typeNextChar, 14);
      } else {
        setIsTyping(false);
      }
    };

    typewriterTimeoutRef.current = setTimeout(typeNextChar, 40);

    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [step]);

  const handleAdvance = () => {
    soundFx.click();

    if (step === 'intercept') {
      setStep('inquiry');
    } else if (step === 'explain') {
      navigate('/events');
    } else if (step === 'extraction') {
      soundFx.reveal();
      navigate('/events/the-extraction');
    } else if (step === 'register_info') {
      navigate('/register');
    }
  };

  const handleSelectOption = (nextStep: StepType) => {
    soundFx.click();
    setStep(nextStep);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.click();
    setStep('intercept');
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className={`relative select-none ${className}`}>
      
      {/* ── EXACT SCI-FI HUD COMPANION FRAME (Matches User Reference Image) ── */}
      <div className="relative w-[340px] sm:w-[360px] text-left">
        
        {/* Background Red Concentric Circles radiating behind Top-Left Orb */}
        <div className="absolute -top-8 -left-8 w-44 h-44 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 160 160" fill="none">
            <circle cx="65" cy="65" r="48" stroke="#E01B22" strokeWidth="1" strokeDasharray="4 4" opacity="0.45" />
            <circle cx="45" cy="75" r="62" stroke="#E01B22" strokeWidth="1" opacity="0.3" />
            <circle cx="35" cy="85" r="78" stroke="#E01B22" strokeWidth="0.8" opacity="0.2" />
          </svg>
        </div>

        {/* ── TOP-LEFT METALLIC SPHERE (Stationary, Clean, with glowing red eye) ── */}
        <div className="absolute -top-12 -left-6 w-32 h-32 sm:w-36 sm:h-36 z-30 pointer-events-none">
          {/* Subtle Ambient Red Core Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[radial-gradient(circle,_rgba(224,27,34,0.4)_0%,_transparent_70%)] pointer-events-none" />
          
          <img 
            src="/assets/hero_vector_transparent.webp" 
            alt="NØVA-26 System Companion"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(224,27,34,0.8)]"
            loading="eager"
          />
        </div>

        {/* ── THE POLYGONAL CYBER HUD BOX CONTAINER ── */}
        <div className="relative z-10 pt-4">
          
          {/* SVG Frame Overlay for Exact Chamfered Cyber Geometry */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_25px_rgba(224,27,34,0.3)]"
            viewBox="0 0 360 490"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Dark Translucent Glass Fill Polygon */}
            <polygon 
              points="140,20 330,20 354,44 354,435 328,465 45,465 16,435 16,130 140,20"
              fill="#0D0407"
              fillOpacity="0.94"
            />

            {/* Main Cyber Red Outline Frame */}
            <polygon 
              points="140,20 330,20 354,44 354,435 328,465 45,465 16,435 16,130 140,20"
              stroke="#E01B22"
              strokeWidth="1.6"
              strokeOpacity="0.8"
            />

            {/* Inner Accent Line */}
            <polygon 
              points="144,26 326,26 348,48 348,430 324,458 50,458 22,430 22,134 144,26"
              stroke="#E01B22"
              strokeWidth="0.8"
              strokeOpacity="0.25"
            />

            {/* Bold Left Edge Notch */}
            <line x1="16" y1="165" x2="16" y2="235" stroke="#FF2A2A" strokeWidth="4.5" strokeLinecap="square" />

            {/* Top-Right Decorative Tick */}
            <line x1="315" y1="20" x2="330" y2="20" stroke="#FF2A2A" strokeWidth="3" />

            {/* Bottom-Right Outer Bracket Accent */}
            <path 
              d="M344 415 L358 430 L358 440 L335 470 L315 470" 
              stroke="#FF2A2A" 
              strokeWidth="2" 
              fill="none" 
            />

            {/* Horizontal Separator Line below Orb & Header */}
            <line x1="24" y1="140" x2="346" y2="140" stroke="#E01B22" strokeWidth="1" strokeOpacity="0.4" />
          </svg>

          {/* ── CARD CONTENT (Aligned with image geometry) ── */}
          <div className="relative p-6 sm:p-7 min-h-[480px] flex flex-col justify-between">
            
            {/* Top Section: Header beside the Orb */}
            <div className="h-[90px] flex items-start justify-end pl-28 pt-1">
              <div className="flex items-start justify-between w-full">
                <div>
                  <div className="font-mono text-sm sm:text-base font-black text-[#F7F2F2] tracking-[0.15em] flex items-center gap-1.5 uppercase">
                    <span className="text-[#FF2A2A]">NØVA-26</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#A79798] tracking-[0.25em] uppercase font-bold mt-0.5">
                    SYSTEM COMPANION
                  </div>
                </div>

                {/* Audio and Reset Controls */}
                <div className="flex items-center gap-1 z-20">
                  <button 
                    onClick={toggleSound}
                    className="p-1 text-[#A79798] hover:text-[#F7F2F2] hover:bg-[#2A1A1D]/60 rounded transition-colors"
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#E01B22]" />}
                  </button>
                  {step !== 'intercept' && (
                    <button 
                      onClick={handleReset}
                      className="p-1 text-[#A79798] hover:text-[#F7F2F2] hover:bg-[#2A1A1D]/60 rounded transition-colors"
                      title="Reset Transmission"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Section: Dialogue & Directives */}
            <div className="flex-1 flex flex-col justify-start pt-6 space-y-4">
              
              {/* Section Tag */}
              <div className="font-mono text-[10px] text-[#FF2A2A] font-bold tracking-wider flex items-center gap-1.5">
                <span>{currentContent.tag}</span>
              </div>

              {/* Dynamic Text Body */}
              <div className="min-h-[84px] font-mono text-xs sm:text-[13px] text-[#E5E0E0] leading-relaxed">
                {step === 'intercept' ? (
                  <div className="space-y-1">
                    <p>You don’t look like the others.</p>
                    <p>Before you enter <strong className="text-white font-bold tracking-wider">LOGIN 2K26</strong>,</p>
                    <p>I need to know something.</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-3.5 bg-[#E01B22] ml-1 animate-pulse align-middle" />}
                  </p>
                )}
              </div>

              {/* Interactive Inquiries / Directives */}
              {step === 'inquiry' ? (
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="text-[9.5px] text-[#FF2A2A] font-bold tracking-wider mb-2">
                    {currentContent.prompt}
                  </div>

                  <button
                    onClick={() => handleSelectOption('explain')}
                    className="w-full py-2.5 px-3 bg-[#17090C] hover:bg-[#2A1116] border border-[#E01B22]/40 hover:border-[#E01B22] rounded-[2px] text-left text-[#F0EBEB] flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#E01B22]" />
                      <span className="text-[11px] font-semibold">How does LOGIN 2K26 work?</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#A79798] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelectOption('extraction')}
                    className="w-full py-2.5 px-3 bg-[#200A0E] hover:bg-[#340F16] border border-[#FF2A2A]/70 hover:border-[#FF2A2A] rounded-[2px] text-left text-white flex items-center justify-between group transition-all shadow-[0_0_12px_rgba(255,42,42,0.25)]"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span className="text-[11px] font-bold text-[#FF5555]">Unlock Flagship Arena (The Extraction)</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelectOption('register_info')}
                    className="w-full py-2.5 px-3 bg-[#17090C] hover:bg-[#2A1116] border border-[#E01B22]/40 hover:border-[#E01B22] rounded-[2px] text-left text-[#F0EBEB] flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span className="text-[11px] font-semibold">Registration & Squad Enlistment</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#A79798] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {/* Prompt Text */}
                  <div className="font-mono text-[10px] text-[#FF2A2A] font-bold tracking-wider">
                    {currentContent.prompt}
                  </div>

                  {/* Primary Continue Button (Matches image design) */}
                  <button
                    onClick={handleAdvance}
                    disabled={isTyping && step !== 'intercept'}
                    className={`
                      w-full py-3 px-4 rounded-[2px] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200
                      flex items-center justify-center gap-2 group/btn shadow-[0_0_18px_rgba(224,27,34,0.4)]
                      ${step === 'extraction'
                        ? 'bg-[#FF2A2A] hover:bg-[#FF4545] text-white shadow-[0_0_25px_rgba(255,42,42,0.7)]'
                        : 'bg-[#7A1216] hover:bg-[#9E171D] text-[#F7F2F2] hover:shadow-[0_0_22px_rgba(224,27,34,0.6)]'
                      }
                      ${isTyping && step !== 'intercept' ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span>{currentContent.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  {/* Back to Inquiry option if in sub-step */}
                  {step !== 'intercept' && (
                    <button
                      onClick={() => setStep('inquiry')}
                      className="w-full py-1.5 text-center text-[#A79798] hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3 text-[#E01B22]" />
                      <span>Ask Another Directive</span>
                    </button>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Footer: Protocol Active and 5 Red Status Dots */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2A1A1D]/60 font-mono text-[9px] text-[#8C8283] mt-2">
              <span className="tracking-widest uppercase font-bold text-[#8C8283]">
                PROTOCOL ACTIVE
              </span>
              
              {/* 5 Red Glowing Dots Matching Image */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A2A] shadow-[0_0_8px_#FF2A2A]" />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NovaCompanion;
