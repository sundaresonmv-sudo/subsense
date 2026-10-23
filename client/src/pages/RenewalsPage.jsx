import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../lib/api';
import { getStoredSubscriptions } from '../lib/mockData';

const RenewalsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', '7days', '30days'
  const [search, setSearch] = useState('');
  const [notifiedId, setNotifiedId] = useState(null);

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

  const calculateDaysLeft = (dateString) => {
    if (!dateString) return 30;
    const renewal = new Date(dateString);
    const today = new Date();
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Enrich with days left
  const enrichedSubs = subscriptions
    .filter((s) => s.status !== 'Cancelled')
    .map((s) => ({
      ...s,
      daysLeft: calculateDaysLeft(s.renewalDate),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const dueIn7Days = enrichedSubs.filter((s) => s.daysLeft >= 0 && s.daysLeft <= 7);
  const dueIn30Days = enrichedSubs.filter((s) => s.daysLeft >= 0 && s.daysLeft <= 30);
  const cost7Days = dueIn7Days.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const cost30Days = dueIn30Days.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const filteredList = enrichedSubs.filter((sub) => {
    const matchesSearch = sub.serviceName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === '7days') return sub.daysLeft <= 7 && sub.daysLeft >= 0;
    if (filter === '30days') return sub.daysLeft <= 30 && sub.daysLeft >= 0;
    return true;
  });

  const handleSimulateAlert = (id) => {
    setNotifiedId(id);
    setTimeout(() => setNotifiedId(null), 3000);
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <span>📅</span> Renewal Intelligence
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">Upcoming Renewals</h2>
          <p className="mt-1 text-sm text-slate-400">
            Track renewal countdowns, prevent unwanted auto-charges, and audit service billing cycles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/subscriptions">
            <Button variant="primary" size="md">
              + Add Subscription
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Due in Next 7 Days"
          value={`$${cost7Days.toFixed(2)}`}
          subtitle={`${dueIn7Days.length} services renewing soon`}
          color="amber"
          badge="Action Required"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Due This Month"
          value={`$${cost30Days.toFixed(2)}`}
          subtitle={`${dueIn30Days.length} subscriptions total`}
          color="cyan"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Auto-Renew Protection"
          value="Protected"
          subtitle="Email reminders set 3 days prior"
          color="emerald"
          badge="Active Guard"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          title="Next Imminent Bill"
          value={enrichedSubs[0]?.serviceName ? enrichedSubs[0].serviceName.split(' ')[0] : 'None'}
          subtitle={enrichedSubs[0] ? `Due in ${enrichedSubs[0].daysLeft} days ($${Number(enrichedSubs[0].price).toFixed(2)})` : 'All clear'}
          color="rose"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Upcoming ({enrichedSubs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('7days')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === '7days'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Next 7 Days ({dueIn7Days.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('30days')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === '30days'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Next 30 Days ({dueIn30Days.length})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search renewal by service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Renewals Timeline List */}
      <div className="space-y-4">
        {filteredList.map((sub) => {
          const isUrgent = sub.daysLeft <= 5;
          const isSoon = sub.daysLeft > 5 && sub.daysLeft <= 14;

          return (
            <div
              key={sub._id || sub.serviceName}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
                isUrgent
                  ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-sm border ${
                    isUrgent
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : isSoon
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {sub.serviceName.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-base">{sub.serviceName}</h3>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700/60">
                      {sub.category}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700/60">
                      {sub.billingCycle}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Next cycle date:{' '}
                    <span className="text-slate-200 font-medium">
                      {sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Next month'}
                    </span>
                    {sub.notes && <span className="ml-2 italic text-slate-500">({sub.notes})</span>}
                  </p>
                </div>
              </div>

              {/* Right Side: Urgency badge, Price, Action */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">${Number(sub.price).toFixed(2)}</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                      isUrgent
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : isSoon
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span>⏱</span> {sub.daysLeft <= 0 ? 'Due Today' : `In ${sub.daysLeft} days`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSimulateAlert(sub._id || sub.serviceName, sub.serviceName)}
                  >
                    {notifiedId === (sub._id || sub.serviceName) ? '✓ Alert Sent' : '🔔 Remind Me'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
            <p className="text-sm font-semibold text-slate-300">No renewals found for this filter</p>
            <p className="text-xs text-slate-500 mt-1">Try changing your search term or view all upcoming renewals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalsPage;
