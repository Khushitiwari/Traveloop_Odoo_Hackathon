
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function BudgetPage() {
  const { id } = useParams();
  const [budget, setBudget] = useState({ transport: 0, accommodation: 0, activities: 0, meals: 0, misc: 0, totalBudget: 0, currency: 'USD' });

  useEffect(() => {
    api.get(`/trips/${id}/budget`).then(r => { if (r.data) setBudget(r.data); });
  }, [id]);

  const chartData = [
    { name: 'Transport', value: budget.transport },
    { name: 'Stay', value: budget.accommodation },
    { name: 'Activities', value: budget.activities },
    { name: 'Meals', value: budget.meals },
    { name: 'Misc', value: budget.misc },
  ];

  const spent = chartData.reduce((s, c) => s + c.value, 0);

  const save = () => api.put(`/trips/${id}/budget`, budget);

  return (
    <div>
      <h2>Budget Planner</h2>
      <p>Total Budget: {budget.totalBudget} {budget.currency} | Spent: {spent}</p>
      {spent > budget.totalBudget && <p style={{ color: 'red' }}>⚠ Over budget!</p>}
      {['transport', 'accommodation', 'activities', 'meals', 'misc'].map(cat => (
        <div key={cat}>
          <label>{cat}</label>
          <input type="number" value={budget[cat]}
            onChange={e => setBudget({ ...budget, [cat]: parseFloat(e.target.value) || 0 })} />
        </div>
      ))}
      <button onClick={save}>Save Budget</button>
      <PieChart width={400} height={300}>
        <Pie data={chartData} cx={200} cy={150} outerRadius={100} dataKey="value">
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip /><Legend />
      </PieChart>
    </div>
  );
}