import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
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
  { value: 'created', label: 'Created' },
  { value: 'files_submitted', label: 'Files Submitted' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'editing', label: 'Editing' },
  { value: 'preview_ready', label: 'Preview Ready' },
  { value: 'client_review', label: 'Client Review' },
  { value: 'revision_requested', label: 'Revision Requested' },
  { value: 'final_ready', label: 'Final Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const MyProjects = () => {
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
    <DashboardLayout
      title="My Projects"
      subtitle="All your video editing projects in one place"
      actions={
        <Link to="/client/projects/new" className="btn-primary">
          <PlusCircle size={16} /> New Project
        </Link>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
        <FilterControls options={statusOptions} value={status} onChange={setStatus} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchProjects(pagination.page)} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          message="Try adjusting your filters, or create a new project."
          action={
            <Link to="/client/projects/new" className="btn-primary">
              <PlusCircle size={16} /> Create Project
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} basePath="/client/projects" />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchProjects}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default MyProjects;