import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Video, RefreshCw, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import DeadlineDisplay from '../../components/projects/DeadlineDisplay.jsx';
import { getEditorDashboard } from '../../services/dashboardService.js';

const EditorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getEditorDashboard();
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
    <DashboardLayout title="Editor Dashboard" subtitle="Manage your assigned projects">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Assigned Projects" value={data.stats.assignedProjects} accent="primary" />
        <StatCard icon={Video} label="Currently Editing" value={data.stats.currentlyEditing} accent="secondary" />
        <StatCard icon={RefreshCw} label="Awaiting Revisions" value={data.stats.awaitingRevisions} accent="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-text-primary">Assigned Projects</h2>
          {data.assignedProjectsList.length === 0 ? (
            <EmptyState title="No projects assigned yet" message="Check back soon — an admin will assign projects to you." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.assignedProjectsList.map((project) => (
                <ProjectCard key={project._id} project={project} basePath="/editor/projects" />
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
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-text-primary">
              <MessageSquare size={16} /> Recent Feedback
            </h2>
            {data.recentFeedback.length === 0 ? (
              <p className="text-sm text-text-muted">No feedback received yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.recentFeedback.map((f) => (
                  <div key={f._id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="text-sm font-medium text-text-primary">{f.project?.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{f.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/editor/projects" className="btn-secondary w-full justify-center">
            View all assigned projects
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditorDashboard;