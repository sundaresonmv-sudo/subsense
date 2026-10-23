import { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import { BUDGET_SUMMARY, getStoredSubscriptions } from '../lib/mockData';

const BudgetPage = () => {
  const [budgetCap, setBudgetCap] = useState(BUDGET_SUMMARY.monthlyCap);
  const [subscriptions, setSubscriptions] = useState([]);
  const [categoryCaps, setCategoryCaps] = useState(BUDGET_SUMMARY.categories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCap, setTempCap] = useState(String(BUDGET_SUMMARY.monthlyCap));

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        // Fetch budget settings
        try {
          const budgetRes = await api.get('/budget');
          if (budgetRes.data?.data) {
            setBudgetCap(budgetRes.data.data.monthlyCap || 320.0);
            setTempCap(String(budgetRes.data.data.monthlyCap || 320.0));
            if (budgetRes.data.data.categoryCaps?.length > 0) {
              setCategoryCaps(budgetRes.data.data.categoryCaps);
            }
          }
        } catch {
          // Fallback to local storage/mock for budget
          const localBudget = localStorage.getItem('subsense_budget_cap');
          if (localBudget) {
            setBudgetCap(Number(localBudget));
            setTempCap(localBudget);
          }
        }

        // Fetch subscriptions to calculate actual spend
        try {
          const subRes = await api.get('/subscriptions');
          if (subRes.data?.data && subRes.data.data.length > 0) {
            setSubscriptions(subRes.data.data);
          } else {
            setSubscriptions(getStoredSubscriptions());
          }
        } catch {
          setSubscriptions(getStoredSubscriptions());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  const activeSubs = useMemo(() => {
    return subscriptions.filter((s) => s.status !== 'Cancelled');
  }, [subscriptions]);

  // Compute live current spent normalized to monthly equivalent
  const currentSpent = useMemo(() => {
    return activeSubs.reduce((sum, s) => {
      let monthly = Number(s.price) || 0;
      if (s.billingCycle === 'Yearly') monthly = monthly / 12;
      if (s.billingCycle === 'Quarterly') monthly = monthly / 3;
      if (s.billingCycle === 'Weekly') monthly = monthly * 4.33;
      return sum + monthly;
    }, 0);
  }, [activeSubs]);

  const percentageUsed = Math.min(100, Math.round((currentSpent / (budgetCap || 1)) * 100));
  const remaining = Math.max(0, budgetCap - currentSpent);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const val = Number(tempCap);
    if (!isNaN(val) && val > 0) {
      setSaving(true);
      try {
        await api.put('/budget', { monthlyCap: val });
        setBudgetCap(val);
        localStorage.setItem('subsense_budget_cap', String(val));
      } catch {
        setBudgetCap(val);
        localStorage.setItem('subsense_budget_cap', String(val));
      } finally {
        setSaving(false);
        setIsModalOpen(false);
      }
    }
  };

  // Derive live category limits and actual spend
  const categoryLimits = useMemo(() => {
    const defaultCaps = {
      'Cloud Services': 80.0,
      Development: 70.0,
      Design: 50.0,
      Productivity: 50.0,
      Entertainment: 45.0,
      Communication: 35.0,
    };

    // Override with user category caps if present
    categoryCaps.forEach((c) => {
      if (c.category && c.cap) defaultCaps[c.category] = c.cap;
    });

    const spendMap = {};
    activeSubs.forEach((sub) => {
      const cat = sub.category || 'Other';
      let monthly = Number(sub.price) || 0;
      if (sub.billingCycle === 'Yearly') monthly = monthly / 12;
      if (sub.billingCycle === 'Quarterly') monthly = monthly / 3;
      if (sub.billingCycle === 'Weekly') monthly = monthly * 4.33;
      spendMap[cat] = (spendMap[cat] || 0) + monthly;
    });

    return Object.entries(defaultCaps).map(([category, cap]) => {
      const spent = spendMap[category] || 0;
      const pct = Math.min(100, Math.round((spent / (cap || 1)) * 100));
      return {
        category,
        current: `$${spent.toFixed(2)}`,
        cap: `$${Number(cap).toFixed(2)}`,
        pct,
      };
    });
  }, [activeSubs, categoryCaps]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            Budget Guardrails
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">Budget Management</h2>
          <p className="mt-1 text-sm text-slate-400">Set soft and hard spending limits to avoid recurring cost creep.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          Adjust Monthly Budget
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Budget Limit"
          value={`$${budgetCap.toFixed(2)}`}
          subtitle="Configured spending ceiling"
          color="cyan"
        />
        <StatCard
          title="Current Spent"
          value={`$${currentSpent.toFixed(2)}`}
          subtitle={`${percentageUsed}% consumed`}
          color={percentageUsed > 85 ? 'rose' : 'amber'}
        />
        <StatCard
          title="Remaining Allowance"
          value={`$${remaining.toFixed(2)}`}
          subtitle="Available for this month"
          color="emerald"
        />
        <StatCard
          title="Budget Status"
          value={percentageUsed > 85 ? 'Attention' : 'Healthy'}
          subtitle="Below safety threshold"
          color={percentageUsed > 85 ? 'amber' : 'emerald'}
          badge="80% Alert Active"
        />
      </div>

      {/* Main Budget Progress Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Monthly Burn Rate Progress</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time spend against your monthly cap</p>
          </div>
          <span className="text-lg font-bold text-cyan-400">{percentageUsed}%</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentageUsed > 90
                ? 'bg-rose-500 shadow-rose-500/50'
                : percentageUsed > 75
                ? 'bg-amber-500 shadow-amber-500/50'
                : 'bg-gradient-to-r from-cyan-500 to-teal-400'
            }`}
            style={{ width: `${percentageUsed}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-400">
          <span>$0.00</span>
          <span className="font-semibold text-white">Spent: ${currentSpent.toFixed(2)}</span>
          <span>Target: ${budgetCap.toFixed(2)}</span>
        </div>
      </div>

      {/* Category Limits Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-base font-bold text-white">Category Caps</h3>
        <p className="text-xs text-slate-400 mt-0.5">Spending limits segmented by domain</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categoryLimits.map((cat) => (
            <div key={cat.category} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{cat.category}</span>
                <span className="text-slate-400">
                  {cat.current} / <span className="text-slate-300 font-medium">{cat.cap}</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    cat.pct > 80 ? 'bg-amber-400' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Adjust Budget */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Monthly Budget"
        description="Set a target maximum recurring expense allowance per month."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveBudget} loading={saving}>
              Save Target
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <Input
            label="Monthly Limit (USD)"
            name="budgetCap"
            type="number"
            value={tempCap}
            onChange={(e) => setTempCap(e.target.value)}
            placeholder="200.00"
            required
            helperText="You will receive alerts when your spend reaches 80% and 100% of this limit."
          />
        </form>
      </Modal>
    </div>
  );
};

export default BudgetPage;
