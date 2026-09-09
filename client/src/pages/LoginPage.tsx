import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { AlertCircle, ShieldCheck, KeyRound, User, Eye, EyeOff } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your LOGIN ID or Email Address.');
      return;
    }
    if (!password) {
      setError('Please enter your Password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.login({ loginId: identifier.trim(), password });
      finishLogin(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid login credentials. Please try again.');
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
        if (err.response?.status === 404) {
          const googleEmail = err.response.data?.email;
          navigate('/register', { state: { prefillEmail: googleEmail, infoMessage: 'No account found with this Google account. Please create an account first.' } });
        } else {
          setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
        }
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
        description="Sign in to your LOGIN 2026 participant dashboard using your LOGIN ID or Email to view event registrations, schedule, certificates, and scores."
        canonicalUrl="/login"
        noIndex={true}
      />
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A050A]/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl space-y-6 animate-scale-in relative corner-bracket-container">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full border border-[#E01B22]/40 bg-[#0A0607] flex items-center justify-center animate-pulse-glow">
            <ShieldCheck className="w-6 h-6 text-[#E01B22]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#F7F2F2] tracking-wider uppercase">PORTAL AUTHENTICATION</h1>
          <p className="text-xs font-mono text-[#6B5A5C]">Sign in with Email or LOGIN ID</p>
        </div>

        {error && (
          <div className="bg-[#9B0A12]/20 border border-[#E01B22]/60 p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#FF2A2A] animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Login Form */}
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#A79798] uppercase font-bold mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E01B22]" />
              Email or LOGIN ID *
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. LOGIN101 or email@example.com"
              required
              className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] text-[#F7F2F2] px-3.5 py-2.5 rounded-[2px] font-mono text-xs focus:outline-none transition-colors placeholder-[#4A3D40]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono text-[#A79798] uppercase font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#E01B22]" />
                Password *
              </label>
              <Link to="/forgot-password" className="text-[10px] font-mono text-[#E01B22] hover:text-[#FF2A2A] transition-colors">
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
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] text-[#F7F2F2] px-3.5 py-2.5 pr-10 rounded-[2px] font-mono text-xs focus:outline-none transition-colors placeholder-[#4A3D40]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9AA2] hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#E01B22] hover:bg-[#FF2A2A] text-white font-mono font-bold text-xs tracking-wider uppercase rounded-[2px] transition-all duration-300 shadow-[0_0_20px_rgba(224,27,34,0.3)] hover:shadow-[0_0_30px_rgba(224,27,34,0.5)] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <span>SIGN IN →</span>
            )}
          </button>
        </form>

        {/* Divider */}
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A1A1D]" />
            </div>
            <span className="relative px-3 bg-[#130C0E] font-mono text-[10px] text-[#6B5A5C] tracking-widest uppercase">
              OR
            </span>
          </div>
        )}

        {/* Google Sign In Option */}
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <div className="w-full">
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

        <div className="text-center text-xs text-[#6B5A5C] border-t border-[#2A1A1D] pt-4">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#E01B22] hover:text-[#FF2A2A] font-bold link-underline transition-colors">
            Create Participant account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
