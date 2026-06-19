import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiFlowChart, RiArrowRightLine, RiKanbanView2, RiTeamLine, RiBarChartLine, RiCalendarLine, RiShieldCheckLine, RiFlashlightLine } from 'react-icons/ri';

const features = [
  { icon: RiKanbanView2, title: 'Visual Boards', desc: 'Drag-and-drop Kanban boards to manage your workflow with clarity and speed.' },
  { icon: RiTeamLine, title: 'Team Collaboration', desc: 'Real-time updates, mentions, and shared workspaces keep your team in sync.' },
  { icon: RiBarChartLine, title: 'Progress Insights', desc: 'Track velocity, burndown, and productivity metrics with beautiful dashboards.' },
  { icon: RiCalendarLine, title: 'Smart Calendar', desc: 'Visualize deadlines and plan sprints with an integrated calendar view.' },
  { icon: RiShieldCheckLine, title: 'Permissions & Roles', desc: 'Fine-grained access control for admins, members, and guests.' },
  { icon: RiFlashlightLine, title: 'Automation', desc: 'Automate repetitive workflows and focus on what actually matters.' },
];

const stats = [
  { value: '10,000+', label: 'Teams worldwide' },
  { value: '2.4M', label: 'Tasks completed' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'Average rating' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-smoky text-bone overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-smoky/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-bronze flex items-center justify-center shadow-glow">
            <RiFlowChart className="text-floral text-lg" />
          </div>
          <span className="text-floral font-bold text-lg tracking-tight">FlowForge</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'About', 'Blog'].map(item => (
            <a key={item} href="#" className="text-sm text-olive hover:text-bone transition-colors duration-200">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bronze/8 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bronze/10 border border-bronze/20 text-bronze-light text-xs font-medium mb-6">
            <RiFlashlightLine />
            Now in public beta — free for teams under 5
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-floral leading-[1.05] tracking-tight mb-6">
            Where great work<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-bone">
              gets forged.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-olive max-w-2xl mx-auto mb-10 leading-relaxed">
            FlowForge brings your team's projects, tasks, and conversations into one elegant workspace. 
            Move fast without the mess.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="btn-primary text-base px-6 py-3 shadow-glow">
              Start for free
              <RiArrowRightLine />
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary text-base px-6 py-3">
              View demo →
            </button>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="relative z-10 mt-16 w-full max-w-5xl"
        >
          <div className="rounded-2xl border border-border bg-surface shadow-modal overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-surface-3 rounded-md px-3 py-1 text-xs text-olive max-w-xs mx-auto text-center">
                  app.flowforge.io/dashboard
                </div>
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="p-6 bg-smoky min-h-[300px]">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Active Tasks', val: '24', color: 'text-bone' },
                  { label: 'Completed', val: '142', color: 'text-green-400' },
                  { label: 'Overdue', val: '3', color: 'text-red-400' },
                  { label: 'Team Members', val: '6', color: 'text-bronze-light' },
                ].map(s => (
                  <div key={s.label} className="card p-4">
                    <p className="text-xs text-olive mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['FlowForge v2.0', 'API Gateway', 'Design System'].map((p, i) => (
                  <div key={p} className="card p-4">
                    <p className="text-sm font-semibold text-bone mb-2">{p}</p>
                    <div className="w-full h-1.5 bg-surface-2 rounded-full">
                      <div className="h-full bg-bronze rounded-full" style={{ width: `${[68, 45, 80][i]}%` }} />
                    </div>
                    <p className="text-xs text-olive mt-1">{[68, 45, 80][i]}% complete</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow reflection */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-smoky to-transparent" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border bg-surface/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-extrabold text-floral mb-1">{s.value}</p>
              <p className="text-sm text-olive">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-floral mb-4">Everything your team needs</h2>
            <p className="text-olive text-lg max-w-xl mx-auto">Built for modern product teams. No bloat, no complexity — just the tools that matter.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="card card-hover p-6 group"
              >
                <div className="w-10 h-10 rounded-xl bg-bronze/10 border border-bronze/20 flex items-center justify-center mb-4 group-hover:bg-bronze/20 transition-colors">
                  <f.icon className="text-bronze-light text-xl" />
                </div>
                <h3 className="text-base font-semibold text-bone mb-2">{f.title}</h3>
                <p className="text-sm text-olive leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-floral mb-4">Built for teams of all sizes</h2>
          <p className="text-olive text-lg mb-12">From solo founders to enterprise teams — FlowForge scales with you.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Engineering', 'Design', 'Marketing', 'Product', 'Operations', 'Sales'].map(team => (
              <span key={team} className="px-4 py-2 rounded-full bg-surface-2 border border-border text-sm text-bone">
                {team}
              </span>
            ))}
          </div>
          <button onClick={() => navigate('/register')} className="btn-primary text-base px-8 py-3.5 shadow-glow">
            Start building with your team
            <RiArrowRightLine />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-bronze flex items-center justify-center">
              <RiFlowChart className="text-floral text-sm" />
            </div>
            <span className="text-sm font-semibold text-bone">FlowForge</span>
          </div>
          <p className="text-xs text-olive">© 2024 FlowForge. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Status'].map(item => (
              <a key={item} href="#" className="text-xs text-olive hover:text-bone transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
