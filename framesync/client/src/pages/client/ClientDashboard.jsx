import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Clock, Eye, CheckCircle, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import DeadlineDisplay from '../../components/projects/DeadlineDisplay.jsx';
import { getClientDashboard } from '../../services/dashboardService.js';
import { formatDateTime } from '../../utils/formatDate.js';

const ClientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getClientDashboard();
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

  if (loading) return <LoadingSpinner fullScreen label="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <DashboardLayout
      title="Client Dashboard"
      subtitle="Track your video editing projects at a glance"
      actions={
        <Link to="/client/projects/new" className="btn-primary">
          <PlusCircle size={16} /> New Project
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderKanban} label="Total Projects" value={data.stats.totalProjects} accent="primary" />
        <StatCard icon={Clock} label="Active Projects" value={data.stats.activeProjects} accent="secondary" />
        <StatCard icon={Eye} label="Waiting for Review" value={data.stats.waitingForReview} accent="warning" />
        <StatCard icon={CheckCircle} label="Completed" value={data.stats.completedProjects} accent="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-text-primary">Recent Projects</h2>
          {data.recentProjects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              message="Create your first video editing project to get started."
              action={
                <Link to="/client/projects/new" className="btn-primary">
                  <PlusCircle size={16} /> Create Project
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.recentProjects.map((project) => (
                <ProjectCard key={project._id} project={project} basePath="/client/projects" />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="card p-5">
            <h2 className="mb-3 text-base font-semibold text-text-primary">Upcoming Deadlines</h2>
            {data.upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-text-muted">No upcoming deadlines.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.upcomingDeadlines.map((project) => (
                  <div key={project._id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-text-primary">{project.title}</span>
                    <DeadlineDisplay deadline={project.deadline} status={project.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-base font-semibold text-text-primary">Recent Notifications</h2>
            {data.recentNotifications.length === 0 ? (
              <p className="text-sm text-text-muted">No notifications yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.recentNotifications.map((n) => (
                  <div key={n._id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="text-sm font-medium text-text-primary">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{n.message}</p>
                    <p className="mt-1 text-[11px] text-text-muted">{formatDateTime(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;