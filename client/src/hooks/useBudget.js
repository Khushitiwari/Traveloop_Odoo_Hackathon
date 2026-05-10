
import { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../api/budget.api';
import toast from 'react-hot-toast';

const DEFAULT_BUDGET = {
  totalBudget: 0,
  transport: 0,
  accommodation: 0,
  activities: 0,
  meals: 0,
  misc: 0,
  currency: 'USD',
};

export const useBudget = (tripId) => {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBudget = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await budgetApi.get(tripId);
      if (res.data) setBudget(res.data);
    } catch {
      // no budget yet — use defaults
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const saveBudget = async () => {
    setSaving(true);
    try {
      const res = await budgetApi.upsert(tripId, budget);
      setBudget(res.data);
      toast.success('Budget saved!');
    } catch {
      toast.error('Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) =>
    setBudget((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));

  const spent = ['transport', 'accommodation', 'activities', 'meals', 'misc'].reduce(
    (sum, k) => sum + (budget[k] || 0),
    0
  );

  const remaining = budget.totalBudget - spent;
  const isOverBudget = spent > budget.totalBudget && budget.totalBudget > 0;
  const spentPercent = budget.totalBudget > 0 ? Math.round((spent / budget.totalBudget) * 100) : 0;

  return { budget, setBudget, loading, saving, saveBudget, updateField, spent, remaining, isOverBudget, spentPercent };
};

export default useBudget;