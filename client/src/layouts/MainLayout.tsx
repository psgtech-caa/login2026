import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Clock3, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Ticker } from '../components/Ticker';
import { UnpaidBanner } from '../components/UnpaidBanner';
import { Footer } from '../components/Footer';
import { IntroVideo } from '../components/IntroVideo';
import { CommandSearchModal } from '../components/CommandSearchModal';
import { SpidermanCompanion } from '../components/home/SpidermanCompanion';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const { token, user, setUser, resetAuth, setInitialized } = useAuthStore();
  const [showIntro, setShowIntro] = useState<boolean>(() => localStorage.getItem('hasPlayedIntro') !== 'true');
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  const [showRegistrationNotice, setShowRegistrationNotice] = useState(false);
  const [registrationDaysLeft, setRegistrationDaysLeft] = useState(0);

  const getRegistrationDaysLeft = () => {
    const deadline = new Date('2026-09-12T23:59:59+05:30').getTime();
    return Math.max(0, Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (showIntro || sessionStorage.getItem('registration-notice-dismissed') === 'true') return;

    setRegistrationDaysLeft(getRegistrationDaysLeft());
    setShowRegistrationNotice(true);
    const countdownTimer = window.setInterval(() => setRegistrationDaysLeft(getRegistrationDaysLeft()), 60_000);
    const dismissTimer = window.setTimeout(() => {
      sessionStorage.setItem('registration-notice-dismissed', 'true');
      setShowRegistrationNotice(false);
    }, 10_000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [showIntro]);

  useEffect(() => {
    const syncProfile = async () => {
      if (token && !user) {
        try {
          const res = await api.users.profile();
          if (res.data) {
            setUser(res.data);
          }
        } catch (err) {
          console.warn('Invalid token or session expired');
          resetAuth();
        } finally {
          setInitialized(true);
        }
      } else {
        setInitialized(true);
      }
    };

    syncProfile();
  }, [token, user, setUser, resetAuth, setInitialized]);

  const dismissRegistrationNotice = () => {
    sessionStorage.setItem('registration-notice-dismissed', 'true');
    setShowRegistrationNotice(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0607] text-[#F7F2F2] selection:bg-[#E01B22] selection:text-[#F7F2F2] relative">
      {/* Intro Video Overlay (Accessible overlay; does not unmount semantic DOM for crawlers) */}
      {showIntro && <IntroVideo onComplete={() => setShowIntro(false)} />}

      {/* Header & Navigation */}
      {!showIntro && <Navbar onOpenCommandSearch={() => setCommandSearchOpen(true)} />}

      {!showIntro && showRegistrationNotice && (
        <div className="flex justify-center px-4 py-2 bg-[#0A0607] border-b border-[#2A1A1D]">
          <div className="flex items-center gap-2 border border-[#E01B22]/60 bg-[#18090D] px-3 py-1.5 text-[10px] font-mono text-[#F7F2F2] shadow-[0_0_14px_rgba(224,27,34,0.2)]">
            <Clock3 className="w-3.5 h-3.5 text-[#E01B22] shrink-0" />
            <Link to="/events" onClick={dismissRegistrationNotice} className="hover:text-[#FF4545] text-center">
              REGISTRATIONS CLOSE IN {registrationDaysLeft} {registrationDaysLeft === 1 ? 'DAY' : 'DAYS'}. FILL YOUR SLOT.
            </Link>
            <button onClick={dismissRegistrationNotice} aria-label="Dismiss registration notice" className="text-[#A79798] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Announcements Ticker (Renders ONLY if active announcements exist) */}
      <Ticker />

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="h-full">
          <Outlet />
        </div>
      </main>

      {/* Conditionally hide public footer and global unpaid banner on dashboard routes */}
      {!location.pathname.startsWith('/dashboard') && (
        <>
          <UnpaidBanner />
          <Footer onReplayIntro={() => setShowIntro(true)} />
        </>
      )}

      {/* Command Search Modal (Ctrl+K) */}
      <CommandSearchModal
        isOpen={commandSearchOpen}
        onClose={() => setCommandSearchOpen(false)}
      />

      {/* Spider-Man Protocol Companion on Scroll (Desktop & Mobile) */}
      <SpidermanCompanion />
    </div>
  );
};
