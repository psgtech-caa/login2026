import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { NewsSection } from '../components/home/NewsSection';
import { AboutSection } from '../components/home/AboutSection';
import { EventsSection } from '../components/home/EventsSection';
import { TimelineSection } from '../components/home/TimelineSection';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { CommunitySection } from '../components/home/CommunitySection';
import { CoordinatorsSection } from '../components/home/CoordinatorsSection';
import { ScrollReveal } from '../animations/ScrollReveal';
import { SEOHead } from '../components/common/SEOHead';
import {
  getWebSiteSchema,
  getOrganizationSchema,
  getSymposiumEventSchema,
  getFAQSchema,
  HOMEPAGE_FAQS,
} from '../data/seoConfig';
import { ChevronDown, HelpCircle, Terminal, Shield, GraduationCap, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleScrollToEvents = () => {
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const structuredData = [
    getWebSiteSchema(),
    getOrganizationSchema(),
    getSymposiumEventSchema(),
    getFAQSchema(HOMEPAGE_FAQS),
  ];

  return (
    <div className="min-h-screen bg-[#0A0607] text-[#F7F2F2] overflow-x-hidden">
      <SEOHead
        title="LOGIN 2026 | National Technical Symposium | PSG Tech Coimbatore"
        description="LOGIN 2026: The Last Human — 35th Edition National Level Technical Symposium organized by Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore. 11 technical, hackathon, and CTF arenas on September 18 & 19, 2026."
        keywords={[
          'LOGIN 2026',
          'PSG Tech',
          'PSG College of Technology',
          'PSG Tech Coimbatore',
          'PSG Tech MCA',
          'MCA Department PSG Tech',
          'MCA students Coimbatore',
          'Coimbatore intercollegiate events',
          'intercollegiate technical events Coimbatore',
          'college technical events Coimbatore',
          'technical competitions Tamil Nadu',
          'hackathon Coimbatore',
          'hackathon Tamil Nadu',
          'CTF competition Coimbatore',
          'cybersecurity CTF Tamil Nadu',
          'The Extraction CTF',
          'LOGIN 2026 hackathon',
          'LOGIN 2026 CTF',
        ]}
        canonicalUrl="/"
        structuredData={structuredData}
      />

      {/* 01. NAVIGATION + HERO */}
      <ScrollReveal direction="none" duration={1.2}>
        <HeroSection onExploreEvents={handleScrollToEvents} />
      </ScrollReveal>

      {/* 02. LATEST NEWS & METRICS */}
      <ScrollReveal direction="up" delay={0.2}>
        <NewsSection />
      </ScrollReveal>

      {/* 03. ABOUT LOGIN */}
      <ScrollReveal direction="up" amount={0.3}>
        <AboutSection />
      </ScrollReveal>

      {/* 04. KEYSTONE TOPIC HUBS FOR INTERCOLLEGIATE AUDIENCES */}
      <section className="py-16 px-4 bg-[#0D080A] border-y border-[#2A1A1D] relative">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-[#E01B22] font-black tracking-[0.25em] uppercase">
              // INTERCOLLEGIATE HUBS //
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
              TECHNICAL COMPETITIONS IN COIMBATORE
            </h2>
            <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed">
              Explore specialized symposium tracks designed for MCA, engineering, and computing students across Tamil Nadu and all of India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/events"
              className="bg-[#130C0E]/90 border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] transition-all group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[2px] bg-[#E01B22]/10 border border-[#E01B22]/30 flex items-center justify-center text-[#E01B22]">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors">
                  11 Technical Arenas
                </h3>
                <p className="text-xs text-[#A79798] leading-relaxed font-body">
                  Relay coding, escape rooms, blind programming, web craft, and live server debugging arenas at PSG Tech.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#2A1A1D] flex items-center justify-between text-xs font-mono font-bold text-[#E01B22]">
                <span>EXPLORE 11 ARENAS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/ctf"
              className="bg-[#130C0E]/90 border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] transition-all group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[2px] bg-[#E01B22]/10 border border-[#E01B22]/30 flex items-center justify-center text-[#E01B22]">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors">
                  Cybersecurity CTF
                </h3>
                <p className="text-xs text-[#A79798] leading-relaxed font-body">
                  "The Extraction" CTF — cryptography, forensics, reverse engineering, and authentication bypasses.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#2A1A1D] flex items-center justify-between text-xs font-mono font-bold text-[#E01B22]">
                <span>ENTER CTF ARENA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/about"
              className="bg-[#130C0E]/90 border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] transition-all group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[2px] bg-[#E01B22]/10 border border-[#E01B22]/30 flex items-center justify-center text-[#E01B22]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#F7F2F2] group-hover:text-[#E01B22] transition-colors">
                  About PSG Tech MCA
                </h3>
                <p className="text-xs text-[#A79798] leading-relaxed font-body">
                  Learn about Computer Applications Association (CAA), 35 editions of legacy, faculty advisors, and venue details.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#2A1A1D] flex items-center justify-between text-xs font-mono font-bold text-[#E01B22]">
                <span>LEARN ABOUT LOGIN & MCA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 05. EVENTS */}
      <ScrollReveal direction="up" amount={0.1}>
        <EventsSection />
      </ScrollReveal>

      {/* 06. TIMELINE */}
      <ScrollReveal direction="up" amount={0.2}>
        <TimelineSection />
      </ScrollReveal>

      {/* 07. DAY SPOTLIGHT / SCHEDULE */}
      <ScrollReveal direction="up" amount={0.2}>
        <ScheduleSection />
      </ScrollReveal>

      {/* 08. COMMUNITY / ALUMNI */}
      <ScrollReveal direction="up" amount={0.2}>
        <CommunitySection />
      </ScrollReveal>

      {/* 08b. LEADERSHIP / COORDINATORS */}
      <ScrollReveal direction="up" amount={0.2}>
        <CoordinatorsSection isHomePage={true} />
      </ScrollReveal>

      {/* 09. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-4 bg-[#0A0607] border-t border-[#2A1A1D] relative">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E01B22]/10 border border-[#E01B22]/30 rounded-full text-xs font-mono text-[#E01B22] font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-[#F7F2F2] uppercase tracking-wide">
              Everything You Need to Know About <span className="text-[#E01B22]">LOGIN 2026</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A79798] max-w-xl mx-auto leading-relaxed font-body">
              Verified answers about the 35th Edition National Level Technical Symposium at PSG College of Technology, Coimbatore.
            </p>
          </div>

          <div className="space-y-3">
            {HOMEPAGE_FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-[#130C0E]/90 border border-[#2A1A1D] rounded-[2px] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:text-[#E01B22] transition-colors"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-display font-bold text-sm text-[#F7F2F2]">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180 text-[#E01B22]' : 'text-[#736365]'
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[#A79798] leading-relaxed border-t border-[#2A1A1D]/60 font-body">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Support Link */}
          <div className="text-center text-xs font-mono text-[#736365] pt-4">
            <span>Have additional queries? </span>
            <Link to="/contact" className="text-[#E01B22] hover:text-[#FF2A2A] font-bold underline ml-1">
              Contact the organizing committee
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
export default HomePage;
