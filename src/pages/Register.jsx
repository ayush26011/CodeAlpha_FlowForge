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
    <div className="min-h-screen bg-smoky flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-bronze/6 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-olive/8 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 mb-10"
        >
          <Logo size="lg" />
          <p className="text-sm text-olive">Forge Ideas Into Reality</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8"
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
