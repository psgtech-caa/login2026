import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Zap, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  CheckCircle2, 
  Cpu, 
  Phone, 
  MessageSquare,
  Trophy,
  Terminal,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { soundFx } from '../utils/audioFx';

export const TheExtractionPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    soundFx.reveal();
  }, []);

  const handleActionClick = () => {
    soundFx.click();
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/dashboard/events');
    }
  };

  const handleScrollToDetails = () => {
    soundFx.click();
    const el = document.getElementById('extraction-briefing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070405] text-[#F7F2F2] overflow-x-hidden selection:bg-[#E01B22] selection:text-white">
      
      {/* ── FIXED TOP NAVIGATION BREADCRUMB ── */}
      <div className="sticky top-0 z-40 bg-[#0E0608]/90 backdrop-blur-md border-b border-[#2A1A1D] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono text-xs">
          <button
            onClick={() => {
              soundFx.click();
              navigate('/');
            }}
            className="inline-flex items-center gap-2 text-[#A79798] hover:text-[#E01B22] font-bold uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HQ</span>
          </button>
          
          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
            <Link to="/events" className="text-[#8C8283] hover:text-white uppercase transition-colors">
              EVENTS
            </Link>
            <span className="text-[#E01B22]">/</span>
            <span className="text-[#FF5555] font-bold tracking-wider uppercase">
              THE EXTRACTION
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          01. FULL HERO SECTION (Cinematic Fixed Layout Landing)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92dvh] flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
        
        {/* Ambient Aura Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] bg-[radial-gradient(ellipse_at_center,_rgba(224,27,34,0.18)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14090c_1px,transparent_1px),linear-gradient(to_bottom,#14090c_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070405]/50 to-[#070405] pointer-events-none z-0" />

        {/* ── Top Clearance & Category Tag ── */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#1C090D] border border-[#E01B22] text-[#FF5555] rounded-[2px] font-mono font-bold text-[10px] sm:text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(224,27,34,0.35)]">
            <span className="w-2 h-2 rounded-full bg-[#FF2A2A] animate-ping" />
            <span>GUARDIAN: BLACKOUT-9 // OPERATION ACTIVE</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-[#A79798] tracking-widest uppercase font-semibold">
            <span className="text-[#E01B22] font-bold">TECHNICAL ARENA</span>
            <span>&bull;</span>
            <span className="text-white font-bold">DAY 02 &bull; 19 SEP 2026</span>
          </div>
        </div>

        {/* ── Center Banner Poster Image ── */}
        <div className="relative z-10 w-full max-w-4xl my-auto py-4">
          <div className="relative rounded-[4px] overflow-hidden border-2 border-[#E01B22]/80 shadow-[0_0_50px_rgba(224,27,34,0.35)] group transition-all duration-500 hover:border-[#FF2A2A] hover:shadow-[0_0_70px_rgba(224,27,34,0.5)]">
            {/* Poster Image */}
            <img 
              src="/assets/events/extraction_hero.png" 
              alt="The Extraction CTF Quest Banner" 
              className="w-full h-auto object-cover object-center"
              loading="eager"
            />
            
            {/* Tech Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF2A2A]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF2A2A]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF2A2A]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF2A2A]" />
          </div>
        </div>

        {/* ── Bottom Hero Call-to-Action & Quick Metric Bar ── */}
        <div className="relative z-10 w-full max-w-4xl space-y-5">
          
          {/* Tagline Quote */}
          <p className="font-mono text-xs sm:text-sm text-[#E5E0E0] italic font-semibold tracking-wide">
            "Operation BLACKOUT is active. Breach the vault and extract the payload."
          </p>

          {/* Key Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs text-left">
            <div className="p-3 bg-[#11070A] border border-[#2A1A1D] rounded-[2px] flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#E01B22] shrink-0" />
              <div>
                <div className="text-[9px] text-[#8C8283] uppercase">FORMAT</div>
                <div className="font-bold text-[#F7F2F2]">1-2 Members</div>
              </div>
            </div>

            <div className="p-3 bg-[#11070A] border border-[#2A1A1D] rounded-[2px] flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#E01B22] shrink-0" />
              <div>
                <div className="text-[9px] text-[#8C8283] uppercase">VENUE</div>
                <div className="font-bold text-[#F7F2F2]">CAT Lab</div>
              </div>
            </div>

            <div className="p-3 bg-[#11070A] border border-[#2A1A1D] rounded-[2px] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#E01B22] shrink-0" />
              <div>
                <div className="text-[9px] text-[#8C8283] uppercase">TIMING</div>
                <div className="font-bold text-[#F7F2F2]">09:30 AM</div>
              </div>
            </div>

            <div className="p-3 bg-[#11070A] border border-[#2A1A1D] rounded-[2px] flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-[#10B981] shrink-0" />
              <div>
                <div className="text-[9px] text-[#8C8283] uppercase">ENTRY FEE</div>
                <div className="font-bold text-[#10B981]">INCLUDED (₹100)</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <button
              onClick={handleActionClick}
              className="shimmer-btn w-full sm:w-auto px-8 py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-[0_0_25px_rgba(224,27,34,0.6)] flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{isAuthenticated ? 'GO TO EVENT CONTROL DASHBOARD' : 'REGISTER & ENLIST SQUAD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleScrollToDetails}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#170C0F] hover:bg-[#251216] border border-[#2A1A1D] hover:border-[#E01B22] text-[#A79798] hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              ARENA SPECIFICATIONS & BRIEFING &darr;
            </button>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pt-6 pb-2 text-[9px] font-mono tracking-[0.25em] text-[#8C8283]/70 uppercase select-none flex items-center gap-1.5">
          <span>SCROLL FOR FULL DOSSIER</span>
          <span className="text-[#E01B22] animate-bounce">&darr;</span>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          02. DETAILED LANDING CONTENT SECTIONS (Below Scroll)
         ═══════════════════════════════════════════════════════════════════ */}
      <div id="extraction-briefing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* ── SECTION 1: ARENA SPECIFICATIONS & BRIEFING ── */}
        <section className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#E01B22]" />
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#F7F2F2] tracking-wider uppercase">
              ARENA SPECIFICATIONS & BRIEFING
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Detailed Overview & Skills */}
            <div className="lg:col-span-7 bg-[#110709] border border-[#2A1A1D] rounded-[2px] p-6 space-y-6">
              <div>
                <h3 className="font-mono text-xs font-bold text-[#E01B22] uppercase tracking-wider mb-2">
                  // MISSION OVERVIEW
                </h3>
                <p className="font-mono text-xs sm:text-[13px] text-[#D8D2D2] leading-relaxed">
                  The <strong className="text-white font-bold">EXTRACTION</strong> is a story-driven cybersecurity CTF where teams tackle cryptographic, authentication, and forensic challenges to stop Operation BLACKOUT under intense time pressure.
                </p>
              </div>

              {/* Core Skills & Criteria */}
              <div className="pt-2 border-t border-[#2A1A1D] space-y-3">
                <h4 className="font-mono text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">
                  CORE SKILLS & EVALUATION CRITERIA:
                </h4>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  {[
                    'Cybersecurity',
                    'Cryptography',
                    'Encoding',
                    'Logical Thinking',
                  ].map((skill) => (
                    <div 
                      key={skill}
                      className="p-3 bg-[#1A0E11] border border-[#2A1A1D] rounded-[2px] flex items-center gap-2 text-[#F7F2F2]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="font-semibold">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Console Briefing / Tactical HUD */}
            <div className="lg:col-span-5 bg-[#14080B] border-2 border-[#E01B22]/60 rounded-[2px] p-6 space-y-4 shadow-xl relative">
              <div className="flex items-center justify-between border-b border-[#2A1A1D] pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#FF2A2A]" />
                  <span className="font-mono text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">
                    CONSOLE BRIEFING
                  </span>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 bg-[#E01B22]/20 border border-[#E01B22]/40 text-[#FF5555] font-bold rounded-[1px]">
                  TACTICAL HUD
                </span>
              </div>

              <div className="p-4 bg-[#0A0406] border border-[#2A1A1D] rounded-[2px] font-mono text-xs text-[#E5E0E0] leading-relaxed italic space-y-2">
                <p className="text-[#FF5555] font-bold not-italic">
                  &gt; GUARDIAN DISPATCH // BLACKOUT-9:
                </p>
                <p>
                  "I am BLACKOUT-9. Engage in a story-driven cybersecurity CTF. Overcome cryptography, authentication bypasses, and digital forensics to neutralize the threat."
                </p>
              </div>

              <div className="pt-2">
                <div className="p-3 bg-[#1C0C10] border border-[#2A1A1D] rounded-[2px] font-mono text-[11px] text-[#A79798] space-y-1">
                  <div className="text-[#E01B22] font-bold uppercase tracking-wider text-[10px]">
                    FLAG SUBMISSION SYNTAX
                  </div>
                  <div>Format: <span className="text-white font-bold">LOGIN&#123;flag_string_here&#125;</span></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 2: PRIZE POOL & PASS STRUCTURE ── */}
        <section className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFD700]" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#F7F2F2] tracking-wider uppercase">
                PRIZE POOL BOUNTIES
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-[#FFD700] uppercase tracking-wider">
              DAY 02 FLAGSHIP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            {/* 1st Prize */}
            <div className="p-6 bg-[#160A0D] border-2 border-[#FFD700] rounded-[2px] text-center space-y-2 shadow-[0_0_25px_rgba(255,215,0,0.15)] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#FFD700] text-black text-[9.5px] font-black uppercase rounded-[1px]">
                1ST PRIZE
              </span>
              <div className="text-4xl font-display font-black text-[#FFD700] pt-2">
                ₹8,000
              </div>
              <div className="text-xs font-bold text-[#F7F2F2]">
                CHAMPIONSHIP TROVE
              </div>
              <p className="text-[11px] text-[#A79798]">
                Cash Prize + Elite Certificate of Supreme Dominance
              </p>
            </div>

            {/* 2nd Prize */}
            <div className="p-6 bg-[#160A0D] border border-[#C0C0C0]/70 rounded-[2px] text-center space-y-2 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#C0C0C0] text-black text-[9.5px] font-black uppercase rounded-[1px]">
                2ND PRIZE
              </span>
              <div className="text-4xl font-display font-black text-[#C0C0C0] pt-2">
                ₹5,000
              </div>
              <div className="text-xs font-bold text-[#F7F2F2]">
                RUNNER-UP SHIELD
              </div>
              <p className="text-[11px] text-[#A79798]">
                Cash Reward + Certificate of Distinction
              </p>
            </div>

            {/* 3rd Prize */}
            <div className="p-6 bg-[#160A0D] border border-[#CD7F32]/70 rounded-[2px] text-center space-y-2 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#CD7F32] text-black text-[9.5px] font-black uppercase rounded-[1px]">
                3RD PRIZE
              </span>
              <div className="text-4xl font-display font-black text-[#CD7F32] pt-2">
                ₹3,000
              </div>
              <div className="text-xs font-bold text-[#F7F2F2]">
                SENTINEL AWARD
              </div>
              <p className="text-[11px] text-[#A79798]">
                Cash Reward + Certificate of Merit
              </p>
            </div>
          </div>

          {/* One-time pass info */}
          <div className="p-4 bg-[#11070A] border border-[#2A1A1D] rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <Ticket className="w-5 h-5 text-[#10B981]" />
              <span className="text-[#E5E0E0]">
                Registration Fee: <strong className="text-white">₹100 One-Time Pass</strong> (Grants access to all events & lunch included on Day 2).
              </span>
            </div>
            <button
              onClick={handleActionClick}
              className="px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-bold uppercase rounded-[2px] text-xs transition-colors shrink-0"
            >
              ENLIST SQUAD NOW &rarr;
            </button>
          </div>
        </section>

        {/* ── SECTION 3: GENERAL RULES & ENTRY PROTOCOLS ── */}
        <section className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E01B22]" />
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#F7F2F2] tracking-wider uppercase">
              GENERAL RULES & ENTRY
            </h2>
          </div>

          <div className="p-6 bg-[#110709] border border-[#2A1A1D] rounded-[2px] space-y-4 font-mono text-xs sm:text-[13px] leading-relaxed">
            <ul className="space-y-3 text-[#D8D2D2]">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E01B22] mt-1.5 shrink-0" />
                <span>Bring valid <strong className="text-white">College Student ID Card</strong> to enter PSG Tech campus.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E01B22] mt-1.5 shrink-0" />
                <span>Arrive <strong className="text-white">15 minutes prior</strong> to start time at designated venue (CAT Lab).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E01B22] mt-1.5 shrink-0" />
                <span><strong className="text-white">Single registration pass</strong> grants access to all non-clashing events.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E01B22] mt-1.5 shrink-0" />
                <span>Teams may consist of <strong className="text-white">1 to 2 members</strong>. Individual solo entries are allowed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E01B22] mt-1.5 shrink-0" />
                <span>All hacking activities must be confined strictly within the provided challenge sandbox infrastructure.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 4: EVENT COORDINATORS ── */}
        <section className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#E01B22]" />
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#F7F2F2] tracking-wider uppercase">
              EVENT COORDINATORS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            {/* Coordinator 1: Tino Britty J */}
            <div className="p-5 bg-[#14080B] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] transition-colors flex flex-col justify-between gap-4">
              <div>
                <div className="text-[10px] text-[#E01B22] font-bold uppercase tracking-widest">
                  EVENT LEAD COORDINATOR
                </div>
                <h3 className="text-lg font-display font-bold text-white mt-1">
                  Tino Britty J
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:+919786350537"
                  className="px-3.5 py-2 bg-[#1C0D11] hover:bg-[#E01B22] text-white border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 97863 50537</span>
                </a>

                <a
                  href="https://wa.me/919786350537"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-black border border-[#10B981]/40 rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Coordinator 2: Srinithi J */}
            <div className="p-5 bg-[#14080B] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] transition-colors flex flex-col justify-between gap-4">
              <div>
                <div className="text-[10px] text-[#E01B22] font-bold uppercase tracking-widest">
                  EVENT COORDINATOR
                </div>
                <h3 className="text-lg font-display font-bold text-white mt-1">
                  Srinithi J
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:+916369227481"
                  className="px-3.5 py-2 bg-[#1C0D11] hover:bg-[#E01B22] text-white border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 63692 27481</span>
                </a>

                <a
                  href="https://wa.me/916369227481"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-black border border-[#10B981]/40 rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CALL TO ACTION FOOTER PANEL ── */}
        <section className="p-8 sm:p-12 bg-gradient-to-r from-[#1A080C] via-[#240A10] to-[#1A080C] border-2 border-[#E01B22] rounded-[2px] text-center space-y-6 shadow-[0_0_40px_rgba(224,27,34,0.3)]">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
              READY FOR THE EXTRACTION?
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#A79798] max-w-xl mx-auto">
              Assemble your squad, sharpen your cryptography tools, and step into the high-stakes arena on September 19, 2026.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleActionClick}
              className="shimmer-btn w-full sm:w-auto px-8 py-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-[0_0_25px_rgba(224,27,34,0.7)] flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{isAuthenticated ? 'GO TO EVENT CONTROL DASHBOARD' : 'REGISTER NOW FOR ₹100'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/events"
              className="w-full sm:w-auto px-6 py-4 bg-[#14070A] hover:bg-[#200A0E] border border-[#2A1A1D] hover:border-[#E01B22] text-[#A79798] hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              EXPLORE ALL 11 ARENAS
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
};

export default TheExtractionPage;
