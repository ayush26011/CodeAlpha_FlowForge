import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Logo from '../components/ui/Logo';
import { RiMailLine, RiLockLine, RiUserLine, RiEyeLine, RiEyeOffLine, RiGoogleLine, RiArrowRightLine } from 'react-icons/ri';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ api: err.message });
    }
  };

  const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: '#0E0F0B' }}>
      
      {/* Visual background details */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full blur-[110px] opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, rgba(86,84,73,0.4) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(216,207,188,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(216,207,188,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Isometric SVG geometric lines overlay */}
        <svg className="absolute bottom-[15%] left-[8%] w-[280px] h-[280px] opacity-[0.05] text-bone" fill="none" stroke="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
          <polygon points="50,15 85,75 15,75" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="15" y1="75" x2="85" y2="75" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-2 mb-4"
        >
          <Logo size="lg" />
          <p className="text-3xs text-olive uppercase tracking-widest font-bold">Forge Ideas Into Reality</p>
        </motion.div>

        {/* Floating Glass Register Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.4 }}
          className="rounded-2xl p-7 border relative overflow-hidden"
          style={{
            background: 'rgba(22,23,16,0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(86,84,73,0.18)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold text-floral tracking-tight">Create Account</h2>
            <p className="text-xs text-olive">Start your premium workspace today</p>
          </div>

          {errors.api && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-950/20 border border-red-800/30 text-red-400 text-xs font-semibold">
              {errors.api}
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-2 border border-white/5 text-bone text-xs font-bold hover:bg-white/5 transition-all duration-200 mb-5">
            <RiGoogleLine className="text-base text-olive" />
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-3xs text-olive uppercase tracking-wider font-bold">or register with email</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive/60" />
                <input value={form.name} onChange={set('name')} placeholder="Your name"
                  className={`input pl-10 text-xs py-2.5 ${errors.name ? 'border-red-900/50' : ''}`}
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1.5 block">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive/60" />
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                  className={`input pl-10 text-xs py-2.5 ${errors.email ? 'border-red-900/50' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive/60" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min 8 characters"
                  className={`input pl-10 pr-10 text-xs py-2.5 ${errors.password ? 'border-red-900/50' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-olive/70 hover:text-bone"
                >
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1.5 block">Confirm password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive/60" />
                <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password"
                  className={`input pl-10 text-xs py-2.5 ${errors.confirm ? 'border-red-900/50' : ''}`}
                />
              </div>
              {errors.confirm && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.confirm}</p>}
            </div>

            <p className="text-[10px] text-olive/70 leading-relaxed pt-1">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-bronze hover:underline font-semibold">Terms</a> and{' '}
              <a href="#" className="text-bronze hover:underline font-semibold">Privacy Policy</a>.
            </p>

            <button type="submit" className="w-full btn-primary py-2.5 justify-center text-xs uppercase tracking-wider font-bold">
              Create Account
              <RiArrowRightLine className="text-sm" />
            </button>
          </form>

          <p className="text-center text-xs text-olive mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-bronze hover:underline font-bold transition-all">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
