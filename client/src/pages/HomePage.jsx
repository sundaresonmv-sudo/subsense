import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Subscription Tracking',
      desc: 'Consolidate every active SaaS, cloud, streaming, and tool license in one clean centralized dashboard.',
      icon: (
        <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      title: 'Renewal Alerts',
      desc: 'Never get hit with unexpected auto-renewals. Receive proactive reminders before charges go through.',
      icon: (
        <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Spend Analytics',
      desc: 'Gain deep visibility into your monthly, quarterly, and annual recurring expenses categorized by domain.',
      icon: (
        <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: 'Budget Guardrails',
      desc: 'Set custom spending caps by department or personal category to prevent unwanted subscription creep.',
      icon: (
        <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="glass-header sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SubSense</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Modern SaaS Subscription & Expense Manager
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Take complete control of your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              recurring expenses.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Eliminate ghost subscriptions, forecast upcoming renewals, and optimize software spend with real-time
            analytics designed for teams and modern builders.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  Open SubSense Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Start Tracking Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign in to Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">$2,480</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Avg. Annual Saved</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Zero Missed Renewals</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">8+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Service Categories</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-400">Bank-Grade</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Security & Privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Core Capabilities</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for absolute clarity.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform duration-200">
                  {feat.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SubSense. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-cyan-400 transition-colors">
              Register
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
