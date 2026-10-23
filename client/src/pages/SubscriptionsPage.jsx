import { useState, useEffect } from 'react';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getStoredSubscriptions, setStoredSubscriptions } from '../lib/mockData';

const CATEGORIES = [
  'All',
  'Entertainment',
  'Productivity',
  'Design',
  'Development',
  'Cloud Services',
  'Education',
  'Communication',
  'Other',
];

const BILLING_CYCLES = ['Monthly', 'Yearly', 'Quarterly', 'Weekly'];

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    serviceName: '',
    category: 'Productivity',
    price: '',
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: '',
    status: 'Active',
    notes: '',
  });

  const formatDateForInput = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscriptions');
      if (res.data?.data && res.data.data.length > 0) {
        setSubscriptions(res.data.data);
      } else {
        setSubscriptions(getStoredSubscriptions());
      }
      setError('');
    } catch {
      // Fallback to local storage
      setSubscriptions(getStoredSubscriptions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      serviceName: '',
      category: 'Productivity',
      price: '',
      currency: 'USD',
      billingCycle: 'Monthly',
      renewalDate: '',
      status: 'Active',
      notes: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingId(sub._id);
    setFormData({
      serviceName: sub.serviceName || '',
      category: sub.category || 'Productivity',
      price: sub.price !== undefined ? String(sub.price) : '',
      currency: sub.currency || 'USD',
      billingCycle: sub.billingCycle || 'Monthly',
      renewalDate: formatDateForInput(sub.renewalDate),
      status: sub.status || 'Active',
      notes: sub.notes || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.serviceName.trim()) {
      setFormError('Service name is required');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Price must be greater than 0');
      return;
    }

    if (!formData.renewalDate) {
      setFormError('Renewal date is required');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/subscriptions/${editingId}`, {
          ...formData,
          price: Number(formData.price),
        });
      } else {
        await api.post('/subscriptions', {
          ...formData,
          price: Number(formData.price),
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      // Fallback: save to local prototype data
      if (editingId) {
        const updated = subscriptions.map((s) =>
          s._id === editingId
            ? { ...s, ...formData, price: Number(formData.price) }
            : s
        );
        setSubscriptions(updated);
        setStoredSubscriptions(updated);
      } else {
        const newSub = {
          _id: 'sub-' + Date.now(),
          ...formData,
          price: Number(formData.price),
        };
        const updated = [newSub, ...subscriptions];
        setSubscriptions(updated);
        setStoredSubscriptions(updated);
      }
      setIsModalOpen(false);
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/subscriptions/${id}`);
    } catch {
      // ignore backend error if in mock mode
    }
    const updated = subscriptions.filter((s) => s._id !== id);
    setSubscriptions(updated);
    setStoredSubscriptions(updated);
  };

  const handleToggleStatus = (id) => {
    const updated = subscriptions.map((s) => {
      if (s._id === id) {
        return {
          ...s,
          status: s.status === 'Active' ? 'Paused' : 'Active',
        };
      }
      return s;
    });
    setSubscriptions(updated);
    setStoredSubscriptions(updated);
  };

  const filtered = subscriptions.filter((sub) => {
    const matchesSearch = sub.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Subscriptions</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            View, track, and manage all your recurring software and entertainment licenses.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenAddModal}>
          + Add Subscription
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search service name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No matching subscriptions' : 'No subscriptions tracked yet'}
          description={
            search
              ? 'Try changing your search query or category filter.'
              : 'Add your active subscriptions to start tracking renewals and costs.'
          }
          actionButton={
            <Button variant="primary" size="md" onClick={handleOpenAddModal}>
              + Add Subscription
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sub) => (
            <div
              key={sub._id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-cyan-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700/60">
                    {sub.category}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {sub.serviceName}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    sub.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : sub.status === 'Paused'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {sub.status}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">${Number(sub.price).toFixed(2)}</span>
                <span className="text-xs text-slate-400">/ {sub.billingCycle?.toLowerCase()}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span>Renews: </span>
                  <span className="font-medium text-slate-300">
                    {sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(sub._id)}
                    title={sub.status === 'Active' ? 'Pause subscription' : 'Activate subscription'}
                    className="rounded px-2 py-1 text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    {sub.status === 'Active' ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(sub)}
                    title="Edit subscription"
                    className="rounded p-1 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(sub._id)}
                    title="Delete subscription"
                    className="rounded p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Subscription */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Subscription' : 'New Subscription'}
        description={
          editingId
            ? 'Update subscription details, billing terms, and renewal tracking.'
            : 'Add a recurring tool or service to your SubSense dashboard.'
        }
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit} loading={saving}>
              {editingId ? 'Update Subscription' : 'Save Subscription'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorMessage message={formError} onDismiss={() => setFormError('')} />}

          <Input
            label="Service Name"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleInputChange}
            placeholder="e.g. Netflix, GitHub Copilot, Figma"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price (USD)"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="14.99"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                {BILLING_CYCLES.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Renewal Date"
              name="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label="Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="e.g. 4K Family plan, shared with team"
          />
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;
