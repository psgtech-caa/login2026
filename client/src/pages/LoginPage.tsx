import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const location = useLocation();
  
  const [loginId, setLoginId] = useState(location.state?.prefillLoginId || '');
  const [password, setPassword] = useState(location.state?.prefillPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishLogin = (user: any, token: string) => {
    const normalizedRole = String(user.role || 'participant').toLowerCase();
    if (String(user.user_type || '').toUpperCase() === 'ALUMNI') {
      setError('Alumni accounts do not have portal login access.');
      return;
    }

    setAuth(true, token, { ...user, role: normalizedRole });
    if (user.must_change_password) {
      navigate('/change-password');
    } else if (['admin', 'registration_desk'].includes(normalizedRole)) {
      navigate('/dashboard/admin');
    } else if (normalizedRole === 'coordinator') {
      navigate('/dashboard/coordinator');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginId.trim() || !password) {
      setError('LOGIN ID / Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const trimmed = loginId.trim();
      const payload = trimmed.includes('@')
        ? { email: trimmed.toLowerCase(), password }
        : { loginId: trimmed.toUpperCase(), password };

      const res = await api.auth.login(payload);
      const { token, user } = res.data;
      finishLogin(user, token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setGoogleLoading(true);
      try {
        const res = await api.auth.googleLogin({ accessToken: tokenResponse.access_token });
        finishLogin(res.data.user, res.data.token);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed. Please try again.');
    },
  });


  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0607] relative overflow-hidden">
      <SEOHead
        title="Participant Portal Sign In | LOGIN 2026 PSG Tech"
        description="Sign in to your LOGIN 2026 participant dashboard to view event registrations, schedule, certificates, and scores."
        canonicalUrl="/login"
        noIndex={true}
      />
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A050A]/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl space-y-7 animate-scale-in relative corner-bracket-container">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full border border-[#E01B22]/40 bg-[#0A0607] flex items-center justify-center animate-pulse-glow">
            <ShieldCheck className="w-7 h-7 text-[#E01B22]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#F7F2F2] tracking-wider">PORTAL AUTHENTICATION</h1>
          <p className="text-xs font-mono text-[#6B5A5C]">Sign in with your LOGIN ID to access the platform</p>
        </div>

        {error && (
          <div className="bg-[#9B0A12]/20 border border-[#E01B22]/60 p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#FF2A2A] animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-body">
          <div>
            <label className="block text-[#A79798] mb-1.5 font-semibold text-xs">
              LOGIN ID or Email Address *
            </label>
            <div className="relative">
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="LOGIN101 or user@domain.com"
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-3 pl-11 text-[#F7F2F2] outline-none input-glow text-sm font-mono tracking-wider"
              />
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5A5C]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#A79798] font-semibold text-xs">Password *</label>
              <Link to="/forgot-password" className="text-[11px] text-[#E01B22] hover:text-[#FF2A2A] link-underline transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-3 pr-11 text-[#F7F2F2] outline-none input-glow text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A79798] hover:text-[#F7F2F2]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn w-full py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold font-mono rounded-[2px] transition-all hover:shadow-[0_0_25px_rgba(224,27,34,0.4)] flex items-center justify-center gap-2 mt-2 text-sm disabled:opacity-60"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#6B5A5C] uppercase tracking-[0.2em]">
              <span className="h-px flex-1 bg-[#2A1A1D]" />
              <span>OR AUTHENTICATE WITH</span>
              <span className="h-px flex-1 bg-[#2A1A1D]" />
            </div>
            
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={googleLoading}
              className="w-full py-3 px-4 bg-[#0A0607] hover:bg-[#18090D] border border-[#2A1A1D] hover:border-[#E01B22] text-[#F7F2F2] hover:text-white font-mono font-bold text-xs tracking-wider uppercase rounded-[2px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(224,27,34,0.3)] flex items-center justify-center gap-3 group disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden"
            >
              {googleLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#E01B22] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[#A79798]">CONNECTING TO GOOGLE...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 duration-200" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.56 0 2.96.54 4.07 1.43l3.05-3.05C17.27 1.62 14.8 1 12 1 7.37 1 3.48 3.65 1.63 7.51l3.66 2.84C6.17 7.42 8.85 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.68 2.85c2.14-1.98 3.74-4.89 3.74-8.67z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.29 14.65c-.23-.68-.36-1.41-.36-2.15s.13-1.47.36-2.15L1.63 7.51C.59 9.58 0 11.97 0 14.5s.59 4.92 1.63 6.99l3.66-2.84z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.68-2.85c-1.07.72-2.44 1.16-4.25 1.16-3.15 0-5.83-2.42-6.71-5.35L1.63 16.89C3.48 20.75 7.37 24 12 24z"
                    />
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#E01B22]/40 group-hover:bg-[#E01B22] transition-colors" />
                </>
              )}
            </button>
          </div>
        ) : null}

        <div className="text-center text-xs text-[#6B5A5C] border-t border-[#2A1A1D] pt-5">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#E01B22] hover:text-[#FF2A2A] font-bold link-underline transition-colors">
            Create Participant account
          </Link>
        </div>

      </div>
    </div>
  );
};
