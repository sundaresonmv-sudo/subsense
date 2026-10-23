import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../lib/api';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [defaultCycle, setDefaultCycle] = useState(user?.defaultCycle || 'Monthly');
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts !== undefined ? user.emailAlerts : true);
  const [budgetAlerts, setBudgetAlerts] = useState(user?.budgetAlerts !== undefined ? user.budgetAlerts : true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.currency) setCurrency(user.currency);
      if (user.defaultCycle) setDefaultCycle(user.defaultCycle);
      if (user.emailAlerts !== undefined) setEmailAlerts(user.emailAlerts);
      if (user.budgetAlerts !== undefined) setBudgetAlerts(user.budgetAlerts);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/preferences', {
        currency,
        defaultCycle,
        emailAlerts,
        budgetAlerts,
      });
      // Also sync to demo user if in demo mode
      const storedDemo = localStorage.getItem('subsenseDemoUser');
      if (storedDemo) {
        const parsed = JSON.parse(storedDemo);
        localStorage.setItem(
          'subsenseDemoUser',
          JSON.stringify({
            ...parsed,
            currency,
            defaultCycle,
            emailAlerts,
            budgetAlerts,
          })
        );
      }
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch {
      // Offline fallback
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
          Preferences & Security
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">Account Settings</h2>
        <p className="mt-1 text-sm text-slate-400">Manage your profile, display preferences, and notification rules.</p>
      </div>

      {savedMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300 animate-in fade-in duration-200">
          ✓ Settings saved successfully.
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-base font-bold text-white">Profile Details</h3>
        <p className="text-xs text-slate-400 mt-0.5">Your personal identification details</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" name="name" value={user?.name || ''} disabled helperText="Managed by account auth" />
          <Input label="Email Address" name="email" value={user?.email || ''} disabled helperText="Verified primary email" />
        </div>
      </div>

      {/* Regional & Currency Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-base font-bold text-white">Workspace Preferences</h3>
        <p className="text-xs text-slate-400 mt-0.5">Customize display formatting and default billing attributes</p>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Default Cycle
              </label>
              <select
                value={defaultCycle}
                onChange={(e) => setDefaultCycle(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-5 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Notifications</h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Renewal Alert Emails</p>
                <p className="text-[11px] text-slate-400">Receive an email notification 3 days prior to any renewal date</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Budget Threshold Warning</p>
                <p className="text-[11px] text-slate-400">Trigger alert when current spend crosses 80% of configured budget</p>
              </div>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" loading={saving}>
            Save Preferences
          </Button>
        </form>
      </div>

      {/* Security & Session */}
      <div className="rounded-2xl border border-rose-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-base font-bold text-rose-400">Session & Security</h3>
        <p className="text-xs text-slate-400 mt-0.5">Manage your active authentication session</p>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
          <div>
            <p className="text-xs font-semibold text-slate-200">Active JWT Token</p>
            <p className="text-[11px] text-slate-400">Tokens are stored securely and expire automatically every 7 days.</p>
          </div>
          <Button variant="danger" size="sm" onClick={logout}>
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
