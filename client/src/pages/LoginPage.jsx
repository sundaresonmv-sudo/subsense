import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginDemo } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-50 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SubSense</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-1.5 text-xs text-slate-400">Sign in to access your subscriptions and analytics.</p>
        </div>

        {/* Error Alert */}
        {error && <ErrorMessage message={error} className="mt-5" onDismiss={() => setError('')} />}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Sign In
          </Button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400">
              or college review demo
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleDemoLogin}
            className="w-full border-cyan-500/30 bg-slate-800/80 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400"
          >
            ⚡ Quick Prototype Access (Demo)
          </Button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            Create one free
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
