import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Mail, Phone, MapPin, CreditCard, ArrowRight, MessageCircle } from 'lucide-react';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const handleReplay = () => {
    sessionStorage.removeItem('hasPlayedIntro');
    if (onReplayIntro) {
      onReplayIntro();
    } else {
      window.location.reload();
    }
  };

  return (
    <footer className="bg-[#0A0607] border-t border-[#2A1A1D] text-[#A79798] pt-14 sm:pt-16 pb-10 sm:pb-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* High-priority support and payment links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          <div className="group flex flex-col justify-center gap-3 border border-[#E01B22]/50 bg-[#18090D] px-4 sm:px-5 py-4 hover:border-[#E01B22] hover:bg-[#220B11] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <CreditCard className="w-5 h-5 text-[#E01B22] shrink-0" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#E01B22] uppercase">Registration & payment portals</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pl-8 text-xs font-mono">
              <Link to="/dashboard/payment" className="inline-flex items-center gap-1.5 text-[#F7F2F2] hover:text-[#FF4545] transition-colors">
                Participant payment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://events.psginstitutions.in/EMS/register/E5294158179"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#F7F2F2] hover:text-[#FF4545] transition-colors"
              >
                Official event registration <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <Link
            to="/contact"
            className="group flex items-center justify-between gap-4 border border-[#2A1A1D] bg-[#130C0E] px-4 sm:px-5 py-4 hover:border-[#E01B22]/70 hover:bg-[#18090D] transition-colors"
          >
            <span className="flex items-center gap-3 min-w-0">
              <MessageCircle className="w-5 h-5 text-[#E01B22] shrink-0" />
              <span className="min-w-0">
                <span className="block text-[10px] font-mono font-bold tracking-widest text-[#E01B22] uppercase">Need help?</span>
                <span className="block mt-1 text-xs text-[#F7F2F2] truncate">Contact the organizing committee</span>
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#A79798] shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-[#E01B22]" />
          </Link>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 sm:gap-y-8 pb-10 sm:pb-12 border-b border-[#2A1A1D] items-start">
          
          {/* Column 1: Brand & Theme */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src="/assets/login.webp"
                alt="LOGIN 2026 Logo"
                className="h-14 w-14 object-contain animate-float-slow drop-shadow-[0_0_15px_rgba(224,27,34,0.4)]"
              />
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#F7F2F2] tracking-wider">LOGIN 2026</h3>
                <p className="text-[10px] font-mono text-[#E01B22] font-bold tracking-wider uppercase">THE LAST HUMAN</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#A79798]">
              The 35th Edition National Level Technical Symposium organized by the Computer Applications Association, PSG College of Technology.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReplay}
                className="group relative inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#E01B22] hover:text-[#FF2A2A] border border-[#E01B22]/30 hover:border-[#E01B22] px-4 py-2.5 rounded-[2px] transition-all duration-300 bg-[#E01B22]/5 overflow-hidden shadow-[0_0_10px_rgba(224,27,34,0.02)] hover:shadow-[0_0_20px_rgba(224,27,34,0.15)]"
              >
                <Play className="w-3 h-3 fill-current transition-transform duration-300 group-hover:translate-x-0.5" />
                REPLAY OPENING SEQUENCE
              </button>
            </div>
          </div>

          {/* Column 2: Event Details */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Symposium Info</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] shrink-0" />
                <strong className="text-[#F7F2F2]">Dates:</strong> 18 & 19 September 2026
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] shrink-0" />
                <strong className="text-[#F7F2F2]">Venue:</strong> PSG College of Technology
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] shrink-0" />
                <strong className="text-[#F7F2F2]">Organizer:</strong> Computer Applications Association
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Key Portals & Arenas</h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <Link to="/events" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>All 11 Arenas</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/ctf" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>The Extraction CTF</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>Event Timeline</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>Photo Gallery</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/coordinators" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>Coordinators</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/winners" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>Winners & Hall of Fame</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>About PSG Tech MCA</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2 text-[#A79798]">
                <MapPin className="w-4 h-4 text-[#E01B22] shrink-0 mt-0.5" />
                <span>Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E01B22] shrink-0" />
                <a href="mailto:login@psgtech.ac.in" className="hover:text-[#F7F2F2] transition-colors font-mono">login@psgtech.ac.in</a>
              </li>
              <li>
                <Link to="/contact" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E01B22] hover:text-[#FF2A2A] transition-colors">
                  CONTACT SUPPORT <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li className="space-y-1 pt-1 border-t border-[#2A1A1D]/60">
                <span className="text-[10px] font-mono font-bold text-[#E01B22] uppercase tracking-wider block">SECRETARY</span>
                <span className="text-[#F7F2F2] font-semibold text-xs block">Barathvikraman S K</span>
                <a href="tel:8148251567" className="inline-flex items-center gap-1.5 text-xs text-[#A79798] hover:text-[#E01B22] transition-colors font-mono">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#E01B22]" />
                  +91 81482 51567
                </a>
              </li>
              <li className="space-y-1 pt-1 border-t border-[#2A1A1D]/60">
                <span className="text-[10px] font-mono font-bold text-[#E01B22] uppercase tracking-wider block">TREASURER</span>
                <span className="text-[#F7F2F2] font-semibold text-xs block">Swarna Rathna A</span>
                <a href="tel:9952873426" className="inline-flex items-center gap-1.5 text-xs text-[#A79798] hover:text-[#E01B22] transition-colors font-mono">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#E01B22]" />
                  +91 99528 73426
                </a>
              </li>
              <li className="space-y-1 pt-1 border-t border-[#2A1A1D]/60">
                <span className="text-[10px] font-mono font-bold text-[#E01B22] uppercase tracking-wider block">EXECUTIVE COORDINATOR</span>
                <span className="text-[#F7F2F2] font-semibold text-xs block">Stephina Smily C</span>
                <a href="tel:8300526351" className="inline-flex items-center gap-1.5 text-xs text-[#A79798] hover:text-[#E01B22] transition-colors font-mono">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#E01B22]" />
                  +91 83005 26351
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Venue Map Location */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E01B22]" /> Venue Location
            </h4>
            <div className="w-full overflow-hidden rounded-[2px] border border-[#2A1A1D] shadow-lg hover:border-[#E01B22] transition-colors bg-[#130C0E]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d902.5634547345201!2d77.00260053961405!3d11.023924099305132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8582f1435fa59%3A0x137d95bfd8909293!2sPSG%20College%20Of%20Technology!5e0!3m2!1sen!2sin!4v1788077911187!5m2!1sen!2sin"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="PSG College of Technology Map"
              />
            </div>
            <p className="text-[10px] font-mono text-[#A79798]">
              Peelamedu, Coimbatore, Tamil Nadu
            </p>
          </div>

        </div>

        {/* Final Dystopian Message */}
        <div className="pt-8 pb-4 text-center select-none border-b border-[#2A1A1D]/40">
          <p className="text-[10px] sm:text-xs font-mono text-[#4A383A] font-extrabold tracking-[0.4em] uppercase">
            ONE LAST HUMAN. ELEVEN ARENAS.
          </p>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#6B5A5C]">
          <p>© 2026 Computer Applications Association - PSG College of Technology. All rights reserved.</p>
          <p className="text-[#E01B22] font-bold tracking-wider">LOGIN 2026 &bull; THE LAST HUMAN</p>
        </div>

      </div>
    </footer>
  );
};;
