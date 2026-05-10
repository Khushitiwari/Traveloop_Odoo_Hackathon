import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
    ]).then(([sRes, uRes]) => {
      setStats(sRes.data);
      setUsers(uRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chartData = stats?.topCities?.map(c => ({
    name: c.name,
    stops: c._count?.stops || 0,
  })) || [];

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Monitor platform usage and user activity.</p>
            </div>
            <span className="badge bg-blush-100 text-blush-700 text-xs">Admin Only</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-cream-200 pb-3">
            {['stats', 'users'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-mint-500 text-white' : 'text-cream-500 hover:bg-cream-100'}`}>
                {tab === 'stats' ? '📊 Statistics' : '👥 Users'}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : activeTab === 'stats' ? (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Users', value: stats?.userCount || 0, icon: '👥', color: 'border-mint-300 bg-mint-50' },
                  { label: 'Total Trips', value: stats?.tripCount || 0, icon: '🗺️', color: 'border-amber-300 bg-amber-50' },
                  { label: 'Top Cities', value: stats?.topCities?.length || 0, icon: '🏙️', color: 'border-blush-300 bg-blush-50' },
                  { label: 'Avg Trips/User', value: stats?.userCount ? (stats.tripCount / stats.userCount).toFixed(1) : 0, icon: '📈', color: 'border-purple-300 bg-purple-50' },
                ].map(stat => (
                  <div key={stat.label} className={`rounded-2xl border p-5 ${stat.color}`}>
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-display font-semibold text-mint-900">{stat.value}</div>
                    <div className="text-xs text-cream-500 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="section-heading">Top Cities by Stop Count</h2>
                {chartData.length === 0 ? (
                  <div className="text-center py-8 text-cream-400">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No data yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eee8" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a49a89' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#a49a89' }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4dfd5', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} />
                      <Bar dataKey="stops" fill="#56afa1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          ) : (
            /* Users table */
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between">
                <h2 className="section-heading mb-0">All Users ({users.length})</h2>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream-50 border-b border-cream-200">
                      <th className="text-left px-6 py-3 text-cream-500 font-medium text-xs uppercase tracking-wider">User</th>
                      <th className="text-left px-4 py-3 text-cream-500 font-medium text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left px-4 py-3 text-cream-500 font-medium text-xs uppercase tracking-wider">Role</th>
                      <th className="text-left px-4 py-3 text-cream-500 font-medium text-xs uppercase tracking-wider">Trips</th>
                      <th className="text-left px-4 py-3 text-cream-500 font-medium text-xs uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-cream-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-semibold text-xs flex-shrink-0">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-cream-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-cream-500">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${user.role === 'ADMIN' ? 'bg-blush-100 text-blush-700' : 'bg-cream-100 text-cream-600'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-cream-600">{user._count?.trips || 0}</td>
                        <td className="px-4 py-3 text-cream-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-cream-400">No users found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}