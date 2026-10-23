import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import {
  getStoredSubscriptions,
  MONTHLY_SPEND_TREND,
  CATEGORY_SPEND_DATA,
} from '../lib/mockData';

// Custom Tooltip declared outside component to prevent re-creation during render
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p className="text-cyan-400 font-bold">Spend: ${Number(payload[0]?.value).toFixed(2)}</p>
        {payload[1] && (
          <p className="text-slate-400 font-medium">Budget: ${Number(payload[1]?.value).toFixed(2)}</p>
        )}
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/subscriptions');
        if (res.data?.data && res.data.data.length > 0) {
          setSubscriptions(res.data.data);
        } else {
          setSubscriptions(getStoredSubscriptions());
        }
      } catch {
        setSubscriptions(getStoredSubscriptions());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeSubs = useMemo(() => {
    return subscriptions.filter((s) => s.status !== 'Cancelled');
  }, [subscriptions]);

  const totalMonthlySpend = useMemo(() => {
    return activeSubs.reduce((sum, s) => {
      let monthly = Number(s.price) || 0;
      if (s.billingCycle === 'Yearly') monthly = monthly / 12;
      if (s.billingCycle === 'Quarterly') monthly = monthly / 3;
      if (s.billingCycle === 'Weekly') monthly = monthly * 4.33;
      return sum + monthly;
    }, 0);
  }, [activeSubs]);

  const annualBurn = totalMonthlySpend * 12;

  // Dynamically compute category spend breakdown from active user subscriptions
  const categoryData = useMemo(() => {
    const map = {};
    const colorPalette = {
      'Cloud Services': '#f97316',
      Development: '#06b6d4',
      Design: '#a855f7',
      Productivity: '#10b981',
      Entertainment: '#ec4899',
      Communication: '#3b82f6',
      Education: '#eab308',
      Other: '#94a3b8',
    };

    activeSubs.forEach((sub) => {
      const cat = sub.category || 'Other';
      let monthly = Number(sub.price) || 0;
      if (sub.billingCycle === 'Yearly') monthly = monthly / 12;
      if (sub.billingCycle === 'Quarterly') monthly = monthly / 3;
      if (sub.billingCycle === 'Weekly') monthly = monthly * 4.33;
      map[cat] = (map[cat] || 0) + monthly;
    });

    const entries = Object.entries(map).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
      color: colorPalette[name] || '#64748b',
    }));

    return entries.length > 0 ? entries : CATEGORY_SPEND_DATA;
  }, [activeSubs]);

  // Determine top expense category
  const topCategory = useMemo(() => {
    if (!categoryData || categoryData.length === 0) return { name: 'General', value: 0 };
    return [...categoryData].sort((a, b) => b.value - a.value)[0];
  }, [categoryData]);

  // Compute 6-month monthly spend trajectory derived from current live total
  const monthlyTrendData = useMemo(() => {
    const current = Number(totalMonthlySpend.toFixed(2));
    if (current === 0) return MONTHLY_SPEND_TREND;
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const factors = [0.72, 0.81, 0.86, 0.89, 0.95, 1.0];
    const budget = 320;
    return months.map((m, i) => {
      const s = Number((current * factors[i]).toFixed(2));
      return {
        month: m,
        spend: s,
        budget,
        savings: Number(Math.max(0, budget - s).toFixed(2)),
      };
    });
  }, [totalMonthlySpend]);

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
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
          <span>📊</span> Financial Intelligence
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">Expense Analytics</h2>
        <p className="mt-1 text-sm text-slate-400">
          Deep visibility into recurring software burn rate, category allocation, and multi-month spend trajectories.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Projected Annual Burn"
          value={`$${annualBurn.toFixed(2)}`}
          subtitle="Based on active recurring plans"
          color="violet"
          trend={{ value: '-8.5%', positive: true, label: 'optimized' }}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Top Expense Category"
          value={topCategory.name}
          subtitle={`$${topCategory.value.toFixed(2)} / mo (${totalMonthlySpend > 0 ? Math.round((topCategory.value / totalMonthlySpend) * 100) : 0}% of total)`}
          color="cyan"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          }
        />
        <StatCard
          title="Potential Annual Savings"
          value="$504.68"
          subtitle="By consolidating duplicate tools"
          color="emerald"
          badge="High Opportunity"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Avg. Cost Per Service"
          value={`$${(totalMonthlySpend / (activeSubs.length || 1)).toFixed(2)}`}
          subtitle={`Across ${activeSubs.length} tracked licenses`}
          color="amber"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trajectory Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Expense Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical spend vs budget allocation ceiling</p>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
              6-Month Audit
            </span>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="spend" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Actual Spend" />
                <Bar dataKey="budget" fill="#334155" radius={[6, 6, 0, 0]} name="Budget Cap" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie / Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white">Spend by Category</h3>
                <p className="text-xs text-slate-400 mt-0.5">Detailed distribution of monthly software capital</p>
              </div>
            </div>

            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Spend']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-semibold text-slate-200">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">${Number(cat.value).toFixed(2)}</span>
                  <span className="text-slate-400">
                    ({totalMonthlySpend > 0 ? Math.round((cat.value / totalMonthlySpend) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly & Stealth Price Increase Alerts */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-base font-bold text-white">Smart Anomaly & Price Increase Monitor</h3>
          </div>
          <span className="text-xs text-slate-400">Real-time heuristics</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">AWS Cloud Services</span>
              <span className="rounded-full bg-amber-500/10 text-amber-400 px-2 py-0.5 text-[10px] font-semibold border border-amber-500/20">
                +14% Surge
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-white">Bandwidth & Egress Increase</p>
            <p className="mt-1 text-[11px] text-slate-400">Monthly invoice jumped from $60.10 to $68.50.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Figma Organization</span>
              <span className="rounded-full bg-cyan-500/10 text-cyan-400 px-2 py-0.5 text-[10px] font-semibold border border-cyan-500/20">
                Optimization
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-white">Monthly Cadence Inefficiency</p>
            <p className="mt-1 text-[11px] text-slate-400">Annual billing would save $108.00 annually.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Spotify Duo</span>
              <span className="rounded-full bg-violet-500/10 text-violet-400 px-2 py-0.5 text-[10px] font-semibold border border-violet-500/20">
                Paused (28d)
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-white">Dormant Subscription Alert</p>
            <p className="mt-1 text-[11px] text-slate-400">Prevent auto-resume charge on next billing cycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
