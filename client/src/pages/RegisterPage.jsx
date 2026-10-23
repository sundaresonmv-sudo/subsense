import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="mt-1.5 text-xs text-slate-400">Start organizing and tracking your subscriptions.</p>
        </div>

        {/* Error Alert */}
        {error && <ErrorMessage message={error} className="mt-5" onDismiss={() => setError('')} />}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Alex Morgan"
            required
            autoComplete="name"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          />

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
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
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

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat password"
            required
            autoComplete="new-password"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
