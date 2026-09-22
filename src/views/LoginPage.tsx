import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Database,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { signInWithGoogle, signInWithGitHub } from '../services/auth';

export const LoginPage: React.FC = () => {
  const { setActiveView, login, updateUserProfile } = useApp();

  // Saved credentials from local storage
  const [email, setEmail] = useState(() => {
    try {
      const saved = localStorage.getItem('skillx_saved_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email || '';
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [password, setPassword] = useState(() => {
    try {
      const saved = localStorage.getItem('skillx_saved_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.password || '';
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [rememberMe, setRememberMe] = useState(() => {
    try {
      const saved = localStorage.getItem('skillx_saved_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.rememberMe ?? true;
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; provider: string } | null>(null);

  // Custom modal for Google / GitHub email entry if user desires
  const [oauthModal, setOauthModal] = useState<'google' | 'github' | null>(null);
  const [customOauthInput, setCustomOauthInput] = useState('');

  // Fetch health and DB status on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.database) {
          setDbStatus({
            connected: data.database.connected,
            provider: data.database.provider
          });
        }
      })
      .catch(() => {
        setDbStatus({ connected: false, provider: 'local_json' });
      });
  }, []);

  // Fallback helper to verify against local browser storage
  const verifyLocalBrowserFallback = (inputEmail: string, inputPass: string) => {
    try {
      const raw = localStorage.getItem('skillx_registered_users');
      if (!raw) return { found: false };
      const users: any[] = JSON.parse(raw);
      const matched = users.find(u => u.email?.toLowerCase() === inputEmail.toLowerCase());
      if (!matched) return { found: false };
      if (matched.password !== inputPass) {
        return { found: true, passwordMatch: false };
      }
      return { found: true, passwordMatch: true, user: matched };
    } catch {
      return { found: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: password
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (rememberMe) {
          localStorage.setItem(
            'skillx_saved_credentials',
            JSON.stringify({ email: cleanEmail, password, rememberMe: true })
          );
        } else {
          localStorage.removeItem('skillx_saved_credentials');
        }

        if (data.user) {
          updateUserProfile({
            name: data.user.name,
            email: data.user.email,
            college: data.user.college,
            currentYear: data.user.currentYear,
            avatar: data.user.avatar,
            ...(data.user.targetRole ? { targetRole: data.user.targetRole } : {})
          });
        }

        login(cleanEmail, data.user);
        return;
      } else if (res.status === 401) {
        setErrorMessage('Incorrect password. Please verify your credentials and try again.');
        return;
      } else if (res.status === 404) {
        const fallback = verifyLocalBrowserFallback(cleanEmail, password);
        if (fallback.found) {
          if (fallback.passwordMatch) {
            if (rememberMe) {
              localStorage.setItem(
                'skillx_saved_credentials',
                JSON.stringify({ email: cleanEmail, password, rememberMe: true })
              );
            }
            if (fallback.user) {
              updateUserProfile({
                name: fallback.user.name,
                email: fallback.user.email,
                college: fallback.user.college,
                currentYear: fallback.user.currentYear
              });
            }
            login(cleanEmail, fallback.user);
            return;
          } else {
            setErrorMessage('Incorrect password. Please verify your credentials and try again.');
            return;
          }
        }
        setErrorMessage('No account found with this email in the database. Please sign up.');
        return;
      } else {
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
        return;
      }
    } catch (netErr) {
      console.warn('Backend login network error, checking browser offline store:', netErr);
      const fallback = verifyLocalBrowserFallback(cleanEmail, password);
      if (fallback.found && fallback.passwordMatch) {
        if (fallback.user) {
          updateUserProfile({
            name: fallback.user.name,
            email: fallback.user.email,
            college: fallback.user.college,
            currentYear: fallback.user.currentYear
          });
        }
        login(cleanEmail, fallback.user);
        return;
      } else if (fallback.found && !fallback.passwordMatch) {
        setErrorMessage('Incorrect password. Please try again.');
        return;
      }
      setErrorMessage('Unable to connect to authentication server. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Login Trigger
  const handleGoogleLogin = async (customEmail?: string) => {
    setErrorMessage('');
    setOauthLoading('google');
    try {
      const res = await signInWithGoogle(customEmail);
      if (res.success && res.user) {
        updateUserProfile({
          name: res.user.name,
          email: res.user.email,
          avatar: res.user.avatar,
          college: res.user.college || 'Campus / Self Taught',
          currentYear: res.user.currentYear || '1st Year',
          targetRole: res.user.targetRole || 'Cloud Engineer'
        });
        login(res.user.email, res.user);
      } else {
        setErrorMessage(res.message || 'Google Sign-In was not completed.');
      }
    } catch (err: any) {
      setErrorMessage('Google Sign-In encountered an issue: ' + (err.message || 'Please try again.'));
    } finally {
      setOauthLoading(null);
      setOauthModal(null);
    }
  };

  // GitHub OAuth Login Trigger
  const handleGitHubLogin = async (customUsername?: string) => {
    setErrorMessage('');
    setOauthLoading('github');
    try {
      const res = await signInWithGitHub(customUsername);
      if (res.success && res.user) {
        updateUserProfile({
          name: res.user.name,
          email: res.user.email,
          avatar: res.user.avatar,
          college: res.user.college || 'Tech Institute',
          currentYear: res.user.currentYear || '1st Year',
          targetRole: res.user.targetRole || 'Full Stack Developer'
        });
        login(res.user.email, res.user);
      } else {
        setErrorMessage(res.message || 'GitHub Sign-In was not completed.');
      }
    } catch (err: any) {
      setErrorMessage('GitHub Sign-In encountered an issue: ' + (err.message || 'Please try again.'));
    } finally {
      setOauthLoading(null);
      setOauthModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#dadce0] p-8 sm:p-10 shadow-xs relative">
        {/* Database Status Pill */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#f1f3f4] text-[#5f6368]">
          <Database className="w-3 h-3 text-[#1a73e8]" />
          <span>{dbStatus?.connected ? 'Neon DB' : 'Neon Ready'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? 'bg-[#137333]' : 'bg-[#fbbc04]'}`} />
        </div>

        {/* Brand */}
        <div className="text-center mb-7">
          <div
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 cursor-pointer select-none mb-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-medium tracking-tight text-[#202124]">
              Skill<span className="text-[#1a73e8] font-bold">X</span>
            </span>
          </div>

          <h2 className="text-2xl font-normal text-[#202124] tracking-tight mt-1">Sign in</h2>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-1">to continue to SkillX Career Platform</p>
        </div>

        {/* Quick Demo Autofill Banner */}
        <div className="mb-4 p-3 rounded-xl bg-[#e8f0fe]/70 border border-[#d2e3fc] flex items-center justify-between text-xs text-[#1a73e8]">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Demo: <strong>rahul@example.com</strong></span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('rahul@example.com');
              setPassword('password123');
              setErrorMessage('');
            }}
            className="text-xs font-semibold underline hover:text-[#1557d0] cursor-pointer shrink-0"
          >
            Autofill
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-[#3c4043]">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to ' + (email || 'your email'))}
                className="text-xs font-medium text-[#1a73e8] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] transition-all"
            />
          </div>

          {/* Remember me option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#5f6368]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8] focus:ring-[#1a73e8] cursor-pointer"
              />
              <span>Remember credentials</span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveView('signup')}
              className="text-sm font-medium text-[#1a73e8] hover:bg-[#f1f3f4] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Create account
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557d0] disabled:bg-[#1a73e8]/70 text-white font-medium rounded-full text-sm transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8eaed]" />
          </div>
          <span className="relative px-3 bg-white text-xs font-normal text-[#5f6368]">
            or sign in with
          </span>
        </div>

        {/* OAuth Buttons (Google & GitHub) */}
        <div className="space-y-2.5">
          {/* Google Sign In */}
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={oauthLoading !== null}
              onClick={() => handleGoogleLogin('student.google@gmail.com')}
              className="flex-1 py-2.5 px-4 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] disabled:opacity-60 text-[#3c4043] text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.54 0 2.92.54 4.01 1.43l3-3C17.2 1.7 14.78 1 12 1 7.42 1 3.51 3.58 1.63 7.33l3.69 2.86C6.2 7.28 8.87 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.81c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.63 7.33C.59 9.4 0 11.64 0 14s.59 4.6 1.63 6.67l3.69-2.86z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.13 0-5.8-2.28-6.68-5.19L1.63 16.05C3.51 19.8 7.42 23 12 23z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              title="Sign in with specific Google Account"
              onClick={() => {
                setCustomOauthInput('');
                setOauthModal('google');
              }}
              className="px-3 py-2 rounded-full border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#5f6368] text-xs font-semibold cursor-pointer"
            >
              Custom
            </button>
          </div>

          {/* GitHub Sign In */}
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={oauthLoading !== null}
              onClick={() => handleGitHubLogin('developer-github')}
              className="flex-1 py-2.5 px-4 rounded-full border border-[#dadce0] bg-[#24292f] hover:bg-[#1b1f23] disabled:opacity-60 text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              {oauthLoading === 'github' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>Continue with GitHub</span>
            </button>

            <button
              type="button"
              title="Sign in with specific GitHub Account"
              onClick={() => {
                setCustomOauthInput('');
                setOauthModal('github');
              }}
              className="px-3 py-2 rounded-full border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#5f6368] text-xs font-semibold cursor-pointer"
            >
              Custom
            </button>
          </div>
        </div>

        {/* Custom OAuth Account Modal */}
        {oauthModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#dadce0] p-6 max-w-sm w-full shadow-lg animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {oauthModal === 'google' ? (
                    <div className="w-7 h-7 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                      <span className="text-xs font-bold text-[#1a73e8]">G</span>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#24292f] text-white flex items-center justify-center">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </div>
                  )}
                  <h3 className="font-semibold text-sm text-[#202124]">
                    {oauthModal === 'google' ? 'Google Account Login' : 'GitHub Account Login'}
                  </h3>
                </div>
                <button
                  onClick={() => setOauthModal(null)}
                  className="text-[#5f6368] hover:text-[#202124] p-1 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#5f6368] mb-3">
                {oauthModal === 'google'
                  ? 'Enter your Google email address to authenticate with Neon DB:'
                  : 'Enter your GitHub username to connect your developer profile:'}
              </p>

              <input
                type={oauthModal === 'google' ? 'email' : 'text'}
                value={customOauthInput}
                onChange={(e) => setCustomOauthInput(e.target.value)}
                placeholder={oauthModal === 'google' ? 'user@gmail.com' : 'github-username'}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] text-[#202124] mb-4"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOauthModal(null)}
                  className="px-3.5 py-1.5 text-xs text-[#5f6368] hover:bg-[#f1f3f4] rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (oauthModal === 'google') {
                      handleGoogleLogin(customOauthInput.trim() || 'student.google@gmail.com');
                    } else {
                      handleGitHubLogin(customOauthInput.trim() || 'github-developer');
                    }
                  }}
                  className="px-4 py-1.5 text-xs bg-[#1a73e8] hover:bg-[#1557d0] text-white font-medium rounded-full cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
