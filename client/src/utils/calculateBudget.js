
const CATEGORY_KEYS = ['transport', 'accommodation', 'activities', 'meals', 'misc'];

/**
 * Total amount spent across all budget categories.
 */
export const calculateSpent = (budget = {}) =>
  CATEGORY_KEYS.reduce((sum, k) => sum + (Number(budget[k]) || 0), 0);

/**
 * Remaining budget (can be negative if over budget).
 */
export const calculateRemaining = (budget = {}) =>
  (Number(budget.totalBudget) || 0) - calculateSpent(budget);

/**
 * Percentage of budget spent (0-100+).
 */
export const calculateSpentPercent = (budget = {}) => {
  const total = Number(budget.totalBudget) || 0;
  if (total === 0) return 0;
  return Math.round((calculateSpent(budget) / total) * 100);
};

/**
 * Build chart-friendly array for Recharts PieChart.
 */
export const buildChartData = (budget = {}) => [
  { name: 'Transport', value: Number(budget.transport) || 0, color: '#6EE7B7' },
  { name: 'Stay', value: Number(budget.accommodation) || 0, color: '#F9A8D4' },
  { name: 'Activities', value: Number(budget.activities) || 0, color: '#FCD34D' },
  { name: 'Meals', value: Number(budget.meals) || 0, color: '#A5B4FC' },
  { name: 'Misc', value: Number(budget.misc) || 0, color: '#86EFAC' },
];

/**
 * Average cost per day given trip duration in days.
 */
export const avgCostPerDay = (budget = {}, durationDays = 1) => {
  const days = Math.max(1, durationDays);
  return Math.round(calculateSpent(budget) / days);
};

/**
 * Format a number as currency string.
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export default {
  calculateSpent,
  calculateRemaining,
  calculateSpentPercent,
  buildChartData,
  avgCostPerDay,
  formatCurrency,
};