import { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import { SMART_INSIGHTS, getStoredSubscriptions } from '../lib/mockData';

const InsightsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

  // Dynamically compute insights from active subscriptions
  const generatedInsights = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return SMART_INSIGHTS;

    const list = [];
    const paused = subscriptions.filter((s) => s.status === 'Paused');
    const monthlySubs = subscriptions.filter((s) => s.billingCycle === 'Monthly' && s.status === 'Active');

    // 1. Check for paused/dormant subscriptions
    paused.forEach((sub, idx) => {
      const annualWaste = (Number(sub.price) * 12).toFixed(2);
      list.push({
        id: `dormant-${sub._id || idx}`,
        type: 'dormant',
        tag: 'Dormant License Notice',
        title: `${sub.serviceName} Subscription is Currently Paused`,
        description: `This service has an inactive/paused status. Consider cancelling permanently if no longer needed to prevent automatic recharge upon resume.`,
        savingAmount: `$${annualWaste} / year`,
        impact: 'Medium',
        actionText: 'Review Status',
        service: sub.serviceName,
        category: sub.category,
      });
    });

    // 2. Check for category overlap/redundancy (e.g. 2+ tools in same category)
    const categoryCount = {};
    subscriptions.forEach((s) => {
      categoryCount[s.category] = (categoryCount[s.category] || []).concat(s.serviceName);
    });

    Object.entries(categoryCount).forEach(([cat, services]) => {
      if (services.length >= 2 && cat !== 'Other') {
        list.push({
          id: `redundancy-${cat}`,
          type: 'redundancy',
          tag: 'Potential Redundancy',
          title: `Overlapping ${cat} Software Stack (${services.length} Tools)`,
          description: `You have multiple licenses registered under ${cat}: ${services.slice(0, 3).join(', ')}. Consolidating to a single platform could eliminate redundant seat costs.`,
          savingAmount: `~$180.00 / year`,
          impact: 'High',
          actionText: 'Compare Tool Usage',
          service: services.join(' & '),
          category: cat,
        });
      }
    });

    // 3. Check for high-cost monthly subscriptions that would benefit from annual billing
    const topMonthly = monthlySubs.filter((s) => Number(s.price) >= 15);
    topMonthly.slice(0, 2).forEach((sub, idx) => {
      const annualSaving = (Number(sub.price) * 12 * 0.18).toFixed(2);
      list.push({
        id: `saving-${sub._id || idx}`,
        type: 'saving',
        tag: 'High Impact Saving',
        title: `Switch ${sub.serviceName} to Annual Billing`,
        description: `You are paying $${Number(sub.price).toFixed(2)}/mo on monthly cadence. Most enterprise SaaS vendors offer 15-20% discounts for annual commitments.`,
        savingAmount: `$${annualSaving} / year`,
        impact: 'High',
        actionText: 'Review Annual Plan',
        service: sub.serviceName,
        category: sub.category,
      });
    });

    return list.length > 0 ? list : SMART_INSIGHTS;
  }, [subscriptions]);

  const activeInsights = useMemo(() => {
    return generatedInsights.filter((item) => !dismissedIds.includes(item.id));
  }, [generatedInsights, dismissedIds]);

  // Calculate total identified savings
  const totalSavings = useMemo(() => {
    return activeInsights.reduce((sum, item) => {
      const match = item.savingAmount?.match(/[\d.]+/);
      const val = match ? parseFloat(match[0]) : 50;
      return sum + val;
    }, 0);
  }, [activeInsights]);

  const handleApply = (id) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds((prev) => [...prev, id]);
  };

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
            <span>✨</span> AI Analytics Engine
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">Smart Insights & Optimization</h2>
          <p className="mt-1 text-sm text-slate-400">
            Automated recommendations to eliminate ghost subscriptions, consolidate redundant tools, and cut SaaS waste.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Identified Annual Savings"
          value={`$${totalSavings.toFixed(2)}`}
          subtitle={`${activeInsights.length} actionable opportunities`}
          color="emerald"
          badge="High ROI"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Redundant Tool Overlaps"
          value="2 Services"
          subtitle="Collaboration & Project Mgmt"
          color="amber"
          badge="Action Recommended"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          title="Annual Plan Switch Gain"
          value="~18.5% Off"
          subtitle="Across 3 monthly licenses"
          color="cyan"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Optimization Health Score"
          value="86 / 100"
          subtitle="Strong cost management"
          color="violet"
          badge="Top 15%"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main Insights Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Actionable Recommendation Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recommended Actions</h3>
            <span className="text-xs text-slate-400">
              {appliedIds.length} of {activeInsights.length} reviewed
            </span>
          </div>

          {activeInsights.map((item) => {
            const isApplied = appliedIds.includes(item.id);

            const badgeStyles = {
              saving: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              redundancy: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              alert: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
              dormant: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
            }[item.type] || 'bg-slate-800 text-slate-300';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition-all duration-300 backdrop-blur-sm ${
                  isApplied
                    ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 shadow-xl'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badgeStyles}`}>
                        {item.tag}
                      </span>
                      <span className="text-xs text-slate-400">• {item.service}</span>
                      <span className="text-xs text-slate-500 font-medium">({item.category})</span>
                    </div>

                    <h4 className="mt-2 text-base font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-2xl">{item.description}</p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Est. Savings</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">{item.savingAmount}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
                  <span className="text-[11px] text-slate-400">
                    Priority Impact: <span className="font-semibold text-slate-200">{item.impact}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDismiss(item.id)}>
                      Dismiss
                    </Button>
                    <Button
                      variant={isApplied ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleApply(item.id)}
                    >
                      {isApplied ? '✓ Applied to Plan' : item.actionText}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {activeInsights.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <p className="text-sm font-semibold text-white">All insights addressed! 🎉</p>
              <p className="text-xs text-slate-400 mt-1">Your SaaS stack is fully optimized for maximum value.</p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Savings Simulator & Benchmark */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-base font-bold text-white">Savings Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">Project your annual savings with SubSense automation</p>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Annual Billing Conversions</span>
                  <span className="font-bold text-white">+$108.00/yr</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                  <span>Eliminate Paused Subscriptions</span>
                  <span className="font-bold text-white">+$179.88/yr</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                  <span>Tool Consolidation (Notion/GitHub)</span>
                  <span className="font-bold text-white">+$216.00/yr</span>
                </div>
                <div className="mt-3 border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">Total Projected ROI</span>
                  <span className="text-base font-bold text-emerald-400">$503.88 / yr</span>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4">
                <p className="text-xs font-semibold text-cyan-300">💡 College Review 1 Presentation Note</p>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  SubSense analyzes renewal frequencies and pricing tiers to calculate direct return on investment for
                  both individuals and organizations.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-base font-bold text-white">Peer Benchmark</h3>
            <p className="text-xs text-slate-400 mt-0.5">How your spending compares to similar developers</p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Software Spend vs Avg</span>
                  <span className="font-semibold text-emerald-400">14% Lower</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Tool Utilization Rate</span>
                  <span className="font-semibold text-cyan-400">89% Active</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
