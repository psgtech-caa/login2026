import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Terminal, Radio, Key, ChevronRight, ChevronDown, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { getBreadcrumbSchema, getFAQSchema, SITE_CONFIG } from '../data/seoConfig';

const CTF_FAQS = [
  {
    question: 'What is "The Extraction" CTF competition at LOGIN 2026 in Coimbatore?',
    answer:
      '"The Extraction" is a premier story-driven collegiate Capture The Flag (CTF) cybersecurity competition organized by the Department of Computer Applications, PSG College of Technology. Participants act as cyber intelligence operatives attempting to thwart the fictional Operation BLACKOUT through hands-on technical challenges.',
  },
  {
    question: 'What cybersecurity domains and challenge categories are covered in the CTF?',
    answer:
      'The competition features multiple cybersecurity disciplines including Cryptography (RSA, AES, custom ciphers, hash cracking), Digital Forensics (packet analysis, steganography, memory dumps), Web Security & Authentication Bypass, and Reverse Engineering.',
  },
  {
    question: 'Who can participate in the LOGIN 2026 CTF event in Tamil Nadu?',
    answer:
      'Any bona fide college student pursuing undergraduate or postgraduate degrees in MCA, Computer Science, IT, Cybersecurity, BCA, B.Tech, or B.E. from recognized universities across Tamil Nadu and India can participate. Teams can have 1 to 2 members.',
  },
  {
    question: 'What tools and hardware are required for the CTF competition?',
    answer:
      'Participants will use workstation terminals at the CAT Lab, PSG College of Technology. Standard security analysis tools (Wireshark, GDB, Ghidra, Python, CyberChef, Burp Suite community, John the Ripper/Hashcat) are available in the competition environment.',
  },
  {
    question: 'How does flag submission and scoring work in the CTF?',
    answer:
      'Flags follow the standard submission format LOGIN{flag_payload_here}. Points are awarded dynamically upon correct verification. The team with the highest point aggregate in the shortest completion time wins.',
  },
];

