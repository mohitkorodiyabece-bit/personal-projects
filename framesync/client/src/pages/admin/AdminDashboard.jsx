import React, { useEffect, useState } from 'react';
import { Users, UserCog, Video, FolderKanban, Activity, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { getAdminDashboard } from '../../services/dashboardService.js';
import { formatDate } from '../../utils/formatDate.js';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform-wide overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={data.stats.totalUsers} accent="primary" />
        <StatCard icon={UserCog} label="Total Clients" value={data.stats.totalClients} accent="secondary" />
        <StatCard icon={Video} label="Total Editors" value={data.stats.totalEditors} accent="secondary" />
        <StatCard icon={FolderKanban} label="Total Projects" value={data.stats.totalProjects} accent="primary" />
        <StatCard icon={Activity} label="Active Projects" value={data.stats.activeProjects} accent="warning" />
        <StatCard icon={CheckCircle} label="Completed Projects" value={data.stats.completedProjects} accent="success" />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Projects by Status</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(data.projectsByStatus).map(([status, count]) => (
            <div
              key={status}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface-secondary px-3.5 py-2"
            >
              <StatusBadge status={status} />
              <span className="text-sm font-semibold text-text-primary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <h2 className="border-b border-border px-5 py-4 text-base font-semibold text-text-primary">
            Recent Users
          </h2>
          <div className="flex flex-col">
            {data.recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between border-b border-border px-5 py-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-text-primary">{u.name}</p>
                  <p className="text-xs text-text-muted">{u.email}</p>
                </div>
                <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium capitalize text-text-muted">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <h2 className="border-b border-border px-5 py-4 text-base font-semibold text-text-primary">
            Recent Projects
          </h2>
          <div className="flex flex-col">
            {data.recentProjects.map((p) => (
              <div key={p._id} className="flex items-center justify-between border-b border-border px-5 py-3 last:border-b-0">
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium text-text-primary">{p.title}</p>
                  <p className="text-xs text-text-muted">{formatDate(p.createdAt)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;