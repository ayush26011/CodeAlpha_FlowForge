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
      {/* Premium background: gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(155,130,96,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(86,84,73,0.5) 0%, transparent 70%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(216,207,188,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(216,207,188,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-3 mb-8"
        >
          <Logo size="lg" />
          <p className="text-xs text-olive/70 tracking-widest uppercase">Forge Ideas Into Reality</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(22,23,16,0.8)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            border: '1px solid rgba(42,44,34,0.9)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <h2 className="text-2xl font-bold text-floral mb-1">Welcome back</h2>
          <p className="text-sm text-olive mb-8">Sign in to your workspace</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-surface-2 border border-border text-bone text-sm font-medium hover:bg-surface-3 transition-all duration-200 mb-6">
            <RiGoogleLine className="text-lg" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-olive">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@company.com"
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Your password"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-olive hover:text-bone transition-colors"
                >
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-surface-2 border-border accent-bronze" />
                <span className="text-sm text-olive">Remember me</span>
              </label>
              <a href="#" className="text-sm text-bronze hover:text-bronze-light transition-colors">Forgot password?</a>
            </div>
            <button type="submit" className="w-full btn-primary py-3 justify-center text-base">
              Sign In
              <RiArrowRightLine />
            </button>
          </form>

          <p className="text-center text-sm text-olive mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-bronze hover:text-bronze-light transition-colors font-medium">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
