import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, Award, Users, ChevronRight, ChevronDown, Shield, Terminal } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { getBreadcrumbSchema, getFAQSchema, SITE_CONFIG } from '../data/seoConfig';

const LOGIN_2026_FAQS = [
  {
    question: 'What is LOGIN 2026 at PSG Tech Coimbatore?',
    answer:
      'LOGIN 2026 is the 35th Edition of the National Level Technical Symposium organized by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore. It is one of South India’s most celebrated collegiate technical festivals, hosting 11 specialized competitive arenas under the theme "THE LAST HUMAN".',
  },
  {
    question: 'What are the official dates and venue for LOGIN 2026?',
    answer:
      'The symposium takes place on September 18 and 19, 2026, across the specialized laboratories and conference halls at PSG College of Technology, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004.',
  },
  {
    question: 'What competitions are hosted at LOGIN 2026?',
    answer:
      'The 11 arenas comprise: Code Relay (relay coding), The Extraction (story-driven cybersecurity CTF), Debug Arena (software debugging), CodeXcape (technical escape room), Blind Coding, Project Phoenix (system disaster recovery), NOSTOS (mythological logic trials), Hunt your Treasure (QR challenge), Pixel Paradox (AI vs reality), In The Slot (IPL auction strategy), and the supreme title Star of LOGIN.',
  },
  {
    question: 'Who organizes LOGIN 2026?',
    answer:
      'LOGIN 2026 is organized by the students and faculty of the Computer Applications Association (CAA), Department of Computer Applications (MCA), PSG College of Technology, carrying forward a legacy of over 35 years.',
  },
  {
    question: 'How do students from outside Coimbatore register and participate?',
    answer:
      'Students can register online via https://login.psgtech.ac.in/register. After creating their participant account and selecting their event tracks, participants receive check-in passes and event schedule notifications.',
  },
];

