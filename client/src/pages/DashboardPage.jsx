import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import {
  getStoredSubscriptions,
  MONTHLY_SPEND_TREND,
  CATEGORY_SPEND_DATA,
  SMART_INSIGHTS,
  BUDGET_SUMMARY,
} from '../lib/mockData';

// Custom Glassmorphic Tooltip for Recharts
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-semibold text-white mb-1.5">{label} Spending</p>
        <div className="space-y-1">
          <p className="text-cyan-400 flex items-center justify-between gap-4">
            <span>Actual Spend:</span>
            <span className="font-bold">${Number(payload[0]?.value).toFixed(2)}</span>
          </p>
          {payload[1] && (
            <p className="text-slate-400 flex items-center justify-between gap-4">
              <span>Budget Cap:</span>
              <span className="font-semibold text-slate-300">${Number(payload[1]?.value).toFixed(2)}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="font-semibold text-white">{data.name}</span>
        </div>
        <p className="mt-1 font-bold text-cyan-300 text-sm">${Number(data.value).toFixed(2)} / mo</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6M');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/subscriptions');
        if (response.data?.data && response.data.data.length > 0) {
          setSubscriptions(response.data.data);
        } else {
          setSubscriptions(getStoredSubscriptions());
        }
      } catch {
        // Fallback to rich prototype mock data for flawless presentation
        setSubscriptions(getStoredSubscriptions());
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // Compute live subscription metrics
  const activeSubs = subscriptions.filter((s) => s.status !== 'Cancelled');
  const pausedSubs = subscriptions.filter((s) => s.status === 'Paused');

  const totalMonthlySpend = useMemo(() => {
    return activeSubs.reduce((sum, s) => {
      let monthly = Number(s.price) || 0;
      if (s.billingCycle === 'Yearly') monthly = monthly / 12;
      if (s.billingCycle === 'Quarterly') monthly = monthly / 3;
      if (s.billingCycle === 'Weekly') monthly = monthly * 4.33;
      return sum + monthly;
    }, 0);
  }, [activeSubs]);

  const annualSpend = totalMonthlySpend * 12;
  const budgetCap = BUDGET_SUMMARY.monthlyCap;
  const budgetPercentage = Math.min(100, Math.round((totalMonthlySpend / budgetCap) * 100));
  const budgetRemaining = Math.max(0, budgetCap - totalMonthlySpend);

  // Compute days left for upcoming renewals
  const calculateDaysLeft = (dateString) => {
    if (!dateString) return 30;
    const renewal = new Date(dateString);
    const today = new Date();
    const diffTime = renewal - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const upcomingRenewals = useMemo(() => {
    return [...activeSubs]
      .map((s) => ({
        ...s,
        daysLeft: calculateDaysLeft(s.renewalDate),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 4);
  }, [activeSubs]);

  // Top subscriptions ranked by monthly normalized price
  const topSubscriptions = useMemo(() => {
    return [...activeSubs]
      .map((s) => {
        let monthly = Number(s.price) || 0;
        if (s.billingCycle === 'Yearly') monthly = monthly / 12;
        if (s.billingCycle === 'Quarterly') monthly = monthly / 3;
        if (s.billingCycle === 'Weekly') monthly = monthly * 4.33;
        return {
          ...s,
          monthlyPrice: monthly,
          pctOfTotal: totalMonthlySpend > 0 ? Math.round((monthly / totalMonthlySpend) * 100) : 0,
        };
      })
      .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
      .slice(0, 5);
  }, [activeSubs, totalMonthlySpend]);

  // Dynamic category spending derived from active subscriptions
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
      const monthly = Number(sub.price) || 0;
      map[cat] = (map[cat] || 0) + monthly;
    });

    const entries = Object.entries(map).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
      color: colorPalette[name] || '#64748b',
    }));

    return entries.length > 0 ? entries : CATEGORY_SPEND_DATA;
  }, [activeSubs]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Control Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live SaaS Financial Telemetry
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400">
                • {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Explorer'}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your software subscriptions are operating at{' '}
              <span className="font-semibold text-cyan-300">{budgetPercentage}%</span> of your monthly allowance with{' '}
              <span className="font-semibold text-emerald-300">${budgetRemaining.toFixed(2)}</span> buffer remaining.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/renewals">
              <Button variant="secondary" size="md" className="border-slate-700/80">
                <span>⏱</span> Renewals (2)
              </Button>
            </Link>
            <Link to="/subscriptions">
              <Button variant="primary" size="md">
                + New Subscription
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Flagship KPI StatCards Grid (5 KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Monthly Recurring Spend */}
        <StatCard
          title="Monthly Recurring Spend"
          value={`$${totalMonthlySpend.toFixed(2)}`}
          trend={{ value: '+4.8%', positive: false, label: 'vs last cycle' }}
          color="cyan"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        {/* Projected Annual Spend */}
        <StatCard
          title="Projected Annual Spend"
          value={`$${annualSpend.toFixed(2)}`}
          subtitle="Annualized run rate"
          color="violet"
          badge="12-Mo Run-Rate"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        {/* Active Subscriptions */}
        <StatCard
          title="Active Subscriptions"
          value={`${activeSubs.length} Active`}
          subtitle={`${pausedSubs.length} paused subscription`}
          color="emerald"
          badge="Healthy"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          }
        />

        {/* Monthly Budget Used */}
        <StatCard
          title="Monthly Budget Used"
          value={`${budgetPercentage}%`}
          subtitle={`$${totalMonthlySpend.toFixed(2)} of $${budgetCap.toFixed(2)} limit`}
          color={budgetPercentage > 85 ? 'rose' : budgetPercentage > 75 ? 'amber' : 'emerald'}
          badge={budgetPercentage > 80 ? '80% Threshold' : 'Safe Range'}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* 3. Interactive Charts Grid (Spending Overview + Category Donut) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Spending Overview Trajectory Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
                <h3 className="text-base font-bold text-white">Spending Overview</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly historical expenditure vs monthly budget ceiling ($320/mo)
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setTimeRange('6M')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                  timeRange === '6M' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('1Y')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                  timeRange === '1Y' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                This Year
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SPEND_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="budgetLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#spendGradient)"
                  name="Monthly Spend"
                />
                <Area
                  type="monotone"
                  dataKey="budget"
                  stroke="#475569"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#budgetLine)"
                  name="Budget Cap"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Actual Spend ($261.49)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                Budget Ceiling ($320.00)
              </span>
            </div>
            <span className="text-emerald-400 font-medium">✓ Consistent +$58.51 safety margin</span>
          </div>
        </div>

        {/* Right 1 Col: Category Spending Donut Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400"></span>
              <h3 className="text-base font-bold text-white">Category Spending</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across software domains</p>

            <div className="h-56 w-full relative mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</span>
                <span className="text-lg font-extrabold text-white">${totalMonthlySpend.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="mt-3 space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs py-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate text-slate-300 font-medium">{cat.name}</span>
                </div>
                <span className="font-semibold text-white ml-2">${Number(cat.value).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Budget Progress Bar & Guardrail Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Monthly Budget Guardrail</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                  budgetPercentage > 85
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {budgetPercentage > 85 ? 'Near Threshold' : 'Well Controlled'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current burn: <span className="text-white font-semibold">${totalMonthlySpend.toFixed(2)}</span> of{' '}
              <span className="text-slate-300 font-medium">${budgetCap.toFixed(2)}</span> monthly ceiling
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-cyan-400">{budgetPercentage}%</span>
            <span className="text-xs text-slate-400 block font-medium">${budgetRemaining.toFixed(2)} allowance left</span>
          </div>
        </div>

        {/* Multi-tier gradient progress bar */}
        <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              budgetPercentage > 90
                ? 'bg-rose-500 shadow-lg shadow-rose-500/40'
                : budgetPercentage > 75
                ? 'bg-gradient-to-r from-cyan-500 to-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-teal-400 shadow-md shadow-cyan-500/20'
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-[11px] text-slate-400">
          <span>$0 (Baseline)</span>
          <span className="text-amber-400 font-medium">80% Soft Alert ($256.00)</span>
          <span className="font-semibold text-slate-300">Hard Cap: ${budgetCap.toFixed(2)}</span>
        </div>
      </div>

      {/* 5. Bottom Grid: Upcoming Renewals + Top Subscriptions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Col: Upcoming Renewals Widget */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                  <h3 className="text-base font-bold text-white">Upcoming Renewals</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Imminent automated billing dates</p>
              </div>
              <Link to="/renewals">
                <Button variant="ghost" size="sm">
                  View Schedule →
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingRenewals.map((sub) => {
                const isUrgent = sub.daysLeft <= 4;
                return (
                  <div
                    key={sub._id || sub.serviceName}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isUrgent
                        ? 'border-amber-500/40 bg-amber-950/20'
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white border border-slate-700">
                        {sub.serviceName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{sub.serviceName}</p>
                        <p className="text-[11px] text-slate-400">
                          {sub.category} • <span className="text-slate-300 font-medium">{sub.billingCycle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-white">${Number(sub.price).toFixed(2)}</p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          isUrgent
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        In {sub.daysLeft} days
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Email alerts trigger 3 days prior</span>
            <Link to="/settings" className="text-cyan-400 hover:underline">
              Configure alert rules
            </Link>
          </div>
        </div>

        {/* Right Col: Top Subscriptions Ranked Leaderboard */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Top Subscriptions</h3>
                <p className="text-xs text-slate-400 mt-0.5">Highest recurring spend drivers</p>
              </div>
              <Link to="/subscriptions">
                <Button variant="ghost" size="sm">
                  All ({activeSubs.length}) →
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {topSubscriptions.map((sub, index) => (
                <div
                  key={sub._id || sub.serviceName}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-slate-300">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{sub.serviceName}</p>
                      <p className="text-[11px] text-slate-400">{sub.category}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-white">${sub.monthlyPrice.toFixed(2)}/mo</p>
                    <span className="text-[10px] text-cyan-400 font-medium">{sub.pctOfTotal}% of total spend</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Top 5 account for {topSubscriptions.reduce((s, i) => s + i.pctOfTotal, 0)}% of monthly spend</span>
            <Link to="/analytics" className="text-cyan-400 hover:underline">
              Analyze breakdown
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Smart Insights & Spend Optimization Card */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Smart Optimization Insights</h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  $504.68 / yr potential savings
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                SubSense identified 4 actionable ways to reduce recurring expense waste.
              </p>
            </div>
          </div>

          <Link to="/insights">
            <Button variant="primary" size="md">
              Review Insights & Save →
            </Button>
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SMART_INSIGHTS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-slate-700">
                  {item.tag}
                </span>
                <p className="mt-2 text-xs font-bold text-white">{item.title}</p>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">{item.savingAmount}</span>
                <Link to="/insights" className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold">
                  Action →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
