import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { SEOHead } from '../components/common/SEOHead';
import { getBreadcrumbSchema } from '../data/seoConfig';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Please complete all fields before sending your message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (trimmedMessage.length < 12) {
      setError('Your message must be at least 12 characters long.');
      return;
    }

    setError(null);
    setNotice(null);

    try {
      if (!otpSent) {
        setSendingOtp(true);
        await api.contact.sendOtp(trimmedEmail);
        setOtpSent(true);
        setNotice('Verification code sent. Check your email and enter the 6-digit code to continue.');
        return;
      }

      if (!/^\d{6}$/.test(otp.trim())) {
        setError('Enter the 6-digit verification code sent to your email.');
        return;
      }

      setSending(true);
      await api.contact.sendMessage({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        otp: otp.trim(),
      });

      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setOtp('');
      setOtpSent(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transmission failed. Please try again or contact login@psgtech.ac.in directly.');
    } finally {
      setSending(false);
      setSendingOtp(false);
    }
  };

  const structuredData = [
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Contact & Support', url: '/contact' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact LOGIN 2026 Organizing Committee',
      description:
        'Official contact information and support helpdesk for LOGIN 2026 at PSG College of Technology, Coimbatore.',
      mainEntity: {
        '@type': 'Organization',
        name: 'Computer Applications Association (CAA), PSG Tech',
        email: 'login@psgtech.ac.in',
        telephone: '+91 81482 51567',
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
    <div className="min-h-screen bg-[#0A0607] pt-28 pb-20 px-4 relative overflow-hidden">
      <SEOHead
        title="Contact Organizing Committee | LOGIN 2026 PSG Tech Coimbatore"
        description="Get in touch with the student coordinators, faculty advisors, and organizing committee of LOGIN 2026, Department of Computer Applications, PSG College of Technology, Coimbatore."
        keywords={[
          'Contact LOGIN 2026',
          'PSG Tech symposium contact',
          'LOGIN 2026 coordinators phone number',
          'PSG Tech MCA contact',
          'Coimbatore technical symposium helpdesk',
        ]}
        canonicalUrl="/contact"
        structuredData={structuredData}
      />
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      {/* Glow effect */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,_rgba(224,27,34,0.05)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
            ✦ SECURE TRANSMISSION NODE
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            CONNECT WITH US
          </h1>
          <p className="text-xs sm:text-sm text-[#A79798] font-mono tracking-wide leading-relaxed">
            Establish secure uplink queries to reach out to the organizing committee of LOGIN 2K26.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Office coordinates & Channels (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office Coordinates */}
            <div className="border border-[#2A1A1D] bg-[#130C0E]/30 p-5 rounded-[2px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E01B22]/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E01B22]/50" />
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-[#E01B22]/30 flex items-center justify-center bg-[#0A0607]/80 shrink-0 text-[#E01B22]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono text-[#E01B22] font-black uppercase tracking-wider block">OFFICE COORDINATES</span>
                  <h4 className="font-display font-bold text-sm text-[#F7F2F2] uppercase tracking-wide">Computer Applications Association</h4>
                  <p className="text-xs text-[#A79798] font-mono leading-relaxed pt-1">
                    PSG College of Technology,<br />
                    Avinashi Road, Peelamedu,<br />
                    Coimbatore, Tamil Nadu - 641004
                  </p>
                </div>
              </div>
            </div>

            {/* Support channels */}
            <div className="border border-[#2A1A1D] bg-[#130C0E]/30 p-5 rounded-[2px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E01B22]/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E01B22]/50" />

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#E01B22]/30 flex items-center justify-center bg-[#0A0607]/80 shrink-0 text-[#E01B22]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-[#E01B22] font-black uppercase tracking-wider block">SECURE UPLINK MAIL</span>
                    <a href="mailto:login@psgtech.ac.in" className="font-mono text-xs text-[#F7F2F2] hover:text-[#E01B22] transition-colors block pt-0.5">
                      login@psgtech.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 pt-3 border-t border-[#2A1A1D]/50">
                  <div className="w-10 h-10 rounded-full border border-[#E01B22]/30 flex items-center justify-center bg-[#0A0607]/80 shrink-0 text-[#E01B22]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-mono text-[#E01B22] font-black uppercase tracking-wider block">OFFICIAL CONTACT & WHATSAPP SUPPORT</span>
                    <div>
                      <span className="text-[10px] font-mono text-[#6B5A5C] block">SECRETARY: Barathvikraman S K</span>
                      <a href="tel:8148251567" className="font-mono text-xs text-[#F7F2F2] hover:text-[#E01B22] transition-colors block">+91 81482 51567</a>
                    </div>
                    <div className="pt-2">
                      <a 
                        href="https://wa.me/918148251567?text=Hi%2C%20I%20have%20a%20query%20regarding%20LOGIN%202K26" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1FA971]/10 border border-[#1FA971]/30 hover:bg-[#1FA971]/20 text-[#1FA971] font-mono text-[10px] font-bold uppercase rounded-[2px] transition-colors"
                      >
                        💬 WHATSAPP SUPPORT (+91 81482 51567)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Message Transmission Form Terminal (lg:col-span-7) */}
          <div className="lg:col-span-7 border border-[#2A1A1D] bg-[#130C0E]/20 backdrop-blur-md rounded-[2px] p-6 relative overflow-hidden">
            <div className="corner-bracket-tl" />
            <div className="corner-bracket-br" />
            
            <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-[#6B5A5C]">
              NODE // TERMINAL_8
            </div>

            <div className="pb-4 border-b border-[#2A1A1D] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E01B22] animate-pulse" />
              <h3 className="font-mono text-xs font-bold text-[#F7F2F2] uppercase tracking-widest">
                INITIATE MESSAGE TRANSMISSION
              </h3>
            </div>

            {sent ? (
              <div className="py-10 text-center space-y-4 animate-scale-in">
                <div className="w-14 h-14 rounded-full border border-[#1FA971]/30 bg-[#1FA971]/10 flex items-center justify-center mx-auto text-[#1FA971]">
                  <Send className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-display font-black text-lg text-[#F7F2F2] uppercase tracking-wider">
                  TRANSMISSION BROADCASTED
                </h4>
                <p className="text-xs text-[#A79798] font-mono max-w-sm mx-auto leading-relaxed">
                  Your communication node has been registered. The command operations team will review and response shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-4 py-2 border border-[#E01B22]/30 hover:border-[#E01B22] text-[#F7F2F2] font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
                >
                  SEND NEW TRANSMISSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {error && (
                  <div className="p-3 bg-[#E01B22]/10 border border-[#E01B22]/40 rounded-[1px] text-[10px] font-mono text-[#E01B22] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
                {notice && (
                  <div className="p-3 bg-[#1FA971]/10 border border-[#1FA971]/40 rounded-[1px] text-[10px] font-mono text-[#1FA971]">
                    {notice}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#6B5A5C] uppercase tracking-wider block">NAME / IDENTIFIER</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#0A0607]/80 border border-[#2A1A1D] focus:border-[#E01B22]/60 px-4 py-3 rounded-[2px] font-mono text-xs text-[#F7F2F2] placeholder-[#4A383A] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#6B5A5C] uppercase tracking-wider block">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setOtp('');
                      setOtpSent(false);
                      setNotice(null);
                    }}
                    placeholder="Enter your security-cleared email"
                    className="w-full bg-[#0A0607]/80 border border-[#2A1A1D] focus:border-[#E01B22]/60 px-4 py-3 rounded-[2px] font-mono text-xs text-[#F7F2F2] placeholder-[#4A383A] outline-none transition-colors"
                  />
                </div>

                {otpSent && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-[#E01B22] uppercase tracking-wider block">EMAIL VERIFICATION CODE</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-[#0A0607]/80 border border-[#E01B22]/50 focus:border-[#E01B22] px-4 py-3 rounded-[2px] font-mono text-sm tracking-[0.35em] text-[#F7F2F2] placeholder-[#4A383A] outline-none transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#6B5A5C] uppercase tracking-wider block">MESSAGE BODY</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message details here..."
                    className="w-full bg-[#0A0607]/80 border border-[#2A1A1D] focus:border-[#E01B22]/60 px-4 py-3 rounded-[2px] font-mono text-xs text-[#F7F2F2] placeholder-[#4A383A] outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending || sendingOtp}
                    className="w-full py-3 bg-[#E01B22] hover:bg-[#FF2A2A] disabled:bg-[#E01B22]/40 text-[#F7F2F2] font-bold font-mono text-xs tracking-widest rounded-[2px] transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(224,27,34,0.3)] uppercase"
                  >
                    {sending || sendingOtp ? (
                      <>
                        <span className="w-4 h-4 border-2 border-t-transparent border-[#F7F2F2] rounded-full animate-spin" />
                        {sendingOtp ? 'SENDING VERIFICATION CODE...' : 'BROADCASTING UPLINK...'}
                      </>
                    ) : !otpSent ? (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        SEND VERIFICATION CODE
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        BROADCAST TRANSMISSION
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