export const Login2026OverviewPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const structuredData = [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'LOGIN 2026 Overview', url: '/login-2026' },
    ]),
    getFAQSchema(LOGIN_2026_FAQS),
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'LOGIN 2026: The Last Human — National Technical Symposium',
      description:
        'Official 35th Edition National Level Technical Symposium organized by the Department of Computer Applications (MCA), PSG College of Technology, Coimbatore, Tamil Nadu.',
      startDate: SITE_CONFIG.startDate,
      endDate: SITE_CONFIG.endDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'PSG College of Technology',
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
        name: 'Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology',
        url: SITE_CONFIG.baseUrl,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0607] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-[#F7F2F2] relative overflow-hidden">
      <SEOHead
        title="LOGIN 2026 | National Technical Symposium | PSG Tech Coimbatore MCA"
        description="Official portal for LOGIN 2026: The Last Human — 35th Edition National Level Technical Symposium organized by Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore on September 18 & 19, 2026."
        keywords={[
          'LOGIN 2026',
          'LOGIN 2026 PSG Tech',
          'LOGIN 2026 Coimbatore',
          'LOGIN 2026 MCA',
          'LOGIN 2026 technical event',
          'LOGIN 2026 hackathon',
          'LOGIN 2026 CTF',
          'LOGIN 2026 intercollegiate event',
          'LOGIN 2026 Tamil Nadu',
          'PSG Tech MCA symposium',
          'Computer Applications Association',
        ]}
        canonicalUrl="/login-2026"
        structuredData={structuredData}
      />

      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(224,27,34,0.08)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header Section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E01B22]/10 border border-[#E01B22]/30 rounded-full text-xs font-mono text-[#E01B22] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>35TH EDITION • NATIONAL LEVEL TECHNICAL SYMPOSIUM</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-wider uppercase">
            LOGIN <span className="text-[#E01B22]">2026</span>
          </h1>
          <p className="text-base sm:text-lg font-mono text-[#F7F2F2] tracking-widest uppercase">
            [ THE LAST HUMAN ]
          </p>
          <p className="text-sm sm:text-base text-[#A79798] font-body leading-relaxed max-w-2xl mx-auto">
            Organized by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Peelamedu, Coimbatore, Tamil Nadu.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#B8B2B2]">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#E01B22]" /> Sept 18 & 19, 2026</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#E01B22]" /> PSG College of Technology, Coimbatore</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#E01B22]" /> 11 Competitive Arenas</span>
          </div>
        </header>

        {/* 35 Years Legacy Story Card */}
        <section aria-labelledby="legacy-heading" className="bg-[#130C0E]/90 border border-[#2A1A1D] p-8 sm:p-10 rounded-[2px] shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#E01B22] font-bold tracking-widest uppercase">
              // HERITAGE & VISION //
            </span>
            <h2 id="legacy-heading" className="text-2xl sm:text-3xl font-display font-black text-[#F7F2F2] uppercase tracking-wide">
              35 Years of Engineering Masterminds
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#A79798] leading-relaxed font-body">
            <p>
              Since 1991, <strong className="text-[#F7F2F2]">LOGIN</strong> has stood as the premier national technical festival hosted by the Department of Computer Applications at PSG College of Technology. Over three and a half decades, it has shaped generations of software engineers, cybersecurity specialists, data scientists, and technology innovators.
            </p>
            <p>
              The 2026 edition introduces <strong className="text-[#F7F2F2]">"THE LAST HUMAN"</strong> — a thematic narrative testing adaptability, cognitive resilience, and technical depth in an era dominated by automated systems. 11 uniquely crafted arenas challenge participants across coding, security, debugging, strategy, and problem-solving.
            </p>
          </div>
        </section>

        {/* Quick Navigation Hub to SEO Pillars */}
        <section aria-labelledby="pillars-heading" className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3">
            <h2 id="pillars-heading" className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
              Explore Key Symposium Tracks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-[#130C0E] border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] space-y-3 transition-colors">
              <Terminal className="w-6 h-6 text-[#E01B22]" />
              <h3 className="text-lg font-display font-bold text-[#F7F2F2]">11 Technical Arenas</h3>
              <p className="text-xs text-[#A79798] leading-relaxed">
                Code Relay, CodeXcape, Blind Coding, and Debug Arena designed for speed, logic, and collaborative programming.
              </p>
              <Link to="/events" className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#E01B22] hover:text-[#FF2A2A]">
                EXPLORE ALL ARENAS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </article>

            <article className="bg-[#130C0E] border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] space-y-3 transition-colors">
              <Shield className="w-6 h-6 text-[#E01B22]" />
              <h3 className="text-lg font-display font-bold text-[#F7F2F2]">Cybersecurity CTF</h3>
              <p className="text-xs text-[#A79798] leading-relaxed">
                The Extraction — a story-driven Capture The Flag battle covering cryptography, forensics, and reverse engineering.
              </p>
              <Link to="/ctf" className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#E01B22] hover:text-[#FF2A2A]">
                EXPLORE CTF ARENA <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </article>

            <article className="bg-[#130C0E] border border-[#2A1A1D] hover:border-[#E01B22]/50 p-6 rounded-[2px] space-y-3 transition-colors">
              <Users className="w-6 h-6 text-[#E01B22]" />
              <h3 className="text-lg font-display font-bold text-[#F7F2F2]">Event Timeline</h3>
              <p className="text-xs text-[#A79798] leading-relaxed">
                Complete schedule of day 1 and day 2 events, venue locations across PSG Tech campus, and registration deadlines.
              </p>
              <Link to="/timeline" className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#E01B22] hover:text-[#FF2A2A]">
                VIEW EVENT TIMELINE <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          </div>
        </section>

        {/* Institutional Credentials */}
        <section aria-labelledby="institution-heading" className="bg-[#130C0E] border border-[#2A1A1D] p-8 rounded-[2px] space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3">
            <h2 id="institution-heading" className="text-xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
              Host Institution & Association
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#A79798] leading-relaxed font-body">
            <div className="space-y-3">
              <h3 className="text-sm font-display font-bold text-[#F7F2F2]">PSG College of Technology</h3>
              <p>
                Established in 1951 by PSG & Sons and Charities, PSG Tech is one of India's premier autonomous engineering institutions, affiliated with Anna University. Located on Avinashi Road, Peelamedu, Coimbatore, it has nurtured world-class engineers for over 75 years.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-display font-bold text-[#F7F2F2]">Computer Applications Association (CAA)</h3>
              <p>
                Driven by the Department of Computer Applications (MCA), CAA provides a vibrant forum for student leadership, technical workshops, open-source initiatives, and the flagship annual national symposium LOGIN.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section aria-labelledby="overview-faqs-heading" className="space-y-6">
          <div className="border-b border-[#2A1A1D] pb-3">
            <h2 id="overview-faqs-heading" className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
              Frequently Asked Questions: LOGIN 2026
            </h2>
          </div>

          <div className="space-y-3">
            {LOGIN_2026_FAQS.map((faq, index) => (
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

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#1A0C0E] via-[#2A1416] to-[#1A0C0E] border border-[#E01B22]/30 p-8 rounded-[2px] text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-display font-black text-[#F7F2F2] uppercase tracking-wider">
            Join the 35th Edition of LOGIN at PSG Tech
          </h2>
          <p className="text-xs sm:text-sm text-[#A79798] max-w-xl mx-auto">
            Be part of Coimbatore’s grandest collegiate technical festival on September 18 & 19, 2026.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(224,27,34,0.4)]"
            >
              REGISTER NOW
            </Link>
            <Link
              to="/events"
              className="px-8 py-3.5 border border-[#2A1A1D] hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
            >
              VIEW ALL 11 ARENAS
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
