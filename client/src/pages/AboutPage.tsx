import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, MapPin, Users, ChevronRight, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { getBreadcrumbSchema, getOrganizationSchema } from '../data/seoConfig';

export const AboutPage: React.FC = () => {
  const structuredData = [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'About LOGIN 2026', url: '/about' },
    ]),
    getOrganizationSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About LOGIN 2026 — PSG College of Technology Coimbatore',
      description:
        'History, legacy, and institutional profile of LOGIN 2026, the 35th Edition National Level Technical Symposium organized by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore.',
      mainEntity: {
        '@type': 'EducationalOrganization',
        name: 'PSG College of Technology',
        alternateName: 'PSG Tech Coimbatore',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Avinashi Road, Peelamedu',
          addressLocality: 'Coimbatore',
          addressRegion: 'Tamil Nadu',
          postalCode: '641004',
          addressCountry: 'IN',
        },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0607] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-[#F7F2F2] relative overflow-hidden">
      <SEOHead
        title="About LOGIN 2026 | PSG Tech MCA National Technical Symposium | Coimbatore"
        description="Discover the 35-year legacy of LOGIN — the flagship National Level Technical Symposium organized by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore, Tamil Nadu."
        keywords={[
          'About LOGIN 2026',
          'PSG Tech',
          'PSG College of Technology',
          'PSG Tech Coimbatore',
          'PSG Tech MCA',
          'MCA Department PSG Tech',
          'MCA students Coimbatore',
          'Computer Applications Association',
          'technical events Tamil Nadu',
          'Coimbatore intercollegiate events',
        ]}
        canonicalUrl="/about"
        structuredData={structuredData}
      />

      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(224,27,34,0.08)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none z-0" />

      <main className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Header Section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E01B22]/10 border border-[#E01B22]/30 rounded-full text-xs font-mono text-[#E01B22] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>35TH EDITION • NATIONAL LEVEL TECHNICAL SYMPOSIUM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-wider uppercase">
            ABOUT <span className="text-[#E01B22]">LOGIN 2026</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B2B2] font-mono tracking-widest uppercase">
            SEPTEMBER 18 & 19, 2026 • PSG COLLEGE OF TECHNOLOGY • COIMBATORE
          </p>
        </header>

        {/* 35 Years Legacy Story */}
        <article className="bg-[#130C0E]/90 border border-[#2A1A1D] p-8 sm:p-10 rounded-[2px] shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#E01B22] font-bold tracking-widest uppercase block">
              // HERITAGE // 01
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#F7F2F2] uppercase tracking-wide">
              A Legacy of 35 Years of Masterminds
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#A79798] leading-relaxed font-body">
            <p>
              <strong className="text-[#F7F2F2]">LOGIN</strong> is the flagship national-level technical symposium organized annually by the <strong className="text-[#F7F2F2]">Computer Applications Association (CAA)</strong>, Department of Computer Applications, <strong className="text-[#F7F2F2]">PSG College of Technology</strong>, Coimbatore.
            </p>
            <p>
              Since 1991, LOGIN has served as the ultimate arena for top-tier masterminds across India. Over the past three and a half decades, it has fostered algorithmic brilliance, collaborative problem-solving, and cutting-edge software craftsmanship.
            </p>
            <p>
              The 2026 edition introduces the theme <strong className="text-[#F7F2F2]">"THE LAST HUMAN"</strong> — challenging participants' logic, code, resilience, and endurance under pressure across 11 technical, non-technical, and flagship arenas.
            </p>
          </div>
        </article>

        {/* Institution & Department Cards */}
        <section aria-labelledby="institutional-profiles" className="space-y-6">
          <h2 id="institutional-profiles" className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
            Institutional Heritage & Department Leadership
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PSG Tech Card */}
            <article className="bg-[#130C0E]/90 border border-[#2A1A1D] hover:border-[#E01B22]/40 p-8 rounded-[2px] transition-colors space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-[2px] bg-[#E01B22]/10 border border-[#E01B22]/30 flex items-center justify-center text-[#E01B22]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-black text-[#F7F2F2] uppercase">
                PSG College of Technology
              </h3>
              <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed font-body">
                Founded in 1951 by PSG & Sons and Charities, PSG College of Technology is an autonomous, government-aided institution affiliated with Anna University. Ranked among India’s foremost engineering colleges, PSG Tech has championed industry-aligned academic excellence and pioneering research for over 75 years.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#736365] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E01B22]" /> Peelamedu, Coimbatore, Tamil Nadu
              </div>
            </article>

            {/* Department of Computer Applications (CAA) */}
            <article className="bg-[#130C0E]/90 border border-[#2A1A1D] hover:border-[#E01B22]/40 p-8 rounded-[2px] transition-colors space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-[2px] bg-[#E01B22]/10 border border-[#E01B22]/30 flex items-center justify-center text-[#E01B22]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-black text-[#F7F2F2] uppercase">
                Department of Computer Applications (MCA) & CAA
              </h3>
              <p className="text-xs sm:text-sm text-[#A79798] leading-relaxed font-body">
                The Department of Computer Applications at PSG Tech provides rigorous postgraduate education in computer science, software development, artificial intelligence, and cybersecurity. The Computer Applications Association (CAA) is its active student-faculty body organizing national symposiums, hackathons, and technical workshops.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#736365] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#E01B22]" /> Organizing LOGIN since 1991
              </div>
            </article>

          </div>
        </section>

        {/* Quick Links / Explore Tracks */}
        <section aria-labelledby="tracks-heading" className="bg-[#130C0E] border border-[#2A1A1D] p-8 rounded-[2px] space-y-6">
          <h2 id="tracks-heading" className="text-xl font-display font-bold uppercase tracking-wider text-[#F7F2F2]">
            Explore LOGIN 2026 Competitive Arenas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/events"
              className="p-4 bg-[#0A0607] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] transition-colors group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-display font-bold text-[#F7F2F2] group-hover:text-[#E01B22]">All 11 Arenas</span>
                <p className="text-[10px] text-[#A79798]">Coding, Debugging, Web Craft & Flagship</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#736365] group-hover:text-[#E01B22] group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/ctf"
              className="p-4 bg-[#0A0607] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] transition-colors group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-display font-bold text-[#F7F2F2] group-hover:text-[#E01B22]">The Extraction CTF</span>
                <p className="text-[10px] text-[#A79798]">Cybersecurity & Cryptography Challenge</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#736365] group-hover:text-[#E01B22] group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/timeline"
              className="p-4 bg-[#0A0607] border border-[#2A1A1D] hover:border-[#E01B22] rounded-[2px] transition-colors group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-display font-bold text-[#F7F2F2] group-hover:text-[#E01B22]">Event Timeline</span>
                <p className="text-[10px] text-[#A79798]">Day 1 & Day 2 Schedule (Sept 18 & 19)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#736365] group-hover:text-[#E01B22] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};
