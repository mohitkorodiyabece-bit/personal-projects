import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterControls from '../../components/common/FilterControls.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import { getProjects } from '../../services/projectService.js';

const statusOptions = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'editing', label: 'Editing' },
  { value: 'preview_ready', label: 'Preview Ready' },
  { value: 'client_review', label: 'Client Review' },
  { value: 'revision_requested', label: 'Revision Requested' },
  { value: 'final_ready', label: 'Final Ready' },
  { value: 'completed', label: 'Completed' },
];

const AssignedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getProjects({ page, limit: 9, search, status });
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProjects(1), 300);
    return () => clearTimeout(timeout);
  }, [fetchProjects]);

  return (
    <DashboardLayout title="Assigned Projects" subtitle="Projects an admin has assigned to you">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
        <FilterControls options={statusOptions} value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchProjects(pagination.page)} />
      ) : projects.length === 0 ? (
        <EmptyState title="No assigned projects" message="You have no assigned projects matching these filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} basePath="/editor/projects" />
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchProjects} />
        </>
      )}
    </DashboardLayout>
  );
};

export default AssignedProjects;