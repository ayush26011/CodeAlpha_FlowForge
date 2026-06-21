import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Logo from '../components/ui/Logo';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGoogleLine, RiArrowRightLine } from 'react-icons/ri';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#0E0F0B' }}>
      
      {/* 3D abstract vector backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full blur-[110px] opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, rgba(86,84,73,0.4) 0%, transparent 70%)' }} />
        
        {/* Fine background grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(216,207,188,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(216,207,188,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Geometric lightweight SVG outline visual */}
        <svg className="absolute top-[20%] right-[10%] w-[300px] h-[300px] opacity-[0.06] text-bone" fill="none" stroke="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" strokeWidth="0.5" strokeDasharray="3 3" />
          <polygon points="50,10 90,80 10,80" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Logo and brand message */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-2 mb-4"
        >
          <Logo size="lg" />
          <p className="text-3xs text-olive uppercase tracking-widest font-bold">Forge Ideas Into Reality</p>
        </motion.div>

        {/* Floating Glassmorphic Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.4 }}
          className="rounded-2xl p-7 border relative overflow-hidden"
          style={{
            background: 'rgba(22,23,16,0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(86,84,73,0.18)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold text-floral tracking-tight">Welcome back</h2>
            <p className="text-xs text-olive">Sign in to your collaborative workspace</p>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Social login buttons */}
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-2 border border-white/5 text-bone text-xs font-bold hover:bg-white/5 transition-all duration-200 mb-5">
            <RiGoogleLine className="text-base text-olive" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-3xs text-olive uppercase tracking-wider font-bold">or continue with email</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1.5 block">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive/60" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="name@company.com"
                  className="input pl-10 text-xs py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive/60" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="input pl-10 pr-10 text-xs py-2.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-olive/70 hover:text-bone transition-colors"
                >
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-3.5 h-3.5 rounded bg-surface-2 border-white/5 accent-bronze" />
                <span className="text-xs text-olive">Keep me signed in</span>
              </label>
              <a href="#" className="text-xs text-bronze hover:underline font-semibold">Forgot?</a>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 justify-center text-xs uppercase tracking-wider font-bold">
              Sign In
              <RiArrowRightLine className="text-sm" />
            </button>
          </form>

          <p className="text-center text-xs text-olive mt-6">
            New to FlowForge?{' '}
            <Link to="/register" className="text-bronze hover:underline font-bold transition-all">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