export const CtfPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const challengeCategories = [
    {
      title: 'Cryptography & Ciphers',
      icon: Lock,
      desc: 'Crack custom cryptographic algorithms, exploit weak key generators, analyze RSA/AES implementations, and decode hidden ciphertexts.',
      skills: 'RSA, ECC, Classical Ciphers, XOR, Hash Analysis',
    },
    {
      title: 'Digital Forensics & Steg',
      icon: Radio,
      desc: 'Inspect network packet captures (PCAP), analyze filesystem memory dumps, extract concealed payloads inside media files, and rebuild communication logs.',
      skills: 'Wireshark, Volatility, Binwalk, Metadata Analysis',
    },
    {
      title: 'Authentication & Web Security',
      icon: Shield,
      desc: 'Identify authorization flaws, decode JWT tokens, exploit misconfigured access controls, and bypass zero-trust verification gateways.',
      skills: 'JWT Exploitation, Parameter Tampering, SQLi, Auth Bypass',
    },
    {
      title: 'Reverse Engineering & Binaries',
      icon: Terminal,
      desc: 'Decompile compiled binaries, trace logic execution paths, reverse-engineer obfuscated scripts, and identify embedded flag routines.',
      skills: 'GDB, Ghidra, Bytecode Analysis, Assembly',
    },
  ];

  const structuredData = [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Cybersecurity CTF Competition', url: '/ctf' },
    ]),
    getFAQSchema(CTF_FAQS),
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'The Extraction: Cybersecurity CTF Competition — LOGIN 2026 | PSG Tech Coimbatore',
      description:
        'Collegiate cybersecurity Capture The Flag competition covering cryptography, digital forensics, reverse engineering, and web security at PSG College of Technology, Coimbatore.',
      startDate: '2026-09-18T13:30:00+05:30',
      endDate: '2026-09-18T16:00:00+05:30',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'CAT Lab, PSG College of Technology',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Avinashi Road, Peelamedu',
          addressLocality: 'Coimbatore',
          addressRegion: 'Tamil Nadu',
          postalCode: '641004',
          addressCountry: 'IN',
        },
      },
      organizer: {
        '@type': 'EducationalOrganization',
        name: 'Computer Applications Association (CAA), PSG College of Technology',
        url: SITE_CONFIG.baseUrl,
      },
      offers: {
        '@type': 'Offer',
        url: `${SITE_CONFIG.baseUrl}/register`,
        price: '0.00',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0607] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-[#F7F2F2] relative overflow-hidden">
      <SEOHead
        title="CTF Competition Coimbatore | Cybersecurity CTF Tamil Nadu | LOGIN 2026 PSG Tech"
        description="Participate in The Extraction — LOGIN 2026 collegiate cybersecurity Capture The Flag (CTF) competition at PSG College of Technology, Coimbatore. Hands-on cryptography, forensics, reverse engineering, and authentication bypass challenges for students across Tamil Nadu."
        keywords={[
          'CTF competition Coimbatore',
          'CTF event Tamil Nadu',
          'cybersecurity CTF Tamil Nadu',
          'college CTF competition',
          'capture the flag competition Coimbatore',
          'cybersecurity competition Tamil Nadu',
          'ethical hacking competition for college students',
          'student cybersecurity event Coimbatore',
          'The Extraction CTF',
          'LOGIN 2026 CTF',
          'PSG Tech CTF',
        ]}
        canonicalUrl="/ctf"
        structuredData={structuredData}
      />

      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(224,27,34,0.08)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E01B22]/10 border border-[#E01B22]/30 rounded-full text-xs font-mono text-[#E01B22] font-bold tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>OPERATION BLACKOUT • CYBERSECURITY CTF ARENA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-wider uppercase">
            THE EXTRACTION <span className="text-[#E01B22]">CTF 2026</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A79798] font-body leading-relaxed">
            Coimbatore’s premier intercollegiate cybersecurity Capture The Flag competition. Defend the mainframe, crack cryptographic vaults, reverse malware vectors, and extract mission-critical intelligence at PSG College of Technology.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#B8B2B2]">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#E01B22]" /> CAT Lab, PSG Tech</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#E01B22]" /> Sept 18, 2026 (01:30 PM – 04:00 PM)</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#E01B22]" /> Teams of 1–2 Members</span>
          </div>
        </header>

        {/* Mission Story Box */}
        <section aria-labelledby="mission-heading" className="bg-[#130C0E]/90 border border-[#2A1A1D] p-8 rounded-[2px] relative overflow-hidden shadow-2xl">
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E01B22] uppercase tracking-wider">
              <Key className="w-4 h-4" />
              <span>CLASSIFIED OPERATIONAL BRIEFING</span>
            </div>
            <h2 id="mission-heading" className="text-2xl font-display font-bold text-[#F7F2F2] uppercase tracking-wide">
              Operation BLACKOUT: The Breach Scenario
            </h2>
            <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed font-body">
              At 0400 hours, an advanced threat actor initiated a phased breach of central server clusters. Critical cryptographic keys were fragmented across isolated subnet nodes. As operative teams deployed to the scene, your objective is clear: systematically bypass access gates, decode cipher streams, investigate forensic memory dumps, and extract the primary system core before complete lockdown.
            </p>
            <div className="pt-2">
              <Link
                to="/the-extraction"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono text-xs font-bold uppercase rounded-[2px] transition-all shadow-md"
              >
                ENTER INTERACTIVE CTF MISSION TERMINAL <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Challenge Categories */}
        <section aria-labelledby="categories-heading" className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3 flex items-center justify-between">
            <h2 id="categories-heading" className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
              CTF Challenge Domains & Skill Tracks
            </h2>
            <span className="text-xs font-mono text-[#E01B22] font-bold">4 CORE PILLARS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challengeCategories.map((cat, index) => {
              const IconComp = cat.icon;
              return (
                <article
                  key={index}
                  className="bg-[#130C0E]/90 border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[2px] bg-[#E01B22]/10 border border-[#E01B22]/30 flex items-center justify-center text-[#E01B22]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-[#F7F2F2]">{cat.title}</h3>
                      <span className="text-[10px] font-mono text-[#736365] tracking-wider uppercase">DOMAIN 0{index + 1}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#A79798] leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="pt-2 border-t border-[#2A1A1D]/60 text-[11px] font-mono text-[#E01B22]">
                    <strong>Target Tooling:</strong> {cat.skills}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Ethical Conduct & Fair Play */}
        <section aria-labelledby="rules-heading" className="bg-[#130C0E] border border-[#2A1A1D] p-8 rounded-[2px] space-y-4">
          <div className="flex items-center gap-2 text-[#E01B22]">
            <AlertTriangle className="w-5 h-5" />
            <h2 id="rules-heading" className="text-lg font-display font-bold uppercase text-[#F7F2F2]">
              Ethical Hacking Rules & CTF Etiquette
            </h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#A79798] leading-relaxed font-body">
            <li className="flex items-start gap-2">
              <span className="text-[#E01B22] font-bold">1.</span>
              <span>Attacking competition infrastructure, scoreboard servers, or fellow participants' hardware is strictly prohibited and results in immediate disqualification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E01B22] font-bold">2.</span>
              <span>Flag sharing, brute-forcing flag submission forms, or leaking hints across teams is strictly disallowed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E01B22] font-bold">3.</span>
              <span>All challenges must be solved within the assigned sandbox target machines and designated testing networks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E01B22] font-bold">4.</span>
              <span>Coordinators’ decisions regarding flag verification, challenge clarifications, and scoring disputes are final.</span>
            </li>
          </ul>
        </section>

        {/* FAQs */}
        <section aria-labelledby="ctf-faqs-heading" className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3">
            <h2 id="ctf-faqs-heading" className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
              Frequently Asked Questions: Cybersecurity CTF
            </h2>
          </div>

          <div className="space-y-3">
            {CTF_FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-[#130C0E]/80 border border-[#2A1A1D] rounded-[2px] overflow-hidden"
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
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[#A79798] leading-relaxed border-t border-[#2A1A1D]/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-[#1A0C0E] via-[#2A1416] to-[#1A0C0E] border border-[#E01B22]/30 p-8 rounded-[2px] text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-display font-black text-[#F7F2F2] uppercase tracking-wider">
            Ready for Operation BLACKOUT?
          </h2>
          <p className="text-xs sm:text-sm text-[#A79798] max-w-xl mx-auto">
            Assemble your CTF squad and compete against top collegiate cybersecurity minds across Tamil Nadu at PSG Tech.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(224,27,34,0.4)]"
            >
              REGISTER FOR CTF
            </Link>
            <Link
              to="/the-extraction"
              className="px-8 py-3.5 border border-[#2A1A1D] hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              MISSION BRIEFING TERMINAL
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
