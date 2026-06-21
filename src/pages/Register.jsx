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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(155,130,96,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(86,84,73,0.5) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(216,207,188,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(216,207,188,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-3 mb-8"
        >
          <Logo size="lg" />
          <p className="text-xs text-olive/70 tracking-widest uppercase">Forge Ideas Into Reality</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(22,23,16,0.8)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            border: '1px solid rgba(42,44,34,0.9)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <h2 className="text-2xl font-bold text-floral mb-1">Create account</h2>
          <p className="text-sm text-olive mb-8">Start your free workspace today</p>

          {errors.api && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
              {errors.api}
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-surface-2 border border-border text-bone text-sm font-medium hover:bg-surface-3 transition-all duration-200 mb-6">
            <RiGoogleLine className="text-lg" />
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-olive">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
                <input value={form.name} onChange={set('name')} placeholder="Your name"
                  className={`input pl-10 ${errors.name ? 'border-red-700 focus:border-red-600' : ''}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                  className={`input pl-10 ${errors.email ? 'border-red-700 focus:border-red-600' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min 8 characters"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-700 focus:border-red-600' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-olive hover:text-bone"
                >
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-olive" />
                <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password"
                  className={`input pl-10 ${errors.confirm ? 'border-red-700 focus:border-red-600' : ''}`}
                />
              </div>
              {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
            </div>

            <p className="text-xs text-olive">
              By signing up you agree to our{' '}
              <a href="#" className="text-bronze">Terms of Service</a> and{' '}
              <a href="#" className="text-bronze">Privacy Policy</a>.
            </p>

            <button type="submit" className="w-full btn-primary py-3 justify-center text-base">
              Create Account
              <RiArrowRightLine />
            </button>
          </form>

          <p className="text-center text-sm text-olive mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-bronze hover:text-bronze-light transition-colors font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
