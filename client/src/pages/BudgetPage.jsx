import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import toast from 'react-hot-toast';
import BudgetChart from '../components/budget/BudgetChart';
import CostRow from '../components/budget/CostRow';

const CATEGORIES = [
  { key: 'transport', label: 'Transport', icon: '✈️', color: '#56afa1' },
  { key: 'accommodation', label: 'Stay', icon: '🏨', color: '#df7a7c' },
  { key: 'activities', label: 'Activities', icon: '🎯', color: '#f59e0b' },
  { key: 'meals', label: 'Meals', icon: '🍽️', color: '#8b5cf6' },
  { key: 'misc', label: 'Misc', icon: '📦', color: '#6b7280' },
];

export default function BudgetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState({ transport: 0, accommodation: 0, activities: 0, meals: 0, misc: 0, totalBudget: 0, currency: 'USD' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/trips/${id}/budget`)
      .then(r => { if (r.data) setBudget(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const chartData = CATEGORIES.map(c => ({ name: c.label, value: budget[c.key] || 0 })).filter(d => d.value > 0);
  const spent = CATEGORIES.reduce((s, c) => s + (budget[c.key] || 0), 0);
  const remaining = budget.totalBudget - spent;
  const overBudget = spent > budget.totalBudget && budget.totalBudget > 0;
  const pct = budget.totalBudget > 0 ? Math.min(100, (spent / budget.totalBudget) * 100) : 0;

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/trips/${id}/budget`, budget);
      toast.success('Budget saved!');
    } catch {
      toast.error('Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          <button onClick={() => navigate(`/trips/${id}/builder`)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-4 flex items-center gap-1.5">
            ← Back to Builder
          </button>
          <div className="mb-8">
            <h1 className="page-title">Budget Planner</h1>
            <p className="page-subtitle">Track and manage your trip expenses.</p>
          </div>

          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-card p-5 border-l-4 border-mint-400">
              <p className="text-cream-500 text-sm mb-1">Total Budget</p>
              <p className="text-2xl font-display font-semibold text-mint-800">{budget.currency} {budget.totalBudget.toLocaleString()}</p>
            </div>
            <div className={`bg-white rounded-2xl shadow-card p-5 border-l-4 ${overBudget ? 'border-blush-400' : 'border-amber-400'}`}>
              <p className="text-cream-500 text-sm mb-1">Spent</p>
              <p className={`text-2xl font-display font-semibold ${overBudget ? 'text-blush-600' : 'text-amber-700'}`}>
                {budget.currency} {spent.toLocaleString()}
              </p>
              {overBudget && <p className="text-blush-500 text-xs font-medium mt-1">⚠ Over budget by {(spent - budget.totalBudget).toFixed(0)}</p>}
            </div>
            <div className="bg-white rounded-2xl shadow-card p-5 border-l-4 border-cream-300">
              <p className="text-cream-500 text-sm mb-1">Remaining</p>
              <p className={`text-2xl font-display font-semibold ${remaining >= 0 ? 'text-mint-700' : 'text-blush-600'}`}>
                {budget.currency} {Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {budget.totalBudget > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-5 mb-8">
              <div className="flex justify-between text-sm font-medium text-cream-600 mb-2">
                <span>Budget Used</span>
                <span className={overBudget ? 'text-blush-500' : 'text-mint-600'}>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-blush-400' : pct > 80 ? 'bg-amber-400' : 'bg-mint-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input form */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="section-heading">Set Budget</h2>
              <div className="space-y-4">
                <div>
                  <label className="label flex items-center gap-2">💳 Total Budget</label>
                  <div className="flex gap-2">
                    <select className="input-field w-24" value={budget.currency} onChange={e => setBudget({ ...budget, currency: e.target.value })}>
                      {['USD', 'EUR', 'GBP', 'INR', 'JPY'].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input type="number" className="input-field flex-1" placeholder="0"
                      value={budget.totalBudget || ''} onChange={e => setBudget({ ...budget, totalBudget: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="border-t border-cream-100 pt-4">
                  <p className="text-sm font-medium text-cream-600 mb-3">Breakdown</p>
                  {CATEGORIES.map(cat => (
                    <div key={cat.key} className="flex items-center gap-3 mb-3">
                      <span className="text-lg w-7">{cat.icon}</span>
                      <label className="text-sm font-medium text-cream-700 w-28">{cat.label}</label>
                      <input type="number" className="input-field flex-1 py-2" placeholder="0"
                        value={budget[cat.key] || ''}
                        onChange={e => setBudget({ ...budget, [cat.key]: parseFloat(e.target.value) || 0 })} />
                    </div>
                  ))}
                </div>
                <button onClick={save} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  Save Budget
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="section-heading">Breakdown Chart</h2>
              <BudgetChart
                chartData={chartData}
                currency={budget.currency}
                colorsByName={Object.fromEntries(CATEGORIES.map((c) => [c.label, c.color]))}
              />
              {spent > 0 && (
                <div className="border-t border-cream-100 pt-4 mt-4 space-y-2">
                  {CATEGORIES.filter(c => budget[c.key] > 0).map(cat => (
                    <CostRow
                      key={cat.key}
                      icon={cat.icon}
                      label={cat.label}
                      value={budget[cat.key]}
                      currency={budget.currency}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}