import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetChart({ chartData = [], colorsByName = {}, currency = 'USD' }) {
  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-cream-400">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm">Enter budget amounts to see the chart</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" paddingAngle={3}>
          {chartData.map((entry, i) => (
            <Cell key={`${entry.name}-${i}`} fill={colorsByName[entry.name] || '#ccc'} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => [`${currency} ${val}`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
